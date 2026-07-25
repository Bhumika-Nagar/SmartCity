import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';
import NotificationBell from './NotificationBell';
import { classNames } from '../utils/helpers';

const linkClass = ({ isActive }) =>
  classNames(
    'text-sm font-medium px-3 py-2 rounded-full transition-colors',
    isActive ? 'bg-signal text-white' : 'text-inkmuted hover:text-ink'
  );

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 bg-concrete/90 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-signal flex items-center justify-center text-white font-display font-bold text-sm">
            CS
          </span>
          <span className="font-display font-bold text-lg tracking-tight text-ink">CivicSignal</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {user?.role === ROLES.CITIZEN && (
            <>
              <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
              <NavLink to="/complaints" className={linkClass}>Complaints</NavLink>
              <NavLink to="/complaints/new" className={linkClass}>New Complaint</NavLink>
              <NavLink to="/profile" className={linkClass}>Profile</NavLink>
            </>
          )}
          {user?.role === ROLES.ADMIN && (
            <>
              <NavLink to="/admin/dashboard" className={linkClass}>{user.department} Dashboard</NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user?.role === ROLES.CITIZEN && <NotificationBell />}
          {user ? (
            <button
              onClick={handleLogout}
              className="text-sm font-medium px-4 py-2 rounded-full border border-line hover:border-signal transition-colors"
            >
              Log out
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-sm font-medium px-4 py-2 rounded-full hover:text-signal transition-colors">
                Log in
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium px-4 py-2 rounded-full bg-signal text-white hover:bg-signal-dark transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
