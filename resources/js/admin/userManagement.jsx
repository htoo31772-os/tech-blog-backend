import useUserManagement from '../hooks/useUserManagement';

const UserManagement = ({ user: currentUser }) => {
    const {
        users,
        meta,
        loading,
        error,
        isUpdating,
        deletingUserId,
        fetchUsers,
        handleRoleChange,
        handleDelete
    } = useUserManagement({ currentUser });
    return (
        <div className="container-fluid py-4">
            <h3 className="fw-bold mb-4">User Management</h3>

            <div className="card border-0 shadow-sm rounded-4">
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-5">Loading...</td></tr>
                            ) : error ? (
                                <tr><td colSpan="4" className="text-center py-5">{error}</td></tr>
                            ) : users.length > 0 ? (
                                users?.map((user) => (
                                    <tr key={user.id}>
                                        <td className="ps-4">
                                            <div className="d-flex align-items-center">
                                                <img src={user?.avator ? `${import.meta.env.VITE_API_URL}/storage/user/${user.avator}` : "/images/user.jpg"} className="rounded-circle me-3" style={{ width: "40px", height: "40px", objectFit: "cover" }} alt="" />
                                                <span className="fw-medium">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="text-danger">{user.email}</td>
                                        <td><span className="badge bg-primary bg-opacity-10 text-primary">{user.role}</span></td>
                                        <td className="text-center">
                                            <div className="d-flex align-items-center justify-content-center gap-2">
                                                {/* Role Select */}
                                                {currentUser.role === 'admin' ? (
                                                    <select
                                                        className="form-select form-select-sm border-0 bg-light shadow-sm"
                                                        value={user.role}
                                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                        style={{ width: '110px', borderRadius: '8px' }}
                                                        disabled={user.id === currentUser?.id || isUpdating}
                                                    >
                                                        <option value="admin">Admin</option>
                                                        <option value="author">Author</option>
                                                        <option value="user">User</option>
                                                    </select>
                                                ) : (
                                                    <span className="badge bg-primary bg-opacity-10 text-primary">Only Admin</span>
                                                )}


                                                {/* Action Button Area */}
                                                <div style={{ width: '40px' }}>
                                                    {currentUser.role === 'admin' && user.id !== currentUser?.id ? (
                                                        <button
                                                            onClick={() => handleDelete(user.id)}
                                                            className="btn btn-sm btn-light text-danger border-0 rounded-circle shadow-sm"
                                                            title="Delete User"
                                                            style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                            disabled={deletingUserId === user.id}
                                                        >
                                                            {deletingUserId === user.id
                                                                ? 'Processing'
                                                                : <i className="bi bi-trash"></i>
                                                            }

                                                        </button>
                                                    ) : user.id === currentUser?.id ? (
                                                        <span className="badge rounded-pill bg-secondary bg-opacity-10 text-secondary small" style={{ fontSize: '10px' }}>
                                                            You
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" className="text-center py-5">User Data မရှိသေးပါ။</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* --- Pagination Controls --- */}
                <div className="card-footer bg-white border-0 py-3">
                    <nav className="d-flex justify-content-between align-items-center">
                        <div className="text-muted small">
                            Showing {meta.from} to {meta.to} of {meta.total} users
                        </div>

                        <ul className="pagination mb-0">
                            {/* Previous Button */}
                            <li className={'page-item'}>
                                <button
                                    className="page-link"
                                    onClick={() => fetchUsers(meta.current_page - 1)}
                                    disabled={meta.current_page === 1 || loading}
                                >Previous</button>
                            </li>

                            {/* Page Numbers (Simple logic) */}
                            {[...Array(meta.last_page)].map((_, index) => (
                                <li key={index + 1} className={`page-item ${meta.current_page === index + 1 ? 'active' : ''
                                    }`}>
                                    <button className="page-link" onClick={() => fetchUsers(index + 1)} disabled={meta.current_page === index + 1 || loading}>
                                        {index + 1}
                                    </button>
                                </li>
                            ))}

                            {/* Next Button */}
                            <li className={'page-item'}>
                                <button className="page-link"
                                    onClick={() => fetchUsers(meta.current_page + 1)}
                                    disabled={meta.current_page === meta.last_page || loading}
                                >Next</button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
