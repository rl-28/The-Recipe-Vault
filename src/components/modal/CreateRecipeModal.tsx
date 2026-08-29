import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Sparkles, Wine, Activity } from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import type { Recipe, RecipeCategory, RecipeDifficulty } from '../../types/recipe';
import { soundEngine } from '../../utils/soundEngine';
import { sprinkleSalt } from '../../utils/sprinkleSalt';

export const CreateRecipeModal: React.FC = () => {
  const { isCreateModalOpen, setIsCreateModalOpen, addNewRecipe, setSelectedRecipe } = useVault();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<Exclude<RecipeCategory, 'All Recipes'>>('Main Dishes');
  const [difficulty, setDifficulty] = useState<RecipeDifficulty>('Advanced');
  const [prepTime, setPrepTime] = useState('30 Min');
  const [cookTime, setCookTime] = useState('45 Min');
  const [calories, setCalories] = useState(450);
  const [proteinG, setProteinG] = useState(32);
  const [carbsG, setCarbsG] = useState(28);
  const [fatG, setFatG] = useState(18);
  const [servings, setServings] = useState(4);
  const [origin, setOrigin] = useState('Home Kitchen');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85');
  const [chefNotes, setChefNotes] = useState('Fresh herbs and high heat create the best flavors.');
  const [beverageName, setBeverageName] = useState('Sparkling Yuzu Lemonade');
  const [wineType, setWineType] = useState('Artisan Drink');
  
  const [ingredients, setIngredients] = useState([
    { id: '1', name: 'Flaked Smoked Salt', amount: 5, unit: 'g' },
    { id: '2', name: 'Clarified Butter', amount: 50, unit: 'g' },
  ]);

  const [steps, setSteps] = useState([
    { id: '1', stepNumber: 1, title: 'Prep Ingredients', instruction: 'Chop and measure all items neatly.', timerDurationSec: 180, timerLabel: 'Prep Timer (3m)' },
    { id: '2', stepNumber: 2, title: 'Cook with Flame', instruction: 'Sear over high flame and baste gently.', timerDurationSec: 120, timerLabel: 'Basting Timer (2m)' },
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
        title: `Step ${nextStepNum}`,
        instruction: '',
        timerDurationSec: 300,
        timerLabel: `Step ${nextStepNum} Timer`,
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

    const randomVaultId = `Custom Recipe #${Math.floor(100 + Math.random() * 900)}`;
    const newRecipe: Recipe = {
      id: `custom-rc-${Date.now()}`,
      vaultCode: randomVaultId,
      title,
      subtitle: subtitle || 'Hand-crafted recipe formulation',
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
      flavorProfile: ['Handcrafted', 'Secret Recipe', 'Family Favorite'],
      equipment: ['Cast Iron Pan', 'Kitchen Scale'],
      nutrition: {
        calories: Number(calories) || 450,
        proteinG: Number(proteinG) || 30,
        carbsG: Number(carbsG) || 25,
        fatG: Number(fatG) || 15,
      },
      winePairing: beverageName ? {
        beverageName,
        type: wineType,
        vintageOrOrigin: 'Special Reserve',
        tastingNote: 'Crisp and refreshing pairing designed for this dish.',
      } : undefined,
      ingredients: ingredients.filter((ing) => ing.name.trim() !== ''),
      steps: steps.filter((s) => s.instruction.trim() !== ''),
    };

    soundEngine.playAccessGranted();
    sprinkleSalt('celebration');
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
          className="fixed inset-0 bg-black/40 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          className="relative w-full max-w-3xl rounded-3xl bg-[#FFFDF8] border-[3px] border-black shadow-[8px_8px_0px_#000] p-6 sm:p-8 z-10 my-8 max-h-[90vh] overflow-y-auto font-sans text-black"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-2xl bg-[#FFAAA6] border-2 border-black text-black hover:bg-rose-300 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Header */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#FFE68C] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
              <Sparkles className="w-6 h-6 text-black stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-2xl font-hand font-extrabold text-black">
                Add to Recipe Vault 📝
              </h2>
              <p className="text-xs font-doodle font-bold text-stone-600">
                Write down your delicious recipe and culinary notes
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Primary Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-hand font-bold text-black uppercase mb-1">
                  Recipe Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Crispy Rosemary Herb Focaccia"
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-black text-sm text-black font-hand font-bold shadow-[2px_2px_0px_#000] focus:outline-none focus:bg-[#FAF7F0]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-hand font-bold text-black uppercase mb-1">
                  Subtitle / Summary
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Golden olive oil crust with sea salt crystals"
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-black text-sm text-black font-hand font-bold shadow-[2px_2px_0px_#000] focus:outline-none focus:bg-[#FAF7F0]"
                />
              </div>

              <div>
                <label className="block text-xs font-hand font-bold text-black uppercase mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Exclude<RecipeCategory, 'All Recipes'>)}
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-black text-sm text-black font-hand font-bold shadow-[2px_2px_0px_#000] focus:outline-none cursor-pointer"
                >
                  <option value="Main Dishes">Main Dishes</option>
                  <option value="Artisan Bakery">Artisan Bakery</option>
                  <option value="Sweet Desserts">Sweet Desserts</option>
                  <option value="Cozy Drinks">Cozy Drinks</option>
                  <option value="Quick Bites">Quick Bites</option>
                  <option value="Sauces & Ferments">Sauces & Ferments</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-hand font-bold text-black uppercase mb-1">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as RecipeDifficulty)}
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-black text-sm text-black font-hand font-bold shadow-[2px_2px_0px_#000] focus:outline-none cursor-pointer"
                >
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Master">Master</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-hand font-bold text-black uppercase mb-1">
                  Prep Time
                </label>
                <input
                  type="text"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  placeholder="e.g. 20 Min"
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-black text-sm text-black font-hand font-bold shadow-[2px_2px_0px_#000]"
                />
              </div>

              <div>
                <label className="block text-xs font-hand font-bold text-black uppercase mb-1">
                  Cook Time
                </label>
                <input
                  type="text"
                  value={cookTime}
                  onChange={(e) => setCookTime(e.target.value)}
                  placeholder="e.g. 35 Min"
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-black text-sm text-black font-hand font-bold shadow-[2px_2px_0px_#000]"
                />
              </div>

              <div>
                <label className="block text-xs font-hand font-bold text-black uppercase mb-1">
                  Calories (kcal)
                </label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-black text-sm text-black font-hand font-bold shadow-[2px_2px_0px_#000]"
                />
              </div>

              <div>
                <label className="block text-xs font-hand font-bold text-black uppercase mb-1">
                  Yield (Servings)
                </label>
                <input
                  type="number"
                  value={servings}
                  onChange={(e) => setServings(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-black text-sm text-black font-hand font-bold shadow-[2px_2px_0px_#000]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-hand font-bold text-black uppercase mb-1">
                  Origin / Kitchen
                </label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g. Grandma's Kitchen // Tuscany"
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-black text-sm text-black font-hand font-bold shadow-[2px_2px_0px_#000]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-hand font-bold text-black uppercase mb-1">
                  Photo URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-black text-sm text-black font-hand font-bold shadow-[2px_2px_0px_#000]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-hand font-bold text-black uppercase mb-1">
                  Chef Advice & Technique Notes
                </label>
                <textarea
                  rows={2}
                  value={chefNotes}
                  onChange={(e) => setChefNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-black text-sm text-black font-hand font-bold shadow-[2px_2px_0px_#000]"
                />
              </div>
            </div>

            {/* Sommelier & Macronutrient Details */}
            <div className="pt-4 border-t-2 border-black grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#E8D7F1] border-2 border-black shadow-[2px_2px_0px_#000]">
                <div className="flex items-center space-x-2 text-xs font-hand font-extrabold text-black uppercase mb-2">
                  <Wine className="w-4 h-4 stroke-[2.5]" />
                  <span>Drink Pairing</span>
                </div>
                <input
                  type="text"
                  placeholder="Beverage Name"
                  value={beverageName}
                  onChange={(e) => setBeverageName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-black text-xs font-hand font-bold text-black mb-2 shadow-[1px_1px_0px_#000]"
                />
                <input
                  type="text"
                  placeholder="Drink Type"
                  value={wineType}
                  onChange={(e) => setWineType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-black text-xs font-hand font-bold text-black shadow-[1px_1px_0px_#000]"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#D4F1F4] border-2 border-black shadow-[2px_2px_0px_#000]">
                <div className="flex items-center space-x-2 text-xs font-hand font-extrabold text-black uppercase mb-2">
                  <Activity className="w-4 h-4 stroke-[2.5]" />
                  <span>Macronutrients (g)</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-hand font-bold text-black">Protein</label>
                    <input
                      type="number"
                      value={proteinG}
                      onChange={(e) => setProteinG(Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-xl bg-white border border-black text-xs font-hand font-bold text-black"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-hand font-bold text-black">Carbs</label>
                    <input
                      type="number"
                      value={carbsG}
                      onChange={(e) => setCarbsG(Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-xl bg-white border border-black text-xs font-hand font-bold text-black"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-hand font-bold text-black">Fat</label>
                    <input
                      type="number"
                      value={fatG}
                      onChange={(e) => setFatG(Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-xl bg-white border border-black text-xs font-hand font-bold text-black"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Ingredients Builder */}
            <div className="pt-4 border-t-2 border-black">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-hand font-extrabold text-black">
                  Ingredients Formula 🧂
                </h3>
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="flex items-center space-x-1 px-3.5 py-1.5 rounded-xl bg-[#FFE68C] text-xs font-hand font-extrabold text-black border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-amber-300 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Add Ingredient</span>
                </button>
              </div>

              <div className="space-y-2">
                {ingredients.map((ing, idx) => (
                  <div key={ing.id} className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Ingredient name"
                      value={ing.name}
                      onChange={(e) => {
                        const updated = [...ingredients];
                        updated[idx].name = e.target.value;
                        setIngredients(updated);
                      }}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-white border-2 border-black text-xs font-hand font-bold text-black shadow-[1.5px_1.5px_0px_#000]"
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
                      className="w-20 px-3 py-2 rounded-xl bg-white border-2 border-black text-xs font-hand font-bold text-black shadow-[1.5px_1.5px_0px_#000]"
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
                      className="w-20 px-3 py-2 rounded-xl bg-white border-2 border-black text-xs font-hand font-bold text-black shadow-[1.5px_1.5px_0px_#000]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(idx)}
                      className="p-2 text-rose-600 hover:text-rose-800"
                    >
                      <Trash2 className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Steps Builder */}
            <div className="pt-4 border-t-2 border-black">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-hand font-extrabold text-black">
                  Step Instructions & Timers ⏱️
                </h3>
                <button
                  type="button"
                  onClick={handleAddStep}
                  className="flex items-center space-x-1 px-3.5 py-1.5 rounded-xl bg-[#FFE68C] text-xs font-hand font-extrabold text-black border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-amber-300 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Add Step</span>
                </button>
              </div>

              <div className="space-y-3">
                {steps.map((step, idx) => (
                  <div key={step.id} className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-black space-y-2 shadow-[2px_2px_0px_#000]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-hand font-extrabold text-black">
                        STEP 0{step.stepNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveStep(idx)}
                        className="text-rose-600 hover:text-rose-800 text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
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
                      className="w-full px-3 py-2 rounded-xl bg-white border border-black text-xs font-hand font-bold text-black"
                    />

                    <textarea
                      rows={2}
                      placeholder="Detailed cooking instructions..."
                      value={step.instruction}
                      onChange={(e) => {
                        const updated = [...steps];
                        updated[idx].instruction = e.target.value;
                        setSteps(updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-black text-xs font-doodle font-bold text-black"
                    />

                    <div className="flex items-center space-x-3 text-xs font-hand font-bold text-black">
                      <span>Countdown Timer (Seconds):</span>
                      <input
                        type="number"
                        value={step.timerDurationSec || 0}
                        onChange={(e) => {
                          const updated = [...steps];
                          updated[idx].timerDurationSec = Number(e.target.value);
                          setSteps(updated);
                        }}
                        className="w-24 px-2 py-1.5 rounded-xl bg-white border border-black text-xs font-hand font-bold text-black"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submission Buttons */}
            <div className="pt-6 border-t-2 border-black flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 rounded-2xl bg-[#FAF7F0] text-black text-xs font-hand font-bold hover:bg-stone-200 border-2 border-black cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-7 py-2.5 rounded-2xl bg-[#FFE68C] hover:bg-amber-300 border-2 border-black text-black font-hand font-extrabold text-xs shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                Save Recipe
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
