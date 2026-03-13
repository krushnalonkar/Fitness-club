import React, { useState, useRef, useEffect } from 'react';
import { FaUserCircle, FaSignOutAlt, FaCog, FaBell, FaChartLine, FaUsers, FaClipboardList, FaCommentAlt, FaEnvelope, FaUserPlus, FaCalendarCheck } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const AdminHeader = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const dropdownRef = useRef(null);
    const notifRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo')) || { name: 'Admin Account', email: 'admin@gym.com' });
    const [showSettings, setShowSettings] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateStatus, setUpdateStatus] = useState({ type: '', message: '' });
    const [formData, setFormData] = useState({ 
        name: userInfo.name || '', 
        email: userInfo.email || '', 
        password: '', 
        confirmPassword: '' 
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        fetchNotifications();

        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);

        // Listen for refresh events from other components
        const handleRefresh = () => fetchNotifications();
        window.addEventListener('refreshNotifications', handleRefresh);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener('refreshNotifications', handleRefresh);
            clearInterval(interval);
        };
    }, []);

    const fetchNotifications = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('userInfo'));
            if (!user) return;
            const res = await axios.get('/api/notifications', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setNotifications(res.data);
        } catch (error) {
            console.error("Fetch Notifications Error:", error);
        }
    };

    const markRead = async (id) => {
        try {
            // Instant UI update: Remove from local state immediately
            setNotifications(prev => prev.filter(n => n._id !== id));

            const user = JSON.parse(localStorage.getItem('userInfo'));
            await axios.put(`/api/notifications/${id}`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            // fetchNotifications(); // Optional: re-fetch to stay in sync
        } catch (error) {
            console.error("Mark Read Error:", error);
        }
    };

    const markAllRead = async () => {
        try {
            // Instant UI update: Clear all locally
            setNotifications([]);

            const user = JSON.parse(localStorage.getItem('userInfo'));
            await axios.put(`/api/notifications/mark-all-read`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
        } catch (error) {
            console.error("Mark All Read Error:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleSettingsClick = () => {
        setFormData({ 
            name: userInfo.name, 
            email: userInfo.email, 
            password: '', 
            confirmPassword: '' 
        });
        setShowSettings(true);
        setShowDropdown(false);
        setUpdateStatus({ type: '', message: '' });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (formData.password && formData.password !== formData.confirmPassword) {
            setUpdateStatus({ type: 'error', message: 'Passwords do not match!' });
            return;
        }

        setIsUpdating(true);
        setUpdateStatus({ type: '', message: '' });

        try {
            const token = userInfo.token || localStorage.getItem('token');
            const res = await axios.put('/api/admin/profile', {
                name: formData.name,
                email: formData.email,
                password: formData.password || undefined
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            localStorage.setItem('userInfo', JSON.stringify(res.data));
            setUserInfo(res.data);
            setUpdateStatus({ type: 'success', message: 'Profile updated successfully!' });
            setTimeout(() => setShowSettings(false), 1500);
        } catch (error) {
            setUpdateStatus({ type: 'error', message: error.response?.data?.message || 'Update failed' });
        } finally {
            setIsUpdating(false);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'user': return <FaUserPlus className="text-blue-400" />;
            case 'inquiry': return <FaEnvelope className="text-purple" />;
            case 'booking': return <FaCalendarCheck className="text-green-400" />;
            default: return <FaBell className="text-gray-400" />;
        }
    };

    const unreadCount = notifications.length;

    const navLinks = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <FaChartLine /> },
        { name: 'Members', path: '/admin/users', icon: <FaUsers /> },
        { name: 'Gym Plans', path: '/admin/plans', icon: <FaClipboardList /> },
        { name: 'Feedback', path: '/admin/testimonials', icon: <FaCommentAlt /> },
    ];

    return (
        <header className="fixed top-0 right-0 lg:left-72 left-0 h-20 bg-dark-100/95 backdrop-blur-md border-b border-white/5 z-40 flex items-center justify-between px-4 sm:px-8">
            {/* Navigation Tabs - Hidden on small mobile, scrollable on tablet */}
            <div className="hidden sm:flex items-center gap-2 overflow-x-auto no-scrollbar max-w-[50%] lg:max-w-none">
                {navLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 whitespace-nowrap ${isActive
                                ? 'bg-purple text-white shadow-lg shadow-purple/20'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <span>{link.icon}</span>
                            <span className="hidden lg:inline uppercase tracking-wider">{link.name}</span>
                        </Link>
                    );
                })}
            </div>

            {/* Placeholder for spacing on mobile when nav is hidden */}
            <div className="sm:hidden w-12"></div>

            {/* Admin Profile & Notifications */}
            <div className="flex items-center gap-3 lg:gap-6">
                {/* Notifications Bell */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`p-2.5 rounded-xl transition relative cursor-pointer ${showNotifications ? 'bg-purple/10 text-purple' : 'text-gray-400 hover:text-purple hover:bg-white/5'}`}
                    >
                        <FaBell size={18} />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-dark-100">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-4 w-80 bg-dark-200/95 backdrop-blur-xl border border-dark-400 rounded-3xl shadow-2xl py-4 z-50 overflow-hidden"
                            >
                                <div className="px-6 pb-4 border-b border-dark-400 flex justify-between items-center">
                                    <h3 className="text-white text-xs font-bold uppercase tracking-widest">Notifications</h3>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={markAllRead}
                                            className="text-[9px] text-gray-500 hover:text-purple font-black uppercase tracking-widest transition cursor-pointer"
                                        >
                                            Mark all
                                        </button>
                                        <span className="text-[10px] text-purple font-bold px-2 py-0.5 bg-purple/10 rounded-full">{unreadCount} New</span>
                                    </div>
                                </div>

                                <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                                    {notifications.length === 0 ? (
                                        <div className="p-10 text-center text-gray-500 text-xs">No updates yet.</div>
                                    ) : (
                                        notifications.map((n) => (
                                            <div
                                                key={n._id}
                                                onClick={() => !n.isRead && markRead(n._id)}
                                                className={`px-6 py-4 border-b border-dark-400/50 hover:bg-dark-300 transition cursor-pointer relative ${!n.isRead ? 'bg-purple/5' : 'opacity-60'}`}
                                            >
                                                <div className="flex gap-4">
                                                    <div className="mt-1 text-base">{getIcon(n.type)}</div>
                                                    <div>
                                                        <p className="text-sm text-white leading-relaxed font-bold">{n.message}</p>
                                                        <p className="text-[9px] text-gray-500 font-bold uppercase mt-1">
                                                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                {!n.isRead && (
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-purple rounded-full"></div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="px-6 pt-4 text-center">
                                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Stay updated with latest activity</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-3 pl-4 border-l border-dark-400 cursor-pointer"
                    >
                        <div className="text-right hidden md:flex flex-col">
                            <span className="text-white text-xs font-bold leading-tight">{userInfo.name}</span>
                            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Administrator</span>
                        </div>
                        <div className="w-10 h-10 bg-purple/10 border border-purple/30 rounded-xl flex items-center justify-center text-purple hover:bg-purple hover:text-white transition">
                            <FaUserCircle size={22} />
                        </div>
                    </button>

                    <AnimatePresence>
                        {showDropdown && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute right-0 mt-4 w-56 bg-dark-200 border border-dark-400 rounded-2xl shadow-2xl py-2 overflow-hidden"
                            >
                                <div className="px-5 py-3 border-b border-dark-400 mb-1">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Active Portal</p>
                                    <p className="text-xs font-semibold text-white truncate mt-0.5">{userInfo.email}</p>
                                </div>
                                <button 
                                    onClick={handleSettingsClick}
                                    className="w-full text-left px-5 py-2.5 text-gray-300 hover:bg-purple hover:text-white transition flex items-center gap-3 text-sm cursor-pointer"
                                >
                                    <FaCog /> Settings
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-5 py-2.5 text-red-500 hover:bg-red-500/10 transition flex items-center gap-3 text-sm border-t border-dark-400 mt-1"
                                >
                                    <FaSignOutAlt /> Logout
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Admin Settings Modal */}
            <AnimatePresence>
                {showSettings && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-dark-200 border border-dark-400 rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
                        >
                            <button
                                onClick={() => setShowSettings(false)}
                                className="absolute top-6 right-6 text-gray-500 hover:text-white transition cursor-pointer"
                            >
                                <FaXmark size={20} />
                            </button>

                            <h2 className="text-xl font-bold text-white mb-2">Admin <span className="text-purple">Settings</span></h2>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-6 border-b border-dark-400 pb-4">Update your administrative profile</p>

                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                {updateStatus.message && (
                                    <div className={`p-3 rounded-lg text-center text-xs font-bold uppercase ${updateStatus.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {updateStatus.message}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-dark-300 border border-dark-400 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple transition"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-dark-300 border border-dark-400 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple transition"
                                        required
                                    />
                                </div>

                                <div className="pt-2">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3">Security Change</p>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">New Password (optional)</label>
                                            <input
                                                type="password"
                                                placeholder="Leave blank to keep current"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full bg-dark-300 border border-dark-400 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Confirm New Password</label>
                                            <input
                                                type="password"
                                                placeholder="Confirm new password"
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                className="w-full bg-dark-300 border border-dark-400 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple transition"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="w-full bg-purple hover:bg-purple-700 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition shadow-lg shadow-purple/20 mt-6 disabled:opacity-50"
                                >
                                    {isUpdating ? 'Saving Changes...' : 'Update Administrative Profile'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default AdminHeader;
