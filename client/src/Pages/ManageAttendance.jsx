import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../Components/AdminSidebar';
import AdminHeader from '../Components/AdminHeader';
import { FaUserCheck, FaUserTimes, FaSearch, FaCalendarAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ManageAttendance = () => {
    const [users, setUsers] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({ present: 0, absent: 0 });

    useEffect(() => {
        fetchUsersAndAttendance();
    }, [date]);

    const fetchUsersAndAttendance = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : null;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Fetch all users
            const { data: userData } = await axios.get('/api/users', config);
            setUsers(userData);

            // Fetch attendance for the specific date
            const { data: attendanceData } = await axios.get(`/api/attendance/date/${date}`, config);

            // Map existing attendance to a state object for easy access
            const attendanceMap = {};
            let pCount = 0;
            let aCount = 0;

            attendanceData.forEach(record => {
                attendanceMap[record.user._id] = record.status;
                if (record.status === 'Present') pCount++;
                else aCount++;
            });

            setAttendance(attendanceMap);
            setStats({ present: pCount, absent: aCount });
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (userId, status) => {
        try {
            const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : null;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.post('/api/attendance', { userId, date, status }, config);

            // Update local state
            setAttendance(prev => ({ ...prev, [userId]: status }));

            // Recalculate stats locally for better UX
            const newAttendance = { ...attendance, [userId]: status };
            const values = Object.values(newAttendance);
            setStats({
                present: values.filter(v => v === 'Present').length,
                absent: values.filter(v => v === 'Absent').length
            });

        } catch (error) {
            alert('Error marking attendance: ' + (error.response?.data?.message || error.message));
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex min-h-screen bg-gray-900 text-white">
            <AdminSidebar />
            <div className="flex-1 ml-64">
                <AdminHeader title="Manage Attendance" />

                <main className="p-8">
                    {/* Header Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm font-medium">Date Selected</p>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="bg-transparent text-xl font-bold focus:outline-none text-orange-500 mt-1 cursor-pointer"
                                    />
                                </div>
                                <div className="p-3 bg-orange-500/10 rounded-xl">
                                    <FaCalendarAlt className="text-orange-500 text-2xl" />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm font-medium">Present Today</p>
                                    <h3 className="text-3xl font-bold text-green-500">{stats.present}</h3>
                                </div>
                                <div className="p-3 bg-green-500/10 rounded-xl">
                                    <FaUserCheck className="text-green-500 text-2xl" />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm font-medium">Absent / Not Marked</p>
                                    <h3 className="text-3xl font-bold text-red-500">{users.length - stats.present}</h3>
                                </div>
                                <div className="p-3 bg-red-500/10 rounded-xl">
                                    <FaUserTimes className="text-red-500 text-2xl" />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6 relative">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-orange-500 transition-all shadow-lg"
                        />
                    </div>

                    {/* Users Table */}
                    <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
                        <table className="w-full text-left">
                            <thead className="bg-gray-900/50 border-b border-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Member</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                <AnimatePresence>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-20 text-center text-gray-400">
                                                <div className="flex flex-col items-center justify-center animate-pulse">
                                                    <div className="w-12 h-12 bg-gray-700 rounded-full mb-4"></div>
                                                    <p>Loading members...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-10 text-center text-gray-400">No members found matching your search.</td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((user, index) => (
                                            <motion.tr
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                key={user._id}
                                                className="hover:bg-gray-700/30 transition-colors group"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center font-bold text-white mr-3 shadow-lg">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-200">{user.name}</div>
                                                            <div className="text-sm text-gray-500">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${attendance[user._id] === 'Present'
                                                            ? 'bg-green-500/20 text-green-500 border border-green-500/30'
                                                            : attendance[user._id] === 'Absent'
                                                                ? 'bg-red-500/20 text-red-500 border border-red-500/30'
                                                                : 'bg-gray-600/20 text-gray-400 border border-gray-600/30'
                                                        }`}>
                                                        {attendance[user._id] || 'Not Marked'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end space-x-2">
                                                        <button
                                                            onClick={() => handleStatusChange(user._id, 'Present')}
                                                            className={`p-2 rounded-lg transition-all ${attendance[user._id] === 'Present'
                                                                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 scale-110'
                                                                    : 'bg-gray-700 text-gray-400 hover:bg-green-500/20 hover:text-green-500'
                                                                }`}
                                                            title="Mark Present"
                                                        >
                                                            <FaUserCheck />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(user._id, 'Absent')}
                                                            className={`p-2 rounded-lg transition-all ${attendance[user._id] === 'Absent'
                                                                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-110'
                                                                    : 'bg-gray-700 text-gray-400 hover:bg-red-500/20 hover:text-red-500'
                                                                }`}
                                                            title="Mark Absent"
                                                        >
                                                            <FaUserTimes />
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
                </main>
            </div>
        </div>
    );
};

export default ManageAttendance;
