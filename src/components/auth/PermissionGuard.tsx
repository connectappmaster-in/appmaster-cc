import { useAuth } from '@/contexts/AuthContext';
import { ReactNode } from 'react';

interface PermissionGuardProps {
  permission?: string;
  role?: string;
  fallback?: ReactNode;
  children: ReactNode;
}

const PermissionGuard = ({ permission, role, fallback = null, children }: PermissionGuardProps) => {
  const { hasPermission, hasRole } = useAuth();

  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  if (role && !hasRole(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default PermissionGuard;
