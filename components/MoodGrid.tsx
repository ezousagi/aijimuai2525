import React from 'react';
import { MOODS } from '../constants.ts';
import { MoodType } from '../types.ts';
import * as Icons from 'lucide-react';

interface MoodGridProps {
  onSelect: (mood: MoodType) => void;
  disabled: boolean;
}

export const MoodGrid: React.FC<MoodGridProps> = ({ onSelect, disabled }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl px-4">
      {MOODS.map((mood) => {
        const IconComponent = (Icons as any)[mood.icon] || Icons.HelpCircle;

        return (
          <button
            key={mood.id}
            onClick={() => onSelect(mood.id)}
            disabled={disabled}
            className={`
              relative overflow-hidden group rounded-xl p-6 
              flex flex-col items-center justify-center gap-3
              transition-all duration-300 border border-white/5
              ${mood.color} hover:brightness-110 active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed
              h-40 md:h-48 shadow-lg
            `}
          >
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            
            <IconComponent className="w-8 h-8 text-white/90 z-10" strokeWidth={1.5} />
            
            <span className="text-lg font-bold text-white z-10 tracking-widest font-serif">
              {mood.label}
            </span>
            
            <span className="text-xs text-white/70 z-10 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {mood.description}
            </span>
          </button>
        );
      })}
    </div>
  );
};