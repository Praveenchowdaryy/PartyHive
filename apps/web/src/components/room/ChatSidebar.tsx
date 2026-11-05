'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, EmojiReaction } from '@partyhive/shared';
import { Send, MessageSquare, Sparkles, X } from 'lucide-react';
import { PlayerAvatar } from '../common/PlayerAvatar';

interface ChatSidebarProps {
  messages: ChatMessage[];
  reactions: EmojiReaction[];
  onSendMessage: (text: string) => void;
  onSendReaction: (emoji: string) => void;
  onClose?: () => void;
}

const QUICK_EMOJIS = [
  { emoji: '🔥', label: 'Fire' },
  { emoji: '😂', label: 'Laugh' },
  { emoji: '👏', label: 'Clap' },
  { emoji: '🚀', label: 'Rocket' },
  { emoji: '❤️', label: 'Heart' },
  { emoji: '🤯', label: 'Shock' },
  { emoji: '🥳', label: 'Party' },
  { emoji: '🏆', label: 'Trophy' },
];

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  messages,
  reactions,
  onSendMessage,
  onSendReaction,
  onClose,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesScrollRef = useRef<HTMLDivElement>(null);

  // Scroll ONLY the internal messages div, never the window
  useEffect(() => {
    if (messagesScrollRef.current) {
      messagesScrollRef.current.scrollTop = messagesScrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="flex flex-col h-full rounded-3xl bg-[#151821] border-2 border-black shadow-[4px_4px_0px_#000] overflow-hidden relative">
      {/* Floating Reaction Particles Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {reactions.map((rc) => (
          <div
            key={rc.id}
            className="absolute bottom-20 text-3xl animate-reaction-float select-none drop-shadow-md"
            style={{
              left: `${15 + (Math.abs(parseInt(rc.id.slice(-4), 16)) % 70)}%`,
            }}
          >
            {rc.emoji}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="px-4 py-3 border-b-2 border-black bg-[#10131B] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-yellow-400 stroke-[2.5]" />
          <span className="text-xs font-black uppercase tracking-wider text-white font-display">
            Room Chat & Guesses
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[10px] text-arcade-mint font-mono font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-arcade-mint animate-pulse" />
            <span>LIVE</span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-white"
              title="Close chat"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div
        ref={messagesScrollRef}
        className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs overscroll-contain"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-8">
            <Sparkles className="w-6 h-6 text-slate-600 mb-2" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">No messages yet</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Type greetings or enter guesses here!</p>
          </div>
        ) : (
          messages.map((msg) => {
            if (msg.type === 'SYSTEM') {
              return (
                <div
                  key={msg.id}
                  className="p-2 rounded-xl bg-yellow-400/15 border border-yellow-400/30 text-yellow-400 text-[11px] font-black text-center leading-relaxed font-mono"
                >
                  {msg.text}
                </div>
              );
            }

            return (
              <div key={msg.id} className="flex items-start gap-2.5 p-1.5 rounded-xl hover:bg-[#1E2330]/60 transition-colors">
                <PlayerAvatar avatar={msg.avatar} size="xs" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-black text-white text-[11px]">
                      {msg.nickname}
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-300 break-words leading-relaxed font-medium">
                    {msg.text}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Tactile Arcade Quick Reactions Bar */}
      <div className="px-3 py-2 border-t-2 border-black bg-[#10131B] flex items-center justify-between gap-1 overflow-x-auto">
        {QUICK_EMOJIS.map((item) => (
          <button
            key={item.emoji}
            type="button"
            onClick={() => onSendReaction(item.emoji)}
            className="w-8 h-8 rounded-xl bg-[#1E2330] border-2 border-black hover:border-yellow-400 hover:bg-yellow-400/20 active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center text-sm select-none focus:outline-none transition-all cursor-pointer shrink-0 shadow-[2px_2px_0px_#000]"
            title={`React with ${item.label}`}
          >
            {item.emoji}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form onSubmit={handleSubmit} className="p-3 border-t-2 border-black bg-[#151821] flex gap-2">
        <input
          type="text"
          value={inputText}
          maxLength={150}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a guess or message..."
          className="flex-1 px-3 py-2.5 rounded-xl bg-[#0B0C10] border-2 border-black text-white text-xs placeholder-slate-500 focus:outline-none focus:border-yellow-400 transition-colors font-medium shadow-[inset_1px_1px_0px_#000]"
        />
        <button
          type="submit"
          className="p-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[0px_0px_0px_#000] transition-all cursor-pointer"
          title="Send"
        >
          <Send className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </form>
    </div>
  );
};
