'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GAME_CATALOGUE } from '@partyhive/shared';
import {
  Search,
  Users,
  Clock,
  ArrowRight,
  Filter,
  Gamepad2,
  CheckCircle2,
} from 'lucide-react';
import { getGameVisual } from '@/components/brand/GameArt';

export default function GameLibraryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Games' },
    { id: 'party', label: 'Party & Words' },
    { id: 'trivia', label: 'Fast Trivia' },
    { id: 'social', label: 'Debates & Superlatives' },
    { id: 'arcade', label: 'Reflex Shootout' },
  ];

  const filteredGames = GAME_CATALOGUE.filter((game) => {
    const matchesSearch =
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || game.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Title & Introduction */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151821] border-2 border-black text-yellow-400 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#000] font-mono">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Curated Multiplayer Arena</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display">
          Game Catalogue & Rules
        </h1>
        <p className="text-sm sm:text-base text-slate-300 font-medium">
          Explore mechanics, strategies, and player limits for each built-in multiplayer game.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#151821] border-2 border-black shadow-[5px_5px_0px_#000] flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[2.5]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search game, mechanic, tag..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B0C10] border-2 border-black text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-yellow-400 transition-colors font-medium shadow-[inset_1px_1px_0px_#000]"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border-2 border-black transition-all cursor-pointer font-display ${
                selectedCategory === cat.id
                  ? 'bg-yellow-400 text-black shadow-[2px_2px_0px_#000]'
                  : 'bg-[#1E2330] text-slate-300 hover:text-white shadow-[1px_1px_0px_#000]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Games Grid */}
      {filteredGames.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#151821] border-2 border-black shadow-[5px_5px_0px_#000] text-center space-y-2">
          <Filter className="w-8 h-8 text-slate-500 mx-auto stroke-[2.5]" />
          <h3 className="text-lg font-black text-white font-display">No games matched your query</h3>
          <p className="text-xs text-slate-400 font-medium">Try adjusting your search keywords or resetting filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game, idx) => {
            const visual = getGameVisual(game.id);

            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                className="p-5 sm:p-6 rounded-3xl bg-[#151821] border-2 border-black shadow-[5px_5px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_#000] hover:border-yellow-400 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  
                  {/* Top Illustrated Banner */}
                  <div className="relative">
                    {visual.banner}
                    <span className={`absolute top-2.5 right-2.5 text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded border-2 border-black shadow-[2px_2px_0px_#000] ${visual.badgeClass}`}>
                      {visual.badgeText}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white group-hover:text-yellow-400 transition-colors font-display">
                      {game.title}
                    </h3>
                    <p className="text-xs font-black text-orange-400 mt-0.5 font-mono uppercase tracking-wider">
                      {game.tagline}
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed mt-2.5 font-medium">
                      {game.description}
                    </p>
                  </div>

                  {/* Highlights Bullet List */}
                  <div className="py-1.5 px-3 rounded-xl bg-[#1E2330] border-2 border-black shadow-[2px_2px_0px_#000] text-xs text-slate-200 flex items-center gap-1.5 font-mono font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-arcade-mint shrink-0 stroke-[2.5]" />
                    <span className="truncate">{visual.highlight}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {game.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-[#0B0C10] text-slate-400 border border-black"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t-2 border-black flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-xs text-slate-300 font-mono font-bold">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-arcade-cyan" />
                      {game.minPlayers}–{game.maxPlayers}p
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-yellow-400" />
                      ~{game.durationMinutes}m
                    </span>
                  </div>

                  <Link
                    href="/#join"
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all font-display"
                  >
                    <span>Play</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
