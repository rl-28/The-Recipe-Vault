import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VaultScene } from './components/vault3d/VaultScene';
import { HeroLanding } from './components/landing/HeroLanding';
import { Sidebar } from './components/dashboard/Sidebar';
import { VaultHeader } from './components/dashboard/VaultHeader';
import { RecipeGrid } from './components/dashboard/RecipeGrid';
import { RecipeDrawer } from './components/modal/RecipeDrawer';
import { CreateRecipeModal } from './components/modal/CreateRecipeModal';
import { ChefCookingMode } from './components/modal/ChefCookingMode';
import { FloatingMrSalt } from './components/mascot/FloatingMrSalt';
import { VaultProvider } from './context/VaultContext';
import { soundEngine } from './utils/soundEngine';

export const AppContent: React.FC = () => {
  // App view state: 'landing' | 'interior'
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'landing' | 'interior'>('landing');

  // Triggered when user clicks "ENTER ARCHIVE" or completes cipher
  const handleUnlock = () => {
    setIsUnlocked(true);
  };

  // Called when 3D Dolly-in zoom completes
  const handleUnlockAnimationComplete = () => {
    soundEngine.playAccessGranted();
    setViewMode('interior');
  };

  // Triggered when user clicks "LOCK VAULT" from inside
  const handleLockVault = () => {
    setViewMode('landing');
    setIsUnlocked(false);
  };

  return (
    <div className="relative min-h-screen bg-[#FAF7F0] kitchen-grid-pattern text-slate-900 overflow-x-hidden font-sans select-none">
      {/* ============================================================ */}
      {/* 1. 3D WEBGL HERO CANVAS (Active on landing)                   */}
      {/* ============================================================ */}
      <div
        className={`fixed inset-0 transition-opacity duration-1000 ${
          viewMode === 'interior' ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <VaultScene
          isUnlocked={isUnlocked}
          onUnlockComplete={handleUnlockAnimationComplete}
        />
      </div>

      {/* ============================================================ */}
      {/* 2. MAIN APPLICATION VIEWS (Landing vs Inner Workspace)        */}
      {/* ============================================================ */}
      <AnimatePresence mode="wait">
        {viewMode === 'landing' ? (
          <motion.div
            key="landing-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 0.6 }}
            className="relative z-10 min-h-screen flex flex-col justify-between"
          >
            <HeroLanding
              onUnlock={handleUnlock}
              isUnlocking={isUnlocked}
            />
          </motion.div>
        ) : (
          <motion.div
            key="interior-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative z-10 min-h-screen flex"
          >
            {/* STICKY LEFT SIDEBAR */}
            <Sidebar onLockVault={handleLockVault} />

            {/* MAIN WORKSPACE CONTENT AREA */}
            <div className="flex-1 min-h-screen flex flex-col justify-between px-4 sm:px-8 py-2 max-w-7xl mx-auto w-full">
              <div>
                {/* Header with Search, Category Tabs, and Filters */}
                <VaultHeader />

                {/* Main Recipe Grid or Meal Planner Board */}
                <main className="mt-4">
                  <RecipeGrid />
                </main>
              </div>

              {/* Cozy Illustrated Kitchen Footer */}
              <footer className="w-full border-t-2 border-black py-6 mt-12 text-center text-xs font-hand font-bold text-stone-600 bg-white/60 rounded-3xl border-2 border-black shadow-[3px_3px_0px_#000] mb-6">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFE68C] border border-black"></span>
                    <span className="font-extrabold text-black">The Recipe Vault • Hand-Drawn Kitchen Sanctuary</span>
                  </div>
                  <div>
                    Storybook Recipes // Illustrated with Love & Joy 🍳
                  </div>
                </div>
              </footer>
            </div>

            {/* Slide-in Interactive Recipe Drawer */}
            <RecipeDrawer />

            {/* Create Custom Recipe Modal */}
            <CreateRecipeModal />

            {/* Hands-Free Active Chef Cooking HUD with Voice Guidance */}
            <ChefCookingMode />

            {/* High-Visibility Floating "Mr. Salt" Companion */}
            <FloatingMrSalt />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <VaultProvider>
      <AppContent />
    </VaultProvider>
  );
};

export default App;
