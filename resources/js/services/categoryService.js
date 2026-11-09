import api from "../api/api";

const categoryService = {
    getCategories: async () => {
        const res = await api.get('/api/admin/category');
        return res.data;
    },
    createCategory: async (data) => {
        const res = await api.post('/api/admin/category/store', data)
        return res.data;
    },
    updateCategory: async (id, data) => {
        const res = await api.post(`/api/admin/category/update/${id}`, data);
        return res.data;
    },
    deleteCategory: async (id) => {
        await api.post(`/api/admin/category/delete/${id}`);
    }
}
export default categoryService;
