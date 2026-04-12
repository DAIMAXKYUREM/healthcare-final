import React, { useEffect, useState, useMemo } from 'react';
import api from '../../api/axiosInstance';
import { format, subDays } from 'date-fns';
import { Badge } from '../../components/common/Badge';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';
import { Users, Activity, Calendar, DollarSign, AlertCircle, Briefcase, ChevronLeft, ChevronRight, Search, Filter, Download, TrendingUp, TrendingDown } from 'lucide-react';
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
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Admin Overview</h1>
          <p className="text-slate-500 mt-1">Hospital performance and management dashboard.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm flex items-center gap-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
            <Download className="h-4 w-4 text-primary" />
            Export Report
          </button>
        </div>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
      >
        {[
          { icon: Users, label: "Active Patients", value: metrics.activePatients, color: "primary" },
          { icon: Activity, label: "Active Doctors", value: metrics.activeDoctors, color: "secondary" },
          { icon: Briefcase, label: "Available Staff", value: metrics.availableStaff, color: "slate" },
          { icon: Calendar, label: "Upcoming Appts", value: metrics.upcomingAppointments, color: "primary" },
          { icon: AlertCircle, label: "Active Emergencies", value: metrics.emergencies, color: "red", isEmergency: true },
          { icon: DollarSign, label: "Total Income", value: `$${metrics.totalIncome.toFixed(2)}`, color: "success" },
          { icon: DollarSign, label: "Total Expenses", value: `$${metrics.totalExpenses.toFixed(2)}`, color: "red" },
          { icon: DollarSign, label: "Net Profit", value: `$${metrics.profit.toFixed(2)}`, color: metrics.profit >= 0 ? "success" : "red", trend: metrics.profit >= 0 ? "up" : "down" }
        ].map((item, i) => (
          <motion.div key={i} variants={itemVariants} className={`card-healthcare p-6 border-l-4 ${item.isEmergency ? 'border-l-red-500 bg-red-50/10' : `border-l-${item.color === 'red' ? 'red-500' : (item.color === 'primary' ? 'primary' : (item.color === 'secondary' ? 'secondary' : (item.color === 'success' ? 'success' : 'slate-400')))}`}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-xl ${item.isEmergency ? 'bg-red-100' : (item.color === 'primary' ? 'bg-primary/10' : (item.color === 'secondary' ? 'bg-secondary/10' : (item.color === 'success' ? 'bg-success/10' : 'bg-slate-100')))}`}>
                <item.icon className={`h-5 w-5 ${item.isEmergency ? 'text-red-600' : (item.color === 'primary' ? 'text-primary' : (item.color === 'secondary' ? 'text-secondary' : (item.color === 'success' ? 'text-success' : 'text-slate-600')))}`} />
              </div>
              {item.trend && (
                <div className={`flex items-center text-[0.65rem] font-black uppercase tracking-widest ${item.trend === 'up' ? 'text-success' : 'text-red-500'}`}>
                  {item.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {item.trend === 'up' ? '+12%' : '-5%'}
                </div>
              )}
            </div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</h3>
            <p className={`text-2xl font-bold ${item.isEmergency ? 'text-red-600' : 'text-slate-900'}`}>{item.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
      >
        <div className="lg:col-span-2 card-healthcare p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-heading font-bold text-slate-900">Financial Performance</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success"></div>
                <span className="text-xs font-bold text-slate-500">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <span className="text-xs font-bold text-slate-500">Expenses</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', padding: '12px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 700 }}
                />
                <Area type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="Expenses" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpenses)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-8">
          <div className="card-healthcare p-8">
            <h3 className="text-lg font-heading font-bold text-slate-900 mb-6">Appointment Status</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={appointmentStatsData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} width={80} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 8, 8, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="card-healthcare p-8">
            <h3 className="text-lg font-heading font-bold text-slate-900 mb-6">User Distribution</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userStatsData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} barSize={30} />
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
        className="card-healthcare overflow-hidden"
      >
        <div className="px-8 py-6 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <h3 className="text-xl font-heading font-bold text-slate-900">Appointment Management</h3>
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="rounded-2xl border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm border pl-10 pr-4 py-2.5 bg-slate-50/50 outline-none transition-all w-full sm:w-64"
                value={filterSearch}
                onChange={e => { setFilterSearch(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="date" 
                className="rounded-2xl border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm border pl-10 pr-4 py-2.5 bg-slate-50/50 outline-none transition-all"
                value={filterDate}
                onChange={e => { setFilterDate(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <select
                className="rounded-2xl border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm border pl-10 pr-8 py-2.5 bg-slate-50/50 outline-none transition-all appearance-none"
                value={filterStatus}
                onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              >
                <option value="">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <button 
              onClick={() => { setFilterDate(''); setFilterSearch(''); setFilterStatus(''); setCurrentPage(1); }}
              className="text-xs font-bold text-slate-400 hover:text-primary uppercase tracking-widest px-2 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-4 text-left text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">Date & Time</th>
                <th className="px-8 py-4 text-left text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">Patient</th>
                <th className="px-8 py-4 text-left text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">Doctor</th>
                <th className="px-8 py-4 text-left text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-right text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <motion.tbody 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white divide-y divide-slate-50"
            >
              {paginatedAppointments.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold">No appointments found matching your filters.</td></tr>
              ) : (
                paginatedAppointments.map((apt) => (
                  <motion.tr variants={itemVariants} key={apt.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <p className="text-sm font-bold text-slate-900">{format(new Date(apt.appointment_date), 'MMM d, yyyy')}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{apt.appointment_time}</p>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center text-primary font-bold text-xs">
                          {apt.patient_name.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-slate-900">{apt.patient_name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <p className="text-sm font-medium text-slate-700">Dr. {apt.doctor_name}</p>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <Badge status={apt.status} />
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-right">
                      {apt.status === 'scheduled' && (
                        <button onClick={() => handleCancel(apt.id)} className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors">
                          Cancel Appointment
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
          <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Showing <span className="text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-slate-900">{Math.min(currentPage * itemsPerPage, filteredAppointments.length)}</span> of <span className="text-slate-900">{filteredAppointments.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-1">
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
                      className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                        currentPage === pageNum
                          ? 'bg-primary text-white shadow-lg shadow-primary/20'
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
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
