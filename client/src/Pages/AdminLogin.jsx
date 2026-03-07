import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserShield } from 'react-icons/fa';
import axios from 'axios';
import banner from '../assets/banner-2.jpg';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('/api/admin/login', formData);
            localStorage.setItem('userInfo', JSON.stringify(response.data));
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || "Invalid Admin Credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 pt-20 relative"
            style={{
                backgroundImage: `url(${banner})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}
        >
            {/* Dark Blur Overlay */}
            <div className="absolute inset-0 bg-black/75 backdrop-blur-md"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-dark-200/90 p-8 rounded-2xl shadow-2xl border border-purple/30 relative overflow-hidden z-10"
            >
                {/* Decorative background element */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple/10 rounded-full blur-3xl"></div>

                <div className="flex flex-col items-center mb-8 relative z-10">
                    <div className="w-16 h-16 bg-purple rounded-2xl rotate-12 flex items-center justify-center mb-6 shadow-lg shadow-purple/40">
                        <FaUserShield className="text-white text-3xl -rotate-12" />
                    </div>
                    <h2 className="text-3xl font-bold text-white text-center">
                        Admin <span className="text-purple">Portal</span>
                    </h2>
                    <p className="text-gray-400 mt-2 text-center text-sm uppercase tracking-widest">Gym Owner Secure Login</p>
                </div>

                <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                    {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg text-sm mb-4 text-center">{error}</div>}
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-tighter">Admin ID / Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="admin@fitnessclub.com"
                            className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-xl text-white focus:outline-none focus:border-purple transition"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-tighter">Security Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-xl text-white focus:outline-none focus:border-purple transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 bg-purple hover:bg-purple-700 text-white font-bold rounded-xl transition duration-300 shadow-lg shadow-purple/30 text-lg uppercase tracking-wider ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Verifying...' : 'Access Dashboard'}
                    </button>

                    <p className="text-center text-xs text-gray-500 mt-4 italic">
                        * Unauthorized access is strictly prohibited.
                    </p>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
