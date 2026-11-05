'use client';

import React, { useEffect, useCallback } from 'react';
import {
  ReactionArenaPublicState,
  ReactionArenaPrivateState,
} from '@partyhive/shared';
import { Zap, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { PlayerAvatar } from '../../common/PlayerAvatar';

interface ReactionArenaViewProps {
  publicState: ReactionArenaPublicState;
  privateState: ReactionArenaPrivateState;
  onSendAction: (type: string, payload: any) => void;
}

export const ReactionArenaView: React.FC<ReactionArenaViewProps> = ({
  publicState,
  privateState,
  onSendAction,
}) => {
  const isWaitingSignal = publicState.arenaStatus === 'WAITING_SIGNAL';
  const isSignalActive = publicState.arenaStatus === 'SIGNAL_ACTIVE';
  const isRoundResults = publicState.arenaStatus === 'ROUND_RESULTS' || publicState.phase === 'ROUND_END';

  const handleReact = useCallback(() => {
    if (privateState.hasReacted || isRoundResults) return;
    onSendAction('react', {
      clientTimestamp: Date.now(),
    });
  }, [privateState.hasReacted, isRoundResults, onSendAction]);

  // Spacebar hotkey listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !privateState.hasReacted && !isRoundResults) {
        e.preventDefault();
        handleReact();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleReact, privateState.hasReacted, isRoundResults]);

  let arenaBg = 'bg-[#151821] border-2 border-black shadow-[6px_6px_0px_#000]';
  let statusText = 'GET READY...';
  let subText = 'Wait for the arena to turn green. Press SPACE or Tap anywhere!';

  if (isWaitingSignal) {
    arenaBg = 'bg-[#2A1118] border-2 border-rose-500 shadow-[6px_6px_0px_#000]';
    statusText = 'WAIT FOR GREEN...';
    subText = 'Do NOT tap yet! False starts result in 0 points.';
  } else if (isSignalActive) {
    arenaBg = 'bg-arcade-mint border-2 border-black text-black shadow-[8px_8px_0px_#000]';
    statusText = 'TAP NOW!!!';
    subText = 'REACT FAST! SMASH SCREEN OR HIT SPACE!';
  } else if (isRoundResults) {
    arenaBg = 'bg-[#151821] border-2 border-black shadow-[6px_6px_0px_#000]';
    statusText = 'ROUND FINISHED';
    subText = 'Reflex times locked in for this round.';
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header bar */}
      <div className="flex items-center justify-between text-xs text-slate-300 font-mono font-bold">
        <div className="flex items-center gap-1.5 uppercase tracking-wider text-yellow-400">
          <Zap className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
          <span>Reflex Arena • Round {publicState.round}/{publicState.totalRounds}</span>
        </div>
        <span>{publicState.reactedPlayerIds.length} players reacted</span>
      </div>

      {/* Main Interactive Arena Box (Massive thumb-friendly touch target) */}
      <button
        type="button"
        onClick={handleReact}
        className={`w-full h-80 sm:h-96 rounded-3xl flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all duration-100 select-none relative overflow-hidden active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000] ${arenaBg}`}
      >
        {isSignalActive && (
          <div className="absolute inset-0 bg-white/20 animate-ping pointer-events-none" />
        )}

        {privateState.isFalseStart ? (
          <div className="space-y-3">
            <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto animate-bounce stroke-[2.5]" />
            <h3 className="text-3xl sm:text-4xl font-black text-yellow-400 tracking-tight font-display">
              FALSE START!
            </h3>
            <p className="text-xs text-slate-200 font-bold uppercase tracking-wider">
              You clicked before the green signal! 0 points this round.
            </p>
          </div>
        ) : privateState.hasReacted && privateState.myReactionTimeMs ? (
          <div className="space-y-2">
            <CheckCircle2 className="w-14 h-14 text-arcade-mint mx-auto stroke-[3]" />
            <div className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tight">
              {privateState.myReactionTimeMs} <span className="text-2xl text-arcade-mint font-display">MS</span>
            </div>
            <p className="text-xs text-slate-300 font-bold uppercase tracking-wider">
              Reaction time locked in! Waiting for round results...
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {isSignalActive ? (
              <Zap className="w-20 h-20 text-black fill-black mx-auto animate-bounce stroke-[2.5]" />
            ) : (
              <Clock className="w-14 h-14 text-slate-400 mx-auto stroke-[2.5]" />
            )}
            <h3 className={`text-4xl sm:text-6xl font-black tracking-tight font-display ${
              isSignalActive ? 'text-black' : 'text-white'
            }`}>
              {statusText}
            </h3>
            <p className={`text-xs sm:text-sm font-bold uppercase tracking-wider max-w-sm mx-auto ${
              isSignalActive ? 'text-black/80' : 'text-slate-300'
            }`}>
              {subText}
            </p>
          </div>
        )}
      </button>

      {/* Leaderboard for Current Round Results */}
      {isRoundResults && (
        <div className="p-6 rounded-3xl bg-[#151821] border-2 border-black shadow-[5px_5px_0px_#000] space-y-4">
          <h4 className="text-xs font-black uppercase tracking-wider text-yellow-400 flex items-center gap-2 font-display">
            <Zap className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>Round {publicState.round} Reflex Standings</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {publicState.results.map((res) => (
              <div
                key={res.playerId}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1E2330] border-2 border-black shadow-[2px_2px_0px_#000] text-xs font-bold"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-black text-yellow-400 w-5 font-mono">#{res.rank}</span>
                  <PlayerAvatar avatar={res.avatar} size="xs" />
                  <span className="text-white">{res.nickname}</span>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  {res.isFalseStart ? (
                    <span className="text-yellow-400 font-black text-[11px] uppercase">False Start</span>
                  ) : res.reactionTimeMs !== null ? (
                    <span className="text-arcade-mint font-black">{res.reactionTimeMs} ms</span>
                  ) : (
                    <span className="text-slate-500">Timed out</span>
                  )}
                  {res.scoreEarned > 0 && (
                    <span className="text-yellow-400 font-black">(+{res.scoreEarned})</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
