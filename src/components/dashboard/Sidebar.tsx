import React, { useState } from 'react';
import { 
  Utensils, 
  Bookmark, 
  CalendarDays, 
  Sparkles, 
  Scale, 
  Volume2, 
  VolumeX, 
  Lock,
  ChefHat,
  Heart
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import type { SidebarTab } from '../../types/recipe';
import { soundEngine } from '../../utils/soundEngine';

interface SidebarProps {
  onLockVault: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLockVault }) => {
  const { 
    activeSidebarTab, 
    setActiveSidebarTab, 
    bookmarkedIds,
    unitSystem,
    toggleUnitSystem
  } = useVault();

  const [isMuted, setIsMuted] = useState(soundEngine.getIsMuted());

  const handleMuteToggle = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const navItems: { id: SidebarTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    {
      id: 'all',
      label: 'All Recipes',
      icon: <Utensils className="w-4 h-4 stroke-[2.5]" />,
    },
    {
      id: 'collections',
      label: 'Collections',
      icon: <Bookmark className="w-4 h-4 stroke-[2.5]" />,
      badge: bookmarkedIds.length,
    },
    {
      id: 'planner',
      label: 'Meal Planner',
      icon: <CalendarDays className="w-4 h-4 stroke-[2.5]" />,
      badge: 'New',
    },
    {
      id: 'atelier',
      label: 'Private Atelier',
      icon: <Sparkles className="w-4 h-4 stroke-[2.5]" />,
    },
  ];

  return (
    <aside className="w-64 bg-[#FFFDF8] border-r-[2.5px] border-black p-5 flex flex-col justify-between h-screen sticky top-0 z-20 select-none shadow-xs font-sans">
      {/* Top Section: Brand & Nav */}
      <div>
        {/* Brand Header */}
        <div className="flex items-center space-x-3 pb-6 border-b-[2.5px] border-black mb-6">
          <div className="w-11 h-11 rounded-2xl bg-[#FFE68C] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
            <ChefHat className="w-6 h-6 text-black stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-base font-hand font-extrabold tracking-tight text-black leading-tight uppercase">
              The Recipe Vault
            </h1>
            <p className="text-[11px] font-doodle font-bold tracking-wide text-stone-600">
              Cozy Storybook Kitchen
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = activeSidebarTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundEngine.playTick(1200);
                  setActiveSidebarTab(item.id);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-hand font-bold text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FFE68C] border-2 border-black text-black shadow-[2px_2px_0px_#000] translate-x-1'
                    : 'bg-transparent border-2 border-transparent hover:border-black hover:bg-[#FAF7F0] text-stone-700 hover:shadow-[2px_2px_0px_#000]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                      isActive
                        ? 'bg-black text-white border-black'
                        : 'bg-[#FFAAA6] text-black border-black shadow-[1px_1px_0px_#000]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Preferences & Lock Vault */}
      <div className="pt-6 border-t-[2.5px] border-black space-y-3">
        {/* Unit Switcher */}
        <button
          onClick={() => {
            soundEngine.playTick(1100);
            toggleUnitSystem();
          }}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-white border-2 border-black font-hand font-bold text-xs text-black shadow-[2px_2px_0px_#000] hover:bg-[#D4F1F4] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <Scale className="w-4 h-4" />
            <span>Units</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-[#BBE1FA] border border-black text-[10px] font-bold">
            {unitSystem === 'metric' ? 'Metric (g, ml)' : 'Imperial (oz)'}
          </span>
        </button>

        {/* Sound & Lock Row */}
        <div className="flex items-center space-x-2">
          {/* Sound Toggle */}
          <button
            onClick={handleMuteToggle}
            className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-2xl bg-white border-2 border-black font-hand font-bold text-xs text-black shadow-[2px_2px_0px_#000] hover:bg-[#E8D7F1] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-black" />}
            <span>{isMuted ? 'Muted' : 'Sound'}</span>
          </button>

          {/* Lock Vault */}
          <button
            onClick={() => {
              soundEngine.playTick(700);
              onLockVault();
            }}
            className="flex items-center justify-center p-2.5 rounded-2xl bg-[#FFAAA6] border-2 border-black text-black shadow-[2px_2px_0px_#000] hover:bg-rose-300 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            title="Lock Vault & Return to 3D Door"
          >
            <Lock className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Cute kitchen note */}
        <div className="text-center pt-2 text-[11px] font-doodle font-bold text-stone-500 flex items-center justify-center space-x-1">
          <span>Cook with joy</span>
          <Heart className="w-3 h-3 text-[#FFAAA6] fill-current" />
        </div>
      </div>
    </aside>
  );
};
