import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaDumbbell, FaKey, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import banner from '../assets/banner-2.jpg';

const ResetPassword = () => {
    const { token: urlToken } = useParams();
    const [token, setToken] = useState(''); // Allow user to manually enter if they closed the window
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (urlToken) {
            setToken(urlToken);
        }
    }, [urlToken]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }

        setLoading(true);

        try {
            await axios.post(`/api/auth/reset-password/${token}`, { password });
            setMessage("Password reset successful! Redirecting to login shortly...");
            setTimeout(() => {
                navigate('/login');
            }, 3000);
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
                        Reset <span className="text-purple">Password</span>
                    </h2>
                    <p className="text-gray-500 mt-2 text-center text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                        Enter your secure token and new credentials.
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg text-sm mb-4 text-center">{error}</div>}
                    {message && <div className="bg-green-500/10 border border-green-500/50 text-green-500 px-4 py-2 rounded-lg text-sm mb-4 text-center">{message}</div>}

                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Reset Token</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                required
                                placeholder="Paste your reset token"
                                className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-xl text-white focus:outline-none focus:border-purple transition pl-10"
                            />
                            <FaKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-xl text-white focus:outline-none focus:border-purple transition"
                            />
                            <button
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple transition"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Re-type your new password"
                            className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-xl text-white focus:outline-none focus:border-purple transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 bg-purple hover:bg-purple-700 text-white font-bold rounded-xl transition duration-300 shadow-lg shadow-purple/20 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Processing...' : 'Change Password'}
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-400">
                    Never mind? {' '}
                    <Link to="/login" className="text-purple font-semibold hover:underline">Go to Login</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
