import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';

export default function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/admin/login" replace />;
  if (user.role !== ROLES.ADMIN) return <Navigate to="/dashboard" replace />;
  return children;
}
