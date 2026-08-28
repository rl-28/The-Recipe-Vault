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
  Sparkles,
  ArrowUpDown
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
  { label: 'Protocol Name', value: 'name' },
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
    <header className="sticky top-0 z-30 w-full vault-glass border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Upper Row: Brand, Search, Actions */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Security Status */}
          <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-vault-900 border border-vault-gold-500/40 flex items-center justify-center shadow-neon-gold">
                <Sparkles className="w-5 h-5 text-vault-gold-400" />
              </div>
              <div>
                <h1 className="text-base font-display font-bold text-white tracking-wider uppercase">
                  The Recipe <span className="text-gold-gradient">Vault</span>
                </h1>
                <div className="flex items-center space-x-2 text-[10px] font-mono text-vault-steel">
                  <span className="w-1.5 h-1.5 rounded-full bg-vault-emerald animate-pulse"></span>
                  <span>INNER CORE ARCHIVE // LEVEL 1</span>
                </div>
              </div>
            </div>

            {/* Mobile Sound & Lock buttons */}
            <div className="flex items-center space-x-2 md:hidden">
              <button
                onClick={handleMuteToggle}
                className="p-2 rounded-lg bg-vault-900 border border-white/10 text-neutral-300"
                aria-label="Toggle Sound"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-neutral-500" /> : <Volume2 className="w-4 h-4 text-vault-gold-400" />}
              </button>
              <button
                onClick={onLockVault}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-mono"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>LOCK</span>
              </button>
            </div>
          </div>

          {/* Search Bar Input */}
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-vault-steel">
              <Search className="w-4 h-4 text-vault-gold-500/70" />
            </div>
            <input
              id="vault-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search protocols, ingredients, origin, techniques..."
              className="w-full pl-10 pr-20 py-2 rounded-xl bg-vault-900/90 border border-white/10 text-sm text-neutral-100 placeholder-vault-steel/50 focus:outline-none focus:border-vault-gold-500/50 focus:ring-1 focus:ring-vault-gold-500/50 transition-all font-sans"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-vault-steel hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-vault-steel/60 bg-vault-800 border border-white/10 rounded">
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
              className="px-3 py-2 rounded-xl bg-vault-900 border border-white/10 hover:border-vault-gold-500/40 text-vault-gold-400 text-xs font-mono font-bold transition-all cursor-pointer"
              title="Toggle Metric and Imperial Measurement Units"
            >
              {unitSystem.toUpperCase()} UNITS
            </button>

            {/* Bookmarks Toggle */}
            <button
              onClick={handleBookmarkFilterToggle}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl border text-xs font-mono font-medium transition-all duration-200 cursor-pointer ${
                showBookmarksOnly
                  ? 'bg-vault-gold-500 text-vault-950 border-vault-gold-400 font-semibold shadow-neon-gold'
                  : 'bg-vault-900/80 text-neutral-300 border-white/10 hover:border-vault-gold-500/30 hover:text-vault-gold-300'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${showBookmarksOnly ? 'fill-current' : ''}`} />
              <span>SAVED ({bookmarkedIds.length})</span>
            </button>

            {/* Add Recipe Button */}
            <button
              onClick={() => {
                soundEngine.playTick(1400);
                setIsCreateModalOpen(true);
              }}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-vault-800/80 hover:bg-vault-700/80 border border-vault-gold-500/30 hover:border-vault-gold-400 text-vault-gold-300 text-xs font-mono font-medium transition-all cursor-pointer shadow-vault-card"
            >
              <Plus className="w-3.5 h-3.5 text-vault-gold-400" />
              <span>NEW PROTOCOL</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={handleMuteToggle}
              className="p-2.5 rounded-xl bg-vault-900 border border-white/10 text-neutral-300 hover:text-vault-gold-400 hover:border-vault-gold-500/30 transition-all cursor-pointer"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              aria-label="Toggle Sound"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-neutral-500" /> : <Volume2 className="w-4 h-4 text-vault-gold-400" />}
            </button>

            {/* Lock Vault (Return to 3D Landing) */}
            <button
              id="lock-vault-btn"
              onClick={() => {
                soundEngine.playTick(700);
                onLockVault();
              }}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 hover:border-red-500/60 text-red-300 text-xs font-mono font-medium transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-red-400" />
              <span>LOCK VAULT</span>
            </button>
          </div>
        </div>

        {/* Lower Row: Category Chips, Difficulty Filter & Sort Order */}
        <div className="mt-4 pt-3 border-t border-white/5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          {/* Categories Pill Carousel */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 lg:pb-0 w-full lg:w-auto">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wide whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    active
                      ? 'bg-vault-gold-500/20 text-vault-gold-300 border border-vault-gold-500/50 shadow-neon-gold font-semibold'
                      : 'bg-vault-900/60 text-vault-steel hover:text-neutral-200 border border-white/5 hover:border-white/15'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Difficulty, Sort & Result Count */}
          <div className="flex flex-wrap items-center space-x-3 w-full lg:w-auto justify-between lg:justify-end text-xs font-mono text-vault-steel gap-2">
            {/* Sort Order Selector */}
            <div className="flex items-center space-x-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-vault-gold-500/70" />
              <span className="text-[11px] text-vault-steel/80">SORT:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  soundEngine.playTick(1100);
                  setSortBy(e.target.value as SortOption);
                }}
                className="bg-vault-900 border border-white/10 text-neutral-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-vault-gold-500 cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-vault-950 text-neutral-200">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center space-x-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-vault-gold-500/70" />
              <span className="text-[11px] text-vault-steel/80">DIFFICULTY:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => {
                  soundEngine.playTick(1100);
                  setSelectedDifficulty(e.target.value as 'All' | RecipeDifficulty);
                }}
                className="bg-vault-900 border border-white/10 text-neutral-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-vault-gold-500 cursor-pointer"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d} className="bg-vault-950 text-neutral-200">
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-[11px] text-vault-gold-400 font-semibold pl-1">
              {filteredRecipes.length} PROTOCOL{filteredRecipes.length === 1 ? '' : 'S'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
