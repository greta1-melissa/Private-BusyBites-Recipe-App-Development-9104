import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import SafeIcon from '../common/SafeIcon';
import PlaceholderImage from '../components/ui/PlaceholderImage';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiHeart, FiClock, FiTrendingUp, FiSettings, FiLogOut, FiEdit2 } = FiIcons;

const Profile = () => {
  const { user, logout } = useAuth();
  const { favorites, recentlyViewed, recipes } = useApp();

  const favoriteRecipes = recipes.filter(recipe => favorites.includes(recipe.id));
  const recentRecipes = recentlyViewed
    .map(id => recipes.find(recipe => recipe.id === id))
    .filter(Boolean);

  const stats = [
    {
      icon: FiHeart,
      label: 'Favorites',
      value: favorites.length,
      color: 'text-highlight',
      bgColor: 'bg-highlight/10'
    },
    {
      icon: FiClock,
      label: 'Recent',
      value: recentlyViewed.length,
      color: 'text-info',
      bgColor: 'bg-info/10'
    },
    {
      icon: FiTrendingUp,
      label: 'Cooked',
      value: 23,
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-6">
        {/* Profile Header */}
        <motion.div
          className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 mb-6 text-white relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4">
              <SafeIcon icon={FiUser} className="w-20 h-20" />
            </div>
          </div>

          <div className="relative z-10 flex items-center space-x-4">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white/20"
              />
            ) : (
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiUser} className="w-10 h-10 text-white" />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
              <p className="text-white/90">{user?.email}</p>
              <p className="text-sm text-white/70">
                Member since {new Date(user?.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
              <SafeIcon icon={FiEdit2} className="w-5 h-5 text-white" />
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-3 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {stats.map((stat, index) => (
            <div key={index} className="bg-surface rounded-lg p-4 text-center shadow-sm">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-2`}>
                <SafeIcon icon={stat.icon} className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
              <p className="text-xs text-text-secondary">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Cooking Level */}
        <motion.div
          className="bg-surface rounded-lg p-6 mb-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text-primary">Cooking Level</h3>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiTrendingUp} className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary capitalize">
                {user?.preferences?.skillLevel || 'Intermediate'}
              </span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ 
                width: user?.preferences?.skillLevel === 'beginner' ? '33%' : 
                       user?.preferences?.skillLevel === 'intermediate' ? '66%' : '100%' 
              }}
            />
          </div>
          <p className="text-xs text-text-secondary">
            Keep cooking to level up your skills!
          </p>
        </motion.div>

        {/* Preferences */}
        <motion.div
          className="bg-surface rounded-lg p-4 mb-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-semibold text-text-primary mb-4">Cooking Preferences</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Preferred Cooking Time</span>
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiClock} className="w-4 h-4 text-text-secondary" />
                <span className="text-text-primary font-medium">
                  {user?.preferences?.cookingTime || 30} minutes
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Dietary Restrictions</span>
              <span className="text-text-primary font-medium">
                {user?.preferences?.dietaryRestrictions?.length > 0
                  ? user.preferences.dietaryRestrictions.join(', ')
                  : 'None'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="bg-surface rounded-lg p-4 mb-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-semibold text-text-primary mb-4">Recently Viewed</h3>
          {recentRecipes.length > 0 ? (
            <div className="space-y-3">
              {recentRecipes.slice(0, 3).map((recipe) => (
                <div key={recipe.id} className="flex items-center space-x-3">
                  <PlaceholderImage
                    type="recipe"
                    className="w-12 h-12 rounded-lg"
                    size="sm"
                    showText={false}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-text-primary">{recipe.title}</p>
                    <p className="text-sm text-text-secondary">
                      {recipe.cookingTime}m • {recipe.difficulty}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <PlaceholderImage
                type="recipe"
                className="w-16 h-16 mx-auto mb-3"
                size="lg"
                showText={false}
              />
              <p className="text-text-secondary text-sm">No recent recipes</p>
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <button className="w-full bg-surface rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition-colors shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiSettings} className="w-5 h-5 text-primary" />
              </div>
              <span className="text-text-primary font-medium">Settings</span>
            </div>
            <SafeIcon icon={FiSettings} className="w-5 h-5 text-text-secondary" />
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-surface rounded-lg p-4 flex items-center justify-between hover:bg-red-50 transition-colors shadow-sm"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiLogOut} className="w-5 h-5 text-error" />
              </div>
              <span className="text-error font-medium">Sign Out</span>
            </div>
            <SafeIcon icon={FiLogOut} className="w-5 h-5 text-error" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;