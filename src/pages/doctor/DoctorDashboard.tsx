import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { format } from 'date-fns';
import { Badge } from '../../components/common/Badge';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';

import { Link } from 'react-router-dom';
import { Calendar, Users, UserCircle, Activity, Clock, AlertCircle, Plus, X, Pill, FileText, Upload, CheckCircle2, Stethoscope } from 'lucide-react';

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

export const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [emergencies, setEmergencies] = useState<any[]>([]);
  const [selectedApt, setSelectedApt] = useState<any>(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [items, setItems] = useState([{ medicine_name: '', dosage: '', frequency: '', duration: '', notes: '' }]);
  const [fileData, setFileData] = useState<string | null>(null);

  const fetchAppointments = () => {
    api.get('/appointments/my').then(res => setAppointments(res.data));
  };

  const fetchEmergencies = () => {
    api.get('/admin/emergencies').then(res => {
      // Show only active emergencies
      setEmergencies(res.data.filter((e: any) => e.status !== 'resolved'));
    }).catch(() => {});
  };

  useEffect(() => {
    fetchAppointments();
    fetchEmergencies();
  }, []);

  const handleAddItem = () => {
    setItems([...items, { medicine_name: '', dosage: '', frequency: '', duration: '', notes: '' }]);
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...items] as any;
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrescribe = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/prescriptions', {
        appointment_id: selectedApt.id,
        patient_id: selectedApt.patient_id,
        diagnosis,
        items: items.filter(i => i.medicine_name.trim() !== ''),
        file_data: fileData
      });
      toast.success('Prescription saved and appointment completed!');
      setSelectedApt(null);
      setDiagnosis('');
      setItems([{ medicine_name: '', dosage: '', frequency: '', duration: '', notes: '' }]);
      setFileData(null);
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to save prescription');
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
            <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Doctor Dashboard</h1>
            <p className="text-slate-500 mt-1">Hello, Doctor. Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-slate-700">{format(new Date(), 'MMMM d, yyyy')}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="card-healthcare p-6 border-l-4 border-l-primary">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-primary/10 p-2 rounded-xl">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today</span>
            </div>
            <p className="text-sm font-semibold text-slate-500 mb-1">Today's Appointments</p>
            <p className="text-3xl font-bold text-slate-900">{appointments.filter(a => a.appointment_date === format(new Date(), 'yyyy-MM-dd')).length}</p>
          </div>
          <div className="card-healthcare p-6 border-l-4 border-l-secondary">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-secondary/10 p-2 rounded-xl">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</span>
            </div>
            <p className="text-sm font-semibold text-slate-500 mb-1">Total Appointments</p>
            <p className="text-3xl font-bold text-slate-900">{appointments.length}</p>
          </div>
          <div className="card-healthcare p-6 border-l-4 border-l-success">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-success/10 p-2 rounded-xl">
                <Activity className="h-6 w-6 text-success" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending</span>
            </div>
            <p className="text-sm font-semibold text-slate-500 mb-1">Pending Consultations</p>
            <p className="text-3xl font-bold text-slate-900">{appointments.filter(a => a.status === 'scheduled').length}</p>
          </div>
        </div>

        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12"
        >
          {[
            { to: "/doctor/schedule", icon: Calendar, label: "Manage", title: "My Schedule", color: "text-primary", bg: "bg-primary/5" },
            { to: "/doctor/patients", icon: Users, label: "View", title: "My Patients", color: "text-secondary", bg: "bg-secondary/5" },
            { to: "/doctor/profile", icon: UserCircle, label: "Update", title: "Profile", color: "text-slate-700", bg: "bg-slate-100" }
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

        {emergencies.length > 0 && (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 card-healthcare overflow-hidden border-t-4 border-t-red-500"
            >
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-red-50/30">
                <h3 className="text-lg font-heading font-bold text-slate-900 flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  Active Emergencies
                </h3>
                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              {emergencies.length} Active
            </span>
              </div>
              <div className="divide-y divide-slate-50">
                {emergencies.map(e => (
                    <div key={e.id} className="p-6 px-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-red-50/10 transition-colors">
                      <div>
                        <p className="font-bold text-slate-900 text-lg">{e.patient_name || 'Unknown Patient'}</p>
                        <p className="text-slate-600 mt-1">{e.description}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                            <Activity className="h-3 w-3 mr-1" />
                            Location: <span className="text-slate-900 ml-1">{e.location}</span>
                          </p>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Reported: <span className="text-slate-900 ml-1">{format(new Date(e.created_at || new Date()), 'HH:mm')}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge status="emergency" />
                        <button className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors">Mark as Resolved</button>
                      </div>
                    </div>
                ))}
              </div>
            </motion.div>
        )}

        <div className="card-healthcare overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xl font-heading font-bold text-slate-900">Today's Appointments</h3>
            <Link to="/doctor/schedule" className="text-sm font-bold text-primary hover:text-primary-dark">View Full Schedule</Link>
          </div>
          <motion.ul
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-slate-50"
          >
            {appointments.length === 0 ? (
                <li className="px-8 py-20 text-center">
                  <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="h-10 w-10 text-slate-200" />
                  </div>
                  <p className="text-slate-400 font-bold text-lg">No appointments scheduled for today.</p>
                  <p className="text-slate-400 mt-1">Take this time to catch up on paperwork!</p>
                </li>
            ) : (
                appointments.map((apt) => (
                    <motion.li variants={itemVariants} key={apt.id} className="px-8 py-6 hover:bg-slate-50/50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center text-primary font-bold text-2xl">
                            {apt.patient_name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-lg font-bold text-slate-900">{apt.patient_name}</p>
                            <p className="text-sm text-slate-500 mt-1 flex items-center">
                              <FileText className="h-3 w-3 mr-1 text-slate-400" />
                              Reason: {apt.reason || 'General Consultation'}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:items-end gap-3">
                          <div className="text-right">
                            <div className="flex items-center text-slate-700 font-bold mb-1">
                              <Clock className="h-4 w-4 mr-2 text-slate-400" />
                              {apt.appointment_time}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Token: <span className="text-slate-900">{apt.token_number}</span></span>
                              <Badge status={apt.status} />
                            </div>
                          </div>
                          {apt.status === 'scheduled' && (
                              <button
                                  onClick={() => setSelectedApt(apt)}
                                  className="btn-primary py-2 px-6 text-sm"
                              >
                                Complete & Prescribe
                              </button>
                          )}
                        </div>
                      </div>
                    </motion.li>
                ))
            )}
          </motion.ul>
        </div>

        {/* Prescription Modal */}
        <AnimatePresence>
          {selectedApt && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
              >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                >
                  <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-heading font-bold text-slate-900">Prescription</h2>
                        <p className="text-slate-500 text-sm">Patient: <span className="font-bold text-slate-700">{selectedApt.patient_name}</span></p>
                      </div>
                    </div>
                    <button onClick={() => setSelectedApt(null)} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
                      <X className="h-6 w-6 text-slate-400" />
                    </button>
                  </div>

                  <form onSubmit={handlePrescribe} className="p-10 overflow-y-auto custom-scrollbar">
                    <div className="mb-10">
                      <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center">
                        <Stethoscope className="h-4 w-4 mr-2 text-primary" />
                        Diagnosis Details
                      </label>
                      <textarea
                          required
                          rows={4}
                          className="block w-full rounded-2xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm border px-5 py-4 outline-none transition-all resize-none"
                          value={diagnosis}
                          onChange={e => setDiagnosis(e.target.value)}
                          placeholder="Enter detailed diagnosis findings..."
                      />
                    </div>

                    <div className="mb-10">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest flex items-center">
                          <Pill className="h-4 w-4 mr-2 text-primary" />
                          Prescribed Medicines
                        </h3>
                        <button type="button" onClick={handleAddItem} className="text-sm font-bold text-primary hover:text-primary-dark flex items-center gap-1 group">
                          <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform" />
                          Add Medicine
                        </button>
                      </div>

                      <div className="space-y-6">
                        <AnimatePresence>
                          {items.map((item, index) => (
                              <motion.div
                                  key={index}
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="grid grid-cols-1 md:grid-cols-6 gap-4 p-6 bg-slate-50/50 rounded-2xl border border-slate-100 relative group"
                              >
                                <div className="md:col-span-2">
                                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Medicine Name</label>
                                  <input type="text" required className="block w-full rounded-xl border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm border px-4 py-3 outline-none transition-all" value={item.medicine_name} onChange={e => handleItemChange(index, 'medicine_name', e.target.value)} placeholder="e.g. Paracetamol" />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Dosage</label>
                                  <input type="text" placeholder="500mg" className="block w-full rounded-xl border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm border px-4 py-3 outline-none transition-all" value={item.dosage} onChange={e => handleItemChange(index, 'dosage', e.target.value)} />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Frequency</label>
                                  <input type="text" placeholder="1-0-1" className="block w-full rounded-xl border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm border px-4 py-3 outline-none transition-all" value={item.frequency} onChange={e => handleItemChange(index, 'frequency', e.target.value)} />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Duration</label>
                                  <input type="text" placeholder="5 days" className="block w-full rounded-xl border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm border px-4 py-3 outline-none transition-all" value={item.duration} onChange={e => handleItemChange(index, 'duration', e.target.value)} />
                                </div>
                                <div className="md:col-span-6">
                                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Additional Notes</label>
                                  <input type="text" placeholder="Instructions (e.g. after food)" className="block w-full rounded-xl border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm border px-4 py-3 outline-none transition-all" value={item.notes} onChange={e => handleItemChange(index, 'notes', e.target.value)} />
                                </div>
                                {items.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => setItems(items.filter((_, i) => i !== index))}
                                        className="absolute -top-2 -right-2 bg-white text-red-500 p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity border border-red-100"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                )}
                              </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="mb-10">
                      <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center">
                        <Upload className="h-4 w-4 mr-2 text-primary" />
                        Upload Supporting Documents (Optional)
                      </label>
                      <div className="relative group">
                        <input
                            type="file"
                            id="file-upload"
                            accept=".pdf,image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <label
                            htmlFor="file-upload"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 hover:bg-primary-light/10 hover:border-primary/30 transition-all cursor-pointer"
                        >
                          {fileData ? (
                              <div className="flex items-center text-success font-bold">
                                <CheckCircle2 className="h-6 w-6 mr-2" />
                                Document Attached Successfully
                              </div>
                          ) : (
                              <>
                                <Upload className="h-8 w-8 text-slate-300 mb-2 group-hover:text-primary transition-colors" />
                                <span className="text-sm font-bold text-slate-500 group-hover:text-primary transition-colors">Click to upload PDF or Image</span>
                              </>
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-8 border-t border-slate-100">
                      <button type="button" onClick={() => setSelectedApt(null)} className="btn-secondary px-8 py-3">Cancel</button>
                      <button type="submit" className="btn-primary px-10 py-3">Finalize & Save Prescription</button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
  );
};
