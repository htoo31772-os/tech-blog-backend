
import axios from "axios";
import react, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Register = ({setUser}) => {
    const navigate = useNavigate();
    const [validationError, SetValidationError] = useState({})
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
            SetValidationError(
                prevErrors => ({
                    ...prevErrors,
                    [name]: null
                })
            )
        }
    }
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {}
        if (!formData.name) {
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
        SetValidationError(newErrors);
        if (Object.keys(newErrors).length === 0) {
            try {
                const response = await axios.post('/api/register', formData)
                if (response.data.access_token) {
                    const token = localStorage.setItem('token', response.data.access_token);
                    const role = localStorage.setItem('role', response.data.user.role);
                    localStorage.setItem('user',JSON.stringify(response.data.user));
                    setUser(response.data.user);
                }
                navigate('/')
                toast.success('Registration အောင်မြင်ပါသည်', { duration: 4000 });
            } catch (err) {
                if (err.response.status === 422) {
                    SetValidationError(err.response.data.errors)
                } else if (err.response && err.response.data && err.response.data.message) {
                    toast.error(err.response.data.message, { duration: 4000 });
                } else {
                    toast.error('Registration မအောင်မြင်ပါ။ ထပ်မံကြိုးစားကြည့်ပါ။', { duration: 4000 })
                }
            }
        }
    }
    return (
        <div className="card register-card shadow-lg p-4 mt-5" style={{ width: '100%', maxWidth: '450px' }}>
            <h3 className="text-center fw-bold text-primary mb-2">Create Account</h3>
            <p className="text-center text-muted mb-4">Join our community of writers</p>
            <form onSubmit={handleRegisterSubmit}>
                {/* Name */}
                <div className="mb-3">
                    <label className="form-label fw-semibold">Full Name</label>
                    <input type="text"
                        className={`form-control ${validationError.name ? 'is-invalid' : ''}`}
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Name"
                    />
                    {/* Error Message */}
                    {validationError.name && (<div className="text-danger">{validationError.name}</div>)}
                </div>
                {/* Email */}
                <div className="mb-3">
                    <label className="form-label fw-semibold">Email Address</label>
                    <input type="email"
                        className={`form-control ${validationError.email ? 'is-invalid' : ''}`}
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@gmail.com"
                    />
                    {/* Error Message */}
                    {validationError.email && (<div className="text-danger">{validationError.email}</div>)}
                </div>
                <div className="mb-3">
                    <label className="form-label fw-semibold">Password</label>
                    <input type="password"
                        className={`form-control ${validationError.password ? 'is-invalid' : ''}`}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Confirm password"
                    />
                    {/* Error Message */}
                    {validationError.password && (<div className="text-danger">{validationError.password}</div>)}
                </div>
                <div className="mb-4">
                    <label className="form-label fw-semibold">Confirm Password</label>
                    <input type="password"
                        className={`form-control ${validationError.password_confirmation ? 'is-invalid' : ''}`}
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        placeholder="Repeat your password"
                    />
                    {/* Error Message */}
                    {validationError.password_confirmation && (<div className="text-danger">{validationError.password_confirmation}</div>)}
                </div>
                {/* Sing Up Button */}
                <button type="submit" className="btn btn-primary w-100 py-2 rounded-pill fw-bold">Sign Up</button>
                {/* Link to login */}
                <p className="text-center mt-3 small">
                    Already have an account? <Link to="/login" className="text-decoration-none">Login</Link>
                </p>
            </form>
        </div>
    )
}
export default Register;
