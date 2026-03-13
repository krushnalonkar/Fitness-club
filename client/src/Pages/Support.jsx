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
                    <div className="inline-flex p-3 bg-purple/10 rounded-2xl text-purple mb-4">
                        <FaHeadset size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Contact <span className="text-purple">Support</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto font-medium">
                        Need help with your membership or have a question? Our support team is here for you 24/7.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div className="bg-dark-100 p-8 rounded-3xl border border-dark-400 space-y-6">
                            <h3 className="text-xl font-bold text-white mb-2">Get in Touch</h3>

                            <div className="flex items-start gap-4 group">
                                <div className="p-3 bg-purple/10 rounded-xl text-purple group-hover:bg-purple group-hover:text-white transition duration-300">
                                    <FaEnvelope />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Email Us</p>
                                    <p className="text-white font-medium">support@gymportal.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="p-3 bg-purple/10 rounded-xl text-purple group-hover:bg-purple group-hover:text-white transition duration-300">
                                    <FaPhoneAlt />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Call Us</p>
                                    <p className="text-white font-medium">+91 98765 43210</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="p-3 bg-purple/10 rounded-xl text-purple group-hover:bg-purple group-hover:text-white transition duration-300">
                                    <FaMapMarkerAlt />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Location</p>
                                    <p className="text-white font-medium">123 Fitness Street, Gym Hub, Mumbai 400001</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-purple/10 p-8 rounded-3xl border border-purple/20">
                            <p className="text-white font-bold mb-2">Gym Timing</p>
                            <div className="space-y-1 text-sm text-gray-400">
                                <p className="flex justify-between"><span>Mon - Sat:</span> <span>5:00 AM - 10:00 PM</span></p>
                                <p className="flex justify-between"><span>Sunday:</span> <span>8:00 AM - 12:00 PM</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Support Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-dark-100 p-8 md:p-10 rounded-3xl border border-dark-400 shadow-2xl">
                            <h3 className="text-2xl font-bold text-white mb-8">Send a Message</h3>

                            {status.msg && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`mb-6 p-4 rounded-xl text-sm font-bold border ${status.type === 'success' ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-red-500/10 text-red-500 border-red-500/30'}`}
                                >
                                    {status.msg}
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-1">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-dark-300 border border-dark-400 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-purple transition"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-1">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-dark-300 border border-dark-400 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-purple transition"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-1">Subject</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Membership Query"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full bg-dark-300 border border-dark-400 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-purple transition"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-1">How can we help?</label>
                                    <textarea
                                        required
                                        rows="4"
                                        placeholder="Enter your message here..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full bg-dark-300 border border-dark-400 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-purple transition resize-none"
                                    ></textarea>
                                </div>

                                <div className="md:col-span-2 flex justify-end pt-4">
                                    <button
                                        disabled={loading}
                                        type="submit"
                                        className="flex items-center gap-3 bg-purple hover:bg-purple-700 text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all active:scale-95 shadow-xl shadow-purple/20 disabled:opacity-50"
                                    >
                                        {loading ? 'Sending...' : (
                                            <>
                                                Send Message <FaPaperPlane size={12} />
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
