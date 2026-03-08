import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../Components/AdminSidebar';
import AdminHeader from '../Components/AdminHeader';
import { FaUserCheck, FaUserTimes, FaSearch, FaCalendarAlt, FaUserCircle } from 'react-icons/fa';
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
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

            const { data: userData } = await axios.get('/api/users', config);
            setUsers(userData);

            const { data: attendanceData } = await axios.get(`/api/attendance/date/${date}`, config);

            const attendanceMap = {};
            let pCount = 0;

            attendanceData.forEach(record => {
                attendanceMap[record.user._id] = record.status;
                if (record.status === 'Present') pCount++;
            });

            setAttendance(attendanceMap);
            setStats({ present: pCount, absent: userData.length - pCount });
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (userId, status) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

            await axios.post('/api/attendance', { userId, date, status }, config);
            setAttendance(prev => ({ ...prev, [userId]: status }));

            const newAttendance = { ...attendance, [userId]: status };
            const presentCount = Object.values(newAttendance).filter(v => v === 'Present').length;
            setStats({
                present: presentCount,
                absent: users.length - presentCount
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
        <div className="flex bg-dark-100 min-h-screen">
            <AdminSidebar />
            <AdminHeader />

            <div className="flex-1 lg:ml-72 pt-24 lg:pt-32 px-4 sm:px-10 pb-20 overflow-y-auto bg-dark-200">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-6xl mx-auto"
                >
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">
                                Manage <span className="text-purple">Attendance</span>
                            </h1>
                            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mt-1">Daily Membership Tracking</p>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search member..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-dark-100/50 border border-dark-400 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-purple transition"
                                />
                            </div>
                            <div className="bg-dark-100/50 border border-dark-400 rounded-xl px-4 py-2 flex items-center gap-3">
                                <FaCalendarAlt className="text-purple" />
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="bg-transparent text-white font-bold text-sm focus:outline-none cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        <div className="bg-dark-100/50 p-6 rounded-2xl border border-dark-400 flex items-center justify-between shadow-xl">
                            <div>
                                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Total Present</p>
                                <h3 className="text-3xl font-black text-green-500 mt-1">{stats.present}</h3>
                            </div>
                            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500">
                                <FaUserCheck size={24} />
                            </div>
                        </div>
                        <div className="bg-dark-100/50 p-6 rounded-2xl border border-dark-400 flex items-center justify-between shadow-xl">
                            <div>
                                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Not Marked / Absent</p>
                                <h3 className="text-3xl font-black text-red-500 mt-1">{users.length - stats.present}</h3>
                            </div>
                            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500">
                                <FaUserTimes size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-dark-100/50 rounded-2xl border border-dark-400 overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-dark-300/50 border-b border-dark-400">
                                    <tr>
                                        <th className="px-6 py-4 text-gray-500 font-bold text-[10px] uppercase tracking-widest">Member Details</th>
                                        <th className="px-6 py-4 text-gray-500 font-bold text-[10px] uppercase tracking-widest text-center">Current Status</th>
                                        <th className="px-6 py-4 text-gray-500 font-bold text-[10px] uppercase tracking-widest text-right">Attendance Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-dark-400">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="w-8 h-8 border-4 border-purple border-t-transparent rounded-full animate-spin"></div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-2">Syncing Records...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-10 text-center text-gray-500 italic text-sm">No members found.</td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <tr key={user._id} className="hover:bg-dark-300/30 transition group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-purple/10 rounded-lg text-purple group-hover:bg-purple group-hover:text-white transition duration-300">
                                                            <FaUserCircle size={20} />
                                                        </div>
                                                        <div>
                                                            <div className="text-white text-sm font-semibold tracking-tight capitalize">{user.name}</div>
                                                            <div className="text-[10px] text-gray-500 font-medium">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border inline-block min-w-[100px] ${attendance[user._id] === 'Present'
                                                            ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                            : attendance[user._id] === 'Absent'
                                                                ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                                                : 'bg-dark-300 text-gray-500 border-dark-400'
                                                        }`}>
                                                        {attendance[user._id] || 'Not Marked'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-3">
                                                        <button
                                                            onClick={() => handleStatusChange(user._id, 'Present')}
                                                            className={`p-2.5 rounded-xl transition-all border ${attendance[user._id] === 'Present'
                                                                    ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/20'
                                                                    : 'bg-dark-300 border-dark-400 text-gray-500 hover:border-green-500/50 hover:text-green-500'
                                                                }`}
                                                            title="Mark Present"
                                                        >
                                                            <FaUserCheck size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(user._id, 'Absent')}
                                                            className={`p-2.5 rounded-xl transition-all border ${attendance[user._id] === 'Absent'
                                                                    ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20'
                                                                    : 'bg-dark-300 border-dark-400 text-gray-500 hover:border-red-500/50 hover:text-red-500'
                                                                }`}
                                                            title="Mark Absent"
                                                        >
                                                            <FaUserTimes size={16} />
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
        </div>
    );
};

export default ManageAttendance;
