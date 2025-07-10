import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import SearchBar from '../components/ui/SearchBar';
import RecipeCard from '../components/recipe/RecipeCard';
import RecipeFilters from '../components/recipe/RecipeFilters';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiGrid, FiList, FiTrendingUp, FiClock, FiStar } = FiIcons;

const Recipes = () => {
  const {
    getFilteredRecipes,
    toggleFavorite,
    favorites,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    clearFilters,
    sortBy,
    setSortBy
  } = useApp();
  
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  const filteredRecipes = getFilteredRecipes();

  const sortOptions = [
    { value: 'newest', label: 'Newest', icon: FiTrendingUp },
    { value: 'rating', label: 'Rating', icon: FiStar },
    { value: 'time', label: 'Cook Time', icon: FiClock },
    { value: 'difficulty', label: 'Difficulty', icon: FiGrid }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-6">
        {/* Header */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Discover Recipes
          </h1>
          <p className="text-text-secondary">
            Find the perfect recipe for your busy lifestyle
          </p>
        </motion.div>

        {/* Search and Controls */}
        <div className="space-y-4 mb-6">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search recipes, ingredients..."
            className="w-full"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <RecipeFilters
                filters={filters}
                onFilterChange={setFilters}
                onClearFilters={clearFilters}
                isOpen={showFilters}
                onToggle={() => setShowFilters(!showFilters)}
              />

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-surface border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary text-white'
                    : 'bg-surface text-text-secondary hover:bg-gray-100'
                }`}
              >
                <SafeIcon icon={FiGrid} className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary text-white'
                    : 'bg-surface text-text-secondary hover:bg-gray-100'
                }`}
              >
                <SafeIcon icon={FiList} className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-text-secondary text-sm">
            {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </motion.div>

        {/* Recipe Grid/List */}
        <motion.div
          className={`${
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {filteredRecipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <RecipeCard
                recipe={recipe}
                onToggleFavorite={toggleFavorite}
                isFavorite={favorites.includes(recipe.id)}
                showActions={true}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredRecipes.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SafeIcon icon={FiGrid} className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">
              No recipes found
            </h3>
            <p className="text-text-secondary mb-4">
              Try adjusting your search or filters to find more recipes
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                clearFilters();
              }}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Recipes;