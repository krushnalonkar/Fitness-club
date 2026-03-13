import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserShield, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';
import banner from '../assets/banner-2.jpg';

const AdminForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const res = await axios.post('/api/admin/forgot-password', { email });
            setMessage(res.data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 pt-32 pb-20 relative"
            style={{
                backgroundImage: `url(${banner})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}
        >
            <div className="absolute inset-0 bg-black/75 backdrop-blur-md"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-dark-200/90 p-8 rounded-2xl shadow-2xl border border-purple/30 relative z-10"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-purple rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple/40">
                        <FaUserShield className="text-white text-3xl" />
                    </div>
                    <h2 className="text-3xl font-bold text-white text-center">
                        Admin <span className="text-purple">Recovery</span>
                    </h2>
                    <p className="text-gray-400 mt-2 text-center text-xs uppercase tracking-widest leading-relaxed">
                        Security verification required for administrator.
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg text-sm mb-4 text-center font-bold uppercase tracking-tight">{error}</div>}
                    {message && <div className="bg-green-500/10 border border-green-500/50 text-green-500 px-4 py-2 rounded-lg text-sm mb-4 text-center font-bold uppercase tracking-tight">{message}</div>}

                    <div>
                        <label className="block text-gray-300 text-xs font-bold mb-2 uppercase tracking-widest px-1">Registered Admin Email</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="E.g. admin@fitnessclub.com"
                                className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-xl text-white focus:outline-none focus:border-purple transition pl-11 text-sm"
                            />
                            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 bg-purple hover:bg-purple-700 text-white font-black rounded-xl transition duration-300 shadow-lg shadow-purple/30 uppercase tracking-[0.2em] text-xs ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Processing...' : 'Request Reset Link'}
                    </button>

                    {message && (
                        <div className="text-center mt-6 p-4 bg-purple/5 border border-purple/10 rounded-xl">
                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-3">Token has been logged in Terminal (Dev Mode)</p>
                            <Link to="/admin/reset-password" size="sm" className="text-purple hover:underline text-xs font-black uppercase tracking-widest">
                                Go to Reset Page
                            </Link>
                        </div>
                    )}
                </form>

                <div className="mt-8 text-center border-t border-dark-400 pt-6">
                    <Link to="/admin/login" className="text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition">Back to Login</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminForgotPassword;
