'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GAME_CATALOGUE } from '@partyhive/shared';
import { Users, Clock, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { getGameVisual } from '../brand/GameArt';

export const FeaturedGames: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-[#0B0C10] relative border-t-2 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151821] border-2 border-black text-yellow-400 text-xs font-black uppercase tracking-wider mb-2.5 shadow-[2px_2px_0px_#000] font-mono">
              <Sparkles className="w-3.5 h-3.5 fill-yellow-400" />
              <span>Multiplayer Game Arcade</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display">
              Six Built-In Multiplayer Hits
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2 font-medium">
              Switch smoothly between drawing, trivia, debates, word sprints, and superlatives — all in one room.
            </p>
          </div>

          <Link
            href="/games"
            className="inline-flex items-center gap-2 text-xs font-black text-yellow-400 hover:text-yellow-300 transition-colors uppercase tracking-wider font-mono bg-[#151821] px-4 py-2 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000]"
          >
            <span>Browse Full Rules & Details</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </Link>
        </div>

        {/* Games Grid: Physical Game Cartridges */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAME_CATALOGUE.map((game, idx) => {
            const visual = getGameVisual(game.id);

            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                className="rounded-3xl p-5 bg-[#151821] border-2 border-black shadow-[5px_5px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_#000] hover:border-yellow-400 transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Visual Illustrated Art Banner with Ribbon */}
                <div className="mb-4 relative">
                  {visual.banner}
                  <span className={`absolute top-2.5 right-2.5 text-[10px] font-black uppercase px-2.5 py-0.5 rounded border-2 border-black shadow-[2px_2px_0px_#000] ${visual.badgeClass}`}>
                    {visual.badgeText}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xl font-black text-white group-hover:text-yellow-400 transition-colors font-display">
                    {game.title}
                  </h3>
                  <p className="text-xs font-black text-orange-400 mt-0.5 mb-2 font-mono uppercase tracking-wider">
                    {game.tagline}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4 font-medium">
                    {game.description}
                  </p>
                </div>

                {/* Footer Metadata & Rule Chip */}
                <div>
                  <div className="mb-3 py-1.5 px-3 rounded-xl bg-[#1E2330] border-2 border-black shadow-[2px_2px_0px_#000] text-[11px] font-bold text-slate-200 flex items-center gap-1.5 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-arcade-mint shrink-0 stroke-[2.5]" />
                    <span className="truncate">{visual.highlight}</span>
                  </div>

                  <div className="pt-3 border-t-2 border-black flex items-center justify-between text-[11px] text-slate-300 font-mono font-bold">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-arcade-cyan" />
                      <span>{game.minPlayers}–{game.maxPlayers} players</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-yellow-400" />
                      <span>~{game.durationMinutes}m</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
