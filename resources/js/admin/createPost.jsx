
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import PostForm from "./component/postForm";
import { validatePostForm } from "../../utils/postFormUtils";
import { createPostFormData } from "../../utils/createPostFromData";
const CreatePost = () => {
    const [validationError, setValidationError] = useState({});
    const [categories, setCategories] = useState([]);
    const [image, setImage] = useState(null);
    const [formData, setFormData] = useState({
        categoryId: '',
        title: '',
        thumbnail: null,
        content: '',
        status: 'draft'
    })
    const navigate = useNavigate();
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get(`/api/admin/category`)
                setCategories(response.data);
            } catch (err) {
                toast.error('Category ယူလို့မရပါ')
            }

        }
        fetchCategories();
    }, [])
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
    const handlePostSumbit = async (e) => {
        e.preventDefault();

        const errors = validatePostForm(formData);
        if (Object.keys(errors).length > 0) {
            setValidationError(errors)
            return;
        }
        setValidationError({});

        const data = createPostFormData(formData);

        try {
            await api.post(`/api/admin/post/store`, data)
            navigate('/admin/post', { replace: true })
            toast.success('Post ဖန်တီးပြီးပါပြီ။')
        } catch (err) {
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
            onSubmit={handlePostSumbit}
            submitLabel="Public Article"
        />
    )
}
export default CreatePost;
