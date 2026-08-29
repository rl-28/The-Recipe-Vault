import React, { useEffect } from 'react';
import { 
  Search, 
  Plus, 
  SlidersHorizontal, 
  X, 
  ArrowUpDown 
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import type { RecipeCategory, RecipeDifficulty, SortOption } from '../../types/recipe';
import { soundEngine } from '../../utils/soundEngine';

const CATEGORIES: RecipeCategory[] = [
  'All Recipes',
  'Main Dishes',
  'Artisan Bakery',
  'Sweet Desserts',
  'Cozy Drinks',
  'Quick Bites',
  'Sauces & Ferments',
];

const DIFFICULTIES: ('All' | RecipeDifficulty)[] = [
  'All',
  'Master',
  'Advanced',
  'Intermediate',
];

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Highest Rated ⭐', value: 'rating' },
  { label: 'Fastest Prep ⏱️', value: 'prepTime' },
  { label: 'Lowest Calorie 🥗', value: 'calories' },
  { label: 'Mastery Rank 👑', value: 'difficulty' },
  { label: 'Recipe Name 🔤', value: 'name' },
];

export const VaultHeader: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    selectedDifficulty,
    setSelectedDifficulty,
    sortBy,
    setSortBy,
    setIsCreateModalOpen,
    filteredRecipes,
    activeSidebarTab,
  } = useVault();

  // Keyboard shortcut listener for search focus ('/' or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k') || (e.metaKey && e.key === 'k')) && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        document.getElementById('vault-search-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCategoryClick = (cat: RecipeCategory) => {
    soundEngine.playTick(1000);
    setSelectedCategory(cat);
  };

  return (
    <header className="sticky top-0 z-10 w-full bg-[#FAF7F0]/95 backdrop-blur-md pb-4 pt-6 select-none font-sans">
      {/* Top Search & Actions Row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Bar Input */}
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-black">
            <Search className="w-4 h-4 text-black stroke-[2.5]" />
          </div>
          <input
            id="vault-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recipes, ingredients, chef notes..."
            className="w-full pl-10 pr-20 py-2.5 rounded-2xl bg-white border-[2.5px] border-black text-sm text-black placeholder-stone-400 focus:outline-none focus:bg-[#FFFDF8] font-hand font-bold shadow-[2px_2px_0px_#000] transition-all"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-black hover:text-rose-600 cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          ) : (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-black bg-[#FFE68C] border border-black rounded-md">
                /
              </kbd>
            </div>
          )}
        </div>

        {/* Add Recipe Button & Tab Title */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => {
              soundEngine.playTick(1400);
              setIsCreateModalOpen(true);
            }}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-[#FFE68C] border-2 border-black font-hand font-bold text-xs text-black shadow-[2px_2px_0px_#000] hover:bg-amber-300 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Recipe</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Filters (Visible for 'all', 'collections', 'atelier' tabs) */}
      {activeSidebarTab !== 'planner' && (
        <div className="mt-4 pt-3 border-t-2 border-black flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          {/* Categories Pill Carousel */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 lg:pb-0 w-full lg:w-auto">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`px-3.5 py-1.5 rounded-2xl text-xs font-hand font-bold tracking-wide whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    active
                      ? 'bg-[#FFE68C] border-2 border-black text-black shadow-[2px_2px_0px_#000] translate-y-[-1px]'
                      : 'bg-white text-stone-700 hover:text-black border-2 border-black hover:bg-[#FAF7F0] shadow-[1.5px_1.5px_0px_#000]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Difficulty, Sort & Count */}
          <div className="flex flex-wrap items-center space-x-3 w-full lg:w-auto justify-between lg:justify-end text-xs font-hand text-black gap-2">
            {/* Sort Selector */}
            <div className="flex items-center space-x-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-black stroke-[2.5]" />
              <span className="text-[11px] font-bold text-stone-600">SORT:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  soundEngine.playTick(1100);
                  setSortBy(e.target.value as SortOption);
                }}
                className="bg-white border-2 border-black text-black rounded-xl px-2.5 py-1 text-xs font-bold focus:outline-none cursor-pointer shadow-[1.5px_1.5px_0px_#000]"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-white text-black font-sans">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center space-x-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-black stroke-[2.5]" />
              <span className="text-[11px] font-bold text-stone-600">LEVEL:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => {
                  soundEngine.playTick(1100);
                  setSelectedDifficulty(e.target.value as 'All' | RecipeDifficulty);
                }}
                className="bg-white border-2 border-black text-black rounded-xl px-2.5 py-1 text-xs font-bold focus:outline-none cursor-pointer shadow-[1.5px_1.5px_0px_#000]"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d} className="bg-white text-black font-sans">
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="px-2.5 py-1 rounded-xl bg-[#D4F1F4] border-2 border-black font-bold text-xs text-black shadow-[1.5px_1.5px_0px_#000]">
              {filteredRecipes.length} {filteredRecipes.length === 1 ? 'Dish' : 'Dishes'}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
