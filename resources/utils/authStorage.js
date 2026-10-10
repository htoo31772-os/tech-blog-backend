const TOKEN_KEY = 'token';
const ROLE_KEY = "role";
const USER_KEY = "user";

const authStorage = {
    saveAuth(token, user) {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(ROLE_KEY, user.role);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },
    getRole() {
        return localStorage.getItem(ROLE_KEY);
    },
    getUser() {
        const user = localStorage.getItem(USER_KEY);
        if (!user) {
            return null;
        }
        try {
            return JSON.parse(user);
        } catch (err) {
            console.error("Failed to parse stored user:", err);
            return null;
        }
    },
    clearAuth() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(ROLE_KEY);
        localStorage.removeItem(USER_KEY);
    }
}
export default authStorage;
