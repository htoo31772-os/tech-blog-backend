import {
    createContext,
    useEffect,
    useState,
} from "react";

import authStorage from "../../utils/authStorage";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = authStorage.getToken();
        const savedUser = authStorage.getUser();

        if (token && savedUser) {
            setUser(savedUser);
        } else {
            authStorage.clearAuth();
        }

        setIsLoading(false);
    }, []);

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        setUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
