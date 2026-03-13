import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaLayerGroup, FaTimes, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaChartLine, FaUsers, FaDumbbell, FaEnvelopeOpenText } from 'react-icons/fa';
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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [addForm, setAddForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'user' });
    const [message, setMessage] = useState('');

    // Dynamic Chart Scaling
    const maxRevenue = Math.max(...(stats.chartData?.map(d => d.revenue) || [10000]));
    const dynamicMax = maxRevenue > 100 ? maxRevenue * 1.2 : 10000;

    useEffect(() => {
        fetchStats();
        // ≡ƒÆí Polling: Update stats every 30 seconds to show "Live" counts
        const interval = setInterval(fetchStats, 30000);

        // Listen for refresh events from other components
        const handleRefresh = () => fetchStats();
        window.addEventListener('refreshNotifications', handleRefresh);

        return () => {
            clearInterval(interval);
            window.removeEventListener('refreshNotifications', handleRefresh);
        };
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

            setMessage("New member added successfully!");
            setShowAddModal(false);
            setAddForm({ name: '', email: '', password: '', confirmPassword: '', role: 'user' });
            setShowPassword(false);
            setShowConfirmPassword(false);
            fetchStats(); // Update numbers
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error("Add User Error:", error);
            alert(error.response?.data?.message || "Failed to add member");
        }
    };

    return (
        <div className="flex bg-dark-100 min-h-screen">
            <AdminSidebar />
            <div className="flex-1 lg:ml-72 pt-24 lg:pt-32 px-4 sm:px-10 pb-20 overflow-y-auto bg-dark-200">
                <AdminHeader />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-6xl mx-auto"
                >
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">
                                Admin <span className="text-purple">Dashboard</span>
                            </h1>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Real-time System Overview</p>
                        </div>
                        <div className="bg-purple/10 text-purple border border-purple/20 px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest">
                            Live Status
                        </div>
                    </div>

                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-green-500/10 border border-green-500/50 text-green-500 p-4 rounded-xl mb-6 text-center text-xs font-bold uppercase tracking-widest"
                        >
                            {message}
                        </motion.div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid md:grid-cols-4 gap-6 mb-10">
                        <motion.div whileHover={{ y: -5 }} className="bg-dark-200 p-6 rounded-2xl border border-dark-400 group hover:border-purple/50 transition duration-300 shadow-xl relative overflow-hidden cursor-pointer">
                            <div className="absolute top-0 right-0 p-4 text-purple/20 group-hover:text-purple/40 transition">
                                <FaUsers size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-1 group-hover:text-purple transition">{loading ? '...' : stats.totalUsers}</h3>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Total Members</p>
                        </motion.div>

                        <motion.div whileHover={{ y: -5 }} className="bg-dark-200 p-6 rounded-2xl border border-dark-400 group hover:border-purple/50 transition duration-300 shadow-xl relative overflow-hidden cursor-pointer">
                            <div className="absolute top-0 right-0 p-4 text-green-500/20 group-hover:text-green-500/40 transition">
                                <FaChartLine size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-1 group-hover:text-green-400 transition">Γé╣{loading ? '...' : stats.totalRevenue.toLocaleString()}</h3>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Growth Revenue</p>
                        </motion.div>

                        <motion.div whileHover={{ y: -5 }} className="bg-dark-200 p-6 rounded-2xl border border-dark-400 group hover:border-purple/50 transition duration-300 shadow-xl relative overflow-hidden cursor-pointer">
                            <div className="absolute top-0 right-0 p-4 text-blue-500/20 group-hover:text-blue-500/40 transition">
                                <FaDumbbell size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-1 group-hover:text-blue-400 transition">{loading ? '...' : stats.activeTrainers}</h3>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Expert Trainers</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            onClick={() => navigate('/admin/inquiries')}
                            className="bg-dark-200 p-6 rounded-2xl border border-dark-400 group hover:border-purple/50 transition duration-300 shadow-xl relative overflow-hidden cursor-pointer"
                        >
                            <div className="absolute top-0 right-0 p-4 text-yellow-500/20 group-hover:text-yellow-500/40 transition">
                                <FaEnvelopeOpenText size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-1 group-hover:text-yellow-400 transition">{loading ? '...' : stats.newInquiries}</h3>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Pending Inquiries</p>
                        </motion.div>
                    </div>

                    {/* Revenue Growth Chart */}
                    <div className="grid md:grid-cols-3 gap-8 mb-10">
                        <div className="md:col-span-2 bg-dark-200 rounded-3xl border border-dark-400 p-8 shadow-2xl relative overflow-hidden group hover:border-purple/30 transition duration-500 cursor-pointer">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

                            <h3 className="text-lg font-bold text-white mb-10 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FaChartLine className="text-purple" />
                                    Real-Time <span className="text-purple">Revenue Growth</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] text-white font-bold px-3 py-1 bg-purple/20 rounded-lg border border-purple/30">Total: Γé╣{stats.totalRevenue.toLocaleString()}</span>
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-dark-300 px-3 py-1 rounded-full border border-dark-400">Last 6 Months</span>
                                </div>
                            </h3>

                            <div className="h-56 flex items-end justify-between gap-6 px-4 relative">
                                {/* Grid Lines */}
                                <div className="absolute inset-0 flex flex-col justify-between py-2 opacity-5 pointer-events-none">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="w-full h-[1.5px] bg-gray-400"></div>
                                    ))}
                                </div>

                                {(stats.chartData && stats.chartData.length > 0 ? stats.chartData : [
                                    { month: 'Oct', revenue: 0 },
                                    { month: 'Nov', revenue: 0 },
                                    { month: 'Dec', revenue: 0 },
                                    { month: 'Jan', revenue: 0 },
                                    { month: 'Feb', revenue: 0 },
                                    { month: 'Mar', revenue: 0 }
                                ]).map((item, idx) => (
                                    <div key={idx} className="flex-1 flex flex-col items-center group/bar relative z-10 h-full justify-end">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${item.revenue > 0 ? (item.revenue / dynamicMax) * 100 : 2}%` }}
                                            transition={{ duration: 1.5, delay: idx * 0.1, ease: "circOut" }}
                                            className="w-full max-w-[50px] bg-gradient-to-t from-purple/20 via-purple/60 to-purple rounded-t-xl group-hover/bar:from-purple group-hover/bar:to-purple-300 transition-all duration-500 shadow-2xl shadow-purple/10 relative"
                                        >
                                            {/* Tooltip */}
                                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-dark-100 text-[10px] font-black px-3 py-1.5 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-all duration-300 whitespace-nowrap z-30 shadow-2xl pointer-events-none scale-90 group-hover/bar:scale-100">
                                                Γé╣{item.revenue.toLocaleString()}
                                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45"></div>
                                            </div>

                                            {/* Glowing effect on top */}
                                            <div className="absolute top-0 left-0 w-full h-[2.5px] bg-purple-300 blur-sm brightness-150"></div>
                                        </motion.div>

                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-5 group-hover/bar:text-purple transition duration-300">{item.month}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions Card */}
                        <div className="bg-dark-200 rounded-3xl border border-dark-400 p-8 shadow-2xl overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

                            <h3 className="text-lg font-bold text-white mb-6">
                                Quick <span className="text-purple">Access</span>
                            </h3>

                            <div className="space-y-4">
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="w-full flex items-center gap-3 px-6 py-4 bg-dark-300 hover:bg-dark-400 text-white border border-dark-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition active:scale-95 text-left cursor-pointer"
                                >
                                    <FaUserPlus size={16} className="text-purple" /> Add New Member
                                </button>
                                <button
                                    onClick={() => navigate('/admin/plans')}
                                    className="w-full flex items-center gap-3 px-6 py-4 bg-dark-300 hover:bg-dark-400 text-white border border-dark-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition active:scale-95 text-left cursor-pointer"
                                >
                                    <FaLayerGroup size={16} className="text-blue-400" /> Configure Plans
                                </button>
                                <div className="p-4 bg-purple/5 border border-purple/10 rounded-2xl mt-4">
                                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-1">System Health</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-xs text-white font-semibold">Fast & Secure</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Quick Add Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-dark-200 border border-dark-400 rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
                        >
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="absolute top-6 right-6 text-gray-500 hover:text-white transition"
                            >
                                <FaTimes size={18} />
                            </button>

                            <h2 className="text-xl font-bold text-white mb-2">Register <span className="text-purple">Member</span></h2>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-6 border-b border-dark-400 pb-4">Onboard new gym client</p>

                            <form onSubmit={handleAddUser} className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <FaUser size={10} className="text-purple" /> Full Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={addForm.name}
                                        onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                                        className="w-full bg-dark-300 border border-dark-400 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple transition"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <FaEnvelope size={10} className="text-purple" /> Email Address
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="member@email.com"
                                        value={addForm.email}
                                        onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                                        className="w-full bg-dark-300 border border-dark-400 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple transition"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <FaLock size={10} className="text-purple" /> Initial Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Min 6 characters"
                                            value={addForm.password}
                                            onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                                            className="w-full bg-dark-300 border border-dark-400 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple transition pr-12"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple transition"
                                        >
                                            {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <FaLock size={10} className="text-purple" /> Retype Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm your password"
                                            value={addForm.confirmPassword}
                                            onChange={(e) => setAddForm({ ...addForm, confirmPassword: e.target.value })}
                                            className="w-full bg-dark-300 border border-dark-400 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple transition pr-12"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple transition"
                                        >
                                            {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-purple hover:bg-purple-700 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition shadow-lg shadow-purple/20 mt-6 active:scale-95"
                                >
                                    Confirm Registration
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
