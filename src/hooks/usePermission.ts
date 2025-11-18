import { useAuth } from '@/contexts/AuthContext';

export const usePermission = (permission: string) => {
  const { hasPermission } = useAuth();
  return hasPermission(permission);
};

export const useRole = (role: string) => {
  const { hasRole } = useAuth();
  return hasRole(role);
};
