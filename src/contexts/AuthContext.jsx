import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  
  // Debug flag
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    console.log('AuthProvider mounted');
    
    // Get initial session
    const getSession = async () => {
      try {
        console.log('Getting initial session...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session fetch error:', error);
          setAuthError(error);
          setDebugInfo(prev => ({ ...prev, sessionError: error }));
        } else if (data?.session?.user) {
          console.log('Session found:', data.session.user.email);
          setUser({
            id: data.session.user.id,
            email: data.session.user.email,
            name: data.session.user.email.split('@')[0],
            createdAt: data.session.user.created_at
          });
          setDebugInfo(prev => ({ ...prev, session: 'Active', user: data.session.user.email }));
        } else {
          console.log('No active session found');
          setDebugInfo(prev => ({ ...prev, session: 'None' }));
        }
      } catch (error) {
        console.error('Session error:', error);
        setAuthError(error);
        setDebugInfo(prev => ({ ...prev, sessionCatchError: error.message }));
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event);
        setDebugInfo(prev => ({ ...prev, lastAuthEvent: event }));
        
        try {
          if (session?.user) {
            console.log('User authenticated:', session.user.email);
            setUser({
              id: session.user.id,
              email: session.user.email,
              name: session.user.email.split('@')[0],
              createdAt: session.user.created_at
            });
          } else {
            console.log('User signed out');
            setUser(null);
          }
        } catch (error) {
          console.error('Auth state change error:', error);
          setAuthError(error);
          setDebugInfo(prev => ({ ...prev, authStateChangeError: error.message }));
        } finally {
          setIsLoading(false);
        }
      }
    );

    return () => {
      console.log('Unsubscribing from auth changes');
      subscription.unsubscribe();
    };
  }, []);

  // Simplified signup with better error handling
  const signUp = async (userData) => {
    setDebugInfo(prev => ({ ...prev, signUpAttempt: userData.email }));
    console.log('Attempting signup for:', userData.email);
    
    try {
      // Clear any previous errors
      setAuthError(null);
      
      // Attempt signup with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.email.split('@')[0]
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        setDebugInfo(prev => ({ ...prev, signUpError: error.message }));
        return { success: false, error: error.message };
      }
      
      if (data?.user) {
        console.log('Signup successful:', data.user.email);
        setDebugInfo(prev => ({ ...prev, signUpSuccess: true, userId: data.user.id }));
        return { success: true, data };
      } else {
        console.log('Signup returned no user:', data);
        setDebugInfo(prev => ({ ...prev, signUpNoUser: true, data }));
        return { success: false, error: 'Signup failed with no error' };
      }
    } catch (error) {
      console.error('Sign up exception:', error);
      setDebugInfo(prev => ({ ...prev, signUpException: error.message }));
      return { 
        success: false, 
        error: error.message || 'An unexpected error occurred during signup' 
      };
    }
  };

  const login = async (credentials) => {
    setDebugInfo(prev => ({ ...prev, loginAttempt: credentials.email }));
    console.log('Attempting login for:', credentials.email);
    
    try {
      // Clear any previous errors
      setAuthError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        console.error('Login error:', error);
        setDebugInfo(prev => ({ ...prev, loginError: error.message }));
        return { success: false, error: error.message };
      }

      if (data?.session) {
        console.log('Login successful');
        setDebugInfo(prev => ({ ...prev, loginSuccess: true }));
        return { success: true, data };
      } else {
        console.log('Login returned no session:', data);
        setDebugInfo(prev => ({ ...prev, loginNoSession: true, data }));
        return { success: false, error: 'Login failed with no error' };
      }
    } catch (error) {
      console.error('Login exception:', error);
      setDebugInfo(prev => ({ ...prev, loginException: error.message }));
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    console.log('Attempting logout');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        setAuthError(error);
        setDebugInfo(prev => ({ ...prev, logoutError: error.message }));
      } else {
        console.log('Logout successful');
        setUser(null);
        setDebugInfo(prev => ({ ...prev, logoutSuccess: true }));
      }
    } catch (error) {
      console.error('Logout exception:', error);
      setAuthError(error);
      setDebugInfo(prev => ({ ...prev, logoutException: error.message }));
    }
  };

  // Simplified updateUser
  const updateUser = async (updates) => {
    try {
      console.log('Updating user:', updates);
      // Only update local state
      setUser(prev => ({
        ...prev,
        ...updates
      }));
      setDebugInfo(prev => ({ ...prev, userUpdated: true }));
      return { success: true };
    } catch (error) {
      console.error('Update user error:', error);
      setDebugInfo(prev => ({ ...prev, updateUserError: error.message }));
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isLoading,
    signUp,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    authError,
    debugInfo, // Expose debug info
    clearDebugInfo: () => setDebugInfo({}),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};