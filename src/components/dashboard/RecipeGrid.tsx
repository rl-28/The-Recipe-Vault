import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, RotateCcw, Sparkles } from 'lucide-react';
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8 pb-4 border-b border-white/5 font-mono">
        <div>
          <div className="flex items-center space-x-2 text-xs text-vault-gold-400 font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {showBookmarksOnly ? 'Private Vault Bookmarks' : selectedCategory}
            </span>
          </div>
          <p className="text-xs text-vault-steel mt-1 font-light">
            {showBookmarksOnly
              ? 'Classified protocols saved exclusively to your chef station'
              : `Accessing ${filteredRecipes.length} verified culinary formulation${filteredRecipes.length === 1 ? '' : 's'}`}
          </p>
        </div>

        {/* Active Filters Tag Pills */}
        {(selectedCategory !== 'All Archives' ||
          searchQuery ||
          selectedDifficulty !== 'All' ||
          sortBy !== 'rating' ||
          showBookmarksOnly) && (
          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-vault-steel">FILTERS ACTIVE</span>
            <button
              onClick={handleResetFilters}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-vault-900 border border-white/10 hover:border-vault-gold-500/40 text-vault-gold-300 text-xs transition-colors cursor-pointer"
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
          className="flex flex-col items-center justify-center text-center py-24 px-4 rounded-3xl vault-glass border border-white/10 my-8"
        >
          <div className="w-16 h-16 rounded-2xl bg-vault-900 border border-red-500/30 flex items-center justify-center mb-4 shadow-vault-glow">
            <ShieldAlert className="w-8 h-8 text-red-400" />
          </div>

          <h3 className="text-lg sm:text-xl font-bold font-sans text-white uppercase tracking-wide">
            No Matching Vault Protocols
          </h3>

          <p className="mt-2 text-sm text-vault-steel max-w-md font-light">
            No culinary formulas matched your current search query "{searchQuery}" or filter constraints.
          </p>

          <button
            onClick={handleResetFilters}
            className="mt-6 flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-vault-800 hover:bg-vault-700 text-vault-gold-300 border border-vault-gold-500/40 text-xs font-mono font-semibold transition-all cursor-pointer shadow-vault-card"
          >
            <RotateCcw className="w-4 h-4" />
            <span>CLEAR ALL FILTERS</span>
          </button>
        </motion.div>
      )}
    </main>
  );
};
