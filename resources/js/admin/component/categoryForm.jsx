import useCategoryForm from "../../hooks/useCategoryForm";

const CategoryForm = ({
    editingCategory,
    onSaved,
    onCancel
}) => {
    const {
        name,
        slug,
        validationErrors,
        serverErrors,
        isSubmitting,
        handleNameChange,
        handleSlugChange,
        handleSubmit
    } = useCategoryForm({
        editingCategory,
        onSaved
    });

    const nameError = validationErrors.name || serverErrors.name;
    const slugError = validationErrors.slug || serverErrors.slug;

    return (
        <div className="col-md-4">
            <div className="card p-4 shadow-sm border-0">
                <h5 className="fw-bold mb-3">
                    {editingCategory ? "Edit Category" : "Add Category"}
                </h5>

                <form onSubmit={handleSubmit}>
                    {/* Category Name */}
                    <div className="mb-3">
                        <label className="form-label small fw-bold">
                            CATEGORY NAME
                        </label>

                        <input
                            type="text"
                            className={`form-control ${nameError ? "is-invalid" : ""}`}
                            value={name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder="e.g. Category"
                        />

                        {nameError && (
                            <div className="text-danger">
                                {nameError}
                            </div>
                        )}
                    </div>

                    {/* Slug Name */}
                    <div className="mb-3">
                        <label className="form-label small fw-bold">
                            SLUG
                        </label>

                        <input
                            type="text"
                            className={`form-control ${slugError ? "is-invalid" : ""}`}
                            value={slug}
                            onChange={(e) => handleSlugChange(e.target.value)}
                            placeholder="e.g. slug"
                        />

                        {slugError && (
                            <div className="text-danger">
                                {slugError}
                            </div>
                        )}
                    </div>

                    <div className="d-flex gap-2">
                        <button
                            type="submit"
                            className={`btn w-100 ${editingCategory ? "btn-success" : "btn-primary"}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "Processing"
                                : editingCategory
                                    ? "Update Category"
                                    : "Add New Category"}
                        </button>

                        {editingCategory && (
                            <button
                                type="button"
                                className="btn btn-secondary w-100"
                                onClick={onCancel}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryForm;
