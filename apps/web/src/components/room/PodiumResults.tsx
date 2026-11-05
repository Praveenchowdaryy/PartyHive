'use client';

import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { GameResultPayload, Player } from '@partyhive/shared';
import { Trophy, Crown, RotateCcw, Home, Sparkles, Medal, Share2, Camera } from 'lucide-react';
import { PlayerAvatar } from '../common/PlayerAvatar';

interface PodiumResultsProps {
  results: GameResultPayload;
  currentPlayer: Player;
  onPlayAgain: () => void;
  onReturnToLobby: () => void;
}

export const PodiumResults: React.FC<PodiumResultsProps> = ({
  results,
  currentPlayer,
  onPlayAgain,
  onReturnToLobby,
}) => {
  const [isStarting, setIsStarting] = useState(false);
  const isHost = currentPlayer.isHost;
  const standings = results.finalStandings;
  const first = standings[0];
  const second = standings[1];
  const third = standings[2];

  useEffect(() => {
    // Fire celebratory confetti!
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors: ['#FFB703', '#FB8500', '#06D6A0', '#EF476F', '#00F0FF'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors: ['#FFB703', '#FB8500', '#06D6A0', '#EF476F', '#00F0FF'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      
      {/* Screenshot-Ready Outer Card Frame */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#151821] border-2 border-black shadow-[6px_6px_0px_#000] space-y-8 relative overflow-hidden">
        
        {/* Subtle Watermark for Social Screenshots */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded bg-[#0B0C10] border border-black text-[10px] uppercase font-black tracking-widest text-yellow-400 font-mono select-none">
          <span>PARTYHIVE • ARCADE RESULTS</span>
        </div>

        {/* Top Victory Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2 pt-2"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-yellow-400 text-black text-xs font-black border-2 border-black uppercase tracking-wider shadow-[2px_2px_0px_#000]">
            <Trophy className="w-4 h-4 fill-black stroke-black" />
            <span>MATCH COMPLETE • {results.gameId.replace(/_/g, ' ').toUpperCase()}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display">
            Tournament Podium
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Final leaderboard standings for this room match.
          </p>
        </motion.div>

        {/* 3-Step Arcade Podium Pedestals with Staggered Heights */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end pt-6 max-w-2xl mx-auto text-center">
          
          {/* 2nd Place (Silver Pedestal) */}
          {second ? (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: 'spring', bounce: 0.3 }}
              className="space-y-2"
            >
              <div className="flex justify-center">
                <PlayerAvatar avatar={second.avatar} size="lg" />
              </div>
              <div className="font-black text-white text-xs sm:text-sm truncate">
                {second.nickname}
              </div>
              <div className="font-mono text-xs text-slate-300 font-bold bg-[#0B0C10] px-2 py-0.5 rounded border border-black inline-block">
                {second.score} pts
              </div>
              <div className="h-28 sm:h-36 rounded-t-2xl bg-gradient-to-b from-slate-400 to-slate-600 border-2 border-black border-b-0 shadow-[4px_0px_0px_#000] flex flex-col items-center justify-center font-black text-3xl sm:text-5xl text-slate-900 font-display">
                <span>2</span>
                <span className="text-[10px] font-black tracking-widest uppercase text-slate-900 font-mono -mt-1">SILVER</span>
              </div>
            </motion.div>
          ) : (
            <div className="h-28" />
          )}

          {/* 1st Place (Gold Winner Champion Pedestal) */}
          {first ? (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.35, type: 'spring', bounce: 0.4 }}
              className="space-y-2 relative -top-3"
            >
              <div className="relative inline-block">
                <Crown className="w-8 h-8 text-yellow-400 fill-yellow-400 absolute -top-7 left-1/2 -translate-x-1/2 animate-bounce stroke-black stroke-[1.5]" />
                <PlayerAvatar avatar={first.avatar} size="xl" />
              </div>
              <div className="font-black text-white text-sm sm:text-base truncate font-display">
                {first.nickname}
              </div>
              <div className="font-mono text-sm text-yellow-400 font-black bg-[#0B0C10] px-3 py-0.5 rounded border border-black inline-block shadow-[2px_2px_0px_#000]">
                {first.score} pts
              </div>
              <div className="h-36 sm:h-48 rounded-t-2xl bg-gradient-to-b from-yellow-300 to-amber-500 border-2 border-black border-b-0 shadow-[5px_0px_0px_#000] flex flex-col items-center justify-center font-black text-4xl sm:text-6xl text-black font-display">
                <span>1</span>
                <span className="text-xs font-black tracking-widest uppercase text-black font-mono -mt-1">CHAMPION</span>
              </div>
            </motion.div>
          ) : (
            <div className="h-36" />
          )}

          {/* 3rd Place (Bronze Pedestal) */}
          {third ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, type: 'spring', bounce: 0.3 }}
              className="space-y-2"
            >
              <div className="flex justify-center">
                <PlayerAvatar avatar={third.avatar} size="lg" />
              </div>
              <div className="font-black text-white text-xs sm:text-sm truncate">
                {third.nickname}
              </div>
              <div className="font-mono text-xs text-slate-300 font-bold bg-[#0B0C10] px-2 py-0.5 rounded border border-black inline-block">
                {third.score} pts
              </div>
              <div className="h-20 sm:h-28 rounded-t-2xl bg-gradient-to-b from-amber-600 to-amber-800 border-2 border-black border-b-0 shadow-[4px_0px_0px_#000] flex flex-col items-center justify-center font-black text-2xl sm:text-4xl text-amber-950 font-display">
                <span>3</span>
                <span className="text-[10px] font-black tracking-widest uppercase text-amber-950 font-mono -mt-1">BRONZE</span>
              </div>
            </motion.div>
          ) : (
            <div className="h-20" />
          )}
        </div>

        {/* Detailed Standings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-5 sm:p-6 rounded-2xl bg-[#0B0C10] border-2 border-black shadow-[4px_4px_0px_#000] space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-yellow-400 flex items-center gap-2 font-display">
              <Medal className="w-4 h-4 text-yellow-400 stroke-[2.5]" />
              <span>Full Scoreboard Standings</span>
            </h3>
            <span className="text-xs font-mono font-bold text-slate-400">
              {standings.length} Players
            </span>
          </div>

          <div className="space-y-2">
            {standings.map((p) => (
              <div
                key={p.playerId}
                className="flex items-center justify-between p-3 rounded-xl bg-[#151821] border-2 border-black shadow-[2px_2px_0px_#000] text-xs sm:text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="font-black text-yellow-400 w-6 font-mono text-center">
                    #{p.rank}
                  </span>
                  <PlayerAvatar avatar={p.avatar} size="sm" />
                  <span className="font-black text-white">{p.nickname}</span>
                  {p.isWinner && (
                    <span className="text-[9px] px-2 py-0.5 rounded bg-yellow-400 text-black font-black uppercase border border-black">
                      WINNER
                    </span>
                  )}
                </div>
                <span className="font-mono font-black text-yellow-400 bg-[#0B0C10] px-2.5 py-1 rounded border border-black">
                  {p.score} pts
                </span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Tactile Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        {isHost ? (
          <>
            <button
              type="button"
              onClick={() => {
                setIsStarting(true);
                onPlayAgain();
              }}
              disabled={isStarting}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-sm uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer font-display"
            >
              <RotateCcw className={`w-4 h-4 stroke-[3] ${isStarting ? 'animate-spin' : ''}`} />
              <span>{isStarting ? 'STARTING REMATCH...' : 'PLAY AGAIN (REMATCH)'}</span>
            </button>

            <button
              type="button"
              onClick={onReturnToLobby}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#1E2330] hover:bg-[#252B3B] hover:text-yellow-400 text-white font-black text-sm uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] flex items-center justify-center gap-2 transition-all cursor-pointer font-display"
            >
              <Home className="w-4 h-4 text-yellow-400 stroke-[2.5]" />
              <span>SWITCH GAME / LOBBY</span>
            </button>
          </>
        ) : (
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider text-center py-2 bg-[#151821] px-6 py-3 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000]">
            Waiting for the host to start a rematch or return to the lobby...
          </div>
        )}
      </div>
    </div>
  );
};
