import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../context/authContext";
import commentServices from "../services/commentService";
const useComment = ({ postId }) => {
    const { isAuthenticated } = useContext(AuthContext);

    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const [newReview, setNewReview] = useState({ content: '' });
    const [btnLoading, setBtnLoading] = useState(false);
    const [validationError, setValidationError] = useState({});

    // reveiw များကို ရယူခြင်း
    useEffect(() => {
        if (!postId) return;
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const response = await commentServices.getComment(postId);
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewReview(prevReview => ({
            ...newReview,
            [name]: value
        }))
        if (validationError[name]) {
            setValidationError(prevError => ({
                ...prevError,
                [name]: null
            }))
        }
    }
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.error("မှန်ချက်ရေးရန် login ဝင်ပေးပါ။", { duration: 4000 })
            return;
        }
        if (!newReview.content.trim()) {
            toast.error("မှန်ချက်ရေးပေးပါ။", { duration: 4000 })
            return;
        }

        try {
            setBtnLoading(true);
            const response = await commentServices.updateComment(postId, newReview);
            setReviews(prevReview => ([
                ...prevReview,
                response.data
            ]))
            setNewReview({ content: '' })
            toast.success("မှတ်ချက်ရေးပြီးပါပြီ။ ကျေးဇူးတင်ပါသည်း။");
        } catch (err) {
            console.error("new review error:", err);
            toast.error("တစ်ခုခုမှားယွင်းနေပါသည်။ ထပ်မံကြိုးစားကြည့်ပါ။", { duration: 4000 })
        } finally {
            setBtnLoading(false);
        }
    }
    return {
        reviews,
        error,
        validationError,
        handleInputChange,
        handleReviewSubmit,
        loading,
        btnLoading,
        newReview,
        isAuthenticated
    }
}
export default useComment;
