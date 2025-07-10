import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import SafeIcon from '../common/SafeIcon';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import PlaceholderImage from '../components/ui/PlaceholderImage';
import * as FiIcons from 'react-icons/fi';

const { FiClock, FiTrendingUp, FiHeart, FiChevronRight, FiUser, FiTarget, FiAward, FiCalendar, FiBook, FiChef, FiTimer } = FiIcons;

const Dashboard = () => {
  const { user } = useAuth();
  const { recipes, favorites, recentlyViewed, getQuickRecipes, getFavoriteRecipes, getRecentRecipes, cookingSessions } = useApp();
  const [greeting, setGreeting] = useState('');
  const [todayGoal, setTodayGoal] = useState({ target: 1, completed: 0 });
  const [weeklyStats, setWeeklyStats] = useState({
    recipesCooked: 0,
    totalCookingTime: 0,
    favoriteCategory: 'breakfast'
  });

  const quickRecipes = getQuickRecipes(15);
  const favoriteRecipes = getFavoriteRecipes();
  const recentRecipes = getRecentRecipes();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    // Mock cooking sessions data - in real app this would come from Supabase
    const mockStats = {
      recipesCooked: 12,
      totalCookingTime: 180,
      favoriteCategory: 'dinner'
    };
    setWeeklyStats(mockStats);
  }, []);

  const achievements = [
    { id: 1, title: 'Quick Chef', description: 'Cooked 10 recipes under 15 minutes', earned: true, icon: FiTimer },
    { id: 2, title: 'Healthy Eater', description: 'Tried 5 vegetarian recipes', earned: true, icon: FiHeart },
    { id: 3, title: 'Recipe Explorer', description: 'Favorited 20 recipes', earned: favorites.length >= 20, icon: FiBook },
    { id: 4, title: 'Cooking Streak', description: 'Cooked for 7 days straight', earned: false, icon: FiCalendar }
  ];

  const todayRecommendations = recipes.filter(recipe => {
    const userSkill = user?.preferences?.skillLevel || 'intermediate';
    const userTime = user?.preferences?.cookingTime || 30;
    const userDietary = user?.preferences?.dietaryRestrictions || [];
    
    return recipe.difficulty === userSkill && 
           recipe.cookingTime <= userTime &&
           (userDietary.length === 0 || userDietary.some(diet => recipe.dietary.includes(diet)));
  }).slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
        {/* Personal Welcome */}
        <motion.div
          className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white relative overflow-hidden"
          variants={itemVariants}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4">
              <SafeIcon icon={FiChef} className="w-24 h-24" />
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
                  {greeting}, {user?.name?.split(' ')[0] || 'Chef'}!
                </h2>
                <p className="text-white/90">
                  Ready to create something delicious today?
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Today's Goal */}
        <motion.div
          className="bg-surface rounded-lg p-4 shadow-sm"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiTarget} className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-text-primary">Today's Goal</h3>
            </div>
            <span className="text-sm text-text-secondary">
              {todayGoal.completed}/{todayGoal.target} recipes
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(todayGoal.completed / todayGoal.target) * 100}%` }}
            />
          </div>
          <p className="text-xs text-text-secondary">
            {todayGoal.completed === todayGoal.target 
              ? "🎉 Goal achieved! Great job!" 
              : `${todayGoal.target - todayGoal.completed} more to go!`}
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div className="grid grid-cols-3 gap-4" variants={itemVariants}>
          <div className="bg-surface rounded-lg p-4 text-center shadow-sm">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <SafeIcon icon={FiBook} className="w-6 h-6 text-primary" />
            </div>
            <p className="text-2xl font-bold text-text-primary">{weeklyStats.recipesCooked}</p>
            <p className="text-xs text-text-secondary">This Week</p>
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
              <SafeIcon icon={FiClock} className="w-6 h-6 text-info" />
            </div>
            <p className="text-2xl font-bold text-text-primary">{weeklyStats.totalCookingTime}m</p>
            <p className="text-xs text-text-secondary">Cooking Time</p>
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Achievements</h3>
            <Link
              to="/profile"
              className="flex items-center text-primary text-sm font-medium hover:text-primary/80 transition-colors"
            >
              View All
              <SafeIcon icon={FiChevronRight} className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {achievements.slice(0, 4).map((achievement) => (
              <div
                key={achievement.id}
                className={`p-3 rounded-lg border-2 transition-all ${
                  achievement.earned
                    ? 'bg-primary/5 border-primary/20 text-primary'
                    : 'bg-gray-50 border-gray-200 text-gray-400'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <SafeIcon icon={achievement.icon} className="w-4 h-4" />
                  <span className="text-sm font-medium">{achievement.title}</span>
                </div>
                <p className="text-xs opacity-80">{achievement.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Personalized Recommendations */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Recommended for You</h3>
            <Link
              to="/recipes"
              className="flex items-center text-primary text-sm font-medium hover:text-primary/80 transition-colors"
            >
              View All
              <SafeIcon icon={FiChevronRight} className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {todayRecommendations.map((recipe) => (
              <motion.div
                key={recipe.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
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
                    <div className="text-primary">
                      <SafeIcon icon={FiChevronRight} className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
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

        {/* Recently Viewed */}
        {recentRecipes.length > 0 && (
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Continue Cooking</h3>
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
      </div>
    </motion.div>
  );
};

export default Dashboard;