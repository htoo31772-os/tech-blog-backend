import { Navigate, Outlet } from "react-router-dom";
import authStorage from "../../../utils/authStorage";
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
