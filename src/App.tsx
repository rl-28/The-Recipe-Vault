import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VaultScene } from './components/vault3d/VaultScene';
import { HeroLanding } from './components/landing/HeroLanding';
import { VaultHeader } from './components/dashboard/VaultHeader';
import { RecipeGrid } from './components/dashboard/RecipeGrid';
import { RecipeDrawer } from './components/modal/RecipeDrawer';
import { CreateRecipeModal } from './components/modal/CreateRecipeModal';
import { ChefCookingMode } from './components/modal/ChefCookingMode';
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
    <div className="relative min-h-screen bg-[#FCFAF7] text-stone-900 overflow-x-hidden font-sans select-none">
      {/* ============================================================ */}
      {/* 1. 3D WEBGL HERO CANVAS (Always active / responsive)          */}
      {/* ============================================================ */}
      <div
        className={`fixed inset-0 transition-opacity duration-1000 ${
          viewMode === 'interior' ? 'opacity-20 pointer-events-none' : 'opacity-100'
        }`}
      >
        <VaultScene
          isUnlocked={isUnlocked}
          onUnlockComplete={handleUnlockAnimationComplete}
        />
      </div>

      {/* ============================================================ */}
      {/* 2. AMBIENT BACKGROUND GLOW & NOISE VIGNETTE                   */}
      {/* ============================================================ */}
      <div className="fixed inset-0 pointer-events-none bg-radial-vignette opacity-50 z-0"></div>

      {/* ============================================================ */}
      {/* 3. MAIN APPLICATION VIEWS (Landing vs Inner Vault)            */}
      {/* ============================================================ */}
      <AnimatePresence mode="wait">
        {viewMode === 'landing' ? (
          <motion.div
            key="landing-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.8 }}
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative z-10 min-h-screen flex flex-col justify-between"
          >
            <div>
              {/* Header with Search, Units, Sort and Navigation */}
              <VaultHeader onLockVault={handleLockVault} />

              {/* Recipe Cards Grid */}
              <RecipeGrid />
            </div>

            {/* Dashboard Footer */}
            <footer className="w-full border-t border-stone-200/80 py-8 mt-12 text-center text-xs font-sans text-stone-500 bg-white/40 backdrop-blur-sm">
              <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span className="font-semibold text-stone-700">The Recipe Vault • Culinary Sanctuary</span>
                </div>
                <div>
                  Handcrafted with joy, precision, and love for cooking
                </div>
              </div>
            </footer>

            {/* Slide-in Interactive Recipe Drawer */}
            <RecipeDrawer />

            {/* Create Custom Recipe Modal */}
            <CreateRecipeModal />

            {/* Hands-Free Active Chef Cooking HUD with Voice Guidance */}
            <ChefCookingMode />
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
