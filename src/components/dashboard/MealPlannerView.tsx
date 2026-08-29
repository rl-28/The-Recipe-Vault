import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Sparkles, Shuffle, Copy, CheckCircle2 } from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { soundEngine } from '../../utils/soundEngine';

interface DayPlan {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  accent: string;
}

const INITIAL_DAYS: DayPlan[] = [
  { day: 'Monday', breakfast: 'Sourdough Toast & Butter', lunch: 'Citrus Koji Hamachi', dinner: 'Sous-Vide Wagyu Short Rib', accent: '#FFE68C' },
  { day: 'Tuesday', breakfast: 'Matcha Crêpe Slice', lunch: 'Truffle Dashi Caviar Toast', dinner: 'Tonkotsu Ramen Bowl', accent: '#FFAAA6' },
  { day: 'Wednesday', breakfast: 'Honey Oat Bread', lunch: 'Smoked Salmon Plate', dinner: 'Rosemary Rye Old Fashioned & Steak', accent: '#BBE1FA' },
  { day: 'Thursday', breakfast: 'Yuzu Parfait', lunch: 'Heritage Sourdough Sandwich', dinner: '24K Chocolate Sphere Dessert', accent: '#D4F1F4' },
  { day: 'Friday', breakfast: 'Matcha Tea & Pastry', lunch: 'Barikata Ramen Bowl', dinner: 'Chef Special Wagyu Rib', accent: '#E8D7F1' },
  { day: 'Saturday', breakfast: 'Chef Weekend Brunch', lunch: 'Artisan Baguette & Cheeses', dinner: 'Slow Cooked Confit Banquet', accent: '#FFE68C' },
  { day: 'Sunday', breakfast: 'Fresh Baked Boule', lunch: 'Garden Salad & Citrus Dressing', dinner: 'Warm Family Dinner Bowl', accent: '#FFAAA6' },
];

export const MealPlannerView: React.FC = () => {
  const { setSelectedRecipe, recipes } = useVault();
  const [plans, setPlans] = useState<DayPlan[]>(INITIAL_DAYS);
  const [copied, setCopied] = useState<boolean>(false);

  const handleShuffle = () => {
    soundEngine.playTick(1300);
    const titles = recipes.map((r) => r.title);
    const shuffled = plans.map((p) => ({
      ...p,
      lunch: titles[Math.floor(Math.random() * titles.length)] || p.lunch,
      dinner: titles[Math.floor(Math.random() * titles.length)] || p.dinner,
    }));
    setPlans(shuffled);
  };

  const handleCopyPlan = () => {
    soundEngine.playTick(1200);
    const text = plans.map((p) => `* ${p.day}:\n  - Breakfast: ${p.breakfast}\n  - Lunch: ${p.lunch}\n  - Dinner: ${p.dinner}`).join('\n\n');
    navigator.clipboard?.writeText(`=== WEEKLY CHEF MEAL PLAN ===\n\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenRecipe = (recipeName: string) => {
    const matched = recipes.find((r) => r.title.toLowerCase().includes(recipeName.toLowerCase()) || recipeName.toLowerCase().includes(r.title.toLowerCase()));
    if (matched) {
      soundEngine.playTick(1100);
      setSelectedRecipe(matched);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#FFFDF8] border-[2.5px] border-black shadow-[4px_4px_0px_#000] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-hand font-bold uppercase tracking-wider text-amber-800">
            <Calendar className="w-4 h-4 text-black" />
            <span>Weekly Illustrated Planner</span>
          </div>
          <h2 className="text-2xl font-hand font-extrabold text-black mt-1">
            Weekly Culinary Schedule 🗓️
          </h2>
          <p className="text-xs font-doodle font-bold text-stone-600 mt-0.5">
            Plan your home menu with artisanal recipes and delicious breakfast, lunch, and dinners.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleShuffle}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-2xl bg-[#FFE68C] border-2 border-black font-hand font-bold text-xs text-black shadow-[2px_2px_0px_#000] hover:bg-amber-300 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Shuffle Menu</span>
          </button>

          <button
            onClick={handleCopyPlan}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-2xl bg-[#D4F1F4] border-2 border-black font-hand font-bold text-xs text-black shadow-[2px_2px_0px_#000] hover:bg-cyan-200 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Plan'}</span>
          </button>
        </div>
      </div>

      {/* 7-Day Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {plans.map((dayPlan, idx) => (
          <motion.div
            key={dayPlan.day}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="p-5 rounded-3xl bg-[#FFFDF8] border-[2.5px] border-black shadow-[4px_4px_0px_#000] flex flex-col justify-between space-y-4"
          >
            {/* Day Header Pill */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-black">
              <span
                style={{ backgroundColor: dayPlan.accent }}
                className="px-3 py-1 rounded-xl border-2 border-black font-hand font-bold text-xs text-black shadow-[1.5px_1.5px_0px_#000]"
              >
                {dayPlan.day}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-black" />
            </div>

            {/* Meal Slots */}
            <div className="space-y-2.5 text-xs font-hand">
              {/* Breakfast */}
              <div className="p-2.5 rounded-xl bg-white border border-black shadow-[1.5px_1.5px_0px_#000]">
                <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">🥐 Breakfast</div>
                <div className="font-bold text-black mt-0.5">{dayPlan.breakfast}</div>
              </div>

              {/* Lunch */}
              <div 
                onClick={() => handleOpenRecipe(dayPlan.lunch)}
                className="p-2.5 rounded-xl bg-[#D4F1F4]/50 border border-black shadow-[1.5px_1.5px_0px_#000] hover:bg-[#D4F1F4] cursor-pointer transition-colors"
                title="Click to view recipe"
              >
                <div className="text-[10px] font-bold text-cyan-800 uppercase tracking-wide">🥗 Lunch</div>
                <div className="font-bold text-black mt-0.5 truncate">{dayPlan.lunch}</div>
              </div>

              {/* Dinner */}
              <div 
                onClick={() => handleOpenRecipe(dayPlan.dinner)}
                className="p-2.5 rounded-xl bg-[#FFE68C]/50 border border-black shadow-[1.5px_1.5px_0px_#000] hover:bg-[#FFE68C] cursor-pointer transition-colors"
                title="Click to view recipe"
              >
                <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">🍲 Dinner</div>
                <div className="font-bold text-black mt-0.5 truncate">{dayPlan.dinner}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
