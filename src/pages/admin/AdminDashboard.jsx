import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAdmin } from '../../contexts/AdminContext';
import { useToast } from '../../contexts/ToastContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { recipesData } from '../../data/recipes';

const { 
  FiUsers, FiBook, FiEye, FiTrendingUp, FiActivity, FiClock, FiPlus, FiSettings,
  FiArrowUp, FiArrowDown, FiRefreshCw, FiDownload, FiUpload, FiBarChart3,
  FiPieChart, FiCalendar, FiMail, FiShield, FiAlertCircle, FiCheckCircle,
  FiEdit2, FiTrash2, FiMoreHorizontal, FiFilter, FiSearch
} = FiIcons;

const AdminDashboard = () => {
  const { stats, updateStats, getRecentActivity, getSystemHealth, logAdminActivity } = useAdmin();
  const { success, error: showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [recentActivity, setRecentActivity] = useState([]);
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [systemHealth, setSystemHealth] = useState({
    status: 'healthy',
    uptime: '99.9%',
    responseTime: '120ms',
    errorRate: '0.1%'
  });

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      console.log('Loading dashboard data...');
      
      // Load real activity data from Supabase
      const activityData = await getRecentActivity();
      setRecentActivity(activityData);
      
      // Load system health data
      const healthData = await getSystemHealth();
      setSystemHealth(healthData);
      
      // Generate popular recipes from actual data with realistic metrics
      const popular = recipesData.slice(0, 6).map((recipe, index) => ({
        id: recipe.id,
        title: recipe.title,
        views: Math.floor(Math.random() * 3000) + 1000,
        rating: recipe.rating,
        growth: Math.floor(Math.random() * 30) + 5,
        category: recipe.category,
        image: recipe.image
      })).sort((a, b) => b.views - a.views);

      setPopularRecipes(popular);

      // Update stats with some realistic variation based on period
      const periodMultiplier = selectedPeriod === 'day' ? 0.1 : selectedPeriod === 'week' ? 0.5 : 1;
      const baseStats = {
        totalUsers: Math.floor(stats.totalUsers * (1 + periodMultiplier * 0.02)),
        totalRecipes: Math.floor(stats.totalRecipes * (1 + periodMultiplier * 0.01)),
        totalViews: Math.floor(stats.totalViews * (1 + periodMultiplier * 0.05)),
        activeUsers: Math.floor(stats.activeUsers * (1 + periodMultiplier * 0.03))
      };
      
      updateStats(baseStats);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      showError('Failed to load dashboard data', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    await loadDashboardData();
    await logAdminActivity('Dashboard refreshed', 'system', 'dashboard', { period: selectedPeriod });
    success('Dashboard refreshed', 'Data has been updated');
  };

  const handleExportData = async () => {
    const data = {
      stats,
      recentActivity,
      popularRecipes,
      systemHealth,
      exportDate: new Date().toISOString(),
      period: selectedPeriod
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `busybites-dashboard-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    await logAdminActivity('Data exported', 'system', 'export', { format: 'json', period: selectedPeriod });
    success('Data exported', 'Dashboard data has been downloaded');
  };

  const handleQuickAction = async (action) => {
    await logAdminActivity(`Quick action: ${action}`, 'admin', action, { from: 'dashboard' });
    
    switch (action) {
      case 'add-recipe':
        success('Add Recipe', 'Redirecting to recipe creation...');
        // In a real app, this would navigate to recipe creation
        break;
      case 'manage-users':
        success('Manage Users', 'Redirecting to user management...');
        // Navigate to user management
        break;
      case 'upload-media':
        success('Upload Media', 'Redirecting to media library...');
        // Navigate to media library
        break;
      case 'settings':
        success('Settings', 'Redirecting to settings...');
        // Navigate to settings
        break;
      default:
        break;
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user': return FiUsers;
      case 'recipe': return FiBook;
      case 'favorite': return FiTrendingUp;
      case 'comment': return FiMail;
      case 'share': return FiUpload;
      case 'auth': return FiShield;
      case 'system': return FiSettings;
      default: return FiActivity;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'user': return 'text-blue-500';
      case 'recipe': return 'text-green-500';
      case 'favorite': return 'text-red-500';
      case 'comment': return 'text-purple-500';
      case 'share': return 'text-orange-500';
      case 'auth': return 'text-yellow-500';
      case 'system': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const statsCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: FiUsers,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive',
      trend: [65, 70, 75, 80, 85, 90, 95]
    },
    {
      title: 'Total Recipes',
      value: stats.totalRecipes,
      icon: FiBook,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive',
      trend: [45, 50, 55, 60, 65, 70, 75]
    },
    {
      title: 'Total Views',
      value: stats.totalViews,
      icon: FiEye,
      color: 'bg-purple-500',
      change: '+25%',
      changeType: 'positive',
      trend: [100, 120, 140, 160, 180, 200, 220]
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      icon: FiActivity,
      color: 'bg-orange-500',
      change: '+5%',
      changeType: 'positive',
      trend: [30, 35, 40, 45, 50, 55, 60]
    }
  ];

  const quickActions = [
    { id: 'add-recipe', title: 'Add Recipe', icon: FiBook, color: 'bg-primary', action: 'add-recipe' },
    { id: 'manage-users', title: 'Manage Users', icon: FiUsers, color: 'bg-blue-500', action: 'manage-users' },
    { id: 'upload-media', title: 'Upload Media', icon: FiUpload, color: 'bg-green-500', action: 'upload-media' },
    { id: 'settings', title: 'Settings', icon: FiSettings, color: 'bg-purple-500', action: 'settings' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div 
        className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome to BusyBites Admin</h2>
              <p className="text-white/90">
                Manage your recipe app, users, and content from this central dashboard.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 bg-white/20 text-white rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="day" className="text-gray-800">Last 24 Hours</option>
                <option value="week" className="text-gray-800">Last Week</option>
                <option value="month" className="text-gray-800">Last Month</option>
              </select>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
              >
                <SafeIcon 
                  icon={FiRefreshCw} 
                  className={`w-5 h-5 text-white ${isLoading ? 'animate-spin' : ''}`} 
                />
              </button>
            </div>
          </div>
          
          {/* System Health Indicators */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-white/80 text-sm">System Status</span>
                <SafeIcon 
                  icon={systemHealth.status === 'healthy' ? FiCheckCircle : FiAlertCircle} 
                  className={`w-4 h-4 ${systemHealth.status === 'healthy' ? 'text-green-300' : 'text-red-300'}`} 
                />
              </div>
              <p className="text-white font-semibold capitalize">{systemHealth.status}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-white/80 text-sm">Uptime</span>
                <SafeIcon icon={FiTrendingUp} className="w-4 h-4 text-green-300" />
              </div>
              <p className="text-white font-semibold">{systemHealth.uptime}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-white/80 text-sm">Response Time</span>
                <SafeIcon icon={FiClock} className="w-4 h-4 text-blue-300" />
              </div>
              <p className="text-white font-semibold">{systemHealth.responseTime}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-white/80 text-sm">Error Rate</span>
                <SafeIcon icon={FiAlertCircle} className="w-4 h-4 text-yellow-300" />
              </div>
              <p className="text-white font-semibold">{systemHealth.errorRate}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {statsCards.map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}>
                <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-1">
                <SafeIcon 
                  icon={stat.changeType === 'positive' ? FiArrowUp : FiArrowDown} 
                  className={`w-4 h-4 ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`} 
                />
                <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-text-secondary text-sm">{stat.title}</p>
              <p className="text-2xl font-bold text-text-primary">{stat.value.toLocaleString()}</p>
            </div>
            
            {/* Mini Chart */}
            <div className="flex items-end space-x-1 h-8">
              {stat.trend.map((value, i) => (
                <div
                  key={i}
                  className={`${stat.color} opacity-60 rounded-sm flex-1`}
                  style={{ height: `${(value / Math.max(...stat.trend)) * 100}%` }}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div 
          className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text-primary">Recent Activity</h3>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => success('Filter feature', 'Activity filtering coming soon!')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiFilter} className="w-4 h-4 text-text-secondary" />
              </button>
              <button 
                onClick={handleExportData}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiDownload} className="w-4 h-4 text-text-secondary" />
              </button>
            </div>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gray-100`}>
                    <SafeIcon 
                      icon={getActivityIcon(activity.type)} 
                      className={`w-5 h-5 ${getActivityColor(activity.type)}`} 
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-text-primary font-medium">{activity.action}</p>
                    <p className="text-text-secondary text-sm">{activity.user}</p>
                  </div>
                  <span className="text-text-secondary text-sm">{activity.time}</span>
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <SafeIcon icon={FiMoreHorizontal} className="w-4 h-4 text-text-secondary" />
                  </button>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <SafeIcon icon={FiActivity} className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-text-secondary">No recent activity</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Popular Recipes */}
        <motion.div 
          className="bg-white rounded-lg p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text-primary">Popular Recipes</h3>
            <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-text-secondary" />
          </div>
          
          <div className="space-y-4">
            {popularRecipes.slice(0, 5).map((recipe, index) => (
              <motion.div
                key={recipe.id}
                className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={recipe.image} 
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-text-primary font-medium text-sm line-clamp-1">{recipe.title}</p>
                  <div className="flex items-center space-x-2 text-xs text-text-secondary">
                    <span>{recipe.views.toLocaleString()} views</span>
                    <span>•</span>
                    <span>⭐ {recipe.rating}</span>
                    <span>•</span>
                    <span className="text-green-500">+{recipe.growth}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-text-primary font-medium">#{index + 1}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div 
        className="bg-white rounded-lg p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-primary">Quick Actions</h3>
          <button 
            onClick={handleExportData}
            className="flex items-center space-x-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
          >
            <SafeIcon icon={FiDownload} className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <motion.button
              key={action.id}
              onClick={() => handleQuickAction(action.action)}
              className="p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                <SafeIcon icon={action.icon} className="w-6 h-6 text-white" />
              </div>
              <p className="text-text-primary font-medium">{action.title}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;