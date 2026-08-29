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
      `From The Recipe Vault 🍳`,
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
          className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        />

        {/* Slide-in Storybook Recipe Notebook */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          className="relative w-full max-w-2xl bg-[#FFFDF8] border-l-[3px] border-black shadow-2xl z-10 flex flex-col h-full overflow-hidden text-black font-sans"
        >
          {/* Top Control Bar */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
            <span className="px-3.5 py-1 rounded-2xl bg-[#FFE68C] border-2 border-black text-xs font-hand font-extrabold text-black shadow-[2px_2px_0px_#000]">
              {selectedRecipe.category}
            </span>

            <div className="flex items-center space-x-2">
              {/* Unit System Toggle */}
              <button
                onClick={toggleUnitSystem}
                className="px-3 py-1 rounded-2xl bg-white border-2 border-black text-black text-xs font-hand font-bold shadow-[2px_2px_0px_#000] hover:bg-[#BBE1FA] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                title="Toggle Metric / Imperial Units"
              >
                <Scale className="w-3.5 h-3.5 inline mr-1" />
                <span>{unitSystem.toUpperCase()}</span>
              </button>

              {/* Bookmark Button */}
              <button
                onClick={handleBookmarkToggle}
                className={`p-2 rounded-2xl border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                  bookmarked
                    ? 'bg-[#FFAAA6] text-black'
                    : 'bg-white text-black hover:bg-[#FFE68C]'
                }`}
                title={bookmarked ? 'Remove from Saved' : 'Save Recipe'}
              >
                <Bookmark className={`w-4 h-4 stroke-[2.5] ${bookmarked ? 'fill-current' : ''}`} />
              </button>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="p-2 rounded-2xl bg-white border-2 border-black text-black hover:bg-[#D4F1F4] shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                title="Copy Recipe Link"
              >
                <Share2 className="w-4 h-4 stroke-[2.5]" />
              </button>

              {/* Print Button */}
              <button
                onClick={handlePrint}
                className="p-2 rounded-2xl bg-white border-2 border-black text-black hover:bg-[#FFE68C] shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                title="Print Recipe"
              >
                <Printer className="w-4 h-4 stroke-[2.5]" />
              </button>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="p-2 rounded-2xl bg-[#FFAAA6] border-2 border-black text-black hover:bg-rose-300 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                title="Close (Esc)"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Scrollable Notebook Body */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden pt-0 pb-12">
            {/* Hero Image Section */}
            <div className="relative w-full h-72 sm:h-80 bg-stone-100 border-b-[2.5px] border-black">
              <img
                src={selectedRecipe.imageUrl}
                alt={selectedRecipe.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FFFDF8] via-transparent to-transparent"></div>

              {/* Difficulty & Origin Pills */}
              <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-xl bg-[#FFE68C] border-2 border-black text-xs font-hand font-extrabold text-black shadow-[2px_2px_0px_#000]">
                  {selectedRecipe.difficulty} Mastery
                </span>

                <div className="flex items-center space-x-1.5 text-xs font-hand font-bold text-black bg-white px-3 py-1 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000]">
                  <ChefHat className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{selectedRecipe.origin}</span>
                </div>
              </div>
            </div>

            {/* Notification Toast for Shared Link / Copied Shopping List */}
            {copiedLink && (
              <div className="mx-6 mt-4 p-3 rounded-2xl bg-[#D4F1F4] border-2 border-black text-black text-xs font-hand font-bold text-center shadow-[2px_2px_0px_#000]">
                ✨ Recipe link copied to clipboard!
              </div>
            )}
            {copiedList && (
              <div className="mx-6 mt-4 p-3 rounded-2xl bg-[#FFE68C] border-2 border-black text-black text-xs font-hand font-bold text-center shadow-[2px_2px_0px_#000]">
                📋 Shopping list copied to clipboard!
              </div>
            )}

            {/* Header Text & Main Content */}
            <div className="px-6 pt-6 space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-hand font-extrabold text-black leading-tight">
                  {selectedRecipe.title}
                </h2>
                <p className="mt-2 text-sm font-doodle font-bold text-stone-700 leading-relaxed">
                  {selectedRecipe.subtitle}
                </p>
              </div>

              {/* Start Guided Cooking Button */}
              <div>
                <button
                  onClick={handleStartCooking}
                  className="w-full flex items-center justify-center space-x-3 py-3.5 px-6 rounded-2xl bg-[#FFE68C] hover:bg-amber-300 border-[2.5px] border-black text-black font-hand font-extrabold text-base tracking-wide shadow-[3px_3px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                >
                  <PlayCircle className="w-5 h-5 stroke-[2.5]" />
                  <span>Start Guided Cooking Mode (Voice & Timers)</span>
                </button>
              </div>

              {/* Stat Boxes */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#FAF7F0] border-2 border-black shadow-[3px_3px_0px_#000] text-center font-hand font-bold">
                <div>
                  <div className="text-[11px] text-stone-600 uppercase flex items-center justify-center space-x-1">
                    <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>PREP</span>
                  </div>
                  <div className="text-sm font-extrabold text-black mt-0.5">
                    {selectedRecipe.prepTime}
                  </div>
                </div>
                <div className="border-x-2 border-black">
                  <div className="text-[11px] text-stone-600 uppercase flex items-center justify-center space-x-1">
                    <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>COOK</span>
                  </div>
                  <div className="text-sm font-extrabold text-black mt-0.5">
                    {selectedRecipe.cookTime}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-stone-600 uppercase flex items-center justify-center space-x-1">
                    <Flame className="w-3.5 h-3.5 text-rose-500 stroke-[2.5]" />
                    <span>ENERGY</span>
                  </div>
                  <div className="text-sm font-extrabold text-rose-600 mt-0.5">
                    {selectedRecipe.calories} kcal
                  </div>
                </div>
              </div>

              {/* Chef Notes Sticker */}
              <div className="p-4 rounded-2xl bg-[#FFE68C] border-2 border-black shadow-[3px_3px_0px_#000]">
                <div className="flex items-center space-x-2 text-xs font-hand font-extrabold text-black uppercase mb-1">
                  <Sparkles className="w-4 h-4 stroke-[2.5]" />
                  <span>Chef's Secret Technique</span>
                </div>
                <p className="text-xs font-doodle font-bold text-stone-800 leading-relaxed italic">
                  "{selectedRecipe.chefNotes}"
                </p>
              </div>

              {/* Sommelier Pairing Sticker */}
              {selectedRecipe.winePairing && (
                <div className="p-4 rounded-2xl bg-[#E8D7F1] border-2 border-black shadow-[3px_3px_0px_#000]">
                  <div className="flex items-center space-x-2 text-xs font-hand font-extrabold text-black uppercase mb-1">
                    <Wine className="w-4 h-4 stroke-[2.5]" />
                    <span>Sommelier Beverage Pairing</span>
                  </div>
                  <div className="text-sm font-hand font-bold text-black">
                    {selectedRecipe.winePairing.beverageName}
                  </div>
                  <div className="text-xs font-doodle font-bold text-stone-700 mt-0.5">
                    {selectedRecipe.winePairing.type} • {selectedRecipe.winePairing.vintageOrOrigin}
                  </div>
                  <p className="mt-1.5 text-xs font-doodle font-bold text-stone-800 leading-relaxed italic">
                    "{selectedRecipe.winePairing.tastingNote}"
                  </p>
                </div>
              )}

              {/* Nutrition Breakdown Sticker */}
              {selectedRecipe.nutrition && (
                <div className="p-4 rounded-2xl bg-[#D4F1F4] border-2 border-black shadow-[3px_3px_0px_#000]">
                  <div className="flex items-center space-x-2 text-xs font-hand font-extrabold text-black uppercase mb-3">
                    <Activity className="w-4 h-4 stroke-[2.5]" />
                    <span>Nutrition Profile (Per Serving)</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center font-hand font-bold">
                    <div className="p-2 rounded-xl bg-white border border-black shadow-[1px_1px_0px_#000]">
                      <div className="text-[10px] text-stone-500 uppercase">Calories</div>
                      <div className="text-sm font-extrabold text-black mt-0.5">
                        {selectedRecipe.nutrition.calories}
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-black shadow-[1px_1px_0px_#000]">
                      <div className="text-[10px] text-stone-500 uppercase">Protein</div>
                      <div className="text-sm font-extrabold text-black mt-0.5">
                        {selectedRecipe.nutrition.proteinG}g
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-black shadow-[1px_1px_0px_#000]">
                      <div className="text-[10px] text-stone-500 uppercase">Carbs</div>
                      <div className="text-sm font-extrabold text-black mt-0.5">
                        {selectedRecipe.nutrition.carbsG}g
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-black shadow-[1px_1px_0px_#000]">
                      <div className="text-[10px] text-stone-500 uppercase">Fat</div>
                      <div className="text-sm font-extrabold text-black mt-0.5">
                        {selectedRecipe.nutrition.fatG}g
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Kitchen Equipment */}
              {selectedRecipe.equipment.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 text-xs font-hand font-bold text-black uppercase mb-2">
                    <Wrench className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Equipment Needed</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecipe.equipment.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl bg-white border-2 border-black text-xs font-hand font-bold text-black shadow-[1.5px_1.5px_0px_#000]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* SECTION: INGREDIENTS & SCALER                                */}
              {/* ============================================================ */}
              <div className="pt-6 border-t-2 border-black">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <ListChecks className="w-4 h-4 stroke-[2.5]" />
                      <h3 className="text-base font-hand font-extrabold text-black">
                        Ingredients & Yield
                      </h3>
                    </div>
                    <p className="text-xs font-doodle font-bold text-stone-600">
                      {checkedIngredientsCount} of {totalIngredientsCount} items prepped ({Math.round(checklistProgress)}%)
                    </p>
                  </div>

                  {/* Serving Scaler */}
                  <div className="flex items-center space-x-2 bg-white border-2 border-black rounded-2xl p-1 text-xs shadow-[2px_2px_0px_#000] font-hand font-bold">
                    <span className="px-2 text-stone-600 text-[11px]">Yield:</span>
                    <button
                      onClick={() => handleScaleChange(servingsMultiplier - 0.5)}
                      disabled={servingsMultiplier <= 0.5}
                      className="p-1 rounded-lg bg-[#FAF7F0] border border-black disabled:opacity-30 cursor-pointer"
                    >
                      <Minus className="w-3 h-3 stroke-[2.5]" />
                    </button>
                    <span className="px-2 font-extrabold text-black">
                      {selectedRecipe.servings * servingsMultiplier} Servings ({servingsMultiplier}x)
                    </span>
                    <button
                      onClick={() => handleScaleChange(servingsMultiplier + 0.5)}
                      disabled={servingsMultiplier >= 8}
                      className="p-1 rounded-lg bg-[#FAF7F0] border border-black disabled:opacity-30 cursor-pointer"
                    >
                      <Plus className="w-3 h-3 stroke-[2.5]" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-stone-200 border-2 border-black rounded-full overflow-hidden mb-4 shadow-[1px_1px_0px_#000]">
                  <div
                    className="h-full bg-[#FFE68C] border-r-2 border-black transition-all duration-300"
                    style={{ width: `${checklistProgress}%` }}
                  />
                </div>

                {/* Quick actions for ingredients */}
                <div className="flex items-center justify-between text-xs font-hand font-bold text-stone-700 mb-3">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleSelectAllIngredients}
                      className="hover:text-black cursor-pointer underline"
                    >
                      Check All
                    </button>
                    <span>•</span>
                    <button
                      onClick={handleResetIngredients}
                      className="hover:text-black cursor-pointer underline"
                    >
                      Reset
                    </button>
                  </div>

                  <button
                    onClick={handleCopyShoppingList}
                    className="flex items-center space-x-1 text-black hover:text-amber-900 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Copy Shopping List</span>
                  </button>
                </div>

                {/* Ingredient Rows */}
                <div className="space-y-2">
                  {selectedRecipe.ingredients.map((ing) => {
                    const isChecked = Boolean(checkedIngredients[ing.id]);
                    const formatted = formatIngredientAmount(ing.amount, ing.unit);

                    return (
                      <div
                        key={ing.id}
                        onClick={() => handleToggleIngredient(ing.id)}
                        className={`flex items-start justify-between p-3.5 rounded-2xl border-2 border-black transition-all cursor-pointer select-none ${
                          isChecked
                            ? 'bg-[#D4F1F4]/60 shadow-[1px_1px_0px_#000] opacity-75'
                            : 'bg-white shadow-[2.5px_2.5px_0px_#000] hover:bg-[#FAF7F0]'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`w-5 h-5 rounded-lg flex items-center justify-center mt-0.5 border-2 border-black transition-all ${
                              isChecked
                                ? 'bg-[#FFE68C] text-black shadow-[1px_1px_0px_#000]'
                                : 'bg-white'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3.5]" />}
                          </div>

                          <div>
                            <div
                              className={`text-sm font-hand font-bold transition-all ${
                                isChecked
                                  ? 'line-through text-stone-400'
                                  : 'text-black'
                              }`}
                            >
                              {ing.name}
                            </div>
                            {ing.notes && (
                              <div className="text-xs font-doodle font-bold text-stone-500 italic mt-0.5">
                                {ing.notes}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Quantity */}
                        <div className="text-xs font-hand font-extrabold text-black text-right whitespace-nowrap pl-2 bg-[#FFE68C] px-2.5 py-0.5 rounded-lg border border-black">
                          {formatted.amount} {formatted.unit}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ============================================================ */}
              {/* SECTION: STEP-BY-STEP INSTRUCTIONS                           */}
              {/* ============================================================ */}
              <div className="pt-6 border-t-2 border-black">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <ChefHat className="w-4 h-4 stroke-[2.5]" />
                    <h3 className="text-base font-hand font-extrabold text-black">
                      Step-by-Step Instructions
                    </h3>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedRecipe.steps.map((step) => (
                    <div
                      key={step.id}
                      className="p-5 rounded-3xl bg-white border-2 border-black shadow-[3px_3px_0px_#000]"
                    >
                      {/* Step Header */}
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="w-7 h-7 rounded-xl bg-[#FFE68C] border-2 border-black text-black flex items-center justify-center text-xs font-hand font-extrabold shadow-[1.5px_1.5px_0px_#000]">
                          {step.stepNumber}
                        </span>
                        <h4 className="text-sm font-hand font-bold text-black">
                          {step.title}
                        </h4>
                      </div>

                      {/* Step Instruction */}
                      <p className="text-xs sm:text-sm font-doodle font-bold text-stone-800 leading-relaxed pl-10">
                        {step.instruction}
                      </p>

                      {/* Chef Tip */}
                      {step.chefTip && (
                        <div className="ml-10 mt-3 p-3 rounded-xl bg-[#FFE68C]/60 border border-black text-xs font-doodle font-bold text-black shadow-[1px_1px_0px_#000]">
                          <span className="font-extrabold mr-1.5 font-hand">Chef's Tip:</span>
                          {step.chefTip}
                        </div>
                      )}

                      {/* Step Timer */}
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
          <div className="p-4 border-t-[2.5px] border-black bg-white flex items-center justify-between text-xs font-hand font-bold">
            <div className="flex items-center space-x-2 text-black">
              <CheckCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Kitchen Tested Recipe</span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleStartCooking}
                className="px-5 py-2 rounded-2xl bg-[#FFE68C] hover:bg-amber-300 border-2 border-black text-black font-extrabold text-xs shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                Cook in Guided HUD
              </button>

              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-2xl bg-[#FAF7F0] hover:bg-stone-200 border-2 border-black text-black transition-all cursor-pointer"
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
