import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { format } from 'date-fns';
import { Badge } from '../../components/common/Badge';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';

import { Link } from 'react-router-dom';
import { Calendar, Users, UserCircle } from 'lucide-react';

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
      <h1 className="text-3xl font-light text-slate-900 mb-8 tracking-tight">Doctor Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Today's Appointments</p>
          <p className="text-3xl font-light text-slate-900">{appointments.filter(a => a.appointment_date === format(new Date(), 'yyyy-MM-dd')).length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Total Appointments</p>
          <p className="text-3xl font-light text-slate-900">{appointments.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Pending Consultations</p>
          <p className="text-3xl font-light text-slate-900">{appointments.filter(a => a.status === 'scheduled').length}</p>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10"
      >
        <motion.div variants={itemVariants} whileHover={{ y: -4 }}>
          <Link to="/doctor/schedule" className="bg-white p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center hover:shadow-[0_8px_16px_rgba(0,0,0,0.06)] transition-all">
            <div className="p-3 bg-slate-50 rounded-xl mr-4 border border-slate-100"><Calendar className="h-6 w-6 text-slate-700" /></div>
            <div>
              <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Manage</h3>
              <p className="text-base font-semibold text-slate-800">My Schedule</p>
            </div>
          </Link>
        </motion.div>
        <motion.div variants={itemVariants} whileHover={{ y: -4 }}>
          <Link to="/doctor/patients" className="bg-white p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center hover:shadow-[0_8px_16px_rgba(0,0,0,0.06)] transition-all">
            <div className="p-3 bg-slate-50 rounded-xl mr-4 border border-slate-100"><Users className="h-6 w-6 text-slate-700" /></div>
            <div>
              <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">View</h3>
              <p className="text-base font-semibold text-slate-800">My Patients</p>
            </div>
          </Link>
        </motion.div>
        <motion.div variants={itemVariants} whileHover={{ y: -4 }}>
          <Link to="/doctor/profile" className="bg-white p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center hover:shadow-[0_8px_16px_rgba(0,0,0,0.06)] transition-all">
            <div className="p-3 bg-slate-50 rounded-xl mr-4 border border-slate-100"><UserCircle className="h-6 w-6 text-slate-700" /></div>
            <div>
              <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Update</h3>
              <p className="text-base font-semibold text-slate-800">Profile</p>
            </div>
          </Link>
        </motion.div>
      </motion.div>

      {emergencies.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 bg-white border border-red-100 rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
          <div className="px-6 py-5 border-b border-slate-100 flex items-center">
            <h3 className="text-lg font-medium text-slate-800 flex items-center">
              <span className="relative flex h-2 w-2 mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Active Emergencies ({emergencies.length})
            </h3>
          </div>
          <div className="divide-y divide-slate-50">
            {emergencies.map(e => (
              <div key={e.id} className="p-5 px-6 flex justify-between items-center hover:bg-slate-50/50 transition-colors">
                <div>
                  <p className="font-semibold text-slate-800">{e.patient_name || 'Unknown Patient'}</p>
                  <p className="text-sm text-slate-500 mt-1">{e.description}</p>
                  <p className="text-xs font-medium text-slate-400 mt-2 uppercase tracking-wider">Location: <span className="text-slate-600">{e.location}</span></p>
                </div>
                <span className="px-3 py-1 bg-red-50 text-red-600 border border-red-100 text-xs font-bold rounded-full uppercase tracking-wider">
                  {e.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-2xl border border-slate-100 overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-slate-100">
          <h3 className="text-lg font-medium text-slate-800">Today's Appointments</h3>
        </div>
        <motion.ul 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="divide-y divide-slate-50"
        >
          {appointments.length === 0 ? (
            <li className="px-6 py-12 text-center text-slate-400 font-light">No appointments scheduled.</li>
          ) : (
            appointments.map((apt) => (
              <motion.li variants={itemVariants} key={apt.id} className="px-6 py-5 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-base font-medium text-slate-800">{apt.patient_name}</p>
                    <p className="text-sm text-slate-500 mt-1">Reason: {apt.reason || 'N/A'}</p>
                    <div className="mt-3">
                      <Badge status={apt.status} />
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-800">{format(new Date(apt.appointment_date), 'MMM d, yyyy')} <span className="text-slate-400 font-normal">at</span> {apt.appointment_time}</p>
                      <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Token: <span className="font-bold text-slate-700">{apt.token_number}</span></p>
                    </div>
                    {apt.status === 'scheduled' && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedApt(apt)}
                        className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
                      >
                        Complete & Prescribe
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.li>
            ))
          )}
        </motion.ul>
      </motion.div>

      {/* Prescription Modal */}
      <AnimatePresence>
        {selectedApt && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-xl font-medium text-slate-800">Prescription for {selectedApt.patient_name}</h2>
                <button onClick={() => setSelectedApt(null)} className="text-slate-400 hover:text-slate-600 font-bold text-2xl transition-colors leading-none">&times;</button>
              </div>
              
              <form onSubmit={handlePrescribe} className="p-8">
                <div className="mb-8">
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Diagnosis</label>
                  <textarea
                    required
                    rows={3}
                    className="block w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-4 py-3 transition-colors resize-none"
                    value={diagnosis}
                    onChange={e => setDiagnosis(e.target.value)}
                    placeholder="Enter diagnosis details..."
                  />
                </div>

                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-slate-800 uppercase tracking-wider">Medicines</h3>
                    <button type="button" onClick={handleAddItem} className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors">+ Add Medicine</button>
                  </div>
                  
                  <div className="space-y-4">
                    <AnimatePresence>
                      {items.map((item, index) => (
                        <motion.div 
                          key={index} 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="grid grid-cols-1 md:grid-cols-5 gap-4 p-5 bg-slate-50 rounded-xl border border-slate-100"
                        >
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-slate-500 mb-1">Medicine Name</label>
                            <input type="text" required className="block w-full rounded-lg border-slate-200 bg-white shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-3 py-2 transition-colors" value={item.medicine_name} onChange={e => handleItemChange(index, 'medicine_name', e.target.value)} />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Dosage</label>
                            <input type="text" placeholder="e.g. 500mg" className="block w-full rounded-lg border-slate-200 bg-white shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-3 py-2 transition-colors" value={item.dosage} onChange={e => handleItemChange(index, 'dosage', e.target.value)} />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Frequency</label>
                            <input type="text" placeholder="e.g. 1-0-1" className="block w-full rounded-lg border-slate-200 bg-white shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-3 py-2 transition-colors" value={item.frequency} onChange={e => handleItemChange(index, 'frequency', e.target.value)} />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Duration</label>
                            <input type="text" placeholder="e.g. 5 days" className="block w-full rounded-lg border-slate-200 bg-white shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-3 py-2 transition-colors" value={item.duration} onChange={e => handleItemChange(index, 'duration', e.target.value)} />
                          </div>
                          <div className="md:col-span-5">
                            <input type="text" placeholder="Additional notes (e.g. after food)" className="block w-full rounded-lg border-slate-200 bg-white shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-3 py-2 transition-colors" value={item.notes} onChange={e => handleItemChange(index, 'notes', e.target.value)} />
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Upload Prescription Document (Optional)</label>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleFileChange}
                    className="block w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-4 py-3 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                  />
                  {fileData && <p className="text-xs text-slate-600 mt-2">File attached successfully.</p>}
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-slate-100">
                  <button type="button" onClick={() => setSelectedApt(null)} className="px-6 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
                  <button type="submit" className="px-6 py-2.5 text-sm font-medium text-white bg-slate-900 border border-transparent rounded-xl hover:bg-slate-800 transition-colors shadow-sm">Save & Complete</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
