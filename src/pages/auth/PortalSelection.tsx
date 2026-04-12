import React from 'react';
import { Link } from 'react-router-dom';
import { User, Shield, Stethoscope, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export const PortalSelection = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl -z-10"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 relative z-10"
      >
        <Link to="/" className="inline-flex items-center text-sm font-bold text-primary hover:text-primary-dark transition-colors mb-8 group">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 tracking-tight mb-4">
          Welcome to <span className="text-primary">HealthCare+</span>
        </h2>
        <p className="text-lg text-slate-500 max-w-xl mx-auto">
          Please select your portal to securely access your account and manage your healthcare services.
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full z-10"
      >
        {[
          {
            role: 'patient',
            title: 'Patient Portal',
            desc: 'Book appointments, view medical history, and access prescriptions.',
            icon: User,
            img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop',
            color: 'bg-primary'
          },
          {
            role: 'doctor',
            title: 'Doctor Portal',
            desc: 'Manage schedules, view patient records, and write prescriptions.',
            icon: Stethoscope,
            img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop',
            color: 'bg-secondary'
          },
          {
            role: 'admin',
            title: 'Admin Portal',
            desc: 'System administration, staff management, and hospital oversight.',
            icon: Shield,
            img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
            color: 'bg-slate-900'
          }
        ].map((portal) => (
          <motion.div key={portal.role} variants={itemVariants}>
            <Link 
              to={`/login/${portal.role}`} 
              className="group block card-healthcare overflow-hidden h-full flex flex-col"
            >
              <div className="h-48 w-full relative overflow-hidden">
                <img 
                  src={portal.img} 
                  alt={portal.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 flex items-center text-white">
                  <div className={`${portal.color} p-2 rounded-lg mr-3 shadow-lg`}>
                    <portal.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight">{portal.title}</h3>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between">
                <p className="text-slate-600 mb-8 leading-relaxed">{portal.desc}</p>
                <div className="flex items-center text-primary font-bold group-hover:translate-x-1 transition-transform">
                  Access Portal <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
      
      <div className="mt-16 text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} HealthCare+. Secure Medical Systems.
      </div>
    </div>
  );
};
