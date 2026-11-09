import { useState } from "react";
import toast from "react-hot-toast";
import categoryService from "../../services/categoryService";

const CategoryTable = ({
    categories,
    isLoading,
    error,
    onEdit,
    onDeleted
}) => {
    const [deletingId, setDeletingId] = useState(null);

    // Delete Category
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Category ကို ဖျက်ရန် သေချာပါသလား?"
        );

        if (!confirmed) return;

        setDeletingId(id);

        try {
            await categoryService.deleteCategory(id);

            await onDeleted();

            toast.success("Category ဖျက်သိမ်းပြီးပါပြီ။");

        } catch (err) {
            console.error("Delete category error:", err);
            const message = err.response?.data?.message
                || "Category ဖျက်သိမ်းမှု မအောင်မြင်ပါ။";
            toast.error(message);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="col-md-8">
            <div className="card shadow-sm border-0">
                <div className="card-body">
                    <h5 className="fw-bold mb-3">
                        Category List
                    </h5>

                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Category Name</th>
                                    <th>Slug</th>
                                    <th>Posts</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            Loading categories...
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan="5" className="text-center text-danger">
                                            {error}
                                        </td>
                                    </tr>
                                ) : categories.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            No categories found.
                                        </td>
                                    </tr>
                                ) : (
                                    categories.map(category => (
                                        <tr key={category.id}>
                                            <td>{category.id}</td>

                                            <td>{category.name}</td>

                                            <td>{category.slug}</td>

                                            <td>
                                                {category.posts_count}
                                            </td>

                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-warning"
                                                        onClick={() => onEdit(category)}
                                                        disabled={deletingId !== null}
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDelete(category.id)}
                                                        disabled={deletingId !== null}
                                                    >
                                                        {deletingId === category.id
                                                            ? "Deleting..."
                                                            : "Delete"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryTable;
