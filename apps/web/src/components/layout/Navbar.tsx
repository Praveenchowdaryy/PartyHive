import React from 'react';
import Link from 'next/link';
import { Logo } from '../brand/Logo';
import { Gamepad2, Compass, Play, Sparkles } from 'lucide-react';

interface NavbarProps {
  onCreateRoomClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onCreateRoomClick }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-black bg-[#0B0C10]/95 backdrop-blur-md shadow-[0_2px_0px_#000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-3">
        {/* Brand */}
        <Logo size="md" />

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-2 p-1.5 rounded-2xl bg-[#151821] border-2 border-black shadow-[3px_3px_0px_#000]">
          <Link
            href="/games"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-slate-300 hover:text-yellow-400 hover:bg-[#1E2330] transition-all font-display"
          >
            <Gamepad2 className="w-4 h-4 text-yellow-400" />
            <span>Game Library</span>
          </Link>
          <a
            href="#how-it-works"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-slate-300 hover:text-arcade-cyan hover:bg-[#1E2330] transition-all font-display"
          >
            <Compass className="w-4 h-4 text-arcade-cyan" />
            <span>How It Works</span>
          </a>
        </nav>

        {/* Right Action & Engine Status */}
        <div className="flex items-center gap-4">
          {/* Status Indicator */}
          <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#151821] border-2 border-black shadow-[2px_2px_0px_#000] text-[11px] font-mono font-bold text-arcade-mint">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-arcade-mint opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-arcade-mint" />
            </span>
            <span>INSTANT SYNC</span>
          </div>

          {onCreateRoomClick ? (
            <button
              onClick={onCreateRoomClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-black bg-yellow-400 hover:bg-yellow-300 border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] transition-all font-display cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-black/20" />
              <span>Create Room</span>
            </button>
          ) : (
            <Link
              href="/#join"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-black bg-yellow-400 hover:bg-yellow-300 border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] transition-all font-display cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Play Now</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
