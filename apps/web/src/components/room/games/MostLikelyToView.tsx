'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MostLikelyToPublicState, MostLikelyToPrivateState, RoomSnapshot } from '@partyhive/shared';
import { Crown, CheckCircle2 } from 'lucide-react';
import { PlayerAvatar } from '../../common/PlayerAvatar';

interface MostLikelyToViewProps {
  publicState: MostLikelyToPublicState;
  privateState: MostLikelyToPrivateState;
  room: RoomSnapshot;
  currentPlayerId: string;
  onSendAction: (type: string, payload: any) => void;
}

export const MostLikelyToView: React.FC<MostLikelyToViewProps> = ({
  publicState,
  privateState,
  room,
  currentPlayerId,
  onSendAction,
}) => {
  const currentPrompt = publicState.currentPrompt;
  const isRevealPhase = publicState.phase === 'ROUND_END' || publicState.phase === 'RESULTS';
  const revealData = publicState.roundReveal;

  if (!currentPrompt) {
    return (
      <div className="p-12 rounded-3xl bg-[#151821] border-2 border-black shadow-[5px_5px_0px_#000] text-center">
        <Crown className="w-8 h-8 text-yellow-400 mx-auto animate-pulse mb-3" />
        <h3 className="text-xl font-black text-white font-display">LOADING NEXT SUPERLATIVE...</h3>
      </div>
    );
  }

  const handleVote = (targetPlayerId: string) => {
    if (privateState.hasVoted || isRevealPhase) return;
    onSendAction('vote_player', { targetPlayerId });
  };

  const activePlayers = room.players.filter(p => p.isOnline);

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn select-none">
      {/* Superlative Prompt Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#151821] border-2 border-black shadow-[6px_6px_0px_#000] text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E2330] border-2 border-black text-yellow-400 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#000]">
          <Crown className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          <span>{currentPrompt.category} • Superlative {publicState.round}/{publicState.totalRounds}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight font-display">
          &ldquo;{currentPrompt.prompt}&rdquo;
        </h2>

        <p className="text-xs text-slate-300 font-medium">
          Tap on the squad member who fits this superlative the best!
        </p>
      </div>

      {/* Reveal Banner */}
      <AnimatePresence>
        {isRevealPhase && revealData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 sm:p-8 rounded-3xl border-2 border-yellow-400 bg-[#1E2330] text-center space-y-3 shadow-[6px_6px_0px_#000]"
          >
            <div className="relative inline-block">
              <Crown className="w-10 h-10 text-yellow-400 fill-yellow-400 mx-auto animate-bounce mb-1 stroke-black stroke-[1.5]" />
              <PlayerAvatar avatar={revealData.winnerAvatar} size="xl" />
            </div>

            <div>
              <span className="text-xs uppercase font-black text-yellow-400 tracking-widest block font-mono">
                THE SQUAD HAS SPOKEN!
              </span>
              <h3 className="text-3xl font-black text-white font-display">
                {revealData.winnerNickname}
              </h3>
              <p className="text-xs text-slate-300 mt-1 font-mono font-bold">
                Received <span className="text-yellow-400 font-black">{revealData.voteCount} votes</span>! (+500 pts)
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Player Candidate Voting Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {activePlayers.map((player) => {
          const isVotedByMe = privateState.myVotePlayerId === player.id;
          const isWinner = isRevealPhase && revealData?.winnerId === player.id;
          const voterList = revealData?.votesByPlayer?.[player.id] || [];

          let cardStyle = 'border-2 border-black bg-[#151821] text-white shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#000] hover:border-slate-500';
          if (isVotedByMe && !isRevealPhase) {
            cardStyle = 'border-2 border-yellow-400 bg-yellow-400/20 text-yellow-400 shadow-[4px_4px_0px_#FFB703] translate-x-[-1px] translate-y-[-1px]';
          } else if (isWinner) {
            cardStyle = 'border-2 border-yellow-400 bg-yellow-400/25 text-yellow-400 shadow-[5px_5px_0px_#FFB703] scale-[1.02]';
          }

          return (
            <button
              key={player.id}
              type="button"
              disabled={privateState.hasVoted || isRevealPhase}
              onClick={() => handleVote(player.id)}
              className={`p-4 rounded-2xl text-center flex flex-col items-center justify-between gap-3 transition-all cursor-pointer ${cardStyle} ${
                privateState.hasVoted && !isVotedByMe ? 'opacity-40 cursor-default' : ''
              } active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000]`}
            >
              <div className="relative">
                {isWinner && (
                  <Crown className="w-5 h-5 text-yellow-400 fill-yellow-400 absolute -top-4 left-1/2 -translate-x-1/2 animate-bounce stroke-black" />
                )}
                <PlayerAvatar avatar={player.avatar} size="lg" />
              </div>

              <div className="min-w-0 w-full">
                <span className="text-sm font-black text-white block truncate">
                  {player.nickname}
                </span>
                {player.id === currentPlayerId && (
                  <span className="text-[10px] text-yellow-400 font-bold block uppercase font-mono">
                    (You)
                  </span>
                )}
              </div>

              {/* Status pill */}
              {isVotedByMe && !isRevealPhase && (
                <span className="text-[10px] font-black uppercase text-black px-2 py-0.5 rounded bg-yellow-400 border border-black shadow-[1px_1px_0px_#000]">
                  YOUR VOTE
                </span>
              )}

              {/* Reveal Phase Vote Count */}
              {isRevealPhase && (
                <div className="text-[11px] font-mono font-black text-yellow-400 bg-[#0B0C10] px-2 py-0.5 rounded border border-black">
                  {voterList.length} {voterList.length === 1 ? 'vote' : 'votes'}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {privateState.hasVoted && !isRevealPhase && (
        <div className="text-center text-xs text-arcade-mint font-black uppercase tracking-wider flex items-center justify-center gap-1.5 pt-2 font-mono">
          <CheckCircle2 className="w-4 h-4 stroke-[3]" />
          <span>Vote submitted! Waiting for the squad results...</span>
        </div>
      )}
    </div>
  );
};
