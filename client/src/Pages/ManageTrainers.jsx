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
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

            if (editMode) {
                await axios.put(`/api/trainers/${selectedTrainer._id}`, formData, config);
                setMessage("Trainer updated successfully!");
            } else {
                await axios.post('/api/trainers', formData, config);
                setMessage("Trainer added successfully!");
            }

            setShowModal(false);
            fetchTrainers();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            alert(error.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Remove this trainer?")) {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                await axios.delete(`/api/trainers/${id}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                });
                setMessage("Trainer deleted.");
                fetchTrainers();
                setTimeout(() => setMessage(''), 3000);
            } catch (error) {
                alert("Deletion failed");
            }
        }
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
                                Manage <span className="text-purple-600">Trainers</span>
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">Add or update gym expert staff.</p>
                        </div>
                        <button
                            onClick={handleOpenAddModal}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold transition shadow-lg shadow-purple-600/20"
                        >
                            <FaPlus /> Add Trainer
                        </button>
                    </div>

                    {message && (
                        <div className="bg-purple-600/10 border border-purple-600/20 text-purple-600 p-3 rounded-lg text-center text-sm mb-8">
                            {message}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-20 text-gray-400">Loading staff...</div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-6">
                            {trainers.map((trainer) => (
                                <div
                                    key={trainer._id}
                                    className="bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-xl hover:border-purple-600/50 group transition duration-300"
                                >
                                    <div className="h-60 overflow-hidden relative">
                                        <img
                                            src={trainer.image || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80'}
                                            alt={trainer.name}
                                            className="w-full h-full object-cover object-top"
                                        />
                                        <div className="absolute top-2 right-2 flex gap-2">
                                            <button onClick={() => handleOpenEditModal(trainer)} className="p-2 bg-black/60 hover:bg-purple-600 text-white rounded-lg transition"><FaEdit size={12} /></button>
                                            <button onClick={() => handleDelete(trainer._id)} className="p-2 bg-black/60 hover:bg-red-600 text-white rounded-lg transition"><FaTrash size={12} /></button>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold text-white mb-3">{trainer.name}</h3>
                                        <div className="space-y-2 text-xs text-gray-400 mb-6">
                                            <p className="flex items-center gap-2"><FaDumbbell className="text-purple-600" /> {trainer.specialty}</p>
                                            <p className="flex items-center gap-2"><FaUserGraduate className="text-purple-600" /> {trainer.experience} Exp</p>
                                        </div>
                                        <button onClick={() => handleOpenEditModal(trainer)} className="w-full py-2 bg-white/5 hover:bg-purple-600 text-gray-400 hover:text-white rounded-lg text-xs font-bold transition">Edit Details</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
                            className="bg-[#111] border border-white/10 rounded-xl p-8 max-w-md w-full shadow-2xl relative"
                        >
                            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><FaTimes size={18} /></button>
                            <h2 className="text-xl font-bold text-white mb-6">{editMode ? 'Edit' : 'Add'} Trainer</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-purple-600"
                                    placeholder="Full Name"
                                    required
                                />
                                <input
                                    type="text"
                                    value={formData.specialty}
                                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-purple-600"
                                    placeholder="Ex: Bodybuilding, MMA"
                                    required
                                />
                                <input
                                    type="text"
                                    value={formData.experience}
                                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-purple-600"
                                    placeholder="Experience (e.g. 5 Years)"
                                    required
                                />
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-purple-600"
                                    placeholder="Image URL"
                                />
                                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-bold text-sm transition mt-4">
                                    {editMode ? 'Save Changes' : 'Register Trainer'}
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
