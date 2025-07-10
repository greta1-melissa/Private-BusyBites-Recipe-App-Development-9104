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

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchUserProfile(session.user);
      }
      setIsLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser) => {
    try {
      // First, try to get existing profile
      let { data: profile, error } = await supabase
        .from('user_profiles_bb2024')
        .select('*')
        .eq('id', authUser.id)
        .single();

      // If profile doesn't exist, create a basic one
      if (error && error.code === 'PGRST116') {
        console.log('Profile not found, creating a basic one...');
        
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles_bb2024')
          .insert({
            id: authUser.id,
            full_name: authUser.email.split('@')[0],
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          profile = null;
        } else {
          profile = newProfile;
          console.log('Basic profile created successfully');
        }
      } else if (error) {
        console.error('Error fetching profile:', error);
        profile = null;
      }

      const userData = {
        id: authUser.id,
        email: authUser.email,
        name: profile?.full_name || authUser.email.split('@')[0],
        avatar: profile?.avatar_url,
        preferences: {
          skillLevel: profile?.skill_level || 'intermediate',
          cookingTime: profile?.preferred_cooking_time || 30,
          dietaryRestrictions: profile?.dietary_restrictions || [],
          notifications: profile?.notifications_enabled ?? true,
          darkMode: profile?.dark_mode ?? false,
          language: profile?.language || 'en'
        },
        createdAt: profile?.created_at || authUser.created_at
      };

      setUser(userData);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      // Fallback user data
      setUser({
        id: authUser.id,
        email: authUser.email,
        name: authUser.email.split('@')[0],
        preferences: {
          skillLevel: 'intermediate',
          cookingTime: 30,
          dietaryRestrictions: [],
          notifications: true,
          darkMode: false,
          language: 'en'
        },
        createdAt: authUser.created_at
      });
    }
  };

  // Simplified signup - just create the account
  const signUp = async (userData) => {
    try {
      // Simple signup with just email and password
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.fullName || userData.email.split('@')[0]
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      return { success: true, data };
    } catch (error) {
      console.error('Sign up error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to create account. Please try again.' 
      };
    }
  };

  const login = async (credentials) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = async (updates) => {
    try {
      const { error } = await supabase
        .from('user_profiles_bb2024')
        .update({
          full_name: updates.name,
          avatar_url: updates.avatar,
          skill_level: updates.preferences?.skillLevel,
          preferred_cooking_time: updates.preferences?.cookingTime,
          dietary_restrictions: updates.preferences?.dietaryRestrictions,
          notifications_enabled: updates.preferences?.notifications,
          dark_mode: updates.preferences?.darkMode,
          language: updates.preferences?.language,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update local state
      setUser(prev => ({
        ...prev,
        ...updates,
        preferences: {
          ...prev.preferences,
          ...updates.preferences
        }
      }));

      return { success: true };
    } catch (error) {
      console.error('Update user error:', error);
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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};