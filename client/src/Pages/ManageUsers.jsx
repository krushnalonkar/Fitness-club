import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaUserEdit, FaSearch, FaUserCircle, FaTimes, FaEnvelope, FaUser, FaPhoneAlt } from 'react-icons/fa';
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
    const [updateForm, setUpdateForm] = useState({ name: '', email: '', phone: '', role: '' });

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
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                await axios.delete(`/api/users/${id}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                });
                setUsers(users.filter(u => u._id !== id));
                setMessage(`User ${name} deleted successfully!`);
                setTimeout(() => setMessage(''), 3000);
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    };

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setUpdateForm({ name: user.name, email: user.email, phone: user.phone || '', role: user.role });
        setShowUpdateModal(true);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            await axios.put(`/api/users/${selectedUser._id}`, updateForm, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });

            setMessage("User details updated successfully!");
            setShowUpdateModal(false);
            fetchUsers();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error("Update Error:", error);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone && user.phone.includes(searchTerm))
    );

    return (
        <div className="flex bg-[#0a0a0a] min-h-screen">
            <AdminSidebar />
            <AdminHeader />
            <div className="flex-1 lg:ml-72 pt-24 px-4 sm:px-8 pb-12 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-7xl mx-auto"
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                Manage <span className="text-purple-600">Users</span>
                            </h1>
                            <p className="text-gray-500 text-xs mt-1">Directory of all gym members and administrators.</p>
                        </div>

                        <div className="relative w-full md:w-80">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-600 transition"
                            />
                        </div>
                    </div>

                    {message && (
                        <div className="bg-green-600/10 border border-green-600/20 text-green-500 p-3 rounded-lg mb-6 text-sm">
                            {message}
                        </div>
                    )}

                    <div className="bg-[#111] rounded-xl border border-white/10 overflow-hidden shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 border-b border-white/10">
                                    <tr>
                                        <th className="px-6 py-3 text-gray-400 font-bold text-xs uppercase">User</th>
                                        <th className="px-6 py-3 text-gray-400 font-bold text-xs uppercase">Contact</th>
                                        <th className="px-6 py-3 text-gray-400 font-bold text-xs uppercase">Role</th>
                                        <th className="px-6 py-3 text-gray-400 font-bold text-xs uppercase">Joined</th>
                                        <th className="px-6 py-3 text-gray-400 font-bold text-xs uppercase text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-20 text-center">
                                                <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                            </td>
                                        </tr>
                                    ) : filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-10 text-center text-gray-500 text-sm">
                                                No users found.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <tr
                                                key={user._id}
                                                className="hover:bg-white/5 transition cursor-pointer"
                                                onClick={() => navigate(`/admin/users/${user._id}`)}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <FaUserCircle size={24} className="text-purple-600" />
                                                        <span className="text-white text-sm font-semibold">{user.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-gray-400 text-xs">{user.email}</p>
                                                    <p className="text-gray-500 text-[10px]">{user.phone}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${user.role === 'admin' ? 'bg-red-600/10 text-red-500' : 'bg-green-600/10 text-green-500'}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-400 text-xs">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center gap-4">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleEditClick(user); }}
                                                            className="text-gray-400 hover:text-white"
                                                        >
                                                            <FaUserEdit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(user._id, user.email, user.name); }}
                                                            className="text-gray-400 hover:text-red-500"
                                                        >
                                                            <FaTrash size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showUpdateModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#111] border border-white/10 rounded-xl p-8 max-w-md w-full shadow-2xl relative"
                        >
                            <button onClick={() => setShowUpdateModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                                <FaTimes size={18} />
                            </button>
                            <h2 className="text-xl font-bold text-white mb-6">Update Member</h2>
                            <form onSubmit={handleUpdateSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 text-xs font-bold mb-2">Name</label>
                                    <input
                                        value={updateForm.name}
                                        onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-purple-600 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-xs font-bold mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={updateForm.email}
                                        onChange={(e) => setUpdateForm({ ...updateForm, email: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-purple-600 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-xs font-bold mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        value={updateForm.phone}
                                        onChange={(e) => setUpdateForm({ ...updateForm, phone: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-purple-600 outline-none"
                                        required
                                        pattern="[0-9]{10}"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-xs font-bold mb-2">Role</label>
                                    <select
                                        value={updateForm.role}
                                        onChange={(e) => setUpdateForm({ ...updateForm, role: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none"
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-bold text-sm transition mt-4">
                                    Save Changes
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
