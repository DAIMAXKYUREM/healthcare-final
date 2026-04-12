import React, { useEffect, useState, useMemo } from 'react';
import api from '../../api/axiosInstance';
import { format, subDays } from 'date-fns';
import { Badge } from '../../components/common/Badge';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';
import { Users, Activity, Calendar, DollarSign, AlertCircle, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const AdminDashboard = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    activeDoctors: 0,
    activePatients: 0,
    availableStaff: 0,
    upcomingAppointments: 0,
    emergencies: 0,
    totalIncome: 0,
    totalExpenses: 0,
    profit: 0
  });
  
  // Filters
  const [filterDate, setFilterDate] = useState('');
  const [filterSearch, setFilterSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchDashboardData = async () => {
    try {
      const [aptRes, metricsRes] = await Promise.all([
        api.get('/admin/appointments'),
        api.get('/admin/metrics')
      ]);
      setAppointments(aptRes.data);
      setMetrics(metricsRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCancel = async (id: number) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await api.put(`/appointments/${id}/cancel`);
      toast.success('Appointment cancelled');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to cancel appointment');
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const matchDate = filterDate ? apt.appointment_date === filterDate : true;
      const matchStatus = filterStatus ? apt.status === filterStatus : true;
      const searchLower = filterSearch.toLowerCase();
      const matchSearch = filterSearch 
        ? apt.patient_name.toLowerCase().includes(searchLower) || apt.doctor_name.toLowerCase().includes(searchLower)
        : true;
      return matchDate && matchSearch && matchStatus;
    });
  }, [appointments, filterDate, filterSearch, filterStatus]);

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Mock historical data for charts based on current metrics
  const historicalData = useMemo(() => {
    const data = [];
    let currentIncome = metrics.totalIncome > 0 ? metrics.totalIncome / 30 : 1000;
    let currentExpense = metrics.totalExpenses > 0 ? metrics.totalExpenses / 30 : 500;
    
    for (let i = 30; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'MMM dd');
      // Add some random variation
      const incomeVariation = currentIncome * (0.8 + Math.random() * 0.4);
      const expenseVariation = currentExpense * (0.8 + Math.random() * 0.4);
      
      data.push({
        name: date,
        Income: Math.round(incomeVariation),
        Expenses: Math.round(expenseVariation),
        Profit: Math.round(incomeVariation - expenseVariation)
      });
    }
    return data;
  }, [metrics]);

  const appointmentStatsData = useMemo(() => {
    const statuses = appointments.reduce((acc: any, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {});
    
    return Object.keys(statuses).map(key => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      count: statuses[key]
    }));
  }, [appointments]);

  const userStatsData = useMemo(() => {
    return [
      { name: 'Patients', count: metrics.activePatients },
      { name: 'Doctors', count: metrics.activeDoctors },
      { name: 'Staff', count: metrics.availableStaff }
    ];
  }, [metrics]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 md:p-10 max-w-7xl mx-auto"
    >
      <h1 className="text-3xl font-light text-slate-900 mb-8 tracking-tight">Admin Dashboard</h1>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10"
      >
        <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="bg-white p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 transition-all hover:shadow-[0_8px_16px_rgba(0,0,0,0.06)] flex items-center">
          <div className="p-3 bg-slate-50 rounded-xl mr-4 border border-slate-100"><Users className="h-6 w-6 text-slate-700" /></div>
          <div>
            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Patients</h3>
            <p className="text-2xl font-bold text-slate-800">{metrics.activePatients}</p>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="bg-white p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 transition-all hover:shadow-[0_8px_16px_rgba(0,0,0,0.06)] flex items-center">
          <div className="p-3 bg-slate-50 rounded-xl mr-4 border border-slate-100"><Activity className="h-6 w-6 text-slate-700" /></div>
          <div>
            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Doctors</h3>
            <p className="text-2xl font-bold text-slate-800">{metrics.activeDoctors}</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="bg-white p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 transition-all hover:shadow-[0_8px_16px_rgba(0,0,0,0.06)] flex items-center">
          <div className="p-3 bg-slate-50 rounded-xl mr-4 border border-slate-100"><Briefcase className="h-6 w-6 text-slate-700" /></div>
          <div>
            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Available Staff</h3>
            <p className="text-2xl font-bold text-slate-800">{metrics.availableStaff}</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="bg-white p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 transition-all hover:shadow-[0_8px_16px_rgba(0,0,0,0.06)] flex items-center">
          <div className="p-3 bg-slate-50 rounded-xl mr-4 border border-slate-100"><Calendar className="h-6 w-6 text-slate-700" /></div>
          <div>
            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Upcoming Appts</h3>
            <p className="text-2xl font-bold text-slate-800">{metrics.upcomingAppointments}</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="bg-white p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 transition-all hover:shadow-[0_8px_16px_rgba(0,0,0,0.06)] flex items-center">
          <div className="p-3 bg-red-50 rounded-xl mr-4 border border-red-100"><AlertCircle className="h-6 w-6 text-red-600" /></div>
          <div>
            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Emergencies</h3>
            <p className="text-2xl font-bold text-red-600">{metrics.emergencies}</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="bg-white p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 transition-all hover:shadow-[0_8px_16px_rgba(0,0,0,0.06)] flex items-center">
          <div className="p-3 bg-slate-50 rounded-xl mr-4 border border-slate-100"><DollarSign className="h-6 w-6 text-slate-700" /></div>
          <div>
            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Income</h3>
            <p className="text-2xl font-bold text-slate-800">${metrics.totalIncome.toFixed(2)}</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="bg-white p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 transition-all hover:shadow-[0_8px_16px_rgba(0,0,0,0.06)] flex items-center">
          <div className="p-3 bg-slate-50 rounded-xl mr-4 border border-slate-100"><DollarSign className="h-6 w-6 text-slate-700" /></div>
          <div>
            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Expenses</h3>
            <p className="text-2xl font-bold text-slate-800">${metrics.totalExpenses.toFixed(2)}</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="bg-white p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 transition-all hover:shadow-[0_8px_16px_rgba(0,0,0,0.06)] flex items-center">
          <div className="p-3 bg-slate-50 rounded-xl mr-4 border border-slate-100"><DollarSign className="h-6 w-6 text-slate-700" /></div>
          <div>
            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Net Profit</h3>
            <p className={`text-2xl font-bold ${metrics.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${metrics.profit.toFixed(2)}
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Charts Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10"
      >
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100">
          <h3 className="text-lg font-medium text-slate-800 mb-6">Financial Overview (30 Days)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '14px', fontWeight: 500 }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Area type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="Expenses" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpenses)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-rows-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100">
            <h3 className="text-lg font-medium text-slate-800 mb-4">Appointment Statuses</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={appointmentStatsData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} width={80} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100">
            <h3 className="text-lg font-medium text-slate-800 mb-4">User Distribution</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userStatsData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dx={-10} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-2xl border border-slate-100 overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-slate-100 bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <h3 className="text-lg font-medium text-slate-800">All Appointments</h3>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            <input 
              type="text" 
              placeholder="Search patient or doctor..." 
              className="rounded-xl border-slate-200 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-4 py-2 bg-slate-50"
              value={filterSearch}
              onChange={e => { setFilterSearch(e.target.value); setCurrentPage(1); }}
            />
            <input 
              type="date" 
              className="rounded-xl border-slate-200 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-4 py-2 bg-slate-50"
              value={filterDate}
              onChange={e => { setFilterDate(e.target.value); setCurrentPage(1); }}
            />
            <select
              className="rounded-xl border-slate-200 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-4 py-2 bg-slate-50"
              value={filterStatus}
              onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            >
              <option value="">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button 
              onClick={() => { setFilterDate(''); setFilterSearch(''); setFilterStatus(''); setCurrentPage(1); }}
              className="text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors px-2"
            >
              Clear Filters
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-50">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date/Time</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <motion.tbody 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white divide-y divide-slate-50"
            >
              {paginatedAppointments.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-light">No appointments found</td></tr>
              ) : (
                paginatedAppointments.map((apt) => (
                  <motion.tr variants={itemVariants} key={apt.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-800">
                      {format(new Date(apt.appointment_date), 'MMM d, yyyy')} <span className="text-slate-400">at</span> {apt.appointment_time}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-800">{apt.patient_name}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-500">Dr. {apt.doctor_name}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm">
                      <Badge status={apt.status} />
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                      {apt.status === 'scheduled' && (
                        <button onClick={() => handleCancel(apt.id)} className="text-red-500 hover:text-red-700 transition-colors">
                          Cancel
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </motion.tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="text-sm text-slate-500">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredAppointments.length)}</span> of <span className="font-medium">{filteredAppointments.length}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 5) {
                    if (currentPage > 3) {
                      pageNum = currentPage - 2 + i;
                      if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                    }
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? 'bg-slate-800 text-white'
                          : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
