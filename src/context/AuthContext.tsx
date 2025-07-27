import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  isAnnouncementAdmin: boolean;
  isFullAdmin: boolean;
  login: (email: string, password: string, accessLevel: 'announcement_admin' | 'full_admin') => Promise<boolean>;
  logout: () => Promise<void>;
  userEmail: string | null;
  user: User | null;
  loading: boolean;
  userRole: 'guest' | 'announcement_admin' | 'full_admin';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Define user roles and permissions
const USER_CREDENTIALS = {
  ANNOUNCEMENT_ADMIN: {
    email: 'digcusheringdepartment@gmail.com',
    password: '08037812417',
    role: 'announcement_admin' as const,
    permissions: ['announcements']
  },
  FULL_ADMIN: {
    email: 'elishaejimofor@gmail.com',
    password: 'Murphine2408',
    role: 'full_admin' as const,
    permissions: ['announcements', 'finance', 'members', 'reports', 'all']
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAnnouncementAdmin, setIsAnnouncementAdmin] = useState(false);
  const [isFullAdmin, setIsFullAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'guest' | 'announcement_admin' | 'full_admin'>('guest');

  useEffect(() => {
    // Check for existing session
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      setLoading(true);
      
      // Check localStorage for saved session
      const savedSession = localStorage.getItem('digc_auth_session');
      if (savedSession) {
        const sessionData = JSON.parse(savedSession);
        const { email, role, timestamp } = sessionData;
        
        // Check if session is still valid (24 hours)
        const isSessionValid = Date.now() - timestamp < 24 * 60 * 60 * 1000;
        
        if (isSessionValid) {
          setUserEmail(email);
          setUserRole(role);
          setIsAuthenticated(true);
          
          if (role === 'announcement_admin') {
            setIsAnnouncementAdmin(true);
            setIsFullAdmin(false);
          } else if (role === 'full_admin') {
            setIsAnnouncementAdmin(true);
            setIsFullAdmin(true);
          }
        } else {
          // Session expired, clear it
          localStorage.removeItem('digc_auth_session');
        }
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, accessLevel: 'announcement_admin' | 'full_admin'): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Check against predefined users based on access level
      let isValidCredentials = false;
      let userRole: 'announcement_admin' | 'full_admin' | null = null;
      
      if (accessLevel === 'announcement_admin') {
        const announcementAdmin = USER_CREDENTIALS.ANNOUNCEMENT_ADMIN;
        if (email === announcementAdmin.email && password === announcementAdmin.password) {
          isValidCredentials = true;
          userRole = 'announcement_admin';
        }
      } else if (accessLevel === 'full_admin') {
        const fullAdmin = USER_CREDENTIALS.FULL_ADMIN;
        if (email === fullAdmin.email && password === fullAdmin.password) {
          isValidCredentials = true;
          userRole = 'full_admin';
        }
      }
      
      if (isValidCredentials && userRole) {
        // Create session
        const sessionData = {
          email,
          role: userRole,
          timestamp: Date.now()
        };
        
        localStorage.setItem('digc_auth_session', JSON.stringify(sessionData));
        
        setUser({ email } as User);
        setIsAuthenticated(true);
        setUserEmail(email);
        setUserRole(userRole);
        
        if (userRole === 'announcement_admin') {
          setIsAnnouncementAdmin(true);
          setIsFullAdmin(false);
        } else if (userRole === 'full_admin') {
          setIsAnnouncementAdmin(true);
          setIsFullAdmin(true);
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Clear localStorage
      localStorage.removeItem('digc_auth_session');
      
      // Reset state
      setUser(null);
      setIsAuthenticated(false);
      setIsAnnouncementAdmin(false);
      setIsFullAdmin(false);
      setUserEmail(null);
      setUserRole('guest');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isAnnouncementAdmin,
      isFullAdmin,
      login, 
      logout, 
      userEmail, 
      user, 
      loading,
      userRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};