import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';

export const Login = ({ role }: { role: 'admin' | 'doctor' | 'patient' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password, role });
      login(res.data.token, res.data.user);
      toast.success('Logged in successfully');
      
      if (res.data.user.role === 'admin') navigate('/admin');
      else if (res.data.user.role === 'doctor') navigate('/doctor');
      else navigate('/patient');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  const getImageForRole = () => {
    if (role === 'admin') return 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop';
    if (role === 'doctor') return 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1200&auto=format&fit=crop';
    return 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1200&auto=format&fit=crop';
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex bg-[#FF3366] overflow-hidden font-sans relative">
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-[#0000FF] rounded-full border-[3px] border-black opacity-20 hidden md:block"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-[#FFEA00] rounded-full border-[3px] border-black hidden md:block z-0"></div>
      <div className="absolute top-40 right-40 text-[#0000FF] text-9xl font-bold opacity-50 hidden lg:block z-0">+</div>
      <div className="absolute bottom-40 left-40 w-24 h-8 bg-[#00FFFF] border-[3px] border-black rounded-full rotate-45 hidden md:block"></div>
      <div className="absolute top-1/2 left-20 text-white text-8xl font-bold opacity-30 hidden lg:block">+</div>

      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 z-10"
      >
        <div className="mx-auto w-full max-w-sm lg:w-96 bg-white p-8 border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div>
            <h2 className="mt-2 text-4xl font-extrabold text-black capitalize font-serif">{role} Login</h2>
            {role === 'patient' && (
              <p className="mt-2 text-sm text-black font-medium">
                Or <Link to="/register" className="font-bold text-[#0000FF] hover:underline decoration-2 underline-offset-4">register as a new patient</Link>
              </p>
            )}
          </div>

          <div className="mt-8">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-bold text-black uppercase tracking-wider">Email address</label>
                <div className="mt-1">
                  <input
                    type="email"
                    required
                    className="appearance-none block w-full px-4 py-3 border-[2px] border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-y-[2px] focus:translate-x-[2px] focus:outline-none transition-all font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-black uppercase tracking-wider">Password</label>
                <div className="mt-1">
                  <input
                    type="password"
                    required
                    className="appearance-none block w-full px-4 py-3 border-[2px] border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-y-[2px] focus:translate-x-[2px] focus:outline-none transition-all font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-lg font-bold text-[#0000FF] bg-[#FFEA00] hover:bg-[#FFD700] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] transition-all uppercase tracking-wider"
                >
                  Sign in
                </button>
              </div>
              
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.4 }}
                className="mt-6 bg-[#00FFFF] p-4 border-[2px] border-black text-sm text-black font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                {role === 'admin' && (
                  <>
                    <p className="font-bold text-black mb-1 uppercase tracking-wider">"Efficiency is the foundation of survival."</p>
                    <p className="italic text-xs">— System Administrator</p>
                  </>
                )}
                {role === 'doctor' && (
                  <>
                    <p className="font-bold text-black mb-1 uppercase tracking-wider">"Precision. Focus. Results."</p>
                    <p className="italic text-xs">— Chief of Surgery</p>
                  </>
                )}
                {role === 'patient' && (
                  <>
                    <p className="font-bold text-black mb-1 uppercase tracking-wider">"Your health, unapologetically prioritized."</p>
                    <p className="italic text-xs">— HealthCare+ Promise</p>
                  </>
                )}
              </motion.div>

              <div className="mt-6 text-center space-y-3">
                <Link to="/login" className="text-sm font-bold text-black hover:text-[#0000FF] flex items-center justify-center transition-colors uppercase tracking-wider">
                  <span className="mr-2">&larr;</span> Back to Portal Selection
                </Link>
                <Link to="/" className="text-sm font-bold text-black hover:text-[#0000FF] flex items-center justify-center transition-colors uppercase tracking-wider">
                  <span className="mr-2">&larr;</span> Back to Home
                </Link>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
      
      <div className="hidden lg:block relative w-0 flex-1 z-10 border-l-[3px] border-black">
        <div className="absolute inset-0 bg-[#FFEA00] flex items-center justify-center overflow-hidden">
           <div className="absolute w-[150%] h-[150%] bg-[#FF3366] rounded-full -right-[50%] -top-[25%] border-[3px] border-black"></div>
           <div className="absolute text-[#0000FF] text-[20rem] font-bold opacity-20 -left-10 top-20">+</div>
           <img
            className="absolute inset-0 h-full w-full object-cover mix-blend-multiply opacity-80"
            src={getImageForRole()}
            alt="Role specific"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </div>
  );
};
