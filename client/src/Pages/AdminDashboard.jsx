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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [addForm, setAddForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'user' });
    const [message, setMessage] = useState('');

    // Dynamic Chart Scaling
    const maxRevenue = Math.max(...(stats.chartData?.map(d => d.revenue) || [10000]));
    const dynamicMax = maxRevenue > 100 ? maxRevenue * 1.2 : 10000;

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 30000);
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

            setMessage("Nexus Authorization Granted: New User Synced.");
            setShowAddModal(false);
            setAddForm({ name: '', email: '', password: '', confirmPassword: '', role: 'user' });
            setShowPassword(false);
            setShowConfirmPassword(false);
            fetchStats();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            alert(error.response?.data?.message || "Protocol Failure: User Sync Denied.");
        }
    };

    return (
        <div className="flex bg-dark-100 min-h-screen font-sans selection:bg-purple/30 selection:text-white">
            <AdminSidebar />
            <div className="flex-1 lg:ml-72 pt-24 lg:pt-32 px-4 sm:px-10 pb-20 overflow-y-auto bg-dark-200 relative">
                {/* Tactical background */}
                <div className="absolute top-0 right-0 w-full h-[500px] bg-linear-to-b from-purple/5 to-transparent pointer-events-none"></div>
                
                <AdminHeader />
                
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-7xl mx-auto relative z-10"
                >
                    {/* 🏷️ DASHBOARD HEADER */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="px-3 py-1 bg-purple/10 border border-purple/30 rounded-full flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-purple rounded-full animate-pulse shadow-[0_0_8px_white]"></div>
                                    <span className="text-[9px] font-black text-purple uppercase tracking-[0.2em]">Systems Active</span>
                                </div>
                                <span className="text-gray-600 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                                    <FaShieldAlt className="text-gray-700" /> Security Level: Elite
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
                                NEXUS <span className="text-purple">COMMAND</span>
                            </h1>
                            <p className="text-gray-500 mt-2 text-[10px] font-black uppercase tracking-[0.4em] leading-relaxed">
                                Central Intelligence & Resource Management
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setShowAddModal(true)}
                                className="group px-8 py-4 bg-purple text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 hover:bg-purple-600 transition-all active:scale-95 shadow-2xl shadow-purple/20"
                            >
                                <FaUserPlus className="group-hover:rotate-12 transition-transform" />
                                Onboard Unit
                            </button>
                        </div>
                    </div>

                    {message && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass border-purple/30 p-4 rounded-2xl mb-12 text-center text-[10px] font-black uppercase tracking-widest text-purple shadow-purple/10"
                        >
                            <span className="mr-2">⚡</span> {message}
                        </motion.div>
                    )}

                    {/* ✅ TACTICAL STATS GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {[
                            { label: 'Registered Units', value: stats.totalUsers, icon: FaUsers, color: 'purple', trend: '+12%' },
                            { label: 'Gross Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: FaChartLine, color: 'blue', trend: '+8%' },
                            { label: 'Elite Trainers', value: stats.activeTrainers, icon: FaDumbbell, color: 'pink', trend: 'Secure' },
                            { label: 'Open Inquiries', value: stats.newInquiries, icon: FaEnvelopeOpenText, color: 'purple', trend: 'Priority' }
                        ].map((item, idx) => (
                            <motion.div 
                                key={idx}
                                whileHover={{ y: -5 }}
                                className="bg-dark-300 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group transition-all hover:border-purple/30"
                            >
                                <div className={`absolute top-0 right-0 p-8 text-${item.color}/10 group-hover:scale-110 transition-transform duration-700`}>
                                    <item.icon size={50} />
                                </div>
                                <div className="flex flex-col h-full relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`w-10 h-10 bg-${item.color}/10 border border-${item.color}/20 rounded-xl flex items-center justify-center`}>
                                            <item.icon className={`text-${item.color}`} size={16} />
                                        </div>
                                        <span className={`text-[8px] font-black uppercase tracking-widest text-${item.color} px-2 py-1 bg-${item.color}/5 rounded-full border border-${item.color}/10`}>
                                            {item.trend}
                                        </span>
                                    </div>
                                    <h3 className="text-3xl font-black text-white mb-1">{loading ? '---' : item.value}</h3>
                                    <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em]">{item.label}</p>
                                </div>
                                <div className={`absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-${item.color}/30 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700`}></div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 mb-12">
                        {/* 📊 REVENUE GROWTH ANALYTICS */}
                        <div className="lg:col-span-2 bg-dark-300 rounded-[3rem] border border-white/5 p-10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-purple/5 rounded-full blur-[100px] pointer-events-none"></div>
                            
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 relative z-10">
                                <div>
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-3 mb-2">
                                        <FaChartLine className="text-purple" /> Fiscal Projection
                                    </h3>
                                    <p className="text-2xl font-black text-white uppercase tracking-tighter">Revenue <span className="text-purple">Intelligence</span></p>
                                </div>
                                <div className="flex gap-2">
                                    <div className="px-4 py-2 bg-dark-200 border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest text-gray-500">
                                        Last 6 Cycles
                                    </div>
                                    <div className="px-4 py-2 bg-purple/10 border border-purple/20 rounded-2xl text-[9px] font-black uppercase tracking-widest text-purple">
                                        Live Stream
                                    </div>
                                </div>
                            </div>

                            <div className="h-72 flex items-end justify-between gap-4 md:gap-8 px-4 relative">
                                {/* Synthetic Grid Lines */}
                                <div className="absolute inset-0 flex flex-col justify-between py-2 opacity-5 pointer-events-none">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="w-full h-px bg-white"></div>
                                    ))}
                                </div>

                                {(stats.chartData?.length > 0 ? stats.chartData : [...Array(6)].map((_, i) => ({ month: 'CYCLE', revenue: 0 }))).map((item, idx) => (
                                    <div key={idx} className="flex-1 flex flex-col items-center group/bar relative z-10 h-full justify-end">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${item.revenue > 0 ? (item.revenue / dynamicMax) * 100 : 5}%` }}
                                            transition={{ duration: 1.2, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                            className="w-full max-w-[60px] bg-linear-to-t from-purple/10 via-purple/40 to-purple rounded-2xl group-hover/bar:brightness-125 transition-all duration-500 shadow-2xl shadow-purple/10 relative"
                                        >
                                            {/* Data Tag */}
                                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-dark-100 text-[10px] font-black px-3 py-2 rounded-xl opacity-0 group-hover/bar:opacity-100 transition-all duration-300 shadow-2xl pointer-events-none translate-y-2 group-hover/bar:translate-y-0">
                                                ₹{item.revenue.toLocaleString()}
                                            </div>
                                            
                                            {/* Glow Accent */}
                                            <div className="absolute top-0 left-0 w-full h-1 bg-white/40 rounded-t-2xl blur-[1px]"></div>
                                        </motion.div>
                                        <span className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em] mt-6 group-hover/bar:text-purple transition-colors">{item.month}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 🛠️ OPERATIONS PANEL */}
                        <div className="bg-dark-300 rounded-[3rem] border border-white/5 p-10 shadow-2xl relative overflow-hidden">
                            <h3 className="text-[10px] font-black text-gray-400 mb- aggregation uppercase tracking-[0.3em] flex items-center gap-3 mb-10">
                                <FaTerminal className="text-purple" /> Command Stack
                            </h3>

                            <div className="space-y-4">
                                {[
                                    { label: 'Access Control', detail: 'Manage User Credentials', icon: FaShieldAlt, path: '/admin/users' },
                                    { label: 'Facility Plans', detail: 'Configure Membership Matrix', icon: FaLayerGroup, path: '/admin/plans' },
                                    { label: 'Data Analytics', detail: 'Advanced Revenue Metrics', icon: FaChartLine, path: '/admin/reports' }
                                ].map((action, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => navigate(action.path)}
                                        className="w-full p-6 bg-dark-200 border border-white/5 rounded-[2rem] flex items-center justify-between group hover:border-purple/30 transition-all active:scale-[0.98]"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-purple/10 transition-colors">
                                                <action.icon className="text-gray-400 group-hover:text-purple transition-colors" size={18} />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-xs font-black text-white uppercase tracking-tight mb-1">{action.label}</p>
                                                <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">{action.detail}</p>
                                            </div>
                                        </div>
                                        <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                                            <FaTerminal className="text-purple" size={12} />
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-8 p-6 bg-linear-to-br from-purple/10 to-transparent border border-purple/10 rounded-[2rem]">
                                <p className="text-[9px] text-purple font-black uppercase tracking-widest mb-3">System Integrity</p>
                                <div className="space-y-3">
                                    <div className="w-full bg-dark-400 h-1.5 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: '92%' }}
                                            transition={{ duration: 2, delay: 1 }}
                                            className="h-full bg-purple shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                                        ></motion.div>
                                    </div>
                                    <div className="flex justify-between text-[8px] font-black text-gray-500 uppercase tracking-widest">
                                        <span>Operational Efficiency</span>
                                        <span>92.4%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ✅ MODAL - REGISTRATION NEXUS */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAddModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                        ></motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="bg-dark-300 border border-white/10 rounded-[3rem] p-10 max-w-md w-full shadow-2xl relative z-10"
                        >
                            <button onClick={() => setShowAddModal(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
                                <FaTimes size={18} />
                            </button>

                            <div className="mb-10">
                                <p className="text-purple font-black uppercase tracking-[0.3em] text-[10px] mb-2">Security Authorization</p>
                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Register <span className="text-purple">Unit</span></h2>
                            </div>

                            <form onSubmit={handleAddUser} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-gray-600 text-[9px] font-black uppercase tracking-widest ml-2">Identity Signature</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            value={addForm.name}
                                            onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                                            className="w-full bg-dark-200 border border-white/5 rounded-2xl px-6 py-4 text-white text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-purple/50 transition-all"
                                            required
                                        />
                                        <FaUser className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600" size={12} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-gray-600 text-[9px] font-black uppercase tracking-widest ml-2">Digital Link</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            placeholder="MEMBER@CORE.COM"
                                            value={addForm.email}
                                            onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                                            className="w-full bg-dark-200 border border-white/5 rounded-2xl px-6 py-4 text-white text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-purple/50 transition-all"
                                            required
                                        />
                                        <FaEnvelope className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600" size={12} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-gray-600 text-[9px] font-black uppercase tracking-widest ml-2">Secret Code</label>
                                        <input
                                            type="password"
                                            value={addForm.password}
                                            onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                                            className="w-full bg-dark-200 border border-white/5 rounded-2xl px-6 py-4 text-white text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-purple/50 transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-600 text-[9px] font-black uppercase tracking-widest ml-2">Confirm Code</label>
                                        <input
                                            type="password"
                                            value={addForm.confirmPassword}
                                            onChange={(e) => setAddForm({ ...addForm, confirmPassword: e.target.value })}
                                            className="w-full bg-dark-200 border border-white/5 rounded-2xl px-6 py-4 text-white text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-purple/50 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-5 bg-purple hover:bg-purple-600 text-white rounded-2xl font-black uppercase tracking-[0.4em] text-[11px] transition-all active:scale-95 shadow-2xl shadow-purple/20"
                                >
                                    Initialize Authorization
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
