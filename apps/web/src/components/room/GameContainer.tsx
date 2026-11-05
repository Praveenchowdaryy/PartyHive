'use client';

import React, { useState, useEffect } from 'react';
import {
  RoomSnapshot,
  Player,
  GameResultPayload,
  ChatMessage,
  EmojiReaction,
  DrawStroke,
} from '@partyhive/shared';
import { DrawAndGuessView } from './games/DrawAndGuessView';
import { QuizBattleView } from './games/QuizBattleView';
import { HotTakesView } from './games/HotTakesView';
import { ReactionArenaView } from './games/ReactionArenaView';
import { WordDashView } from './games/WordDashView';
import { MostLikelyToView } from './games/MostLikelyToView';
import { PodiumResults } from './PodiumResults';
import { ChatSidebar } from './ChatSidebar';
import { Clock, Users, ArrowLeft, MessageSquare, Gamepad2 } from 'lucide-react';
import { formatTime } from '@/lib/utils';

interface GameContainerProps {
  room: RoomSnapshot;
  currentPlayer: Player;
  publicState: any;
  privateState: any;
  gameResults: GameResultPayload | null;
  chatMessages: ChatMessage[];
  reactions: EmojiReaction[];
  onSendGameAction: (type: string, payload: any) => void;
  onSendStroke: (stroke: DrawStroke) => void;
  onClearCanvas: () => void;
  onSendMessage: (text: string) => void;
  onSendReaction: (emoji: string) => void;
  onPlayAgain: () => void;
  onReturnToLobby: () => void;
}

