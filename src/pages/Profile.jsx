import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import SafeIcon from '../common/SafeIcon';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import EditProfileModal from '../components/profile/EditProfileModal';
import * as FiIcons from 'react-icons/fi';

const { 
  FiUser, FiHeart, FiClock, FiTrendingUp, FiSettings, FiLogOut, 
  FiEdit2, FiBook, FiStar, FiChevronRight, FiCalendar, FiMail,
  FiChef, FiTarget, FiAward, FiActivity
} = FiIcons;

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const { favorites, recentlyViewed, recipes } = useApp();
  const [showEditModal, setShowEditModal] = useState(false);

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
      icon: FiBook,
      label: 'Recipes Viewed',
      value: recentlyViewed.length + favorites.length,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      icon: FiTrendingUp,
      label: 'Cooking Streak',
      value: 7,
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
  ];

  const achievements = [
    { icon: FiChef, title: 'First Recipe', description: 'Viewed your first recipe', unlocked: true },
    { icon: FiHeart, title: 'Recipe Lover', description: 'Added 5 recipes to favorites', unlocked: favorites.length >= 5 },
    { icon: FiStar, title: 'Explorer', description: 'Viewed 10 different recipes', unlocked: recentlyViewed.length >= 10 },
    { icon: FiTarget, title: 'Consistent Cook', description: 'Used app for 7 days straight', unlocked: true },
  ];

  const handleLogout = () => {
    logout();
  };

  const handleEditProfile = async (formData) => {
    await updateUser({
      name: formData.name,
      avatar: formData.avatar,
      preferences: {
        skillLevel: formData.skillLevel,
        cookingTime: formData.cookingTime,
        dietaryRestrictions: formData.dietaryRestrictions,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-6 space-y-6">
        {/* Profile Header */}
        <motion.div
          className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white relative overflow-hidden"
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
              <h2 className="text-2xl font-bold text-white">{user?.name || 'Chef'}</h2>
              <p className="text-white/90">{user?.email}</p>
              <p className="text-sm text-white/70">
                Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => setShowEditModal(true)}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <SafeIcon icon={FiEdit2} className="w-5 h-5 text-white" />
            </button>
          </div>
        </motion.div>

        {/* User Details */}
        <motion.div
          className="bg-surface rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="font-semibold text-text-primary mb-4">Profile Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiMail} className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-text-secondary">Email</p>
                <p className="font-medium text-text-primary">{user?.email || 'Not provided'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiCalendar} className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-text-secondary">Member Since</p>
                <p className="font-medium text-text-primary">
                  {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiChef} className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-text-secondary">Skill Level</p>
                <p className="font-medium text-text-primary capitalize">
                  {user?.preferences?.skillLevel || 'Intermediate'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiClock} className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-text-secondary">Preferred Cooking Time</p>
                <p className="font-medium text-text-primary">
                  {user?.preferences?.cookingTime || 30} minutes
                </p>
              </div>
            </div>
          </div>
          
          {/* Dietary Restrictions */}
          {user?.preferences?.dietaryRestrictions?.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-text-secondary mb-2">Dietary Restrictions</p>
              <div className="flex flex-wrap gap-2">
                {user.preferences.dietaryRestrictions.map((restriction, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm capitalize"
                  >
                    {restriction.replace('-', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {stats.map((stat, index) => (
            <div key={index} className="bg-surface rounded-lg p-4 text-center">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-2`}>
                <SafeIcon icon={stat.icon} className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
              <p className="text-xs text-text-secondary">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Achievements */}
        <motion.div
          className="bg-surface rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-semibold text-text-primary mb-4">Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg ${
                  achievement.unlocked ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  achievement.unlocked ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'
                }`}>
                  <SafeIcon icon={achievement.icon} className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${achievement.unlocked ? 'text-green-800' : 'text-gray-600'}`}>
                    {achievement.title}
                  </p>
                  <p className={`text-sm ${achievement.unlocked ? 'text-green-600' : 'text-gray-500'}`}>
                    {achievement.description}
                  </p>
                </div>
                {achievement.unlocked && (
                  <SafeIcon icon={FiAward} className="w-5 h-5 text-green-500" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Favorite Recipes */}
        {favoriteRecipes.length > 0 && (
          <motion.div
            className="bg-surface rounded-lg p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-primary">Favorite Recipes</h3>
              <Link
                to="/recipes"
                className="flex items-center text-primary text-sm font-medium hover:text-primary/80 transition-colors"
              >
                View All
                <SafeIcon icon={FiChevronRight} className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-3">
              {favoriteRecipes.slice(0, 3).map((recipe) => (
                <Link key={recipe.id} to={`/recipes/${recipe.id}`}>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <ImageWithFallback
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-16 h-16 rounded-lg object-cover"
                      placeholderType="recipe"
                      placeholderSize="md"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-text-primary">{recipe.title}</h4>
                      <div className="flex items-center text-sm text-text-secondary mt-1">
                        <SafeIcon icon={FiClock} className="w-4 h-4 mr-1" />
                        {recipe.cookingTime}m
                        <span className="mx-2">•</span>
                        <SafeIcon icon={FiStar} className="w-4 h-4 mr-1" />
                        {recipe.rating}
                      </div>
                    </div>
                    <SafeIcon icon={FiHeart} className="w-5 h-5 text-highlight" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recent Activity */}
        {recentRecipes.length > 0 && (
          <motion.div
            className="bg-surface rounded-lg p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-primary">Recently Viewed</h3>
              <Link
                to="/recipes"
                className="flex items-center text-primary text-sm font-medium hover:text-primary/80 transition-colors"
              >
                View All
                <SafeIcon icon={FiChevronRight} className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {recentRecipes.slice(0, 5).map((recipe) => (
                <Link key={recipe.id} to={`/recipes/${recipe.id}`}>
                  <div className="flex-shrink-0 w-32">
                    <ImageWithFallback
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-24 rounded-lg object-cover"
                      placeholderType="recipe"
                      placeholderSize="lg"
                    />
                    <p className="text-sm font-medium text-text-primary mt-2 truncate">
                      {recipe.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          className="bg-surface rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="font-semibold text-text-primary mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/settings"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiSettings} className="w-5 h-5 text-text-secondary" />
                <span className="text-text-primary">Settings</span>
              </div>
              <SafeIcon icon={FiChevronRight} className="w-5 h-5 text-text-secondary" />
            </Link>
            <Link
              to="/recipes"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiBook} className="w-5 h-5 text-text-secondary" />
                <span className="text-text-primary">Browse Recipes</span>
              </div>
              <SafeIcon icon={FiChevronRight} className="w-5 h-5 text-text-secondary" />
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-red-50 transition-colors text-red-600"
            >
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiLogOut} className="w-5 h-5" />
                <span>Sign Out</span>
              </div>
              <SafeIcon icon={FiChevronRight} className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Edit Profile Modal */}
        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          user={user}
          onSave={handleEditProfile}
        />
      </div>
    </div>
  );
};

export default Profile;