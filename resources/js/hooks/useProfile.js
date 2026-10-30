import { useEffect, useState } from "react";
import authStorage from "../../utils/authStorage";
import toast from "react-hot-toast";
import api from "../api/api";
const useProfile = ({ user, setUser }) => {
    const [formData, setFormData] = useState(
        {
            name: '',
            bio: ''
        })
    const [previewImage, setPreviewImage] = useState(null);
    const [image, setImage] = useState(null);
    const [error, setError] = useState({});
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setFormData({
            name: user?.name ?? "",
            bio: user?.bio ?? ""
        })
    }, [user])

    useEffect(() => {
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
            setImage(file);
            setError(prev => ({
                ...prev,
                image: null
            }));
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))

        setError(prevErr => ({
            ...prevErr,
            [name]: null
        }))
    }

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setError({});
        if (!formData.name.trim()) {
            setError({ name: 'Name field is required' });
            return;
        }
        const payload = new FormData();
        payload.append("name", formData.name);
        payload.append("bio", formData.bio);
        if (image) {
            payload.append("image", image)
        };
        setIsLoading(true)

        try {
            const res = await api.post('/api/user/profile-update', payload)
            const updatedUser = res.data.user;
            setUser(updatedUser)
            authStorage.updateUser(updatedUser)

            setPreviewImage(null);
            setImage(null);

            toast.success("Profile Update အောင်မြင်ပါတယ်");

        } catch (err) {
            if (err.response?.status === 422) {
                setError(err.response.data.errors ?? {});
            } else {
                toast.error("တစ်ခုခု မှားယွင်းနေပါတယ်");
            }
        } finally {
            setIsLoading(false);
        }
    }
    return {
        formData,
        previewImage,
        error,
        handleImageChange,
        handleInputChange,
        handleProfileUpdate,
        isLoading
    }
}
export default useProfile;
