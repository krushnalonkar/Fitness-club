import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaEdit, FaCheckCircle, FaStar, FaTimes } from 'react-icons/fa';
import AdminSidebar from '../Components/AdminSidebar';
import AdminHeader from '../Components/AdminHeader';
import axios from 'axios';

const ManagePlans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        duration: '',
        features: '',
        popular: false
    });
    const [status, setStatus] = useState({ type: '', message: '' });

    const fetchPlans = async () => {
        try {
            const res = await axios.get('/api/plans');
            setPlans(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Fetch Plans Error:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const featuresArray = typeof formData.features === 'string'
            ? formData.features.split(',').map(f => f.trim())
            : formData.features;

        const planData = { ...formData, features: featuresArray };

        try {
            if (editingPlan) {
                await axios.put(`/api/plans/${editingPlan._id}`, planData, config);
                setStatus({ type: 'success', message: 'Plan updated successfully!' });
            } else {
                await axios.post('/api/plans', planData, config);
                setStatus({ type: 'success', message: 'Plan added successfully!' });
            }

            setFormData({ name: '', price: '', duration: '', features: '', popular: false });
            setShowModal(false);
            setEditingPlan(null);
            fetchPlans();
            setTimeout(() => setStatus({ type: '', message: '' }), 3000);
        } catch (error) {
            setStatus({ type: 'error', message: error.response?.data?.message || 'Something went wrong' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this plan?')) return;
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

        try {
            await axios.delete(`/api/plans/${id}`, config);
            setStatus({ type: 'success', message: 'Plan deleted.' });
            fetchPlans();
            setTimeout(() => setStatus({ type: '', message: '' }), 3000);
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to delete plan' });
        }
    };

    const handleEdit = (plan) => {
        setEditingPlan(plan);
        setFormData({
            name: plan.name,
            price: plan.price,
            duration: plan.duration,
            features: plan.features.join(', '),
            popular: plan.popular
        });
        setShowModal(true);
    };

    return (
        <div className="flex bg-[#0a0a0a] min-h-screen">
            <AdminSidebar />
            <AdminHeader />
            <div className="flex-1 lg:ml-72 pt-24 px-4 sm:px-8 pb-12 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                Manage <span className="text-purple-600">Plans</span>
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">Configure gym membership packages.</p>
                        </div>
                        <button
                            onClick={() => {
                                setEditingPlan(null);
                                setFormData({ name: '', price: '', duration: '', features: '', popular: false });
                                setShowModal(true);
                            }}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold transition shadow-lg shadow-purple-600/20"
                        >
                            <FaPlus /> Add New Plan
                        </button>
                    </div>

                    {status.message && (
                        <div className={`mb-6 p-4 rounded-lg border text-sm text-center ${status.type === 'success' ? 'bg-green-600/10 text-green-500 border-green-600/20' : 'bg-red-600/10 text-red-500 border-red-600/20'}`}>
                            {status.message}
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            <div className="col-span-full text-center py-20 text-gray-500">Loading plans...</div>
                        ) : plans.length > 0 ? (
                            plans.map((plan) => (
                                <div
                                    key={plan._id}
                                    className={`bg-[#111] border rounded-xl p-6 relative group ${plan.popular ? 'border-purple-600 shadow-xl shadow-purple-600/10' : 'border-white/10'}`}
                                >
                                    {plan.popular && (
                                        <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase">
                                            Recommended
                                        </div>
                                    )}
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                            <button onClick={() => handleEdit(plan)} className="text-blue-500 hover:text-blue-400"><FaEdit size={14} /></button>
                                            <button onClick={() => handleDelete(plan._id)} className="text-red-500 hover:text-red-400"><FaTrash size={14} /></button>
                                        </div>
                                    </div>
                                    <div className="mb-6 flex items-baseline gap-1">
                                        <span className="text-2xl font-bold text-white">{plan.price}</span>
                                        <span className="text-gray-500 text-xs">{plan.duration}</span>
                                    </div>
                                    <ul className="space-y-3 mb-8">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-2 text-xs text-gray-400">
                                                <FaCheckCircle className="text-purple-600" size={10} /> {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <button onClick={() => handleEdit(plan)} className="w-full py-2 bg-white/5 hover:bg-purple-600 text-gray-400 hover:text-white rounded-lg text-xs font-bold transition">Edit Plan</button>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 bg-[#111] border border-dashed border-white/10 rounded-xl">
                                <p className="text-gray-500 text-sm">No plans found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#111] border border-white/10 rounded-xl p-8 max-w-lg w-full relative"
                        >
                            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><FaTimes size={18} /></button>
                            <h2 className="text-xl font-bold text-white mb-6">{editingPlan ? 'Edit' : 'Add'} Membership Plan</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Plan Name" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm outline-none" required />
                                    <input name="price" value={formData.price} onChange={handleChange} placeholder="Price (e.g. ₹999)" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm outline-none" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input name="duration" value={formData.duration} onChange={handleChange} placeholder="Duration (e.g. /month)" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm outline-none" required />
                                    <div className="flex items-center gap-2 px-2">
                                        <input type="checkbox" name="popular" checked={formData.popular} onChange={handleChange} className="w-4 h-4 rounded" />
                                        <span className="text-gray-400 text-xs">Popular Plan</span>
                                    </div>
                                </div>
                                <textarea name="features" value={formData.features} onChange={handleChange} placeholder="Features (comma separated)" rows="3" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm outline-none resize-none" required></textarea>
                                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-bold text-sm transition mt-4">
                                    {editingPlan ? 'Update Plan' : 'Create Plan'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManagePlans;
