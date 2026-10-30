import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/api";
const usePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const [btnLoading, setBtnLoading] = useState(false);
    const [error, setError] = useState({});

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        const validationErrors = {};
        if (!currentPassword) {
            validationErrors.current_password =
                "Current password is required";
        }
        if (!password) {
            validationErrors.password = 'password field is required';
        } else if (password.length < 8) {
            validationErrors.password =
                "Password must be at least 8 characters";
        }
        if (!passwordConfirmation) {
            validationErrors.password_confirmation = 'Password confirmation is required';
        } else if (password !== passwordConfirmation) {
            validationErrors.password_confirmation = 'Password and confirmation do not match';
        }
        setError(validationErrors)
        if (Object.keys(validationErrors).length > 0) {
            return;
        }
        setBtnLoading(true)
        try {
            await api.post("/api/user/password-update", {
                current_password: currentPassword,
                password: password,
                password_confirmation: passwordConfirmation
            });
            setCurrentPassword("");
            setPassword("");
            setPasswordConfirmation("");
            setError({});
            toast.success("Password ပြောင်းလဲပြီးပါပြီ");
        } catch (err) {
            if (err.response?.status === 422) {
                setError(err.response.data.errors ?? {});
            } else {
                toast.error("Password update failed");
            }
        } finally {
            setBtnLoading(false)
        }

    };
    return {
        setCurrentPassword,
        currentPassword,
        setPassword,
        password,
        setPasswordConfirmation,
        passwordConfirmation,
        handlePasswordUpdate,
        error,
        btnLoading
    }
}
export default usePassword;
