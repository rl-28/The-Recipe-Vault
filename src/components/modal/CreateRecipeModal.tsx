import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Sparkles, Wine, Activity } from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import type { Recipe, RecipeCategory, RecipeDifficulty } from '../../types/recipe';
import { soundEngine } from '../../utils/soundEngine';

export const CreateRecipeModal: React.FC = () => {
  const { isCreateModalOpen, setIsCreateModalOpen, addNewRecipe, setSelectedRecipe } = useVault();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<Exclude<RecipeCategory, 'All Archives'>>('Modern Gastronomy');
  const [difficulty, setDifficulty] = useState<RecipeDifficulty>('Advanced');
  const [prepTime, setPrepTime] = useState('30 Min');
  const [cookTime, setCookTime] = useState('45 Min');
  const [calories, setCalories] = useState(450);
  const [proteinG, setProteinG] = useState(32);
  const [carbsG, setCarbsG] = useState(28);
  const [fatG, setFatG] = useState(18);
  const [servings, setServings] = useState(4);
  const [origin, setOrigin] = useState('Chef Private Atelier');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85');
  const [chefNotes, setChefNotes] = useState('Precision temperature control and high grade ingredients are required for ideal texture.');
  const [beverageName, setBeverageName] = useState('Vintage Reserve Pinot Noir');
  const [wineType, setWineType] = useState('Burgundy Red Wine');
  
  const [ingredients, setIngredients] = useState([
    { id: '1', name: 'Flaked Smoked Salt', amount: 5, unit: 'g' },
    { id: '2', name: 'Clarified Herb Butter', amount: 50, unit: 'g' },
  ]);

  const [steps, setSteps] = useState([
    { id: '1', stepNumber: 1, title: 'Mise en Place & Prep', instruction: 'Measure all items with precision scales.', timerDurationSec: 180, timerLabel: 'Mise en Place (3m)' },
    { id: '2', stepNumber: 2, title: 'Thermal Execution', instruction: 'Sear over high flame and baste continuously.', timerDurationSec: 120, timerLabel: 'Basting Timer (2m)' },
  ]);

  if (!isCreateModalOpen) return null;

  const handleClose = () => {
    soundEngine.playTick(600);
    setIsCreateModalOpen(false);
  };

  const handleAddIngredient = () => {
    soundEngine.playTick(1100);
    setIngredients([
      ...ingredients,
      { id: String(Date.now()), name: '', amount: 100, unit: 'g' },
    ]);
  };

  const handleRemoveIngredient = (index: number) => {
    soundEngine.playTick(500);
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleAddStep = () => {
    soundEngine.playTick(1100);
    const nextStepNum = steps.length + 1;
    setSteps([
      ...steps,
      {
        id: String(Date.now()),
        stepNumber: nextStepNum,
        title: `Protocol Phase ${nextStepNum}`,
        instruction: '',
        timerDurationSec: 300,
        timerLabel: `Phase ${nextStepNum} Timer`,
      },
    ]);
  };

  const handleRemoveStep = (index: number) => {
    soundEngine.playTick(500);
    const updated = steps.filter((_, i) => i !== index).map((s, idx) => ({ ...s, stepNumber: idx + 1 }));
    setSteps(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const randomVaultId = `VLT-${Math.floor(100 + Math.random() * 900)}-PRV`;
    const newRecipe: Recipe = {
      id: `custom-rc-${Date.now()}`,
      vaultCode: randomVaultId,
      title,
      subtitle: subtitle || 'Private classified culinary protocol',
      category,
      difficulty,
      prepTime,
      cookTime,
      totalTime: `${prepTime} + ${cookTime}`,
      calories: Number(calories) || 350,
      servings: Number(servings) || 4,
      rating: 5.0,
      reviewsCount: 1,
      isClassified: true,
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85',
      origin,
      chefNotes,
      flavorProfile: ['Artisan Crafted', 'Secret Recipe', 'Custom Reserve'],
      equipment: ['Digital Precision Scale', 'High Heat Cookware'],
      nutrition: {
        calories: Number(calories) || 450,
        proteinG: Number(proteinG) || 30,
        carbsG: Number(carbsG) || 25,
        fatG: Number(fatG) || 15,
      },
      winePairing: beverageName ? {
        beverageName,
        type: wineType,
        vintageOrOrigin: 'Chef Private Cellar',
        tastingNote: 'Balanced acidity and rich profile perfectly paired with this protocol.',
      } : undefined,
      ingredients: ingredients.filter((ing) => ing.name.trim() !== ''),
      steps: steps.filter((s) => s.instruction.trim() !== ''),
    };

    soundEngine.playAccessGranted();
    addNewRecipe(newRecipe);
    setIsCreateModalOpen(false);
    setSelectedRecipe(newRecipe);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-vault-950/85 backdrop-blur-lg"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          className="relative w-full max-w-3xl rounded-2xl bg-vault-900 border border-vault-gold-500/30 shadow-2xl p-6 sm:p-8 z-10 my-8 max-h-[90vh] overflow-y-auto font-sans text-neutral-100"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-lg bg-vault-950 border border-white/10 text-vault-steel hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-vault-950 border border-vault-gold-500/40 flex items-center justify-center shadow-neon-gold">
              <Sparkles className="w-5 h-5 text-vault-gold-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-sans text-white uppercase tracking-wide">
                Deposit New Vault Protocol
              </h2>
              <p className="text-xs font-mono text-vault-steel">
                ENCRYPTED ARCHIVE INGESTION // LEVEL 1 CHEF
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Primary Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-vault-steel uppercase mb-1.5">
                  Recipe Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 48-Hour Cured Duck Confit & Quince Glaze"
                  className="w-full px-4 py-2.5 rounded-xl bg-vault-950 border border-white/10 text-sm text-white focus:outline-none focus:border-vault-gold-500 font-sans"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-vault-steel uppercase mb-1.5">
                  Subtitle / Summary
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Slow cooked in rendered fat with rosemary infusion"
                  className="w-full px-4 py-2.5 rounded-xl bg-vault-950 border border-white/10 text-sm text-white focus:outline-none focus:border-vault-gold-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-vault-steel uppercase mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Exclude<RecipeCategory, 'All Archives'>)}
                  className="w-full px-4 py-2.5 rounded-xl bg-vault-950 border border-white/10 text-sm text-white focus:outline-none focus:border-vault-gold-500 cursor-pointer"
                >
                  <option value="Sous-Vide & Meats">Sous-Vide & Meats</option>
                  <option value="Artisan Bakery">Artisan Bakery</option>
                  <option value="Pastry & Desserts">Pastry & Desserts</option>
                  <option value="Signature Cocktails">Signature Cocktails</option>
                  <option value="Modern Gastronomy">Modern Gastronomy</option>
                  <option value="Fermentation & Curing">Fermentation & Curing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-vault-steel uppercase mb-1.5">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as RecipeDifficulty)}
                  className="w-full px-4 py-2.5 rounded-xl bg-vault-950 border border-white/10 text-sm text-white focus:outline-none focus:border-vault-gold-500 cursor-pointer"
                >
                  <option value="Master">Master</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Intermediate">Intermediate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-vault-steel uppercase mb-1.5">
                  Prep Time
                </label>
                <input
                  type="text"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  placeholder="e.g. 30 Min"
                  className="w-full px-4 py-2.5 rounded-xl bg-vault-950 border border-white/10 text-sm text-white focus:outline-none focus:border-vault-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-vault-steel uppercase mb-1.5">
                  Cook Time
                </label>
                <input
                  type="text"
                  value={cookTime}
                  onChange={(e) => setCookTime(e.target.value)}
                  placeholder="e.g. 4 Hours"
                  className="w-full px-4 py-2.5 rounded-xl bg-vault-950 border border-white/10 text-sm text-white focus:outline-none focus:border-vault-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-vault-steel uppercase mb-1.5">
                  Estimated Calories (kcal)
                </label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-vault-950 border border-white/10 text-sm text-white focus:outline-none focus:border-vault-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-vault-steel uppercase mb-1.5">
                  Base Yield (Servings)
                </label>
                <input
                  type="number"
                  value={servings}
                  onChange={(e) => setServings(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-vault-950 border border-white/10 text-sm text-white focus:outline-none focus:border-vault-gold-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-vault-steel uppercase mb-1.5">
                  Chef Origin / Atelier
                </label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g. Copenhagen // Secret Reserve"
                  className="w-full px-4 py-2.5 rounded-xl bg-vault-950 border border-white/10 text-sm text-white focus:outline-none focus:border-vault-gold-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-vault-steel uppercase mb-1.5">
                  Photo URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-vault-950 border border-white/10 text-sm text-white focus:outline-none focus:border-vault-gold-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-vault-steel uppercase mb-1.5">
                  Master Chef Advice & Molecular Note
                </label>
                <textarea
                  rows={2}
                  value={chefNotes}
                  onChange={(e) => setChefNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-vault-950 border border-white/10 text-sm text-white focus:outline-none focus:border-vault-gold-500"
                />
              </div>
            </div>

            {/* Sommelier & Macronutrient Details */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center space-x-2 text-xs font-mono text-purple-400 uppercase mb-2">
                  <Wine className="w-3.5 h-3.5" />
                  <span>Sommelier Pairing</span>
                </div>
                <input
                  type="text"
                  placeholder="Wine / Spirit Pairing Name"
                  value={beverageName}
                  onChange={(e) => setBeverageName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-vault-950 border border-white/10 text-xs text-white mb-2"
                />
                <input
                  type="text"
                  placeholder="Type / Origin"
                  value={wineType}
                  onChange={(e) => setWineType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-vault-950 border border-white/10 text-xs text-white"
                />
              </div>

              <div>
                <div className="flex items-center space-x-2 text-xs font-mono text-vault-cyan uppercase mb-2">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Macronutrient Breakdown (g)</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-mono text-vault-steel">Protein (g)</label>
                    <input
                      type="number"
                      value={proteinG}
                      onChange={(e) => setProteinG(Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded bg-vault-950 border border-white/10 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-vault-steel">Carbs (g)</label>
                    <input
                      type="number"
                      value={carbsG}
                      onChange={(e) => setCarbsG(Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded bg-vault-950 border border-white/10 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-vault-steel">Fat (g)</label>
                    <input
                      type="number"
                      value={fatG}
                      onChange={(e) => setFatG(Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded bg-vault-950 border border-white/10 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Ingredients Builder */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold font-mono uppercase text-vault-gold-400">
                  Ingredients Formula
                </h3>
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-vault-800 text-xs font-mono text-neutral-200 border border-white/10 hover:border-vault-gold-500/40 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Ingredient</span>
                </button>
              </div>

              <div className="space-y-2">
                {ingredients.map((ing, idx) => (
                  <div key={ing.id} className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Item name"
                      value={ing.name}
                      onChange={(e) => {
                        const updated = [...ingredients];
                        updated[idx].name = e.target.value;
                        setIngredients(updated);
                      }}
                      className="flex-1 px-3 py-2 rounded-lg bg-vault-950 border border-white/10 text-xs text-white"
                    />
                    <input
                      type="number"
                      placeholder="Amt"
                      value={ing.amount}
                      onChange={(e) => {
                        const updated = [...ingredients];
                        updated[idx].amount = Number(e.target.value);
                        setIngredients(updated);
                      }}
                      className="w-20 px-3 py-2 rounded-lg bg-vault-950 border border-white/10 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Unit"
                      value={ing.unit}
                      onChange={(e) => {
                        const updated = [...ingredients];
                        updated[idx].unit = e.target.value;
                        setIngredients(updated);
                      }}
                      className="w-20 px-3 py-2 rounded-lg bg-vault-950 border border-white/10 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(idx)}
                      className="p-2 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Steps Builder */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold font-mono uppercase text-vault-gold-400">
                  Step-by-Step Protocol & Timers
                </h3>
                <button
                  type="button"
                  onClick={handleAddStep}
                  className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-vault-800 text-xs font-mono text-neutral-200 border border-white/10 hover:border-vault-gold-500/40 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Step</span>
                </button>
              </div>

              <div className="space-y-4">
                {steps.map((step, idx) => (
                  <div key={step.id} className="p-3 rounded-xl bg-vault-950 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-vault-gold-400">
                        STEP 0{step.stepNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveStep(idx)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Step Title (e.g. Sear & Caramelize)"
                      value={step.title}
                      onChange={(e) => {
                        const updated = [...steps];
                        updated[idx].title = e.target.value;
                        setSteps(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-vault-900 border border-white/10 text-xs text-white"
                    />

                    <textarea
                      rows={2}
                      placeholder="Detailed technique instruction..."
                      value={step.instruction}
                      onChange={(e) => {
                        const updated = [...steps];
                        updated[idx].instruction = e.target.value;
                        setSteps(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-vault-900 border border-white/10 text-xs text-white"
                    />

                    <div className="flex items-center space-x-3 text-xs font-mono text-vault-steel">
                      <span>Countdown Timer (Seconds):</span>
                      <input
                        type="number"
                        value={step.timerDurationSec || 0}
                        onChange={(e) => {
                          const updated = [...steps];
                          updated[idx].timerDurationSec = Number(e.target.value);
                          setSteps(updated);
                        }}
                        className="w-24 px-2 py-1 rounded bg-vault-900 border border-white/10 text-xs text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submission Buttons */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl bg-vault-800 text-neutral-300 text-xs font-mono hover:bg-vault-700 cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-vault-gold-500 hover:bg-vault-gold-400 text-vault-950 font-mono font-bold text-xs shadow-vault-glow cursor-pointer uppercase tracking-wider"
              >
                DEPOSIT IN VAULT
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
