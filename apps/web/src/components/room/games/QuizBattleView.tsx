'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QuizBattlePublicState,
  QuizBattlePrivateState,
} from '@partyhive/shared';
import { Sparkles, CheckCircle2, XCircle, Info, Zap } from 'lucide-react';

interface QuizBattleViewProps {
  publicState: QuizBattlePublicState;
  privateState: QuizBattlePrivateState;
  onSendAction: (type: string, payload: any) => void;
}

export const QuizBattleView: React.FC<QuizBattleViewProps> = ({
  publicState,
  privateState,
  onSendAction,
}) => {
  const currentQ = publicState.currentQuestion;
  const isRevealPhase = publicState.phase === 'ROUND_END' || publicState.phase === 'RESULTS';
  const revealData = publicState.roundReveal;

  if (!currentQ) {
    return (
      <div className="p-12 rounded-3xl bg-[#151821] border-2 border-black shadow-[5px_5px_0px_#000] text-center">
        <Sparkles className="w-8 h-8 text-yellow-400 mx-auto animate-pulse mb-3" />
        <h3 className="text-xl font-black text-white font-display">PREPARING NEXT QUESTION...</h3>
      </div>
    );
  }

  const handleSelectOption = (optionId: string) => {
    if (privateState.hasAnswered || isRevealPhase) return;
    onSendAction('submit_answer', { optionId });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      {/* Question Card */}
      <motion.div
        key={currentQ.id}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 sm:p-8 rounded-3xl bg-[#151821] border-2 border-black shadow-[6px_6px_0px_#000] relative overflow-hidden"
      >
        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-black px-3 py-1 rounded bg-[#1E2330] text-arcade-cyan border-2 border-black shadow-[2px_2px_0px_#000]">
              {currentQ.category}
            </span>
            <span className="text-xs text-slate-300 font-mono font-bold">
              Q{publicState.round} OF {publicState.totalRounds}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-yellow-400 font-black uppercase tracking-wider bg-yellow-400/10 px-2.5 py-1 rounded border border-yellow-400/30 font-mono">
            <Zap className="w-4 h-4 fill-yellow-400" />
            <span>Speed Bonus Active</span>
          </div>
        </div>

        {/* Question Text */}
        <h2 className="text-xl sm:text-2xl font-black text-white leading-relaxed font-display">
          {currentQ.question}
        </h2>

        {/* Answer Status Bar */}
        <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between text-xs text-slate-400 font-bold font-mono">
          <span>{publicState.answeredPlayerIds.length} answered</span>
          {privateState.hasAnswered && !isRevealPhase && (
            <span className="text-arcade-mint font-black flex items-center gap-1 uppercase">
              <CheckCircle2 className="w-4 h-4" /> Locked in! Waiting for others...
            </span>
          )}
        </div>
      </motion.div>

      {/* Multiple Choice Options Grid (Chunky Arcade Push Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {currentQ.options.map((option, idx) => {
          const letter = String.fromCharCode(65 + idx); // A, B, C, D
          const isSelected = privateState.selectedOptionId === option.id;
          const isCorrect = isRevealPhase && revealData?.correctOptionId === option.id;
          const isWrong = isRevealPhase && isSelected && !isCorrect;

          let cardStyle = 'border-2 border-black bg-[#1E2330] text-white shadow-[4px_4px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#000] hover:border-slate-400';
          if (isSelected && !isRevealPhase) {
            cardStyle = 'border-2 border-yellow-400 bg-yellow-400/20 text-yellow-400 shadow-[5px_5px_0px_#FFB703] translate-x-[-1px] translate-y-[-1px]';
          } else if (isCorrect) {
            cardStyle = 'border-2 border-arcade-mint bg-arcade-mint/25 text-arcade-mint shadow-[5px_5px_0px_#06D6A0] scale-[1.01]';
          } else if (isWrong) {
            cardStyle = 'border-2 border-arcade-coral bg-arcade-coral/25 text-arcade-coral shadow-[4px_4px_0px_#EF476F]';
          }

          return (
            <button
              key={option.id}
              type="button"
              disabled={privateState.hasAnswered || isRevealPhase}
              onClick={() => handleSelectOption(option.id)}
              className={`p-5 rounded-2xl text-left transition-all duration-150 flex items-center justify-between gap-4 cursor-pointer ${cardStyle} ${
                privateState.hasAnswered && !isSelected ? 'opacity-40 cursor-default' : ''
              } active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000]`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm border-2 border-black shrink-0 font-mono shadow-[2px_2px_0px_#000] ${
                  isSelected ? 'bg-yellow-400 text-black' : 'bg-[#0B0C10] text-white'
                }`}>
                  {letter}
                </span>
                <span className="text-sm sm:text-base font-black truncate">
                  {option.text}
                </span>
              </div>

              {isCorrect && <CheckCircle2 className="w-6 h-6 text-arcade-mint shrink-0 stroke-[3]" />}
              {isWrong && <XCircle className="w-6 h-6 text-arcade-coral shrink-0 stroke-[3]" />}
            </button>
          );
        })}
      </div>

      {/* Reveal Explanation Card */}
      <AnimatePresence>
        {isRevealPhase && revealData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-5 rounded-2xl bg-[#1E2330] border-2 border-black shadow-[4px_4px_0px_#000] space-y-2"
          >
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-yellow-400 font-display">
              <Info className="w-4 h-4 stroke-[2.5]" />
              <span>Explanation</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              {revealData.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
