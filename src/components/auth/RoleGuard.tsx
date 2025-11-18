import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface RoleGuardProps {
  role: 'admin' | 'super_admin' | 'manager' | 'user';
  children: React.ReactNode;
}

const RoleGuard = ({ role, children }: RoleGuardProps) => {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAccess();
  }, [role]);

  const checkAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      // Check user role from user_roles table
      const { data: userRole, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error || !userRole) {
        navigate('/');
        return;
      }

      // Check if user has required role
      const roleHierarchy = ['user', 'manager', 'admin', 'super_admin'];
      const userRoleLevel = roleHierarchy.indexOf(userRole.role);
      const requiredRoleLevel = roleHierarchy.indexOf(role);

      if (userRoleLevel >= requiredRoleLevel) {
        setHasAccess(true);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error checking access:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
};

export default RoleGuard;
