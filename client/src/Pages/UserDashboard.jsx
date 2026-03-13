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
        return (
            <div className="min-h-screen bg-dark-100 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) return null;

    const activePlans = user.bookedPlans?.filter(p => p.status === 'active') || [];

    return (
        <div className="min-h-screen bg-dark-200 pt-32 pb-20 px-4 md:px-10 lg:px-20 relative overflow-x-hidden">
            {/* Decorative background elements */}
            <div className="fixed top-0 left-0 w-full h-screen pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-purple/10 rounded-full blur-[100px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-7xl mx-auto"
            >
                {/* 🏷️ DASHBOARD HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
                    <div>
                        <p className="text-purple font-black uppercase tracking-[0.3em] text-[10px] mb-4">Operations Interface</p>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
                            Athlete <span className="text-purple">Command</span>
                        </h1>
                        <p className="text-gray-500 mt-2 text-xs font-bold uppercase tracking-widest leading-relaxed">
                            Welcome back, <span className="text-white">{user.name}</span>. Systems operational.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/profile')}
                            className="px-6 py-3 bg-dark-300 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:border-purple/30 transition-all active:scale-95 shadow-xl"
                        >
                            Profile Sync
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="px-6 py-3 bg-purple/10 border border-purple/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-purple hover:bg-purple hover:text-white transition-all active:scale-95 shadow-xl shadow-purple/10"
                        >
                            Terminate Session
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* ✅ LEFT COLUMN - STATUS & STATS */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* PROFILE CARD */}
                        <div className="bg-dark-300 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                            
                            <div className="flex items-center gap-6 mb-8 relative z-10">
                                <div className="w-16 h-16 bg-purple rounded-2xl flex items-center justify-center text-white text-3xl font-black uppercase shadow-2xl shadow-purple/20">
                                    {user.name && user.name[0]}
                                </div>
                                <div>
                                    <h2 className="text-xl font-black uppercase tracking-tight text-white">{user.name}</h2>
                                    <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest">{user.role} Authorization</p>
                                </div>
                            </div>

                            <div className="space-y-4 relative z-10">
                                <div className="p-4 bg-dark-200 rounded-2xl border border-white/5 flex justify-between items-center group-hover:border-purple/20 transition-all duration-500">
                                    <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Biological Weight</span>
                                    <span className="text-white font-black text-xs">{user.weight || '--'} KG</span>
                                </div>
                                <div className="p-4 bg-dark-200 rounded-2xl border border-white/5 flex justify-between items-center group-hover:border-purple/20 transition-all duration-500">
                                    <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Structural Height</span>
                                    <span className="text-white font-black text-xs">{user.height || '--'} CM</span>
                                </div>
                                <div className="p-4 bg-dark-200 rounded-2xl border border-white/5 flex justify-between items-center group-hover:border-purple/20 transition-all duration-500">
                                    <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Data Link</span>
                                    <span className="text-white font-black text-[10px] truncate max-w-[120px]">{user.email}</span>
                                </div>
                            </div>
                        </div>

                        {/* ATTENDANCE STATS */}
                        <div className="bg-dark-300 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Consistency Protocol</h3>
                                <FaChartLine className="text-purple/50 group-hover:text-purple transition-colors" />
                            </div>

                            <div className="flex flex-col items-center py-4">
                                <div className="relative w-40 h-40 mb-8">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="80" cy="80" r="70"
                                            fill="transparent"
                                            stroke="rgba(255,255,255,0.03)"
                                            strokeWidth="10"
                                        />
                                        <motion.circle
                                            cx="80" cy="80" r="70"
                                            fill="transparent"
                                            stroke="#8b5cf6"
                                            strokeWidth="10"
                                            strokeDasharray={440}
                                            initial={{ strokeDashoffset: 440 }}
                                            animate={{ strokeDashoffset: 440 - (440 * (attendanceStats.percentage || 0)) / 100 }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-4xl font-black text-white">{attendanceStats.percentage}%</span>
                                        <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest mt-1">Efficiency</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <div className="p-4 bg-dark-200 rounded-2xl border border-white/5 text-center">
                                        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Total Deployments</p>
                                        <p className="text-white font-black">{attendanceStats.total}</p>
                                    </div>
                                    <div className="p-4 bg-dark-200 rounded-2xl border border-white/5 text-center">
                                        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Confirmed Presence</p>
                                        <p className="text-purple font-black">{attendanceStats.present}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ✅ MIDDLE/RIGHT COLUMN - ACTIVE PROTOCOLS & INTEL */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* ACTIVE PLANS */}
                        <div className="bg-dark-300 p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
                            <h3 className="text-[10px] font-black text-gray-400 mb-8 uppercase tracking-[0.3em] flex items-center gap-3">
                                <FaDumbbell className="text-purple" /> Active Protocols
                            </h3>

                            {activePlans.length > 0 ? (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {activePlans.map((plan, idx) => (
                                        <div key={idx} className="bg-linear-to-br from-dark-200 to-dark-100 p-8 rounded-[2rem] border border-purple/20 relative overflow-hidden group hover:border-purple/40 transition-all duration-500">
                                            <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple/5 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                                            
                                            <div className="flex justify-between items-start mb-6">
                                                <h4 className="text-xl font-black uppercase tracking-tight text-white">{plan.planName}</h4>
                                                <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[8px] font-black uppercase tracking-widest rounded-full border border-green-500/20">Operational</span>
                                            </div>

                                            <div className="space-y-4 mb-8">
                                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                                    <span>Initialization</span>
                                                    <span className="text-white">{new Date(plan.startDate).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                                    <span>Termination</span>
                                                    <span className="text-white">{new Date(plan.endDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            <div className="w-full bg-dark-400 h-1.5 rounded-full overflow-hidden mb-2">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: '75%' }}
                                                    transition={{ duration: 1, delay: 0.5 }}
                                                    className="bg-purple h-full rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                                                ></motion.div>
                                            </div>
                                            <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest text-right">Sequence Progress: 75%</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-dark-200 rounded-[2rem] border border-white/5 p-12 text-center">
                                    <FaExclamationTriangle className="mx-auto text-purple/20 mb-6" size={40} />
                                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-6">No active membership protocols detected.</p>
                                    <Link to="/#plans" className="inline-block px-10 py-4 bg-purple hover:bg-purple-700 text-white font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95 shadow-xl shadow-purple/20 text-[10px]">
                                        Initialize Protocol
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* NOTIFICATIONS */}
                            <div className="bg-dark-300 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden flex flex-col h-[400px]">
                                <h3 className="text-[10px] font-black text-gray-400 mb-8 uppercase tracking-[0.3em] flex items-center gap-3">
                                    <FaBell className="text-purple" /> Intel Stream
                                </h3>

                                <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-grow">
                                    {notifications.length > 0 ? (
                                        notifications.map((n) => (
                                            <div key={n._id} className="p-5 bg-dark-200 rounded-2xl border border-white/5 hover:border-purple/20 transition-all group flex gap-4">
                                                <div className="mt-1">
                                                    <FaCommentAlt className="text-purple/50 group-hover:text-purple transition-colors" size={14} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{new Date(n.createdAt).toLocaleDateString()}</span>
                                                        <button onClick={() => handleMarkAsRead(n._id)} className="text-[8px] font-black text-purple uppercase tracking-widest hover:text-white transition-colors">Clear</button>
                                                    </div>
                                                    <p className="text-gray-300 text-xs font-bold leading-relaxed">{n.message}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center">
                                            <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">Clear Intel Channel</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* FEEDBACK FORM */}
                            <div className="bg-dark-300 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden h-[400px]">
                                <h3 className="text-[10px] font-black text-gray-400 mb-8 uppercase tracking-[0.3em]">Debrief Protocol</h3>

                                {feedbackStatus.message && (
                                    <div className={`mb-6 p-4 rounded-xl text-[9px] font-black uppercase tracking-widest border ${feedbackStatus.type === 'success' ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-red-500/10 text-red-500 border-red-500/30'}`}>
                                        {feedbackStatus.message}
                                    </div>
                                )}

                                <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-gray-600 text-[9px] font-black uppercase tracking-[0.2em] ml-2">Rating Scale</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                                                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all ${feedbackForm.rating >= star ? 'bg-purple text-white shadow-lg shadow-purple/20' : 'bg-dark-200 text-gray-600'}`}
                                                >
                                                    {star}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-gray-600 text-[9px] font-black uppercase tracking-[0.2em] ml-2">Experience Narrative</label>
                                        <textarea
                                            required
                                            rows="4"
                                            value={feedbackForm.feedback}
                                            onChange={(e) => setFeedbackForm({ ...feedbackForm, feedback: e.target.value })}
                                            placeholder="SUBMIT INTEL..."
                                            className="w-full bg-dark-200 border border-white/5 rounded-2xl px-5 py-4 text-white text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-purple/50 transition-all resize-none"
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmittingFeedback}
                                        className="w-full py-4 bg-purple hover:bg-purple-700 text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] transition-all active:scale-95 shadow-xl shadow-purple/10 disabled:opacity-50"
                                    >
                                        {isSubmittingFeedback ? 'TRANSMITTING...' : 'PROCESS DEBRIEF'}
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
