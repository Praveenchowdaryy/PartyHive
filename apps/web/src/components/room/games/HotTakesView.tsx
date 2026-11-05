'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HotTakesPublicState,
  HotTakesPrivateState,
} from '@partyhive/shared';
import { Flame, CheckCircle2 } from 'lucide-react';

interface HotTakesViewProps {
  publicState: HotTakesPublicState;
  privateState: HotTakesPrivateState;
  onSendAction: (type: string, payload: any) => void;
}

export const HotTakesView: React.FC<HotTakesViewProps> = ({
  publicState,
  privateState,
  onSendAction,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<'A' | 'B' | null>(null);
  const [selectedPrediction, setSelectedPrediction] = useState<'A' | 'B' | null>(null);

  const currentPrompt = publicState.currentPrompt;
  const isRevealPhase = publicState.phase === 'ROUND_END' || publicState.phase === 'RESULTS';
  const revealData = publicState.roundReveal;

  if (!currentPrompt) {
    return (
      <div className="p-12 rounded-3xl bg-[#151821] border-2 border-black shadow-[5px_5px_0px_#000] text-center">
        <Flame className="w-8 h-8 text-yellow-400 mx-auto animate-pulse mb-3" />
        <h3 className="text-xl font-black text-white font-display">LOADING DILEMMA...</h3>
      </div>
    );
  }

  const handleVoteSubmit = () => {
    if (!selectedChoice || !selectedPrediction || privateState.hasVoted) return;
    onSendAction('submit_vote', {
      choice: selectedChoice,
      prediction: selectedPrediction,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn select-none">
      {/* Prompt Card */}
      <motion.div
        key={currentPrompt.id}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 sm:p-8 rounded-3xl bg-[#151821] border-2 border-black shadow-[6px_6px_0px_#000] text-center space-y-3"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E2330] border-2 border-black text-arcade-coral text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#000]">
          <Flame className="w-4 h-4 fill-arcade-coral text-arcade-coral" />
          <span>{currentPrompt.category} • Hot Take {publicState.round}/{publicState.totalRounds}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight font-display">
          {currentPrompt.scenario}
        </h2>

        <p className="text-xs text-slate-300 font-medium">
          Pick your stance, then predict what the majority of the room will choose!
        </p>
      </motion.div>

      {/* Reveal Percentage Bar (During Reveal Phase) */}
      <AnimatePresence>
        {isRevealPhase && revealData && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-3xl bg-[#151821] border-2 border-black shadow-[5px_5px_0px_#000] space-y-4"
          >
            <div className="flex justify-between items-center text-sm font-black font-mono">
              <span className="text-yellow-400">Option A: {revealData.percentA}%</span>
              <span className="text-xs uppercase font-black text-white bg-[#0B0C10] px-3 py-1 rounded border border-black">
                Majority: {revealData.majority === 'TIE' ? 'Split 50/50 Tie!' : `Option ${revealData.majority}`}
              </span>
              <span className="text-arcade-coral">Option B: {revealData.percentB}%</span>
            </div>

            {/* Split Bar with Solid Border */}
            <div className="w-full h-6 rounded-xl bg-[#0B0C10] overflow-hidden flex border-2 border-black shadow-[inset_2px_2px_0px_#000]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${revealData.percentA}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="bg-yellow-400 h-full"
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${revealData.percentB}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="bg-arcade-coral h-full"
              />
            </div>

            <div className="flex justify-between text-xs text-slate-400 font-mono font-bold">
              <span>{revealData.votesA.length} votes</span>
              <span>{revealData.votesB.length} votes</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voting Cards Grid (Chunky Arcade Battle Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Option A */}
        <div
          onClick={() => {
            if (!privateState.hasVoted && !isRevealPhase) {
              setSelectedChoice('A');
              if (!selectedPrediction) setSelectedPrediction('A');
            }
          }}
          className={`p-6 rounded-3xl border-2 border-black transition-all cursor-pointer flex flex-col justify-between ${
            (privateState.myVote === 'A' || selectedChoice === 'A')
              ? 'bg-[#1E2330] border-yellow-400 shadow-[5px_5px_0px_#FFB703] translate-x-[-1px] translate-y-[-1px]'
              : 'bg-[#151821] shadow-[4px_4px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#000] hover:border-slate-500'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="w-9 h-9 rounded-xl bg-yellow-400 text-black border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center font-black font-mono">
                A
              </span>
              {(privateState.myVote === 'A' || selectedChoice === 'A') && (
                <span className="text-xs font-black text-yellow-400 flex items-center gap-1 uppercase tracking-wider font-mono">
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> Your Choice
                </span>
              )}
            </div>

            <p className="text-lg font-black text-white mb-4 leading-snug font-display">
              {currentPrompt.optionA}
            </p>
          </div>

          {/* Prediction Selector button */}
          {!privateState.hasVoted && !isRevealPhase && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPrediction('A');
              }}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider border-2 border-black transition-all cursor-pointer ${
                selectedPrediction === 'A'
                  ? 'bg-yellow-400 text-black shadow-[2px_2px_0px_#000]'
                  : 'bg-[#0B0C10] text-slate-400 hover:text-white shadow-[1px_1px_0px_#000]'
              }`}
            >
              {selectedPrediction === 'A' ? '★ PREDICTED MAJORITY' : 'PREDICT OPTION A WINS'}
            </button>
          )}
        </div>

        {/* Option B */}
        <div
          onClick={() => {
            if (!privateState.hasVoted && !isRevealPhase) {
              setSelectedChoice('B');
              if (!selectedPrediction) setSelectedPrediction('B');
            }
          }}
          className={`p-6 rounded-3xl border-2 border-black transition-all cursor-pointer flex flex-col justify-between ${
            (privateState.myVote === 'B' || selectedChoice === 'B')
              ? 'bg-[#1E2330] border-arcade-coral shadow-[5px_5px_0px_#EF476F] translate-x-[-1px] translate-y-[-1px]'
              : 'bg-[#151821] shadow-[4px_4px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#000] hover:border-slate-500'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="w-9 h-9 rounded-xl bg-arcade-coral text-white border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center font-black font-mono">
                B
              </span>
              {(privateState.myVote === 'B' || selectedChoice === 'B') && (
                <span className="text-xs font-black text-arcade-coral flex items-center gap-1 uppercase tracking-wider font-mono">
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> Your Choice
                </span>
              )}
            </div>

            <p className="text-lg font-black text-white mb-4 leading-snug font-display">
              {currentPrompt.optionB}
            </p>
          </div>

          {/* Prediction Selector button */}
          {!privateState.hasVoted && !isRevealPhase && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPrediction('B');
              }}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider border-2 border-black transition-all cursor-pointer ${
                selectedPrediction === 'B'
                  ? 'bg-arcade-coral text-white shadow-[2px_2px_0px_#000]'
                  : 'bg-[#0B0C10] text-slate-400 hover:text-white shadow-[1px_1px_0px_#000]'
              }`}
            >
              {selectedPrediction === 'B' ? '★ PREDICTED MAJORITY' : 'PREDICT OPTION B WINS'}
            </button>
          )}
        </div>
      </div>

      {/* Submit Vote Button */}
      {!privateState.hasVoted && !isRevealPhase && (
        <div className="text-center pt-2">
          <button
            type="button"
            disabled={!selectedChoice || !selectedPrediction}
            onClick={handleVoteSubmit}
            className="py-4 px-8 rounded-2xl text-sm font-black text-black bg-yellow-400 hover:bg-yellow-300 border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] transition-all disabled:opacity-40 cursor-pointer uppercase tracking-wider font-display"
          >
            LOCK IN VOTE & PREDICTION
          </button>
        </div>
      )}

      {privateState.hasVoted && !isRevealPhase && (
        <div className="text-center text-xs text-arcade-mint font-black uppercase tracking-wider flex items-center justify-center gap-1.5 pt-2 font-mono">
          <CheckCircle2 className="w-4 h-4 stroke-[3]" />
          <span>Vote submitted! Waiting for the crowd reveal...</span>
        </div>
      )}
    </div>
  );
};
