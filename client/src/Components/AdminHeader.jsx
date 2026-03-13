import React, { useState, useRef, useEffect } from 'react';
import { FaUserCircle, FaSignOutAlt, FaCog, FaBell, FaChartLine, FaUsers, FaClipboardList, FaCommentAlt, FaEnvelope, FaUserPlus, FaCalendarCheck } from 'react-icons/fa';
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
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || { name: 'Admin Account' };

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

        const interval = setInterval(fetchNotifications, 30000);

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
            setNotifications(prev => prev.filter(n => n._id !== id));
            const user = JSON.parse(localStorage.getItem('userInfo'));
            await axios.put(`/api/notifications/${id}`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
        } catch (error) {
            console.error("Mark Read Error:", error);
        }
    };

    const markAllRead = async () => {
        try {
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

    const getIcon = (type) => {
        switch (type) {
            case 'user': return <FaUserPlus className="text-blue-500" />;
            case 'inquiry': return <FaEnvelope className="text-purple-600" />;
            case 'booking': return <FaCalendarCheck className="text-green-500" />;
            default: return <FaBell className="text-gray-400" />;
        }
    };

    const unreadCount = notifications.length;

    return (
        <header className="fixed top-0 right-0 lg:left-72 left-0 h-16 bg-[#0c0c0c] border-b border-white/10 z-40 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
                <h1 className="text-white font-bold text-sm hidden sm:block uppercase tracking-wider">
                    {location.pathname.split('/').pop()}
                </h1>
            </div>

            <div className="flex items-center gap-4">
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2 text-gray-400 hover:text-white transition relative"
                    >
                        <FaBell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute right-0 mt-2 w-72 bg-[#151515] border border-white/10 rounded-xl shadow-2xl py-2 z-50 overflow-hidden"
                            >
                                <div className="px-4 py-2 border-b border-white/10 flex justify-between items-center bg-white/5">
                                    <span className="text-white text-xs font-bold">Notifications</span>
                                    <button onClick={markAllRead} className="text-[10px] text-purple-400 font-bold hover:underline">Clear all</button>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-8 text-center text-gray-500 text-xs">No notifications</div>
                                    ) : (
                                        notifications.map((n) => (
                                            <div
                                                key={n._id}
                                                onClick={() => markRead(n._id)}
                                                className="px-4 py-3 border-b border-white/5 hover:bg-white/5 transition cursor-pointer"
                                            >
                                                <div className="flex gap-3">
                                                    <div className="mt-1">{getIcon(n.type)}</div>
                                                    <div>
                                                        <p className="text-xs text-white leading-snug">{n.message}</p>
                                                        <p className="text-[10px] text-gray-500 mt-1">{new Date(n.createdAt).toLocaleTimeString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Profile */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-2 pl-4 border-l border-white/10"
                    >
                        <div className="hidden md:block text-right">
                            <p className="text-white text-xs font-bold leading-none">{userInfo.name}</p>
                            <p className="text-[10px] text-gray-500 mt-1 uppercase">Admin</p>
                        </div>
                        <div className="w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-600">
                            <FaUserCircle size={24} />
                        </div>
                    </button>

                    <AnimatePresence>
                        {showDropdown && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute right-0 mt-2 w-48 bg-[#151515] border border-white/10 rounded-xl shadow-2xl py-1 overflow-hidden"
                            >
                                <div className="px-4 py-2 border-b border-white/10 bg-white/5">
                                    <p className="text-[10px] text-gray-500 uppercase">Administrator</p>
                                    <p className="text-xs font-bold text-white truncate">{userInfo.email}</p>
                                </div>
                                <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-purple-600 hover:text-white transition text-xs flex items-center gap-2">
                                    <FaCog /> Settings
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-500 hover:text-white transition text-xs flex items-center gap-2 border-t border-white/10 mt-1"
                                >
                                    <FaSignOutAlt /> Logout
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
