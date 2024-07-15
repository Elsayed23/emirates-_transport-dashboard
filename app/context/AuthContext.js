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

    function parseJwt(token) {
        if (!token) { return; }
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    }


    const pathname = usePathname()

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            if (storedToken && storedToken !== 'null') {
                setToken(storedToken);
                setUser(parseJwt(storedToken));
                setIsAuthenticated(true);
                if (pathname === '/login' || pathname === '/register') {
                    router.push('/')
                } else {
                    router.push(pathname)
                }
            } else {
                setIsAuthenticated(false);
                router.push('/login');
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (token) {
                localStorage.setItem('token', token);
                setIsAuthenticated(true);
                if (pathname === '/login' || pathname === '/register') {
                    router.push('/')
                } else {
                    router.push(pathname)
                }
            } else {
                localStorage.removeItem('token');
                setIsAuthenticated(false);
                router.push('/login');
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
        Cookies.remove('__session'); // Remove the token from the cookie
    };

    return (
        <AuthContext.Provider value={{ token, login, register, logout, isAuthenticated, user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
