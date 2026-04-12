import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import { UserPlus, Search, Filter, Mail, Phone, Stethoscope, Building2, DollarSign, X, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export const AdminDoctors = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    specialization: '',
    department_id: '',
    consultation_fee: ''
  });

  const fetchDoctors = () => {
    api.get('/admin/doctors').then(res => setDoctors(res.data));
  };

  useEffect(() => {
    fetchDoctors();
    api.get('/admin/departments').then(res => setDepartments(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/doctors', formData);
      toast.success('Doctor created successfully');
      setShowForm(false);
      setFormData({ name: '', email: '', password: '', phone: '', specialization: '', department_id: '', consultation_fee: '' });
      fetchDoctors();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create doctor');
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Link to="/admin" className="inline-flex items-center text-sm font-bold text-primary hover:text-primary-dark transition-colors mb-4 group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Manage Doctors</h1>
          <p className="text-slate-500 mt-1">Add, edit, and manage hospital medical staff.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-sm ${
            showForm 
            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
            : 'btn-primary'
          }`}
        >
          {showForm ? (
            <><X className="h-4 w-4" /> Cancel</>
          ) : (
            <><UserPlus className="h-4 w-4" /> Add New Doctor</>
          )}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-10"
          >
            <div className="card-healthcare p-8 md:p-10">
              <h2 className="text-xl font-heading font-bold text-slate-900 mb-8 flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <UserPlus className="h-5 w-5 text-primary" />
                </div>
                Create Professional Profile
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Full Name</label>
                  <div className="relative">
                    <input required type="text" className="block w-full rounded-2xl border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm border px-4 py-3 outline-none transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                  <div className="relative">
                    <input required type="email" className="block w-full rounded-2xl border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm border px-4 py-3 outline-none transition-all" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Password</label>
                  <div className="relative">
                    <input required type="password" minLength={6} className="block w-full rounded-2xl border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm border px-4 py-3 outline-none transition-all" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Phone Number</label>
                  <div className="relative">
                    <input type="text" className="block w-full rounded-2xl border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm border px-4 py-3 outline-none transition-all" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Specialization</label>
                  <div className="relative">
                    <input required type="text" className="block w-full rounded-2xl border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm border px-4 py-3 outline-none transition-all" value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} />
                    <Stethoscope className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Department</label>
                  <div className="relative">
                    <select className="block w-full rounded-2xl border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm border px-4 py-3 outline-none transition-all appearance-none" value={formData.department_id} onChange={e => setFormData({...formData, department_id: e.target.value})}>
                      <option value="">Select Department</option>
                      {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                    <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Consultation Fee ($)</label>
                  <div className="relative">
                    <input required type="number" step="0.01" className="block w-full rounded-2xl border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm border px-4 py-3 outline-none transition-all" value={formData.consultation_fee} onChange={e => setFormData({...formData, consultation_fee: e.target.value})} />
                    <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  </div>
                </div>
                <div className="md:col-span-2 lg:col-span-3 flex justify-end mt-4 pt-6 border-t border-slate-100">
                  <button type="submit" className="btn-primary flex items-center px-10 py-4">
                    <Save className="mr-2 h-5 w-5" />
                    Register Doctor
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="card-healthcare overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-xl font-heading font-bold text-slate-900">Medical Staff Directory</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search doctors..." 
                className="rounded-2xl border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm border pl-10 pr-4 py-2 bg-slate-50/50 outline-none transition-all w-full sm:w-64"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-4 text-left text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">Doctor Details</th>
                <th className="px-8 py-4 text-left text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">Contact Info</th>
                <th className="px-8 py-4 text-left text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">Specialization</th>
                <th className="px-8 py-4 text-left text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">Department</th>
                <th className="px-8 py-4 text-left text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">Fee</th>
                <th className="px-8 py-4 text-right text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-50">
              {doctors.length === 0 ? (
                <tr><td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-bold">No doctors registered yet.</td></tr>
              ) : (
                doctors.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary-light flex items-center justify-center text-primary font-bold text-lg border-2 border-white shadow-sm">
                          {doc.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">Dr. {doc.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">ID: #DOC-{doc.id.toString().padStart(3, '0')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                          <Mail className="h-3 w-3 text-slate-400" />
                          {doc.email}
                        </div>
                        <div className="flex items-center gap-2 text-[0.65rem] text-slate-400">
                          <Phone className="h-3 w-3" />
                          {doc.phone || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className="px-3 py-1 bg-primary/5 text-primary text-[0.65rem] font-black uppercase tracking-widest rounded-lg">
                        {doc.specialization}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <Building2 className="h-4 w-4 text-slate-300" />
                        {doc.department || 'General'}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className="text-sm font-black text-success">
                        ${doc.consultation_fee}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-right">
                      <button className="text-xs font-bold text-primary hover:text-primary-dark transition-colors">
                        View Schedule
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
