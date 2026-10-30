import { useContext} from "react";
import { AuthContext } from "../../context/authContext";
import UserProfile from "../component/userProfile";
import UserSecurity from "../component/userSecurity";
const Profile = () => {
    const { user, setUser } = useContext(AuthContext);

    // Password Update Function

    return (
        <div className="content-card bg-white p-4 shadow-sm rounded">


            {/* Profile & Account Settings */}
            <UserProfile user={user} setUser={setUser} />

            <hr className="my-4" />

            {/* Security & Password Settings */}
            <UserSecurity />

        </div>
    );
}
export default Profile;
