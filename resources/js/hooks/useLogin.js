import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { AuthContext } from "../context/authContext";
import authService from "../services/authService";
import authStorage from "../../utils/authStorage";

const useLogin = () => {
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false)
    const [validationError, setValidationError] = useState({})
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
        if (validationError[name]) {
            setValidationError(prevError => ({
                ...prevError,
                [name]: null
            }))
        }
    }
    const validate = () => {
        const newErrors = {}
        if (!formData.email.trim()) {
            newErrors.email = "Email field is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email address is invalid";
        }
        if (!formData.password) {
            newErrors.password = "Password field is required";
        }
        setValidationError(newErrors);
        return Object.keys(newErrors).length === 0;
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setIsLoading(true)
        try {
            const response = await authService.login(formData);
            if (response.data.access_token) {
                authStorage.saveAuth(response.data.access_token, response.data.user)
                setUser(response.data.user);
            }
            toast.success('Login အောင်မြင်ပါသည်', { duration: 4000 })
            navigate('/');
        } catch (err) {
            if (err.response?.status === 422) {
                const errors = err.response?.data?.errors ?? {}
                setValidationError({
                    email: errors.email?.[0] ?? null,
                    password: errors.password?.[0] ?? null
                });
            } else {
                const message = err.response?.data?.message;
                toast.error(
                    message || "Login မအောင်မြင်ပါ။ ထပ်မံကြိုးစားကြည့်ပါ။"
                );
            }
        } finally {
            setIsLoading(false)
        }

    }
    return {
        formData,
        handleChange,
        handleSubmit,
        isLoading,
        validationError
    }
}
export default useLogin;
