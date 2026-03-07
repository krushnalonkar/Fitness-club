import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('gymToken'));
    const [loading, setLoading] = useState(true);

    // Set Base URL for Axios - Update this to your Render URL for production
    const API_BASE_URL = 'https://fitness-club-68fm.onrender.com';
    axios.defaults.baseURL = API_BASE_URL;

    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    const res = await axios.get('/api/users/dashboard');
                    setUser(res.data);
                } catch (error) {
                    console.error('Error fetching user:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        fetchUser();
    }, [token]);

    const login = async (identifier, password) => {
        try {
            const res = await axios.post('/api/auth/login', { identifier, password });
            localStorage.setItem('gymToken', res.data.token);
            localStorage.setItem('userInfo', JSON.stringify(res.data)); // Added for compatibility
            setToken(res.data.token);
            setUser(res.data);
            return res.data;
        } catch (error) {
            throw error.response?.data?.message || 'Login failed';
        }
    };

    const register = async (name, email, phone, password, height, weight) => {
        try {
            const res = await axios.post('/api/auth/register', { name, email, phone, password, height, weight });
            return res.data;
        } catch (error) {
            throw error.response?.data?.message || 'Registration failed';
        }
    };

    const updateProfile = async (name, email, phone, currentPassword, password, height, weight) => {
        try {
            const res = await axios.put('/api/users/profile', { name, email, phone, currentPassword, password, height, weight });
            setUser(res.data);
            return res.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to update profile';
        }
    };

    const bookPlan = async (plan) => {
        try {
            const res = await axios.post('/api/users/book-plan', plan);
            setUser({ ...user, bookedPlans: res.data });
            return res.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to book plan';
        }
    };

    const logout = () => {
        localStorage.removeItem('gymToken');
        localStorage.removeItem('userInfo');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, updateProfile, bookPlan, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
