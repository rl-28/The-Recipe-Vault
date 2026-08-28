export type RecipeCategory = 
  | 'All Archives'
  | 'Sous-Vide & Meats'
  | 'Artisan Bakery'
  | 'Pastry & Desserts'
  | 'Signature Cocktails'
  | 'Modern Gastronomy'
  | 'Fermentation & Curing';

export type RecipeDifficulty = 'Master' | 'Advanced' | 'Intermediate';

export type UnitSystem = 'metric' | 'imperial';

export type SortOption = 'rating' | 'prepTime' | 'calories' | 'difficulty' | 'name';

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  notes?: string;
}

export interface CookingStep {
  id: string;
  stepNumber: number;
  title: string;
  instruction: string;
  timerDurationSec?: number;
  timerLabel?: string;
  chefTip?: string;
}

export interface NutritionInfo {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG?: number;
}

export interface WinePairing {
  beverageName: string;
  type: string;
  vintageOrOrigin: string;
  tastingNote: string;
}

export interface Recipe {
  id: string;
  vaultCode: string;
  title: string;
  subtitle: string;
  category: Exclude<RecipeCategory, 'All Archives'>;
  difficulty: RecipeDifficulty;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  calories: number;
  servings: number;
  rating: number;
  reviewsCount: number;
  isClassified?: boolean;
  imageUrl: string;
  chefNotes: string;
  origin: string;
  flavorProfile: string[];
  equipment: string[];
  ingredients: Ingredient[];
  steps: CookingStep[];
  nutrition?: NutritionInfo;
  winePairing?: WinePairing;
  createdAt?: string;
}
