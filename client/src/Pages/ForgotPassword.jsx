import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaDumbbell, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';
import banner from '../assets/banner-2.jpg';

const ForgotPassword = () => {
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
            const res = await axios.post('/api/auth/forgot-password', { email });
            setMessage(res.data.message);
            // In development, we might want to guide the user to the reset page
            if (res.data.token) {
                console.log("Reset Token received in frontend (Dev Mode):", res.data.token);
            }
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
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-dark-200/90 p-8 rounded-2xl shadow-2xl border border-dark-400 relative z-10"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-purple rounded-full flex items-center justify-center mb-4">
                        <FaDumbbell className="text-white text-2xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-white text-center">
                        Forgot <span className="text-purple">Password?</span>
                    </h2>
                    <p className="text-gray-500 mt-2 text-center text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                        Security verification required to reset access.
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg text-sm mb-4 text-center">{error}</div>}
                    {message && <div className="bg-green-500/10 border border-green-500/50 text-green-500 px-4 py-2 rounded-lg text-sm mb-4 text-center">{message}</div>}

                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Email Address</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Enter your registered email"
                                className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-xl text-white focus:outline-none focus:border-purple transition pl-10"
                            />
                            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 bg-purple hover:bg-purple-700 text-white font-bold rounded-xl transition duration-300 shadow-lg shadow-purple/20 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Sending...' : 'Reset Password'}
                    </button>

                    {message && (
                        <div className="text-center mt-4">
                            <Link to="/reset-password" size="sm" className="text-purple hover:underline text-sm font-semibold">
                                Have the token? Reset here
                            </Link>
                        </div>
                    )}
                </form>

                <p className="mt-8 text-center text-gray-400">
                    Remember your password? {' '}
                    <Link to="/login" className="text-purple font-semibold hover:underline">Login</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
