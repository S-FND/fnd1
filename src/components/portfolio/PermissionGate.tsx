import React from 'react';
import { usePortfolioAuth } from '@/hooks/usePortfolioAuth';
import { PortfolioRole } from '@/types/portfolio';

interface PermissionGateProps {
  children: React.ReactNode;
  resource?: string;
  action?: string;
  roles?: PortfolioRole[];
  fallback?: React.ReactNode;
  requireAll?: boolean; // If true, user must have ALL specified permissions/roles
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  resource,
  action,
  roles,
  fallback = null,
  requireAll = false,
}) => {
  const { profile, checkPermission } = usePortfolioAuth();

  if (!profile) {
    return <>{fallback}</>;
  }

  let hasAccess = true;

  // Check role-based access
  if (roles && roles.length > 0) {
    const roleAccess = roles.includes(profile.role);
    if (requireAll) {
      hasAccess = hasAccess && roleAccess;
    } else {
      hasAccess = roleAccess;
    }
  }

  // Check permission-based access
  if (resource && action) {
    const permissionAccess = checkPermission(resource, action);
    if (requireAll) {
      hasAccess = hasAccess && permissionAccess;
    } else if (!roles || roles.length === 0) {
      // If no roles specified, use permission access
      hasAccess = permissionAccess;
    }
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};