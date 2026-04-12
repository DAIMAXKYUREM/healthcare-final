import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    age: '',
    gender: 'male',
    blood_group: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#FF3366] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-[#0000FF] rounded-full border-[3px] border-black opacity-20 hidden md:block"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-[#FFEA00] rounded-full border-[3px] border-black hidden md:block"></div>
      <div className="absolute top-40 right-40 text-[#0000FF] text-9xl font-bold opacity-50 hidden lg:block">+</div>
      <div className="absolute bottom-40 left-40 w-24 h-8 bg-[#00FFFF] border-[3px] border-black rounded-full rotate-45 hidden md:block"></div>
      <div className="absolute top-1/2 left-20 text-white text-8xl font-bold opacity-30 hidden lg:block">+</div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-none border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative z-10"
      >
        <div>
          <h2 className="mt-2 text-center text-4xl font-extrabold text-black font-serif">
            Join Us
          </h2>
          <p className="mt-2 text-center text-sm text-black font-medium">
            Already have an account? <Link to="/login" className="font-bold text-[#0000FF] hover:underline decoration-2 underline-offset-4">Sign in</Link>
          </p>
        </div>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold text-black uppercase tracking-wider">Full Name</label>
            <input type="text" required className="mt-1 block w-full rounded-none border-[2px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-y-[2px] focus:translate-x-[2px] focus:outline-none px-4 py-3 transition-all font-medium" 
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold text-black uppercase tracking-wider">Email</label>
            <input type="email" required className="mt-1 block w-full rounded-none border-[2px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-y-[2px] focus:translate-x-[2px] focus:outline-none px-4 py-3 transition-all font-medium" 
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold text-black uppercase tracking-wider">Password</label>
            <input type="password" required className="mt-1 block w-full rounded-none border-[2px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-y-[2px] focus:translate-x-[2px] focus:outline-none px-4 py-3 transition-all font-medium" 
              value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-black uppercase tracking-wider">Age</label>
              <input type="number" className="mt-1 block w-full rounded-none border-[2px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-y-[2px] focus:translate-x-[2px] focus:outline-none px-4 py-3 transition-all font-medium" 
                value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-black uppercase tracking-wider">Gender</label>
              <select className="mt-1 block w-full rounded-none border-[2px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-y-[2px] focus:translate-x-[2px] focus:outline-none px-4 py-3 transition-all font-medium bg-white"
                value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full flex justify-center py-3 px-4 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-lg font-bold text-[#0000FF] bg-[#FFEA00] hover:bg-[#FFD700] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] transition-all uppercase tracking-wider">
              Register Now
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
