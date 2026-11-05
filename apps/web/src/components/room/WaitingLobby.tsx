'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RoomSnapshot,
  Player,
  GAME_CATALOGUE,
} from '@partyhive/shared';
import {
  Copy,
  Check,
  Crown,
  Play,
  UserPlus,
  Settings,
  LogOut,
  Sparkles,
  Users,
  CheckCircle2,
  Clock,
  Trash2,
  Share2,
  Bot,
  Gamepad2,
  Flame,
} from 'lucide-react';
import { copyTextToClipboard } from '@/lib/utils';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { getGameVisual } from '../brand/GameArt';

interface WaitingLobbyProps {
  room: RoomSnapshot;
  currentPlayer: Player;
  onSelectGame: (gameId: string) => void;
  onStartGame: () => void;
  onSetReady: (isReady: boolean) => void;
  onAddBot: () => void;
  onRemoveBot: (botId: string) => void;
  onLeaveRoom: () => void;
  onUpdateSettings: (settings: { maxPlayers?: number; allowLateJoin?: boolean }) => void;
}

export const WaitingLobby: React.FC<WaitingLobbyProps> = ({
  room,
  currentPlayer,
  onSelectGame,
  onStartGame,
  onSetReady,
  onAddBot,
  onRemoveBot,
  onLeaveRoom,
  onUpdateSettings,
}) => {
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isStartingMatch, setIsStartingMatch] = useState(false);
  const [selectedId, setSelectedId] = useState(room.selectedGameId);

  useEffect(() => {
    setSelectedId(room.selectedGameId);
  }, [room.selectedGameId]);

  // Resilient host detection: either currentPlayer.isHost or matches hostId or only 1 player
  const isHost = currentPlayer.isHost || room.hostId === currentPlayer.id || room.players.length === 1;
  const selectedGame = GAME_CATALOGUE.find((g) => g.id === selectedId) || GAME_CATALOGUE[0];
  const selectedVisual = getGameVisual(selectedGame.id);

  const handleCopyLink = async () => {
    if (typeof window === 'undefined') return;
    const url = `${window.location.origin}/room/${room.code}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join PartyHive Room',
          text: `Join my multiplayer party room (${room.code}) on PartyHive!`,
          url,
        });
        return;
      } catch {
        // Fallback to clipboard copy
      }
    }

    const success = await copyTextToClipboard(url);
    if (success) {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const handleCopyCode = async () => {
    const success = await copyTextToClipboard(room.code);
    if (success) {
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      {/* Top Arcade Marquee Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#10131B] border-2 border-yellow-400 shadow-[6px_6px_0px_#000] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Cabinet Rivet Accents */}
        <span className="absolute top-2 left-2 w-2 h-2 rounded-full bg-yellow-400/40 border border-black" />
        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-yellow-400/40 border border-black" />
        <span className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-yellow-400/40 border border-black" />
        <span className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-yellow-400/40 border border-black" />

        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#1E2330] border border-black text-[10px] uppercase font-black tracking-widest text-yellow-400">
            <span className="w-2 h-2 rounded-full bg-arcade-mint animate-pulse" />
            <span>COIN-OP LOBBY READY • PASS OPEN</span>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <span className="text-xs uppercase font-black tracking-widest text-slate-400">
              ROOM PASS:
            </span>
            <span className="font-mono text-3xl sm:text-5xl font-black text-yellow-400 tracking-widest bg-[#0B0C10] px-4 py-1 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000]">
              {room.code}
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              title="Copy Room Code"
              className="p-3 rounded-xl bg-[#1E2330] hover:bg-yellow-400 hover:text-black text-yellow-400 border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] transition-all cursor-pointer"
            >
              {codeCopied ? <Check className="w-4 h-4 text-arcade-mint stroke-[3]" /> : <Copy className="w-4 h-4 stroke-[2.5]" />}
            </button>
          </div>
          
          <p className="text-xs text-slate-300 font-medium">
            {codeCopied ? '✅ Code copied to clipboard!' : 'Give friends this 6-letter pass or tap Share Link.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-center">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1E2330] hover:bg-[#252B3B] border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] text-xs sm:text-sm font-black text-white uppercase tracking-wider transition-all cursor-pointer"
          >
            {linkCopied ? <Check className="w-4 h-4 text-arcade-mint stroke-[3]" /> : <Share2 className="w-4 h-4 text-yellow-400 stroke-[2.5]" />}
            <span>{linkCopied ? 'LINK COPIED!' : 'SHARE LINK'}</span>
          </button>

          {isHost && (
            <>
              <button
                type="button"
                onClick={onAddBot}
                title="Add Simulated Player"
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-[#1E2330] hover:bg-[#252B3B] border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] text-xs font-black text-arcade-cyan uppercase tracking-wider transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-arcade-cyan stroke-[2.5]" />
                <span className="hidden sm:inline">ADD BOT</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSettingsModal(true)}
                title="Room Settings"
                className="p-3 rounded-xl bg-[#1E2330] hover:bg-[#252B3B] border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] text-slate-300 transition-all cursor-pointer"
              >
                <Settings className="w-4 h-4 stroke-[2.5]" />
              </button>
            </>
          )}

          <button
            type="button"
            onClick={onLeaveRoom}
            title="Leave Room"
            className="p-3 rounded-xl bg-[#1E2330] hover:bg-rose-950 border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] text-rose-400 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Active Game & Start Bar (Arcade Bay) */}
      <div className="p-6 rounded-3xl bg-[#151821] border-2 border-black shadow-[5px_5px_0px_#000] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-black tracking-widest text-yellow-400 bg-yellow-400/10 px-2.5 py-0.5 rounded border border-yellow-400/30">
                ACTIVE CARTRIDGE
              </span>
              <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded border-2 border-black shadow-[2px_2px_0px_#000] ${selectedVisual.badgeClass}`}>
                {selectedVisual.badgeText}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
              {selectedGame.title}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              {selectedGame.description}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-300 font-bold shrink-0">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1E2330] border-2 border-black shadow-[2px_2px_0px_#000]">
              <Users className="w-3.5 h-3.5 text-arcade-cyan" />
              {selectedGame.minPlayers}–{selectedGame.maxPlayers} players
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1E2330] border-2 border-black shadow-[2px_2px_0px_#000]">
              <Clock className="w-3.5 h-3.5 text-yellow-400" />
              ~{selectedGame.durationMinutes}m
            </span>
          </div>
        </div>

        {isHost ? (
          <button
            type="button"
            disabled={isStartingMatch}
            onClick={() => {
              setIsStartingMatch(true);
              onStartGame();
            }}
            className="w-full py-4 px-6 rounded-2xl text-base font-black text-black bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 border-2 border-black shadow-[5px_5px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 uppercase tracking-wider font-display"
          >
            {isStartingMatch ? (
              <>
                <span className="w-5 h-5 border-3 border-black border-t-transparent rounded-full animate-spin" />
                <span>STARTING MATCH...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-black stroke-black" />
                <span>START MATCH NOW</span>
              </>
            )}
          </button>
        ) : (
          <div className="w-full py-4 px-6 rounded-2xl text-center bg-[#1E2330] border-2 border-black shadow-[3px_3px_0px_#000] text-xs sm:text-sm text-slate-300 font-bold uppercase tracking-wider">
            Waiting for host <span className="text-yellow-400 font-black">{room.players.find(p => p.isHost)?.nickname || 'Host'}</span> to launch match...
          </div>
        )}
      </div>

      {/* Main Grid: Player Roster & Game Cartridge Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Player Squad Roster (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wider font-display">
              <Users className="w-4 h-4 text-arcade-cyan" />
              <span>Squad Roster</span>
              <span className="text-xs px-2.5 py-0.5 rounded bg-[#151821] text-yellow-400 border-2 border-black shadow-[2px_2px_0px_#000] font-mono font-black">
                {room.players.length}/{room.settings.maxPlayers}
              </span>
            </h2>

            {!isHost && (
              <button
                type="button"
                onClick={() => onSetReady(!currentPlayer.isReady)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] transition-all cursor-pointer ${
                  currentPlayer.isReady
                    ? 'bg-arcade-mint text-black'
                    : 'bg-yellow-400 text-black'
                }`}
              >
                {currentPlayer.isReady ? '✓ READY' : 'SET READY'}
              </button>
            )}
          </div>

          {/* Staggered Animated Player List */}
          <div className="grid grid-cols-1 gap-2.5">
            <AnimatePresence mode="popLayout">
              {room.players.map((player) => {
                const isMe = player.id === currentPlayer.id;
                return (
                  <motion.div
                    key={player.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: -20 }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000] transition-all ${
                      isMe
                        ? 'bg-[#1E2330] border-yellow-400'
                        : 'bg-[#151821]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <PlayerAvatar avatar={player.avatar} size="md" />

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-sm font-black text-white truncate">
                            {player.nickname}
                          </span>
                          {isMe && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-400 text-black font-black uppercase tracking-wider font-mono border border-black">
                              YOU
                            </span>
                          )}
                          {player.isHost && (
                            <span title="Room Host" className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded bg-amber-400/20 text-yellow-400 font-black uppercase tracking-wider border border-yellow-400/40">
                              <Crown className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              HOST
                            </span>
                          )}
                          {player.isBot && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-arcade-cyan font-black flex items-center gap-1 border border-arcade-cyan/40">
                              <Bot className="w-3 h-3" />
                              CPU
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono font-bold">
                          Score: {player.score} pts
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {player.isReady && (
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase text-black px-2 py-0.5 rounded-md bg-arcade-mint border border-black shadow-[1px_1px_0px_#000]">
                          <CheckCircle2 className="w-3 h-3" />
                          Ready
                        </span>
                      )}

                      {/* Bot Remove Action: High-visibility red button */}
                      {isHost && player.isBot && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveBot(player.id);
                          }}
                          className="w-8 h-8 rounded-xl bg-rose-600 border-2 border-black shadow-[2px_2px_0px_#000] text-white active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center transition-all cursor-pointer ml-1"
                          title={`Remove CPU ${player.nickname}`}
                        >
                          <Trash2 className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Game Cartridge Library (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wider font-display">
              <Gamepad2 className="w-4 h-4 text-yellow-400" />
              <span>Cartridge Deck</span>
            </h2>
            {isHost ? (
              <span className="text-xs text-yellow-400 font-bold uppercase tracking-wider">
                (Tap cartridge to insert)
              </span>
            ) : (
              <span className="text-xs text-slate-400 font-semibold">
                Host selects cartridge
              </span>
            )}
          </div>

          {/* 6 Game Cartridges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {GAME_CATALOGUE.map((game) => {
              const isSelected = game.id === selectedId;
              const visual = getGameVisual(game.id);

              return (
                <button
                  key={game.id}
                  type="button"
                  onClick={() => {
                    if (isHost) {
                      setSelectedId(game.id);
                      onSelectGame(game.id);
                    }
                  }}
                  className={`text-left p-3.5 rounded-2xl border-2 border-black transition-all duration-150 relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#1E2330] border-yellow-400 shadow-[5px_5px_0px_#FFB703] scale-[1.01]'
                      : 'bg-[#151821] shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#000] hover:border-slate-500'
                  } ${isHost ? 'cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000]' : 'cursor-default'}`}
                >
                  {/* Cartridge Header Ribbon */}
                  <div className="mb-2 relative">
                    {visual.banner}
                    <span className={`absolute top-2 right-2 text-[9px] font-black uppercase px-2 py-0.5 rounded border-2 border-black shadow-[2px_2px_0px_#000] ${visual.badgeClass}`}>
                      {visual.badgeText}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-black text-white font-display">
                        {game.title}
                      </h3>
                      {isSelected && (
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-yellow-400 text-black border border-black shadow-[1px_1px_0px_#000]">
                          LOADED
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-1 leading-relaxed mb-2 font-medium">
                      {game.tagline}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-2 border-t-2 border-black font-mono font-bold">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Users className="w-3 h-3 text-arcade-cyan" />
                      {game.minPlayers}–{game.maxPlayers}P
                    </span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <Clock className="w-3 h-3 text-yellow-400" />
                      ~{game.durationMinutes}M
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-sm w-full p-6 rounded-3xl bg-[#151821] border-2 border-black shadow-[6px_6px_0px_#000] space-y-4"
          >
            <h3 className="text-lg font-black text-white flex items-center gap-2 uppercase tracking-wider font-display">
              <Settings className="w-5 h-5 text-yellow-400 stroke-[2.5]" />
              <span>Room Settings</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-1">
                  Max Players (2 - 20)
                </label>
                <input
                  type="number"
                  min={2}
                  max={20}
                  value={room.settings.maxPlayers}
                  onChange={(e) => onUpdateSettings({ maxPlayers: parseInt(e.target.value) || 12 })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0C10] border-2 border-black text-white text-sm font-mono font-bold"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-black text-slate-300 uppercase tracking-wider">Allow Late Join</span>
                <input
                  type="checkbox"
                  checked={room.settings.allowLateJoin}
                  onChange={(e) => onUpdateSettings({ allowLateJoin: e.target.checked })}
                  className="w-5 h-5 accent-yellow-400 rounded cursor-pointer"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] cursor-pointer font-display"
            >
              SAVE SETTINGS
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};
