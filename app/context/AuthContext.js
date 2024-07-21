'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null)
    const router = useRouter();

    const pathname = usePathname()

    function parseJwt(token) {
        if (!token) { return; }
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            if (storedToken && storedToken !== 'null') {
                setToken(storedToken);
                setUser(parseJwt(storedToken));
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (token) {
                localStorage.setItem('token', token);
                setIsAuthenticated(true);
                if (pathname === '/login') {
                    router.push('/')
                }
            } else {
                localStorage.removeItem('token');
                setIsAuthenticated(false);
            }
        }
    }, [token]);

    const login = (token) => {
        setToken(token);
        setUser(parseJwt(token));
        Cookies.set('__session', token, { expires: 365 }); // Set the token in a cookie
        router.push('/');
    };

    const register = (token) => {
        setToken(token);
        setUser(parseJwt(token));
        router.push('/')
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        Cookies.remove('__session');
        router.push('/login')
    };

    return (
        <AuthContext.Provider value={{ token, login, register, logout, isAuthenticated, user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
