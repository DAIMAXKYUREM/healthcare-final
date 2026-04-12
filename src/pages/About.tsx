import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Activity, Shield, Users, Stethoscope, ArrowLeft, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const About = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="relative z-50 bg-surface/80 backdrop-blur-md border-b border-slate-100 sticky top-0 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <div className="bg-primary-light p-2 rounded-xl group-hover:bg-primary transition-colors duration-300">
                  <Activity className="h-7 w-7 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="ml-3 text-2xl font-display font-bold text-slate-900 tracking-tight">
                  Health<span className="text-primary">Care+</span>
                </span>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">Home</Link>
              <Link to="/#services" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">Services</Link>
              <Link to="/#gallery" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">Gallery</Link>
              <Link to="/about" className="text-sm font-semibold text-primary">About</Link>
              
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">Login</Link>
              <Link to="/register" className="btn-primary">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-slate-900 leading-[1.1] mb-6">
              Empowering Healthcare <span className="text-primary">Together</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              HealthCare+ is a comprehensive platform designed to bridge the gap between patients, medical professionals, and administrators. Our mission is to streamline healthcare delivery and improve patient outcomes through modern technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How it helps section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            
            {/* Patients */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="card-healthcare p-10 flex flex-col items-center text-center group"
            >
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">For Patients</h3>
              <p className="text-slate-600 leading-relaxed">
                Experience seamless healthcare access. Book appointments instantly, manage your medical records securely, view prescriptions, and track your billing history all from an intuitive, easy-to-use dashboard. HealthCare+ puts you in control of your health journey.
              </p>
            </motion.div>

            {/* Doctors */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="card-healthcare p-10 flex flex-col items-center text-center group"
            >
              <div className="bg-secondary/10 w-20 h-20 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <Stethoscope className="h-10 w-10 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">For Doctors</h3>
              <p className="text-slate-600 leading-relaxed">
                Focus more on patient care and less on paperwork. Our platform provides doctors with a comprehensive view of patient histories, streamlined appointment scheduling, digital prescription management, and real-time emergency alerts to optimize daily workflows.
              </p>
            </motion.div>

            {/* Admins */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="card-healthcare p-10 flex flex-col items-center text-center group"
            >
              <div className="bg-success/10 w-20 h-20 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-10 w-10 text-success" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">For Administrators</h3>
              <p className="text-slate-600 leading-relaxed">
                Maintain complete oversight of hospital operations. Admins can efficiently manage medical staff, oversee patient records, monitor financial metrics, handle billing, and ensure smooth day-to-day operations through a powerful, centralized command center.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-primary p-2 rounded-xl">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="ml-3 text-2xl font-display font-bold text-white tracking-tight">
              HealthCare+
            </span>
          </div>
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} HealthCare+. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
