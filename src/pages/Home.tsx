import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Activity, Facebook, Twitter, Instagram } from 'lucide-react';

export const Home = () => {
  return (
    <div className="min-h-screen bg-[#FF3366] font-sans overflow-x-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 border-[40px] border-[#0000FF] rounded-full -translate-x-1/2 -translate-y-1/2 z-0"></div>
      <div className="absolute top-20 right-10 text-[#0000FF] text-9xl font-black leading-none z-0">+</div>
      <div className="absolute bottom-40 left-1/2 text-[#0000FF] text-7xl font-black leading-none z-0">+</div>
      
      {/* White outline pluses */}
      <div className="absolute top-1/3 right-1/3 text-white text-8xl font-light opacity-50 z-0" style={{ WebkitTextStroke: '2px white', color: 'transparent' }}>+</div>
      <div className="absolute bottom-20 left-10 text-white text-6xl font-light opacity-50 z-0" style={{ WebkitTextStroke: '2px white', color: 'transparent' }}>+</div>

      {/* Floating pills */}
      <div className="absolute top-1/3 right-1/4 w-32 h-8 bg-[#00FFFF] border-[3px] border-black rounded-full rotate-45 z-10"></div>
      <div className="absolute bottom-1/4 right-10 w-24 h-6 bg-[#FF3366] border-[3px] border-black rounded-full -rotate-45 z-10"></div>

      {/* Navbar */}
      <nav className="relative z-20 px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center">
          <Activity className="h-8 w-8 text-white" />
          <span className="ml-2 text-2xl font-black text-white tracking-tight font-serif uppercase">HealthCare+</span>
        </div>
        
        <div className="hidden md:flex bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] px-8 py-3 space-x-8 items-center">
          <a href="#" className="text-[#FF3366] font-bold uppercase tracking-wider transition-colors">Home</a>
          <a href="#" className="text-black font-bold hover:text-[#FF3366] uppercase tracking-wider transition-colors">About</a>
          <a href="#" className="text-black font-bold hover:text-[#FF3366] uppercase tracking-wider transition-colors">Services</a>
          <a href="#gallery" className="text-black font-bold hover:text-[#FF3366] uppercase tracking-wider transition-colors">Gallery</a>
          <Link to="/login" className="text-black font-bold hover:text-[#FF3366] uppercase tracking-wider transition-colors">Login</Link>
        </div>
        
        {/* Mobile menu button could go here, but keeping it simple for now */}
        <div className="md:hidden">
          <Activity className="h-8 w-8 text-white" />
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 lg:pt-20 flex flex-col lg:flex-row items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:w-1/2 z-20"
        >
          <h1 className="text-6xl md:text-8xl font-serif font-bold leading-tight mb-6">
            <span className="text-[#FFEA00]">We care about</span><br/>
            <span className="text-white">your health</span>
          </h1>
          
          <p className="text-white text-xl mb-10 max-w-lg font-medium">
            Experience brutalist healthcare. No fluff, just raw, unapologetic medical excellence.
            Aenean placerat nisl quis convallis ullamcorper.
          </p>
          
          <Link to="/login/patient" className="inline-block px-8 py-4 border-[3px] border-black bg-[#FFEA00] text-[#0000FF] font-black text-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFD700] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-y-[8px] active:translate-x-[8px] transition-all uppercase tracking-widest">
            Book Now
          </Link>

          <div className="mt-16 flex items-center space-x-4">
            <span className="text-white font-bold text-lg">Follow Us</span>
            <a href="#" className="w-10 h-10 bg-[#0000FF] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-[#0000FF] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-[#0000FF] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:w-1/2 mt-16 lg:mt-0 relative h-[600px] flex justify-center lg:justify-end items-end"
        >
          <div className="relative flex justify-center items-end">
            {/* Yellow circle behind doctor */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#FFEA00] rounded-full border-[3px] border-black z-0 translate-y-10"></div>
            
            <img 
              src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=1200&q=80" 
              alt="Doctor" 
              className="relative z-10 w-[450px] h-[600px] object-cover object-top drop-shadow-2xl"
              style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }}
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
      </div>

      {/* Gallery Section */}
      <div id="gallery" className="bg-white border-t-[4px] border-black py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="inline-block text-5xl font-black text-black font-serif uppercase bg-[#FFEA00] px-6 py-2 border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              Gallery
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=800&q=80"
            ].map((src, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-[#FF3366] translate-x-3 translate-y-3 border-[3px] border-black z-0"></div>
                <img 
                  src={src} 
                  alt={`Gallery ${index + 1}`} 
                  className="relative z-10 w-full h-64 object-cover border-[3px] border-black grayscale group-hover:grayscale-0 transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
