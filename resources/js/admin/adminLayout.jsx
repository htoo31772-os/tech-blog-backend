import { Outlet, Link, NavLink } from 'react-router-dom';
import '../../css/admin.css';

const AdminLayout = ({ user }) => {
    return (
        <div className="container-fluid">
            <div className="row">
                {/* Sidebar */}
                <nav className="col-md-3 col-lg-2 d-none d-md-block sidebar px-0 shadow vh-100 position-fixed bg-dark">
                    <div className="px-4 py-4 mb-2">
                        <Link to="/">
                            <h4 className="fw-bold text-white">TECH<span className="text-info">BLOG</span></h4>
                        </Link>
                        <small className="text-light" style={{ fontSize: '10px', display: 'block', marginTop: '-5px' }}>CONTROL PANEL</small>
                    </div>

                    <ul className="nav flex-column">
                        <li className="px-4"><small className="text-uppercase text-light fw-bold" style={{ fontSize: '10px' }}>Content</small></li>
                        <li className="nav-item">
                            <NavLink className="nav-link text-white" to="/admin/dashboard"><i className="bi bi-speedometer2 me-2"></i> Dashboard</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link text-white" to="/admin/post"><i className="bi bi-plus-circle me-2"></i>Post</NavLink>
                        </li>

                        <li className="px-4"><small className="text-uppercase text-light fw-bold" style={{ fontSize: '10px' }}>Administration</small></li>
                        <li className="nav-item">
                            <NavLink className="nav-link text-white" to="/admin/users"><i className="bi bi-people-fill me-2"></i> User</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link text-white" to="/admin/categories"><i className="bi bi-folder-symlink-fill me-2"></i> Categories</NavLink>
                        </li>

                        <li className="px-4"><small className="text-uppercase text-light fw-bold" style={{ fontSize: '10px' }}>Personal</small></li>
                        <li className="nav-item">
                            <NavLink className="nav-link text-white" to="/admin/newLetter"><i className="bi bi-envelope-open-heart-fill me-2"></i> NewLetter</NavLink>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link text-warning" to="/"><i className="bi bi-house-door me-2"></i> Go to Site</Link>
                        </li>
                    </ul>
                </nav>

                {/* Main Content Area */}
                <main className="col-md-9 ms-sm-auto col-lg-10 p-0">
                    <div className="top-header d-flex justify-content-between align-items-center px-4 py-3 bg-white shadow-sm">
                        <h5 className="fw-bold mb-0 text-secondary">Management Panel</h5>
                        <div className="dropdown">
                            <img
                                src={user?.avator ? `http://localhost:8000/storage/user/${user.avator}` : "/images/user.jpg"}
                                className="rounded-circle shadow-sm"
                                alt="User Profile"
                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                            <span className="ms-2 fw-semibold">{user?.name}</span>
                        </div>
                    </div>

                    <div className="p-4">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
