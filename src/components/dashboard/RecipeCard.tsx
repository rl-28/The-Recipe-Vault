import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Flame, Users, Bookmark, ChefHat, ChevronRight, Wine, Sparkles } from 'lucide-react';
import type { Recipe } from '../../types/recipe';
import { useVault } from '../../context/VaultContext';
import { soundEngine } from '../../utils/soundEngine';

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, index }) => {
  const { toggleBookmark, isBookmarked, setSelectedRecipe } = useVault();
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const bookmarked = isBookmarked(recipe.id);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Specular light coordinates
    cardRef.current.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    cardRef.current.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);

    // 3D Tilt calculation
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const handleCardClick = () => {
    soundEngine.playTick(1300);
    setSelectedRecipe(recipe);
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playTick(bookmarked ? 600 : 1500);
    toggleBookmark(recipe.id);
  };

  // Difficulty badge colors in soft pastels
  const difficultyStyle = {
    Master: 'bg-amber-50 text-amber-800 border-amber-200/80',
    Advanced: 'bg-sky-50 text-sky-800 border-sky-200/80',
    Intermediate: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
  }[recipe.difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="perspective-1000"
    >
      <div
        ref={cardRef}
        onClick={handleCardClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => soundEngine.playTick(800)}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(1, 1, 1)`,
          transition: 'transform 0.15s ease-out, box-shadow 0.3s ease',
        }}
        className="group relative flex flex-col h-full rounded-3xl bg-white p-4 border border-stone-100 shadow-md hover:shadow-xl hover:-translate-y-1 cursor-pointer overflow-hidden transition-all duration-300 vault-card-specular select-none"
      >
        {/* Top Image Container with Rounded Corners */}
        <div className="relative w-full h-56 overflow-hidden rounded-2xl bg-stone-100">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
          />

          {/* Subtle Vignette Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent"></div>

          {/* Top Badges: Category & Bookmark */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-sans font-semibold text-stone-800 shadow-xs">
              {recipe.category}
            </span>

            <button
              onClick={handleBookmarkClick}
              className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer shadow-xs ${
                bookmarked
                  ? 'bg-amber-500 text-white scale-110 shadow-md'
                  : 'bg-white/90 text-stone-600 hover:text-amber-600 hover:bg-white'
              }`}
              title={bookmarked ? 'Remove from Saved' : 'Save Recipe'}
              aria-label="Bookmark Recipe"
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Bottom of Image: Origin & Difficulty */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="text-xs font-sans text-white/90 font-medium tracking-wide flex items-center space-x-1 drop-shadow-sm">
              <ChefHat className="w-3.5 h-3.5 text-amber-300" />
              <span className="truncate">{recipe.origin}</span>
            </span>

            <span
              className={`px-2.5 py-0.5 rounded-full border text-[11px] font-sans font-semibold tracking-wide ${difficultyStyle}`}
            >
              {recipe.difficulty}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-1 pt-4 justify-between space-y-3">
          <div>
            <h3 className="text-lg font-bold text-stone-900 group-hover:text-amber-600 transition-colors duration-200 line-clamp-1 font-sans">
              {recipe.title}
            </h3>

            <p className="mt-1 text-xs text-stone-500 line-clamp-2 leading-relaxed font-normal">
              {recipe.subtitle}
            </p>
          </div>

          {/* Flavor Profile Tags & Wine Badge */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {recipe.flavorProfile.slice(0, 3).map((flavor, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-stone-50 border border-stone-100 text-[11px] font-sans text-stone-600"
              >
                {flavor}
              </span>
            ))}
            {recipe.winePairing && (
              <span className="px-2 py-0.5 rounded-lg bg-purple-50 border border-purple-100 text-[11px] font-sans text-purple-700 flex items-center space-x-1">
                <Wine className="w-2.5 h-2.5" />
                <span>Pairing</span>
              </span>
            )}
          </div>

          {/* Metadata Footer: Prep, Cook Time, Yield */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-sans text-stone-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 font-medium" title="Cooking Time">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>{recipe.cookTime}</span>
              </div>
              <div className="flex items-center space-x-1 font-medium" title="Calories">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>{recipe.calories} kcal</span>
              </div>
              <div className="flex items-center space-x-1 font-medium" title="Servings">
                <Users className="w-3.5 h-3.5 text-stone-400" />
                <span>{recipe.servings}P</span>
              </div>
            </div>

            {/* View Recipe Action */}
            <div className="flex items-center text-amber-600 text-xs font-semibold group-hover:translate-x-1 transition-transform duration-200">
              <span>View</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </div>
          </div>
        </div>

        {/* Signature Ribbon */}
        {recipe.isClassified && (
          <div className="absolute top-2 right-2 pointer-events-none">
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold shadow-xs">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Signature</span>
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
