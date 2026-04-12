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
      <nav className="bg-surface border-b border-slate-100 z-50 sticky top-0">
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

            <div className="flex items-center space-x-6">
              {user ? (
                  <>
                    <div className="hidden md:flex items-center space-x-3 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-700 leading-none">{user.name}</span>
                        <span className="text-[10px] font-medium text-primary uppercase tracking-wider mt-1">{user.role}</span>
                      </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-danger hover:bg-danger/5 rounded-full transition-all duration-200"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </>
              ) : (
                  <div className="flex items-center space-x-4">
                    <Link to="/login" className="text-slate-600 font-semibold hover:text-primary transition-colors">Login</Link>
                    <Link to="/register" className="btn-primary">Get Started</Link>
                  </div>
              )}
            </div>
          </div>
        </div>
      </nav>
  );
};