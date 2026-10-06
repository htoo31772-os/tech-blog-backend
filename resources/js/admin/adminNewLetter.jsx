import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const NewsletterList = () => {
    const token = localStorage.getItem('token');
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState({});
    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        try {
            const res = await axios.get("/api/admin/subscribers", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSubscribers(res.data.data);
            setMeta(res.data)
            setLoading(false);
        } catch (err) {
            toast.error("ဒေတာ ဆွဲယူလို့ မရဘူး ဖြစ်နေတယ်!");
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("ဒီ Email ကို စာရင်းထဲက ဖျက်မှာ သေချာလား?")) {
            try {
                await axios.delete(`/api/admin/subscribers/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("ဖျက်ပြီးပါပြီ");
                fetchSubscribers();
            } catch (err) {
                toast.error("ဖျက်လို့ မရပါဘူး");
            }
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold">Newsletter Subscribers</h3>
                <span className="badge bg-primary rounded-pill">{subscribers?.length} Total</span>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead className="table-light text-muted">
                            <tr>
                                <th className="ps-4">Email Address</th>
                                <th>Subscribed At</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscribers?.map((sub) => (
                                <tr key={sub.id}>
                                    <td className="ps-4 fw-medium text-dark">{sub?.email}</td>
                                    <td>{new Date(sub.created_at).toLocaleDateString('en-Us', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}</td>
                                    <td className="text-center">
                                        <button
                                            onClick={() => handleDelete(sub?.id)}
                                            className="btn btn-sm btn-light text-danger rounded-circle"
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="card-footer bg-white border-0 py-3">
                    <nav className="d-flex justify-content-between align-items-center">
                        <div className="text-muted small">
                            Showing {meta.from} to {meta.to} of {meta.total} users
                        </div>

                        <ul className="pagination mb-0">
                            {/* Previous Button */}
                            <li className={`page-item ${meta.current_page === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => fetchUsers(meta.current_page - 1)}>Previous</button>
                            </li>

                            {/* Page Numbers (Simple logic) */}
                            {[...Array(meta.last_page)].map((_, index) => (
                                <li key={index + 1} className={`page-item ${meta.current_page === index + 1 ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => fetchUsers(index + 1)}>
                                        {index + 1}
                                    </button>
                                </li>
                            ))}

                            {/* Next Button */}
                            <li className={`page-item ${meta.current_page === meta.last_page ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => fetchUsers(meta.current_page + 1)}>Next</button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default NewsletterList;
