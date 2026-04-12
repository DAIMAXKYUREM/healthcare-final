import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-light text-slate-900 tracking-tight">Manage Doctors</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 font-medium text-sm transition-colors shadow-sm"
        >
          {showForm ? 'Cancel' : 'Add New Doctor'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-2xl p-8 mb-10 border border-slate-100">
          <h2 className="text-xl font-medium text-slate-800 mb-6">Create New Doctor</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
              <input required type="text" className="block w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-4 py-3 transition-colors" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Email</label>
              <input required type="email" className="block w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-4 py-3 transition-colors" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Password</label>
              <input required type="password" minLength={6} className="block w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-4 py-3 transition-colors" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Phone</label>
              <input type="text" className="block w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-4 py-3 transition-colors" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Specialization</label>
              <input required type="text" className="block w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-4 py-3 transition-colors" value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Department</label>
              <select className="block w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-4 py-3 transition-colors" value={formData.department_id} onChange={e => setFormData({...formData, department_id: e.target.value})}>
                <option value="">Select Department</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Consultation Fee ($)</label>
              <input required type="number" step="0.01" className="block w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-4 py-3 transition-colors" value={formData.consultation_fee} onChange={e => setFormData({...formData, consultation_fee: e.target.value})} />
            </div>
            <div className="md:col-span-2 flex justify-end mt-4">
              <button type="submit" className="bg-slate-900 text-white px-8 py-3 rounded-xl hover:bg-slate-800 font-medium text-sm transition-colors shadow-sm">
                Save Doctor
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-2xl overflow-hidden border border-slate-100">
        <table className="min-w-full divide-y divide-slate-50">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Specialization</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Department</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Fee</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-50">
            {doctors.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-800">{doc.name}</td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-500">
                  <div className="text-slate-800">{doc.email}</div>
                  <div className="text-xs text-slate-400 mt-1">{doc.phone}</div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-500">{doc.specialization}</td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-500">{doc.department || '-'}</td>
                <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-600">${doc.consultation_fee}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
