import { Navigate, useLocation } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const location = useLocation();
  const storedUser = localStorage.getItem('user');

  if (!storedUser) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const user = JSON.parse(storedUser);
  const rol = user.user?.rol?.toString().toLowerCase();
  const hasAccess = user.access && (rol === 'admin' || rol === 'administrador');

  if (!hasAccess) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
