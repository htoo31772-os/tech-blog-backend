import react, { Children, useContext } from "react";
import { Navigate } from "react-router-dom";
import authStorage from "../../../utils/authStorage";
import { AuthContext } from "../../context/authContext";
const GuestRoute = ({ children }) => {
    const { user, isAuthenticated } = useContext(AuthContext);
    if (isAuthenticated && user.role) {
        if (user.role === 'admin' || user.role === 'author') {
            return <Navigate to="/admin/dashboard" replace />
        }
        return <Navigate to="/" replace />
    }
    return children;
}
export default GuestRoute;
