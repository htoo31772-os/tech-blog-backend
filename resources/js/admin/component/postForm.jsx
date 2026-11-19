
const PostForm = ({
    formData,
    onFieldChange,
    categories,
    validationError,
    image,
    onImageChange,
    onSubmit,
    submitLabel
}) => {

    return (
        <div className="content-card bg-white p-4 shadow-sm rounded">
            <h5 className="fw-bold mb-4">Create New Article</h5>

            <form onSubmit={onSubmit}>
                <div className="row">

                    {/* Left Side */}
                    <div className="col-md-8">
                        <div className="mb-3">
                            <label className="form-label small fw-bold">
                                POST TITLE
                            </label>

                            <input
                                type="text"
                                className={`form-control ${validationError.title ? 'is-invalid' : ''}`}
                                name="title"
                                value={formData.title}
                                onChange={onFieldChange}
                                placeholder="Enter title here..."
                            />

                            {validationError.title && (
                                <div className="text-danger">
                                    {validationError.title}
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="form-label small fw-bold">
                                CONTENT
                            </label>
                            <div className="editor-toolbar border p-2 bg-light rounded-top">
                                <button type="button" className="btn btn-sm btn-light border me-1">B</button>
                                <button type="button" className="btn btn-sm btn-light border me-1">I</button>
                                <button type="button" className="btn btn-sm btn-light border"><i className="bi bi-image"></i></button>
                            </div>
                            <textarea
                                className={`form-control rounded-0 rounded-bottom shadow-none ${validationError.content ? 'is-invalid' : ''}`}
                                name="content"
                                value={formData.content}
                                onChange={onFieldChange}
                                rows="12"
                                style={{ borderTop: 'none' }}
                                placeholder="Write your story..."
                            />

                            {validationError.content && (
                                <div className="text-danger">
                                    {validationError.content}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="col-md-4">
                        <div className="mb-3">
                            <label className="form-label small fw-bold">
                                CATEGORY
                            </label>

                            <select
                                className={`form-select ${validationError.categoryId ? 'is-invalid' : ''}`}
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={onFieldChange}
                            >
                                <option value="">Select Option</option>

                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>

                            {validationError.categoryId && (
                                <div className="text-danger">
                                    {validationError.categoryId}
                                </div>
                            )}
                        </div>

                        {/* Status */}
                        <div className="mb-3">
                            <label className="form-label small fw-bold">
                                STATUS
                            </label>

                            <select
                                className="form-select"
                                value={formData.status}
                                onChange={onFieldChange}
                            >
                                <option value="draft">Draft</option>
                                <option value="public">Public</option>
                            </select>
                        </div>

                        {/* Thumbnail */}
                        <div className="mb-4">
                            <label className="form-label small fw-bold">
                                THUMBNAIL
                            </label>

                            <div
                                className="p-4 border border-dashed text-center bg-light rounded-3"
                                onClick={() => document.getElementById('thumbUpload').click()}
                                style={{ cursor: 'pointer', borderStyle: 'dashed' }}
                            >
                                {image ? (
                                    <img
                                        src={image}
                                        className="img-fluid rounded"
                                        alt="Post image"
                                    />
                                ) : (
                                    <>
                                        <i className="bi bi-upload fs-2 text-muted"></i>
                                        <p className="small text-muted mt-2">
                                            Click to upload thumbnail
                                        </p>
                                    </>
                                )}

                                <input
                                    type="file"
                                    className="d-none"
                                    accept="image/*"
                                    id="thumbUpload"
                                    onChange={onImageChange}
                                />
                            </div>

                            {validationError.thumbnail && (
                                <div className="text-danger">
                                    {validationError.thumbnail}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100 py-2 fw-bold"
                        >
                            <i className="bi bi-send me-2"></i>
                            {submitLabel}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PostForm;
