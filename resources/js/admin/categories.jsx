import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/api";
const Categories = () => {
    const token = localStorage.getItem('token');
    // Category List များကို backend မှ ရယူခြင်း
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [globalMessage, setGlobalMessage] = useState(null);
    const [error, setError] = useState(null)
    useEffect(() => {
        const fetchCategory = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/api/admin/category');
                setCategories(response.data);
            } catch (err) {
                console.error('error is:', err);
                setError("Categories ယူလို့မရပါ");
            } finally {
                setIsLoading(false)
            }
        }
        fetchCategory();
    }, []);
    // Category ပြုပြင်ခြင်း
    const [editId, setEditId] = useState(null);
    const handleEdit = (category) => {
        setEditId(category.id),
            setName(category.name),
            setSlug(category.slug),
            setValidationError({});
    }
    // Cancle Button
    const resetForm = () => {
        setEditId(null);
        setName('');
        setSlug('');
        setValidationError({})
    }
    // Category ဖန်တီးခြင်း & Update လုပ်ခြင်း
    const [validationError, setValidationError] = useState({});
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [btnLoading, setBtnLoading] = useState(false);
    const handleAddCategory = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!name) {
            newErrors.name = "Category name field is required";
        }
        if (!slug) {
            newErrors.slug = "Slug name field is required";
        }
        setValidationError(newErrors);
        try {
            if (Object.keys(newErrors).length === 0) {
                setBtnLoading(true);
                setValidationError({});
                if (editId) {
                    // Update Category
                    const response = await api.post(`/api/admin/category/update/${editId}`, { name, slug })
                    setCategories(categories.map(category => category.id === editId ? response.data.category : category));
                    toast.success('Category ကို ပြင်ဆင်ပြီးပါပြီ။')
                } else {
                    // Create Category
                    const response = await api.post('/api/admin/category/store', { name, slug })
                    setCategories([response.data.category, ...categories])
                    toast.success('Category အသစ် ထည့်သွင်းပြီးပါပြီ')
                }
                resetForm();
            }
        } catch (err) {
            console.error('category error:', err);
            if (err.response.status === 422) {
                setValidationError(err.response.data.errors);
            } else if (err.response && err.response.data && err.response.data.message) {
                toast.error('Category ထည့်သွင်းမှု မအောင်မြင်ပါ။');
            } else {
                toast.error('တစ်ခုခုမှားယွင်းနေပါသည်။ ထပ်မံကြိုးစားကြည့်ပါ။');
            }
        } finally {
            setBtnLoading(false);
        }
    }
    // Category ဖျက်ခြင်း
    const handleDelete = async (id) => {
        if (window.confirm('Category ကိုဖျက်ရန် သေချာပါသလား?')) {
            try {
                await api.post(`/api/admin/category/delete/${id}`)
                setCategories(categories.filter(category => category.id !== id));
                toast.success('ဖျက်သိမ်းမှုအောင်မြင်ပါသည်။');
            } catch (err) {
                console.error('Category delete error:', err);
                toast.error('ဖျက်သိမ်းမှုမအောင်မြင်ပါ။');
            }
        }
    }
    if (error) {
        return <div className="text-danger text-center mt-5">{error}</div>
    }
    return (
        <div className="row">
            {/* ဘယ်ဘက် - Add Category Form */}
            <div className="col-md-4">
                <div className="card p-4 shadow-sm border-0">
                    <h5 className="fw-bold mb-3">{editId ? "Edit Category" : "Add Category"}</h5>
                    <form onSubmit={handleAddCategory}>
                        {/* Category Name */}
                        <div className="mb-3">
                            <label className="form-label small fw-bold">CATEGORY NAME</label>
                            <input type="text"
                                className={`form-control ${validationError.name ? 'is-invalid' : ''}`}
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value); if (!editId) setSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''))
                                }}
                                placeholder="e.g. Category" />
                            {/* Error Messaage */}
                            {validationError.name && (<div className="text-danger">{validationError.name}</div>)}
                        </div>
                        {/* Slug Name */}
                        <div className="mb-3">
                            <label className="form-label small fw-bold">SLUG</label>
                            <input
                                type="text"
                                className={`form-control ${validationError.slug ? 'is-invalid' : ''}`}
                                value={slug}
                                onChange={(e) => { setSlug(e.target.value) }}
                                placeholder="e.g. slug" />
                            {/* Error Message */}
                            {validationError.slug && (<div className="text-danger">{validationError.slug}</div>)}
                        </div>
                        <div className="d-flex gap-2">
                            <button className={`btn w-100 ${editId ? 'btn-success' : 'btn-primary'}`} disabled={btnLoading}>
                                {btnLoading ? 'Processing' : (editId ? 'Update' : 'Add New')}
                            </button>
                            {editId && <button type="button" className="btn btn-secondary w-100" onClick={resetForm}>Cancel</button>}
                        </div>
                    </form>
                </div>
            </div>

            {/* ညာဘက် - Category Table List */}
            <div className="col-md-8">
                <div className="card p-4 shadow-sm border-0">
                    <h5 className="fw-bold mb-3">All Categories</h5>
                    <table className="table align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Name</th>
                                <th>Slug</th>
                                <th>Posts</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="4" className="text-center">Loading...</td></tr>
                            ) : error ? (
                                <tr><td colSpan="4" className="text-center text-danger">{error}</td></tr>
                            ) : Array.isArray(categories) && categories.length > 0 ? (
                                categories?.map(category => (
                                    <tr key={category.id}>
                                        <td>{category.name}</td>
                                        <td>{category.slug}</td>
                                        <td>{category.post_count || 0}</td>
                                        <td>
                                            <button onClick={() => handleEdit(category)} className="btn btn-sm btn-outline-secondary me-1"><i className="bi bi-pencil"></i></button>
                                            <button onClick={() => handleDelete(category.id)} className="btn btn-sm btn-outline-danger"><i className="bi bi-trash"></i></button>
                                        </td>
                                    </tr>))
                            ) : (<tr><td colSpan="4" className="text-center">Categories အချက်အလက်များ မရှိသေးပါ။</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
export default Categories;
