import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(() => {
        const saved = localStorage.getItem('nexus_auth');
        return saved ? JSON.parse(saved) : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem('nexus_token') || null;
    });

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

    // Automatically inject token into all fetches if available
    const authFetch = async (url, options = {}) => {
        const fullUrl = url.startsWith('http') ? url : `${apiBaseUrl}${url}`;
        const t = localStorage.getItem('nexus_token');
        const headers = { ...options.headers };
        if (t) {
            headers['Authorization'] = `Bearer ${t}`;
        }
        return fetch(fullUrl, { ...options, headers });
    };

    const login = async (email, password) => {
        try {
            const res = await fetch(`${apiBaseUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            let data = {};
            try { data = await res.json(); } catch(e) {}

            if (res.ok) {
                if (data.requiresOtp) {
                    return { success: true, otpRequired: true, message: data.message };
                }
                const user = {
                    email: data.email,
                    role: data.role.replace("ROLE_", ""),
                    name: data.firstName + " " + data.lastName,
                };
                setCurrentUser(user);
                setToken(data.token);
                localStorage.setItem('nexus_auth', JSON.stringify(user));
                localStorage.setItem('nexus_token', data.token);
                return { success: true, user };
            }
            return { success: false, message: data.message || "Invalid credentials" };
        } catch (error) {
            return { success: false, message: "Server connection failed" };
        }
    };

    const verifyOtp = async (email, otpCode) => {
        try {
            const res = await fetch(`${apiBaseUrl}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otpCode })
            });
            
            let data = {};
            try { data = await res.json(); } catch(e) {}

            if (res.ok) {
                const user = {
                    email: data.email,
                    role: data.role.replace("ROLE_", ""),
                    name: data.firstName + " " + data.lastName,
                };
                setCurrentUser(user);
                setToken(data.token);
                localStorage.setItem('nexus_auth', JSON.stringify(user));
                localStorage.setItem('nexus_token', data.token);
                return { success: true, user };
            }
            return { success: false, message: data.message || "Invalid OTP code" };
        } catch (error) {
            return { success: false, message: "Server connection failed" };
        }
    };

    const signup = async (firstName, lastName, email, password, role) => {
        try {
            const res = await fetch(`${apiBaseUrl}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, email, password, role })
            });

            let data = {};
            try { data = await res.json(); } catch(e) {}

            if (res.ok) {
                if (data.requiresOtp) {
                    return { success: true, otpRequired: true, message: data.message };
                }
                const user = {
                    email: data.email,
                    role: data.role.replace("ROLE_", ""),
                    name: data.firstName + " " + data.lastName,
                };
                setCurrentUser(user);
                setToken(data.token);
                localStorage.setItem('nexus_auth', JSON.stringify(user));
                localStorage.setItem('nexus_token', data.token);
                return { success: true, user };
            }
            return { success: false, message: data.message || "Signup failed" };
        } catch (error) {
            return { success: false, message: "Server connection failed" };
        }
    };

    const fetchMe = async (providedToken) => {
        try {
            const res = await fetch(`${apiBaseUrl}/api/user/me`, {
                headers: { 'Authorization': `Bearer ${providedToken}` }
            });
            if (res.ok) {
                const data = await res.json();
                const user = {
                    email: data.email,
                    role: data.role.replace("ROLE_", ""),
                    name: data.firstName + " " + data.lastName,
                    imageUrl: data.imageUrl
                };
                setCurrentUser(user);
                setToken(providedToken);
                localStorage.setItem('nexus_auth', JSON.stringify(user));
                localStorage.setItem('nexus_token', providedToken);
                return user;
            }
        } catch (e) { console.error(e); }
        return null;
    };

    const logout = () => {
        setCurrentUser(null);
        setToken(null);
        localStorage.removeItem('nexus_auth');
        localStorage.removeItem('nexus_token');
    };

    return (
        <AuthContext.Provider value={{ currentUser, token, login, verifyOtp, signup, logout, authFetch, fetchMe }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
