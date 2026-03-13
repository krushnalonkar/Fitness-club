import React, { useState, useContext, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaUserCircle, FaUserShield } from 'react-icons/fa'
import { FaXmark } from 'react-icons/fa6'
import { FaDumbbell } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const { user, logout, updateProfile } = useContext(AuthContext);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', currentPassword: '', newPassword: '', confirmNewPassword: '', height: '', weight: '' });
    const [updateStatus, setUpdateStatus] = useState({ type: '', message: '' });
    const [isUpdating, setIsUpdating] = useState(false);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
        navigate('/');
    };

    const handleEditProfileClick = () => {
        const latestStats = user.progress && user.progress.length > 0
            ? user.progress[user.progress.length - 1]
            : { height: '', weight: '' };

        setFormData({
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
            height: latestStats.height || '',
            weight: latestStats.weight || ''
        });
        setIsEditingProfile(true);
        setUpdateStatus({ type: '', message: '' });
        setShowDropdown(false);
    };

    const handleChangePasswordClick = () => {
        setFormData({ name: user.name, email: user.email, currentPassword: '', newPassword: '', confirmNewPassword: '', height: '', weight: '' });
        setIsChangingPassword(true);
        setUpdateStatus({ type: '', message: '' });
        setShowDropdown(false);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfileSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setUpdateStatus({ type: '', message: '' });

        try {
            await updateProfile(
                formData.name,
                formData.email,
                formData.phone,
                undefined,
                undefined,
                formData.height,
                formData.weight
            );
            setUpdateStatus({ type: 'success', message: 'Profile updated successfully!' });
            setTimeout(() => {
                setIsEditingProfile(false);
            }, 1500);
        } catch (error) {
            setUpdateStatus({ type: 'error', message: error });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleChangePasswordSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setUpdateStatus({ type: '', message: '' });

        if (formData.newPassword !== formData.confirmNewPassword) {
            setUpdateStatus({ type: 'error', message: 'New passwords do not match' });
            setIsUpdating(false);
            return;
        }

        try {
            await updateProfile(user.name, user.email, user.phone, formData.currentPassword, formData.newPassword);
            setUpdateStatus({ type: 'success', message: 'Password changed successfully!' });
            setTimeout(() => {
                setIsChangingPassword(false);
            }, 1500);
        } catch (error) {
            setUpdateStatus({ type: 'error', message: error });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <>
            <nav className='fixed w-full z-50 bg-dark-100/90 backdrop-blur-md py-4 px-4 md:px-8 shadow-2xl border-b border-white/5'>
                <div className='container mx-auto flex justify-between items-center'>
                    <div className="flex items-center gap-3">
                        {/* Text */}
                        <Link to="/" className="text-2xl md:text-3xl font-bold text-white hover:opacity-90 transition-all flex items-center gap-2">
                             <FaDumbbell className="text-purple text-2xl md:text-3xl" />
                             <span>Fitness<span className="text-purple">Club</span></span>
                        </Link>
                    </div>
                    <div className='hidden md:flex items-center space-x-8'>
                        <Link to="/" onClick={() => window.scrollTo(0, 0)} className='relative text-white/80 transition duration-300 hover:text-purple group'>
                            <span>Home</span>
                            <span className='absolute left-0 -bottom-1 w-0 h-0.5 top-7 bg-purple transition-all duration-300 group-hover:w-full'></span>
                        </Link>
                        <Link to="/#about" className='relative text-white/80 transition duration-300 hover:text-purple group'>
                            <span>About</span>
                            <span className='absolute left-0 -bottom-1 w-0 h-0.5 top-7 bg-purple transition-all duration-300 group-hover:w-full'></span>
                        </Link>
                        <Link to="/#services" className='relative text-white/80 transition duration-300 hover:text-purple group'>
                            <span>Services</span>
                            <span className='absolute left-0 -bottom-1 w-0 h-0.5 top-7 bg-purple transition-all duration-300 group-hover:w-full'></span>
                        </Link>
                        <Link to="/#trainers" className='relative text-white/80 transition duration-300 hover:text-purple group'>
                            <span>Trainers</span>
                            <span className='absolute left-0 -bottom-1 w-0 h-0.5 top-7 bg-purple transition-all duration-300 group-hover:w-full'></span>
                        </Link>
                        <Link to="/#plans" className='relative text-white/80 transition duration-300 hover:text-purple group'>
                            <span>Plans</span>
                            <span className='absolute left-0 -bottom-1 w-0 h-0.5 top-7 bg-purple transition-all duration-300 group-hover:w-full'></span>
                        </Link>
                        <Link to="/#testimonials" className='relative text-white/80 transition duration-300 hover:text-purple group'>
                            <span>Testimonials</span>
                            <span className='absolute left-0 -bottom-1 w-0 h-0.5 top-7 bg-purple transition-all duration-300 group-hover:w-full'></span>
                        </Link>
                        <Link to="/#gallery" className='relative text-white/80 transition duration-300 hover:text-purple group'>
                            <span>Gallery</span>
                            <span className='absolute left-0 -bottom-1 w-0 h-0.5 top-7 bg-purple transition-all duration-300 group-hover:w-full'></span>
                        </Link>
                        <Link to="/#contact" className='relative text-white/80 transition duration-300 hover:text-purple group'>
                            <span>Contact</span>
                            <span className='absolute left-0 -bottom-1 w-0 h-0.5 top-7 bg-purple transition-all duration-300 group-hover:w-full'></span>
                        </Link>

                        {/* Auth Buttons */}
                        <div className="flex items-center ml-6">
                            {user ? (
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="flex items-center gap-2 text-white hover:text-purple transition"
                                    >
                                        <FaUserCircle className="text-3xl text-purple" />
                                        <span className="font-semibold">{user.name.split(' ')[0]}</span>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {showDropdown && (
                                        <div className="absolute right-0 mt-3 w-48 bg-dark-200 border border-dark-400 rounded-xl shadow-xl py-2 overflow-hidden">
                                            <div className="px-4 py-2 border-b border-dark-400 mb-2">
                                                <p className="text-sm text-gray-400">Signed in as</p>
                                                <p className="text-sm font-bold text-white truncate">{user.email}</p>
                                            </div>

                                            <Link
                                                to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                                                onClick={() => setShowDropdown(false)}
                                                className="block px-4 py-2 text-gray-300 hover:bg-purple hover:text-white transition"
                                            >
                                                Dashboard
                                            </Link>

                                            <button
                                                onClick={handleEditProfileClick}
                                                className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-purple hover:text-white transition"
                                            >
                                                Update Profile
                                            </button>

                                            <button
                                                onClick={handleChangePasswordClick}
                                                className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-purple hover:text-white transition"
                                            >
                                                Change Password
                                            </button>

                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500 hover:text-white transition border-t border-dark-400 mt-1 pt-2"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className='flex items-center space-x-4'>
                                    {/* Admin Access Tab - Distinct Style */}
                                    <Link
                                        to="/admin/login"
                                        className='flex items-center gap-2 px-3 py-1.5 border border-purple/30 rounded-lg text-xs font-bold text-purple-400 hover:bg-purple/10 hover:border-purple transition-all duration-300 uppercase tracking-widest'
                                    >
                                        <FaUserShield />
                                        Admin
                                    </Link>

                                    <div className="flex items-center bg-linear-to-r from-purple-600 to-purple-800 rounded-full overflow-hidden shadow-md">
                                        {/* Login */}
                                        <Link
                                            to="/login"
                                            className="px-5 py-2 text-white font-semibold hover:bg-white/10 transition"
                                        >
                                            Login
                                        </Link>

                                        {/* Divider */}
                                        <div className="w-px h-5 bg-white/70"></div>

                                        {/* Signup */}
                                        <Link
                                            to="/signup"
                                            className="px-5 py-2 text-white font-semibold hover:bg-white/10 transition"
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='md:hidden'>
                        {
                            showMenu ?
                                <FaXmark onClick={() => setShowMenu(!showMenu)} className='text-3xl cursor-pointer text-white relative z-[60]' /> :
                                <FaBars onClick={() => setShowMenu(!showMenu)} className='text-3xl cursor-pointer text-white' />
                        }
                    </div>

                </div>

                {/* for Mobile Menus */}
                {
                    showMenu && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowMenu(false)}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] md:hidden"
                            />
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className='fixed top-0 right-0 w-[80%] max-w-sm h-screen bg-dark-100/95 backdrop-blur-xl z-[58] md:hidden border-l border-white/10 shadow-2xl overflow-y-auto pt-24 pb-10 px-6'
                            >
                                 <div className='flex flex-col space-y-1'>
                                    {[
                                        { name: 'Home', path: '/' },
                                        { name: 'About', path: '/#about' },
                                        { name: 'Services', path: '/#services' },
                                        { name: 'Trainers', path: '/#trainers' },
                                        { name: 'Plans', path: '/#plans' },
                                        { name: 'Testimonials', path: '/#testimonials' },
                                        { name: 'Gallery', path: '/#gallery' },
                                        { name: 'Contact', path: '/#contact' },
                                    ].map((link) => (
                                        <Link
                                            key={link.name}
                                            onClick={() => { setShowMenu(false); if (link.name === 'Home') window.scrollTo(0, 0); }}
                                            to={link.path}
                                            className='text-lg font-bold text-white/90 hover:text-purple py-4 border-b border-white/5 transition-all flex items-center justify-between group'
                                        >
                                            {link.name}
                                            <span className="w-1.5 h-1.5 bg-purple rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        </Link>
                                    ))}
 
                                    <div className="pt-8 space-y-4">
                                        {user ? (
                                            <div className="bg-dark-300/40 rounded-3xl p-5 border border-white/5 shadow-inner">
                                                <div className="flex items-center gap-4 mb-6">
                                                    <div className="w-12 h-12 bg-purple/10 border border-purple/30 rounded-2xl flex items-center justify-center">
                                                        <FaUserCircle className="text-3xl text-purple" />
                                                    </div>
                                                    <div className="text-left w-full overflow-hidden">
                                                        <p className="text-white font-black text-sm uppercase tracking-tight truncate">{user.name}</p>
                                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest truncate">{user.email}</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 gap-3">
                                                    <Link onClick={() => setShowMenu(false)} to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="w-full text-center py-3.5 bg-purple hover:bg-purple-700 rounded-2xl text-white text-xs font-black uppercase tracking-widest transition shadow-lg shadow-purple/20">
                                                        Go to Dashboard
                                                    </Link>
                                                    <button onClick={() => { handleEditProfileClick(); setShowMenu(false); }} className="w-full py-3.5 bg-dark-400 hover:bg-dark-500 rounded-2xl text-gray-300 text-[10px] font-black uppercase tracking-widest border border-white/5 transition">
                                                        Setting
                                                    </button>
                                                    <button onClick={() => { handleLogout(); setShowMenu(false); }} className="w-full py-2.5 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2 opacity-70 hover:opacity-100 transition">
                                                        Logout System
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-3">
                                                <Link
                                                    onClick={() => setShowMenu(false)}
                                                    to="/login"
                                                    className="w-full py-4 bg-dark-300 text-white text-xs font-black uppercase tracking-widest rounded-2xl text-center border border-white/5 shadow-lg active:scale-95 transition"
                                                >
                                                    Login Account
                                                </Link>
                                                <Link
                                                    onClick={() => setShowMenu(false)}
                                                    to="/signup"
                                                    className="w-full py-4 bg-purple text-white text-xs font-black uppercase tracking-widest rounded-2xl text-center shadow-xl shadow-purple/20 active:scale-95 transition"
                                                >
                                                    Create Account
                                                </Link>
                                                <Link
                                                    onClick={() => setShowMenu(false)}
                                                    to="/admin/login"
                                                    className="flex items-center justify-center gap-2 text-purple-400 font-black uppercase tracking-[0.25em] text-[9px] mt-6 opacity-60 hover:opacity-100 transition"
                                                >
                                                    <FaUserShield size={12} /> Portal Access
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )
                }
            </nav>

            {/* Edit Profile Modal */}
            {isEditingProfile && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-dark-200 p-8 rounded-2xl shadow-2xl border border-dark-400 w-full max-w-md relative"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">Update Profile</h2>

                        {updateStatus.message && (
                            <div className={`mb-4 px-4 py-2 rounded-lg text-sm border ${updateStatus.type === 'success' ? 'bg-green-500/10 text-green-500 border-green-500/50' : 'bg-red-500/10 text-red-500 border-red-500/50'}`}>
                                {updateStatus.message}
                            </div>
                        )}

                        <form onSubmit={handleUpdateProfileSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2.5 bg-dark-300 border border-dark-400 rounded-xl text-white focus:outline-none focus:border-purple transition"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2.5 bg-dark-300 border border-dark-400 rounded-xl text-white focus:outline-none focus:border-purple transition"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-1.5">Phone Number (WhatsApp)</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                    pattern="[0-9]{10}"
                                    className="w-full px-4 py-2.5 bg-dark-300 border border-dark-400 rounded-xl text-white focus:outline-none focus:border-purple transition"
                                />
                                <p className="text-[10px] text-gray-500 mt-1">10-digit number for gym updates.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-1.5">Height (cm)</label>
                                    <input
                                        type="number"
                                        name="height"
                                        value={formData.height}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 bg-dark-300 border border-dark-400 rounded-xl text-white focus:outline-none focus:border-purple transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-1.5">Weight (kg)</label>
                                    <input
                                        type="number"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 bg-dark-300 border border-dark-400 rounded-xl text-white focus:outline-none focus:border-purple transition"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditingProfile(false)}
                                    className="flex-1 py-2.5 bg-dark-400 hover:bg-dark-500 text-white font-semibold rounded-xl transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className={`flex-1 py-2.5 bg-purple hover:bg-purple-700 text-white font-semibold rounded-xl transition shadow-lg shadow-purple/20 ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isUpdating ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Change Password Modal */}
            {isChangingPassword && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-dark-200 p-8 rounded-2xl shadow-2xl border border-dark-400 w-full max-w-md relative"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">Change Password</h2>

                        {updateStatus.message && (
                            <div className={`mb-4 px-4 py-2 rounded-lg text-sm border ${updateStatus.type === 'success' ? 'bg-green-500/10 text-green-500 border-green-500/50' : 'bg-red-500/10 text-red-500 border-red-500/50'}`}>
                                {updateStatus.message}
                            </div>
                        )}

                        <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-1.5">Current Password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleInputChange}
                                    placeholder="••••••••"
                                    required
                                    className="w-full px-4 py-2.5 bg-dark-300 border border-dark-400 rounded-xl text-white focus:outline-none focus:border-purple transition"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-1.5">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    placeholder="••••••••"
                                    required
                                    className="w-full px-4 py-2.5 bg-dark-300 border border-dark-400 rounded-xl text-white focus:outline-none focus:border-purple transition"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-1.5">Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmNewPassword"
                                    value={formData.confirmNewPassword}
                                    onChange={handleInputChange}
                                    placeholder="••••••••"
                                    required
                                    className="w-full px-4 py-2.5 bg-dark-300 border border-dark-400 rounded-xl text-white focus:outline-none focus:border-purple transition"
                                />
                            </div>

                            <div className="flex gap-4 mt-8 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsChangingPassword(false)}
                                    className="flex-1 py-2.5 bg-dark-400 hover:bg-dark-500 text-white font-semibold rounded-xl transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className={`flex-1 py-2.5 bg-purple hover:bg-purple-700 text-white font-semibold rounded-xl transition shadow-lg shadow-purple/20 ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isUpdating ? 'Saving...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </>
    )
}

export default Navbar

