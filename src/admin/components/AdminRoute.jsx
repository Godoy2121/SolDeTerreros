import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.email !== ADMIN_EMAIL) return <Navigate to="/admin/login" replace />;
  return children;
}
