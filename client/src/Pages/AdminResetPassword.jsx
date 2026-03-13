import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserShield, FaKey, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import banner from '../assets/banner-2.jpg';

const AdminResetPassword = () => {
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const res = await axios.post(`/api/admin/reset-password/${token}`, { password });
            setMessage(res.data.message);
            setTimeout(() => {
                navigate('/admin/login');
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
            <div className="absolute inset-0 bg-black/75 backdrop-blur-md"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-dark-200/90 p-8 rounded-2xl shadow-2xl border border-purple/30 relative z-10"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-purple rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple/40">
                        <FaKey className="text-white text-3xl" />
                    </div>
                    <h2 className="text-3xl font-bold text-white text-center">
                        Set New <span className="text-purple">Password</span>
                    </h2>
                    <p className="text-gray-400 mt-2 text-center text-xs uppercase tracking-widest leading-relaxed">
                        Securely update administrator credentials.
                    </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-center">{error}</div>}
                    {message && <div className="bg-green-500/10 border border-green-500/50 text-green-500 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-center">{message}</div>}

                    <div>
                        <label className="block text-gray-300 text-[10px] font-black uppercase tracking-widest mb-2 px-1 text-left">Security Token</label>
                        <input
                            type="text"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            required
                            placeholder="Enter the token provided"
                            className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-xl text-white focus:outline-none focus:border-purple transition text-sm font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-[10px] font-black uppercase tracking-widest mb-2 px-1 text-left">New Security Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Min 6 characters"
                                className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-xl text-white focus:outline-none focus:border-purple transition text-sm font-medium pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition cursor-pointer"
                            >
                                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-300 text-[10px] font-black uppercase tracking-widest mb-2 px-1 text-left">Confirm New Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="Verify your password"
                                className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-xl text-white focus:outline-none focus:border-purple transition text-sm font-medium pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition cursor-pointer"
                            >
                                {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 bg-purple hover:bg-purple-700 text-white font-black rounded-xl transition duration-300 shadow-lg shadow-purple/30 uppercase tracking-[0.2em] text-xs mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Updating Credentials...' : 'Update Password'}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-dark-400 pt-6">
                    <Link to="/admin/login" className="text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition">Cancel & Exit</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminResetPassword;
