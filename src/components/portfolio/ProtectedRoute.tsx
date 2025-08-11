import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePortfolioAuth } from '@/hooks/usePortfolioAuth';
import { PortfolioRole } from '@/types/portfolio';
import { UnauthorizedPage } from './UnauthorizedPage';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: PortfolioRole[];
  requiredResource?: string;
  requiredAction?: string;
  requireAll?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
  requiredResource,
  requiredAction,
  requireAll = false,
}) => {
  const { 
    isLoading, 
    isAuthenticated, 
    profile, 
    checkPermission 
  } = usePortfolioAuth();
  const location = useLocation();

  // Log unauthorized access attempts
  useEffect(() => {
    if (!isLoading && isAuthenticated && profile) {
      let hasAccess = true;

      // Check role-based access
      if (requiredRoles && requiredRoles.length > 0) {
        const roleAccess = requiredRoles.includes(profile.role);
        if (requireAll) {
          hasAccess = hasAccess && roleAccess;
        } else {
          hasAccess = roleAccess;
        }
      }

      // Check permission-based access
      if (requiredResource && requiredAction) {
        const permissionAccess = checkPermission(requiredResource, requiredAction);
        if (requireAll) {
          hasAccess = hasAccess && permissionAccess;
        } else if (!requiredRoles || requiredRoles.length === 0) {
          hasAccess = permissionAccess;
        }
      }

      // Log unauthorized access attempt
      if (!hasAccess) {
        supabase.from('audit_logs').insert({
          portfolio_company_id: profile.portfolio_company_id,
          user_id: profile.user_id,
          action: 'UNAUTHORIZED_ACCESS',
          entity_type: 'route',
          entity_id: null,
          new_data: {
            path: location.pathname,
            required_roles: requiredRoles,
            required_resource: requiredResource,
            required_action: requiredAction,
            user_role: profile.role,
          }
        }).then(({ error }) => {
          if (error) {
            console.error('Failed to log unauthorized access:', error);
          }
        });
      }
    }
  }, [
    isLoading, 
    isAuthenticated, 
    profile, 
    location.pathname, 
    requiredRoles, 
    requiredResource, 
    requiredAction, 
    requireAll, 
    checkPermission
  ]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!profile) {
    return (
      <UnauthorizedPage 
        message="User profile not found. Please contact your administrator."
        showGoBack={false}
      />
    );
  }

  // Check if user is active and approved
  if (!profile.is_active) {
    return (
      <UnauthorizedPage 
        message="Your account has been deactivated. Please contact your administrator."
        showGoBack={false}
      />
    );
  }

  // Check if user needs approval (for suppliers/stakeholders)
  if (['supplier', 'stakeholder'].includes(profile.role) && !profile.approved_at) {
    return (
      <UnauthorizedPage 
        message="Your account is pending approval. You will receive an email once approved."
        showGoBack={false}
      />
    );
  }

  let hasAccess = true;

  // Check role-based access
  if (requiredRoles && requiredRoles.length > 0) {
    const roleAccess = requiredRoles.includes(profile.role);
    if (requireAll) {
      hasAccess = hasAccess && roleAccess;
    } else {
      hasAccess = roleAccess;
    }
  }

  // Check permission-based access
  if (requiredResource && requiredAction) {
    const permissionAccess = checkPermission(requiredResource, requiredAction);
    if (requireAll) {
      hasAccess = hasAccess && permissionAccess;
    } else if (!requiredRoles || requiredRoles.length === 0) {
      hasAccess = permissionAccess;
    }
  }

  if (!hasAccess) {
    return <UnauthorizedPage />;
  }

  return <>{children}</>;
};