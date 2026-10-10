import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
const Login = () => {
    const {
        formData,
        handleChange,
        handleSubmit,
        isLoading,
        validationError
    } = useLogin();
    return (
        <div className="card login-card shadow p-4 mt-5" style={{ width: '100%', maxWidth: '400px' }}>
            <h3 className="text-center fw-bold text-primary mb-4">Login</h3>
            <form onSubmit={handleSubmit}>
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
                    {validationError.email && (<div className="invalid-feedback">{validationError.email}</div>)}
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
                    {validationError.password && (<div className="invalid-feedback">{validationError.password}</div>)}
                </div>
                {/* Submit Button */}
                <button type="submit" className="btn btn-primary w-100 py-2 rounded-pill fw-bold" disabled={isLoading}>
                    {isLoading ? (
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
