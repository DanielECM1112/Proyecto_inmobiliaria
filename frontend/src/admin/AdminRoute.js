import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        navigate('/admin/login');
        return;
      }

      try {
        const user = JSON.parse(userStr);
        // Asegurarse de que el usuario tenga rol de admin
        const rol = user?.rol?.toString().toLowerCase();
        const isAdmin = rol === 'admin' || rol === 'administrador' || user?.is_staff;
        
        if (!isAdmin) {
          navigate('/admin/login');
          return;
        }
        
        setIsAuthorized(true);
      } catch (e) {
        console.error('Error parsing user:', e);
        navigate('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070708] flex items-center justify-center">
        <div className="text-[#b38b1d] text-2xl">Cargando...</div>
      </div>
    );
  }

  return isAuthorized ? children : null;
}
