import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, Navigate, useNavigate } from 'react-router-dom';

const AdminPost = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    // get Data form backend
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get('/api/admin/post', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                setPosts(response.data);
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false)
            }
        }
        fetchPost();
    }, []);
    // Delete post
    const handleDelete = (id) => {
        if (window.confirm('ဒီpost ကိုဖျက်ရန်သေချာပါသလား?')) {
            try {
                const response = axios.post(`/api/admin/post/delete/${id}`, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                setPosts(posts.filter(post => post.id !== id));
                toast.success('Post ကိုဖျက်သိမ်းပြီးပါပြီ။', { duration: 4000 });
            } catch (err) {
                console.error('Delete error:', err);
                if (err.response.status === 404) {
                    toast.error('Post ကိုမတွေ့ပါရှိပါ။', { duration: 4000 })
                } else {
                    toast.error('ဖျက်လို့မရပါ။ ထပ်မံကြိုးစားကြည့်ပါ။', { duration: 4000 });
                }
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
                        ) : Array.isArray(posts) && posts.length > 0 ? (
                            posts?.map(post => (
                                <tr key={post.id}>
                                    <td className="fw-bold">{post.title}</td>
                                    <td><span className="badge bg-success">{post.category.name}</span></td>
                                    <td><span className={`badge ${post.status === 'public' ? 'bg-success' : 'bg-warning text-dark'}`}>{post.status}</span></td>
                                    <td>{new Date(post.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <button onClick={() => { navigate(`/admin/post/edit/${post.id}`) }} className="btn btn-sm btn-outline-secondary me-1"><i className="bi bi-pencil"></i></button>
                                        {role === 'admin' && (<button onClick={() => handleDelete(post.id)} className="btn btn-sm btn-outline-danger"><i className="bi bi-trash"></i></button>)}
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
