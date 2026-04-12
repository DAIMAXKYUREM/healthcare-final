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
    <div className="w-64 bg-white border-r border-slate-200 h-full overflow-y-auto flex flex-col shadow-[2px_0_8px_-4px_rgba(0,0,0,0.05)] z-10">
      <div className="flex-1 py-6 px-4 space-y-1">
        {userLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all",
                isActive 
                  ? "bg-slate-900 text-white shadow-md" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className={cn("h-5 w-5 mr-3", isActive ? "text-white" : "text-slate-400")} />
              {link.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
