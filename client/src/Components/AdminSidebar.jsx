import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUsers, FaClipboardList, FaCommentAlt, FaSignOutAlt, FaChartPie, FaDumbbell, FaEnvelopeOpenText, FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const AdminSidebar = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <FaChartPie /> },
        { name: 'Manage Users', path: '/admin/users', icon: <FaUsers /> },
        { name: 'Manage Trainers', path: '/admin/trainers', icon: <FaDumbbell /> },
        { name: 'Gym Plans', path: '/admin/plans', icon: <FaClipboardList /> },
        { name: 'Attendance', path: '/admin/attendance', icon: <FaUserCheck /> },
        { name: 'Testimonials', path: '/admin/testimonials', icon: <FaCommentAlt /> },
        { name: 'Inquiries', path: '/admin/inquiries', icon: <FaEnvelopeOpenText /> },
    ];

    const toggleSidebar = () => setIsOpen(!isOpen);

    const SidebarContent = () => (
        <div className="flex flex-col h-full pb-10">
            {/* Logo Section */}
            <div className="py-8 px-4 flex items-center gap-3 border-b border-white/5 mb-6">
                <div className="w-10 h-10 bg-purple rounded-xl flex items-center justify-center shadow-lg shadow-purple/30">
                    <FaDumbbell className="text-white text-xl" />
                </div>
                <div>
                    <h2 className="text-white font-bold text-lg leading-tight tracking-tight">FITNESS<span className="text-purple">CLUB</span></h2>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Administrator</p>
                </div>
            </div>

            <div className="space-y-2 flex-1">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${isActive
                                ? 'bg-purple text-white shadow-xl shadow-purple/20'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className="font-bold text-[11px] uppercase tracking-[0.15em]">{item.name}</span>
                        </Link>
                    );
                })}
            </div>

            <div className="mt-auto pt-6 border-t border-white/5">
                <Link
                    to="/"
                    className="flex items-center gap-4 px-4 py-3 text-red-400/70 hover:bg-red-500/10 hover:text-red-500 rounded-2xl transition-all duration-300"
                >
                    <FaSignOutAlt className="text-xl" />
                    <span className="font-bold text-[11px] uppercase tracking-wider">Return Home</span>
                </Link>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Toggle Button */}
            <div className="fixed top-6 left-6 z-[60] lg:hidden">
                <button
                    onClick={toggleSidebar}
                    className="p-3 bg-purple text-white rounded-xl shadow-xl shadow-purple/20 hover:scale-105 active:scale-95 transition-all"
                >
                    {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                </button>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block fixed left-0 top-0 h-screen w-72 bg-dark-100 border-r border-white/5 z-50 px-6">
                <SidebarContent />
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleSidebar}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[55] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 h-screen w-72 bg-dark-100/95 backdrop-blur-xl z-[58] px-6 lg:hidden border-r border-white/5 shadow-2xl"
                        >
                            <SidebarContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default AdminSidebar;
