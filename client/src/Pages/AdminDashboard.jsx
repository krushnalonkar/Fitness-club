import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaLayerGroup, FaTimes, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaChartLine, FaUsers, FaDumbbell, FaEnvelopeOpenText, FaShieldAlt, FaTerminal } from 'react-icons/fa';
import AdminSidebar from '../Components/AdminSidebar';
import AdminHeader from '../Components/AdminHeader';
import axios from 'axios';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalRevenue: 0,
        activeTrainers: 0,
        newInquiries: 0,
        chartData: []
    });
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [addForm, setAddForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'user' });
    const [message, setMessage] = useState('');

    const maxRevenue = Math.max(...(stats.chartData?.map(d => d.revenue) || [10000]));
    const dynamicMax = maxRevenue > 100 ? maxRevenue * 1.2 : 10000;

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchStats = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!userInfo) return;

            const res = await axios.get('/api/admin/stats', {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setStats(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Dashboard Stats Fetch Error:", error);
            setLoading(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        if (addForm.password !== addForm.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            await axios.post('/api/users', {
                name: addForm.name,
                email: addForm.email,
                password: addForm.password,
                role: addForm.role
            }, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });

            setMessage("New user added successfully!");
            setShowAddModal(false);
            setAddForm({ name: '', email: '', password: '', confirmPassword: '', role: 'user' });
            fetchStats();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to add user.");
        }
    };

    return (
        <div className="flex bg-[#0a0a0a] min-h-screen">
            <AdminSidebar />
            <AdminHeader />
            <div className="flex-1 lg:ml-72 pt-24 px-4 sm:px-8 pb-12 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-7xl mx-auto"
                >
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                Admin <span className="text-purple-600">Dashboard</span>
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">Management overview and gym statistics.</p>
                        </div>

                        <button 
                            onClick={() => setShowAddModal(true)}
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-purple-700 transition shadow-lg shadow-purple-600/20"
                        >
                            <FaUserPlus /> Add New User
                        </button>
                    </div>

                    {message && (
                        <div className="bg-green-600/10 border border-green-600/20 text-green-500 p-3 rounded-lg mb-8 text-sm text-center">
                            {message}
                        </div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
                        {[
                            { label: 'Total Users', value: stats.totalUsers, icon: FaUsers, color: 'text-purple-600' },
                            { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: FaChartLine, color: 'text-blue-500' },
                            { label: 'Active Trainers', value: stats.activeTrainers, icon: FaDumbbell, color: 'text-yellow-500' },
                            { label: 'New Inquiries', value: stats.newInquiries, icon: FaEnvelopeOpenText, color: 'text-green-500' }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-[#111] p-6 rounded-xl border border-white/10 flex flex-col items-center text-center">
                                <item.icon className={`${item.color} mb-3`} size={24} />
                                <h3 className="text-xl font-bold text-white mb-1">{loading ? '...' : item.value}</h3>
                                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">{item.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 mb-10">
                        {/* Revenue Chart */}
                        <div className="lg:col-span-2 bg-[#111] rounded-2xl border border-white/10 p-8 shadow-xl">
                            <h3 className="text-sm font-bold text-gray-400 mb-8 uppercase flex items-center gap-2">
                                <FaChartLine className="text-purple-600" /> Revenue Growth
                            </h3>
                            <div className="h-64 flex items-end justify-between gap-2 md:gap-6">
                                {(stats.chartData?.length > 0 ? stats.chartData : [...Array(6)].map((_, i) => ({ month: 'Month', revenue: 0 }))).map((item, idx) => (
                                    <div key={idx} className="flex-1 flex flex-col items-center group">
                                        <div 
                                            style={{ height: `${item.revenue > 0 ? (item.revenue / dynamicMax) * 100 : 5}%` }}
                                            className="w-full bg-purple-600/20 group-hover:bg-purple-600 rounded-t-lg transition-all duration-300 relative"
                                        >
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                                                ₹{item.revenue.toLocaleString()}
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-gray-500 mt-4 font-bold">{item.month}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-[#111] rounded-2xl border border-white/10 p-8 shadow-xl">
                            <h3 className="text-sm font-bold text-gray-400 mb-8 uppercase flex items-center gap-2">
                                <FaTerminal className="text-purple-600" /> Management
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { label: 'Manage Users', path: '/admin/users', icon: FaUsers },
                                    { label: 'View Inquiries', path: '/admin/inquiries', icon: FaEnvelopeOpenText },
                                    { label: 'Gym Trainers', path: '/admin/trainers', icon: FaDumbbell }
                                ].map((action, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => navigate(action.path)}
                                        className="w-full p-4 bg-white/5 border border-white/5 rounded-xl flex items-center gap-4 hover:bg-white/10 transition text-left"
                                    >
                                        <action.icon className="text-purple-600" size={18} />
                                        <span className="text-white text-sm font-bold">{action.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Add Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#111] border border-white/10 rounded-xl p-8 max-w-md w-full shadow-2xl relative"
                        >
                            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                                <FaTimes size={18} />
                            </button>
                            <h2 className="text-xl font-bold text-white mb-6">Register New User</h2>
                            <form onSubmit={handleAddUser} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={addForm.name}
                                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-purple-600"
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={addForm.email}
                                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-purple-600"
                                    required
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={addForm.password}
                                        onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-purple-600"
                                        required
                                    />
                                    <input
                                        type="password"
                                        placeholder="Confirm"
                                        value={addForm.confirmPassword}
                                        onChange={(e) => setAddForm({ ...addForm, confirmPassword: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-purple-600"
                                        required
                                    />
                                </div>
                                <select 
                                    value={addForm.role}
                                    onChange={(e) => setAddForm({...addForm, role: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-bold text-sm transition mt-4">
                                    Create Account
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
