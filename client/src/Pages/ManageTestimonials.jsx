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
        if (window.confirm("Delete this feedback?")) {
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
        <div className="flex bg-[#0a0a0a] min-h-screen">
            <AdminSidebar />
            <AdminHeader />
            <div className="flex-1 lg:ml-72 pt-24 px-4 sm:px-8 pb-12 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-white">
                            Member <span className="text-purple-600">Feedback</span>
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Manage testimonials displayed on the website.</p>
                    </div>

                    {message && (
                        <div className="bg-red-600/10 border border-red-600/20 text-red-500 p-4 rounded-xl mb-8 text-center text-sm">
                            {message}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-20 text-gray-500">Loading feedback...</div>
                    ) : testimonials.length === 0 ? (
                        <div className="bg-[#111] border border-white/10 rounded-xl p-20 text-center text-gray-500 italic">
                            No feedback received yet.
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {testimonials.map((entry) => (
                                    <motion.div
                                        key={entry._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="bg-[#111] border border-white/10 p-6 rounded-xl relative shadow-xl"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <FaQuoteLeft className="text-purple-600/30" size={24} />
                                            <button
                                                onClick={() => handleDelete(entry._id)}
                                                className="text-gray-500 hover:text-red-500 transition"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>

                                        <p className="text-gray-300 text-sm mb-6 italic leading-relaxed">"{entry.feedback}"</p>

                                        <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                                            <div className="w-10 h-10 bg-purple-600/10 rounded-full flex items-center justify-center text-purple-600">
                                                <FaUserCircle size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold text-sm leading-none">{entry.name}</h4>
                                                <div className="flex text-yellow-500 mt-1 gap-0.5">
                                                    {[...Array(entry.rating || 5)].map((_, i) => (
                                                        <FaStar key={i} size={8} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageTestimonials;
