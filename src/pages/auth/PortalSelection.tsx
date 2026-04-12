import React from 'react';
import { Link } from 'react-router-dom';
import { User, Shield, Stethoscope } from 'lucide-react';
import { motion } from 'motion/react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
};

export const PortalSelection = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-[#FF3366] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-[#0000FF] rounded-full border-[3px] border-black opacity-20 hidden md:block"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-[#FFEA00] rounded-full border-[3px] border-black hidden md:block z-0"></div>
      <div className="absolute top-40 right-40 text-[#0000FF] text-9xl font-bold opacity-50 hidden lg:block z-0">+</div>
      <div className="absolute bottom-40 left-40 w-24 h-8 bg-[#00FFFF] border-[3px] border-black rounded-full rotate-45 hidden md:block"></div>
      <div className="absolute top-1/2 left-20 text-white text-8xl font-bold opacity-30 hidden lg:block">+</div>
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-16 relative z-10"
      >
        <h2 className="text-4xl font-extrabold text-white tracking-tight sm:text-6xl mb-4 font-serif drop-shadow-lg">
          Welcome to HealthCare+
        </h2>
        <p className="text-xl text-black max-w-2xl mx-auto font-bold bg-[#FFEA00] p-2 border-[2px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block mb-8">
          Select your portal to securely access your account.
        </p>
        
        <div className="mt-4">
          <Link to="/" className="inline-block px-6 py-2 border-[3px] border-black bg-[#00FFFF] text-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#00E5E5] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] transition-all uppercase tracking-wider">
            &larr; Back to Home
          </Link>
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full z-10"
      >
        <motion.div variants={itemVariants} whileHover={{ y: -4, x: -4, transition: { duration: 0.1 } }}>
          <Link to="/login/patient" className="group flex flex-col bg-white rounded-none border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 overflow-hidden h-full">
            <div className="h-56 w-full relative overflow-hidden border-b-[3px] border-black">
              <motion.img 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
                src="https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop" 
                alt="Patient" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" 
                referrerPolicy="no-referrer" 
              />
              <div className="absolute inset-0 bg-[#00FFFF] mix-blend-multiply opacity-50 group-hover:opacity-0 transition-all duration-300"></div>
              <div className="absolute bottom-4 left-4 flex items-center text-black bg-[#FFEA00] border-[2px] border-black px-3 py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <User className="w-6 h-6 mr-2" />
                <h3 className="text-xl font-bold tracking-tight uppercase">Patient</h3>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between bg-white">
              <p className="text-black font-medium mb-6 leading-relaxed">Book appointments, view your medical history, and access your prescriptions securely.</p>
              <span className="inline-flex items-center justify-center w-full py-3 px-4 bg-[#FFEA00] text-[#0000FF] font-bold border-[2px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:bg-[#FFD700] transition-colors uppercase tracking-wider">
                Sign in as Patient <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </div>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -4, x: -4, transition: { duration: 0.1 } }}>
          <Link to="/login/doctor" className="group flex flex-col bg-white rounded-none border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 overflow-hidden h-full">
            <div className="h-56 w-full relative overflow-hidden border-b-[3px] border-black">
              <motion.img 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop" 
                alt="Doctor" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" 
                referrerPolicy="no-referrer" 
              />
              <div className="absolute inset-0 bg-[#0000FF] mix-blend-multiply opacity-50 group-hover:opacity-0 transition-all duration-300"></div>
              <div className="absolute bottom-4 left-4 flex items-center text-black bg-[#FFEA00] border-[2px] border-black px-3 py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Stethoscope className="w-6 h-6 mr-2" />
                <h3 className="text-xl font-bold tracking-tight uppercase">Doctor</h3>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between bg-white">
              <p className="text-black font-medium mb-6 leading-relaxed">Manage your daily schedule, view patient records, and write prescriptions.</p>
              <span className="inline-flex items-center justify-center w-full py-3 px-4 bg-[#FFEA00] text-[#0000FF] font-bold border-[2px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:bg-[#FFD700] transition-colors uppercase tracking-wider">
                Sign in as Doctor <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </div>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -4, x: -4, transition: { duration: 0.1 } }}>
          <Link to="/login/admin" className="group flex flex-col bg-white rounded-none border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 overflow-hidden h-full">
            <div className="h-56 w-full relative overflow-hidden border-b-[3px] border-black">
              <motion.img 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop" 
                alt="Admin" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" 
                referrerPolicy="no-referrer" 
              />
              <div className="absolute inset-0 bg-[#FF3366] mix-blend-multiply opacity-50 group-hover:opacity-0 transition-all duration-300"></div>
              <div className="absolute bottom-4 left-4 flex items-center text-black bg-[#FFEA00] border-[2px] border-black px-3 py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Shield className="w-6 h-6 mr-2" />
                <h3 className="text-xl font-bold tracking-tight uppercase">Admin</h3>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between bg-white">
              <p className="text-black font-medium mb-6 leading-relaxed">System administration, staff management, and hospital-wide appointment oversight.</p>
              <span className="inline-flex items-center justify-center w-full py-3 px-4 bg-[#FFEA00] text-[#0000FF] font-bold border-[2px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:bg-[#FFD700] transition-colors uppercase tracking-wider">
                Sign in as Admin <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};
