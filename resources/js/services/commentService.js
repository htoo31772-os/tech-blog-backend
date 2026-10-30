import api from "../api/api";
const commentServices = {
    getComment(postId) {
        return api.get(`/api/techBlog/post/${postId}/reviews`)
    },
    updateComment(postId, data) {
        return api.post(`/api/techBlog/post/${postId}/newReviews`, data)
    }
}
export default commentServices;
