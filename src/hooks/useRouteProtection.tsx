
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function useRouteProtection(requiredRole?: string | string[]) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: location.pathname } });
    } else if (!isLoading && isAuthenticated && requiredRole) {
      // Check for role-based access if required
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      const hasAccess = roles.includes(user?.role || '');

      if (!hasAccess) {
        // Redirect to appropriate dashboard based on role if user doesn't have required role
        if (user?.role === 'supplier') {
          navigate('/supplier/dashboard');
        } else if (user?.role === 'vendor') {
          navigate('/vendor/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    }
  }, [isAuthenticated, isLoading, navigate, location, requiredRole, user]);

  return { isLoading, isAuthenticated, user };
}
