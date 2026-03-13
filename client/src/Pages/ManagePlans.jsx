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
        const config = {
            headers: { Authorization: `Bearer ${userInfo.token}` }
        };

        // Convert features string to array
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
                setStatus({ type: 'success', message: 'New plan added successfully!' });
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
        if (!window.confirm('Are you sure you want to delete this plan?')) return;

        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = {
            headers: { Authorization: `Bearer ${userInfo.token}` }
        };

        try {
            await axios.delete(`/api/plans/${id}`, config);
            setStatus({ type: 'success', message: 'Plan deleted successfully!' });
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
        <div className="flex bg-dark-100 min-h-screen">
            <AdminSidebar />
            <AdminHeader />
            <div className="flex-1 lg:ml-72 pt-24 lg:pt-32 px-4 sm:px-10 pb-20 overflow-y-auto bg-dark-200">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-6xl mx-auto"
                >
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">
                                Manage <span className="text-purple">Gym Plans</span>
                            </h1>
                            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mt-1">Gym Membership Configuration</p>
                        </div>
                        <button
                            onClick={() => {
                                setEditingPlan(null);
                                setFormData({ name: '', price: '', duration: '', features: '', popular: false });
                                setShowModal(true);
                            }}
                            className="bg-purple hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2 shadow-lg shadow-purple/20"
                        >
                            <FaPlus /> Add New Plan
                        </button>
                    </div>

                    {status.message && (
                        <div className={`mb-6 px-6 py-4 rounded-xl border ${status.type === 'success' ? 'bg-green-500/10 text-green-500 border-green-500/50' : 'bg-red-500/10 text-red-500 border-red-500/50'}`}>
                            {status.message}
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            <div className="col-span-full text-center py-20 text-gray-400">Loading plans...</div>
                        ) : plans.length > 0 ? (
                            plans.map((plan) => (
                                <motion.div
                                    key={plan._id}
                                    layout
                                    className={`bg-dark-200 rounded-2xl border ${plan.popular ? 'border-purple shadow-xl shadow-purple/10' : 'border-dark-400'} p-6 relative group overflow-hidden`}
                                >
                                    {plan.popular && (
                                        <div className="absolute top-0 right-0 bg-purple text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-widest">
                                            Most Popular
                                        </div>
                                    )}

                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-bold text-white tracking-tight">{plan.name}</h3>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(plan)} className="p-2 bg-dark-300 text-blue-400 hover:text-blue-300 rounded-lg transition">
                                                <FaEdit />
                                            </button>
                                            <button onClick={() => handleDelete(plan._id)} className="p-2 bg-dark-300 text-red-400 hover:text-red-300 rounded-lg transition">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <span className="text-2xl font-black text-purple">{plan.price}</span>
                                        <span className="text-gray-500 text-xs font-bold uppercase tracking-widest ml-1">{plan.duration}</span>
                                    </div>

                                    <ul className="space-y-3 mb-8">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                                <FaCheckCircle className="text-purple shrink-0" size={12} />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="pt-4 border-t border-dark-400 flex justify-between items-center text-xs text-gray-500">
                                        <span>Added: {new Date(plan.createdAt).toLocaleDateString()}</span>
                                        {plan.popular && <FaStar className="text-yellow-500" />}
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 bg-dark-200 rounded-2xl border border-dashed border-dark-400">
                                <p className="text-gray-500">No plans created yet. Click "Add New Plan" to start.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Plan Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-dark-200 border border-dark-400 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative"
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-6 right-6 text-gray-500 hover:text-white transition"
                            >
                                <FaTimes size={20} />
                            </button>

                            <h2 className="text-2xl font-bold text-white mb-6">
                                {editingPlan ? 'Edit Gym Plan' : 'Add New Gym Plan'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Plan Name</label>
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="e.g. Pro Plan"
                                            className="w-full bg-dark-300 border border-dark-400 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple transition"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Price (with ₹)</label>
                                        <input
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            placeholder="e.g. ₹2999"
                                            className="w-full bg-dark-300 border border-dark-400 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple transition"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Duration</label>
                                        <input
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleChange}
                                            placeholder="e.g. /month"
                                            className="w-full bg-dark-300 border border-dark-400 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple transition"
                                            required
                                        />
                                    </div>
                                    <div className="flex items-end pb-3">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                name="popular"
                                                checked={formData.popular}
                                                onChange={handleChange}
                                                className="w-5 h-5 rounded border-dark-400 text-purple bg-dark-300 focus:ring-purple"
                                            />
                                            <span className="text-gray-300 text-sm font-medium group-hover:text-white transition">Mark as Popular</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Features (Comma separated)</label>
                                    <textarea
                                        name="features"
                                        value={formData.features}
                                        onChange={handleChange}
                                        placeholder="Gym Access, Trainer, Diet Plan..."
                                        rows="3"
                                        className="w-full bg-dark-300 border border-dark-400 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple transition resize-none"
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-purple hover:bg-purple-700 text-white py-4 rounded-xl font-bold transition shadow-lg shadow-purple/20 mt-4"
                                >
                                    {editingPlan ? 'Update Plan Configuration' : 'Create New Membership Plan'}
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
