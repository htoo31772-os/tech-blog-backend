import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import authStorage from "../../../utils/authStorage";
import authService from "../../services/authService";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
const Header = () => {
    const navigate = useNavigate();
    const { user, setUser, isAuthenticated } = useContext(AuthContext);
    const handleLogout = async () => {
        let serverLogoutSucceeded = false;
         const token = authStorage.getToken();
        try {
            if (token) {
                await authService.logout(token);
                serverLogoutSucceeded = true;
            }
        } catch (err) {
            console.error("Server logout failed:", err);
        } finally {
            authStorage.clearAuth();
            setUser(null);
            navigate('/', { replace: true })
        }
        if (serverLogoutSucceeded) {
            toast.success("Logout အောင်မြင်ပါသည်");
        } else {
            toast.error("Local မှ Logout လုပ်ပြီးပါပြီ။ Server Token ကို ဖျက်သိမ်းနိုင်ခဲ့ကြောင်း အတည်မပြုနိုင်ပါ။");
        }
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-light sticky-top bg-white border-bottom">
            <div className="container">
                <Link className="navbar-brand fw-bold fs-3" to="/">TECH<span className="text-primary">BLOG</span></Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">

                        {isAuthenticated ? (
                            <li className="nav-item dropdown ms-lg-3">
                                <Link className="nav-link dropdown-toggle d-flex align-items-center" id="profileDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <img
                                        src={user?.avator ? `http://localhost:8000/storage/user/${user.avator}` : "/images/user.jpg"}
                                        className="rounded-circle border shadow-sm"
                                        style={{ width: '35px', height: '35px', objectFit: 'cover' }}
                                        alt="profile"
                                    />
                                    <span className="ms-2 fw-medium text-dark d-none d-sm-inline">{user?.name}</span>
                                </Link>
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
                                    {(user?.role === 'author' || user?.role === 'admin') && (
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
