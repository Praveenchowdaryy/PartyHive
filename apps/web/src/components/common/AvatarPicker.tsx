import React from 'react';
import { AVATAR_OPTIONS } from '@partyhive/shared';
import { PlayerAvatar } from './PlayerAvatar';

interface AvatarPickerProps {
  selectedId: string;
  onSelect: (avatarId: string) => void;
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({ selectedId, onSelect }) => {
  const currentAvatar = AVATAR_OPTIONS.find((a) => a.id === selectedId);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 bg-yellow-400 rounded-sm inline-block" />
          <span>Select Character</span>
        </label>
        <span className="text-[11px] font-black text-yellow-400 uppercase tracking-widest font-mono bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/30">
          {currentAvatar?.label || 'Character'}
        </span>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {AVATAR_OPTIONS.map((av) => {
          const isSelected = selectedId === av.id;
          return (
            <button
              key={av.id}
              type="button"
              onClick={() => onSelect(av.id)}
              title={av.label}
              className={`relative flex items-center justify-center p-2 rounded-xl border-2 border-black transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-yellow-400/25 border-yellow-400 shadow-[3px_3px_0px_#000] scale-105 ring-2 ring-yellow-400'
                  : 'bg-surface-elevated shadow-[2px_2px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#000] opacity-80 hover:opacity-100 hover:border-slate-500'
              }`}
            >
              <PlayerAvatar avatar={av.id} size="sm" />
              {isSelected && (
                <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-black text-[9px] font-black px-1 rounded-sm border border-black shadow-[1px_1px_0px_#000] font-mono leading-tight">
                  P1
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
