import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';

export const DoctorProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    department_name: '',
    specialization: '',
    qualification: '',
    consultation_fee: ''
  });

  useEffect(() => {
    api.get('/doctors/my-profile').then(res => {
      setProfile({
        name: res.data.name || '',
        email: res.data.email || '',
        phone: res.data.phone || '',
        department_name: res.data.department_name || '',
        specialization: res.data.specialization || '',
        qualification: res.data.qualification || '',
        consultation_fee: res.data.consultation_fee || ''
      });
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/doctors/my-profile', profile);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-light text-slate-900 tracking-tight mb-8">My Profile</h1>
      
      <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-2xl border border-slate-100 p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Name</label>
              <input type="text" disabled className="block w-full rounded-xl border-slate-200 bg-slate-50 text-slate-500 shadow-sm sm:text-sm border px-4 py-3 cursor-not-allowed" value={profile.name} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Email</label>
              <input type="email" disabled className="block w-full rounded-xl border-slate-200 bg-slate-50 text-slate-500 shadow-sm sm:text-sm border px-4 py-3 cursor-not-allowed" value={profile.email} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Department</label>
              <input type="text" disabled className="block w-full rounded-xl border-slate-200 bg-slate-50 text-slate-500 shadow-sm sm:text-sm border px-4 py-3 cursor-not-allowed" value={profile.department_name} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Phone</label>
              <input type="text" className="block w-full rounded-xl border-slate-200 bg-white shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-4 py-3 transition-colors" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Specialization</label>
              <input type="text" className="block w-full rounded-xl border-slate-200 bg-white shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-4 py-3 transition-colors" value={profile.specialization} onChange={e => setProfile({...profile, specialization: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Qualification</label>
              <input type="text" className="block w-full rounded-xl border-slate-200 bg-white shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-4 py-3 transition-colors" value={profile.qualification} onChange={e => setProfile({...profile, qualification: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Consultation Fee ($)</label>
              <input type="number" step="0.01" className="block w-full rounded-xl border-slate-200 bg-white shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-4 py-3 transition-colors" value={profile.consultation_fee} onChange={e => setProfile({...profile, consultation_fee: e.target.value})} />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 mt-8">
            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors">
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
