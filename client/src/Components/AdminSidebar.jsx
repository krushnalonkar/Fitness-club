import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUsers, FaClipboardList, FaCommentAlt, FaSignOutAlt, FaChartPie, FaDumbbell, FaEnvelopeOpenText, FaBars, FaTimes, FaUserCheck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const AdminSidebar = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { name: 'Intelligence', path: '/admin/dashboard', icon: <FaChartPie /> },
        { name: 'Unit Control', path: '/admin/users', icon: <FaUsers /> },
        { name: 'Elite Assets', path: '/admin/trainers', icon: <FaDumbbell /> },
        { name: 'Nexus Matrix', path: '/admin/plans', icon: <FaClipboardList /> },
        { name: 'Bio-Log', path: '/admin/attendance', icon: <FaUserCheck /> },
        { name: 'Public Intel', path: '/admin/testimonials', icon: <FaCommentAlt /> },
        { name: 'Incoming Trans', path: '/admin/inquiries', icon: <FaEnvelopeOpenText /> },
    ];

    const toggleSidebar = () => setIsOpen(!isOpen);

    const SidebarContent = () => (
        <div className="flex flex-col h-full pb-10">
            {/* Logo Section */}
            <div className="py-10 px-4 flex items-center gap-4 border-b border-white/5 mb-8">
                <div className="w-12 h-12 bg-linear-to-br from-purple to-purple-800 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)] border border-white/10 group-hover:rotate-6 transition-transform">
                    <FaDumbbell className="text-white text-2xl" />
                </div>
                <div>
                    <h2 className="text-white font-black text-xl leading-none tracking-tighter">NEXUS<span className="text-purple">CMD</span></h2>
                    <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.3em] mt-1.5">Alpha Protocol</p>
                </div>
            </div>

            <div className="space-y-1.5 flex-1 px-2">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all duration-500 relative group overflow-hidden ${isActive
                                ? 'bg-purple/10 text-white border border-purple/20'
                                : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'
                                }`}
                        >
                            {isActive && (
                                <motion.div 
                                    layoutId="activeGlow"
                                    className="absolute left-0 w-1.5 h-6 bg-purple rounded-full shadow-[0_0_15px_#8b5cf6]"
                                />
                            )}
                            <span className={`text-lg transition-colors ${isActive ? 'text-purple' : 'group-hover:text-purple'}`}>{item.icon}</span>
                            <span className="font-black text-[10px] uppercase tracking-[0.2em]">{item.name}</span>
                            
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 bg-purple rounded-full animate-pulse shadow-[0_0_8px_#8b5cf6]"></div>
                            )}
                        </Link>
                    );
                })}
            </div>

            <div className="mt-auto pt-8 border-t border-white/5 px-2">
                <Link
                    to="/"
                    className="flex items-center gap-4 px-6 py-4 text-gray-600 hover:text-red-500 rounded-2xl transition-all duration-500 group"
                >
                    <FaSignOutAlt className="text-lg group-hover:-translate-x-1 transition-transform" />
                    <span className="font-black text-[10px] uppercase tracking-[0.2em]">Terminate Uplink</span>
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
