
export const createPostFormData = (formData) => {
    const data = new FormData();

    data.append('title', formData.title);
    data.append('categoryId', formData.categoryId);
    data.append('content', formData.content);
    data.append('status', formData.status);

    if (formData.thumbnail) {
        data.append('thumbnail', formData.thumbnail);
    }

    return data;
};
