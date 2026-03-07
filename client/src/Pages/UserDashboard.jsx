import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaUserCircle, FaDumbbell, FaChartLine, FaExclamationTriangle, FaBell, FaCheckCircle, FaClock } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const UserDashboard = () => {
    const { user, loading, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [feedbackForm, setFeedbackForm] = useState({ rating: 5, feedback: '' });
    const [feedbackStatus, setFeedbackStatus] = useState({ type: '', message: '' });
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get('/api/notifications');
            setNotifications(res.data);
        } catch (error) {
            console.error("Failed to fetch notifications");
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await axios.put(`/api/notifications/${id}`);
            setNotifications(notifications.filter(n => n._id !== id));
        } catch (error) {
            console.error("Error marking as read");
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        setIsSubmittingFeedback(true);
        setFeedbackStatus({ type: '', message: '' });

        try {
            await axios.post('/api/testimonials', feedbackForm);
            setFeedbackStatus({ type: 'success', message: 'Thank you! Your feedback has been submitted successfully.' });
            setFeedbackForm({ rating: 5, feedback: '' });
        } catch (error) {
            setFeedbackStatus({ type: 'error', message: error.response?.data?.message || 'Failed to submit feedback' });
        } finally {
            setIsSubmittingFeedback(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-dark-100 flex justify-center items-center text-white font-medium">Loading...</div>;
    }

    if (!user) return null;

    const activePlans = user.bookedPlans?.filter(p => p.status === 'active') || [];

    return (
        <div className="min-h-screen bg-dark-200 pt-24 px-8 pb-12 relative overflow-y-auto font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto"
            >
                {/* Notifications Area */}
                {notifications.length > 0 && (
                    <div className="mb-6 space-y-2">
                        {notifications.map(notif => (
                            <div key={notif._id} className="bg-purple/10 border border-purple/20 p-4 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FaBell className="text-purple" />
                                    <p className="text-white text-sm">{notif.message}</p>
                                </div>
                                <button
                                    onClick={() => handleMarkAsRead(notif._id)}
                                    className="text-[10px] text-gray-400 hover:text-white font-bold uppercase cursor-pointer"
                                >
                                    Dismiss
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Warning for No Active Plan */}
                {!activePlans.length && (
                    <div className="mb-8 bg-red-500/10 border border-red-500/20 p-5 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <FaExclamationTriangle className="text-red-500 text-2xl" />
                            <div>
                                <h3 className="text-white font-bold">No Active Membership!</h3>
                                <p className="text-gray-400 text-sm">Your facility access is restricted. Please purchase a new plan to continue.</p>
                            </div>
                        </div>
                        <Link to="/#plans" className="bg-purple text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-purple/20">
                            Explore Plans
                        </Link>
                    </div>
                )}

                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">
                        Welcome, <span className="bg-gradient-to-r from-purple to-pink-500 bg-clip-text text-transparent">{user.name}</span>
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg transition"
                    >
                        Logout
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-6 items-start">
                    {/* My Profile Card */}
                    <div className="bg-dark-200 p-6 rounded-2xl border border-dark-400 h-full">
                        <div className="flex items-center gap-3 mb-4">
                            <FaUserCircle className="text-purple text-2xl" />
                            <h3 className="text-xl font-semibold text-white">My Profile</h3>
                        </div>
                        <div className="space-y-2 text-gray-400">
                            <p><span className="text-gray-300 font-medium text-sm">Name:</span> {user.name}</p>
                            <p><span className="text-gray-300 font-medium text-sm">Email:</span> {user.email}</p>
                            <p><span className="text-gray-300 font-medium text-sm">Role:</span> {user.role}</p>

                            {user.progress && user.progress.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-dark-400 space-y-2 text-sm">
                                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mb-2">Registration Details</p>
                                    <p><span className="text-gray-300 font-medium">Joined Weight:</span> {user.progress[0].weight} kg</p>
                                    <p><span className="text-gray-300 font-medium">Joined Height:</span> {user.progress[0].height} cm</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Active Plans Card */}
                    <div className="bg-dark-200 p-6 rounded-2xl border border-dark-400 h-full">
                        <div className="flex items-center gap-3 mb-4">
                            <FaDumbbell className="text-purple text-2xl" />
                            <h3 className="text-xl font-semibold text-white">Active Plans</h3>
                        </div>
                        {user.bookedPlans && user.bookedPlans.length > 0 ? (
                            <ul className="space-y-4">
                                {user.bookedPlans.map((plan, index) => (
                                    <li key={index} className={`p-4 rounded-xl border transition duration-300 ${plan.status === 'active' ? 'bg-dark-300 border-dark-400 hover:border-purple/50' : 'bg-red-500/5 border-red-500/20 opacity-60'}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="text-white font-semibold text-lg">{plan.planName}</p>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${plan.status === 'active' ? 'bg-purple/20 text-purple-400' : 'bg-red-500/20 text-red-500'}`}>
                                                {plan.status || 'Active'}
                                            </span>
                                        </div>
                                        <div className="space-y-1 text-sm text-gray-400">
                                            <p className="flex justify-between">
                                                <span>Start Date:</span>
                                                <span className="text-gray-300 font-medium">{new Date(plan.bookingDate).toLocaleDateString()}</span>
                                            </p>
                                            <p className="flex justify-between">
                                                <span>Expiry Date:</span>
                                                <span className="text-gray-300 font-medium">{new Date(plan.endDate).toLocaleDateString()}</span>
                                            </p>
                                            {plan.assignedTrainer && (
                                                <p className="flex justify-between mt-2 pt-2 border-t border-dark-400">
                                                    <span>Trainer:</span>
                                                    <span className="text-purple font-medium">{plan.assignedTrainer}</span>
                                                </p>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 italic py-4">No memberships found.</p>
                        )}
                    </div>

                    {/* Workout Stats Card */}
                    <div className="bg-dark-200 p-6 rounded-2xl border border-dark-400 h-full">
                        <div className="flex items-center gap-3 mb-4">
                            <FaChartLine className="text-purple text-2xl" />
                            <h3 className="text-xl font-semibold text-white">Workout Stats</h3>
                        </div>
                        {user.progress && user.progress.length > 0 ? (
                            <div className="space-y-3">
                                <div className="bg-dark-300 p-4 rounded-xl border border-dark-400">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1 tracking-widest">Latest Weight</p>
                                    <p className="text-xl text-white font-black">{user.progress[user.progress.length - 1].weight} kg</p>
                                </div>
                                <div className="bg-dark-300 p-4 rounded-xl border border-dark-400">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1 tracking-widest">Latest Height</p>
                                    <p className="text-xl text-white font-black">{user.progress[user.progress.length - 1].height} cm</p>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl text-center mt-4">
                                    <p className="text-gray-400 text-[10px] italic">Your journey is being tracked!</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 italic py-4">No stats recorded yet.</p>
                        )}
                    </div>
                </div>

                <div className="bg-dark-200 mt-8 p-6 md:p-8 rounded-2xl border border-dark-400 shadow-lg">
                    <h3 className="text-xl font-semibold text-white mb-4">Leave Feedback / Review</h3>
                    <p className="text-gray-400 mb-6 text-sm">Share your fitness journey and experience with us!</p>

                    {feedbackStatus.message && (
                        <div className={`mb-6 px-4 py-3 rounded-lg text-sm border ${feedbackStatus.type === 'success' ? 'bg-green-500/10 text-green-500 border-green-500/40' : 'bg-red-500/10 text-red-500 border-red-500/40'}`}>
                            {feedbackStatus.message}
                        </div>
                    )}

                    <form onSubmit={handleFeedbackSubmit} className="space-y-5">
                        <div className="flex flex-col md:flex-row gap-5">
                            <div className="w-full md:w-1/3">
                                <label className="block text-gray-300 text-sm font-medium mb-1.5 px-1">Rating (1 to 5)</label>
                                <select
                                    className="w-full px-4 py-2.5 bg-dark-300 border border-dark-400 rounded-xl text-white focus:outline-none focus:border-purple transition"
                                    value={feedbackForm.rating}
                                    onChange={(e) => setFeedbackForm({ ...feedbackForm, rating: e.target.value })}
                                >
                                    <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
                                    <option value="4">⭐⭐⭐⭐ 4 - Very Good</option>
                                    <option value="3">⭐⭐⭐ 3 - Good</option>
                                    <option value="2">⭐⭐ 2 - Fair</option>
                                    <option value="1">⭐ 1 - Poor</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-1.5 px-1">Your Experience Review</label>
                            <textarea
                                className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-xl text-white focus:outline-none focus:border-purple transition min-h-[120px] resize-none"
                                placeholder="Tell us about your fitness journey here..."
                                value={feedbackForm.feedback}
                                onChange={(e) => setFeedbackForm({ ...feedbackForm, feedback: e.target.value })}
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmittingFeedback}
                            className={`px-8 py-3 bg-purple hover:bg-purple-700 text-white font-bold rounded-xl transition-all active:scale-95 ${isSubmittingFeedback ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default UserDashboard;
