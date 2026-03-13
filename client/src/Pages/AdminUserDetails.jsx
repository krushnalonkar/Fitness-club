import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaArrowLeft, FaUserCircle, FaEnvelope, FaCalendarAlt,
    FaDumbbell, FaChartLine, FaHistory, FaWeight, FaRulerVertical,
    FaCheckCircle, FaClock, FaPhoneAlt, FaWhatsapp
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

    // Form States
    const [progressForm, setProgressForm] = useState({ weight: '', height: '' });
    const [workoutForm, setWorkoutForm] = useState({ workoutName: '', repsSets: '', cardioSteps: '' });
    const [sessionForm, setSessionForm] = useState({ sessionName: '', time: '', coach: '' });
    const [updating, setUpdating] = useState(false);

    const fetchUserDetails = useCallback(async () => {
        try {
            setLoading(true);
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!userInfo || !userInfo.token) {
                setError("No admin token found. Please re-login.");
                setLoading(false);
                return;
            }

            const res = await axios.get(`/api/admin/member-profile/${id}`, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });

            setUser(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Fetch Error:", err);
            setError(`Request failed: ${err.response?.data?.message || err.message}`);
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchUserDetails();
    }, [fetchUserDetails]);

    const handleCancelPlan = async (planId) => {
        if (!window.confirm("Are you sure you want to cancel this plan?")) return;

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
        if (!window.confirm("Are you sure you want to delete this plan record?")) return;

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

    const handleUpdateProgress = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const res = await axios.post(`/api/admin/member-actions/${id}/progress`, progressForm, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setUser(res.data);
            setProgressForm({ weight: '', height: '' });
            alert("Vitals updated successfully!");
        } catch (err) {
            alert(`Update failed: ${err.response?.data?.message || err.message}`);
        } finally {
            setUpdating(false);
        }
    };

    const handleAssignWorkout = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const res = await axios.post(`/api/admin/member-actions/${id}/workout`, workoutForm, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setUser(res.data);
            setWorkoutForm({ workoutName: '', repsSets: '', cardioSteps: '' });
            alert("Workout assigned!");
        } catch (err) {
            alert(`Assignment failed: ${err.response?.data?.message || err.message}`);
        } finally {
            setUpdating(false);
        }
    };

    const handleAssignSession = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const res = await axios.post(`/api/admin/member-actions/${id}/session`, sessionForm, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setUser(res.data);
            setSessionForm({ sessionName: '', time: '', coach: '' });
            alert("Session scheduled!");
        } catch (err) {
            alert("Scheduling failed: " + err.message);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
                <div className="bg-[#111] p-8 rounded-xl border border-white/10 text-center max-w-md">
                    <p className="text-red-500 mb-6">{error || "User not found."}</p>
                    <button onClick={() => navigate('/admin/users')} className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold">Back to Users</button>
                </div>
            </div>
        );
    }

    const latestProgress = (user.progress && user.progress.length > 0)
        ? user.progress[user.progress.length - 1]
        : { weight: 'N/A', height: 'N/A' };

    return (
        <div className="flex bg-[#0a0a0a] min-h-screen">
            <AdminSidebar />
            <AdminHeader />

            <div className="flex-1 lg:ml-72 pt-24 px-4 sm:px-8 pb-12 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="flex items-center gap-2 text-gray-500 hover:text-white transition mb-6"
                    >
                        <FaArrowLeft size={14} />
                        <span className="text-sm font-bold">Back to Users</span>
                    </button>

                    {/* Profile Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#111] border border-white/10 rounded-xl p-6 md:p-8 shadow-xl mb-8 flex flex-col md:flex-row items-center gap-6 md:gap-10"
                    >
                        <div className="w-24 h-24 bg-white/5 rounded-2xl flex items-center justify-center text-purple-600">
                            <FaUserCircle size={64} />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-xs text-gray-400">
                                <span className="flex items-center gap-2"><FaEnvelope className="text-purple-600" /> {user.email}</span>
                                <span className="flex items-center gap-2"><FaPhoneAlt className="text-purple-600" /> {user.phone}</span>
                                <span className="flex items-center gap-2"><FaCalendarAlt className="text-purple-600" /> Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${user.role === 'admin' ? 'bg-red-600/10 text-red-500' : 'bg-green-600/10 text-green-500'}`}>{user.role}</span>
                            </div>
                        </div>
                        <a
                            href={`https://wa.me/91${user.phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition shadow-lg shadow-green-600/20"
                        >
                            <FaWhatsapp size={18} /> WhatsApp
                        </a>
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Stats Column */}
                        <div className="space-y-8">
                            {/* Vitals */}
                            <div className="bg-[#111] border border-white/10 rounded-xl p-6">
                                <h3 className="text-white font-bold text-sm mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
                                    <FaDumbbell className="text-purple-600" /> Measurements
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-4 rounded-xl text-center">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Weight</p>
                                        <p className="text-xl font-bold text-white">{latestProgress.weight || '--'} <span className="text-xs font-normal">kg</span></p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl text-center">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Height</p>
                                        <p className="text-xl font-bold text-white">{latestProgress.height || '--'} <span className="text-xs font-normal">cm</span></p>
                                    </div>
                                </div>
                            </div>

                            {/* Plan Status */}
                            <div className="bg-[#111] border border-white/10 rounded-xl p-6">
                                <h3 className="text-white font-bold text-sm mb-6 flex items-center gap-2 border-b border-white/5 pb-4">Current Plan</h3>
                                {user.bookedPlans && user.bookedPlans.length > 0 ? (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-purple-600/10 border border-purple-600/20 rounded-xl">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-purple-600 font-bold text-xs uppercase">{user.bookedPlans[user.bookedPlans.length - 1].planName}</span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded border ${user.bookedPlans[user.bookedPlans.length - 1].status === 'cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/10' : 'bg-green-500/10 text-green-500 border-green-500/10'}`}>
                                                    {user.bookedPlans[user.bookedPlans.length - 1].status.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="text-[10px] text-gray-500 flex items-center gap-2 mt-3">
                                                <FaClock /> Ends on {new Date(user.bookedPlans[user.bookedPlans.length - 1].endDate).toLocaleDateString()}
                                            </div>
                                            {user.bookedPlans[user.bookedPlans.length - 1].status === 'active' && (
                                                <button
                                                    onClick={() => handleCancelPlan(user.bookedPlans[user.bookedPlans.length - 1]._id)}
                                                    className="w-full mt-4 py-2 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white transition rounded-lg text-xs font-bold"
                                                >
                                                    Cancel Plan
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-xs italic text-center py-4">No active plan found</p>
                                )}
                            </div>

                            {/* Log Progress */}
                            <div className="bg-[#111] border border-white/10 rounded-xl p-6">
                                <h3 className="text-white font-bold text-sm mb-6 flex items-center gap-2 border-b border-white/5 pb-4">Update Vitals</h3>
                                <form onSubmit={handleUpdateProgress} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="number"
                                            placeholder="Weight"
                                            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-xs outline-none focus:border-purple-600"
                                            value={progressForm.weight}
                                            onChange={(e) => setProgressForm({ ...progressForm, weight: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="number"
                                            placeholder="Height"
                                            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-xs outline-none focus:border-purple-600"
                                            value={progressForm.height}
                                            onChange={(e) => setProgressForm({ ...progressForm, height: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <button type="submit" disabled={updating} className="w-full py-2 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 transition">Log Progress</button>
                                </form>
                            </div>
                        </div>

                        {/* Main Interaction Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Membership History */}
                            <div className="bg-[#111] border border-white/10 rounded-xl p-6 md:p-8">
                                <h3 className="text-white font-bold text-sm mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
                                    <FaHistory className="text-purple-600" /> Plan History
                                </h3>
                                <div className="space-y-4">
                                    {user.bookedPlans && user.bookedPlans.length > 0 ? (
                                        user.bookedPlans.slice().reverse().map((plan, idx) => (
                                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 rounded-xl gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-purple-600/10 rounded-lg flex items-center justify-center text-purple-600">
                                                        <FaCalendarAlt size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-bold text-sm">{plan.planName}</p>
                                                        <p className="text-[10px] text-gray-500 uppercase mt-0.5">{new Date(plan.bookingDate).toLocaleDateString()} • ₹{plan.price}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 justify-end">
                                                    <span className={`text-[10px] px-2 py-0.5 rounded border h-fit ${plan.status === 'cancelled' ? 'text-red-500 border-red-500/20 bg-red-500/5' : 'text-green-500 border-green-500/20 bg-green-500/5'}`}>
                                                        {plan.status.toUpperCase()}
                                                    </span>
                                                    <button onClick={() => handleDeletePlan(plan._id)} className="text-xs text-gray-500 hover:text-red-500 p-1"><FaArrowLeft className="rotate-45" size={12} /></button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-xs text-center py-6">No records found</p>
                                    )}
                                </div>
                            </div>

                            {/* Assignment Forms */}
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-[#111] border border-white/10 rounded-xl p-6">
                                    <h3 className="text-white font-bold text-sm mb-6 border-b border-white/5 pb-4">Assign Workout</h3>
                                    <form onSubmit={handleAssignWorkout} className="space-y-3">
                                        <input
                                            type="text"
                                            placeholder="Workout Name"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-xs outline-none focus:border-purple-600"
                                            value={workoutForm.workoutName}
                                            onChange={(e) => setWorkoutForm({ ...workoutForm, workoutName: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="Reps / Sets"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-xs outline-none focus:border-purple-600"
                                            value={workoutForm.repsSets}
                                            onChange={(e) => setWorkoutForm({ ...workoutForm, repsSets: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="number"
                                            placeholder="Steps Goal"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-xs outline-none focus:border-purple-600"
                                            value={workoutForm.cardioSteps}
                                            onChange={(e) => setWorkoutForm({ ...workoutForm, cardioSteps: e.target.value })}
                                        />
                                        <button type="submit" className="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition">Assign Workout</button>
                                    </form>
                                </div>

                                <div className="bg-[#111] border border-white/10 rounded-xl p-6">
                                    <h3 className="text-white font-bold text-sm mb-6 border-b border-white/5 pb-4">Schedule Session</h3>
                                    <form onSubmit={handleAssignSession} className="space-y-3">
                                        <input
                                            type="text"
                                            placeholder="Session Type"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-xs outline-none focus:border-purple-600"
                                            value={sessionForm.sessionName}
                                            onChange={(e) => setSessionForm({ ...sessionForm, sessionName: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="Time (e.g. 10:00 AM)"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-xs outline-none focus:border-purple-600"
                                            value={sessionForm.time}
                                            onChange={(e) => setSessionForm({ ...sessionForm, time: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="Coach"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-xs outline-none focus:border-purple-600"
                                            value={sessionForm.coach}
                                            onChange={(e) => setSessionForm({ ...sessionForm, coach: e.target.value })}
                                            required
                                        />
                                        <button type="submit" className="w-full py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition">Schedule</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUserDetails;
