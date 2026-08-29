import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Bookmark, 
  ChefHat, 
  Check, 
  Minus, 
  Plus, 
  Printer, 
  Sparkles, 
  Wrench, 
  ListChecks, 
  CheckCircle,
  Share2,
  PlayCircle,
  Wine,
  Activity,
  Copy,
  Clock,
  Flame,
  Scale
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { StepTimer } from './StepTimer';
import { soundEngine } from '../../utils/soundEngine';

export const RecipeDrawer: React.FC = () => {
  const { 
    selectedRecipe, 
    setSelectedRecipe, 
    toggleBookmark, 
    isBookmarked,
    unitSystem,
    toggleUnitSystem,
    startChefMode 
  } = useVault();

  const [servingsMultiplier, setServingsMultiplier] = useState<number>(1);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedList, setCopiedList] = useState<boolean>(false);

  // Reset states when a new recipe opens
  useEffect(() => {
    if (selectedRecipe) {
      setServingsMultiplier(1);
      setCheckedIngredients({});
    }
  }, [selectedRecipe]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedRecipe) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedRecipe]);

  if (!selectedRecipe) return null;

  const bookmarked = isBookmarked(selectedRecipe.id);

  const handleClose = () => {
    soundEngine.playTick(600);
    setSelectedRecipe(null);
  };

  const handleToggleIngredient = (id: string) => {
    const nextState = !checkedIngredients[id];
    soundEngine.playTick(nextState ? 1400 : 700);
    setCheckedIngredients((prev) => ({
      ...prev,
      [id]: nextState,
    }));
  };

  const handleSelectAllIngredients = () => {
    soundEngine.playTick(1300);
    const allChecked: Record<string, boolean> = {};
    selectedRecipe.ingredients.forEach((ing) => {
      allChecked[ing.id] = true;
    });
    setCheckedIngredients(allChecked);
  };

  const handleResetIngredients = () => {
    soundEngine.playTick(500);
    setCheckedIngredients({});
  };

  const handleScaleChange = (multiplier: number) => {
    soundEngine.playTick(1100);
    setServingsMultiplier(Math.max(0.5, Math.min(8, multiplier)));
  };

  const handleBookmarkToggle = () => {
    soundEngine.playTick(bookmarked ? 600 : 1500);
    toggleBookmark(selectedRecipe.id);
  };

  const handleShare = () => {
    soundEngine.playTick(1200);
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyShoppingList = () => {
    soundEngine.playTick(1300);
    const textLines = [
      `=== ${selectedRecipe.title} ===`,
      `Yield: ${selectedRecipe.servings * servingsMultiplier} Servings (${servingsMultiplier}x)`,
      `----------------------------------------`,
      ...selectedRecipe.ingredients.map((ing) => {
        const amt = (ing.amount * servingsMultiplier);
        return `[ ] ${ing.name} - ${amt} ${ing.unit} ${ing.notes ? `(${ing.notes})` : ''}`;
      }),
      `----------------------------------------`,
      `From The Recipe Vault`,
    ];
    navigator.clipboard?.writeText(textLines.join('\n'));
    setCopiedList(true);
    setTimeout(() => setCopiedList(false), 2500);
  };

  const handlePrint = () => {
    soundEngine.playTick(1000);
    window.print();
  };

  const handleStartCooking = () => {
    soundEngine.playAccessGranted();
    startChefMode(selectedRecipe);
  };

  // Convert ingredient amount and unit between Metric and Imperial
  const formatIngredientAmount = (baseAmount: number, unit: string) => {
    const scaled = baseAmount * servingsMultiplier;

    if (unitSystem === 'imperial') {
      if (unit.toLowerCase() === 'g') {
        if (scaled >= 450) {
          const lbs = (scaled / 453.592).toFixed(2);
          return { amount: lbs, unit: 'lbs' };
        }
        const oz = (scaled * 0.035274).toFixed(1);
        return { amount: oz, unit: 'oz' };
      }
      if (unit.toLowerCase() === 'ml') {
        const flOz = (scaled * 0.033814).toFixed(1);
        return { amount: flOz, unit: 'fl oz' };
      }
    }

    const formatted = scaled % 1 === 0 ? scaled : scaled.toFixed(1);
    return { amount: formatted, unit };
  };

  const totalIngredientsCount = selectedRecipe.ingredients.length;
  const checkedIngredientsCount = Object.values(checkedIngredients).filter(Boolean).length;
  const checklistProgress = totalIngredientsCount > 0 ? (checkedIngredientsCount / totalIngredientsCount) * 100 : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
        {/* Backdrop Dark Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity"
        />

        {/* Slide-in High-Depth Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          className="relative w-full max-w-2xl bg-[#FCFAF7] border-l border-stone-200 shadow-2xl z-10 flex flex-col h-full overflow-hidden text-stone-900 font-sans"
        >
          {/* Top Floating Control Bar */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
            <span className="px-3.5 py-1 rounded-full bg-white/90 border border-stone-200/80 text-xs font-semibold text-amber-700 shadow-sm backdrop-blur-md">
              {selectedRecipe.category}
            </span>

            <div className="flex items-center space-x-2">
              {/* Unit System Toggle */}
              <button
                onClick={toggleUnitSystem}
                className="px-3 py-1.5 rounded-full bg-white/90 border border-stone-200 text-stone-700 text-xs font-semibold backdrop-blur-md hover:border-amber-400 hover:text-amber-700 transition-all cursor-pointer shadow-xs"
                title="Toggle Metric / Imperial Units"
              >
                <Scale className="w-3.5 h-3.5 inline mr-1 text-amber-500" />
                <span>{unitSystem.toUpperCase()}</span>
              </button>

              {/* Bookmark Button */}
              <button
                onClick={handleBookmarkToggle}
                className={`p-2.5 rounded-full backdrop-blur-md border transition-all duration-200 cursor-pointer shadow-xs ${
                  bookmarked
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                    : 'bg-white/90 text-stone-600 border-stone-200 hover:text-amber-600 hover:bg-white'
                }`}
                title={bookmarked ? 'Remove from Saved' : 'Save Recipe'}
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
              </button>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="p-2.5 rounded-full bg-white/90 border border-stone-200 text-stone-600 hover:text-amber-600 hover:bg-white backdrop-blur-md transition-all cursor-pointer shadow-xs"
                title="Copy Recipe Link"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* Print Button */}
              <button
                onClick={handlePrint}
                className="p-2.5 rounded-full bg-white/90 border border-stone-200 text-stone-600 hover:text-amber-600 hover:bg-white backdrop-blur-md transition-all cursor-pointer shadow-xs"
                title="Print Recipe"
              >
                <Printer className="w-4 h-4" />
              </button>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="p-2.5 rounded-full bg-white/90 border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-white backdrop-blur-md transition-all cursor-pointer shadow-xs"
                title="Close (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden pt-0 pb-12">
            {/* Hero Image Section */}
            <div className="relative w-full h-72 sm:h-80 bg-stone-100">
              <img
                src={selectedRecipe.imageUrl}
                alt={selectedRecipe.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FCFAF7] via-transparent to-transparent"></div>

              {/* Category & Origin Overlay at Bottom of Image */}
              <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-semibold shadow-xs">
                    {selectedRecipe.difficulty} Level
                  </span>
                </div>

                <div className="flex items-center space-x-1.5 text-xs font-medium text-stone-700 bg-white/90 px-3 py-1 rounded-full backdrop-blur-md shadow-xs">
                  <ChefHat className="w-3.5 h-3.5 text-amber-500" />
                  <span>{selectedRecipe.origin}</span>
                </div>
              </div>
            </div>

            {/* Notification Toast for Shared Link / Copied Shopping List */}
            {copiedLink && (
              <div className="mx-6 mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium text-center shadow-xs">
                Recipe link copied to clipboard!
              </div>
            )}
            {copiedList && (
              <div className="mx-6 mt-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium text-center shadow-xs">
                Shopping list copied to clipboard!
              </div>
            )}

            {/* Header Text & Meta Badges */}
            <div className="px-6 pt-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-tight">
                {selectedRecipe.title}
              </h2>
              <p className="mt-2 text-sm text-stone-600 leading-relaxed font-normal">
                {selectedRecipe.subtitle}
              </p>

              {/* Prominent Launch Active Chef Mode HUD CTA */}
              <div className="mt-5">
                <button
                  onClick={handleStartCooking}
                  className="w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-sans font-semibold text-sm tracking-wide transition-all duration-300 cursor-pointer shadow-lg shadow-amber-500/25 hover:shadow-xl hover:scale-[1.01]"
                >
                  <PlayCircle className="w-5 h-5 text-white" />
                  <span>Start Guided Cooking Mode (Voice & Timers)</span>
                </button>
              </div>

              {/* Telemetry Stat Bar */}
              <div className="mt-6 grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs text-center">
                <div>
                  <div className="text-[11px] text-stone-400 font-medium uppercase tracking-wider flex items-center justify-center space-x-1">
                    <Clock className="w-3 h-3 text-amber-500" />
                    <span>PREP TIME</span>
                  </div>
                  <div className="text-sm font-bold text-stone-800 mt-1">
                    {selectedRecipe.prepTime}
                  </div>
                </div>
                <div className="border-x border-stone-100">
                  <div className="text-[11px] text-stone-400 font-medium uppercase tracking-wider flex items-center justify-center space-x-1">
                    <Clock className="w-3 h-3 text-amber-600" />
                    <span>COOK TIME</span>
                  </div>
                  <div className="text-sm font-bold text-amber-600 mt-1">
                    {selectedRecipe.cookTime}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-stone-400 font-medium uppercase tracking-wider flex items-center justify-center space-x-1">
                    <Flame className="w-3 h-3 text-orange-500" />
                    <span>ENERGY</span>
                  </div>
                  <div className="text-sm font-bold text-orange-600 mt-1">
                    {selectedRecipe.calories} kcal
                  </div>
                </div>
              </div>

              {/* Chef Molecular Gastronomy Notes */}
              <div className="mt-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/70">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-800 uppercase tracking-wide mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Chef's Secret Technique</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed italic">
                  "{selectedRecipe.chefNotes}"
                </p>
              </div>

              {/* Sommelier Pairing Recommendation (if available) */}
              {selectedRecipe.winePairing && (
                <div className="mt-6 p-5 rounded-2xl bg-purple-50/90 border border-purple-100">
                  <div className="flex items-center space-x-2 text-xs font-bold text-purple-900 uppercase tracking-wide mb-1.5">
                    <Wine className="w-4 h-4 text-purple-600" />
                    <span>Sommelier Pairing Recommendation</span>
                  </div>
                  <div className="text-sm font-bold text-stone-900">
                    {selectedRecipe.winePairing.beverageName}
                  </div>
                  <div className="text-xs text-purple-700 font-medium mt-0.5">
                    {selectedRecipe.winePairing.type} • {selectedRecipe.winePairing.vintageOrOrigin}
                  </div>
                  <p className="mt-2 text-xs text-stone-600 leading-relaxed italic">
                    "{selectedRecipe.winePairing.tastingNote}"
                  </p>
                </div>
              )}

              {/* Nutritional & Macronutrient Profile */}
              {selectedRecipe.nutrition && (
                <div className="mt-6 p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
                  <div className="flex items-center space-x-2 text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
                    <Activity className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Nutrition Profile (Per Serving)</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center font-sans">
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                      <div className="text-[10px] text-stone-400 font-semibold uppercase">Calories</div>
                      <div className="text-sm font-bold text-amber-600 mt-0.5">
                        {selectedRecipe.nutrition.calories}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-100">
                      <div className="text-[10px] text-sky-700 font-semibold uppercase">Protein</div>
                      <div className="text-sm font-bold text-sky-800 mt-0.5">
                        {selectedRecipe.nutrition.proteinG}g
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100">
                      <div className="text-[10px] text-amber-700 font-semibold uppercase">Carbs</div>
                      <div className="text-sm font-bold text-amber-800 mt-0.5">
                        {selectedRecipe.nutrition.carbsG}g
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                      <div className="text-[10px] text-emerald-700 font-semibold uppercase">Fat</div>
                      <div className="text-sm font-bold text-emerald-800 mt-0.5">
                        {selectedRecipe.nutrition.fatG}g
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Required Kitchen Equipment */}
              {selectedRecipe.equipment.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center space-x-2 text-xs font-bold text-stone-500 uppercase tracking-wider mb-2.5">
                    <Wrench className="w-3.5 h-3.5 text-amber-500" />
                    <span>Equipment Needed</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecipe.equipment.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl bg-white border border-stone-200 text-xs text-stone-700 shadow-xs"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* SECTION: DYNAMIC INGREDIENT CHECKLIST & SCALER              */}
              {/* ============================================================ */}
              <div className="mt-8 pt-6 border-t border-stone-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <ListChecks className="w-4 h-4 text-amber-500" />
                      <h3 className="text-base font-bold text-stone-900 font-sans">
                        Ingredients & Prep
                      </h3>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {checkedIngredientsCount} of {totalIngredientsCount} items prepped ({Math.round(checklistProgress)}%)
                    </p>
                  </div>

                  {/* Serving Scaler Controls */}
                  <div className="flex items-center space-x-2 bg-white border border-stone-200 rounded-full p-1 text-xs shadow-xs">
                    <span className="px-2.5 text-stone-500 font-medium text-[11px]">Yield:</span>
                    <button
                      onClick={() => handleScaleChange(servingsMultiplier - 0.5)}
                      disabled={servingsMultiplier <= 0.5}
                      className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 disabled:opacity-30 cursor-pointer"
                      title="Decrease Servings"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 font-bold text-amber-600">
                      {selectedRecipe.servings * servingsMultiplier} Servings ({servingsMultiplier}x)
                    </span>
                    <button
                      onClick={() => handleScaleChange(servingsMultiplier + 0.5)}
                      disabled={servingsMultiplier >= 8}
                      className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 disabled:opacity-30 cursor-pointer"
                      title="Increase Servings"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-amber-500 transition-all duration-300"
                    style={{ width: `${checklistProgress}%` }}
                  />
                </div>

                {/* Quick actions for ingredients */}
                <div className="flex items-center justify-between text-xs text-stone-500 mb-3">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleSelectAllIngredients}
                      className="hover:text-amber-600 transition-colors cursor-pointer font-medium"
                    >
                      Check All
                    </button>
                    <span>•</span>
                    <button
                      onClick={handleResetIngredients}
                      className="hover:text-stone-700 transition-colors cursor-pointer font-medium"
                    >
                      Reset
                    </button>
                  </div>

                  <button
                    onClick={handleCopyShoppingList}
                    className="flex items-center space-x-1 hover:text-amber-600 transition-colors cursor-pointer font-medium"
                  >
                    <Copy className="w-3.5 h-3.5 text-amber-500" />
                    <span>Copy Shopping List</span>
                  </button>
                </div>

                {/* Ingredient Item Rows */}
                <div className="space-y-2">
                  {selectedRecipe.ingredients.map((ing) => {
                    const isChecked = Boolean(checkedIngredients[ing.id]);
                    const formatted = formatIngredientAmount(ing.amount, ing.unit);

                    return (
                      <div
                        key={ing.id}
                        onClick={() => handleToggleIngredient(ing.id)}
                        className={`flex items-start justify-between p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer select-none shadow-xs ${
                          isChecked
                            ? 'bg-emerald-50/60 border-emerald-200/80 opacity-70'
                            : 'bg-white border-stone-200/80 hover:border-amber-300'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`w-5 h-5 rounded-lg flex items-center justify-center mt-0.5 border transition-all ${
                              isChecked
                                ? 'bg-emerald-500 text-white border-emerald-500'
                                : 'border-stone-300 bg-white'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>

                          <div>
                            <div
                              className={`text-sm font-medium transition-all ${
                                isChecked
                                  ? 'line-through text-stone-400'
                                  : 'text-stone-800'
                              }`}
                            >
                              {ing.name}
                            </div>
                            {ing.notes && (
                              <div className="text-xs text-stone-400 italic mt-0.5">
                                {ing.notes}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Scaled Quantity Tag */}
                        <div className="text-xs font-bold text-amber-700 text-right whitespace-nowrap pl-2">
                          {formatted.amount} {formatted.unit}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ============================================================ */}
              {/* SECTION: STEP-BY-STEP CULINARY PROTOCOL WITH TIMERS          */}
              {/* ============================================================ */}
              <div className="mt-8 pt-6 border-t border-stone-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <ChefHat className="w-4 h-4 text-amber-500" />
                    <h3 className="text-base font-bold text-stone-900 font-sans">
                      Step-by-Step Instructions
                    </h3>
                  </div>

                  <button
                    onClick={handleStartCooking}
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <span>Full Screen HUD</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {selectedRecipe.steps.map((step) => (
                    <div
                      key={step.id}
                      className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:border-amber-300 transition-all"
                    >
                      {/* Step Header */}
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">
                          {step.stepNumber}
                        </span>
                        <h4 className="text-sm font-bold text-stone-900">
                          {step.title}
                        </h4>
                      </div>

                      {/* Step Instruction */}
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pl-10">
                        {step.instruction}
                      </p>

                      {/* Step Chef Tip */}
                      {step.chefTip && (
                        <div className="ml-10 mt-3 p-3 rounded-xl bg-amber-50/70 border border-amber-100 text-xs text-amber-900">
                          <span className="font-bold mr-1.5">Chef's Tip:</span>
                          {step.chefTip}
                        </div>
                      )}

                      {/* Built-in Step Countdown Timer (if configured) */}
                      {step.timerDurationSec && (
                        <div className="pl-10">
                          <StepTimer
                            durationSeconds={step.timerDurationSec}
                            label={step.timerLabel}
                            stepNumber={step.stepNumber}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="p-4 border-t border-stone-200 bg-white flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-stone-500 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Verified Recipe Protocol</span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleStartCooking}
                className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
              >
                Cook in Guided HUD
              </button>

              <button
                onClick={handleClose}
                className="px-4 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-all cursor-pointer font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
