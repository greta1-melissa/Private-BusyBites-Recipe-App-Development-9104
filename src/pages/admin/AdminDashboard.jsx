import React from 'react';
import { motion } from 'framer-motion';
import { useAdmin } from '../../contexts/AdminContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiBook, FiEye, FiTrendingUp, FiActivity, FiClock, FiPlus, FiSettings } = FiIcons;

const AdminDashboard = () => {
  const { stats } = useAdmin();

  const statsCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: FiUsers,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive',
    },
    {
      title: 'Total Recipes',
      value: stats.totalRecipes,
      icon: FiBook,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive',
    },
    {
      title: 'Total Views',
      value: stats.totalViews,
      icon: FiEye,
      color: 'bg-purple-500',
      change: '+25%',
      changeType: 'positive',
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      icon: FiActivity,
      color: 'bg-orange-500',
      change: '+5%',
      changeType: 'positive',
    },
  ];

  const recentActivity = [
    { action: 'New user registered', user: 'john@example.com', time: '2 minutes ago' },
    { action: 'Recipe published', user: 'admin', time: '15 minutes ago' },
    { action: 'User updated profile', user: 'jane@example.com', time: '1 hour ago' },
    { action: 'Recipe favorited', user: 'mike@example.com', time: '2 hours ago' },
    { action: 'New user registered', user: 'sarah@example.com', time: '3 hours ago' },
  ];

  const popularRecipes = [
    { title: '5-Minute Avocado Toast', views: 2543, rating: 4.8 },
    { title: 'Quick Chicken Stir-Fry', views: 1987, rating: 4.6 },
    { title: 'Overnight Oats', views: 1654, rating: 4.7 },
    { title: 'Mediterranean Wrap', views: 1432, rating: 4.5 },
    { title: 'Protein Smoothie Bowl', views: 1289, rating: 4.9 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-2">Welcome to BusyBites Admin</h2>
        <p className="text-white/90">
          Manage your recipe app, users, and content from this central dashboard.
        </p>
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
            className="bg-white rounded-lg p-6 shadow-sm"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-text-primary">{stat.value.toLocaleString()}</p>
                <p className={`text-sm ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}>
                <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          className="bg-white rounded-lg p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Recent Activity</h3>
            <SafeIcon icon={FiClock} className="w-5 h-5 text-text-secondary" />
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="text-text-primary font-medium">{activity.action}</p>
                  <p className="text-text-secondary text-sm">{activity.user}</p>
                </div>
                <span className="text-text-secondary text-sm">{activity.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Popular Recipes */}
        <motion.div
          className="bg-white rounded-lg p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Popular Recipes</h3>
            <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-text-secondary" />
          </div>
          <div className="space-y-3">
            {popularRecipes.map((recipe, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="text-text-primary font-medium">{recipe.title}</p>
                  <p className="text-text-secondary text-sm">{recipe.views} views • ⭐ {recipe.rating}</p>
                </div>
                <div className="text-right">
                  <p className="text-text-primary font-medium">#{index + 1}</p>
                </div>
              </div>
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
        <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="p-4 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
            <SafeIcon icon={FiBook} className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-text-primary font-medium">Add Recipe</p>
          </button>
          <button className="p-4 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 transition-colors">
            <SafeIcon icon={FiUsers} className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-text-primary font-medium">Manage Users</p>
          </button>
          <button className="p-4 bg-green-500/10 rounded-lg hover:bg-green-500/20 transition-colors">
            <SafeIcon icon={FiPlus} className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-text-primary font-medium">Upload Media</p>
          </button>
          <button className="p-4 bg-purple-500/10 rounded-lg hover:bg-purple-500/20 transition-colors">
            <SafeIcon icon={FiSettings} className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <p className="text-text-primary font-medium">Settings</p>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;