import api from "../api/api"

const UserService = {
    getUser: async (pageNumber) => {
        return await api.get(`/api/admin/users?page=${pageNumber}`)
    },
    updateUserRole: async (userId, newRole) => {
        return await api.post(`/api/admin/users/${userId}/role`, {
            role: newRole
        })
    },
    deleteUser: async (userId) => {
        return await api.delete(`/api/admin/users/${userId}`)
    }
}
export default UserService;
