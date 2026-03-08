import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaUser, FaClock, FaCheckCircle, FaReply, FaTimes } from 'react-icons/fa';
import AdminSidebar from '../Components/AdminSidebar';
import AdminHeader from '../Components/AdminHeader';
import axios from 'axios';

const ManageInquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchInquiries();
        // 💡 Polling: Update inquiry list every 30 seconds
        const interval = setInterval(fetchInquiries, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchInquiries = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const res = await axios.get('/api/contacts', {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setInquiries(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Fetch Inquiries Error:", error);
            setLoading(false);
        }
    };

    const handleMarkRead = async (id) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            await axios.put(`/api/contacts/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            fetchInquiries();
            // 💡 Instant Notification Header Update
            window.dispatchEvent(new Event('refreshNotifications'));
        } catch (error) {
            console.error("Mark Read Error:", error);
        }
    };

    const handleOpenReply = (item) => {
        setSelectedInquiry(item);
        setReplyText(item.adminReply || '');
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        setIsSubmitting(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const res = await axios.put(`/api/contacts/${selectedInquiry._id}/reply`, { reply: replyText }, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });

            if (res.status === 200) {
                alert("Reply sent successfully!");
                setReplyText('');
                setSelectedInquiry(null); // Close Modal
                window.location.reload(); // Force refresh to show changes
            }
        } catch (error) {
            console.error("Reply Error:", error);
            alert("Failed to send reply. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex bg-dark-100 min-h-screen">
            <AdminSidebar />
            <AdminHeader />
            <div className="flex-1 lg:ml-72 pt-24 lg:pt-32 px-4 sm:px-10 pb-20 overflow-y-auto bg-dark-200">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-6xl mx-auto"
                >
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">
                                Member <span className="text-purple">Inquiries</span>
                            </h1>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Communications & Leads</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-20 text-gray-400">Fetching inquiries...</div>
                    ) : (
                        <div className="space-y-4">
                            {inquiries.length === 0 ? (
                                <div className="bg-dark-200 border border-dark-400 rounded-3xl p-10 text-center text-gray-500">
                                    No inquiries found at the moment.
                                </div>
                            ) : (
                                inquiries.map((item, idx) => (
                                    <motion.div
                                        key={item._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className={`bg-dark-200 border border-dark-400 rounded-2xl p-6 group transition duration-300 relative overflow-hidden ${item.status === 'unread' ? 'border-l-4 border-l-purple shadow-[0_5px_15px_rgba(139,92,246,0.1)]' : 'opacity-80'}`}
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-bold text-white">{item.subject}</h3>
                                                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${item.status === 'unread' ? 'bg-purple text-white' : item.status === 'replied' ? 'bg-green-500/20 text-green-500 border border-green-500/30' : 'bg-gray-500/20 text-gray-500 border border-gray-500/30'}`}>
                                                        {item.status}
                                                    </span>
                                                </div>
                                                <p className="text-gray-200 text-base leading-relaxed mb-6 font-medium bg-dark-300/30 p-4 rounded-xl border border-dark-400/50">{item.message}</p>

                                                {item.adminReply && (
                                                    <div className="mb-4 p-5 bg-dark-300 rounded-xl border border-dark-400 relative overflow-hidden">
                                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                                                        <p className="text-[10px] text-green-500 font-bold uppercase mb-2 tracking-widest">Admin Response</p>
                                                        <p className="text-white text-sm leading-relaxed font-medium">{item.adminReply}</p>
                                                    </div>
                                                )}

                                                <div className="flex flex-wrap gap-4">
                                                    <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                                        <FaUser className="text-purple" /> {item.name}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                                        <FaEnvelope className="text-purple" /> {item.email}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                                        <FaClock className="text-purple" /> {new Date(item.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {item.status === 'unread' && (
                                                    <button
                                                        onClick={() => handleMarkRead(item._id)}
                                                        className="px-4 py-2 bg-dark-300 hover:bg-dark-400 text-white border border-dark-400 rounded-xl text-[10px] font-bold uppercase tracking-widest transition cursor-pointer"
                                                    >
                                                        Mark Read
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleOpenReply(item)}
                                                    className="px-4 py-2 bg-purple hover:bg-purple-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition flex items-center gap-2 cursor-pointer"
                                                >
                                                    <FaReply /> {item.status === 'replied' ? 'Update Reply' : 'Reply'}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* REPLY MODAL */}
            <AnimatePresence>
                {selectedInquiry && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-dark-100/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-dark-200 border border-dark-400 w-full max-w-lg rounded-3xl p-8 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white uppercase tracking-tight">Reply to <span className="text-purple">Inquiry</span></h2>
                                <button onClick={() => setSelectedInquiry(null)} className="text-gray-500 hover:text-white transition cursor-pointer">
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="mb-6">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Original Message from {selectedInquiry.name}</p>
                                <div className="p-5 bg-dark-300 rounded-2xl border border-dark-400 text-white text-base leading-relaxed font-medium">
                                    {selectedInquiry.message}
                                </div>
                            </div>

                            <form onSubmit={handleReplySubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-300 text-[10px] font-bold uppercase mb-2 tracking-widest">Your Response</label>
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        className="w-full px-5 py-4 bg-dark-300 border border-dark-400 rounded-2xl text-white focus:outline-none focus:border-purple/50 transition min-h-[150px] font-medium placeholder:text-gray-600"
                                        placeholder="Type your response here..."
                                        required
                                    ></textarea>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedInquiry(null)}
                                        className="px-6 py-3 text-gray-400 hover:text-white font-bold text-[10px] uppercase tracking-widest transition cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !replyText.trim()}
                                        className="px-8 py-3 bg-purple hover:bg-purple-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition shadow-xl shadow-purple/20 disabled:opacity-50 cursor-pointer"
                                    >
                                        {isSubmitting ? 'Sending...' : 'Send Reply'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageInquiries;
