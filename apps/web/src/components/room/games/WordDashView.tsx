'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WordDashPublicState, WordDashPrivateState } from '@partyhive/shared';
import { Zap, CheckCircle2, Trophy, Send } from 'lucide-react';

interface WordDashViewProps {
  publicState: WordDashPublicState;
  privateState: WordDashPrivateState;
  onSendAction: (type: string, payload: any) => void;
}

export const WordDashView: React.FC<WordDashViewProps> = ({
  publicState,
  privateState,
  onSendAction,
}) => {
  const [guessInput, setGuessInput] = useState('');

  const currentW = publicState.currentWord;
  const isRevealPhase = publicState.phase === 'ROUND_END' || publicState.phase === 'RESULTS';
  const revealData = publicState.roundReveal;

  if (!currentW) {
    return (
      <div className="p-12 rounded-3xl bg-[#151821] border-2 border-black shadow-[5px_5px_0px_#000] text-center">
        <Zap className="w-8 h-8 text-arcade-mint mx-auto animate-pulse mb-3" />
        <h3 className="text-xl font-black text-white font-display">PREPARING NEXT WORD SCRAMBLE...</h3>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guessInput.trim() || privateState.hasSolved || isRevealPhase) return;

    onSendAction('submit_word', { word: guessInput.trim() });
    setGuessInput('');
  };

  const letters = currentW.scrambled.split(' ').filter(Boolean);

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn select-none">
      {/* Scramble Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#151821] border-2 border-black shadow-[6px_6px_0px_#000] text-center space-y-4 relative overflow-hidden">
        {/* Category Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E2330] border-2 border-black text-arcade-mint text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#000]">
            <Zap className="w-3.5 h-3.5 fill-arcade-mint" />
            <span>{currentW.category} • Round {publicState.round}/{publicState.totalRounds}</span>
          </div>

          <div className="text-xs text-yellow-400 font-mono font-bold flex items-center gap-1 bg-yellow-400/10 px-2.5 py-1 rounded border border-yellow-400/30">
            <Trophy className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span>Fastest Solvers Earn +600 pts</span>
          </div>
        </div>

        {/* Clue Prompt */}
        <p className="text-sm sm:text-base text-slate-200 font-bold max-w-lg mx-auto">
          Clue: &ldquo;{currentW.clue}&rdquo;
        </p>

        {/* Physical 3D Arcade Scrambled Letter Tiles */}
        <div className="pt-2 pb-2">
          <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3.5">
            {letters.map((char, index) => (
              <motion.div
                key={`${char}-${index}`}
                initial={{ scale: 0.8, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: index * 0.05, type: 'spring', bounce: 0.3 }}
                className="w-12 h-16 sm:w-16 sm:h-20 rounded-2xl bg-[#1E2330] border-2 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center font-black text-3xl sm:text-4xl text-arcade-mint font-mono select-none"
              >
                {char}
              </motion.div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-400 font-mono font-bold">
          Word length: <span className="text-yellow-400 font-black">{currentW.wordLength} letters</span>
        </p>
      </div>

      {/* Solved Status & Sticky Input */}
      {privateState.hasSolved ? (
        <div className="p-6 rounded-3xl bg-[#151821] border-2 border-arcade-mint shadow-[5px_5px_0px_#06D6A0] text-center space-y-2 animate-fadeIn">
          <CheckCircle2 className="w-10 h-10 text-arcade-mint mx-auto stroke-[3]" />
          <h3 className="text-2xl font-black text-white font-display">UNSCRAMBLED CORRECTLY!</h3>
          <p className="text-xs text-arcade-mint font-mono font-bold">
            Solved in {((privateState.mySolveTimeMs || 0) / 1000).toFixed(1)}s (+{privateState.myPointsEarned || 500} pts)! Waiting for others...
          </p>
        </div>
      ) : !isRevealPhase ? (
        <form onSubmit={handleSubmit} className="p-3 rounded-2xl bg-[#151821] border-2 border-black shadow-[5px_5px_0px_#000] flex gap-2">
          <input
            type="text"
            value={guessInput}
            onChange={(e) => setGuessInput(e.target.value.toUpperCase())}
            placeholder="TYPE UNSCRAMBLED WORD..."
            maxLength={currentW.wordLength + 5}
            className="flex-1 px-4 py-3 rounded-xl bg-[#0B0C10] border-2 border-black text-yellow-400 text-lg font-black tracking-widest text-center uppercase placeholder-slate-600 focus:outline-none focus:border-arcade-mint font-mono shadow-[inset_2px_2px_0px_#000]"
            autoFocus
            autoComplete="off"
            autoCapitalize="characters"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-arcade-mint hover:bg-emerald-400 text-black font-black text-sm uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] transition-all flex items-center gap-1.5 cursor-pointer font-display"
          >
            <span>SOLVE</span>
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>
      ) : null}

      {/* Round Reveal Card */}
      <AnimatePresence>
        {isRevealPhase && revealData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-3xl bg-[#151821] border-2 border-arcade-mint shadow-[6px_6px_0px_#000] text-center space-y-3"
          >
            <span className="text-xs uppercase font-black tracking-widest text-slate-400 font-mono">
              ROUND COMPLETE
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white font-display">
              The answer was <span className="text-arcade-mint font-mono underline">{revealData.answer}</span>!
            </h3>
            {revealData.fastestPlayerNickname && (
              <p className="text-xs text-yellow-400 font-mono font-bold flex items-center justify-center gap-1.5">
                <Trophy className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>Fastest Solver: {revealData.fastestPlayerNickname} ({((revealData.fastestTimeMs || 0) / 1000).toFixed(1)}s)</span>
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
