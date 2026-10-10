import axios from "axios";
import Comment from "../component/comment";
import react, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

const PostDetail = () => {
    const { id } = useParams();
    const [postDetail, setPostDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchPostDetail = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/techBlog/post/postDetail/${id}`)
                setPostDetail(response.data);
            } catch (err) {
                console.error('postDetail error:', err);
                setError("Post Detail အား ရယူနိုင်ခြင်းမရှိပါ။");
            } finally {
                setLoading(false);
            }
        }
        fetchPostDetail();
    }, [id])

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                {loading ? (
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="text-center text-danger">{error}</div>
                ) : (
                    <div className="col-lg-8">
                        <h1 className="fw-bold" style={{ lineHeight: '1.4', color: '#2c3e50' }}>{postDetail?.title}</h1>
                        <div className="d-flex align-items-center mb-4">
                            <div className="bg-secondary rounded-circle me-2" style={{ width: '40px', height: '40px' }}></div>
                            <p className="text-muted mb-0">By <strong>{postDetail?.user?.name}</strong> • {new Date(postDetail?.created_at).toLocaleDateString('en-Us', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}</p>
                        </div>

                        <img
                            src={postDetail?.image_url}
                            className="img-fluid rounded-4 shadow-sm mb-4"
                            alt="PostDetail image"
                        />
                        <div className="content mb-5">
                            <p>{postDetail?.body}</p>
                        </div>
                        <hr className="my-5" />

                        <Comment postId={postDetail?.id} />
                    </div>
                )}
            </div>
        </div>
    );
}
export default PostDetail;
