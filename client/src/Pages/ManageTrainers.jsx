import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaDumbbell, FaUserGraduate, FaTimes, FaEdit, FaImage, FaUserAlt } from 'react-icons/fa';
import AdminSidebar from '../Components/AdminSidebar';
import AdminHeader from '../Components/AdminHeader';
import axios from 'axios';

const ManageTrainers = () => {
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [formData, setFormData] = useState({ name: '', specialty: '', experience: '', image: '' });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchTrainers();
    }, []);

    const fetchTrainers = async () => {
        try {
            const res = await axios.get('/api/trainers');
            setTrainers(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Fetch Trainers Error:", error);
            setLoading(false);
        }
    };

    const handleOpenAddModal = () => {
        setEditMode(false);
        setSelectedTrainer(null);
        setFormData({ name: '', specialty: '', experience: '', image: '' });
        setShowModal(true);
    };

    const handleOpenEditModal = (trainer) => {
        setEditMode(true);
        setSelectedTrainer(trainer);
        setFormData({
            name: trainer.name,
            specialty: trainer.specialty,
            experience: trainer.experience,
            image: trainer.image
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };

            if (editMode) {
                await axios.put(`/api/trainers/${selectedTrainer._id}`, formData, config);
                setMessage("Trainer updated successfully!");
            } else {
                await axios.post('/api/trainers', formData, config);
                setMessage("New trainer added successfully!");
            }

            setShowModal(false);
            fetchTrainers();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            alert(error.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to remove this trainer?")) {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                await axios.delete(`/api/trainers/${id}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                });
                setMessage("Trainer removed.");
                fetchTrainers();
                setTimeout(() => setMessage(''), 3000);
            } catch (error) {
                alert("Failed to delete trainer");
            }
        }
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
                                Manage <span className="text-purple">Trainers</span>
                            </h1>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Gym Expert Team</p>
                        </div>
                        <button
                            onClick={handleOpenAddModal}
                            className="bg-purple hover:bg-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition shadow-lg shadow-purple/20 active:scale-95"
                        >
                            <FaPlus /> Add New Trainer
                        </button>
                    </div>

                    {message && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-purple/10 border border-purple/30 text-purple p-4 rounded-xl text-center text-xs font-bold uppercase tracking-widest mb-8"
                        >
                            {message}
                        </motion.div>
                    )}

                    {loading ? (
                        <div className="text-center py-20 text-gray-400">Loading trainers...</div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-8">
                            {trainers.map((trainer) => (
                                <motion.div
                                    key={trainer._id}
                                    whileHover={{ y: -5 }}
                                    className="bg-dark-100/50 border border-dark-400 rounded-3xl overflow-hidden shadow-xl hover:border-purple/50 group transition duration-300 shadow-2xl relative cursor-pointer"
                                >
                                    <div className="h-64 overflow-hidden relative">
                                        <img
                                            src={trainer.image || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80'}
                                            alt={trainer.name}
                                            className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition duration-700 scale-110 group-hover:scale-100"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-dark-200 via-transparent to-transparent opacity-60"></div>

                                        {/* Quick Actions Overlay */}
                                        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition duration-300 transform translate-x-4 group-hover:translate-x-0">
                                            <button
                                                onClick={() => handleOpenEditModal(trainer)}
                                                className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-purple transition shadow-xl"
                                                title="Edit Trainer"
                                            >
                                                <FaEdit size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(trainer._id)}
                                                className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-red-500 transition shadow-xl"
                                                title="Delete Trainer"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-8">
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple transition">{trainer.name}</h3>
                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center gap-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                                                <div className="w-6 h-6 rounded-lg bg-purple/10 flex items-center justify-center">
                                                    <FaDumbbell className="text-purple" size={12} />
                                                </div>
                                                {trainer.specialty}
                                            </div>
                                            <div className="flex items-center gap-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                                                <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                                    <FaUserGraduate className="text-blue-400" size={12} />
                                                </div>
                                                {trainer.experience} Experience
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleOpenEditModal(trainer)}
                                            className="w-full py-3 bg-dark-300 hover:bg-purple text-gray-400 hover:text-white border border-dark-400 hover:border-purple rounded-xl text-[10px] font-black uppercase tracking-widest transition duration-300"
                                        >
                                            View Details / Edit
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Add / Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-dark-200 border border-dark-400 rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
                        >
                            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition">
                                <FaTimes size={18} />
                            </button>

                            <h2 className="text-xl font-bold text-white mb-2">
                                {editMode ? 'Update' : 'Register'} <span className="text-purple">Trainer</span>
                            </h2>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-8 border-b border-dark-400 pb-4">
                                {editMode ? 'Modify expert staff profile' : 'Onboard new expert trainer'}
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <FaUserAlt size={10} className="text-purple" /> Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-dark-300 border border-dark-400 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple transition"
                                        placeholder="Ex: Vikram Singh"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <FaDumbbell size={10} className="text-purple" /> Specialty
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.specialty}
                                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                                        className="w-full bg-dark-300 border border-dark-400 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple transition"
                                        placeholder="Ex: Bodybuilding, MMA"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <FaUserGraduate size={10} className="text-purple" /> Years of Experience
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.experience}
                                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                        className="w-full bg-dark-300 border border-dark-400 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple transition"
                                        placeholder="Ex: 5 Years"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <FaImage size={10} className="text-purple" /> Profile Image URL
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full bg-dark-300 border border-dark-400 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple transition"
                                        placeholder="https://images.unsplash.com/..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-purple hover:bg-purple-700 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest transition shadow-lg shadow-purple/20 mt-4 active:scale-95"
                                >
                                    {editMode ? 'Save Changes' : 'Confirm Registration'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageTrainers;
