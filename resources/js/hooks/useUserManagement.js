import { useEffect, useState } from "react";
import UserService from "../services/userService";
import toast from "react-hot-toast";

const useUserManagement = ({ currentUser }) => {
    const [users, setUsers] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    // get users
    const fetchUsers = async (pageNumber) => {
        setLoading(true);
        setError("");
        try {
            const res = await UserService.getUser(pageNumber);
            setUsers(res.data.data);
            setMeta(res.data);
        } catch (err) {
            console.error("user error:", err);
            setError("User data ယူလို့မရပါ။");
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (currentUser) {
            fetchUsers(1);
        }
    }, [currentUser?.id])

    // change role to user
    const [isUpdating, setIsUpdating] = useState(false);
    const handleRoleChange = async (userId, newRole) => {
        const confirmed = window.confirm("User role ကို changeရန်သေချာပါသလား?")
        if (!confirmed) return;
        setIsUpdating(true)
        try {
            await UserService.updateUserRole(userId, newRole);
            fetchUsers(meta.current_page);
            toast.success('User role ပြောင်းပြီးပါပြီ။')
        } catch (err) {
            if (err.response?.status === 404) {
                toast.error("User not found.");
            } else {
                toast.error('User role ပြောင်းလဲမှု မအောင်မြင်ပါ။')
            }
        } finally {
            setIsUpdating(false);
        }
    }

    // Delete user
    const [deletingUserId, setDeletingUserId] = useState(null);
    const handleDelete = async (userId) => {
        if (userId === currentUser?.id) {
            toast.error("မိမိကိုယ်ကိုတော့ ပြန်မဖျက်ပါနဲ့!");
            return;
        }
        const confirmed = window.confirm("User ကို delete လုပ်ရန်သေချာပါသလား?")
        if (!confirmed) return;
        setDeletingUserId(userId);
        try {
            await UserService.deleteUser(userId);
            fetchUsers(meta.current_page);
            toast.success("User ကို delete လုပ်ပြီးပါပြီ။");
        } catch (err) {
            if (err.response?.status === 404) {
                toast.error("User not found.");
            } else {
                toast.error("User ကို delete လုပ်မရပါ။")
            }
        } finally {
            setDeletingUserId(null);
        }
    }
    return {
        users,
        meta,
        loading,
        error,
        isUpdating,
        fetchUsers,
        handleRoleChange,
        deletingUserId,
        handleDelete
    }
}
export default useUserManagement;
