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
            const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : null;
            const config = { headers: { Authorization: `Bearer ${token}` } };

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
        <div className="flex min-h-screen bg-[#0f111a] text-white">
            <AdminSidebar />

            <div className="flex-1 lg:ml-72 transition-all duration-300">
                <AdminHeader title="Attendance Logs" />

                <main className="p-4 md:p-8">
                    {/* Upper Stats & Date Select */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl flex items-center gap-5">
                            <div className="w-14 h-14 bg-purple/20 rounded-2xl flex items-center justify-center">
                                <FaCalendarAlt className="text-purple text-2xl" />
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Select Date</p>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="bg-transparent text-white font-bold text-lg focus:outline-none w-full cursor-pointer"
                                />
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl flex items-center gap-5 border-l-4 border-l-green-500">
                            <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center">
                                <FaUserCheck className="text-green-500 text-2xl" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Present</p>
                                <h3 className="text-2xl font-black">{stats.present}</h3>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl flex items-center gap-5 border-l-4 border-l-red-500/50">
                            <div className="w-14 h-14 bg-red-500/20 rounded-2xl flex items-center justify-center">
                                <FaUserTimes className="text-red-500 text-2xl" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Absent / Pending</p>
                                <h3 className="text-2xl font-black">{users.length - stats.present}</h3>
                            </div>
                        </motion.div>
                    </div>

                    {/* Search Section */}
                    <div className="relative mb-8 group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-500 group-focus-within:text-purple transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Find a member..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-purple/50 focus:ring-4 focus:ring-purple/10 transition-all text-lg placeholder:text-gray-600 shadow-xl"
                        />
                    </div>

                    {/* Data Table */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Member Info</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Current Status</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="3" className="px-8 py-20 text-center">
                                                <div className="flex justify-center"><div className="w-10 h-10 border-4 border-purple border-t-transparent rounded-full animate-spin"></div></div>
                                            </td>
                                        </tr>
                                    ) : filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="px-8 py-10 text-center text-gray-500">No matching members found.</td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <tr key={user._id} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple to-indigo-600 flex items-center justify-center font-black text-lg shadow-lg">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-200 group-hover:text-white transition-colors capitalize">{user.name}</div>
                                                            <div className="text-xs text-gray-500 font-medium">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-center">
                                                    <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${attendance[user._id] === 'Present'
                                                            ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                            : attendance[user._id] === 'Absent'
                                                                ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                                                : 'bg-white/5 text-gray-500 border-white/10'
                                                        }`}>
                                                        {attendance[user._id] || 'Not Marked'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <div className="flex justify-end gap-3">
                                                        <button
                                                            onClick={() => handleStatusChange(user._id, 'Present')}
                                                            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${attendance[user._id] === 'Present'
                                                                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/20 scale-105'
                                                                    : 'bg-white/5 text-gray-500 hover:bg-green-500/20 hover:text-green-500 border border-white/5'
                                                                }`}
                                                        >
                                                            <FaUserCheck size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(user._id, 'Absent')}
                                                            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${attendance[user._id] === 'Absent'
                                                                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/20 scale-105'
                                                                    : 'bg-white/5 text-gray-500 hover:bg-red-500/20 hover:text-red-500 border border-white/5'
                                                                }`}
                                                        >
                                                            <FaUserTimes size={18} />
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
                </main>
            </div>
        </div>
    );
};

export default ManageAttendance;
