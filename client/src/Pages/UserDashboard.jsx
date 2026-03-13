import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaUserCircle, FaDumbbell, FaChartLine, FaExclamationTriangle, FaBell, FaCheckCircle, FaClock, FaCommentAlt, FaPhoneAlt } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const UserDashboard = () => {
    const { user, loading, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [attendance, setAttendance] = useState([]);
    const [attendanceStats, setAttendanceStats] = useState({ percentage: 0, total: 0, present: 0 });
    const [notifications, setNotifications] = useState([]);
    const [feedbackForm, setFeedbackForm] = useState({ rating: 5, feedback: '' });
    const [feedbackStatus, setFeedbackStatus] = useState({ type: '', message: '' });
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

    useEffect(() => {
        if (user) {
            fetchNotifications();
            fetchAttendance();
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

    const fetchAttendance = async () => {
        try {
            const res = await axios.get(`/api/attendance/user/${user._id}`);
            const data = res.data;
            setAttendance(data);

            if (data.length > 0) {
                const presentCount = data.filter(a => a.status === 'Present').length;
                const percentage = Math.round((presentCount / data.length) * 100);
                setAttendanceStats({
                    percentage,
                    total: data.length,
                    present: presentCount
                });
            }
        } catch (error) {
            console.error("Failed to fetch attendance");
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
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) return null;

    const activePlans = user.bookedPlans?.filter(p => p.status === 'active') || [];

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4 md:px-8 lg:px-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white">
                            My <span className="text-purple-600">Dashboard</span>
                        </h1>
                        <p className="text-gray-400 mt-2">
                            Welcome back, {user.name}! Track your progress and plans here.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => navigate('/profile')}
                            className="px-5 py-2.5 bg-zinc-800 text-white font-semibold rounded-lg hover:bg-zinc-700 transition"
                        >
                            Profile
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="px-5 py-2.5 bg-red-600/10 text-red-500 font-semibold rounded-lg hover:bg-red-600 hover:text-white transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Profile Info */}
                        <div className="bg-[#111] p-6 rounded-2xl border border-white/5 shadow-xl">
                            <div className="flex items-center gap-4 mb-6">
                                <FaUserCircle size={48} className="text-purple-600" />
                                <div>
                                    <h2 className="text-lg font-bold text-white">{user.name}</h2>
                                    <p className="text-gray-500 text-xs">{user.email}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="p-3 bg-white/5 rounded-xl flex justify-between items-center text-sm">
                                    <span className="text-gray-400">Weight</span>
                                    <span className="text-white font-bold">{user.weight || '--'} kg</span>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl flex justify-between items-center text-sm">
                                    <span className="text-gray-400">Height</span>
                                    <span className="text-white font-bold">{user.height || '--'} cm</span>
                                </div>
                            </div>
                        </div>

                        {/* Attendance Stats */}
                        <div className="bg-[#111] p-6 rounded-2xl border border-white/5 shadow-xl">
                            <h3 className="text-sm font-bold text-gray-400 mb-6 flex items-center gap-2">
                                <FaChartLine className="text-purple-600" /> Attendance Stats
                            </h3>
                            <div className="flex flex-col items-center">
                                <div className="text-3xl font-bold text-white mb-1">{attendanceStats.percentage}%</div>
                                <div className="text-xs text-gray-500 mb-6 uppercase tracking-wider">Overall Attendance</div>
                                <div className="grid grid-cols-2 gap-3 w-full">
                                    <div className="p-3 bg-white/5 rounded-xl text-center">
                                        <p className="text-[10px] text-gray-500 uppercase">Total</p>
                                        <p className="text-white font-bold">{attendanceStats.total}</p>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl text-center">
                                        <p className="text-[10px] text-gray-500 uppercase">Present</p>
                                        <p className="text-purple-600 font-bold">{attendanceStats.present}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Active Plans */}
                        <div className="bg-[#111] p-6 rounded-2xl border border-white/5 shadow-xl">
                            <h3 className="text-sm font-bold text-gray-400 mb-6 flex items-center gap-2">
                                <FaDumbbell className="text-purple-600" /> My Plans
                            </h3>
                            {activePlans.length > 0 ? (
                                <div className="grid md:grid-cols-2 gap-4">
                                    {activePlans.map((plan, idx) => (
                                        <div key={idx} className="p-5 bg-white/5 rounded-xl border border-white/10">
                                            <div className="flex justify-between items-start mb-4">
                                                <h4 className="font-bold text-white">{plan.planName}</h4>
                                                <span className="text-[10px] bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full uppercase">Active</span>
                                            </div>
                                            <div className="text-[11px] text-gray-400 space-y-1">
                                                <div className="flex justify-between">
                                                    <span>Starts</span>
                                                    <span>{new Date(plan.startDate).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Ends</span>
                                                    <span>{new Date(plan.endDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-10 text-center">
                                    <FaExclamationTriangle className="mx-auto text-yellow-500/30 mb-4" size={32} />
                                    <p className="text-gray-500 text-sm mb-6">No active plans found.</p>
                                    <Link to="/#plans" className="inline-block px-6 py-2.5 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition">
                                        Browse Plans
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Notifications */}
                            <div className="bg-[#111] p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col h-[350px]">
                                <h3 className="text-sm font-bold text-gray-400 mb-6 flex items-center gap-2">
                                    <FaBell className="text-purple-600" /> Notifications
                                </h3>
                                <div className="space-y-3 overflow-y-auto flex-grow pr-2">
                                    {notifications.length > 0 ? (
                                        notifications.map((n) => (
                                            <div key={n._id} className="p-4 bg-white/5 rounded-lg border border-white/5">
                                                <div className="flex justify-between items-start mb-1 text-[10px] text-gray-500">
                                                    <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                                                    <button onClick={() => handleMarkAsRead(n._id)} className="text-purple-600 font-bold hover:underline">Dismiss</button>
                                                </div>
                                                <p className="text-xs text-gray-300 leading-normal">{n.message}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-gray-600 text-xs">
                                            No notifications
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Feedback */}
                            <div className="bg-[#111] p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col h-[350px]">
                                <h3 className="text-sm font-bold text-gray-400 mb-6 flex items-center gap-2">
                                    <FaCommentAlt className="text-purple-600" /> Feedback
                                </h3>
                                {feedbackStatus.message && (
                                    <div className={`mb-4 p-3 rounded-lg text-xs ${feedbackStatus.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {feedbackStatus.message}
                                    </div>
                                )}
                                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition ${feedbackForm.rating >= star ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-500'}`}
                                            >
                                                {star}
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        required
                                        rows="4"
                                        value={feedbackForm.feedback}
                                        onChange={(e) => setFeedbackForm({ ...feedbackForm, feedback: e.target.value })}
                                        placeholder="Your experience..."
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-xs focus:outline-none focus:border-purple-600 transition resize-none"
                                    ></textarea>
                                    <button
                                        type="submit"
                                        disabled={isSubmittingFeedback}
                                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition disabled:opacity-50"
                                    >
                                        {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default UserDashboard;
