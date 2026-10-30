import usePassword from "../../hooks/usePassword";

const UserSecurity = () => {
    const {
        setCurrentPassword,
        currentPassword,
        setPassword,
        password,
        setPasswordConfirmation,
        passwordConfirmation,
        handlePasswordUpdate,
        error,
        btnLoading
    } = usePassword();
    return (
        <div className="row">
            <div className="col-12">
                <form onSubmit={handlePasswordUpdate}>
                    <h5 className="fw-bold mb-3 text-danger">Security Settings</h5>
                    <div className="row mb-4">
                        <div className="col-12 mb-3">
                            <label className="form-label small fw-bold">
                                CURRENT PASSWORD
                            </label>

                            <input
                                type="password"
                                autoComplete="current-password"
                                className={`form-control bg-light ${error.current_password ? "is-invalid" : ""
                                    }`}
                                value={currentPassword}
                                onChange={(e) => {
                                    setCurrentPassword(e.target.value);
                                }}
                                placeholder="Enter current password"
                            />

                            {error.current_password && (
                                <div className="invalid-feedback">
                                    {error.current_password}
                                </div>
                            )}
                        </div>
                        <div className="col-md-6 mb-3 mb-md-0">
                            <label className="form-label small fw-bold">NEW PASSWORD</label>
                            <input type="password"
                                className={`form-control bg-light ${error.password ? 'is-invalid' : ''}`}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                                autoComplete="new-password"
                            />
                            {error.password && <div className="invalid-feedback">{error?.password}</div>}
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small fw-bold">CONFIRM PASSWORD</label>
                            <input type="password"
                                className={`form-control bg-light ${error?.password_confirmation ? 'is-invalid' : ''}`}
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                placeholder="Enter confirm password"
                                autoComplete="new-password"
                            />
                            {error.password_confirmation && <div className="invalid-feedback">{error.password_confirmation}</div>}
                        </div>
                    </div>
                    <div className="d-flex justify-content-end">
                        <button
                            type="submit"
                            className="btn btn-danger px-4"
                            disabled={btnLoading}
                        >
                            {btnLoading ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default UserSecurity;
