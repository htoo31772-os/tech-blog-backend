import { Link } from "react-router-dom";
import useRegister from "../../hooks/useRegister";
const Register = () => {
    const {
        formData,
        validationError,
        isLoading,
        handleChange,
        handleRegisterSubmit
    } = useRegister();
    return (
        <div className="card register-card shadow-lg p-4 mt-5" style={{ width: '100%', maxWidth: '450px' }}>
            <h3 className="text-center fw-bold text-primary mb-2">Create Account</h3>
            <p className="text-center text-muted mb-4">Join our community of writers</p>
            <form onSubmit={handleRegisterSubmit}>
                {/* Name */}
                <div className="mb-3">
                    <label htmlFor="name" className="form-label fw-semibold">Full Name</label>
                    <input type="text"
                        className={`form-control ${validationError.name ? 'is-invalid' : ''}`}
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Name"
                    />
                    {/* Error Message */}
                    {validationError.name && (<div className="invalid-feedback">{validationError.name}</div>)}
                </div>
                {/* Email */}
                <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">Email Address</label>
                    <input type="email"
                        className={`form-control ${validationError.email ? 'is-invalid' : ''}`}
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@gmail.com"
                    />
                    {/* Error Message */}
                    {validationError.email && (<div className="invalid-feedback">{validationError.email}</div>)}
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-semibold">Enter Password</label>
                    <input type="password"
                        className={`form-control ${validationError.password ? 'is-invalid' : ''}`}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                    />
                    {/* Error Message */}
                    {validationError.password && (<div className="invalid-feedback">{validationError.password}</div>)}
                </div>
                <div className="mb-4">
                    <label htmlFor="password_confirmation" className="form-label fw-semibold">Confirm Password</label>
                    <input type="password"
                        className={`form-control ${validationError.password_confirmation ? 'is-invalid' : ''}`}
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        placeholder="Repeat your password"
                    />
                    {/* Error Message */}
                    {validationError.password_confirmation && (<div className="invalid-feedback">{validationError.password_confirmation}</div>)}
                </div>
                {/* Sing Up Button */}
                <button type="submit" className="btn btn-primary w-100 py-2 rounded-pill fw-bold" disabled={isLoading}>
                    {isLoading ? (
                        <span>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Registration...
                        </span>
                    ) : (
                        'Sign Up'
                    )}
                </button>
                {/* Link to login */}
                <p className="text-center mt-3 small">
                    Already have an account? <Link to="/login" className="text-decoration-none">Login</Link>
                </p>
            </form>
        </div>
    )
}
export default Register;
