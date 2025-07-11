import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { useTimer } from '../hooks/useTimer';
import { useToast } from '../contexts/ToastContext';
import SafeIcon from '../common/SafeIcon';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import NutritionChart from '../components/recipe/NutritionChart';
import ShoppingList from '../components/recipe/ShoppingList';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiClock, FiUsers, FiHeart, FiStar, FiPlay, FiPause, FiRotateCcw, FiShoppingCart, FiShare, FiBookmark, FiPrinter } = FiIcons;

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRecipeById, toggleFavorite, favorites, addToRecentlyViewed } = useApp();
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState('ingredients');
  const [servings, setServings] = useState(1);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [completedSteps, setCompletedSteps] = useState({});
  const timer = useTimer();

  const recipe = getRecipeById(id);

  useEffect(() => {
    if (recipe) {
      addToRecentlyViewed(recipe.id);
      setServings(recipe.servings);
    }
  }, [recipe, addToRecentlyViewed]);

  const handleGoBack = () => {
    // Try to go back in history, but if there's no history, go to recipes page
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/recipes');
    }
  };

  const handleToggleFavorite = () => {
    toggleFavorite(recipe.id);
    const isFavorite = favorites.includes(recipe.id);
    success(
      isFavorite ? 'Removed from favorites' : 'Added to favorites',
      recipe.title
    );
  };

  const handleShare = async () => {
    const shareData = {
      title: recipe.title,
      text: recipe.description,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        success('Recipe link copied to clipboard');
      }
    } catch (err) {
      error('Failed to share recipe');
    }
  };

  const handlePrint = () => {
    window.print();
    success('Print dialog opened');
  };

  const handleStepComplete = (stepIndex) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepIndex]: !prev[stepIndex]
    }));
  };

  const adjustIngredientAmount = (amount, originalServings, newServings) => {
    if (typeof amount === 'string') {
      const numMatch = amount.match(/(\d+(?:\.\d+)?)/);
      if (numMatch) {
        const num = parseFloat(numMatch[1]);
        const adjusted = (num * newServings) / originalServings;
        return amount.replace(numMatch[1], adjusted.toString());
      }
    }
    return amount;
  };

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiClock} className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-2">
            Recipe not found
          </h3>
          <p className="text-text-secondary mb-4">
            The recipe you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/recipes"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Recipes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Image */}
      <motion.div
        className="relative h-64 bg-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ImageWithFallback
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        {/* Navigation */}
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <motion.button
            onClick={handleGoBack}
            className="p-2 bg-black/20 rounded-full backdrop-blur-sm hover:bg-black/30 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <SafeIcon icon={FiArrowLeft} className="w-6 h-6 text-white" />
          </motion.button>
          <div className="flex space-x-2">
            <motion.button
              onClick={handleToggleFavorite}
              className="p-2 bg-black/20 rounded-full backdrop-blur-sm hover:bg-black/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <SafeIcon
                icon={FiHeart}
                className={`w-6 h-6 ${
                  favorites.includes(recipe.id)
                    ? 'text-highlight fill-current'
                    : 'text-white'
                }`}
              />
            </motion.button>
            <motion.button
              onClick={handleShare}
              className="p-2 bg-black/20 rounded-full backdrop-blur-sm hover:bg-black/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <SafeIcon icon={FiShare} className="w-6 h-6 text-white" />
            </motion.button>
            <motion.button
              onClick={handlePrint}
              className="p-2 bg-black/20 rounded-full backdrop-blur-sm hover:bg-black/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <SafeIcon icon={FiPrinter} className="w-6 h-6 text-white" />
            </motion.button>
          </div>
        </div>

        {/* Recipe Title */}
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl font-bold text-white mb-2">{recipe.title}</h1>
          <div className="flex items-center space-x-4 text-white/90">
            <div className="flex items-center">
              <SafeIcon icon={FiClock} className="w-4 h-4 mr-1" />
              {recipe.cookingTime}m
            </div>
            <div className="flex items-center">
              <SafeIcon icon={FiUsers} className="w-4 h-4 mr-1" />
              {recipe.servings} servings
            </div>
            <div className="flex items-center">
              <SafeIcon icon={FiStar} className="w-4 h-4 mr-1" />
              {recipe.rating} ({recipe.reviews})
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Recipe Info */}
        <motion.div
          className="bg-surface rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-text-secondary mb-4">{recipe.description}</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{recipe.calories}</p>
              <p className="text-sm text-text-secondary">Calories</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary capitalize">
                {recipe.difficulty}
              </p>
              <p className="text-sm text-text-secondary">Difficulty</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{recipe.prepTime}m</p>
              <p className="text-sm text-text-secondary">Prep Time</p>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="flex space-x-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => setShowShoppingList(true)}
            className="flex-1 flex items-center justify-center space-x-2 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <SafeIcon icon={FiShoppingCart} className="w-5 h-5" />
            <span>Shopping List</span>
          </button>
          <button
            onClick={() => success('Recipe bookmarked')}
            className="px-4 py-3 bg-surface border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <SafeIcon icon={FiBookmark} className="w-5 h-5 text-text-secondary" />
          </button>
        </motion.div>

        {/* Timer */}
        <motion.div
          className="bg-surface rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-semibold text-text-primary mb-3">Cooking Timer</h3>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-primary font-mono">
              {timer.formatTime()}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={timer.isRunning ? timer.pause : timer.start}
                className="p-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
              >
                <SafeIcon
                  icon={timer.isRunning ? FiPause : FiPlay}
                  className="w-5 h-5"
                />
              </button>
              <button
                onClick={timer.reset}
                className="p-3 bg-gray-200 text-text-secondary rounded-full hover:bg-gray-300 transition-colors"
              >
                <SafeIcon icon={FiRotateCcw} className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Servings Adjuster */}
        <motion.div
          className="bg-surface rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-text-primary">Servings</h3>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setServings(Math.max(1, servings - 1))}
                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                -
              </button>
              <span className="text-lg font-semibold text-text-primary w-8 text-center">
                {servings}
              </span>
              <button
                onClick={() => setServings(servings + 1)}
                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="flex bg-surface rounded-lg p-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {['ingredients', 'instructions', 'nutrition'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors capitalize ${
                activeTab === tab
                  ? 'bg-primary text-white rounded-lg'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'ingredients' && (
            <div className="bg-surface rounded-lg p-4">
              <h3 className="font-semibold text-text-primary mb-4">Ingredients</h3>
              <div className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <span className="text-text-primary">{ingredient.name}</span>
                    <span className="text-text-secondary font-medium">
                      {adjustIngredientAmount(
                        ingredient.amount,
                        recipe.servings,
                        servings
                      )}{' '}
                      {ingredient.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'instructions' && (
            <div className="bg-surface rounded-lg p-4">
              <h3 className="font-semibold text-text-primary mb-4">Instructions</h3>
              <div className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <button
                      onClick={() => handleStepComplete(index)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-1 transition-colors ${
                        completedSteps[index]
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-primary text-primary hover:bg-primary hover:text-white'
                      }`}
                    >
                      {completedSteps[index] ? '✓' : index + 1}
                    </button>
                    <p
                      className={`text-text-primary flex-1 ${
                        completedSteps[index] ? 'line-through opacity-60' : ''
                      }`}
                    >
                      {instruction}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'nutrition' && <NutritionChart nutrition={recipe.nutrition} />}
        </motion.div>
      </div>

      {/* Shopping List Modal */}
      <ShoppingList
        isOpen={showShoppingList}
        onClose={() => setShowShoppingList(false)}
        recipe={recipe}
      />
    </div>
  );
};

export default RecipeDetail;