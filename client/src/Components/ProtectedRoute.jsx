import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useContext(AuthContext);
    const adminInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (loading) return <div className="min-h-screen bg-dark-100 flex justify-center items-center text-white font-medium">Authentication Checking...</div>;

    // For Admin Routes
    if (adminOnly) {
        if (!adminInfo || adminInfo.role !== 'admin') {
            return <Navigate to="/admin/login" replace />;
        }
    } else {
        // For User Routes
        if (!user) {
            return <Navigate to="/login" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
