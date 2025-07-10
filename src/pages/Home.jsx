import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import SafeIcon from '../common/SafeIcon';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import PlaceholderImage from '../components/ui/PlaceholderImage';
import * as FiIcons from 'react-icons/fi';

const { FiClock, FiTrendingUp, FiHeart, FiChevronRight, FiUser } = FiIcons;

const Home = () => {
  const { user } = useAuth();
  const { recipes, favorites, recentlyViewed, getQuickRecipes, getFavoriteRecipes, getRecentRecipes } = useApp();

  const quickRecipes = getQuickRecipes(15);
  const favoriteRecipes = getFavoriteRecipes();
  const recentRecipes = getRecentRecipes();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-background"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <motion.div
          className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white relative overflow-hidden"
          variants={itemVariants}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4">
              <SafeIcon icon={FiUser} className="w-24 h-24" />
            </div>
            <div className="absolute bottom-4 left-4">
              <SafeIcon icon={FiHeart} className="w-16 h-16" />
            </div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-4">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
                />
              ) : (
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiUser} className="w-8 h-8 text-white" />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold">
                  Welcome back, {user?.name?.split(' ')[0] || 'Chef'}!
                </h2>
                <p className="text-white/90">
                  Ready to cook something delicious?
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div className="grid grid-cols-3 gap-4" variants={itemVariants}>
          <div className="bg-surface rounded-lg p-4 text-center shadow-sm">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <SafeIcon icon={FiClock} className="w-6 h-6 text-primary" />
            </div>
            <p className="text-2xl font-bold text-text-primary">{quickRecipes.length}</p>
            <p className="text-xs text-text-secondary">Quick Recipes</p>
          </div>
          <div className="bg-surface rounded-lg p-4 text-center shadow-sm">
            <div className="w-12 h-12 bg-highlight/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <SafeIcon icon={FiHeart} className="w-6 h-6 text-highlight" />
            </div>
            <p className="text-2xl font-bold text-text-primary">{favorites.length}</p>
            <p className="text-xs text-text-secondary">Favorites</p>
          </div>
          <div className="bg-surface rounded-lg p-4 text-center shadow-sm">
            <div className="w-12 h-12 bg-info/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-info" />
            </div>
            <p className="text-2xl font-bold text-text-primary">{recentlyViewed.length}</p>
            <p className="text-xs text-text-secondary">Recent</p>
          </div>
        </motion.div>

        {/* Quick Recipes Section */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Quick Recipes</h3>
            <Link
              to="/recipes"
              className="flex items-center text-primary text-sm font-medium hover:text-primary/80 transition-colors"
            >
              View All
              <SafeIcon icon={FiChevronRight} className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {quickRecipes.slice(0, 4).map((recipe) => (
              <motion.div
                key={recipe.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link to={`/recipes/${recipe.id}`}>
                  <div className="bg-surface rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <ImageWithFallback
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-32 object-cover"
                      placeholderType="recipe"
                      placeholderSize="lg"
                    />
                    <div className="p-3">
                      <h4 className="font-medium text-text-primary mb-1 text-sm line-clamp-2">
                        {recipe.title}
                      </h4>
                      <div className="flex items-center text-xs text-text-secondary">
                        <SafeIcon icon={FiClock} className="w-3 h-3 mr-1" />
                        {recipe.cookingTime}m
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Favorites Section */}
        {favoriteRecipes.length > 0 && (
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Your Favorites</h3>
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
                <motion.div
                  key={recipe.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Link to={`/recipes/${recipe.id}`}>
                    <div className="bg-surface rounded-lg p-4 flex items-center space-x-3 shadow-sm hover:shadow-md transition-shadow">
                      <ImageWithFallback
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-16 h-16 rounded-lg object-cover"
                        placeholderType="recipe"
                        placeholderSize="md"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-text-primary mb-1">
                          {recipe.title}
                        </h4>
                        <div className="flex items-center text-sm text-text-secondary">
                          <SafeIcon icon={FiClock} className="w-4 h-4 mr-1" />
                          {recipe.cookingTime}m
                          <span className="mx-2">•</span>
                          <span className="capitalize">{recipe.difficulty}</span>
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-highlight/10 rounded-full flex items-center justify-center">
                        <SafeIcon icon={FiHeart} className="w-5 h-5 text-highlight" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recently Viewed */}
        {recentRecipes.length > 0 && (
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Recently Viewed</h3>
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {recentRecipes.slice(0, 5).map((recipe) => (
                <motion.div
                  key={recipe.id}
                  className="flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to={`/recipes/${recipe.id}`}>
                    <div className="w-32">
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
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State for New Users */}
        {favoriteRecipes.length === 0 && recentRecipes.length === 0 && (
          <motion.div
            className="text-center py-12"
            variants={itemVariants}
          >
            <div className="w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <SafeIcon icon={FiHeart} className="w-16 h-16 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Start Your Cooking Journey
            </h3>
            <p className="text-text-secondary mb-6">
              Explore our recipes and start building your favorites collection
            </p>
            <Link
              to="/recipes"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Browse Recipes
              <SafeIcon icon={FiChevronRight} className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Home;