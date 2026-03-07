import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaArrowLeft, FaUserCircle, FaEnvelope, FaCalendarAlt,
    FaDumbbell, FaChartLine, FaHistory, FaWeight, FaRulerVertical,
    FaCheckCircle, FaClock
} from 'react-icons/fa';
import AdminSidebar from '../Components/AdminSidebar';
import AdminHeader from '../Components/AdminHeader';
import axios from 'axios';

const AdminUserDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUserDetails();
    }, [id]);

    const fetchUserDetails = async () => {
        try {
            setLoading(true);
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!userInfo || !userInfo.token) {
                setError("No admin token found. Please re-login.");
                setLoading(false);
                return;
            }

            const targetURL = `/api/admin/member-profile/${id}`;
            const res = await axios.get(targetURL, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });

            console.log("Admin View: Raw Member Data:", res.data);
            setUser(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Fetch Error:", err);
            setError(`Request failed: ${err.response?.data?.message || err.message}`);
            setLoading(false);
        }
    };

    const handleCancelPlan = async (planId) => {
        if (!window.confirm("Are you sure you want to CANCEL this membership? The user will lose access to gym facilities.")) return;

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const res = await axios.put(`/api/admin/member-actions/${id}/plans/${planId}/cancel`, {}, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            alert("Membership cancelled successfully.");
            setUser({ ...user, bookedPlans: res.data.bookedPlans });
        } catch (err) {
            alert(`Cancellation failed: ${err.response?.data?.message || err.message}`);
        }
    };

    const handleDeletePlan = async (planId) => {
        if (!window.confirm("CRITICAL: Are you sure you want to DELETE this plan record? This action cannot be undone.")) return;

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const res = await axios.delete(`/api/admin/member-actions/${id}/plans/${planId}`, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            alert("Plan record deleted successfully.");
            setUser({ ...user, bookedPlans: res.data.bookedPlans });
        } catch (err) {
            alert(`Deletion failed: ${err.response?.data?.message || err.message}`);
        }
    };

    if (loading) {
        return (
            <div className="flex bg-dark-100 min-h-screen items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Loading Member Data...</p>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="flex bg-dark-100 min-h-screen items-center justify-center text-white px-10">
                <div className="bg-dark-200 border border-dark-400 p-8 rounded-3xl text-center max-w-md shadow-2xl">
                    <div className="text-red-500 mb-4 font-bold">Error Encountered</div>
                    <p className="text-gray-400 text-sm mb-6">{error || "User record could not be retrieved from the server."}</p>
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="bg-purple px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest"
                    >
                        Return to Directory
                    </button>
                </div>
            </div>
        );
    }

    const latestProgress = (user.progress && user.progress.length > 0)
        ? user.progress[user.progress.length - 1]
        : { weight: 'N/A', height: 'N/A' };

    // Fallback for individual missing fields
    const displayWeight = latestProgress.weight !== undefined && latestProgress.weight !== null ? latestProgress.weight : 'N/A';
    const displayHeight = latestProgress.height !== undefined && latestProgress.height !== null ? latestProgress.height : 'N/A';

    return (
        <div className="flex bg-dark-100 min-h-screen">
            <AdminSidebar />
            <AdminHeader />

            <div className="flex-1 lg:ml-72 pt-24 lg:pt-32 px-4 sm:px-10 pb-20 overflow-y-auto bg-dark-200">
                <div className="max-w-6xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="flex items-center gap-2 text-gray-500 hover:text-white transition mb-8 group cursor-pointer"
                    >
                        <FaArrowLeft className="group-hover:-translate-x-1 transition" />
                        <span className="text-sm font-bold uppercase tracking-widest text-[10px]">Back to Directory</span>
                    </button>

                    {/* Profile Header Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-dark-200 border border-dark-400 rounded-3xl p-8 shadow-2xl relative overflow-hidden mb-8"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

                        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                            <div className="w-32 h-32 bg-purple/10 rounded-3xl flex items-center justify-center text-purple border border-purple/20 shadow-2xl shadow-purple/10">
                                <FaUserCircle size={64} />
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-4xl font-black text-white mb-2">{user.name}</h1>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                        <FaEnvelope className="text-purple" /> {user.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                        <FaCalendarAlt className="text-purple" /> Joined {new Date(user.createdAt).toLocaleDateString()}
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                                        {user.role} Status
                                    </span>
                                    {user.progress && user.progress.length > 0 && (
                                        <div className="flex gap-4 border-l border-dark-400 pl-4 h-5 items-center">
                                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest"><span className="text-white">Start: </span>{user.progress[0].weight}kg / {user.progress[0].height}cm</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-8 items-start">
                        {/* Left Column: Fitness & Status */}
                        <div className="space-y-8">
                            {/* Health Vitals Card */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-dark-200 border border-dark-400 rounded-3xl p-6 shadow-xl"
                            >
                                <h3 className="text-white font-bold text-sm mb-6 flex items-center gap-2">
                                    <FaDumbbell className="text-purple" /> Latest <span className="text-purple">Vitals</span>
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-dark-300 p-4 rounded-2xl border border-dark-400">
                                        <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">
                                            <FaWeight className="text-blue-400" /> Weight
                                        </div>
                                        <div className="text-2xl font-black text-white">{displayWeight} <span className="text-xs text-gray-500">kg</span></div>
                                    </div>
                                    <div className="bg-dark-300 p-4 rounded-2xl border border-dark-400">
                                        <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">
                                            <FaRulerVertical className="text-green-400" /> Height
                                        </div>
                                        <div className="text-2xl font-black text-white">{displayHeight} <span className="text-xs text-gray-500">cm</span></div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Plan Status Card */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-dark-200 border border-dark-400 rounded-3xl p-6 shadow-xl relative overflow-hidden"
                            >
                                <h3 className="text-white font-bold text-sm mb-6">Subscription <span className="text-purple">Status</span></h3>
                                {user.bookedPlans && user.bookedPlans.length > 0 ? (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-purple/10 border border-purple/20 rounded-2xl relative group">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-purple font-black text-xs uppercase tracking-widest">{user.bookedPlans[user.bookedPlans.length - 1].planName}</span>
                                                <FaCheckCircle className={user.bookedPlans[user.bookedPlans.length - 1].status === 'cancelled' ? 'text-red-500' : 'text-green-500'} />
                                            </div>
                                            <div className="text-white font-bold text-lg">
                                                {user.bookedPlans[user.bookedPlans.length - 1].status === 'cancelled' ? 'Cancelled Plan' : 'Active Plan'}
                                            </div>
                                            <div className="text-[10px] text-gray-400 mt-2 flex items-center gap-2">
                                                <FaClock /> {user.bookedPlans[user.bookedPlans.length - 1].status === 'cancelled' ? 'Stopped on ' : 'Expires on '}
                                                {new Date(user.bookedPlans[user.bookedPlans.length - 1].endDate).toLocaleDateString()}
                                            </div>

                                            {user.bookedPlans[user.bookedPlans.length - 1].status === 'active' && (
                                                <button
                                                    onClick={() => handleCancelPlan(user.bookedPlans[user.bookedPlans.length - 1]._id)}
                                                    className="mt-6 w-full py-3 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
                                                >
                                                    Cancel Membership
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-10 text-center border-2 border-dashed border-dark-400 rounded-2xl">
                                        <p className="text-gray-500 text-xs italic">No active membership</p>
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        {/* Right Column: History & Progress */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Membership History */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-dark-200 border border-dark-400 rounded-3xl p-8 shadow-xl"
                            >
                                <h3 className="text-white font-bold text-sm mb-6 flex items-center gap-2">
                                    <FaHistory className="text-purple" /> Plan <span className="text-purple">History</span>
                                </h3>

                                <div className="space-y-4">
                                    {user.bookedPlans && user.bookedPlans.length > 0 ? (
                                        user.bookedPlans.slice().reverse().map((plan, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-dark-300 border border-dark-400 rounded-2xl group hover:border-purple/30 transition">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-purple/5 rounded-xl flex items-center justify-center text-purple">
                                                        <FaCalendarAlt size={14} />
                                                    </div>
                                                    <div>
                                                        <div className="text-white font-bold text-sm flex items-center gap-2">
                                                            {plan.planName}
                                                            <span className={`text-[8px] px-2 py-0.5 rounded-md ${plan.status === 'cancelled' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                                                {plan.status || 'Active'}
                                                            </span>
                                                        </div>
                                                        <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{new Date(plan.bookingDate).toLocaleDateString()} • ₹{plan.price}</div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    {plan.status === 'active' && (
                                                        <button
                                                            onClick={() => handleCancelPlan(plan._id)}
                                                            className="text-[9px] font-black uppercase text-red-500 bg-red-500/10 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeletePlan(plan._id)}
                                                        className="text-[9px] font-black uppercase text-gray-400 bg-white/5 px-3 py-1.5 rounded-lg hover:bg-red-600 hover:text-white transition"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-sm italic">No past bookings found.</p>
                                    )}
                                </div>
                            </motion.div>

                            {/* Progress Tracking */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-dark-200 border border-dark-400 rounded-3xl p-8 shadow-xl"
                            >
                                <h3 className="text-white font-bold text-sm mb-8 flex items-center gap-2">
                                    <FaChartLine className="text-purple" /> Fitness <span className="text-purple">Journey</span>
                                </h3>

                                {user.progress && user.progress.length > 1 ? (
                                    <div className="h-48 flex items-end gap-2">
                                        {user.progress.slice(-10).map((entry, idx) => (
                                            <div key={idx} className="flex-1 flex flex-col items-center group relative">
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${(entry.weight / 150) * 100}%` }}
                                                    className="w-full bg-purple/40 group-hover:bg-purple transition rounded-t-lg relative"
                                                >
                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[8px] font-bold text-white opacity-0 group-hover:opacity-100 transition whitespace-nowrap bg-purple px-2 py-0.5 rounded">
                                                        {entry.weight} kg
                                                    </div>
                                                </motion.div>
                                                <span className="text-[7px] text-gray-500 font-bold uppercase mt-2">{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-10 text-center text-gray-500 text-sm italic border border-dark-400 rounded-2xl border-dashed">
                                        Provide more progress updates to see the visualization.
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUserDetails;
