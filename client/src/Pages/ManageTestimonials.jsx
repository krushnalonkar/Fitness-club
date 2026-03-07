import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaUserCircle, FaQuoteLeft, FaStar } from 'react-icons/fa';
import AdminSidebar from '../Components/AdminSidebar';
import AdminHeader from '../Components/AdminHeader';
import axios from 'axios';

const ManageTestimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || userInfo.role !== 'admin') {
            window.location.href = '/admin/login';
            return;
        }
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const res = await axios.get('/api/testimonials');
            setTestimonials(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching feedback:", error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this feedback? It will be removed from the public site.")) {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                await axios.delete(`/api/testimonials/${id}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                });
                setTestimonials(testimonials.filter(item => item._id !== id));
                setMessage("Feedback removed successfully!");
                setTimeout(() => setMessage(''), 3000);
            } catch (error) {
                console.error("Error deleting feedback:", error);
            }
        }
    };

    return (
        <div className="flex bg-dark-100 min-h-screen">
            <AdminSidebar />
            <AdminHeader />
            <div className="flex-1 lg:ml-72 pt-24 lg:pt-32 px-4 sm:px-10 pb-20 overflow-y-auto bg-dark-200">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-6xl mx-auto"
                >
                    <div className="mb-10">
                        <h1 className="text-2xl font-bold text-white tracking-tight">
                            User <span className="text-purple">Feedback</span>
                        </h1>
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mt-1">Moderate and Manage Member Testimonials</p>
                    </div>

                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-8 text-center font-medium"
                        >
                            {message}
                        </motion.div>
                    )}

                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500 gap-3">
                            <div className="w-10 h-10 border-4 border-purple border-t-transparent rounded-full animate-spin"></div>
                            <p>Loading testimonials...</p>
                        </div>
                    ) : testimonials.length === 0 ? (
                        <div className="bg-dark-200 border border-dark-400 rounded-2xl p-20 text-center text-gray-500 italic">
                            No active testimonials to show.
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {testimonials.map((entry) => (
                                    <motion.div
                                        key={entry._id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="bg-dark-200 border border-dark-400 p-6 rounded-2xl relative shadow-xl hover:border-purple/30 transition group cursor-pointer"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="text-purple/40">
                                                <FaQuoteLeft size={30} />
                                            </div>
                                            <button
                                                onClick={() => handleDelete(entry._id)}
                                                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        </div>

                                        <p className="text-gray-300 text-sm mb-6 leading-relaxed italic">"{entry.feedback}"</p>

                                        <div className="flex items-center gap-3 border-t border-dark-400 pt-5">
                                            <div className="p-2 bg-purple/10 rounded-full text-purple">
                                                <FaUserCircle size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold text-sm leading-none">{entry.name}</h4>
                                                <p className="text-[10px] text-gray-500 mt-1">{entry.role}</p>
                                                <div className="flex text-yellow-500 mt-1 gap-0.5">
                                                    {[...Array(entry.rating || 5)].map((_, i) => (
                                                        <FaStar key={i} size={10} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ManageTestimonials;
