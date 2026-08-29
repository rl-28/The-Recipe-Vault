import React from 'react';
import { motion } from 'framer-motion';

export type MrSaltMood = 'idle' | 'shake' | 'celebrate' | 'think' | 'wink';

interface MrSaltSvgProps {
  mood?: MrSaltMood;
  className?: string;
  size?: number;
}

export const MrSaltSvg: React.FC<MrSaltSvgProps> = ({
  mood = 'idle',
  className = '',
  size = 120,
}) => {
  return (
    <motion.svg
      width={size}
      height={size * 1.25}
      viewBox="0 0 160 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
      animate={
        mood === 'shake'
          ? {
              rotate: [0, -18, 18, -14, 14, -8, 8, 0],
              y: [0, -8, 4, -6, 2, 0],
              scale: [1, 1.05, 0.96, 1.04, 1],
              transition: { duration: 0.55, ease: 'easeInOut' },
            }
          : mood === 'celebrate'
          ? {
              y: [0, -22, 0, -12, 0],
              scale: [1, 1.1, 0.95, 1.05, 1],
              rotate: [0, -6, 6, -3, 0],
              transition: { duration: 0.8, ease: 'easeOut' },
            }
          : mood === 'think'
          ? {
              rotate: [0, 8, 6, 8],
              y: [0, -4, -2, -4],
              transition: { duration: 1.5, repeat: Infinity, repeatType: 'reverse' },
            }
          : {
              y: [0, -3, 0],
              scaleY: [1, 1.02, 1],
              transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
            }
      }
    >
      {/* Soft Ground Shadow */}
      <ellipse
        cx="80"
        cy="188"
        rx="46"
        ry="8"
        fill="#000000"
        fillOpacity="0.12"
      />

      {/* ============================================================ */}
      {/* 1. GLASS SHAKER BODY                                         */}
      {/* ============================================================ */}
      <g>
        {/* Main Body Silhouette with Thick Sketch Outline */}
        <path
          d="M48 68 C48 62 52 58 60 58 L100 58 C108 58 112 62 112 68 L122 152 C124 168 114 182 98 182 L62 182 C46 182 36 168 38 152 Z"
          fill="#FFFDF8"
          stroke="#000000"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* Inner Salt Granules Level */}
        <path
          d="M43 120 Q80 114 117 120 L122 152 C124 168 114 182 98 182 L62 182 C46 182 36 168 38 152 Z"
          fill="#FAF7F0"
        />

        {/* Subtle Glass Facet Vertical Highlights */}
        <path
          d="M58 66 L52 165"
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeOpacity="0.15"
        />
        <path
          d="M102 66 L108 165"
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeOpacity="0.15"
        />

        {/* White Glass Shine Glare */}
        <path
          d="M48 76 Q46 110 45 140"
          stroke="#FFFFFF"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
      </g>

      {/* ============================================================ */}
      {/* 2. CHROME SHAKER CAP WITH DISPENSING HOLES                   */}
      {/* ============================================================ */}
      <g>
        {/* Shaker Metal Collar */}
        <path
          d="M54 58 L106 58 L103 48 L57 48 Z"
          fill="#FFE68C"
          stroke="#000000"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Shaker Perforated Dome Cap */}
        <path
          d="M57 48 C57 32 103 32 103 48 Z"
          fill="#FFE68C"
          stroke="#000000"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* 5 Shaker Holes */}
        <circle cx="80" cy="38" r="2.2" fill="#000000" />
        <circle cx="71" cy="42" r="2" fill="#000000" />
        <circle cx="89" cy="42" r="2" fill="#000000" />
        <circle cx="65" cy="46" r="1.8" fill="#000000" />
        <circle cx="95" cy="46" r="1.8" fill="#000000" />
      </g>

      {/* ============================================================ */}
      {/* 3. TINY CHEF HAT (Jauntily Cocked on Top)                    */}
      {/* ============================================================ */}
      <g transform="translate(14, -6) rotate(10 80 40)">
        {/* Hat Headband */}
        <rect
          x="66"
          y="22"
          width="26"
          height="7"
          rx="2"
          fill="#FFFDF8"
          stroke="#000000"
          strokeWidth="3"
        />
        {/* Hat Poof Puffs */}
        <path
          d="M65 22 C58 12 70 2 79 7 C83 1 93 2 96 10 C103 12 99 22 93 22 Z"
          fill="#FFFDF8"
          stroke="#000000"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </g>

      {/* ============================================================ */}
      {/* 4. FACIAL EXPRESSIONS & ROSY CHEEKS                          */}
      {/* ============================================================ */}
      <g>
        {/* Rosy Blush Cheeks */}
        <circle cx="56" cy="116" r="6" fill="#FFAAA6" fillOpacity="0.8" />
        <circle cx="104" cy="116" r="6" fill="#FFAAA6" fillOpacity="0.8" />

        {/* Dynamic Eyes based on Mood */}
        {mood === 'shake' || mood === 'celebrate' ? (
          // Happy Joy Squinting Arches (^ ^)
          <g>
            <path
              d="M62 108 Q68 100 74 108"
              stroke="#000000"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M86 108 Q92 100 98 108"
              stroke="#000000"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        ) : mood === 'wink' ? (
          // One Eye Open, One Winking
          <g>
            <circle cx="68" cy="106" r="5" fill="#000000" />
            <circle cx="66.5" cy="104.5" r="1.8" fill="#FFFFFF" />
            <path
              d="M86 108 Q92 102 98 108"
              stroke="#000000"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </g>
        ) : (
          // Big Friendly Cartoon Eyes
          <g>
            {/* Left Eye */}
            <circle cx="68" cy="106" r="5.5" fill="#000000" />
            <circle cx="66.5" cy="104" r="2" fill="#FFFFFF" />

            {/* Right Eye */}
            <circle cx="92" cy="106" r="5.5" fill="#000000" />
            <circle cx="90.5" cy="104" r="2" fill="#FFFFFF" />
          </g>
        )}

        {/* Mouth */}
        {mood === 'celebrate' ? (
          // Big Open "D" Happy Smile with Tongue
          <g>
            <path
              d="M72 118 Q80 132 88 118 Z"
              fill="#000000"
              stroke="#000000"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path
              d="M76 124 Q80 128 84 124 Z"
              fill="#FFAAA6"
            />
          </g>
        ) : mood === 'shake' ? (
          // Wavy Effort Mouth
          <path
            d="M74 120 Q80 126 86 120"
            stroke="#000000"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        ) : mood === 'think' ? (
          // Puzzled Little "o" Mouth
          <circle cx="80" cy="122" r="3.5" stroke="#000000" strokeWidth="3" fill="#FFFDF8" />
        ) : (
          // Warm Cheerful Smile
          <path
            d="M73 118 Q80 126 87 118"
            stroke="#000000"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        )}
      </g>

      {/* ============================================================ */}
      {/* 5. CUTE LITTLE HANDS & SPOON                                 */}
      {/* ============================================================ */}
      <g>
        {/* Left Hand Mitten */}
        <circle
          cx="42"
          cy="132"
          r="6.5"
          fill="#FFFDF8"
          stroke="#000000"
          strokeWidth="3"
        />

        {/* Right Hand Mitten holding a tiny wooden spoon */}
        <g>
          {/* Wooden Spoon */}
          <path
            d="M116 142 L132 108"
            stroke="#D97706"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <ellipse
            cx="134"
            cy="104"
            rx="6"
            ry="4.5"
            transform="rotate(-25 134 104)"
            fill="#F59E0B"
            stroke="#000000"
            strokeWidth="2.5"
          />
          {/* Right Hand Mitten */}
          <circle
            cx="118"
            cy="132"
            r="6.5"
            fill="#FFFDF8"
            stroke="#000000"
            strokeWidth="3"
          />
        </g>
      </g>
    </motion.svg>
  );
};
