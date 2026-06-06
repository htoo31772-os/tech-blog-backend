import react, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";
import Home from "./user/mainPage/home";
import AdminLayout from "./admin/adminLayout";
import AdminDashboard from "./admin/adminDashboard";
import UserManagement from "./admin/userManagement";
import CreatePost from "./admin/createPost";
import Categories from "./admin/categories";
import Profile from "./user/mainPage/profile";
import Login from "./user/mainPage/login";
import Register from "./user/mainPage/register";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./user/component/protecetecRoute";
import EditPost from "./admin/editPost";
import GuestRoute from "./user/component/guestRoute";
import PostDetail from "./user/mainPage/postDetail";
import CategoryPage from "./user/mainPage/categoryPage";
import AdminPost from "./admin/adminPost";
import NewsletterList from "./admin/adminNewLetter";
const MainRouter = () => {
    const [isLoggin, setIsLoggin] = useState(false);
    const [user, setUser] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        if (token) {
            setIsLoggin(true)
        } else {
            setIsLoggin(false)
        }
    }, [])
    return (
        <BrowserRouter>
            <Toaster position="top-center" reverseOrder={false} />
            <Routes>
                <Route path="/" element={<Home setIsLoggin={setIsLoggin} setUser={setUser} user={user} isLoggin={isLoggin} />} />
                <Route path="/login" element={
                    <GuestRoute>
                        <Login setUser={setUser} />
                    </GuestRoute>
                } />
                <Route path="/register" element={
                    <GuestRoute>
                        <Register setUser={setUser} />
                    </GuestRoute>
                } />
                <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
                <Route path="/techBlog/post/postDetail/:slug" element={<PostDetail isLoggin={isLoggin} />} />
                <Route path="/techBlog/category/:slug" element={<CategoryPage />} />
                {/* Admin */}
                <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin', 'author']} />}>
                    <Route element={<AdminLayout user={user} />}>
                        <Route index element={<AdminDashboard user={user} />} />
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="users" element={<UserManagement user={user} />} />
                        <Route path="post" element={<AdminPost />} />
                        <Route path="create-post" element={<CreatePost />} />
                        <Route path="post/edit/:id" element={<EditPost />} />
                        <Route path="categories" element={<Categories />} />
                        <Route path="newLetter" element={<NewsletterList />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
export default MainRouter;
createRoot(document.getElementById('root')).render(<MainRouter />);
