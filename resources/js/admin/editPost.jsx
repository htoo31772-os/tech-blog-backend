import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import PostForm from "./component/postForm";
import { validatePostForm } from "../../utils/postFormUtils";
import { createPostFormData } from "../../utils/createPostFromData";
const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [image, setImage] = useState(null);
    const [validationError, setValidationError] = useState({})
    const [formData, setFormData] = useState({
        title: '',
        categoryId: '',
        thumbnail: null,
        content: '',
        status: 'draft'
    })
    // ၁။ Category တွေနဲ့ ရှိပြီးသား Post Data ကို ဆွဲထုတ်ခြင်း
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoryResponse, postResponse] = await Promise.all([
                    api.get('/api/admin/category'),
                    api.get(`/api/admin/post/edit/${id}`)
                ])
                setCategories(categoryResponse.data);
                const post = postResponse.data;
                setFormData({
                    title: post.title,
                    categoryId: post.category_id,
                    content: post.body,
                    status: post.status,
                    thumbnail: null
                });
                if (post.thumbnail) {
                    setImage(`${import.meta.env.VITE_API_URL}/storage/post/${post.thumbnail}`)
                }
            } catch (err) {
                toast.error('Data ယူလို့မရပါ။');
            }
        }
        fetchData();
    }, [id]);
    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        setValidationError(prev => ({
            ...prev,
            [name]: null
        }))
    }
    // Image
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                thumbnail: file
            }))
            setImage(URL.createObjectURL(file));
        }
    }
    // Update Post
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        const errors = validatePostForm(formData);
        if (Object.keys(errors).length > 0) {
            setValidationError(errors)
            return;
        }
        setValidationError({});

        const data = createPostFormData(formData);

        try {
            await api.post(`/api/admin/post/update/${id}`, data)
            toast.success('Post ကို ပြင်ဆင်ပြီးပါပြီ။');
            navigate('/admin/post', { replace: true });
        } catch (err) {
            console.error('Post Update err:', err);

            if (err.response?.status === 422) {
                setValidationError(err.response?.data?.errors);
            } else if (err.response?.data?.message) {
                toast.error(err.response?.data?.message || "တစ်ခုခု မှားယွင်းနေပါသည်။", { duration: 4000 });
            } else {
                toast.error('မအောင်မြင်ပါ။ ထပ်မံကြိုးစားကြည့်ပါ။')
            }
        }

    }
    return (
        <PostForm
            formData={formData}
            onFieldChange={handleFieldChange}
            categories={categories}
            validationError={validationError}
            image={image}
            onImageChange={handleImageChange}
            onSubmit={handleUpdateSubmit}
            submitLabel="Save Post"
        />
    )
}
export default EditPost;
