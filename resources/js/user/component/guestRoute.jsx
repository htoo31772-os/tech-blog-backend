import react, { Children } from "react";
import { Navigate } from "react-router-dom";
const GuestRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
        if (role === 'admin' || role === 'author') {
            return <Navigate to="/admin/dashboard" replace />
        }
        return <Navigate to="/" replace />
    }
    return children;
}
export default GuestRoute;
