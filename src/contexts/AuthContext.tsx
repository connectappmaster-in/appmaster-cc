import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Organisation {
  id: string;
  name: string;
  plan: string;
  active_tools: string[];
  logo_url?: string;
}

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: string;
  organisation_id: string;
  status: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  organisation: Organisation | null;
  permissions: string[];
  loading: boolean;
  refreshAuth: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [organisation, setOrganisation] = useState<Organisation | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUserData = async (userId: string) => {
    try {
      // Load user profile
      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', userId)
        .single();

      if (userProfile) {
        setProfile(userProfile);

        // Load organisation
        const { data: org } = await supabase
          .from('organisations')
          .select('*')
          .eq('id', userProfile.organisation_id)
          .single();

        if (org) {
          setOrganisation(org);
        }

        // Load permissions
        const { data: userPerms } = await supabase
          .from('user_permissions')
          .select('permission_id, permissions(key)')
          .eq('user_id', userProfile.id);

        const { data: rolePerms } = await supabase
          .from('roles')
          .select(`
            role_permissions(
              permissions(key)
            )
          `)
          .eq('organisation_id', userProfile.organisation_id)
          .eq('role_name', userProfile.role);

        const allPermissions = new Set<string>();
        
        // Add user-specific permissions
        userPerms?.forEach((p: any) => {
          if (p.permissions?.key) allPermissions.add(p.permissions.key);
        });

        // Add role permissions
        rolePerms?.forEach((role: any) => {
          role.role_permissions?.forEach((rp: any) => {
            if (rp.permissions?.key) allPermissions.add(rp.permissions.key);
          });
        });

        setPermissions(Array.from(allPermissions));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const refreshAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      setSession(session);
      await loadUserData(session.user.id);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Initial session check
    refreshAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer data loading to avoid blocking
          setTimeout(() => {
            loadUserData(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setOrganisation(null);
          setPermissions([]);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const hasPermission = (permission: string) => {
    return permissions.includes(permission);
  };

  const hasRole = (role: string) => {
    return profile?.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        organisation,
        permissions,
        loading,
        refreshAuth,
        hasPermission,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
