"use client";

import { X, RefreshCcw, Plus } from "lucide-react";

interface Props {
  open: boolean;
  name: string;
  onClose: () => void;
  onUpdate: () => void;
  onSaveNew: () => void;
}

export function SaveChoiceSheet({ open, name, onClose, onUpdate, onSaveNew }: Props) {
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
        <div className="flex items-start justify-between pb-6">
          <div>
            <h2 className="text-[20px] font-bold text-white">Save Changes</h2>
            <p className="mt-1 text-[14px] text-subtle">You&apos;re editing &quot;{name}&quot;</p>
          </div>
          <button 
            onClick={onClose} 
            className="-mr-2 rounded-full p-2 active:bg-white/10"
            aria-label="Close"
          >
            <X className="h-6 w-6 text-subtle hover:text-white" />
          </button>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={onUpdate}
            className="flex w-full items-center gap-4 rounded-xl bg-[#333] p-4 active:bg-[#444] active:scale-[0.98] transition-transform"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
              <RefreshCcw className="h-5 w-5 text-green" />
            </div>
            <div className="text-left">
              <div className="text-[15px] font-bold text-white">Update existing playlist</div>
              <div className="mt-0.5 text-[13px] text-subtle">Overwrite the current tracks</div>
            </div>
          </button>
          
          <button
            onClick={onSaveNew}
            className="flex w-full items-center gap-4 rounded-xl bg-[#333] p-4 active:bg-[#444] active:scale-[0.98] transition-transform"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <div className="text-[15px] font-bold text-white">Save as new playlist</div>
              <div className="mt-0.5 text-[13px] text-subtle">Create a brand new playlist instead</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}