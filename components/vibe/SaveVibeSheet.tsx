"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

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
    <div className="absolute inset-0 z-[55] flex flex-col justify-end">
      <div
        className="animate-fade-in absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      <div className="animate-sheet-up relative rounded-t-2xl bg-[#1e1e1e] p-5 pb-8">
        <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-white/25" />
        <div className="mb-1 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-green" fill="currentColor" />
          <h3 className="text-[17px] font-bold text-white">Save this Vibe</h3>
        </div>
        <p className="mb-4 text-[13px] text-subtle">
          It&apos;ll show up in Your Library so you can come back to it.
        </p>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name your Vibe"
          className="w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-3 text-[15px] text-white outline-none focus:border-green/60"
          onKeyDown={(e) => {
            if (e.key === "Enter" && name.trim()) onSave(name.trim());
          }}
        />
        <div className="mt-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[14px] font-semibold text-subtle"
          >
            Cancel
          </button>
          <button
            disabled={!name.trim()}
            onClick={() => onSave(name.trim())}
            className="rounded-full bg-green px-6 py-2.5 text-[14px] font-bold text-black disabled:opacity-40"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
