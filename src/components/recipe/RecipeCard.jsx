import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SafeIcon from '../../common/SafeIcon';
import ImageWithFallback from '../ui/ImageWithFallback';
import { useToast } from '../../contexts/ToastContext';
import * as FiIcons from 'react-icons/fi';

const { FiClock, FiHeart, FiStar, FiUsers, FiBookmark } = FiIcons;

const RecipeCard = ({ recipe, onToggleFavorite, isFavorite, showActions = true }) => {
  const { success } = useToast();

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(recipe.id);
      success(
        isFavorite ? 'Removed from favorites' : 'Added to favorites',
        recipe.title
      );
    }
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    success('Recipe bookmarked', recipe.title);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-surface rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      <Link to={`/recipes/${recipe.id}`}>
        <div className="relative">
          <ImageWithFallback
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-48 object-cover"
          />
          
          {/* Overlay Actions */}
          {showActions && (
            <div className="absolute top-3 right-3 flex space-x-2">
              <button
                onClick={handleFavoriteClick}
                className="p-2 bg-black/20 rounded-full backdrop-blur-sm hover:bg-black/30 transition-colors"
              >
                <SafeIcon
                  icon={FiHeart}
                  className={`w-5 h-5 ${
                    isFavorite ? 'text-highlight fill-current' : 'text-white'
                  }`}
                />
              </button>
              <button
                onClick={handleBookmark}
                className="p-2 bg-black/20 rounded-full backdrop-blur-sm hover:bg-black/30 transition-colors"
              >
                <SafeIcon icon={FiBookmark} className="w-5 h-5 text-white" />
              </button>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute bottom-3 left-3 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-white text-xs font-medium capitalize">
              {recipe.category}
            </span>
          </div>

          {/* Difficulty Badge */}
          <div className="absolute bottom-3 right-3">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                recipe.difficulty === 'easy'
                  ? 'bg-green-100 text-green-800'
                  : recipe.difficulty === 'medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {recipe.difficulty}
            </span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-text-primary mb-2 line-clamp-2">
            {recipe.title}
          </h3>
          <p className="text-text-secondary text-sm mb-3 line-clamp-2">
            {recipe.description}
          </p>

          {/* Recipe Stats */}
          <div className="flex items-center justify-between text-sm text-text-secondary mb-3">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <SafeIcon icon={FiClock} className="w-4 h-4 mr-1" />
                {recipe.cookingTime}m
              </div>
              <div className="flex items-center">
                <SafeIcon icon={FiUsers} className="w-4 h-4 mr-1" />
                {recipe.servings}
              </div>
            </div>
            <div className="flex items-center">
              <SafeIcon icon={FiStar} className="w-4 h-4 mr-1 text-yellow-500" />
              {recipe.rating}
            </div>
          </div>

          {/* Dietary Tags */}
          {recipe.dietary && recipe.dietary.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {recipe.dietary.slice(0, 2).map((diet, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                >
                  {diet.replace('-', ' ')}
                </span>
              ))}
              {recipe.dietary.length > 2 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-text-secondary">
                  +{recipe.dietary.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default RecipeCard;