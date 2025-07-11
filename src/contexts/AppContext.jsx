import React, { createContext, useContext, useState, useEffect } from 'react';
import { recipesData } from '../data/recipes';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [recipes, setRecipes] = useState(recipesData);
  const [favorites, setFavorites] = useLocalStorage('busybites_favorites', []);
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage('busybites_recently_viewed', []);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    time: '',
    dietary: [],
  });
  const [sortBy, setSortBy] = useState('newest'); // newest, rating, time, difficulty

  const toggleFavorite = (recipeId) => {
    const newFavorites = favorites.includes(recipeId)
      ? favorites.filter(id => id !== recipeId)
      : [...favorites, recipeId];
    setFavorites(newFavorites);
  };

  const addToRecentlyViewed = (recipeId) => {
    const newRecentlyViewed = [
      recipeId,
      ...recentlyViewed.filter(id => id !== recipeId)
    ].slice(0, 10);
    setRecentlyViewed(newRecentlyViewed);
  };

  const getFilteredRecipes = () => {
    let filtered = recipes.filter(recipe => {
      const matchesSearch = !searchQuery || 
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some(ing => 
          ing.name.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        recipe.tags.some(tag => 
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory = !filters.category || recipe.category === filters.category;
      const matchesDifficulty = !filters.difficulty || recipe.difficulty === filters.difficulty;
      const matchesTime = !filters.time || recipe.cookingTime <= parseInt(filters.time);
      const matchesDietary = filters.dietary.length === 0 || 
        filters.dietary.every(diet => recipe.dietary.includes(diet));

      return matchesSearch && matchesCategory && matchesDifficulty && matchesTime && matchesDietary;
    });

    // Sort recipes
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'time':
        filtered.sort((a, b) => a.cookingTime - b.cookingTime);
        break;
      case 'difficulty':
        const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
        filtered.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return filtered;
  };

  const getFavoriteRecipes = () => {
    return recipes.filter(recipe => favorites.includes(recipe.id));
  };

  const getRecentRecipes = () => {
    return recentlyViewed
      .map(id => recipes.find(recipe => recipe.id === id))
      .filter(Boolean);
  };

  const getRecipeById = (id) => {
    return recipes.find(recipe => recipe.id === id);
  };

  const getRecipesByCategory = (category) => {
    return recipes.filter(recipe => recipe.category === category);
  };

  const getQuickRecipes = (maxTime = 15) => {
    return recipes.filter(recipe => recipe.cookingTime <= maxTime);
  };

  const getRecipesByDietary = (dietary) => {
    return recipes.filter(recipe => recipe.dietary.includes(dietary));
  };

  const addRecipe = (newRecipe) => {
    const recipe = {
      ...newRecipe,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      rating: 0,
      reviews: 0,
      author: 'You'
    };
    setRecipes(prev => [recipe, ...prev]);
    return recipe;
  };

  const updateRecipe = (id, updates) => {
    setRecipes(prev => prev.map(recipe => 
      recipe.id === id ? { ...recipe, ...updates } : recipe
    ));
  };

  const deleteRecipe = (id) => {
    setRecipes(prev => prev.filter(recipe => recipe.id !== id));
    // Also remove from favorites and recently viewed
    setFavorites(prev => prev.filter(fId => fId !== id));
    setRecentlyViewed(prev => prev.filter(rId => rId !== id));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      difficulty: '',
      time: '',
      dietary: [],
    });
    setSearchQuery('');
  };

  const getStats = () => {
    return {
      totalRecipes: recipes.length,
      favoriteCount: favorites.length,
      recentCount: recentlyViewed.length,
      categoryCounts: {
        breakfast: recipes.filter(r => r.category === 'breakfast').length,
        lunch: recipes.filter(r => r.category === 'lunch').length,
        dinner: recipes.filter(r => r.category === 'dinner').length,
        snack: recipes.filter(r => r.category === 'snack').length,
      },
      difficultyDistribution: {
        easy: recipes.filter(r => r.difficulty === 'easy').length,
        medium: recipes.filter(r => r.difficulty === 'medium').length,
        hard: recipes.filter(r => r.difficulty === 'hard').length,
      }
    };
  };

  const value = {
    // State
    recipes,
    favorites,
    recentlyViewed,
    searchQuery,
    filters,
    sortBy,

    // Actions
    setSearchQuery,
    setFilters,
    setSortBy,
    toggleFavorite,
    addToRecentlyViewed,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    clearFilters,

    // Getters
    getFilteredRecipes,
    getFavoriteRecipes,
    getRecentRecipes,
    getRecipeById,
    getRecipesByCategory,
    getQuickRecipes,
    getRecipesByDietary,
    getStats,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};