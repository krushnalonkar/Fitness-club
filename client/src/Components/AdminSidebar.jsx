import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUsers, FaClipboardList, FaCommentAlt, FaSignOutAlt, FaChartPie, FaDumbbell, FaEnvelopeOpenText, FaBars, FaTimes, FaUserCheck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const AdminSidebar = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <FaChartPie /> },
        { name: 'Members', path: '/admin/users', icon: <FaUsers /> },
        { name: 'Trainers', path: '/admin/trainers', icon: <FaDumbbell /> },
        { name: 'Gym Plans', path: '/admin/plans', icon: <FaClipboardList /> },
        { name: 'Attendance', path: '/admin/attendance', icon: <FaUserCheck /> },
        { name: 'Testimonials', path: '/admin/testimonials', icon: <FaCommentAlt /> },
        { name: 'Inquiries', path: '/admin/inquiries', icon: <FaEnvelopeOpenText /> },
    ];

    const toggleSidebar = () => setIsOpen(!isOpen);

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo Section */}
            <div className="py-8 px-6 flex items-center gap-3 border-b border-white/10 mb-6">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white">
                    <FaDumbbell size={20} />
                </div>
                <h2 className="text-white font-bold text-lg tracking-tight">GYM<span className="text-purple-600">PORTAL</span></h2>
            </div>

            <div className="space-y-1 flex-1 px-3">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isActive
                                ? 'bg-purple-600 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span className="font-semibold text-sm">{item.name}</span>
                        </Link>
                    );
                })}
            </div>

            <div className="mt-auto py-6 border-t border-white/10 px-3">
                <Link
                    to="/"
                    className="flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-red-500 rounded-xl transition-all"
                >
                    <FaSignOutAlt />
                    <span className="font-semibold text-sm">Exit Admin</span>
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
                    className="p-3 bg-purple-600 text-white rounded-xl shadow-lg"
                >
                    {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                </button>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block fixed left-0 top-0 h-screen w-72 bg-[#0a0a0a] border-r border-white/10 z-50">
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
                            className="fixed inset-0 bg-black/60 z-[55] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 h-screen w-72 bg-[#0c0c0c] z-[58] lg:hidden border-r border-white/10 shadow-2xl"
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
