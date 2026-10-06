import api from "axios";
import react, { useState } from "react";
import { Link } from "react-router-dom";
const LatestStories = ({ posts, meta, fetchSearch }) => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    return (
        <div className="col-lg-8">
            <h3 className="fw-bold mb-4">Latest Stories</h3>
            <div className="row g-4">
                {loading ? (
                    <div className="text-center mt-5">Loading Articles...</div>
                ) : !posts || posts?.length > 0 ? (
                    posts?.map(post => (
                        <div key={post.id} className="col-md-6">
                            <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                                <img
                                    src={post.image_url}
                                    className="card-img-top"
                                    alt="Post Image"
                                />
                                <div className="card-body p-4">
                                    <span className="text-primary fw-bold small">{post.category.name}</span>
                                    <h5 className="card-title fw-bold mt-2">{post.title}</h5>
                                    <p className="card-text text-muted">{post.body.substring(0, 80)}...</p>
                                    <div className="d-flex align-items-center justify-content-between mt-4 pt-3 border-top">
                                        <div className="small">
                                            <div className="fw-bold">{post.user.name}</div>
                                            <div className="text-muted">{new Date(post.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}</div>
                                        </div>
                                        <div className="small">
                                            <Link to={`/techBlog/post/postDetail/${post.id}`} className="btn btn-outline-primary btn-sm">Read More</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center mt-5">လက်တလော အချက်အလက်များ မရှိသေးပါ။</div>
                )}
            </div>

            {posts?.length > 0 && meta && (
                <div className="d-flex justify-content-center gap-2 my-5">
                    <button
                        className="btn btn-primary"
                        disabled={!meta.prev_page_url}
                        onClick={() => fetchSearch(meta.prev_page_url)}
                    >
                        Prev
                    </button>

                    <span className="btn btn-light disabled">
                        Page {meta.current_page} of {meta.last_page}
                    </span>

                    <button
                        className="btn btn-primary"
                        disabled={!meta.next_page_url}
                        onClick={() => fetchSearch(meta.next_page_url)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}
export default LatestStories;
