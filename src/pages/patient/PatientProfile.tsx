import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';

export const PatientProfile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    age: '',
    gender: '',
    blood_group: '',
    address: '',
    emergency_contact: '',
    allergies: '',
    chronic_conditions: ''
  });

  const fetchProfile = async () => {
    try {
      const res = await api.get('/patients/my-profile');
      setProfile(res.data);
      setFormData({
        phone: res.data.phone || '',
        age: res.data.age || '',
        gender: res.data.gender || '',
        blood_group: res.data.blood_group || '',
        address: res.data.address || '',
        emergency_contact: res.data.emergency_contact || '',
        allergies: res.data.allergies || '',
        chronic_conditions: res.data.chronic_conditions || ''
      });
    } catch (error) {
      toast.error('Failed to load profile');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/patients/my-profile', formData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (!profile) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-light text-slate-900 tracking-tight">My Profile</h1>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 font-medium text-sm transition-colors shadow-sm"
        >
          {isEditing ? 'Cancel Editing' : 'Edit Profile'}
        </button>
      </div>

      <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-2xl border border-slate-100 overflow-hidden">
        <div className="bg-white px-8 py-6 border-b border-slate-100">
          <h2 className="text-xl font-medium text-slate-800">Personal Information</h2>
          <p className="text-sm text-slate-500 mt-1">Keep your medical and contact details up to date.</p>
        </div>

        <div className="p-8">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Phone</label>
                <input type="text" className="block w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-4 py-3 transition-colors" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Age</label>
                <input type="number" className="block w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-4 py-3 transition-colors" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Gender</label>
                <select className="block w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-4 py-3 transition-colors" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Blood Group</label>
                <input type="text" className="block w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-4 py-3 transition-colors" value={formData.blood_group} onChange={e => setFormData({...formData, blood_group: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Address</label>
                <textarea rows={2} className="block w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-4 py-3 transition-colors resize-none" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Emergency Contact</label>
                <input type="text" className="block w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-4 py-3 transition-colors" value={formData.emergency_contact} onChange={e => setFormData({...formData, emergency_contact: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Allergies</label>
                <textarea rows={2} placeholder="List any allergies..." className="block w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-4 py-3 transition-colors resize-none" value={formData.allergies} onChange={e => setFormData({...formData, allergies: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Chronic Conditions</label>
                <textarea rows={2} placeholder="List any chronic conditions..." className="block w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-4 py-3 transition-colors resize-none" value={formData.chronic_conditions} onChange={e => setFormData({...formData, chronic_conditions: e.target.value})} />
              </div>
              <div className="md:col-span-2 flex justify-end pt-4 border-t border-slate-100">
                <button type="submit" className="bg-slate-900 text-white px-8 py-3 rounded-xl hover:bg-slate-800 font-medium text-sm transition-colors shadow-sm">
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-10">
              <div>
                <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Full Name</h3>
                <p className="mt-2 text-base font-medium text-slate-800">{profile.name}</p>
              </div>
              <div>
                <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email</h3>
                <p className="mt-2 text-base font-medium text-slate-800">{profile.email}</p>
              </div>
              <div>
                <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Phone</h3>
                <p className="mt-2 text-base font-medium text-slate-800">{profile.phone || '-'}</p>
              </div>
              <div>
                <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Age / Gender</h3>
                <p className="mt-2 text-base font-medium text-slate-800 capitalize">
                  {profile.age ? `${profile.age} yrs` : '-'} / {profile.gender || '-'}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Blood Group</h3>
                <p className="mt-2 text-base font-medium text-slate-800">{profile.blood_group || '-'}</p>
              </div>
              <div>
                <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Emergency Contact</h3>
                <p className="mt-2 text-base font-medium text-slate-800">{profile.emergency_contact || '-'}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Address</h3>
                <p className="mt-2 text-base font-medium text-slate-800">{profile.address || '-'}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Allergies</h3>
                <p className="mt-2 text-base font-medium text-slate-800">{profile.allergies || 'None reported'}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Chronic Conditions</h3>
                <p className="mt-2 text-base font-medium text-slate-800">{profile.chronic_conditions || 'None reported'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
