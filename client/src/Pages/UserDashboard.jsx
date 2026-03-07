import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaUserCircle, FaDumbbell, FaChartLine, FaExclamationTriangle, FaBell, FaCheckCircle, FaClock, FaCommentAlt, FaPhoneAlt } from 'react-icons/fa';
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

            // 🕒 Auto-clear message after 3 seconds
            setTimeout(() => {
                setFeedbackStatus({ type: '', message: '' });
            }, 3000);

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
                                    <p className="text-white text-base font-bold leading-tight">{notif.message}</p>
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
                            <p><span className="text-gray-300 font-medium text-sm">Phone:</span> {user.phone || 'Not updated'}</p>
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

                {/* Assigned Workouts & Sessions */}
                <div className="grid lg:grid-cols-2 gap-8 mt-8">
                    {/* Workouts Card */}
                    <div className="bg-dark-200 p-6 rounded-2xl border border-dark-400">
                        <div className="flex items-center gap-3 mb-6">
                            <FaDumbbell className="text-blue-500 text-2xl" />
                            <h3 className="text-xl font-semibold text-white">Daily <span className="text-blue-500">Workouts</span></h3>
                        </div>
                        {user.assignedWorkouts && user.assignedWorkouts.length > 0 ? (
                            <div className="space-y-4">
                                {user.assignedWorkouts.slice().reverse().map((workout, idx) => (
                                    <div key={idx} className="bg-dark-300 p-4 rounded-xl border border-dark-400 hover:border-blue-500/30 transition">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-white font-bold">{workout.workoutName}</p>
                                                <p className="text-gray-500 text-xs font-medium">{workout.repsSets} • {workout.cardioSteps} steps</p>
                                            </div>
                                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${workout.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                {workout.status}
                                            </span>
                                        </div>
                                        <p className="text-[8px] text-gray-600 mt-2 font-bold uppercase tracking-widest">{new Date(workout.date).toLocaleDateString()}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-10 text-center text-gray-500 text-sm italic border border-dark-400 rounded-2xl border-dashed">
                                No workouts assigned yet.
                            </div>
                        )}
                    </div>

                    {/* Sessions Card */}
                    <div className="bg-dark-200 p-6 rounded-2xl border border-dark-400">
                        <div className="flex items-center gap-3 mb-6">
                            <FaClock className="text-green-500 text-2xl" />
                            <h3 className="text-xl font-semibold text-white">Trainer <span className="text-green-500">Sessions</span></h3>
                        </div>
                        {user.assignedSessions && user.assignedSessions.length > 0 ? (
                            <div className="space-y-4">
                                {user.assignedSessions.slice().reverse().map((session, idx) => (
                                    <div key={idx} className="bg-dark-300 p-4 rounded-xl border border-dark-400 hover:border-green-500/30 transition">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-white font-bold">{session.sessionName}</p>
                                                <p className="text-gray-500 text-xs font-medium">with Coach {session.coach}</p>
                                            </div>
                                            <p className="text-green-400 text-xs font-black">{session.time}</p>
                                        </div>
                                        <p className="text-[8px] text-gray-600 mt-2 font-bold uppercase tracking-widest">{new Date(session.date).toLocaleDateString()}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-10 text-center text-gray-500 text-sm italic border border-dark-400 rounded-2xl border-dashed">
                                No sessions scheduled.
                            </div>
                        )}
                    </div>
                </div>

                {/* Feedback Form Card - Compacted & Refined */}
                <div className="bg-dark-200 mt-8 p-5 md:p-7 rounded-2xl border border-dark-400 shadow-xl max-w-2xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple/10 rounded-lg">
                            <FaCommentAlt className="text-purple text-lg" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white leading-none">Share Your Review</h3>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Gym Experience Feedback</p>
                        </div>
                    </div>

                    {feedbackStatus.message && (
                        <div className={`mb-5 px-4 py-2.5 rounded-xl text-xs font-bold border ${feedbackStatus.type === 'success' ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-red-500/10 text-red-500 border-red-500/30'}`}>
                            {feedbackStatus.message}
                        </div>
                    )}

                    <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 px-1">Satisfaction Rating</label>
                                <select
                                    className="w-full px-4 py-2.5 bg-dark-300 border border-dark-400 rounded-xl text-white text-xs focus:outline-none focus:border-purple transition cursor-pointer font-medium"
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
                            <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 px-1">Detailed Experience</label>
                            <textarea
                                className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-xl text-white text-sm focus:outline-none focus:border-purple transition min-h-[90px] max-h-[150px] resize-none placeholder:text-gray-600 font-medium"
                                placeholder="Tell us about your fitness journey here..."
                                value={feedbackForm.feedback}
                                onChange={(e) => setFeedbackForm({ ...feedbackForm, feedback: e.target.value })}
                                required
                            ></textarea>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmittingFeedback}
                                className={`px-6 py-3 bg-purple hover:bg-purple-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 cursor-pointer shadow-lg shadow-purple/20 ${isSubmittingFeedback ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isSubmittingFeedback ? 'Submitting...' : 'Post Review'}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default UserDashboard;
