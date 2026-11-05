import React from 'react';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showTagline = false }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <Link href="/" className="inline-flex items-center gap-3 group focus:outline-none select-none">
      <div className={`relative ${iconSizes[size]} flex items-center justify-center shrink-0`}>
        {/* Dynamic chromatic ambient glow */}
        <div className="absolute -inset-1 bg-gradient-to-tr from-yellow via-coral to-brand-500 rounded-2xl blur-md opacity-50 group-hover:opacity-90 transition-opacity duration-300" />
        
        {/* Custom PartyHive Emblem: Geometric Honeycomb Hive & Party Crown */}
        <svg
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative w-full h-full drop-shadow-lg transform group-hover:scale-105 transition-transform duration-300"
        >
          {/* Base Shield: Honeycomb Hexagonal Token */}
          <polygon
            points="22,3 39,12.5 39,31.5 22,41 5,31.5 5,12.5"
            fill="#0F1423"
            stroke="url(#hive-border-grad)"
            strokeWidth="1.5"
          />
          
          {/* Inner Hexagon Core */}
          <polygon
            points="22,7 35,14.5 35,29.5 22,37 9,29.5 9,14.5"
            fill="url(#hive-core-grad)"
          />

          {/* Party Hive Crown: 3 Connected Points */}
          <path
            d="M13 28L17 19L22 25L27 19L31 28"
            stroke="url(#crown-line-grad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Golden Honeycomb Cells / Crowd Points */}
          <circle cx="17" cy="18" r="3" fill="#06B6D4" />
          <circle cx="27" cy="18" r="3" fill="#FF5E62" />
          <circle cx="22" cy="12" r="3.5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="0.8" />

          {/* Hive Base Connection */}
          <path
            d="M14 32C17 30 27 30 30 32"
            stroke="#FDE047"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <defs>
            <linearGradient id="hive-border-grad" x1="5" y1="3" x2="39" y2="41" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F59E0B" />
              <stop offset="0.5" stopColor="#FF5E62" />
              <stop offset="1" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="hive-core-grad" x1="9" y1="7" x2="35" y2="37" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1E192B" />
              <stop offset="1" stopColor="#0B0F1C" />
            </linearGradient>
            <linearGradient id="crown-line-grad" x1="13" y1="19" x2="31" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#06B6D4" />
              <stop offset="0.5" stopColor="#F59E0B" />
              <stop offset="1" stopColor="#FF5E62" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex flex-col">
        <span className={`font-black tracking-tight ${textSizes[size]} text-white leading-none flex items-center font-display`}>
          Party<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow via-coral to-brand-400">Hive</span>
          <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-yellow animate-pulse" />
        </span>
        {showTagline && (
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400 mt-1">
            Play Together. Laugh Louder.
          </span>
        )}
      </div>
    </Link>
  );
};
