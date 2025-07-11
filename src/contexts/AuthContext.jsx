import React, { createContext, useContext, useState, useEffect } from 'react';

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
    // Check for stored user session
    const storedUser = localStorage.getItem('busybites_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const signup = async (credentials) => {
    try {
      // Simulate API call
      const newUser = {
        id: Date.now().toString(),
        email: credentials.email,
        name: credentials.name,
        avatar: null,
        preferences: {
          dietaryRestrictions: [],
          skillLevel: 'beginner',
          cookingTime: 30,
        },
        createdAt: new Date().toISOString(),
      };

      setUser(newUser);
      localStorage.setItem('busybites_user', JSON.stringify(newUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = async (credentials) => {
    try {
      // Simulate API call
      const mockUser = {
        id: '1',
        email: credentials.email,
        name: 'John Doe',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        preferences: {
          dietaryRestrictions: [],
          skillLevel: 'intermediate',
          cookingTime: 30,
        },
        createdAt: new Date().toISOString(),
      };

      setUser(mockUser);
      localStorage.setItem('busybites_user', JSON.stringify(mockUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('busybites_user');
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('busybites_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isLoading,
    signup, // Added signup function
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