import axios from "axios"
const commentServices = {
    getComment(postId) {
        return axios.get(`/api/techBlog/post/${postId}/reviews`)
    },
    updateComment(postId, token, data) {
        return axios.post(`/api/techBlog/post/${postId}/newReviews`, data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }
}
export default commentServices;
