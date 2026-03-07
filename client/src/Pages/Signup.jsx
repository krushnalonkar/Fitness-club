import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaDumbbell, FaEye, FaEyeSlash } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import banner from '../assets/banner-1.jpg';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        height: '',
        weight: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setLoading(true);

        try {
            await register(
                formData.name,
                formData.email,
                formData.phone,
                formData.password,
                formData.height,
                formData.weight
            );
            alert("Registration Successful! Please login to continue...");
            navigate('/login');
        } catch (err) {
            setError(err);
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
            {/* Dark Blur Overlay */}
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
                    <h2 className="text-3xl font-bold text-white text-center">
                        Join the <span className="text-purple">Club</span>
                    </h2>
                    <p className="text-gray-400 mt-2 text-center">Create an account to start your transformation</p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg text-sm mb-4">{error}</div>}
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-1.5">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="John Doe"
                            className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-xl text-white focus:outline-none focus:border-purple transition"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-1.5">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="email@example.com"
                            className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-xl text-white focus:outline-none focus:border-purple transition"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-1.5">Phone Number (WhatsApp)</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            pattern="[0-9]{10}"
                            placeholder="9876543210"
                            className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-xl text-white focus:outline-none focus:border-purple transition"
                        />
                        <p className="text-[10px] text-gray-500 mt-1 ml-1">Must be 10 digits without spaces or country code.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-1.5">Height (cm)</label>
                            <input
                                type="number"
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                placeholder="175"
                                className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-xl text-white focus:outline-none focus:border-purple transition"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-1.5">Weight (kg)</label>
                            <input
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                placeholder="70"
                                className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-xl text-white focus:outline-none focus:border-purple transition"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-1.5">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
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
                        <label className="block text-gray-300 text-sm font-medium mb-1.5">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-xl text-white focus:outline-none focus:border-purple transition"
                            />
                            <button
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple transition"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full mt-4 py-3 bg-purple hover:bg-purple-700 text-white font-bold rounded-xl transition duration-300 shadow-lg shadow-purple/20 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-400">
                    Already have an account? {' '}
                    <Link to="/login" className="text-purple font-semibold hover:underline">Login</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
