import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Flame, Users, Bookmark, ChefHat, Sparkles, Wine, ArrowRight } from 'lucide-react';
import type { Recipe } from '../../types/recipe';
import { useVault } from '../../context/VaultContext';
import { soundEngine } from '../../utils/soundEngine';

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, index }) => {
  const { toggleBookmark, isBookmarked, setSelectedRecipe } = useVault();
  const bookmarked = isBookmarked(recipe.id);

  const handleCardClick = () => {
    soundEngine.playTick(1300);
    setSelectedRecipe(recipe);
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playTick(bookmarked ? 600 : 1500);
    toggleBookmark(recipe.id);
  };

  // Pastel sticker colors
  const difficultyColors = {
    Master: 'bg-[#FFAAA6] text-black',
    Advanced: 'bg-[#BBE1FA] text-black',
    Intermediate: 'bg-[#D4F1F4] text-black',
  }[recipe.difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
    >
      <div
        onClick={handleCardClick}
        onMouseEnter={() => soundEngine.playTick(800)}
        className="group relative flex flex-col h-full bg-[#FFFDF8] border-[2.5px] border-black rounded-3xl p-4 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] transition-all duration-200 cursor-pointer select-none font-sans"
      >
        {/* Food Image Container with Black Outline */}
        <div className="relative w-full h-52 overflow-hidden rounded-2xl border-2 border-black bg-stone-100">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Top Badges: Category & Bookmark */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
            <span className="px-3 py-1 rounded-xl bg-[#FFE68C] border-2 border-black text-xs font-hand font-bold text-black shadow-[2px_2px_0px_#000]">
              {recipe.category}
            </span>

            <button
              onClick={handleBookmarkClick}
              className={`p-2 rounded-full border-2 border-black transition-all duration-150 cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                bookmarked
                  ? 'bg-[#FFAAA6] text-black scale-110'
                  : 'bg-white text-black hover:bg-[#FFE68C]'
              }`}
              title={bookmarked ? 'Remove from Saved' : 'Save Recipe'}
            >
              <Bookmark className={`w-3.5 h-3.5 stroke-[2.5] ${bookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Bottom Badges on Image */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-lg bg-white/95 border-2 border-black text-[11px] font-hand font-bold text-black shadow-[1.5px_1.5px_0px_#000] flex items-center space-x-1 truncate max-w-[60%]">
              <ChefHat className="w-3.5 h-3.5 text-black stroke-[2.5]" />
              <span className="truncate">{recipe.origin}</span>
            </span>

            <span className={`px-2.5 py-0.5 rounded-lg border-2 border-black text-[11px] font-hand font-bold shadow-[1.5px_1.5px_0px_#000] ${difficultyColors}`}>
              {recipe.difficulty}
            </span>
          </div>
        </div>

        {/* Recipe Content Details */}
        <div className="flex flex-col flex-1 pt-4 justify-between space-y-3">
          <div>
            <h3 className="text-base sm:text-lg font-hand font-extrabold text-black group-hover:text-amber-900 transition-colors line-clamp-1">
              {recipe.title}
            </h3>

            <p className="mt-1 text-xs font-doodle font-bold text-stone-600 line-clamp-2 leading-relaxed">
              {recipe.subtitle}
            </p>
          </div>

          {/* Flavor Profile Tags & Wine Badge */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {recipe.flavorProfile.slice(0, 2).map((flavor, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-lg bg-[#FAF7F0] border border-black text-[11px] font-hand font-bold text-black shadow-[1px_1px_0px_#000]"
              >
                🏷️ {flavor}
              </span>
            ))}
            {recipe.winePairing && (
              <span className="px-2 py-0.5 rounded-lg bg-[#E8D7F1] border border-black text-[11px] font-hand font-bold text-black shadow-[1px_1px_0px_#000] flex items-center space-x-1">
                <Wine className="w-2.5 h-2.5" />
                <span>Pairing</span>
              </span>
            )}
          </div>

          {/* Footer Metadata: Time, Energy, Servings & Action */}
          <div className="pt-3 border-t-2 border-black flex items-center justify-between text-xs font-hand font-bold text-black">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1" title="Cook Time">
                <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{recipe.cookTime}</span>
              </div>
              <div className="flex items-center space-x-1" title="Calories">
                <Flame className="w-3.5 h-3.5 text-rose-500 stroke-[2.5]" />
                <span>{recipe.calories} kcal</span>
              </div>
              <div className="flex items-center space-x-1" title="Yield">
                <Users className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{recipe.servings}P</span>
              </div>
            </div>

            <div className="flex items-center space-x-1 text-black font-extrabold group-hover:translate-x-1 transition-transform">
              <span>Cook</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
        </div>

        {/* Signature Ribbon Tag */}
        {recipe.isClassified && (
          <div className="absolute -top-2 -right-2 pointer-events-none">
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#FFE68C] border-2 border-black text-[10px] font-hand font-extrabold text-black shadow-[2px_2px_0px_#000]">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Chef's Choice</span>
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
