import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => {
        const storedTokens = localStorage.getItem('authTokens');
        try {
            return storedTokens ? JSON.parse(storedTokens) : null;
        } catch (e) {
            console.error("Error parsing tokens from localStorage", e);
            return null;
        }
    });

    const [user, setUser] = useState(() => {
        const storedTokens = localStorage.getItem('authTokens');
        if (storedTokens) {
            try {
                const tokens = JSON.parse(storedTokens);
                if (tokens && tokens.access) {
                    const base64Url = tokens.access.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));
                    return JSON.parse(jsonPayload);
                }
            } catch (e) {
                console.error("Error parsing user from tokens", e);
            }
        }
        return null;
    });

    const [loading, setLoading] = useState(true);

    const loginUser = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:8000/api/token/', {
                email,
                password
            });
            const data = response.data;
            
            if (response.status === 200) {
                setAuthTokens(data);
                const base64Url = data.access.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                setUser(JSON.parse(jsonPayload));
                localStorage.setItem('authTokens', JSON.stringify(data));
                return { success: true };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.response?.data?.detail || 'Error al iniciar sesión' };
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
    };

    const contextData = {
        user,
        authTokens,
        loginUser,
        logoutUser
    };

    useEffect(() => {
        setLoading(false);
    }, [authTokens]);

    return (
        <AuthContext.Provider value={contextData}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
