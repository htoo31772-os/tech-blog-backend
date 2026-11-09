import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import {AuthContext} from "../../context/authContext";
const ProtectedRoute = ({ allowedRoles }) => {
    const { user, isAuthenticated, isLoading } =
        useContext(AuthContext);
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to='/login' replace />
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to='/login' replace />
    }
    return <Outlet />
}
export default ProtectedRoute;
