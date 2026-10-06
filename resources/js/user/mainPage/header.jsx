import axios from "axios";
import react from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
const Header = ({ setIsLoggin, user, setUser }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const handleLogout = async () => {
        try {
            await axios.post('/api/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            setIsLoggin(false);
            setUser(null);
            toast.success('Logout အောင်မြင်ပါသည်');
            window.location.href = '/login';
        } catch (err) {
            console.error(err);
            localStorage.clear();
            window.location.href = '/login';
        }
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-light sticky-top bg-white border-bottom">
            <div className="container">
                <a className="navbar-brand fw-bold fs-3" href="/">TECH<span className="text-primary">BLOG</span></a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">

                        {token ? (
                            <li className="nav-item dropdown ms-lg-3">
                                <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" id="profileDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <img
                                        src={user?.avator ? `http://localhost:8000/storage/user/${user.avator}` : "/images/user.jpg"}
                                        className="rounded-circle border shadow-sm"
                                        style={{ width: '35px', height: '35px', objectFit: 'cover' }}
                                        alt="profile"
                                    />
                                    <span className="ms-2 fw-medium text-dark d-none d-sm-inline">{user?.name}</span>
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-3 p-2 rounded-3" aria-labelledby="profileDropdown">
                                    <li className="px-3 py-2 border-bottom mb-2 d-lg-none">
                                        <div className="fw-bold">{user?.name}</div>
                                        <small className="text-muted">{user?.email}</small>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item rounded-2 py-2" to="/profile">
                                            <i className="bi bi-person-circle me-2 text-primary"></i> My Profile
                                        </Link>
                                    </li>
                                    {(role === 'author' || role === 'admin') && (
                                        <li>
                                            <Link className="dropdown-item rounded-2 py-2" to="/admin/dashboard">
                                                <i className="bi bi-speedometer2 me-2 text-primary"></i> Admin Dashboard
                                            </Link>
                                        </li>
                                    )}
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button onClick={handleLogout} className="dropdown-item rounded-2 py-2 text-danger">
                                            <i className="bi bi-box-arrow-right me-2"></i> Logout
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <li className="nav-item ms-lg-3">
                                <Link className="btn btn-primary rounded-pill px-4 shadow-sm" to="/login">Login</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    )
}
export default Header;
