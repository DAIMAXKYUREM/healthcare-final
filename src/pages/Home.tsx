import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Activity, Facebook, Twitter, Instagram, ArrowRight, CheckCircle2, Phone, Mail, MapPin, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const Home = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="relative z-50 bg-surface/80 backdrop-blur-md border-b border-slate-100 sticky top-0 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div className="bg-primary-light p-2 rounded-xl">
                <Activity className="h-7 w-7 text-primary" />
              </div>
              <span className="ml-3 text-2xl font-display font-bold text-slate-900 tracking-tight">
                Health<span className="text-primary">Care+</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-sm font-semibold text-primary">Home</a>
              <a href="#services" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">Services</a>
              <a href="#gallery" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">Gallery</a>
              <Link to="/about" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">About</Link>
              
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
            
            <div className="md:hidden flex items-center">
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2"
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-light rounded-full mb-6">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                <span className="text-xs font-bold text-primary uppercase tracking-wider">24/7 Medical Support</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-heading font-bold text-slate-900 leading-[1.1] mb-8">
                Your Health is Our <span className="text-primary">Top Priority</span>
              </h1>
              
              <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
                Experience world-class healthcare with our team of expert doctors and state-of-the-art facilities. We provide personalized care for your well-being.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link to="/login/patient" className="btn-primary flex items-center group w-full sm:w-auto justify-center">
                  Book Appointment
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#services" className="btn-secondary w-full sm:w-auto text-center">
                  Our Services
                </a>
              </div>

              <div className="mt-12 flex items-center gap-8">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-slate-900">15k+</span>
                  <span className="text-sm text-slate-500">Happy Patients</span>
                </div>
                <div className="w-px h-10 bg-slate-200"></div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-slate-900">150+</span>
                  <span className="text-sm text-slate-500">Expert Doctors</span>
                </div>
                <div className="w-px h-10 bg-slate-200"></div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-slate-900">20+</span>
                  <span className="text-sm text-slate-500">Specializations</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:w-1/2 relative"
            >
              <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/10">
                <img 
                  src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=1200&q=80" 
                  alt="Healthcare Professional" 
                  className="w-full h-[600px] object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -bottom-6 -left-6 bg-surface p-4 rounded-2xl shadow-xl border border-slate-100 z-20 flex items-center gap-4 animate-bounce-slow">
                <div className="bg-success/10 p-2 rounded-xl">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Appointment</p>
                  <p className="text-sm font-bold text-slate-900">Confirmed Successfully</p>
                </div>
              </div>
              
              <div className="absolute top-1/4 -right-6 bg-surface p-4 rounded-2xl shadow-xl border border-slate-100 z-20 flex items-center gap-4 animate-float">
                <div className="bg-primary/10 p-2 rounded-xl">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Heart Rate</p>
                  <p className="text-sm font-bold text-slate-900">82 BPM</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-primary font-bold uppercase tracking-widest text-sm mb-4">Our Services</h2>
            <h3 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-6">Comprehensive Care for You and Your Family</h3>
            <p className="text-slate-600">We offer a wide range of medical services to ensure that you receive the best care possible.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "General Consultation", desc: "Regular check-ups and health screenings for all ages.", icon: Activity },
              { title: "Specialized Surgery", desc: "Advanced surgical procedures performed by expert surgeons.", icon: Activity },
              { title: "Diagnostic Testing", desc: "State-of-the-art laboratory and imaging services.", icon: Activity },
              { title: "Emergency Care", desc: "24/7 emergency medical services for critical situations.", icon: Activity },
              { title: "Dental Care", desc: "Comprehensive dental services for a healthy smile.", icon: Activity },
              { title: "Mental Health", desc: "Professional counseling and psychiatric support.", icon: Activity }
            ].map((service, i) => (
              <div key={i} className="card-healthcare p-8 group">
                <div className="bg-primary/5 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                  <service.icon className="h-7 w-7 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-4">{service.title}</h4>
                <p className="text-slate-600 mb-6">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-primary font-bold uppercase tracking-widest text-sm mb-4">Our Gallery</h2>
              <h3 className="text-4xl font-heading font-bold text-slate-900">Inside Our Modern Facilities</h3>
            </div>
            <button className="btn-secondary">View All Photos</button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                whileHover={{ y: -10 }}
                className="relative rounded-3xl overflow-hidden group h-80 shadow-lg"
              >
                <img 
                  src={src} 
                  alt={`Facility ${index + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 lg:col-span-1">
              <div className="flex items-center mb-6">
                <div className="bg-primary p-2 rounded-xl">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-2xl font-display font-bold text-white tracking-tight">
                  HealthCare+
                </span>
              </div>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Providing world-class healthcare services with a focus on patient well-being and advanced medical technology.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-primary transition-colors">Home</a></li>
                <li><a href="#services" className="hover:text-primary transition-colors">Services</a></li>
                <li><a href="#gallery" className="hover:text-primary transition-colors">Gallery</a></li>
                <li><a href="#about" className="hover:text-primary transition-colors">About Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Support</h4>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Emergency Services</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary mr-3 mt-1" />
                  <span>123 Medical Plaza, Health City, HC 12345</span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 text-primary mr-3" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 text-primary mr-3" />
                  <span>contact@healthcare.com</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} HealthCare+. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
