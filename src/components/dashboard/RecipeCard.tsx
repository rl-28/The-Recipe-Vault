import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Flame, Users, Bookmark, ChefHat, ChevronRight, Wine } from 'lucide-react';
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
    const rotateX = ((y - centerY) / centerY) * -9;
    const rotateY = ((x - centerX) / centerX) * 9;

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

  // Difficulty badge colors
  const difficultyStyle = {
    Master: 'bg-vault-gold-500/15 text-vault-gold-400 border-vault-gold-500/30',
    Advanced: 'bg-vault-cyan/15 text-vault-cyan border-vault-cyan/30',
    Intermediate: 'bg-vault-emerald/15 text-vault-emerald border-vault-emerald/30',
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
        className="group relative flex flex-col h-full rounded-2xl vault-glass-card border border-white/10 hover:border-vault-gold-500/50 hover:shadow-vault-glow cursor-pointer overflow-hidden transition-all duration-300 vault-card-specular select-none"
      >
        {/* Top Image Container with Visual Depth */}
        <div className="relative w-full h-56 overflow-hidden bg-vault-950">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
          />

          {/* Vignette Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-vault-900 via-vault-900/30 to-transparent"></div>

          {/* Top Badges: Vault Code & Bookmark */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <span className="px-2.5 py-1 rounded-md bg-vault-950/80 border border-vault-gold-500/30 backdrop-blur-md text-[10px] font-mono text-vault-gold-400 font-semibold tracking-widest uppercase">
              {recipe.vaultCode}
            </span>

            <button
              onClick={handleBookmarkClick}
              className={`p-2 rounded-full backdrop-blur-md border transition-all duration-200 cursor-pointer ${
                bookmarked
                  ? 'bg-vault-gold-500 text-vault-950 border-vault-gold-400 shadow-neon-gold scale-110'
                  : 'bg-vault-900/80 text-neutral-300 border-white/15 hover:text-vault-gold-400 hover:border-vault-gold-500/40'
              }`}
              title={bookmarked ? 'Remove from Private Vault' : 'Save to Private Vault'}
              aria-label="Bookmark Recipe"
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Bottom of Image: Category & Difficulty */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="text-[11px] font-mono text-neutral-300/90 font-medium tracking-wide uppercase">
              {recipe.category}
            </span>

            <span
              className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-semibold uppercase tracking-wider ${difficultyStyle}`}
            >
              {recipe.difficulty}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-1 p-5 justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-1.5 text-xs text-vault-gold-400/90 font-mono mb-1.5">
              <ChefHat className="w-3.5 h-3.5 text-vault-gold-400" />
              <span className="truncate">{recipe.origin}</span>
            </div>

            <h3 className="text-lg font-semibold text-white group-hover:text-vault-gold-300 transition-colors duration-200 line-clamp-1 font-sans">
              {recipe.title}
            </h3>

            <p className="mt-1.5 text-xs text-vault-steel line-clamp-2 leading-relaxed font-light">
              {recipe.subtitle}
            </p>
          </div>

          {/* Flavor Profile Tags & Wine Badge */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {recipe.flavorProfile.slice(0, 3).map((flavor, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] font-mono text-neutral-300"
              >
                {flavor}
              </span>
            ))}
            {recipe.winePairing && (
              <span className="px-2 py-0.5 rounded-md bg-purple-950/50 border border-purple-500/30 text-[10px] font-mono text-purple-300 flex items-center space-x-1">
                <Wine className="w-2.5 h-2.5" />
                <span>Pairing</span>
              </span>
            )}
          </div>

          {/* Metadata Footer: Prep, Cook Time, Yield */}
          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-vault-steel">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1" title="Cooking Time">
                <Clock className="w-3.5 h-3.5 text-vault-gold-400/80" />
                <span>{recipe.cookTime}</span>
              </div>
              <div className="flex items-center space-x-1" title="Calories">
                <Flame className="w-3.5 h-3.5 text-vault-amber" />
                <span>{recipe.calories} kcal</span>
              </div>
              <div className="flex items-center space-x-1" title="Servings">
                <Users className="w-3.5 h-3.5 text-vault-steel" />
                <span>{recipe.servings}P</span>
              </div>
            </div>

            {/* Slide-in Action indicator */}
            <div className="flex items-center text-vault-gold-400 text-[11px] font-medium group-hover:translate-x-1 transition-transform duration-200">
              <span>PROTOCOL</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </div>
          </div>
        </div>

        {/* Classified Strip Indicator */}
        {recipe.isClassified && (
          <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
            <div className="absolute transform rotate-45 bg-vault-gold-500/20 text-vault-gold-300 text-[8px] font-mono font-bold tracking-widest text-center py-0.5 right-[-35px] top-[18px] w-[120px] border-y border-vault-gold-500/40">
              TOP SECRET
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
