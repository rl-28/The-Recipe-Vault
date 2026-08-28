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
  Layers
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
      `=== THE RECIPE VAULT // SHOPPING LIST ===`,
      `Protocol: ${selectedRecipe.title} (${selectedRecipe.vaultCode})`,
      `Yield: ${selectedRecipe.servings * servingsMultiplier} Servings (${servingsMultiplier}x)`,
      `----------------------------------------`,
      ...selectedRecipe.ingredients.map((ing) => {
        const amt = (ing.amount * servingsMultiplier);
        return `[ ] ${ing.name} - ${amt} ${ing.unit} ${ing.notes ? `(${ing.notes})` : ''}`;
      }),
      `----------------------------------------`,
      `DEPT. MOLECULAR GASTRONOMY ARCHIVE`,
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
          className="fixed inset-0 bg-vault-950/80 backdrop-blur-md transition-opacity"
        />

        {/* Slide-in High-Depth Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          className="relative w-full max-w-2xl bg-vault-900 border-l border-white/10 shadow-2xl z-10 flex flex-col h-full overflow-hidden text-neutral-100"
        >
          {/* Top Floating Control Bar */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
            <span className="px-3 py-1 rounded-md bg-vault-950/90 border border-vault-gold-500/40 text-[11px] font-mono text-vault-gold-400 font-bold tracking-widest backdrop-blur-md uppercase">
              {selectedRecipe.vaultCode}
            </span>

            <div className="flex items-center space-x-2">
              {/* Unit System Toggle */}
              <button
                onClick={toggleUnitSystem}
                className="px-2.5 py-1.5 rounded-full bg-vault-950/80 border border-white/20 text-vault-gold-400 text-xs font-mono backdrop-blur-md hover:border-vault-gold-500/40 transition-all cursor-pointer font-bold"
                title="Toggle Metric / Imperial Units"
              >
                {unitSystem.toUpperCase()}
              </button>

              {/* Bookmark Button */}
              <button
                onClick={handleBookmarkToggle}
                className={`p-2.5 rounded-full backdrop-blur-md border transition-all duration-200 cursor-pointer ${
                  bookmarked
                    ? 'bg-vault-gold-500 text-vault-950 border-vault-gold-400 shadow-neon-gold'
                    : 'bg-vault-950/80 text-neutral-200 border-white/20 hover:text-vault-gold-400'
                }`}
                title={bookmarked ? 'Remove from Private Vault' : 'Save to Private Vault'}
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
              </button>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="p-2.5 rounded-full bg-vault-950/80 border border-white/20 text-neutral-200 hover:text-vault-gold-400 backdrop-blur-md transition-all cursor-pointer"
                title="Copy Recipe Link"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* Print Button */}
              <button
                onClick={handlePrint}
                className="p-2.5 rounded-full bg-vault-950/80 border border-white/20 text-neutral-200 hover:text-vault-gold-400 backdrop-blur-md transition-all cursor-pointer"
                title="Print Protocol"
              >
                <Printer className="w-4 h-4" />
              </button>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="p-2.5 rounded-full bg-vault-950/80 border border-white/20 text-neutral-200 hover:text-white hover:bg-vault-800 backdrop-blur-md transition-all cursor-pointer"
                title="Close Protocol (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden pt-0 pb-12">
            {/* Hero Image Section */}
            <div className="relative w-full h-72 sm:h-80 bg-vault-950">
              <img
                src={selectedRecipe.imageUrl}
                alt={selectedRecipe.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-vault-900 via-vault-900/40 to-transparent"></div>

              {/* Category & Origin Overlay at Bottom of Image */}
              <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-md bg-vault-gold-500/20 border border-vault-gold-500/40 text-vault-gold-300 text-xs font-mono font-semibold uppercase">
                    {selectedRecipe.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white/10 border border-white/15 text-neutral-200 text-xs font-mono uppercase">
                    {selectedRecipe.difficulty}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5 text-xs font-mono text-vault-gold-400 bg-vault-950/70 px-2.5 py-1 rounded-md backdrop-blur-md">
                  <ChefHat className="w-3.5 h-3.5" />
                  <span>{selectedRecipe.origin}</span>
                </div>
              </div>
            </div>

            {/* Notification Toast for Shared Link / Copied Shopping List */}
            {copiedLink && (
              <div className="mx-6 mt-4 p-2.5 rounded-xl bg-vault-emerald/20 border border-vault-emerald/40 text-vault-emerald text-xs font-mono text-center">
                ARCHIVE PROTOCOL LINK COPIED TO CLIPBOARD
              </div>
            )}
            {copiedList && (
              <div className="mx-6 mt-4 p-2.5 rounded-xl bg-vault-gold-500/20 border border-vault-gold-500/40 text-vault-gold-300 text-xs font-mono text-center">
                CHECKLIST EXPORTED TO CLIPBOARD
              </div>
            )}

            {/* Header Text & Meta Badges */}
            <div className="px-6 pt-6">
              <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white tracking-tight leading-tight">
                {selectedRecipe.title}
              </h2>
              <p className="mt-2 text-sm text-vault-steel leading-relaxed font-light">
                {selectedRecipe.subtitle}
              </p>

              {/* Prominent Launch Active Chef Mode HUD CTA */}
              <div className="mt-5">
                <button
                  onClick={handleStartCooking}
                  className="w-full flex items-center justify-center space-x-3 py-3.5 px-6 rounded-xl bg-gradient-to-r from-vault-gold-500 via-amber-500 to-vault-gold-400 hover:from-vault-gold-400 hover:to-amber-400 text-vault-950 font-mono font-bold text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-neon-gold hover:scale-[1.01]"
                >
                  <PlayCircle className="w-5 h-5 fill-vault-950 text-vault-gold-400" />
                  <span>LAUNCH HANDS-FREE CHEF HUD (VOICE & TIMERS)</span>
                </button>
              </div>

              {/* Telemetry Stat Bar */}
              <div className="mt-6 grid grid-cols-3 gap-3 p-4 rounded-xl bg-vault-950/80 border border-white/5 font-mono text-center">
                <div>
                  <div className="text-[10px] text-vault-steel uppercase">PREP TIME</div>
                  <div className="text-sm font-semibold text-neutral-100 mt-0.5">
                    {selectedRecipe.prepTime}
                  </div>
                </div>
                <div className="border-x border-white/5">
                  <div className="text-[10px] text-vault-steel uppercase">COOK TIME</div>
                  <div className="text-sm font-semibold text-vault-gold-400 mt-0.5">
                    {selectedRecipe.cookTime}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-vault-steel uppercase">ENERGY</div>
                  <div className="text-sm font-semibold text-vault-amber mt-0.5">
                    {selectedRecipe.calories} kcal
                  </div>
                </div>
              </div>

              {/* Chef Molecular Gastronomy Notes */}
              <div className="mt-6 p-4 rounded-xl bg-vault-gold-500/10 border border-vault-gold-500/25">
                <div className="flex items-center space-x-2 text-xs font-mono text-vault-gold-400 font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Grand Master Culinary Note</span>
                </div>
                <p className="text-xs text-neutral-200 font-light leading-relaxed italic">
                  "{selectedRecipe.chefNotes}"
                </p>
              </div>

              {/* Sommelier Pairing Recommendation (if available) */}
              {selectedRecipe.winePairing && (
                <div className="mt-6 p-4 rounded-xl bg-[#141224] border border-purple-500/30">
                  <div className="flex items-center space-x-2 text-xs font-mono text-purple-300 font-bold uppercase tracking-wider mb-1.5">
                    <Wine className="w-4 h-4 text-purple-400" />
                    <span>Sommelier Pairing Reserve</span>
                  </div>
                  <div className="text-sm font-semibold text-white">
                    {selectedRecipe.winePairing.beverageName}
                  </div>
                  <div className="text-xs font-mono text-purple-300/80 mt-0.5">
                    {selectedRecipe.winePairing.type} // {selectedRecipe.winePairing.vintageOrOrigin}
                  </div>
                  <p className="mt-2 text-xs text-neutral-300 font-light leading-relaxed italic">
                    "{selectedRecipe.winePairing.tastingNote}"
                  </p>
                </div>
              )}

              {/* Nutritional & Macronutrient Profile */}
              {selectedRecipe.nutrition && (
                <div className="mt-6 p-4 rounded-xl bg-vault-950 border border-white/10">
                  <div className="flex items-center space-x-2 text-xs font-mono text-vault-steel uppercase tracking-wider mb-3">
                    <Activity className="w-3.5 h-3.5 text-vault-gold-400" />
                    <span>Macronutrient Profile (Per Serving)</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center font-mono">
                    <div className="p-2 rounded-lg bg-vault-900 border border-white/5">
                      <div className="text-[10px] text-vault-steel">CALORIES</div>
                      <div className="text-sm font-bold text-vault-gold-400 mt-0.5">
                        {selectedRecipe.nutrition.calories}
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-vault-900 border border-white/5">
                      <div className="text-[10px] text-vault-steel">PROTEIN</div>
                      <div className="text-sm font-bold text-vault-cyan mt-0.5">
                        {selectedRecipe.nutrition.proteinG}g
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-vault-900 border border-white/5">
                      <div className="text-[10px] text-vault-steel">CARBS</div>
                      <div className="text-sm font-bold text-amber-400 mt-0.5">
                        {selectedRecipe.nutrition.carbsG}g
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-vault-900 border border-white/5">
                      <div className="text-[10px] text-vault-steel">FAT</div>
                      <div className="text-sm font-bold text-vault-emerald mt-0.5">
                        {selectedRecipe.nutrition.fatG}g
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Required Molecular & Kitchen Equipment */}
              {selectedRecipe.equipment.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center space-x-2 text-xs font-mono text-vault-steel uppercase tracking-wider mb-2.5">
                    <Wrench className="w-3.5 h-3.5 text-vault-gold-500/70" />
                    <span>Specialized Equipment Required</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecipe.equipment.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-vault-950 border border-white/10 text-xs font-mono text-neutral-300"
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
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <ListChecks className="w-4 h-4 text-vault-gold-400" />
                      <h3 className="text-base font-semibold text-white font-sans">
                        Dynamic Ingredient Matrix
                      </h3>
                    </div>
                    <p className="text-[11px] font-mono text-vault-steel mt-0.5">
                      {checkedIngredientsCount} of {totalIngredientsCount} items prepped ({Math.round(checklistProgress)}%)
                    </p>
                  </div>

                  {/* Serving Scaler Controls */}
                  <div className="flex items-center space-x-2 bg-vault-950 border border-white/10 rounded-xl p-1 font-mono text-xs">
                    <span className="px-2 text-vault-steel text-[11px]">YIELD:</span>
                    <button
                      onClick={() => handleScaleChange(servingsMultiplier - 0.5)}
                      disabled={servingsMultiplier <= 0.5}
                      className="p-1 rounded-md bg-vault-900 hover:bg-vault-800 text-neutral-300 disabled:opacity-30 cursor-pointer"
                      title="Decrease Servings"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 font-bold text-vault-gold-400">
                      {selectedRecipe.servings * servingsMultiplier}P ({servingsMultiplier}x)
                    </span>
                    <button
                      onClick={() => handleScaleChange(servingsMultiplier + 0.5)}
                      disabled={servingsMultiplier >= 8}
                      className="p-1 rounded-md bg-vault-900 hover:bg-vault-800 text-neutral-300 disabled:opacity-30 cursor-pointer"
                      title="Increase Servings"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-vault-950 rounded-full overflow-hidden mb-4 border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-vault-gold-500 to-vault-emerald transition-all duration-300"
                    style={{ width: `${checklistProgress}%` }}
                  />
                </div>

                {/* Quick actions for ingredients */}
                <div className="flex items-center justify-between text-[11px] font-mono text-vault-steel mb-3">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleSelectAllIngredients}
                      className="hover:text-vault-gold-300 transition-colors cursor-pointer"
                    >
                      [✓ Prepped All]
                    </button>
                    <button
                      onClick={handleResetIngredients}
                      className="hover:text-neutral-300 transition-colors cursor-pointer"
                    >
                      [Reset Checklist]
                    </button>
                  </div>

                  <button
                    onClick={handleCopyShoppingList}
                    className="flex items-center space-x-1 hover:text-vault-gold-300 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
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
                        className={`flex items-start justify-between p-3 rounded-xl border transition-all duration-200 cursor-pointer select-none ${
                          isChecked
                            ? 'bg-vault-950/40 border-vault-emerald/30 opacity-60'
                            : 'bg-vault-950/90 border-white/10 hover:border-vault-gold-500/30'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 border transition-all ${
                              isChecked
                                ? 'bg-vault-emerald text-vault-950 border-vault-emerald'
                                : 'border-white/20 bg-vault-900'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>

                          <div>
                            <div
                              className={`text-sm font-sans font-medium transition-all ${
                                isChecked
                                  ? 'line-through text-vault-steel'
                                  : 'text-neutral-200'
                              }`}
                            >
                              {ing.name}
                            </div>
                            {ing.notes && (
                              <div className="text-[11px] text-vault-steel/80 font-mono italic">
                                {ing.notes}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Scaled Quantity Tag */}
                        <div className="font-mono text-xs font-semibold text-vault-gold-400 text-right whitespace-nowrap pl-2">
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
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <ChefHat className="w-4 h-4 text-vault-gold-400" />
                    <h3 className="text-base font-semibold text-white font-sans">
                      Step-by-Step Culinary Protocol
                    </h3>
                  </div>

                  <button
                    onClick={handleStartCooking}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-vault-gold-500/20 hover:bg-vault-gold-500/30 text-vault-gold-300 border border-vault-gold-500/40 text-xs font-mono transition-all cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>HUD VIEW</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {selectedRecipe.steps.map((step) => (
                    <div
                      key={step.id}
                      className="p-5 rounded-2xl bg-vault-950/70 border border-white/10 hover:border-vault-gold-500/20 transition-all"
                    >
                      {/* Step Header */}
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="w-7 h-7 rounded-lg bg-vault-gold-500/20 border border-vault-gold-500/40 text-vault-gold-400 flex items-center justify-center font-mono text-xs font-bold">
                          0{step.stepNumber}
                        </span>
                        <h4 className="text-sm font-semibold text-white font-sans">
                          {step.title}
                        </h4>
                      </div>

                      {/* Step Instruction */}
                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed pl-10 font-light">
                        {step.instruction}
                      </p>

                      {/* Step Chef Tip */}
                      {step.chefTip && (
                        <div className="ml-10 mt-3 p-3 rounded-xl bg-vault-800/40 border border-white/5 text-[11px] font-mono text-vault-steel">
                          <span className="text-vault-gold-400 font-bold mr-1.5">PROTOCOL NOTE:</span>
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
          <div className="p-4 border-t border-white/10 bg-vault-950/90 flex items-center justify-between font-mono text-xs">
            <div className="flex items-center space-x-2 text-vault-steel">
              <CheckCircle className="w-4 h-4 text-vault-emerald" />
              <span>CLASSIFIED MICHELIN ARCHIVE ACCESS</span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleStartCooking}
                className="px-5 py-2 rounded-xl bg-vault-gold-500 hover:bg-vault-gold-400 text-vault-950 font-bold font-mono text-xs shadow-vault-glow transition-all cursor-pointer uppercase"
              >
                COOK IN CHEF HUD
              </button>

              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-xl bg-vault-800 hover:bg-vault-700 text-neutral-200 border border-white/10 transition-all cursor-pointer font-medium"
              >
                CLOSE
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
