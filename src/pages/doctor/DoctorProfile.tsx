import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Award, Stethoscope, DollarSign, Building2, Save, ArrowLeft, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

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
      <div className="mb-10">
        <Link to="/doctor" className="inline-flex items-center text-sm font-bold text-primary hover:text-primary-dark transition-colors mb-6 group">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">My Professional Profile</h1>
        <p className="text-slate-500 mt-1">Manage your professional information and consultation details.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1">
          <div className="card-healthcare p-8 text-center">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-3xl bg-primary-light flex items-center justify-center text-primary font-bold text-4xl border-4 border-white shadow-xl">
                {profile.name.charAt(0)}
              </div>
              <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-slate-100 text-primary hover:text-primary-dark transition-colors">
                <Camera className="h-5 w-5" />
              </button>
            </div>
            <h2 className="text-2xl font-heading font-bold text-slate-900">{profile.name}</h2>
            <p className="text-primary font-bold text-sm mt-1 uppercase tracking-widest">{profile.specialization || 'Specialist'}</p>
            
            <div className="mt-8 pt-8 border-t border-slate-100 space-y-4 text-left">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <span className="text-sm font-medium">{profile.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <Building2 className="h-4 w-4 text-slate-400" />
                </div>
                <span className="text-sm font-medium">{profile.department_name}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card-healthcare p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Basic Information</h3>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Full Name</label>
                    <div className="relative">
                      <input type="text" disabled className="block w-full rounded-2xl border-slate-200 bg-slate-50 text-slate-400 sm:text-sm border px-4 py-3 cursor-not-allowed outline-none" value={profile.name} />
                      <User className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                    <div className="relative">
                      <input type="email" disabled className="block w-full rounded-2xl border-slate-200 bg-slate-50 text-slate-400 sm:text-sm border px-4 py-3 cursor-not-allowed outline-none" value={profile.email} />
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Phone Number</label>
                    <div className="relative">
                      <input type="text" className="block w-full rounded-2xl border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm border px-4 py-3 outline-none transition-all" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} />
                      <Phone className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Professional Details</h3>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Specialization</label>
                    <div className="relative">
                      <input type="text" className="block w-full rounded-2xl border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm border px-4 py-3 outline-none transition-all" value={profile.specialization} onChange={e => setProfile({...profile, specialization: e.target.value})} />
                      <Stethoscope className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Qualification</label>
                    <div className="relative">
                      <input type="text" className="block w-full rounded-2xl border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm border px-4 py-3 outline-none transition-all" value={profile.qualification} onChange={e => setProfile({...profile, qualification: e.target.value})} />
                      <Award className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Consultation Fee ($)</label>
                    <div className="relative">
                      <input type="number" step="0.01" className="block w-full rounded-2xl border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm border px-4 py-3 outline-none transition-all" value={profile.consultation_fee} onChange={e => setProfile({...profile, consultation_fee: e.target.value})} />
                      <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 flex justify-end">
                <button type="submit" className="btn-primary flex items-center px-10 py-4">
                  <Save className="mr-2 h-5 w-5" />
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
