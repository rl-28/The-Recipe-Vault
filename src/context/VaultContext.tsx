import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { Recipe, RecipeCategory, RecipeDifficulty, UnitSystem, SortOption, SidebarTab } from '../types/recipe';
import { INITIAL_RECIPES } from '../data/recipes';

interface VaultContextType {
  recipes: Recipe[];
  filteredRecipes: Recipe[];
  selectedCategory: RecipeCategory;
  setSelectedCategory: (cat: RecipeCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDifficulty: 'All' | RecipeDifficulty;
  setSelectedDifficulty: (diff: 'All' | RecipeDifficulty) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => void;
  toggleUnitSystem: () => void;
  activeSidebarTab: SidebarTab;
  setActiveSidebarTab: (tab: SidebarTab) => void;
  bookmarkedIds: string[];
  toggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  showBookmarksOnly: boolean;
  setShowBookmarksOnly: (show: boolean) => void;
  selectedRecipe: Recipe | null;
  setSelectedRecipe: (recipe: Recipe | null) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  addNewRecipe: (recipe: Recipe) => void;
  isChefModeActive: boolean;
  activeChefRecipe: Recipe | null;
  startChefMode: (recipe: Recipe) => void;
  exitChefMode: () => void;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export const VaultProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    try {
      const saved = localStorage.getItem('recipe_vault_custom_recipes');
      if (saved) {
        const custom = JSON.parse(saved);
        return [...INITIAL_RECIPES, ...custom];
      }
    } catch {
      // ignore
    }
    return INITIAL_RECIPES;
  });

  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory>('All Recipes');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | RecipeDifficulty>('All');
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState<boolean>(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>('all');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Chef Mode state
  const [isChefModeActive, setIsChefModeActive] = useState<boolean>(false);
  const [activeChefRecipe, setActiveChefRecipe] = useState<Recipe | null>(null);

  // Unit System state (Metric vs Imperial)
  const [unitSystem, setUnitSystem] = useState<UnitSystem>(() => {
    try {
      const saved = localStorage.getItem('recipe_vault_unit_system');
      if (saved === 'metric' || saved === 'imperial') return saved;
    } catch {
      // ignore
    }
    return 'metric';
  });

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('recipe_vault_bookmarks');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['vault-rc-01', 'vault-rc-03', 'vault-rc-07'];
  });

  // Persist bookmarks
  useEffect(() => {
    localStorage.setItem('recipe_vault_bookmarks', JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  // Persist unit system
  useEffect(() => {
    localStorage.setItem('recipe_vault_unit_system', unitSystem);
  }, [unitSystem]);

  const toggleUnitSystem = () => {
    setUnitSystem((prev) => (prev === 'metric' ? 'imperial' : 'metric'));
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isBookmarked = (id: string) => bookmarkedIds.includes(id);

  const addNewRecipe = (newRec: Recipe) => {
    setRecipes((prev) => {
      const updated = [newRec, ...prev];
      const customOnly = updated.filter(
        (r) => !INITIAL_RECIPES.some((init) => init.id === r.id)
      );
      localStorage.setItem('recipe_vault_custom_recipes', JSON.stringify(customOnly));
      return updated;
    });
  };

  const startChefMode = (recipe: Recipe) => {
    setActiveChefRecipe(recipe);
    setIsChefModeActive(true);
  };

  const exitChefMode = () => {
    setIsChefModeActive(false);
    setActiveChefRecipe(null);
  };

  // Helper to extract minutes from strings
  const parseTimeToMinutes = (timeStr: string): number => {
    const lower = timeStr.toLowerCase();
    let mins = 0;
    const hourMatch = lower.match(/(\d+(\.\d+)?)\s*h/);
    if (hourMatch) mins += parseFloat(hourMatch[1]) * 60;
    const minMatch = lower.match(/(\d+(\.\d+)?)\s*m/);
    if (minMatch) mins += parseFloat(minMatch[1]);
    return mins || 60;
  };

  // Filtered and Sorted recipes
  const filteredRecipes = useMemo(() => {
    const isCollectionsTab = activeSidebarTab === 'collections';
    const isAtelierTab = activeSidebarTab === 'atelier';

    const filtered = recipes.filter((r) => {
      // Sidebar Tab check
      if (isCollectionsTab && !bookmarkedIds.includes(r.id)) {
        return false;
      }
      if (isAtelierTab && !r.isClassified) {
        return false;
      }

      // Category check
      if (selectedCategory !== 'All Recipes' && r.category !== selectedCategory) {
        return false;
      }

      // Difficulty check
      if (selectedDifficulty !== 'All' && r.difficulty !== selectedDifficulty) {
        return false;
      }

      // Bookmarks check
      if (showBookmarksOnly && !bookmarkedIds.includes(r.id)) {
        return false;
      }

      // Search query check
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const inTitle = r.title.toLowerCase().includes(q);
        const inSubtitle = r.subtitle.toLowerCase().includes(q);
        const inOrigin = r.origin.toLowerCase().includes(q);
        const inCode = r.vaultCode.toLowerCase().includes(q);
        const inFlavors = r.flavorProfile.some((f) => f.toLowerCase().includes(q));
        const inIngredients = r.ingredients.some((ing) =>
          ing.name.toLowerCase().includes(q)
        );
        if (!inTitle && !inSubtitle && !inOrigin && !inCode && !inIngredients && !inFlavors) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    return filtered.sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'calories') {
        return a.calories - b.calories;
      }
      if (sortBy === 'prepTime') {
        return parseTimeToMinutes(a.prepTime) - parseTimeToMinutes(b.prepTime);
      }
      if (sortBy === 'difficulty') {
        const diffRank: Record<RecipeDifficulty, number> = { Master: 3, Advanced: 2, Intermediate: 1 };
        return diffRank[b.difficulty] - diffRank[a.difficulty];
      }
      if (sortBy === 'name') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [recipes, activeSidebarTab, selectedCategory, selectedDifficulty, showBookmarksOnly, bookmarkedIds, searchQuery, sortBy]);

  return (
    <VaultContext.Provider
      value={{
        recipes,
        filteredRecipes,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedDifficulty,
        setSelectedDifficulty,
        sortBy,
        setSortBy,
        unitSystem,
        setUnitSystem,
        toggleUnitSystem,
        activeSidebarTab,
        setActiveSidebarTab,
        bookmarkedIds,
        toggleBookmark,
        isBookmarked,
        showBookmarksOnly,
        setShowBookmarksOnly,
        selectedRecipe,
        setSelectedRecipe,
        isCreateModalOpen,
        setIsCreateModalOpen,
        addNewRecipe,
        isChefModeActive,
        activeChefRecipe,
        startChefMode,
        exitChefMode,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
};

export const useVault = () => {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error('useVault must be used within a VaultProvider');
  }
  return context;
};
