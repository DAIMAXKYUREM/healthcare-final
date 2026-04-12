import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { format } from 'date-fns';
import { Badge } from '../../components/common/Badge';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';

import { Link } from 'react-router-dom';
import { Calendar, FileText, CreditCard, UserCircle } from 'lucide-react';

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

export const PatientDashboard = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [emergencyDesc, setEmergencyDesc] = useState('');
  const [emergencyLoc, setEmergencyLoc] = useState('');

  const fetchAppointments = () => {
    api.get('/appointments/my').then(res => setAppointments(res.data));
  };

  const fetchPrescriptions = () => {
    api.get('/prescriptions/my').then(res => setPrescriptions(res.data.slice(0, 3))); // Get top 3
  };

  useEffect(() => {
    fetchAppointments();
    fetchPrescriptions();
  }, []);

  const handleCancel = async (id: number) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await api.put(`/appointments/${id}/cancel`);
      toast.success('Appointment cancelled');
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to cancel appointment');
    }
  };

  const reportEmergency = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/patients/emergencies', { description: emergencyDesc, location: emergencyLoc });
      toast.success('Emergency reported! Help is on the way.');
      setEmergencyDesc('');
      setEmergencyLoc('');
    } catch (error) {
      toast.error('Failed to report emergency');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 md:p-10 max-w-7xl mx-auto"
    >
      <h1 className="text-3xl font-light text-slate-900 mb-8 tracking-tight">Patient Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Upcoming Appointments</p>
          <p className="text-3xl font-light text-slate-900">{appointments.filter(a => a.status === 'scheduled').length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Total Prescriptions</p>
          <p className="text-3xl font-light text-slate-900">{prescriptions.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Completed Visits</p>
          <p className="text-3xl font-light text-slate-900">{appointments.filter(a => a.status === 'completed').length}</p>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
      >
        <motion.div variants={itemVariants} whileHover={{ y: -4 }}>
          <Link to="/patient/book" className="bg-white p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center hover:shadow-[0_8px_16px_rgba(0,0,0,0.06)] transition-all">
            <div className="p-3 bg-slate-50 rounded-xl mr-4 border border-slate-100"><Calendar className="h-6 w-6 text-slate-700" /></div>
            <div>
              <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Book</h3>
              <p className="text-base font-semibold text-slate-800">Appointment</p>
            </div>
          </Link>
        </motion.div>
        <motion.div variants={itemVariants} whileHover={{ y: -4 }}>
          <Link to="/patient/prescriptions" className="bg-white p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center hover:shadow-[0_8px_16px_rgba(0,0,0,0.06)] transition-all">
            <div className="p-3 bg-slate-50 rounded-xl mr-4 border border-slate-100"><FileText className="h-6 w-6 text-slate-700" /></div>
            <div>
              <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">View</h3>
              <p className="text-base font-semibold text-slate-800">Medical History</p>
            </div>
          </Link>
        </motion.div>
        <motion.div variants={itemVariants} whileHover={{ y: -4 }}>
          <Link to="/patient/billing" className="bg-white p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center hover:shadow-[0_8px_16px_rgba(0,0,0,0.06)] transition-all">
            <div className="p-3 bg-slate-50 rounded-xl mr-4 border border-slate-100"><CreditCard className="h-6 w-6 text-slate-700" /></div>
            <div>
              <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Manage</h3>
              <p className="text-base font-semibold text-slate-800">Billing</p>
            </div>
          </Link>
        </motion.div>
        <motion.div variants={itemVariants} whileHover={{ y: -4 }}>
          <Link to="/patient/profile" className="bg-white p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center hover:shadow-[0_8px_16px_rgba(0,0,0,0.06)] transition-all">
            <div className="p-3 bg-slate-50 rounded-xl mr-4 border border-slate-100"><UserCircle className="h-6 w-6 text-slate-700" /></div>
            <div>
              <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Update</h3>
              <p className="text-base font-semibold text-slate-800">Profile</p>
            </div>
          </Link>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-2xl border border-slate-100 overflow-hidden h-full"
          >
            <div className="px-6 py-5 border-b border-slate-100">
              <h3 className="text-lg font-medium text-slate-800">My Appointments</h3>
            </div>
            <motion.ul 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-slate-50"
            >
              {appointments.length === 0 ? (
                <li className="px-6 py-12 text-center text-slate-400 font-light">No appointments found.</li>
              ) : (
                appointments.map((apt) => (
                  <motion.li variants={itemVariants} key={apt.id} className="px-6 py-5 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <p className="text-base font-medium text-slate-800">Dr. {apt.doctor_name}</p>
                        <p className="text-sm text-slate-500">{apt.specialization}</p>
                        {apt.status === 'scheduled' && (
                          <button onClick={() => handleCancel(apt.id)} className="mt-3 text-xs font-medium text-red-500 hover:text-red-700 text-left transition-colors">
                            Cancel Appointment
                          </button>
                        )}
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-sm font-medium text-slate-800">{format(new Date(apt.appointment_date), 'MMM d, yyyy')} <span className="text-slate-400 font-normal">at</span> {apt.appointment_time}</p>
                        <p className="text-xs text-slate-400 mb-3 mt-1 uppercase tracking-wider">Token: <span className="font-bold text-slate-700">{apt.token_number}</span></p>
                        <Badge status={apt.status} />
                      </div>
                    </div>
                  </motion.li>
                ))
              )}
            </motion.ul>
          </motion.div>
        </div>

        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-2xl border border-slate-100 overflow-hidden mb-8 relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
            <div className="px-6 py-5 border-b border-slate-100">
              <h3 className="text-lg font-medium text-slate-800 flex items-center">
                <span className="relative flex h-2 w-2 mr-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Report Emergency
              </h3>
            </div>
            <div className="p-6">
              <form onSubmit={reportEmergency} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Current Location</label>
                  <input type="text" required value={emergencyLoc} onChange={e => setEmergencyLoc(e.target.value)} className="block w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm border px-4 py-3 transition-colors" placeholder="Where are you?" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Description</label>
                  <textarea required value={emergencyDesc} onChange={e => setEmergencyDesc(e.target.value)} rows={3} className="block w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm border px-4 py-3 transition-colors resize-none" placeholder="Describe the emergency..."></textarea>
                </div>
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all">
                  Send SOS
                </button>
              </form>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-2xl border border-slate-100 overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-medium text-slate-800">Recent Prescriptions</h3>
              <Link to="/patient/prescriptions" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">View All</Link>
            </div>
            <ul className="divide-y divide-slate-50">
              {prescriptions.length === 0 ? (
                <li className="px-6 py-8 text-center text-slate-400 font-light text-sm">No recent prescriptions.</li>
              ) : (
                prescriptions.map((p) => (
                  <li key={p.id} className="px-6 py-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-slate-800">Dr. {p.doctor_name}</p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{p.diagnosis || 'No diagnosis recorded'}</p>
                      </div>
                      <p className="text-xs font-medium text-slate-400">{format(new Date(p.visit_date), 'MMM d')}</p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
