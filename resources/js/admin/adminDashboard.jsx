import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import authStorage from '../../utils/authStorage';
import api from '../api/api';

const AdminDashboard = () => {
    const token = authStorage.getToken();
    const [recentPosts, setRecentPosts] = useState([]);
    const [stats, setStats] = useState({
        totalPosts: 0,
        totalUsers: 0,
        totalSubscribers: 0,
        newComments: 0,
    });
    if (!token) {
        return;
    }
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('/api/admin/dashboard-stats');
                setStats(res.data.stats);
                setRecentPosts(res.data.recentPosts);
            } catch (error) {
                console.error("Dashboard data fetch error", err);
            }
        }
        fetchDashboardData();
    }, []);
    return (
        <div className="container-fluid py-4">
            <h3 className="fw-bold mb-4 text-dark">Dashboard Overview</h3>
            <div className="row g-4 mb-5">
                {/* Card 1: Total Posts */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <p className="text-muted mb-1 fw-medium">Total Posts</p>
                                    <h2 className="fw-bold mb-0">{stats?.totalPosts}</h2>
                                </div>
                                <div className="bg-primary bg-opacity-10 p-3 rounded-4" style={{ width: 'fit-content', height: 'fit-content' }}>
                                    <i className="bi bi-journal-text fs-3 text-primary"></i>
                                </div>
                            </div>
                            <div className="mt-3 small">
                                <span className="text-success fw-bold">Active Posts</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 2: Total Users */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <p className="text-muted mb-1 fw-medium">Total Users</p>
                                    <h2 className="fw-bold mb-0">{stats?.totalUsers}</h2>
                                </div>
                                <div className="bg-success bg-opacity-10 p-3 rounded-4">
                                    <i className="bi bi-people fs-3 text-success"></i>
                                </div>
                            </div>
                            <div className="mt-3 small">
                                <span className="text-muted">Registered members</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 3: Newsletter Subscribers */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <p className="text-muted mb-1 fw-medium">Subscribers</p>
                                    <h2 className="fw-bold mb-0">{stats?.totalSubscribers}</h2>
                                </div>
                                <div className="bg-warning bg-opacity-10 p-3 rounded-4">
                                    <i className="bi bi-envelope-check fs-3 text-warning"></i>
                                </div>
                            </div>
                            <div className="mt-3 small">
                                <span className="text-warning fw-bold">Email List</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 4: Comments or Notifications */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <p className="text-muted mb-1 fw-medium">New Comments</p>
                                    <h2 className="fw-bold mb-0">{stats?.newComments}</h2>
                                </div>
                                <div className="bg-info bg-opacity-10 p-3 rounded-4">
                                    <i className="bi bi-chat-dots fs-3 text-info"></i>
                                </div>
                            </div>
                            <div className="mt-3 small">
                                <span className="text-info fw-bold">Latest interactions</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* --- Recent Posts Table Section --- */}
            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-header bg-white py-3 border-0 rounded-top-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="fw-bold mb-0">Recent Posts</h5>
                        <Link to="/admin/post" className="btn btn-sm btn-outline-primary rounded-pill">View All</Link>
                    </div>
                </div>
                <div className="table-responsive p-3">
                    <table className="table align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!recentPosts || recentPosts.length > 0 ? (
                                recentPosts?.map((post) => (
                                    <tr key={post.id}>
                                        <td>{post.title}</td>
                                        <td>{post.user?.name || 'Admin'}</td>
                                        <td>{new Date(post.created_at).toLocaleDateString('en-Us', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}</td>
                                        <td><span className={`badge ${post.status === 'public' ? 'bg-success' : 'bg-warning text-dark'} rounded-pill`}>{post.status}</span></td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" className="text-center text-muted">No recent posts found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
