"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  defaultName: string;
  onClose: () => void;
  onSave: (name: string) => void;
}

export function SaveVibeSheet({ open, defaultName, onClose, onSave }: Props) {
  const [name, setName] = useState(defaultName);
  
  useEffect(() => { 
    if (open) setName(defaultName); 
  }, [open, defaultName]);

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-[70] flex flex-col justify-end">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Sheet Container with pb-[140px] */}
      <div className="relative animate-sheet-up rounded-t-3xl bg-[#242424] px-5 pb-[140px] pt-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between pb-6">
          <h2 className="text-[20px] font-bold text-white">Name your Vibe</h2>
          <button 
            onClick={onClose} 
            className="rounded-full p-2 active:bg-white/10"
            aria-label="Close"
          >
            <X className="h-6 w-6 text-subtle hover:text-white" />
          </button>
        </div>
        
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl bg-[#333] px-4 py-4 text-[16px] font-semibold text-white placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-green"
          placeholder="My Awesome Vibe"
          autoFocus
        />
        
        <button
          onClick={() => onSave(name)}
          disabled={!name.trim()}
          className="mt-6 w-full rounded-full bg-green py-4 text-[16px] font-bold text-black active:scale-[0.98] disabled:opacity-50"
        >
          Save to Library
        </button>
      </div>
    </div>
  );
}