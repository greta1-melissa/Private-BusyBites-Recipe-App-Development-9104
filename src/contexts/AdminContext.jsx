import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 1247,
    totalRecipes: 89,
    totalViews: 15632,
    activeUsers: 342,
  });

  useEffect(() => {
    // Check for stored admin session
    const storedAdmin = localStorage.getItem('busybites_admin');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
    setIsLoading(false);
  }, []);

  const loginAdmin = async (credentials) => {
    try {
      // Updated admin authentication to use email instead of username
      if (credentials.email === 'admin@busybites.com' && credentials.password === 'admin123') {
        const mockAdmin = {
          id: 'admin-1',
          email: 'admin@busybites.com',
          name: 'BusyBites Admin',
          role: 'super_admin',
          permissions: ['all'],
          lastLogin: new Date().toISOString(),
        };
        setAdmin(mockAdmin);
        localStorage.setItem('busybites_admin', JSON.stringify(mockAdmin));
        return { success: true };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem('busybites_admin');
  };

  const updateStats = (newStats) => {
    setStats(prevStats => ({
      ...prevStats,
      ...newStats
    }));
  };

  const value = {
    admin,
    isLoading,
    stats,
    loginAdmin,
    logoutAdmin,
    updateStats,
    isAuthenticated: !!admin,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};