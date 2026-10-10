import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import authService from "../services/authService";
import authStorage from "../../utils/authStorage";
import { AuthContext } from "../context/authContext";
const useRegister = () => {
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [validationError, setValidationError] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    })
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(
            prevState => ({
                ...prevState,
                [name]: value
            })
        )
        if (validationError[name]) {
            setValidationError(
                prevErrors => ({
                    ...prevErrors,
                    [name]: null
                })
            )
        }
    }
    const validate = () => {
        const newErrors = {}
        if (!formData.name.trim()) {
            newErrors.name = 'Name field is required';
        }
        if (!formData.email) {
            newErrors.email = 'Email field is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email address is invalid';
        }
        if (!formData.password) {
            newErrors.password = 'Password field is required';
        }
        if (!formData.password_confirmation) {
            newErrors.password_confirmation = 'Password confirmation is required';
        } else if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = 'Password confirmaiton must be same password';
        }
        setValidationError(newErrors);
        return Object.keys(newErrors).length === 0
    }
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setIsLoading(true)
        try {
            const response = await authService.register(formData);
            const { access_token: token, user } = response.data;
            if (!token || !user) {
                throw new Error("Invalid registration response");
            }
            authStorage.saveAuth(token, user);
            setUser(user);
            navigate('/')
            toast.success('Registration အောင်မြင်ပါသည်', { duration: 4000 });
        } catch (err) {
            if (err.response?.status === 422) {
                const errors = err.response?.data?.errors ?? {};
                setValidationError({
                    name: errors.name?.[0] ?? null,
                    email: errors.email?.[0] ?? null,
                    password: errors.password?.[0] ?? null,
                    password_confirmation: errors.password_confirmation?.[0] ?? null
                })
            } else {
                toast.error(err.response?.data?.message || 'Registration မအောင်မြင်ပါ။ ထပ်မံကြိုးစားကြည့်ပါ။', { duration: 4000 })
            }
        } finally {
            setIsLoading(false);
        }
    }
    return {
        validationError,
        formData,
        isLoading,
        handleChange,
        handleRegisterSubmit,
    }
}
export default useRegister;
