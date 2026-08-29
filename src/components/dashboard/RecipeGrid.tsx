import React from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, RotateCcw } from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { RecipeCard } from './RecipeCard';
import { MealPlannerView } from './MealPlannerView';
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
    activeSidebarTab,
  } = useVault();

  const handleResetFilters = () => {
    soundEngine.playTick(1000);
    setSelectedCategory('All Recipes');
    setSearchQuery('');
    setSelectedDifficulty('All');
    setSortBy('rating');
  };

  // If in Meal Planner tab, render MealPlannerView
  if (activeSidebarTab === 'planner') {
    return <MealPlannerView />;
  }

  const getTabTitle = () => {
    if (activeSidebarTab === 'collections') return 'Saved Recipe Favorites 💖';
    if (activeSidebarTab === 'atelier') return 'Private Chef Secret Formulations 🔐';
    if (selectedCategory !== 'All Recipes') return `${selectedCategory} Collection 🍳`;
    return 'All Artisanal Vault Recipes 📖';
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Category Banner & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b-2 border-black">
        <div>
          <h2 className="text-xl sm:text-2xl font-hand font-extrabold text-black">
            {getTabTitle()}
          </h2>
          <p className="text-xs font-doodle font-bold text-stone-600 mt-0.5">
            {activeSidebarTab === 'collections'
              ? `You have saved ${filteredRecipes.length} recipes to your personal sketchbook`
              : `Browsing ${filteredRecipes.length} hand-crafted recipes`}
          </p>
        </div>

        {/* Reset Filters Pill */}
        {(selectedCategory !== 'All Recipes' ||
          searchQuery ||
          selectedDifficulty !== 'All' ||
          sortBy !== 'rating') && (
          <button
            onClick={handleResetFilters}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-2xl bg-[#FFAAA6] border-2 border-black font-hand font-bold text-xs text-black shadow-[2px_2px_0px_#000] hover:bg-rose-300 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Grid or Empty State */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 pb-12">
          {filteredRecipes.map((recipe, index) => (
            <RecipeCard key={recipe.id} recipe={recipe} index={index} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center text-center py-20 px-6 rounded-3xl bg-[#FFFDF8] border-[2.5px] border-black shadow-[4px_4px_0px_#000] my-8"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#FFE68C] border-2 border-black flex items-center justify-center mb-4 shadow-[2px_2px_0px_#000]">
            <UtensilsCrossed className="w-8 h-8 text-black stroke-[2.2]" />
          </div>

          <h3 className="text-xl font-hand font-extrabold text-black">
            No Tasty Dishes Found!
          </h3>

          <p className="mt-2 text-xs font-doodle font-bold text-stone-600 max-w-md">
            {searchQuery
              ? `We couldn't find any recipes matching "${searchQuery}". Try searching for another ingredient or keyword.`
              : 'There are no recipes matching the selected filters.'}
          </p>

          <button
            onClick={handleResetFilters}
            className="mt-6 flex items-center space-x-2 px-6 py-2.5 rounded-2xl bg-[#FFE68C] border-2 border-black font-hand font-bold text-xs text-black shadow-[2px_2px_0px_#000] hover:bg-amber-300 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            <span>Clear Filters</span>
          </button>
        </motion.div>
      )}
    </div>
  );
};
