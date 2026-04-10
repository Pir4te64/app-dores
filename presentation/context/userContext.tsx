import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { User } from '~/domain/entities/userEntity';
import { supabase } from '~/infrastructure/supabase/client';

interface UserContextType {
  user: User | null;
  loadingUser: boolean;
  error: Error | null;
  login: (loginData: { email: string; password: string }) => Promise<void>;
  register: (userData: { firstName: string; lastName: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  fetchUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

function mapSupabaseUser(supabaseUser: any): User {
  const meta = supabaseUser.user_metadata || {};
  return new User({
    id: 0,
    idUser: 0,
    email: supabaseUser.email || '',
    dni: null,
    role: ['USER'],
    firstName: meta.first_name || meta.firstName || supabaseUser.email?.split('@')[0] || '',
    lastName: meta.last_name || meta.lastName || '',
    numberPhone: meta.phone || null,
    positiveBalance: 0,
    imageProfile: meta.avatar_url || null,
    percentageCompleted: 100,
    kyc: true,
    address: {
      id: 0,
      title: '',
      streets: '',
      floor: null,
      reference: null,
      latitude: '',
      longitude: '',
      isDefault: true,
    },
  } as unknown as User);
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserData = async () => {
    try {
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      if (supabaseUser) {
        setUser(mapSupabaseUser(supabaseUser));
      } else {
        setUser(null);
      }
    } catch (err) {
      setError(err as Error);
    }
  };

  const login = async (loginData: { email: string; password: string }) => {
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (authError) {
        const err = new Error(authError.message);
        setError(err);
        throw err;
      }

      if (data.user) {
        setUser(mapSupabaseUser(data.user));
      }
    } catch (err) {
      throw err;
    }
  };

  const register = async (userData: { firstName: string; lastName: string; email: string; password: string }) => {
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
          },
        },
      });

      if (authError) {
        const err = new Error(authError.message);
        setError(err);
        throw err;
      }

      if (data.user) {
        setUser(mapSupabaseUser(data.user));
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  useEffect(() => {
    // Check initial session
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(mapSupabaseUser(session.user));
        }
      } catch (err) {
        console.error('Error initializing session:', err);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loadingUser: loading,
        error,
        login,
        register,
        logout,
        fetchUserData,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
