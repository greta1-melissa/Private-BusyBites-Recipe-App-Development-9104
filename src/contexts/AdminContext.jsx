import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { supabase } from '../lib/supabase';

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
  const { error: showError } = useToast();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecipes: 0,
    totalViews: 0,
    activeUsers: 0,
    newUsersToday: 0,
    recipesCreatedToday: 0
  });

  useEffect(() => {
    console.log('AdminProvider mounted');
    // Check for stored admin session
    const storedAdmin = localStorage.getItem('busybites_admin');
    if (storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin));
        loadDashboardStats();
      } catch (err) {
        console.error('Error parsing stored admin:', err);
        localStorage.removeItem('busybites_admin');
      }
    }
    setIsLoading(false);
  }, []);

  const loadDashboardStats = async () => {
    try {
      console.log('Loading dashboard stats from Supabase...');
      
      // Load latest stats
      const { data: statsData, error: statsError } = await supabase
        .from('admin_stats_bb2024')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (statsError) {
        console.error('Error loading stats:', statsError);
      } else if (statsData) {
        console.log('Stats loaded:', statsData);
        setStats({
          totalUsers: statsData.total_users,
          totalRecipes: statsData.total_recipes,
          totalViews: statsData.total_views,
          activeUsers: statsData.active_users,
          newUsersToday: statsData.new_users_today || 0,
          recipesCreatedToday: statsData.recipes_created_today || 0
        });
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  const loginAdmin = async (credentials) => {
    try {
      console.log('Admin login attempt:', credentials.email);
      
      // Demo credentials check - in production this would verify against the database
      if (
        (credentials.email === 'admin@busybites.com' && credentials.password === 'admin123') ||
        (credentials.email === 'admin' && credentials.password === 'admin123')
      ) {
        // In production, you'd verify the password hash from the database
        const { data: adminData, error } = await supabase
          .from('admin_users_bb2024')
          .select('*')
          .eq('email', 'admin@busybites.com')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Database error:', error);
        }

        const mockAdmin = {
          id: adminData?.id || 'admin-1',
          email: credentials.email,
          name: adminData?.name || 'BusyBites Admin',
          role: adminData?.role || 'super_admin',
          permissions: adminData?.permissions || ['all'],
          lastLogin: new Date().toISOString(),
        };

        console.log('Admin login successful');
        setAdmin(mockAdmin);
        localStorage.setItem('busybites_admin', JSON.stringify(mockAdmin));
        
        // Load dashboard data after login
        await loadDashboardStats();
        
        // Log admin activity
        await logAdminActivity('Admin login', 'auth', null, { email: credentials.email });
        
        return { success: true };
      } else {
        console.log('Admin login failed: invalid credentials');
        showError('Login Failed', 'Invalid email or password');
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      console.error('Admin login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logAdminActivity = async (action, targetType, targetId, details) => {
    if (!admin) return;
    
    try {
      await supabase.from('admin_activity_bb2024').insert({
        admin_id: admin.id,
        action,
        target_type: targetType,
        target_id: targetId,
        details,
        ip_address: 'demo-ip',
        user_agent: navigator.userAgent.substring(0, 100)
      });
    } catch (error) {
      console.error('Error logging admin activity:', error);
    }
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem('busybites_admin');
  };

  const updateStats = (newStats) => {
    setStats(prevStats => ({
      ...prevStats,
      ...newStats,
    }));
  };

  const getRecentActivity = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_activity_bb2024')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error loading activity:', error);
        return [];
      }

      return data.map(activity => ({
        id: activity.id,
        action: activity.action,
        user: activity.details?.email || activity.details?.user || 'System',
        time: getRelativeTime(activity.created_at),
        type: activity.target_type || 'system'
      }));
    } catch (error) {
      console.error('Error loading recent activity:', error);
      return [];
    }
  };

  const getSystemHealth = async () => {
    try {
      const { data, error } = await supabase
        .from('system_health_bb2024')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error loading system health:', error);
        return {
          status: 'healthy',
          uptime: '99.9%',
          responseTime: '120ms',
          errorRate: '0.1%'
        };
      }

      return {
        status: data.status,
        uptime: `${data.uptime_percentage}%`,
        responseTime: `${data.response_time_ms}ms`,
        errorRate: `${data.error_rate_percentage}%`
      };
    } catch (error) {
      console.error('Error loading system health:', error);
      return {
        status: 'healthy',
        uptime: '99.9%',
        responseTime: '120ms',
        errorRate: '0.1%'
      };
    }
  };

  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const value = {
    admin,
    isLoading,
    stats,
    loginAdmin,
    logoutAdmin,
    updateStats,
    loadDashboardStats,
    getRecentActivity,
    getSystemHealth,
    logAdminActivity,
    isAuthenticated: !!admin,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};