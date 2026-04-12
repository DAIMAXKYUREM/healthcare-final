import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Calendar, Users, FileText, Settings, UserCircle, CreditCard } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const links = {
    admin: [
      { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
      { name: 'Manage Patients', path: '/admin/patients', icon: Users },
      { name: 'Manage Doctors', path: '/admin/doctors', icon: Users },
      { name: 'Manage Staff', path: '/admin/staff', icon: Users },
      { name: 'Appointments', path: '/admin/appointments', icon: Calendar },
      { name: 'Medical Records', path: '/admin/records', icon: FileText },
      { name: 'Prescriptions', path: '/admin/prescriptions', icon: FileText },
      { name: 'Billing', path: '/admin/billing', icon: CreditCard },
      { name: 'Emergencies', path: '/admin/emergencies', icon: FileText },
      { name: 'Reports & Analysis', path: '/admin/reports', icon: LayoutDashboard },
    ],
    doctor: [
      { name: 'Dashboard', path: '/doctor', icon: LayoutDashboard },
      { name: 'My Schedule', path: '/doctor/schedule', icon: Calendar },
      { name: 'Patients', path: '/doctor/patients', icon: Users },
      { name: 'My Profile', path: '/doctor/profile', icon: UserCircle },
    ],
    patient: [
      { name: 'Dashboard', path: '/patient', icon: LayoutDashboard },
      { name: 'Book Appointment', path: '/patient/book', icon: Calendar },
      { name: 'My Appointments', path: '/patient/appointments', icon: Calendar },
      { name: 'Medical History', path: '/patient/prescriptions', icon: FileText },
      { name: 'Billing', path: '/patient/billing', icon: CreditCard },
      { name: 'My Profile', path: '/patient/profile', icon: UserCircle },
    ]
  };

  const userLinks = links[user.role] || [];

  return (
    <div className="w-72 bg-surface border-r border-slate-100 h-full overflow-y-auto flex flex-col z-40">
      <div className="flex-1 py-8 px-6 space-y-2">
        <div className="mb-6 px-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Main Menu</p>
        </div>
        {userLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-200 group",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-slate-500 hover:bg-primary-light hover:text-primary"
              )}
            >
              <Icon className={cn("h-5 w-5 mr-3 transition-colors duration-200", isActive ? "text-white" : "text-slate-400 group-hover:text-primary")} />
              {link.name}
            </Link>
          );
        })}
      </div>
      
      <div className="p-6 border-t border-slate-100">
        <div className="bg-primary-light rounded-2xl p-4">
          <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Need Help?</p>
          <p className="text-[11px] text-slate-600 mb-3">Contact our 24/7 support for any assistance.</p>
          <button className="w-full py-2 bg-white text-primary text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all">
            Support Center
          </button>
        </div>
      </div>
    </div>
  );
};
