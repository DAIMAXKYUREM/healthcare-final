import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';
import { ArrowLeft, Mail, Lock, Activity, CheckCircle2 } from 'lucide-react';

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
    <div className="min-h-screen flex bg-background overflow-hidden font-sans relative">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 z-10"
      >
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-10">
            <Link to="/login" className="inline-flex items-center text-sm font-bold text-primary hover:text-primary-dark transition-colors mb-8 group">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Portals
            </Link>
            
            <div className="flex items-center mb-6">
              <div className="bg-primary-light p-2 rounded-xl">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <span className="ml-3 text-xl font-display font-bold text-slate-900 tracking-tight">
                HealthCare+
              </span>
            </div>
            
            <h2 className="text-3xl font-heading font-bold text-slate-900 capitalize">{role} Login</h2>
            <p className="mt-2 text-slate-500">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="block w-full pl-11 pr-4 py-3 bg-surface border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-4 py-3 bg-surface border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-semibold text-primary hover:text-primary-dark">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-3.5 text-base"
            >
              Sign In
            </button>
            
            {role === 'patient' && (
              <p className="text-center text-sm text-slate-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-bold text-primary hover:text-primary-dark">
                  Create an account
                </Link>
              </p>
            )}
          </form>
          
          <div className="mt-10 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-1.5 rounded-lg mt-0.5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed italic">
                {role === 'admin' && "Secure access for system administrators. Monitor hospital operations and manage staff efficiently."}
                {role === 'doctor' && "Doctor portal access. Manage your patient records and daily schedule with precision."}
                {role === 'patient' && "Your health data is protected with end-to-end encryption. Access your records anytime."}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
      
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0">
          <img
            className="h-full w-full object-cover"
            src={getImageForRole()}
            alt="Healthcare background"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent"></div>
          
          <div className="absolute bottom-20 left-20 right-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="bg-surface/10 backdrop-blur-md p-8 rounded-[2rem] border border-white/20"
            >
              <h3 className="text-4xl font-heading font-bold text-white mb-4">
                Advanced Healthcare <br />
                <span className="text-primary-light">Management System</span>
              </h3>
              <p className="text-white/80 text-lg max-w-md">
                Streamlining medical services for a better patient experience and efficient hospital operations.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
