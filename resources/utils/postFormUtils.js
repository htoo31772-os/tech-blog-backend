export const validatePostForm = (formData) => {
    const newErrors = {};
    if (!formData.title) {
        newErrors.title = "Title field is required";
    }
    if (!formData.content) {
        newErrors.content = "Content text is required";
    }
    if (!formData.categoryId) {
        newErrors.categoryId = "Category is required";
    }
    return newErrors;
}
