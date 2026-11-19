import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import authStorage from '../../utils/authStorage';

const AdminPost = () => {
    const role = authStorage.getRole();
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    const [error, setError] = useState('')
    // get Data form backend
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get('/api/admin/post')
                setPosts(response.data);
                setError('')
            } catch (err) {
                console.error("Fetch error:", err);
                setError(err.response?.data?.message || "တစ်ခုခုမှားယွင်းနေပါသည်။ ထပ်မံကြိုးစားကြည့်ပါ။");
            } finally {
                setLoading(false)
            }
        }
        fetchPost();
    }, []);
    // Delete post
    const handleDelete = async (id) => {
        const confirmed = window.confirm('ဒီpost ကိုဖျက်ရန်သေချာပါသလား?');
        if (!confirmed) return;
        try {
            await api.post(`/api/admin/post/delete/${id}`)
            setPosts(prev => prev.filter(post => post.id !== id));
            toast.success('Post ကိုဖျက်သိမ်းပြီးပါပြီ။', { duration: 4000 });
        } catch (err) {
            console.error('Delete error:', err);
            if (err.response?.status === 404) {
                toast.error('Post ကိုမတွေ့ပါရှိပါ။', { duration: 4000 })
            } else if (err.response?.status === 403) {
                toast.error(err.response.data.message, { duration: 4000 });
            } else {
                toast.error('ဖျက်လို့မရပါ။ ထပ်မံကြိုးစားကြည့်ပါ။', { duration: 4000 });
            }
        }

    }
    return (
        <div className="content-card mb-5 bg-white p-4 shadow-sm rounded">
            <div className="d-flex justify-content-between mb-4">
                <h5 className="fw-bold">Your Recent Articles</h5>
                <Link className="btn btn-primary btn-sm" to="/admin/create-post">+ New Post</Link>
            </div>
            <div className="table-responsive">
                <table className="table align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className='text-center'>Loading...</td></tr>
                        ) : error ? (
                            <tr><td colSpan="5" className='text-center text-danger'>{error}</td></tr>
                        ) : Array.isArray(posts) && posts.length > 0 ? (
                            posts.map(post => (
                                <tr key={post.id}>
                                    <td className="fw-bold">{post.title}</td>
                                    <td><span className="badge bg-success">{post.category.name}</span></td>
                                    <td><span className={`badge ${post.status === 'public' ? 'bg-success' : 'bg-warning text-dark'}`}>{post.status}</span></td>
                                    <td>{new Date(post.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <button onClick={() => { navigate(`/admin/post/edit/${post.id}`) }} className="btn btn-sm btn-outline-secondary me-1"><i className="bi bi-pencil"></i></button>
                                        <button onClick={() => handleDelete(post.id)} className="btn btn-sm btn-outline-danger"><i className="bi bi-trash"></i></button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className='text-center'>အချက်အလက်များ မရှိသေးပါ။</td></tr>
                        )}

                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default AdminPost;
