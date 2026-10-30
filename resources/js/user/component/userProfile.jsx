import useProfile from "../../hooks/useProfile";

const UserProfile = ({ user, setUser }) => {
    const {
        formData,
        previewImage,
        error,
        handleImageChange,
        handleInputChange,
        handleProfileUpdate,
        isLoading
    } = useProfile({ user, setUser })
    return (
        <div className="row mb-5">
            {/* Profile Picture & User Info */}
            <div className="col-lg-4 text-center border-end pe-lg-4 mb-4 mb-lg-0 d-flex flex-column align-items-center justify-content-center">
                <h5 className="fw-bold mb-4">Profile Picture</h5>
                <div className="position-relative d-inline-block">
                    <img
                        src={previewImage || (user?.avator ? `${import.meta.env.VITE_API_URL}/storage/user/${user.avator}` : "/images/user.jpg")}
                        className="rounded-circle shadow-sm border p-1"
                        style={{ width: '130px', height: '130px', objectFit: 'cover' }}
                        alt={`${user?.name ?? "User"} profile picture`}
                    />
                    <label htmlFor="upload-photo" className="btn btn-sm btn-primary position-absolute bottom-0 end-0 rounded-circle">
                        <i className="bi bi-camera"></i>
                        <input type="file" onChange={handleImageChange} className="d-none" id="upload-photo" accept="image/*" />
                    </label>
                    {error.image && (
                        <div className="text-danger small mt-2">
                            {error.image}
                        </div>
                    )}
                </div>
                <div className="mt-3">
                    <h6 className="fw-bold mb-1">{user?.name}</h6>
                    <p className="badge bg-info-subtle text-info mb-0">{user?.role}</p>
                </div>
            </div>

            {/* Account Settings Form */}
            <div className="col-lg-8 ps-lg-5">
                <h5 className="fw-bold mb-4">Account Settings</h5>
                <form onSubmit={handleProfileUpdate}>
                    <div className="row mb-3">
                        <div className="col-md-6 mb-3 mb-md-0">
                            <label className="form-label small fw-bold">FULL NAME</label>
                            <input type="text"
                                name="name"
                                className={`form-control bg-light ${error?.name ? 'is-invalid' : ''}`}
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                            {error.name && <div className="invalid-feedback">{error.name}</div>}
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small fw-bold">EMAIL ADDRESS</label>
                            <input type="email" className="form-control bg-light" value={user?.email ?? ""} disabled />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label small fw-bold">SHORT BIO</label>
                        <textarea className="form-control bg-light"
                            name="bio"
                            rows="3"
                            value={formData.bio}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>
                    <div className="d-flex justify-content-end">
                        <button
                            type="submit"
                            className="btn btn-primary px-4 rounded-pill"
                            disabled={isLoading}
                        >
                            {isLoading ? "Updating..." : "Update Profile"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default UserProfile;
