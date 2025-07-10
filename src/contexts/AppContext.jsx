import React, { createContext, useContext, useState, useEffect } from 'react';
import { recipesData } from '../data/recipes';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState(recipesData);
  const [favorites, setFavorites] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [cookingSessions, setCookingSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    time: '',
    dietary: [],
  });
  const [sortBy, setSortBy] = useState('newest');

  // Load user data from Supabase when user changes
  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      // Reset to empty state when user logs out
      setFavorites([]);
      setRecentlyViewed([]);
      setCookingSessions([]);
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    try {
      console.log('Loading user data for:', user.id);
      
      // Load favorites
      try {
        const { data: favoritesData, error: favoritesError } = await supabase
          .from('user_favorites_bb2024')
          .select('recipe_id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (favoritesError) {
          console.error('Error loading favorites:', favoritesError);
        } else if (favoritesData) {
          setFavorites(favoritesData.map(f => f.recipe_id));
          console.log('Loaded favorites:', favoritesData.length);
        }
      } catch (err) {
        console.error('Favorites load exception:', err);
      }
      
      // Load recently viewed
      try {
        const { data: recentData, error: recentError } = await supabase
          .from('user_recent_bb2024')
          .select('recipe_id')
          .eq('user_id', user.id)
          .order('viewed_at', { ascending: false })
          .limit(10);

        if (recentError) {
          console.error('Error loading recently viewed:', recentError);
        } else if (recentData) {
          setRecentlyViewed(recentData.map(r => r.recipe_id));
          console.log('Loaded recent views:', recentData.length);
        }
      } catch (err) {
        console.error('Recent views load exception:', err);
      }
      
      // Load cooking sessions
      try {
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('cooking_sessions_bb2024')
          .select('*')
          .eq('user_id', user.id)
          .order('started_at', { ascending: false });

        if (sessionsError) {
          console.error('Error loading cooking sessions:', sessionsError);
        } else if (sessionsData) {
          setCookingSessions(sessionsData);
          console.log('Loaded cooking sessions:', sessionsData.length);
        }
      } catch (err) {
        console.error('Cooking sessions load exception:', err);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const toggleFavorite = async (recipeId) => {
    if (!user) return;
    
    const isFavorite = favorites.includes(recipeId);
    
    try {
      if (isFavorite) {
        // Remove from favorites
        console.log('Removing favorite:', recipeId);
        const { error } = await supabase
          .from('user_favorites_bb2024')
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', recipeId);

        if (error) {
          console.error('Error removing favorite:', error);
          return;
        }
        
        setFavorites(prev => prev.filter(id => id !== recipeId));
      } else {
        // Add to favorites
        console.log('Adding favorite:', recipeId);
        const { error } = await supabase
          .from('user_favorites_bb2024')
          .insert({
            user_id: user.id,
            recipe_id: recipeId
          });

        if (error) {
          console.error('Error adding favorite:', error);
          return;
        }
        
        setFavorites(prev => [recipeId, ...prev]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const addToRecentlyViewed = async (recipeId) => {
    if (!user) return;
    
    try {
      console.log('Adding to recently viewed:', recipeId);
      // Use upsert to handle duplicates
      const { error } = await supabase
        .from('user_recent_bb2024')
        .upsert(
          {
            user_id: user.id,
            recipe_id: recipeId,
            viewed_at: new Date().toISOString()
          },
          { onConflict: 'user_id,recipe_id' }
        );

      if (error) {
        console.error('Error adding to recently viewed:', error);
        return;
      }
      
      setRecentlyViewed(prev => {
        const filtered = prev.filter(id => id !== recipeId);
        return [recipeId, ...filtered].slice(0, 10);
      });
    } catch (error) {
      console.error('Error adding to recently viewed:', error);
    }
  };

  // The rest of the functions remain the same
  const startCookingSession = async (recipe) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('cooking_sessions_bb2024')
        .insert({
          user_id: user.id,
          recipe_id: recipe.id,
          recipe_title: recipe.title,
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error starting cooking session:', error);
        return null;
      }
      
      if (data) {
        setCookingSessions(prev => [data, ...prev]);
        return data;
      }
      
      return null;
    } catch (error) {
      console.error('Error starting cooking session:', error);
      return null;
    }
  };

  const completeCookingSession = async (sessionId, rating = null, notes = null) => {
    if (!user) return;
    
    try {
      const completedAt = new Date().toISOString();
      
      const { error } = await supabase
        .from('cooking_sessions_bb2024')
        .update({
          completed_at: completedAt,
          rating,
          notes
        })
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error completing cooking session:', error);
        return;
      }
      
      setCookingSessions(prev => 
        prev.map(session => 
          session.id === sessionId 
            ? { ...session, completed_at: completedAt, rating, notes } 
            : session
        )
      );
    } catch (error) {
      console.error('Error completing cooking session:', error);
    }
  };

  // Filter and sorting functions
  const getFilteredRecipes = () => {
    let filtered = recipes.filter(recipe => {
      const matchesSearch = !searchQuery || 
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some(ing => ing.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
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

  // Helper getters
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
    const completedSessions = cookingSessions.filter(s => s.completed_at);
    
    return {
      totalRecipes: recipes.length,
      favoriteCount: favorites.length,
      recentCount: recentlyViewed.length,
      cookingSessionsCount: cookingSessions.length,
      completedSessionsCount: completedSessions.length,
      averageRating: completedSessions.length > 0 
        ? completedSessions.reduce((sum, s) => sum + (s.rating || 0), 0) / completedSessions.length 
        : 0,
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
    cookingSessions,
    searchQuery,
    filters,
    sortBy,
    
    // Actions
    setSearchQuery,
    setFilters,
    setSortBy,
    toggleFavorite,
    addToRecentlyViewed,
    startCookingSession,
    completeCookingSession,
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