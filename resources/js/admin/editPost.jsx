import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [categories, setCategories] = useState([]);
    const [image, setImage] = useState(null);
    const [validationError, setValidationError] = useState({})
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        categoryId: '',
        thumbnail: null,
        content: '',
        status: 'draft'
    })
    // ၁။ Category တွေနဲ့ ရှိပြီးသား Post Data ကို ဆွဲထုတ်ခြင်း
    useEffect(() => {
        const fetchData = async () => {
            try {
                const category = await api.get('/api/admin/category', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                setCategories(category.data);

                const editData = await api.get(`/api/admin/post/edit/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                const post = editData.data;
                setFormData({
                    title: post.title,
                    slug: post.slug,
                    categoryId: post.category_id,
                    content: post.body,
                    status: post.status,
                    thumbnail: null
                });
                if (post.thumbnail) {
                    setImage(`http://localhost:8000/storage/post/${post.thumbnail}`)
                }
            } catch (err) {
                toast.error('Data ယူလို့မရပါ။');
            }
        }
        fetchData();
    }, [id]);
    // Image
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, thumbnail: file });
            setImage(URL.createObjectURL(file));
        }
    }
    // Update Post
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.title) {
            newErrors.title = "Title field is required";
        }
        if (!formData.content) {
            newErrors.content = "Content text is required";
        }
        if (!formData.categoryId) {
            newErrors.categoryId = "Category is required";
        }
        setValidationError(newErrors);
        const data = new FormData();
        data.append('title', formData.title)
        data.append('slug', formData.slug)
        data.append('categoryId', formData.categoryId)
        data.append('content', formData.content)
        data.append('status', formData.status)
        if (formData.thumbnail) {
            data.append('thumbnail', formData.thumbnail)
        }
        if (Object.keys(newErrors).length === 0) {
            try {
                await api.post(`/api/admin/post/update/${id}`, data, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                toast.success('Post ကို ပြင်ဆင်ပြီးပါပြီ။');
                navigate('/admin/post', { replace: true });
            } catch (err) {
                console.error('Post Update err:', err);

                if (err.response.status === 422) {
                    setValidationError(err.response.data.errors);
                } else if (err.response && err.response.data && err.response.data.message) {
                    toast.error("တစ်ခုခု မှားယွင်းနေပါသည်။", { duration: 4000 });
                } else {
                    toast.error('မအောင်မြင်ပါ။ ထပ်မံကြိုးစားကြည့်ပါ။')
                }
            }
        }
    }
    return (
        <div className="content-card bg-white p-4 shadow-sm rounded">
            <h5 className="fw-bold mb-4">Create New Article</h5>
            <form onSubmit={handleUpdateSubmit}>
                <div className="row">
                    {/* ဘယ်ဘက်ခြမ်း - Title နဲ့ Content */}
                    <div className="col-md-8">
                        <div className="mb-3">
                            <label className="form-label small fw-bold">POST TITLE</label>
                            <input
                                type="text"
                                className={`form-control ${validationError.title ? 'is-invalid' : ''}`}
                                name="title"
                                value={formData.title || ''}
                                onChange={(e) => { setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') }) }}
                                placeholder="Enter title here..." />
                            {/* Error Message */}
                            {validationError.title && (
                                <div className="text-danger">{validationError.title}</div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label className="form-label small fw-bold">CONTENT</label>
                            <div className="editor-toolbar border p-2 bg-light rounded-top">
                                <button type="button" className="btn btn-sm btn-light border me-1">B</button>
                                <button type="button" className="btn btn-sm btn-light border me-1">I</button>
                                <button type="button" className="btn btn-sm btn-light border"><i className="bi bi-image"></i></button>
                            </div>
                            <textarea
                                className={`form-control rounded-0 rounded-bottom shadow-none ${validationError.content ? 'is-invalid' : ''}`}
                                name="content"
                                value={formData.content || ''}
                                onChange={(e) => { setFormData({ ...formData, content: e.target.value }) }}
                                rows="12" style={{ borderTop: 'none' }}
                                placeholder="Write your story..."></textarea>
                            {/* Validation Error */}
                            {validationError.content && (
                                <div className="text-danger">{validationError.content}</div>
                            )}
                        </div>
                    </div>

                    {/* ညာဘက်ခြမ်း - Category နဲ့ Image Upload */}
                    <div className="col-md-4">
                        {/* Category Select */}
                        <div className="mb-3">
                            <label className="form-label small fw-bold">CATEGORY</label>
                            <select className={`form-select ${validationError.categoryId ? 'is-invalid' : ''}`}
                                value={formData.categoryId || ''} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}>
                                <option value=''>Select Option</option>
                                {Array.isArray(categories) && categories?.map(category => (<option key={category.id} value={category.id}>{category.name}</option>))}
                            </select>
                            {validationError.categoryId && (
                                <div className="text-danger">{validationError.categoryId}</div>
                            )}
                        </div>
                        {/* Status Select */}
                        <div className="mb-3">
                            <label className="form-label small fw-bold">STATUS</label>
                            <select className="form-select" value={formData.status || ''} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                                <option value="draft">Draft</option>
                                <option value="public">Public</option>
                            </select>
                        </div>
                        {/* Thumbnail */}
                        <div className="mb-4">
                            <label className="form-label small fw-bold">THUMBNAIL</label>
                            <div className="p-4 border border-dashed text-center bg-light rounded-3"
                                onClick={() => document.getElementById('thumbUpload').click()} style={{ cursor: 'pointer', borderStyle: 'dashed' }}>
                                {image ? (
                                    <img src={image} className="img-fluid rounded" alt="Post image" />
                                ) : (
                                    <>
                                        <i className="bi bi-upload fs-2 text-muted"></i>
                                        <p className="small text-muted mt-2">No Image</p>
                                    </>
                                )}
                                <input type="file" className="d-none" accept="image" id="thumbUpload" onChange={handleImageChange} />
                            </div>
                            {/* Error Message */}
                            {validationError.thumbnail && (
                                <div className="text-danger">{validationError.thumbnail}</div>
                            )}
                        </div>
                        <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">
                            <i className="bi bi-send me-2"></i> Save Post
                        </button>
                        <button type="button" className="btn btn-light w-100 mt-2" onClick={() => navigate(-1)}>Cancel</button>
                    </div>
                </div>
            </form>
        </div>
    )
}
export default EditPost;
