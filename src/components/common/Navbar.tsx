import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Activity } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b-[3px] border-black z-20 relative font-sans">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="bg-[#FFEA00] border-[2px] border-black p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Activity className="h-6 w-6 text-[#0000FF]" />
            </div>
            <span className="ml-3 text-2xl font-black text-black tracking-tight font-serif uppercase">HealthCare+</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2 text-sm text-black font-bold border-[2px] border-black px-3 py-1 bg-[#00FFFF] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <User className="h-4 w-4 text-black" />
                  <span>{user.name} <span className="uppercase tracking-wider ml-1">({user.role})</span></span>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-1.5 border-[2px] border-black text-sm font-bold text-white bg-[#FF3366] hover:bg-red-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] transition-all uppercase tracking-wider"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <div className="space-x-4 flex items-center">
                <Link to="/login" className="text-black font-bold hover:text-[#0000FF] transition-colors uppercase tracking-wider">Login</Link>
                <Link to="/register" className="px-4 py-2 border-[2px] border-black bg-[#FFEA00] text-[#0000FF] font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFD700] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] transition-all uppercase tracking-wider">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
