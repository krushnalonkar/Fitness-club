import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaUserEdit, FaSearch, FaUserCircle, FaTimes, FaEnvelope, FaUser } from 'react-icons/fa';
import AdminSidebar from '../Components/AdminSidebar';
import AdminHeader from '../Components/AdminHeader';
import axios from 'axios';

const ManageUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState('');
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [updateForm, setUpdateForm] = useState({ name: '', email: '', role: '' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const res = await axios.get('/api/users', {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setUsers(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching users:", error);
            setLoading(false);
        }
    };

    const handleDelete = async (id, email, name) => {
        if (window.confirm(`Are you sure you want to delete ${name}? An email notification will be sent.`)) {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                await axios.delete(`/api/users/${id}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                });
                setUsers(users.filter(u => u._id !== id));

                // MOCK EMAIL NOTIFICATION
                console.log(`%c[SYSTEM ALERT]: Email sent to ${email} notifying them about account suspension.`, 'color: #ef4444; font-weight: bold;');

                setMessage(`User ${name} deleted successfully! Cancellation mail sent.`);
                setTimeout(() => setMessage(''), 3000);
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    };

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setUpdateForm({ name: user.name, email: user.email, role: user.role });
        setShowUpdateModal(true);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            await axios.put(`/api/users/${selectedUser._id}`, updateForm, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });

            setMessage("Member details updated successfully!");
            setShowUpdateModal(false);
            fetchUsers();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error("Update Error:", error);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">
                                Manage <span className="text-purple">Users</span>
                            </h1>
                            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mt-1">Gym Membership Directory</p>
                        </div>

                        <div className="relative w-full md:w-80">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-dark-100/50 border border-dark-400 rounded-xl text-white focus:outline-none focus:border-purple transition"
                            />
                        </div>
                    </div>

                    {message && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-green-500/10 border border-green-500/50 text-green-500 p-4 rounded-xl mb-6 flex justify-center text-sm font-semibold"
                        >
                            {message}
                        </motion.div>
                    )}

                    <div className="bg-dark-100/50 rounded-2xl border border-dark-400 overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-dark-300/50 border-b border-dark-400">
                                    <tr>
                                        <th className="px-6 py-4 text-gray-500 font-bold text-[10px] uppercase tracking-widest">User Details</th>
                                        <th className="px-6 py-4 text-gray-500 font-bold text-[10px] uppercase tracking-widest">Email Address</th>
                                        <th className="px-6 py-4 text-gray-500 font-bold text-[10px] uppercase tracking-widest">Access Level</th>
                                        <th className="px-6 py-4 text-gray-500 font-bold text-[10px] uppercase tracking-widest">Join Date</th>
                                        <th className="px-6 py-4 text-gray-500 font-bold text-[10px] uppercase tracking-widest text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-dark-400">
                                    <AnimatePresence>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-20 text-center text-gray-500">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className="w-8 h-8 border-4 border-purple border-t-transparent rounded-full animate-spin"></div>
                                                        <p className="text-xs uppercase font-bold tracking-widest mt-2">Loading members...</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : filteredUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-10 text-center text-gray-500 italic text-sm">
                                                    No members found matching your search.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredUsers.map((user) => (
                                                <motion.tr
                                                    key={user._id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    onClick={() => navigate(`/admin/users/${user._id}`)}
                                                    className="hover:bg-dark-300/30 transition group cursor-pointer"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-purple/10 rounded-lg text-purple group-hover:bg-purple group-hover:text-white transition duration-300">
                                                                <FaUserCircle size={18} />
                                                            </div>
                                                            <span className="text-white text-sm font-semibold tracking-tight">{user.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-400 text-xs">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${user.role === 'admin'
                                                            ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                                            : 'bg-green-500/10 text-green-500 border border-green-500/20'
                                                            }`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-400 text-xs font-medium">
                                                        {new Date(user.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-center gap-3">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleEditClick(user);
                                                                }}
                                                                className="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition"
                                                                title="Update Member Info"
                                                            >
                                                                <FaUserEdit size={16} />
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDelete(user._id, user.email, user.name);
                                                                }}
                                                                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
                                                                title="Revoke Membership"
                                                            >
                                                                <FaTrash size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))
                                        )}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Update User Modal */}
            <AnimatePresence>
                {showUpdateModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-dark-200 border border-dark-400 rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
                        >
                            <button
                                onClick={() => setShowUpdateModal(false)}
                                className="absolute top-6 right-6 text-gray-500 hover:text-white transition"
                            >
                                <FaTimes size={18} />
                            </button>

                            <h2 className="text-xl font-bold text-white mb-2">Update <span className="text-purple">Member</span></h2>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-6 border-b border-dark-400 pb-4">Modify account configurations</p>

                            <form onSubmit={handleUpdateSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <FaUser size={10} className="text-purple" /> Full Name
                                    </label>
                                    <input
                                        value={updateForm.name}
                                        onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
                                        className="w-full bg-dark-300 border border-dark-400 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple transition"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <FaEnvelope size={10} className="text-purple" /> Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={updateForm.email}
                                        onChange={(e) => setUpdateForm({ ...updateForm, email: e.target.value })}
                                        className="w-full bg-dark-300 border border-dark-400 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple transition"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">Account Role</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="role"
                                                checked={updateForm.role === 'user'}
                                                onChange={() => setUpdateForm({ ...updateForm, role: 'user' })}
                                                className="hidden"
                                            />
                                            <span className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition border ${updateForm.role === 'user' ? 'bg-purple border-purple text-white shadow-lg shadow-purple/20' : 'bg-dark-300 border-dark-400 text-gray-500 hover:border-purple/50'}`}>User Member</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="role"
                                                checked={updateForm.role === 'admin'}
                                                onChange={() => setUpdateForm({ ...updateForm, role: 'admin' })}
                                                className="hidden"
                                            />
                                            <span className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition border ${updateForm.role === 'admin' ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-dark-300 border-dark-400 text-gray-500 hover:border-red-500/50'}`}>Administrator</span>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-purple hover:bg-purple-700 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition shadow-lg shadow-purple/20 mt-4"
                                >
                                    Confirm Update
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageUsers;
