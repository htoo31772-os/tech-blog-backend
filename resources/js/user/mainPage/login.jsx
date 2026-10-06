import axios from "axios";
import react, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
const Login = ({ setUser }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [validationError, SetValidationError] = useState({})
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
            SetValidationError(prevError => ({
                ...prevError,
                [name]: null
            }))
        }
    }
    const handleLoginChange = async (e) => {
        e.preventDefault();
        const newErrors = {}
        if (!formData.email) {
            newErrors.email = "Email field is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email address is invalid";
        }
        if (!formData.password) {
            newErrors.password = "Password field is required";
        }
        if (Object.keys(newErrors).length === 0) {
            setLoading(true)
            try {
                const response = await axios.post('/api/login', formData)
                if (response.data.access_token) {
                    const token = localStorage.setItem('token', response.data.access_token);
                    const role = localStorage.setItem('role', response.data.user.role);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    setUser(response.data.user);
                }
                toast.success('Login အောင်မြင်ပါသည်', { duration: 4000 })
                window.location.href = '/';
            } catch (err) {
                if (err.response.status === 422) {
                    SetValidationError(err.response.data.errors);
                } else if (err.response && err.response.data && err.response.data.message) {
                    toast.error(err.response.data.message);
                } else {
                    toast.error('Email နဲ့ Password မှားနေပါတယ်။ ထပ်မံကြိုးစားကြည့်ပါ')
                }
            } finally {
                setLoading(false)
            }
        }
    }
    return (
        <div className="card login-card shadow p-4 mt-5" style={{ width: '100%', maxWidth: '400px' }}>
            <h3 className="text-center fw-bold text-primary mb-4">Login</h3>
            <form onSubmit={handleLoginChange}>
                {/* Name */}
                <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input
                        type="email"
                        className={`form-control ${validationError.email ? 'is-invalid' : ''}`}
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@mail.com" />
                    {/* Validation Error */}
                    {validationError.email && (<div className="text-danger">{validationError.email}</div>)}
                </div>
                {/* Password */}
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className={`form-control ${validationError.password ? 'is-invalid' : ''}`}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password" />
                    {/* Validation Error */}
                    {validationError.password && (<div className="text-danger">{validationError.password}</div>)}
                </div>
                {/* Submit Button */}
                <button type="submit" className="btn btn-primary w-100 py-2 rounded-pill fw-bold" disabled={loading}>
                    {loading ? (
                        <span>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Logging in...
                        </span>
                    ) : (
                        'Login'
                    )}</button>
                {/* Link to Register */}
                <p className="text-center mt-3 small">
                    Don't have an account? <Link to="/register" className="text-decoration-none">Register</Link>
                </p>
            </form>
        </div>
    )
}
export default Login;
