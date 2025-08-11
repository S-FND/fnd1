import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { UserProfile, PortfolioRole, RolePermission } from '@/types/portfolio';
import { toast } from 'sonner';

interface PortfolioAuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  permissions: RolePermission[];
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function usePortfolioAuth() {
  const [state, setState] = useState<PortfolioAuthState>({
    user: null,
    session: null,
    profile: null,
    permissions: [],
    isLoading: true,
    isAuthenticated: false,
  });
  
  const navigate = useNavigate();

  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          portfolio_company:portfolio_companies(*)
        `)
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return profile as UserProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }, []);

  const fetchPermissions = useCallback(async (role: PortfolioRole) => {
    try {
      const { data: permissions, error } = await supabase
        .from('role_permissions')
        .select('*')
        .eq('role', role);

      if (error) {
        console.error('Error fetching permissions:', error);
        return [];
      }

      return permissions as RolePermission[];
    } catch (error) {
      console.error('Error fetching permissions:', error);
      return [];
    }
  }, []);

  const redirectToDashboard = useCallback((role: PortfolioRole) => {
    switch (role) {
      case 'portfolio_company_admin':
        navigate('/admin/dashboard');
        break;
      case 'portfolio_team_editor':
      case 'portfolio_team_viewer':
        navigate('/team/dashboard');
        break;
      case 'supplier':
        navigate('/supplier/dashboard');
        break;
      case 'stakeholder':
        navigate('/stakeholder/dashboard');
        break;
      case 'super_admin':
        navigate('/super-admin/dashboard');
        break;
      default:
        navigate('/dashboard');
    }
  }, [navigate]);

  const checkPermission = useCallback((resource: string, action: string): boolean => {
    if (!state.permissions.length) return false;
    
    // Check for wildcard permissions first
    const wildcardPermission = state.permissions.find(
      p => p.resource === '*' && p.action === '*' && p.granted
    );
    if (wildcardPermission) return true;

    // Check for specific resource with wildcard action
    const resourceWildcard = state.permissions.find(
      p => p.resource === resource && p.action === '*' && p.granted
    );
    if (resourceWildcard) return true;

    // Check for exact match
    const exactMatch = state.permissions.find(
      p => p.resource === resource && p.action === action && p.granted
    );
    return Boolean(exactMatch);
  }, [state.permissions]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      // Profile will be loaded in the auth state change handler
      return data;
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setState({
        user: null,
        session: null,
        profile: null,
        permissions: [],
        isLoading: false,
        isAuthenticated: false,
      });
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, [navigate]);

  const register = useCallback(async (
    email: string, 
    password: string, 
    inviteCode?: string,
    fullName?: string
  ) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            invite_code: inviteCode,
          }
        }
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      if (data.user && !data.session) {
        toast.success('Please check your email to confirm your account');
      }

      return data;
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          const permissions = profile ? await fetchPermissions(profile.role) : [];
          
          setState({
            user: session.user,
            session,
            profile,
            permissions,
            isLoading: false,
            isAuthenticated: true,
          });

          // Redirect new users based on role
          if (event === 'SIGNED_IN' && profile) {
            setTimeout(() => redirectToDashboard(profile.role), 0);
          }
        } else {
          setState({
            user: null,
            session: null,
            profile: null,
            permissions: [],
            isLoading: false,
            isAuthenticated: false,
          });
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id).then(profile => {
          const permissionsPromise = profile ? fetchPermissions(profile.role) : Promise.resolve([]);
          permissionsPromise.then(permissions => {
            setState({
              user: session.user,
              session,
              profile,
              permissions,
              isLoading: false,
              isAuthenticated: true,
            });
          });
        });
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserProfile, fetchPermissions, redirectToDashboard]);

  return {
    ...state,
    login,
    logout,
    register,
    checkPermission,
    redirectToDashboard,
  };
}