import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import { User, Mail, Phone, MapPin, Heart, AlertCircle, Calendar, ArrowLeft, Edit3, Save, X, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

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

  if (!profile) return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
  );

  return (
      <div className="p-6 md:p-10 max-w-5xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Link to="/patient" className="inline-flex items-center text-sm font-bold text-primary hover:text-primary-dark transition-colors mb-4 group">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">My Profile</h1>
            <p className="text-slate-500 mt-1">Manage your personal and medical information.</p>
          </div>
          <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-sm ${
                  isEditing
                      ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      : 'btn-primary'
              }`}
          >
            {isEditing ? (
                <><X className="h-4 w-4" /> Cancel Editing</>
            ) : (
                <><Edit3 className="h-4 w-4" /> Edit Profile</>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1">
            <div className="card-healthcare p-8 text-center sticky top-10">
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 rounded-3xl bg-primary-light flex items-center justify-center text-primary font-bold text-4xl border-4 border-white shadow-xl">
                  {profile.name.charAt(0)}
                </div>
                <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-slate-100 text-primary hover:text-primary-dark transition-colors">
                  <Camera className="h-5 w-5" />
                </button>
              </div>
              <h2 className="text-2xl font-heading font-bold text-slate-900">{profile.name}</h2>
              <p className="text-slate-500 font-medium text-sm mt-1">{profile.email}</p>

              <div className="mt-8 pt-8 border-t border-slate-100 space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Patient ID</span>
                  <span className="text-sm font-bold text-slate-900">#PT-{profile.id.toString().padStart(4, '0')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Blood Group</span>
                  <span className="text-sm font-bold text-red-500">{profile.blood_group || 'Not Set'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="card-healthcare p-8 md:p-10">
              <AnimatePresence mode="wait">
                {isEditing ? (
                    <motion.form
                        key="edit-form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onSubmit={handleSubmit}
                        className="space-y-8"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">Contact & Personal</h3>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Phone Number</label>
                          <div className="relative">
                            <input type="text" className="block w-full rounded-2xl border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm border px-4 py-3 outline-none transition-all" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                            <Phone className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Age</label>
                          <div className="relative">
                            <input type="number" className="block w-full rounded-2xl border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm border px-4 py-3 outline-none transition-all" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Gender</label>
                          <select className="block w-full rounded-2xl border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm border px-4 py-3 outline-none transition-all appearance-none" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Blood Group</label>
                          <div className="relative">
                            <input type="text" className="block w-full rounded-2xl border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm border px-4 py-3 outline-none transition-all" value={formData.blood_group} onChange={e => setFormData({...formData, blood_group: e.target.value})} />
                            <Heart className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Home Address</label>
                          <div className="relative">
                            <textarea rows={2} className="block w-full rounded-2xl border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm border px-4 py-3 outline-none transition-all resize-none" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                            <MapPin className="absolute right-4 top-4 h-4 w-4 text-slate-300" />
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Emergency Contact Info</label>
                          <div className="relative">
                            <input type="text" className="block w-full rounded-2xl border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm border px-4 py-3 outline-none transition-all" value={formData.emergency_contact} onChange={e => setFormData({...formData, emergency_contact: e.target.value})} />
                            <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                          </div>
                        </div>

                        <div className="md:col-span-2 mt-4">
                          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">Medical History</h3>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Known Allergies</label>
                          <textarea rows={2} placeholder="e.g. Penicillin, Peanuts..." className="block w-full rounded-2xl border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm border px-4 py-3 outline-none transition-all resize-none" value={formData.allergies} onChange={e => setFormData({...formData, allergies: e.target.value})} />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Chronic Conditions</label>
                          <textarea rows={2} placeholder="e.g. Diabetes, Hypertension..." className="block w-full rounded-2xl border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm border px-4 py-3 outline-none transition-all resize-none" value={formData.chronic_conditions} onChange={e => setFormData({...formData, chronic_conditions: e.target.value})} />
                        </div>
                      </div>
                      <div className="flex justify-end pt-8 border-t border-slate-100">
                        <button type="submit" className="btn-primary flex items-center px-10 py-4">
                          <Save className="mr-2 h-5 w-5" />
                          Save Profile Changes
                        </button>
                      </div>
                    </motion.form>
                ) : (
                    <motion.div
                        key="view-profile"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-10"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                        <div className="md:col-span-2">
                          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Personal Details</h3>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-slate-50 rounded-2xl">
                            <User className="h-5 w-5 text-slate-400" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</h4>
                            <p className="mt-1 text-base font-bold text-slate-800">{profile.name}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-slate-50 rounded-2xl">
                            <Mail className="h-5 w-5 text-slate-400" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</h4>
                            <p className="mt-1 text-base font-bold text-slate-800">{profile.email}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-slate-50 rounded-2xl">
                            <Phone className="h-5 w-5 text-slate-400" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</h4>
                            <p className="mt-1 text-base font-bold text-slate-800">{profile.phone || 'Not provided'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-slate-50 rounded-2xl">
                            <Calendar className="h-5 w-5 text-slate-400" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Age / Gender</h4>
                            <p className="mt-1 text-base font-bold text-slate-800 capitalize">
                              {profile.age ? `${profile.age} years` : '-'} / {profile.gender || '-'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 md:col-span-2">
                          <div className="p-3 bg-slate-50 rounded-2xl">
                            <MapPin className="h-5 w-5 text-slate-400" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Home Address</h4>
                            <p className="mt-1 text-base font-bold text-slate-800">{profile.address || 'Not provided'}</p>
                          </div>
                        </div>

                        <div className="md:col-span-2 mt-4">
                          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Medical Profile</h3>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-red-50 rounded-2xl">
                            <Heart className="h-5 w-5 text-red-400" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Blood Group</h4>
                            <p className="mt-1 text-base font-bold text-red-500">{profile.blood_group || 'Not specified'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-orange-50 rounded-2xl">
                            <AlertCircle className="h-5 w-5 text-orange-400" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Emergency Contact</h4>
                            <p className="mt-1 text-base font-bold text-slate-800">{profile.emergency_contact || 'Not provided'}</p>
                          </div>
                        </div>
                        <div className="md:col-span-2 flex items-start gap-4">
                          <div className="p-3 bg-slate-50 rounded-2xl">
                            <AlertCircle className="h-5 w-5 text-slate-400" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Known Allergies</h4>
                            <p className="mt-1 text-base font-bold text-slate-800">{profile.allergies || 'None reported'}</p>
                          </div>
                        </div>
                        <div className="md:col-span-2 flex items-start gap-4">
                          <div className="p-3 bg-slate-50 rounded-2xl">
                            <Heart className="h-5 w-5 text-slate-400" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chronic Conditions</h4>
                            <p className="mt-1 text-base font-bold text-slate-800">{profile.chronic_conditions || 'None reported'}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
  );
};
