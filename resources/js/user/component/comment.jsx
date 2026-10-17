import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
const Comment = ({ postId }) => {
     const{isAuthenticate}=useContext(AuthContext);
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    // reveiw များကို ရယူခြင်း
    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/techBlog/post/${postId}/reviews`);
                setReviews(response.data)
            } catch (err) {
                console.error('Review error:', err);
                setError('Reviews များ ရယူနိုင်ခြင်းမရှိပါ။');
            } finally {
                setLoading(false);
            }
        }
        fetchReviews();
    }, [postId]);
    // Post တွင် comment ရေးခြင်း
    const [newReview, setNewReview] = useState({ content: '' });
    const [btnLoading, setBtnLoading] = useState(false);
    const token = localStorage.getItem('token');
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticate) {
            toast.error("မှန်ချက်ရေးရန် login ဝင်ပေးပါ။", { duration: 4000 })
            return;
        }
        if (!newReview.content.trim()) {
            toast.error("မှန်ချက်ရေးပေးပါ။", { duration: 4000 })
            return;
        }
        setBtnLoading(true);
        try {
            const response = await axios.post(`/api/techBlog/post/${postId}/newReviews`, { ...newReview }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setReviews([...reviews, response.data]);
            setNewReview({ content: '' })
            toast.success("မှတ်ချက်ရေးပြီးပါပြီ။ ကျေးဇူးတင်ပါသည်း။");
        } catch (err) {
            console.error("new review error:", err);
            toast.error("တစ်ခုခုမှားယွင်းနေပါသည်။ ထပ်မံကြိုးစားကြည့်ပါ။", { duration: 4000 })
        } finally {
            setBtnLoading(false);
        }
    }
    return (
        <div className="comment-box mt-5">
            <h4 className="fw-bold mb-3">စကားဝိုင်းတွင် ပါဝင်ပါ({reviews.length || 0})</h4>
            {/* Input Box */}
            <div className="card border-0 shodow-sm p-3 mb-5 bg-light rounded-4">
                <form onSubmit={handleReviewSubmit}>
                    <textarea
                        className="form-control border-0 bg-light"
                        rows="3"
                        name="content"
                        placeholder="ဒီဆောင်းပါးအပေါ် သင့်အမြင်ကို ပြောပြပေးပါ..."
                        style={{ resize: "none", boxShadow: "none" }}
                        value={newReview.content}
                        onChange={(e) => { setNewReview({ ...newReview, content: e.target.value }) }}
                    ></textarea>
                    <div className="d-flex justify-content-end mt-2">
                        {isAuthenticate ? (
                            <button className="btn btn-primary px-4 rounded-pill shadow-sm" disabled={btnLoading}>
                                {btnLoading ? 'Sending...' : 'Submit Comment'}
                            </button>
                        ) : (
                            <button className="btn btn-warning px-4 rounded-pill shadow-sm"><Link className="text-decoration-none" to="/login">Login ဝင်ပါ</Link></button>
                        )}

                    </div>
                </form>
            </div>
            {/* Comment section */}
            <div className="comment-list">
                {loading ? (
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="text-center text-danger">{error}</div>
                ) : reviews.length === 0 ? (
                    <div className="text-center">လတ်တလောတွင် မှတ်ချက်များမရှိသေးပါ။</div>
                ) : (
                    reviews?.map(review => (
                        <div key={review.id} className="d-flex mb-4">
                            <div className="flex-shrink-0">
                                <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: '45px', height: '45px', fontWeight: 'bold' }}>{review?.user?.name ? review.user.name.charAt(0).toUpperCase() : 'G'}</div>
                            </div>
                            <div className="flex-grow-1 ms-3">
                                <div className="p-3 bg-white border rounded-4 shadow-xs">
                                    <div className="d-flex justify-content-between">
                                        <h6 className="fw-bold mb-1">{review?.user?.name}</h6>
                                        <small className="text-muted">{review.time_ago}</small>
                                    </div>
                                    <p className="mb-0 text-secondary">{review.content}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
export default Comment;
