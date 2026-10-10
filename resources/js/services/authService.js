import axios from "axios"

const authService = {
    login(formData) {
        return axios.post('/api/login', formData)
    },
    register(formData) {
        return axios.post('/api/register', formData)
    },
    logout(token) {
        return axios.post('/api/logout', {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }
}
export default authService;
