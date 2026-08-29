import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Lock, 
  Bookmark, 
  Plus, 
  Volume2, 
  VolumeX, 
  SlidersHorizontal,
  X,
  ArrowUpDown,
  ChefHat
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import type { RecipeCategory, RecipeDifficulty, SortOption } from '../../types/recipe';
import { soundEngine } from '../../utils/soundEngine';

interface VaultHeaderProps {
  onLockVault: () => void;
}

const CATEGORIES: RecipeCategory[] = [
  'All Archives',
  'Sous-Vide & Meats',
  'Artisan Bakery',
  'Pastry & Desserts',
  'Signature Cocktails',
  'Modern Gastronomy',
  'Fermentation & Curing',
];

const DIFFICULTIES: ('All' | RecipeDifficulty)[] = [
  'All',
  'Master',
  'Advanced',
  'Intermediate',
];

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Fastest Prep', value: 'prepTime' },
  { label: 'Lowest Calorie', value: 'calories' },
  { label: 'Mastery Rank', value: 'difficulty' },
  { label: 'Recipe Name', value: 'name' },
];

export const VaultHeader: React.FC<VaultHeaderProps> = ({ onLockVault }) => {
  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    selectedDifficulty,
    setSelectedDifficulty,
    sortBy,
    setSortBy,
    unitSystem,
    toggleUnitSystem,
    bookmarkedIds,
    showBookmarksOnly,
    setShowBookmarksOnly,
    setIsCreateModalOpen,
    filteredRecipes,
  } = useVault();

  const [isMuted, setIsMuted] = useState(soundEngine.getIsMuted());

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

  const handleMuteToggle = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleCategoryClick = (cat: RecipeCategory) => {
    soundEngine.playTick(1000);
    setSelectedCategory(cat);
  };

  const handleBookmarkFilterToggle = () => {
    soundEngine.playTick(1200);
    setShowBookmarksOnly(!showBookmarksOnly);
  };

  return (
    <header className="sticky top-0 z-30 w-full vault-glass border-b border-stone-200/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Upper Row: Brand, Search, Actions */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Security Status */}
          <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-sm">
                <ChefHat className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h1 className="text-base font-sans font-bold text-stone-900 tracking-tight">
                  The Recipe <span className="text-gold-gradient">Vault</span>
                </h1>
                <div className="flex items-center space-x-1.5 text-[11px] font-sans text-stone-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Artisanal Collection</span>
                </div>
              </div>
            </div>

            {/* Mobile Sound & Lock buttons */}
            <div className="flex items-center space-x-2 md:hidden">
              <button
                onClick={handleMuteToggle}
                className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 shadow-sm"
                aria-label="Toggle Sound"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-amber-600" />}
              </button>
              <button
                onClick={onLockVault}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 text-xs font-sans font-medium"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Close</span>
              </button>
            </div>
          </div>

          {/* Search Bar Input */}
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Search className="w-4 h-4 text-amber-500" />
            </div>
            <input
              id="vault-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes, ingredients, origin, techniques..."
              className="w-full pl-10 pr-20 py-2.5 rounded-2xl bg-white border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all font-sans shadow-sm"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-sans text-stone-400 bg-stone-100 border border-stone-200 rounded-md">
                  /
                </kbd>
              </div>
            )}
          </div>

          {/* Action Buttons: Unit Toggle, Saved Filter, New Recipe, Sound, Lock Vault */}
          <div className="hidden md:flex items-center space-x-2.5">
            {/* Unit System Toggle Button */}
            <button
              onClick={() => {
                soundEngine.playTick(1100);
                toggleUnitSystem();
              }}
              className="px-3.5 py-2 rounded-xl bg-white border border-stone-200 hover:border-amber-300 text-stone-700 hover:text-amber-700 text-xs font-sans font-semibold transition-all cursor-pointer shadow-sm"
              title="Toggle Metric and Imperial Measurement Units"
            >
              {unitSystem === 'metric' ? 'Metric (g, ml)' : 'Imperial (oz, lbs)'}
            </button>

            {/* Bookmarks Toggle */}
            <button
              onClick={handleBookmarkFilterToggle}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl border text-xs font-sans font-semibold transition-all duration-200 cursor-pointer shadow-sm ${
                showBookmarksOnly
                  ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-amber-300 hover:text-amber-700'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${showBookmarksOnly ? 'fill-current' : ''}`} />
              <span>Saved ({bookmarkedIds.length})</span>
            </button>

            {/* Add Recipe Button */}
            <button
              onClick={() => {
                soundEngine.playTick(1400);
                setIsCreateModalOpen(true);
              }}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-sans font-semibold transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-amber-600" />
              <span>New Recipe</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={handleMuteToggle}
              className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-amber-600 hover:border-amber-300 transition-all cursor-pointer shadow-sm"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              aria-label="Toggle Sound"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-amber-600" />}
            </button>

            {/* Lock Vault (Return to 3D Landing) */}
            <button
              id="lock-vault-btn"
              onClick={() => {
                soundEngine.playTick(700);
                onLockVault();
              }}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 text-xs font-sans font-medium transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-stone-500" />
              <span>Close Vault</span>
            </button>
          </div>
        </div>

        {/* Lower Row: Category Chips, Difficulty Filter & Sort Order */}
        <div className="mt-4 pt-3 border-t border-stone-200/60 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          {/* Categories Pill Carousel */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 lg:pb-0 w-full lg:w-auto">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-sans tracking-wide whitespace-nowrap transition-all duration-200 cursor-pointer shadow-xs ${
                    active
                      ? 'bg-amber-500 text-white font-semibold shadow-sm'
                      : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Difficulty, Sort & Result Count */}
          <div className="flex flex-wrap items-center space-x-3 w-full lg:w-auto justify-between lg:justify-end text-xs font-sans text-stone-600 gap-2">
            {/* Sort Order Selector */}
            <div className="flex items-center space-x-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-[11px] text-stone-500 font-medium">SORT:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  soundEngine.playTick(1100);
                  setSortBy(e.target.value as SortOption);
                }}
                className="bg-white border border-stone-200 text-stone-800 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-amber-400 cursor-pointer shadow-xs"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-white text-stone-800">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center space-x-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-[11px] text-stone-500 font-medium">LEVEL:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => {
                  soundEngine.playTick(1100);
                  setSelectedDifficulty(e.target.value as 'All' | RecipeDifficulty);
                }}
                className="bg-white border border-stone-200 text-stone-800 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-amber-400 cursor-pointer shadow-xs"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d} className="bg-white text-stone-800">
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs text-amber-700 font-semibold pl-1">
              {filteredRecipes.length} {filteredRecipes.length === 1 ? 'Recipe' : 'Recipes'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
