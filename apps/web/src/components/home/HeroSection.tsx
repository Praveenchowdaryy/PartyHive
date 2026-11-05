'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AvatarPicker } from '../common/AvatarPicker';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { getLastUserProfile, saveSession, getSocket, warmupServer } from '@/lib/socket';
import {
  Sparkles,
  ArrowRight,
  Play,
  Zap,
  Users2,
  AlertCircle,
  Wifi,
  Radio,
  Gamepad2,
  CheckCircle2,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const router = useRouter();
  const [tab, setTab] = useState<'create' | 'join'>('create');
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('cat');
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isServerReady, setIsServerReady] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Eagerly connect socket and warm up server as soon as the user arrives on the home page
  useEffect(() => {
    const saved = getLastUserProfile();
    if (saved.nickname) setNickname(saved.nickname);
    if (saved.avatar) setAvatar(saved.avatar);

    warmupServer();
    const socket = getSocket();
    if (socket.connected) {
      setIsServerReady(true);
    }

    const onConnect = () => setIsServerReady(true);
    const onDisconnect = () => setIsServerReady(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  // Timer to track slow cold-starts on Render free tier
  useEffect(() => {
    if (loading) {
      setElapsedSec(0);
      timerRef.current = setInterval(() => {
        setElapsedSec((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setElapsedSec(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setErrorMessage('Please pick a nickname to enter');
      return;
    }
    setErrorMessage('');
    setLoading(true);

    const socket = getSocket();
    if (!socket.connected) {
      socket.connect();
    }

    // Safety timeout in case cloud server is cold-starting
    const timeoutHandle = setTimeout(() => {
      setLoading(false);
      setErrorMessage('Server connection took longer than expected. Please tap Create Room again.');
    }, 28000);

    socket.emit(
      'room:create',
      { nickname: nickname.trim(), avatar },
      (res) => {
        clearTimeout(timeoutHandle);
        setLoading(false);
        if (res.success && res.roomCode && res.sessionToken) {
          saveSession(res.roomCode, res.sessionToken, nickname.trim(), avatar, res.playerId);
          router.push(`/room/${res.roomCode}`);
        } else {
          setErrorMessage(res.error || 'Failed to initialize room. Please retry.');
        }
      }
    );
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setErrorMessage('Please pick a nickname to enter');
      return;
    }
    const cleanCode = roomCode.trim().toUpperCase();
    if (!cleanCode || cleanCode.length < 4) {
      setErrorMessage('Enter the 6-character room code from your host');
      return;
    }
    setErrorMessage('');
    setLoading(true);

    const socket = getSocket();
    if (!socket.connected) {
      socket.connect();
    }

    const timeoutHandle = setTimeout(() => {
      setLoading(false);
      setErrorMessage('Connection timed out. Please check room code and retry.');
    }, 25000);

    socket.emit(
      'room:join',
      { roomCode: cleanCode, nickname: nickname.trim(), avatar },
      (res) => {
        clearTimeout(timeoutHandle);
        setLoading(false);
        if (res.success && res.roomCode && res.sessionToken) {
          saveSession(res.roomCode, res.sessionToken, nickname.trim(), avatar, res.playerId);
          router.push(`/room/${res.roomCode}`);
        } else {
          setErrorMessage(res.error || 'Room not found or game has concluded.');
        }
      }
    );
  };

  return (
    <section className="relative pt-8 pb-20 md:pt-14 md:pb-28 overflow-hidden bg-arcade-grid">
      {/* Neo-retro ambient accent pools */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-yellow-400/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-arcade-mint/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Vision & Pitch + Live Room Showcase */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Header Badge: Neo-Retro Arcade Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#151821] border-2 border-black text-yellow-400 text-xs font-black uppercase tracking-widest shadow-[3px_3px_0px_#000]">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span>ARCADE ROOM ENGINE • ZERO DOWNLOADS</span>
            </div>

            {/* Main Headline with Punchy Display Typography */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.05] font-display">
              One Room. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-rose-500 drop-shadow-sm">
                Endless Multiplayer Parties.
              </span>
            </h1>

            {/* Crisp Copy */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Gather friends, teammates, or coworkers into one room. Switch on the fly between sketch duels, lightning trivia, social dilemmas, and reflex shootouts — zero downloads, zero registration.
            </p>

            {/* Tactile Feature Pills */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start text-xs font-bold text-slate-200">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#151821] border-2 border-black shadow-[3px_3px_0px_#000] hover:border-arcade-mint transition-colors">
                <Wifi className="w-4 h-4 text-arcade-mint" />
                <span>Zero Installs</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#151821] border-2 border-black shadow-[3px_3px_0px_#000] hover:border-arcade-cyan transition-colors">
                <Users2 className="w-4 h-4 text-arcade-cyan" />
                <span>2 to 20 Players</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#151821] border-2 border-black shadow-[3px_3px_0px_#000] hover:border-yellow-400 transition-colors">
                <Gamepad2 className="w-4 h-4 text-yellow-400" />
                <span>Hot-Swap Games</span>
              </div>
            </div>

            {/* Live Room Showcase: Arcade Cabinet Screen Frame */}
            <div className="pt-2 hidden sm:block">
              <div className="p-4 rounded-2xl bg-[#151821] border-2 border-black shadow-[5px_5px_0px_#000] max-w-lg mx-auto lg:mx-0">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pb-2 border-b-2 border-black">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-arcade-mint animate-pulse" />
                    <span className="font-black text-white uppercase tracking-wider text-[11px] font-display">Live Room Feed</span>
                    <span className="px-2 py-0.5 rounded bg-[#0B0C10] text-[10px] text-yellow-400 font-mono font-bold border border-black">#ARCADE</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-bold font-mono">4 Players Connected</span>
                </div>

                {/* Simulated live party participants */}
                <div className="grid grid-cols-4 gap-2">
                  <div className="p-2 rounded-xl bg-[#1E2330] border-2 border-black shadow-[2px_2px_0px_#000] flex flex-col items-center gap-1.5">
                    <PlayerAvatar avatar="cat" size="sm" />
                    <span className="text-[10px] font-black text-white truncate max-w-full">Maya (Host)</span>
                    <span className="text-[9px] text-yellow-400 font-bold uppercase font-mono">Drawing...</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#1E2330] border-2 border-black shadow-[2px_2px_0px_#000] flex flex-col items-center gap-1.5">
                    <PlayerAvatar avatar="fox" size="sm" />
                    <span className="text-[10px] font-black text-white truncate max-w-full">Sam</span>
                    <span className="text-[9px] text-arcade-mint font-bold uppercase font-mono">Guessed!</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#1E2330] border-2 border-black shadow-[2px_2px_0px_#000] flex flex-col items-center gap-1.5">
                    <PlayerAvatar avatar="bear" size="sm" />
                    <span className="text-[10px] font-black text-white truncate max-w-full">Ravi</span>
                    <span className="text-[9px] text-orange-400 font-bold uppercase font-mono">Voting...</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#1E2330] border-2 border-black shadow-[2px_2px_0px_#000] flex flex-col items-center gap-1.5">
                    <PlayerAvatar avatar="robot" size="sm" />
                    <span className="text-[10px] font-black text-white truncate max-w-full">Bot Alex</span>
                    <span className="text-[9px] text-arcade-cyan font-bold uppercase font-mono">Ready</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Arcade Coin-Op Hub */}
          <div id="join" className="lg:col-span-5 w-full max-w-md mx-auto">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#151821] border-2 border-black shadow-[6px_6px_0px_#000] relative">
              
              {/* Gamified Server Status Indicator (Power Pill) */}
              <div className="flex items-center justify-between mb-5 px-3.5 py-2 rounded-xl bg-[#0B0C10] border-2 border-black shadow-[2px_2px_0px_#000] text-[11px]">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isServerReady ? 'bg-arcade-mint animate-pulse' : 'bg-yellow-400 animate-ping'}`} />
                  <span className={`font-black uppercase tracking-wider ${isServerReady ? 'text-arcade-mint' : 'text-yellow-400'}`}>
                    {isServerReady ? 'COIN-OP ENGINE ONLINE' : 'WARMING UP ENGINE...'}
                  </span>
                </div>
                <span className="text-slate-400 font-mono font-bold text-[10px] uppercase">
                  {isServerReady ? '⚡ SYNCED' : 'STANDBY'}
                </span>
              </div>

              {/* Arcade Toggle Switch Segmented Control */}
              <div className="relative flex rounded-2xl bg-[#0B0C10] p-1.5 mb-6 border-2 border-black shadow-[3px_3px_0px_#000]">
                <button
                  type="button"
                  onClick={() => { setTab('create'); setErrorMessage(''); }}
                  className={`relative flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-colors duration-150 z-10 font-display ${
                    tab === 'create' ? 'text-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab === 'create' && (
                    <motion.div
                      layoutId="heroTabBg"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 border-2 border-black shadow-[2px_2px_0px_#000]"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-1.5">
                    <Sparkles className="w-4 h-4 fill-black/20" />
                    Create Room
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => { setTab('join'); setErrorMessage(''); }}
                  className={`relative flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-colors duration-150 z-10 font-display ${
                    tab === 'join' ? 'text-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab === 'join' && (
                    <motion.div
                      layoutId="heroTabBg"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 border-2 border-black shadow-[2px_2px_0px_#000]"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-1.5">
                    <Play className="w-4 h-4 fill-black/20" />
                    Join Room
                  </span>
                </button>
              </div>

              {/* Error Alert with Tactile Styling */}
              <AnimatePresence>
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mb-4 p-3 rounded-xl bg-rose-950/80 border-2 border-black shadow-[3px_3px_0px_#000] text-rose-300 text-xs font-bold flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={tab === 'create' ? handleCreate : handleJoin} className="space-y-4">
                
                {/* Nickname Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-yellow-400 rounded-sm inline-block" />
                      <span>Your Nickname</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">{nickname.length}/20</span>
                  </div>
                  <input
                    type="text"
                    maxLength={20}
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="e.g. CaptainAwesome"
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0C10] border-2 border-black text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400 text-sm font-bold shadow-[inset_2px_2px_0px_#000] transition-colors"
                    required
                  />
                </div>

                {/* Avatar Picker with Arcade Selection Frame */}
                <AvatarPicker selectedId={avatar} onSelect={setAvatar} />

                {/* Room code input (Only if Join tab) */}
                {tab === 'join' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-[11px] font-black text-slate-300 uppercase tracking-wider mb-1.5">
                      6-Letter Room Pass
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                      placeholder="e.g. K9XZ8W"
                      className="w-full px-4 py-3.5 rounded-xl bg-[#0B0C10] border-2 border-black text-yellow-400 placeholder-slate-600 uppercase tracking-widest text-center text-2xl font-black font-mono focus:outline-none focus:border-yellow-400 transition-colors shadow-[inset_2px_2px_0px_#000]"
                      required
                    />
                  </motion.div>
                )}

                {/* Tactile Action Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-3 py-4 px-6 rounded-xl text-sm font-black text-black bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider font-display"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>
                        {elapsedSec > 2
                          ? `POWERING SERVER... (${elapsedSec}s)`
                          : tab === 'create'
                          ? 'INITIALIZING ROOM...'
                          : 'ENTERING ROOM...'}
                      </span>
                    </div>
                  ) : tab === 'create' ? (
                    <>
                      <Sparkles className="w-4 h-4 fill-black/20" />
                      <span>CREATE PARTY ROOM</span>
                      <ArrowRight className="w-4 h-4 ml-0.5 stroke-[3]" />
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-black" />
                      <span>ENTER PARTY ROOM</span>
                      <ArrowRight className="w-4 h-4 ml-0.5 stroke-[3]" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-[11px] text-slate-400 font-medium">
                  {tab === 'create' 
                    ? 'Instant private room. Share your link or 6-letter pass.'
                    : 'Enter the 6-character room code from your host.'}
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
