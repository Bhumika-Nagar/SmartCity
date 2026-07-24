import { createContext, useContext, useState, useCallback } from 'react';
import { loginUser, registerUser } from '../api/auth';
import { ROLES } from '../utils/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const persist = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const register = useCallback(async (payload) => {
    setLoading(true);
    setError('');
    try {
      const { token, user } = await registerUser(payload);
      persist(token, user);
      return user;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (payload, { requireRole } = {}) => {
    setLoading(true);
    setError('');
    try {
      const { token, user } = await loginUser(payload);
      if (requireRole && user.role !== requireRole) {
        throw new Error(
          requireRole === ROLES.ADMIN
            ? 'This account is not a department admin account.'
            : 'Please use the admin login for department accounts.'
        );
      }
      persist(token, user);
      return user;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
