import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { format } from 'date-fns';
import { Badge } from '../../components/common/Badge';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';

import { Link } from 'react-router-dom';
import { Calendar, FileText, CreditCard, UserCircle, Activity, Plus, AlertCircle, ArrowRight, Clock } from 'lucide-react';

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
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Patient Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back! Here's an overview of your health status.</p>
        </div>
        <Link to="/patient/book" className="btn-primary flex items-center justify-center">
          <Plus className="mr-2 h-5 w-5" />
          Book Appointment
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="card-healthcare p-6 border-l-4 border-l-primary">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-primary/10 p-2 rounded-xl">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming</span>
          </div>
          <p className="text-sm font-semibold text-slate-500 mb-1">Scheduled Appointments</p>
          <p className="text-3xl font-bold text-slate-900">{appointments.filter(a => a.status === 'scheduled').length}</p>
        </div>
        <div className="card-healthcare p-6 border-l-4 border-l-secondary">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-secondary/10 p-2 rounded-xl">
              <FileText className="h-6 w-6 text-secondary" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Medical</span>
          </div>
          <p className="text-sm font-semibold text-slate-500 mb-1">Active Prescriptions</p>
          <p className="text-3xl font-bold text-slate-900">{prescriptions.length}</p>
        </div>
        <div className="card-healthcare p-6 border-l-4 border-l-success">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-success/10 p-2 rounded-xl">
              <Activity className="h-6 w-6 text-success" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">History</span>
          </div>
          <p className="text-sm font-semibold text-slate-500 mb-1">Completed Visits</p>
          <p className="text-3xl font-bold text-slate-900">{appointments.filter(a => a.status === 'completed').length}</p>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {[
          { to: "/patient/book", icon: Calendar, label: "Book", title: "Appointment", color: "text-primary", bg: "bg-primary/5" },
          { to: "/patient/prescriptions", icon: FileText, label: "View", title: "Medical History", color: "text-secondary", bg: "bg-secondary/5" },
          { to: "/patient/billing", icon: CreditCard, label: "Manage", title: "Billing", color: "text-slate-700", bg: "bg-slate-100" },
          { to: "/patient/profile", icon: UserCircle, label: "Update", title: "Profile", color: "text-slate-700", bg: "bg-slate-100" }
        ].map((item, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Link to={item.to} className="card-healthcare p-6 flex items-center group hover:border-primary/30 transition-all">
              <div className={`p-3 ${item.bg} rounded-2xl mr-4 group-hover:scale-110 transition-transform`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.label}</h3>
                <p className="text-base font-bold text-slate-800">{item.title}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="card-healthcare overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-heading font-bold text-slate-900">My Appointments</h3>
              <Link to="/patient/book" className="text-sm font-bold text-primary hover:text-primary-dark flex items-center">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <ul className="divide-y divide-slate-50">
              {appointments.length === 0 ? (
                <li className="px-8 py-16 text-center">
                  <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-slate-300" />
                  </div>
                  <p className="text-slate-400 font-medium">No appointments found.</p>
                  <Link to="/patient/book" className="text-primary font-bold text-sm mt-2 inline-block">Book your first appointment</Link>
                </li>
              ) : (
                appointments.map((apt) => (
                  <li key={apt.id} className="px-8 py-6 hover:bg-slate-50/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary-light flex items-center justify-center text-primary font-bold text-xl">
                          {apt.doctor_name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-base font-bold text-slate-900">Dr. {apt.doctor_name}</p>
                          <p className="text-sm text-slate-500">{apt.specialization}</p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end">
                        <div className="flex items-center text-slate-700 font-semibold mb-1">
                          <Clock className="h-4 w-4 mr-2 text-slate-400" />
                          {format(new Date(apt.appointment_date), 'MMM d, yyyy')} at {apt.appointment_time}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Token: <span className="text-slate-900">{apt.token_number}</span></span>
                          <Badge status={apt.status} />
                        </div>
                        {apt.status === 'scheduled' && (
                          <button onClick={() => handleCancel(apt.id)} className="mt-2 text-xs font-bold text-red-500 hover:text-red-700 transition-colors">
                            Cancel Appointment
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        <div className="space-y-8">
          <div className="card-healthcare overflow-hidden border-t-4 border-t-red-500">
            <div className="px-8 py-6 border-b border-slate-100">
              <h3 className="text-lg font-heading font-bold text-slate-900 flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                Report Emergency
              </h3>
            </div>
            <div className="p-8">
              <form onSubmit={reportEmergency} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Current Location</label>
                  <input 
                    type="text" 
                    required 
                    value={emergencyLoc} 
                    onChange={e => setEmergencyLoc(e.target.value)} 
                    className="block w-full rounded-2xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 sm:text-sm border px-4 py-3 outline-none transition-all" 
                    placeholder="Where are you?" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                  <textarea 
                    required 
                    value={emergencyDesc} 
                    onChange={e => setEmergencyDesc(e.target.value)} 
                    rows={3} 
                    className="block w-full rounded-2xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 sm:text-sm border px-4 py-3 outline-none transition-all resize-none" 
                    placeholder="Describe the emergency..."
                  ></textarea>
                </div>
                <button type="submit" className="w-full btn-primary bg-red-500 hover:bg-red-600 shadow-red-500/20 py-3">
                  Send SOS Signal
                </button>
              </form>
            </div>
          </div>

          <div className="card-healthcare overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-heading font-bold text-slate-900">Recent Prescriptions</h3>
              <Link to="/patient/prescriptions" className="text-sm font-bold text-primary hover:text-primary-dark">View All</Link>
            </div>
            <ul className="divide-y divide-slate-50">
              {prescriptions.length === 0 ? (
                <li className="px-8 py-10 text-center text-slate-400 text-sm italic">No recent prescriptions.</li>
              ) : (
                prescriptions.map((p) => (
                  <li key={p.id} className="px-8 py-5 hover:bg-slate-50/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-slate-900">Dr. {p.doctor_name}</p>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{p.diagnosis || 'General Checkup'}</p>
                      </div>
                      <p className="text-xs font-bold text-slate-400">{format(new Date(p.visit_date), 'MMM d')}</p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
