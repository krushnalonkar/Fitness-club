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

            <div className="flex-1 lg:ml-72 pt-32 lg:pt-40 px-4 sm:px-10 pb-20 overflow-y-auto bg-dark-200">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-6xl mx-auto"
                >
                    {/* Header Info */}
                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="text-3xl font-black text-white tracking-tight">
                            Daily <span className="text-purple">Attendance</span>
                        </h1>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Member Tracking & Logs</p>
                    </div>

                    {/* The 3 STAT BOXES - Back by demand but pushed lower */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {/* Box 1: Date Select */}
                        <div className="bg-dark-100/60 p-6 rounded-[2rem] border border-white/5 shadow-2xl flex items-center gap-5">
                            <div className="w-14 h-14 bg-purple/10 rounded-2xl flex items-center justify-center text-purple">
                                <FaCalendarAlt size={24} />
                            </div>
                            <div>
                                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Select Date</p>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="bg-transparent text-white font-bold text-lg focus:outline-none cursor-pointer mt-0.5"
                                />
                            </div>
                        </div>

                        {/* Box 2: Present Count */}
                        <div className="bg-dark-100/60 p-6 rounded-[2rem] border border-green-500/10 shadow-2xl flex items-center gap-5 border-l-4 border-l-green-500">
                            <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500">
                                <FaUserCheck size={24} />
                            </div>
                            <div>
                                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Total Present</p>
                                <h3 className="text-3xl font-black text-green-500">{stats.present}</h3>
                            </div>
                        </div>

                        {/* Box 3: Absent/Not Marked Count */}
                        <div className="bg-dark-100/60 p-6 rounded-[2rem] border border-red-500/10 shadow-2xl flex items-center gap-5 border-l-4 border-l-red-500">
                            <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
                                <FaUserTimes size={24} />
                            </div>
                            <div>
                                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Absent / Pending</p>
                                <h3 className="text-3xl font-black text-red-500">{users.length - stats.present}</h3>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar Block */}
                    <div className="relative mb-10">
                        <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple" />
                        <input
                            type="text"
                            placeholder="Search member by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-dark-100/40 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:border-purple/30 focus:ring-4 focus:ring-purple/5 transition-all text-sm"
                        />
                    </div>

                    {/* Table Section */}
                    <div className="bg-dark-100/50 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/[0.02] border-b border-white/5">
                                    <tr>
                                        <th className="px-8 py-6 text-gray-500 font-bold text-[10px] uppercase tracking-widest">Member Directory</th>
                                        <th className="px-8 py-6 text-gray-500 font-bold text-[10px] uppercase tracking-widest text-center">Live Status</th>
                                        <th className="px-8 py-6 text-gray-500 font-bold text-[10px] uppercase tracking-widest text-right">Quick Mark</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.03]">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="3" className="px-8 py-32 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="w-10 h-10 border-4 border-purple border-t-transparent rounded-full animate-spin"></div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-purple">Fetching Attendance...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="px-8 py-20 text-center text-gray-500 italic">No records found.</td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <tr key={user._id} className="hover:bg-white/[0.01] transition-all group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple/20 to-purple/5 border border-purple/20 flex items-center justify-center text-purple font-black shadow-inner">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="text-white text-sm font-bold tracking-tight capitalize group-hover:text-purple transition-colors">{user.name}</div>
                                                            <div className="text-[10px] text-gray-600 font-medium mt-0.5">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border inline-block min-w-[110px] ${attendance[user._id] === 'Present'
                                                            ? 'bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]'
                                                            : attendance[user._id] === 'Absent'
                                                                ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
                                                                : 'bg-white/5 text-gray-600 border-white/5'
                                                        }`}>
                                                        {attendance[user._id] || 'Not Marked'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex justify-end gap-3">
                                                        <button
                                                            onClick={() => handleStatusChange(user._id, 'Present')}
                                                            className={`w-12 h-12 rounded-2xl transition-all border flex items-center justify-center ${attendance[user._id] === 'Present'
                                                                    ? 'bg-green-500 border-green-500 text-white shadow-xl shadow-green-500/20 scale-110'
                                                                    : 'bg-white/5 border-white/5 text-gray-600 hover:border-green-500/50 hover:text-green-500'
                                                                }`}
                                                            title="Mark Present"
                                                        >
                                                            <FaUserCheck size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(user._id, 'Absent')}
                                                            className={`w-12 h-12 rounded-2xl transition-all border flex items-center justify-center ${attendance[user._id] === 'Absent'
                                                                    ? 'bg-red-500 border-red-500 text-white shadow-xl shadow-red-500/20 scale-110'
                                                                    : 'bg-white/5 border-white/5 text-gray-600 hover:border-red-500/50 hover:text-red-500'
                                                                }`}
                                                            title="Mark Absent"
                                                        >
                                                            <FaUserTimes size={20} />
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
