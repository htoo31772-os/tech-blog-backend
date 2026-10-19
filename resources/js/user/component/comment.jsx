import { Link } from "react-router-dom";
import useComment from "../../hooks/useComment";
const Comment = ({ postId }) => {
    const {
        reviews,
        error,
        validationError,
        handleInputChange,
        handleReviewSubmit,
        loading,
        btnLoading,
        newReview,
        isAuthenticated
    } = useComment({ postId });
    return (
        <div className="comment-box mt-5">
            <h4 className="fw-bold mb-3">စကားဝိုင်းတွင် ပါဝင်ပါ။({reviews.length || 0})</h4>
            {/* Input Box */}
            <div className="card border-0 shodow-sm p-3 mb-5 bg-light rounded-4">
                <form onSubmit={handleReviewSubmit}>
                    <textarea
                        className={`form-control border-0 bg-light ${validationError.content ? 'is-invalid' : ''}`}
                        rows="3"
                        name="content"
                        id="content"
                        placeholder="ဒီဆောင်းပါးအပေါ် သင့်အမြင်ကို ပြောပြပေးပါ..."
                        style={{ resize: "none", boxShadow: "none" }}
                        value={newReview.content}
                        onChange={handleInputChange}
                    ></textarea>

                    <div className="d-flex justify-content-end mt-2">
                        {isAuthenticated ? (
                            <button className="btn btn-primary px-4 rounded-pill shadow-sm" disabled={btnLoading}>
                                {btnLoading ? 'Sending...' : 'Submit Comment'}
                            </button>
                        ) : (
                            <Link className="btn btn-warning px-4 rounded-pill shadow-sm text-decoration-none" to="/login">Login ဝင်ပါ</Link>
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
                                {review?.user?.avator ? (
                                    <img
                                        src={`http://localhost:8000/storage/user/${review.user.avator}`}
                                        alt={`${review.user.avator ?? "User"} profile`}
                                        className="rounded-circle"
                                        width="45"
                                        height="45"
                                        style={{ objectFit: "cover" }}
                                    />
                                ) : (
                                    <div
                                        className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center"
                                        style={{
                                            width: "45px",
                                            height: "45px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {review?.user?.name
                                            ? review.user.name.charAt(0).toUpperCase()
                                            : "G"}
                                    </div>
                                )}
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
