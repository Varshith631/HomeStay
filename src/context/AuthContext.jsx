import React, { createContext, useContext, useState } from 'react';
import { useData } from './DataContext';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const { users } = useData();
    const [currentUser, setCurrentUser] = useState(() => {
        const saved = localStorage.getItem('nexus_auth');
        return saved ? JSON.parse(saved) : null;
    });

    const login = (email, password) => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            if (user.status === 'Pending') {
                return { success: false, message: "Account is awaiting Admin approval." };
            }
            if (user.status === 'Rejected') {
                return { success: false, message: "Account access denied." };
            }
            const { password, ...userWithoutPassword } = user;
            setCurrentUser(userWithoutPassword);
            localStorage.setItem('nexus_auth', JSON.stringify(userWithoutPassword));
            return { success: true, user: userWithoutPassword };
        }
        return { success: false, message: "Invalid credentials" };
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('nexus_auth');
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
