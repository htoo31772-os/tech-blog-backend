import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Profile = ({ user, setUser }) => {
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [email, setEmail] = useState("");
    const [previewImage, setPreviewImage] = useState(null);
    const token = localStorage.getItem('token');
    console.log('TOKEN:',token);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setBio(user.bio || '');
            setEmail(user.email);
        }
    }, [user])
    // Update profile
    const [image, setImage] = useState(null);
    const [error, setError] = useState({});
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
            setImage(file);
        }
    }
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setError({});
        if (!name) {
            setError({ name: 'Name field is required' });
            return;
        }
        const formData = new FormData();
        formData.append("name", name);
        formData.append("bio", bio);
        if (image && image instanceof File) {
            formData.append("image", image)
        };
        try {
            const res = await axios.post('/api/user/profile-update', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            if (previewImage) {
                URL.revokeObjectURL(previewImage); // Memory clear လုပ်တာ
            }
            setPreviewImage(null);
            setImage(null);
            setUser(res.data.user)
            localStorage.setItem('user', JSON.stringify(res.data.user));
            toast.success("Profile Update အောင်မြင်ပါတယ်");
            console.log("New Bio from Backend:", res.data.user.bio);
            console.log("New Avatar from Backend:", res.data.user.avator);
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setError(err.response.data.errors);
                console.log(err.response.data.errors);

            } else {
                toast.error("တစ်ခုခု မှားယွင်းနေပါတယ်");
            }
        }
    }
    // Password Update Function
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setError({});
        if (!password) {
            setError({ password: 'password field is required' });
        }
        if (!passwordConfirmation) {
            setError({ passwordConfirmation: 'passwordconfirmation field is required' });
        } else if (password !== passwordConfirmation) {
            setError({ passwordConfirmation: 'Password and passwordConfimation must same' });
        }
        try {
            await axios.post("/api/user/password-update", {
                password: password,
                password_confirmation: passwordConfirmation
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPassword("");
            setPasswordConfirmation("");
            toast.success("Password ပြောင်းလဲပြီးပါပြီ");
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setError(err.response.data.errors);
            }
        }
    };
    return (
        <div className="content-card bg-white p-4 shadow-sm rounded">
            <div className="row">
                {/* Profile Picture Side */}
                <div className="col-lg-4 text-center border-end">
                    <h5 className="fw-bold mb-4">Profile Picture</h5>
                    <div className="position-relative d-inline-block">
                        <img
                            src={previewImage || (user?.avator ? `http://localhost:8000/storage/user/${user.avator}` : "/images/user.jpg")}
                            className="rounded-circle shadow-sm border p-1"
                            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                        />
                        <label htmlFor="upload-photo" className="btn btn-sm btn-primary position-absolute bottom-0 end-0 rounded-circle">
                            <i className="bi bi-camera"></i>
                            <input type="file" onChange={handleImageChange} className="d-none" id="upload-photo" accept="image/*" />
                        </label>
                    </div>
                    <div className="mt-4">
                        <h6 className="fw-bold">{user?.name}</h6>
                        <p className="badge bg-info-subtle text-info">{user?.role}</p>
                    </div>
                </div>

                {/* Settings Side */}
                {/* Profile */}
                <div className="col-lg-8 ps-lg-5">
                    <h5 className="fw-bold mb-4">Account Settings</h5>
                    <form onSubmit={handleProfileUpdate}>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label small fw-bold">FULL NAME</label>
                                <input type="text"
                                    className={`form-control bg-light ${error?.name ? 'is-invalid' : ''}`}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                {/* Error Message */}
                                {error.name && <div className="invalid-feedback">{error.name}</div>}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small fw-bold">EMAIL ADDRESS</label>
                                <input type="email" className="form-control bg-light" value={email} disabled />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label small fw-bold">SHORT BIO</label>
                            <textarea className="form-control bg-light"
                                rows="3"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="d-flex justify-content-end">
                            <button type="submit" className="btn btn-primary px-4 rounded-pill">Update Profile</button>
                        </div>
                    </form>
                    <hr className="my-4" />
                    {/* Security */}
                    <form onSubmit={handlePasswordUpdate}>
                        <h6 className="fw-bold mb-3 text-danger">Security</h6>
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label className="form-label small fw-bold">NEW PASSWORD</label>
                                <input type="password"
                                    className={`form-control bg-light ${error.password ? 'is-invalid' : ''}`}
                                    value={password}
                                    onChange={((e) => setPassword(e.target.value))}
                                    placeholder="••••••••" />
                                {/* Error Message */}
                                {error.password && <div className="invalid-feedback">{error?.password}</div>}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small fw-bold">CONFIRM PASSWORD</label>
                                <input type="password"
                                    className={`form-control bg-light ${error?.passwordConfirmation ? 'is-invalid' : ''}`}
                                    value={passwordConfirmation}
                                    onChange={(e => setPasswordConfirmation(e.target.value))}
                                    placeholder="••••••••" />
                                {/* Error Message */}
                                {error.passwordConfirmation && <div className="invalid-feedback">{error.passwordConfirmation}</div>}
                            </div>
                        </div>
                        <div className="d-flex justify-content-end gap-2">
                            <button type="submit" className="btn btn-primary px-4">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default Profile;