export const GameContainer: React.FC<GameContainerProps> = ({
  room,
  currentPlayer,
  publicState,
  privateState,
  gameResults,
  chatMessages,
  reactions,
  onSendGameAction,
  onSendStroke,
  onClearCanvas,
  onSendMessage,
  onSendReaction,
  onPlayAgain,
  onReturnToLobby,
}) => {
  const [timeLeftMs, setTimeLeftMs] = useState(0);
  const [mobileTab, setMobileTab] = useState<'game' | 'chat'>('game');
  const [lastReadMessageCount, setLastReadMessageCount] = useState(0);

  // Authoritative local countdown calculation based on server deadline
  useEffect(() => {
    if (!publicState?.deadline) {
      setTimeLeftMs(0);
      return;
    }

    const updateTimer = () => {
      const remaining = Math.max(0, publicState.deadline - Date.now());
      setTimeLeftMs(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 200);
    return () => clearInterval(interval);
  }, [publicState?.deadline]);

  // Track unread messages on mobile when chat is closed
  useEffect(() => {
    if (mobileTab === 'chat') {
      setLastReadMessageCount(chatMessages.length);
    }
  }, [chatMessages.length, mobileTab]);

  const unreadCount = Math.max(0, chatMessages.length - lastReadMessageCount);

  if (!publicState) {
    return (
      <div className="p-12 rounded-3xl bg-[#151821] border-2 border-black shadow-[5px_5px_0px_#000] text-center max-w-md mx-auto">
        <span className="inline-block w-8 h-8 border-3 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4" />
        <h3 className="text-xl font-black text-white font-display">CONNECTING TO COIN-OP ENGINE...</h3>
      </div>
    );
  }

  // If match finished, show victory podium!
  if (publicState.phase === 'RESULTS') {
    return (
      <PodiumResults
        results={gameResults || {
          gameId: publicState.gameId,
          winnerIds: publicState.leaderboard?.[0]?.playerId ? [publicState.leaderboard[0].playerId] : [],
          finalStandings: publicState.leaderboard || [],
          statistics: {},
          completedAt: Date.now(),
        }}
        currentPlayer={currentPlayer}
        onPlayAgain={onPlayAgain}
        onReturnToLobby={onReturnToLobby}
      />
    );
  }

  const gameTitles: Record<string, string> = {
    'draw-and-guess': 'Draw & Guess',
    'quiz-battle': 'Quiz Battle',
    'hot-takes': 'Hot Takes',
    'reaction-arena': 'Reaction Arena',
    'word-dash': 'Word Dash',
    'most-likely-to': 'Most Likely To',
  };

  const isCriticalTime = timeLeftMs > 0 && timeLeftMs < 5000;

  return (
    <div className="max-w-7xl mx-auto space-y-4 min-h-[calc(100dvh-120px)] flex flex-col justify-between">
      
      {/* Top Arcade Timer Progress Strip (Under 5s pulses coral red) */}
      {publicState.deadline && (
        <div className="w-full h-1.5 bg-[#151821] border-b-2 border-black overflow-hidden relative">
          <div
            className={`h-full transition-all duration-200 ${
              isCriticalTime ? 'bg-rose-500 animate-pulse' : 'bg-arcade-mint'
            }`}
            style={{
              width: `${Math.min(100, Math.max(0, (timeLeftMs / 30000) * 100))}%`,
            }}
          />
        </div>
      )}

      {/* Top Game HUD Bar */}
      <div className="p-4 sm:px-6 sm:py-3.5 rounded-2xl bg-[#151821] border-2 border-black shadow-[4px_4px_0px_#000] flex items-center justify-between gap-4">
        
        {/* Left: Room Code, Switch Game Action, & Game Name */}
        <div className="flex items-center gap-3">
          {currentPlayer.isHost && (
            <button
              onClick={onReturnToLobby}
              className="px-3.5 py-2 rounded-xl bg-[#1E2330] hover:bg-[#252B3B] hover:text-yellow-400 border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] text-xs font-black text-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 uppercase tracking-wider"
              title="Return to lobby to switch games or manage players"
            >
              <ArrowLeft className="w-4 h-4 text-yellow-400 stroke-[3]" />
              <span>Switch Game</span>
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-black text-yellow-400 tracking-widest font-mono bg-[#0B0C10] px-2 py-0.5 rounded border border-black">
                {room.code}
              </span>
              <span className="text-slate-600 font-bold">•</span>
              <span className="text-xs font-black text-slate-300 uppercase tracking-wider font-mono">
                Round {publicState.round || 1}/{publicState.totalRounds || 1}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-black text-white font-display">
              {gameTitles[publicState.gameId] || 'Party Game'}
            </h2>
          </div>
        </div>

        {/* Center: Authoritative Arcade Countdown Timer */}
        {publicState.deadline && (
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] font-mono font-black text-sm tracking-wider ${
              isCriticalTime
                ? 'bg-rose-950/80 text-rose-300 border-rose-500 animate-pulse'
                : 'bg-[#0B0C10] text-arcade-mint border-black'
            }`}
          >
            <Clock className={`w-4 h-4 ${isCriticalTime ? 'text-rose-400 animate-ping' : 'text-arcade-mint'}`} />
            <span>{formatTime(timeLeftMs)}</span>
          </div>
        )}

        {/* Right: Player count and Mobile View Switcher */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 bg-[#1E2330] px-3 py-1.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] font-bold">
            <Users className="w-3.5 h-3.5 text-arcade-cyan" />
            <span>{room.players.length} players</span>
          </div>

          {/* Mobile Segments Tab Switcher */}
          <div className="flex lg:hidden rounded-xl bg-[#0B0C10] p-1 border-2 border-black shadow-[2px_2px_0px_#000]">
            <button
              type="button"
              onClick={() => setMobileTab('game')}
              className={`px-3 py-1.5 text-xs font-black uppercase rounded-lg transition-all flex items-center gap-1 ${
                mobileTab === 'game'
                  ? 'bg-yellow-400 text-black border border-black shadow-[1px_1px_0px_#000]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Game</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileTab('chat');
                setLastReadMessageCount(chatMessages.length);
              }}
              className={`px-3 py-1.5 text-xs font-black uppercase rounded-lg transition-all flex items-center gap-1 relative ${
                mobileTab === 'chat'
                  ? 'bg-yellow-400 text-black border border-black shadow-[1px_1px_0px_#000]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat</span>
              {unreadCount > 0 && mobileTab !== 'chat' && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Game Arena + Chat Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
        
        {/* Left / Center: Game Play Area (8 cols on desktop, toggled on mobile) */}
        <div className={`lg:col-span-8 space-y-4 ${mobileTab === 'game' ? 'block' : 'hidden lg:block'}`}>
          {publicState.gameId === 'draw-and-guess' && (
            <DrawAndGuessView
              publicState={publicState}
              privateState={privateState}
              myPlayerId={currentPlayer.id}
              onSendAction={onSendGameAction}
              onSendStroke={onSendStroke}
              onClearCanvas={onClearCanvas}
              onSendGuess={onSendMessage}
            />
          )}

          {publicState.gameId === 'quiz-battle' && (
            <QuizBattleView
              publicState={publicState}
              privateState={privateState}
              onSendAction={onSendGameAction}
            />
          )}

          {publicState.gameId === 'hot-takes' && (
            <HotTakesView
              publicState={publicState}
              privateState={privateState}
              onSendAction={onSendGameAction}
            />
          )}

          {publicState.gameId === 'reaction-arena' && (
            <ReactionArenaView
              publicState={publicState}
              privateState={privateState}
              onSendAction={onSendGameAction}
            />
          )}

          {publicState.gameId === 'word-dash' && (
            <WordDashView
              publicState={publicState}
              privateState={privateState}
              onSendAction={onSendGameAction}
            />
          )}

          {publicState.gameId === 'most-likely-to' && (
            <MostLikelyToView
              publicState={publicState}
              privateState={privateState}
              room={room}
              currentPlayerId={currentPlayer.id}
              onSendAction={onSendGameAction}
            />
          )}

          {/* Real-Time Live Scoreboard Mini-Pills */}
          <div className="p-3 rounded-2xl bg-[#151821] border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-black uppercase tracking-wider text-yellow-400 pl-1 shrink-0 font-mono">
              Scoreboard:
            </span>
            {(publicState.leaderboard || []).map((p: any) => (
              <div
                key={p.playerId}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black shrink-0 border-2 border-black shadow-[1px_1px_0px_#000] ${
                  p.playerId === currentPlayer.id
                    ? 'bg-yellow-400 text-black'
                    : 'bg-[#1E2330] text-slate-200'
                }`}
              >
                <span>{p.nickname}</span>
                <span className="font-mono text-xs opacity-90">({p.score})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Chat & Reactions Sidebar (4 cols on desktop, toggled on mobile) */}
        <div className={`lg:col-span-4 h-[580px] ${mobileTab === 'chat' ? 'block' : 'hidden lg:block'}`}>
          <ChatSidebar
            messages={chatMessages}
            reactions={reactions}
            onSendMessage={onSendMessage}
            onSendReaction={onSendReaction}
            onClose={() => setMobileTab('game')}
          />
        </div>
      </div>
    </div>
  );
};
