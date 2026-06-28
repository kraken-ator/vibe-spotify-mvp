"use client";

import { RefreshCw, Plus } from "lucide-react";

interface Props {
  open: boolean;
  name: string; // the linked playlist's name
  onClose: () => void;
  onUpdate: () => void;
  onSaveNew: () => void;
}

/** Asked when saving a vibe that's already a Library playlist with new edits. */
export function SaveChoiceSheet({
  open,
  name,
  onClose,
  onUpdate,
  onSaveNew,
}: Props) {
  if (!open) return null;

  return (
    <div className="absolute inset-0 z-[55] flex flex-col justify-end">
      <div
        className="animate-fade-in absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      <div className="animate-sheet-up relative rounded-t-2xl bg-[#1e1e1e] p-5 pb-8">
        <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-white/25" />
        <h3 className="text-[17px] font-bold text-white">Save changes</h3>
        <p className="mb-4 mt-1 text-[13px] text-subtle">
          You&apos;ve tweaked this vibe. Update the existing playlist or save a
          new one?
        </p>

        <button
          onClick={onUpdate}
          className="mb-2 flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left active:bg-white/10"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green">
            <RefreshCw className="h-[18px] w-[18px] text-black" strokeWidth={2.5} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-bold text-white">
              Update “{name}”
            </div>
            <div className="truncate text-[12px] text-subtle">
              Overwrite the existing playlist
            </div>
          </div>
        </button>

        <button
          onClick={onSaveNew}
          className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left active:bg-white/10"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30">
            <Plus className="h-[18px] w-[18px] text-white" strokeWidth={2.5} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-bold text-white">
              Save as new playlist
            </div>
            <div className="truncate text-[12px] text-subtle">
              Keep the original, create another
            </div>
          </div>
        </button>

        <button
          onClick={onClose}
          className="mt-3 w-full py-2 text-[14px] font-semibold text-subtle"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
