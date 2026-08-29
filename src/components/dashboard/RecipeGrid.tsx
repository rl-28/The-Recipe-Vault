import React from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, RotateCcw, Sparkles } from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { RecipeCard } from './RecipeCard';
import { soundEngine } from '../../utils/soundEngine';

export const RecipeGrid: React.FC = () => {
  const {
    filteredRecipes,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    selectedDifficulty,
    setSelectedDifficulty,
    sortBy,
    setSortBy,
    showBookmarksOnly,
    setShowBookmarksOnly,
  } = useVault();

  const handleResetFilters = () => {
    soundEngine.playTick(1000);
    setSelectedCategory('All Archives');
    setSearchQuery('');
    setSelectedDifficulty('All');
    setSortBy('rating');
    setShowBookmarksOnly(false);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Category Banner & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8 pb-4 border-b border-stone-200/70 font-sans">
        <div>
          <div className="flex items-center space-x-2 text-xs text-amber-600 font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {showBookmarksOnly ? 'Your Saved Favorites' : selectedCategory}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1 font-normal">
            {showBookmarksOnly
              ? 'Recipes saved directly to your personal collection'
              : `Browsing ${filteredRecipes.length} handcrafted ${filteredRecipes.length === 1 ? 'recipe' : 'recipes'}`}
          </p>
        </div>

        {/* Active Filters Tag Pills */}
        {(selectedCategory !== 'All Archives' ||
          searchQuery ||
          selectedDifficulty !== 'All' ||
          sortBy !== 'rating' ||
          showBookmarksOnly) && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-stone-500">Active Filters</span>
            <button
              onClick={handleResetFilters}
              className="flex items-center space-x-1 px-3 py-1 rounded-xl bg-white border border-stone-200 hover:border-amber-400 text-stone-700 hover:text-amber-700 text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid or Empty State */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredRecipes.map((recipe, index) => (
            <RecipeCard key={recipe.id} recipe={recipe} index={index} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center text-center py-20 px-4 rounded-3xl bg-white border border-stone-200/80 shadow-sm my-8"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4 shadow-sm">
            <UtensilsCrossed className="w-8 h-8 text-amber-500" />
          </div>

          <h3 className="text-lg sm:text-xl font-bold font-sans text-stone-900">
            No Matching Recipes Found
          </h3>

          <p className="mt-2 text-sm text-stone-500 max-w-md font-normal">
            We couldn't find any recipes matching "{searchQuery}". Try clearing some filters or searching for something else.
          </p>

          <button
            onClick={handleResetFilters}
            className="mt-6 flex items-center space-x-2 px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-sans font-semibold transition-all cursor-pointer shadow-md shadow-amber-500/20"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear Filters</span>
          </button>
        </motion.div>
      )}
    </main>
  );
};
