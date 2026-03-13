import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeadset, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';

const Support = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Using the existing contact inquiry endpoint
            await axios.post('/api/contacts', formData);
            setStatus({ type: 'success', msg: 'Your inquiry has been sent! Our team will contact you soon.' });
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            setStatus({ type: 'error', msg: 'Failed to send message. Please try again later.' });
        } finally {
            setLoading(false);
            setTimeout(() => setStatus({ type: '', msg: '' }), 4000);
        }
    };

    return (
        <div className="min-h-screen bg-dark-200 pt-32 pb-20 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto"
            >
                {/* Header */}
                <div className="text-center space-y-4 mb-16">
                    <p className="text-purple font-black uppercase tracking-[0.3em] text-[10px] mb-4">Support Infrastructure</p>
                    <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white">
                        Tactical <span className="text-purple">Support</span>
                    </h1>
                    <p className="text-gray-500 max-w-xl mx-auto text-sm font-bold uppercase tracking-widest leading-relaxed">
                        Mission-critical assistance for your physical evolution.
                    </p>
                </div>
 
                <div className="grid lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div className="bg-dark-300 p-8 rounded-[2rem] border border-white/5 shadow-2xl space-y-8 relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple/5 rounded-full blur-3xl"></div>
                            
                            <div className="flex items-start gap-6 group">
                                <div className="w-12 h-12 bg-dark-200 rounded-2xl flex items-center justify-center text-purple group-hover:bg-purple group-hover:text-white transition-all duration-500 shadow-lg">
                                    <FaEnvelope size={18} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Data Channel</p>
                                    <p className="text-white font-bold text-sm">support@gymportal.com</p>
                                </div>
                            </div>
 
                            <div className="flex items-start gap-6 group">
                                <div className="w-12 h-12 bg-dark-200 rounded-2xl flex items-center justify-center text-purple group-hover:bg-purple group-hover:text-white transition-all duration-500 shadow-lg">
                                    <FaPhoneAlt size={16} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Comms Uplink</p>
                                    <p className="text-white font-bold text-sm">+91 98765 43210</p>
                                </div>
                            </div>
 
                            <div className="flex items-start gap-6 group">
                                <div className="w-12 h-12 bg-dark-200 rounded-2xl flex items-center justify-center text-purple group-hover:bg-purple group-hover:text-white transition-all duration-500 shadow-lg">
                                    <FaMapMarkerAlt size={18} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Base Location</p>
                                    <p className="text-white font-bold text-sm">123 Fitness Street, Mumbai</p>
                                </div>
                            </div>
                        </div>
 
                        <div className="bg-purple/5 p-8 rounded-[2rem] border border-purple/20 shadow-2xl relative overflow-hidden group">
                             <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                            <p className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-6">Operational Hours</p>
                            <div className="space-y-4 text-[10px] font-bold uppercase tracking-widest">
                                <p className="flex justify-between border-b border-white/5 pb-2 text-gray-400"><span>Mon - Sat</span> <span className="text-white">05:00 - 22:00</span></p>
                                <p className="flex justify-between text-gray-400"><span>Sunday</span> <span className="text-white">08:00 - 12:00</span></p>
                            </div>
                        </div>
                    </div>
 
                    {/* Support Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-dark-300 p-8 md:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
                             <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple/5 rounded-full blur-3xl"></div>
                            <h3 className="text-[10px] font-black text-gray-400 mb-10 uppercase tracking-[0.3em]">Transmission Protocol</h3>
 
                            {status.msg && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`mb-8 p-4 rounded-xl text-[9px] font-black uppercase tracking-widest border ${status.type === 'success' ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-red-500/10 text-red-500 border-red-500/30'}`}
                                >
                                    {status.msg}
                                </motion.div>
                            )}
 
                            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6 relative z-10">
                                <div className="space-y-2">
                                    <label className="text-gray-600 text-[9px] font-black uppercase tracking-[0.2em] ml-2">Operator Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="INPUT NAME"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-dark-200 border border-white/5 rounded-2xl px-6 py-4 text-white text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-purple/50 transition-all duration-500"
                                    />
                                </div>
 
                                <div className="space-y-2">
                                    <label className="text-gray-600 text-[9px] font-black uppercase tracking-[0.2em] ml-2">Secure Email</label>
                                    <input
                                        required
                                        type="email"
                                        placeholder="INPUT ADDRESS"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-dark-200 border border-white/5 rounded-2xl px-6 py-4 text-white text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-purple/50 transition-all duration-500"
                                    />
                                </div>
 
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-gray-600 text-[9px] font-black uppercase tracking-[0.2em] ml-2">Objective</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="ENQUIRY SUBJECT"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full bg-dark-200 border border-white/5 rounded-2xl px-6 py-4 text-white text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-purple/50 transition-all duration-500"
                                    />
                                </div>
 
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-gray-600 text-[9px] font-black uppercase tracking-[0.2em] ml-2">Intelligence Brief</label>
                                    <textarea
                                        required
                                        rows="5"
                                        placeholder="DESCRIBE ENQUIRY PARAMETERS..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full bg-dark-200 border border-white/5 rounded-2xl px-6 py-4 text-white text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-purple/50 transition-all duration-500 resize-none"
                                    ></textarea>
                                </div>
 
                                <div className="md:col-span-2 flex justify-end pt-6">
                                    <button
                                        disabled={loading}
                                        type="submit"
                                        className="flex items-center gap-4 bg-purple hover:bg-purple-700 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] transition-all active:scale-95 shadow-2xl shadow-purple/20 disabled:opacity-50"
                                    >
                                        {loading ? 'Transmitting...' : (
                                            <>
                                                Initialize Uplink <FaPaperPlane size={14} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Support;
