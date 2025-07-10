import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiFilter, FiX } = FiIcons;

const RecipeFilters = ({ filters, onFilterChange, onClearFilters, isOpen, onToggle }) => {
  const categories = ['breakfast', 'lunch', 'dinner', 'snack'];
  const difficulties = ['easy', 'medium', 'hard'];
  const timeOptions = ['15', '30', '60'];
  const dietaryOptions = ['vegetarian', 'vegan', 'gluten-free', 'high-protein', 'dairy-free'];

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'dietary') {
      const newDietary = filters.dietary.includes(value)
        ? filters.dietary.filter(item => item !== value)
        : [...filters.dietary, value];
      onFilterChange({ ...filters, dietary: newDietary });
    } else {
      onFilterChange({
        ...filters,
        [filterType]: filters[filterType] === value ? '' : value
      });
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.difficulty) count++;
    if (filters.time) count++;
    count += filters.dietary.length;
    return count;
  };

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 px-4 py-2 bg-surface border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <SafeIcon icon={FiFilter} className="w-5 h-5 text-text-secondary" />
        <span className="text-text-secondary">Filters</span>
        {getActiveFiltersCount() > 0 && (
          <span className="bg-primary text-white text-xs rounded-full px-2 py-1">
            {getActiveFiltersCount()}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 bg-surface rounded-lg border border-gray-200 shadow-lg p-4 z-10"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-text-primary">Filters</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={onClearFilters}
                className="text-primary text-sm font-medium hover:text-primary/80 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={onToggle}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <SafeIcon icon={FiX} className="w-4 h-4 text-text-secondary" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleFilterChange('category', category)}
                    className={`px-3 py-1 rounded-full text-sm capitalize transition-colors ${
                      filters.category === category
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Difficulty
              </label>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => handleFilterChange('difficulty', difficulty)}
                    className={`px-3 py-1 rounded-full text-sm capitalize transition-colors ${
                      filters.difficulty === difficulty
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Max Time (minutes)
              </label>
              <div className="flex flex-wrap gap-2">
                {timeOptions.map((time) => (
                  <button
                    key={time}
                    onClick={() => handleFilterChange('time', time)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      filters.time === time
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                    }`}
                  >
                    {time}m
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Dietary Preferences
              </label>
              <div className="flex flex-wrap gap-2">
                {dietaryOptions.map((dietary) => (
                  <button
                    key={dietary}
                    onClick={() => handleFilterChange('dietary', dietary)}
                    className={`px-3 py-1 rounded-full text-sm capitalize transition-colors ${
                      filters.dietary.includes(dietary)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                    }`}
                  >
                    {dietary.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RecipeFilters;