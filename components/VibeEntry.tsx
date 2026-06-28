"use client";

import { Sparkles } from "lucide-react";
import { useApp } from "@/lib/AppContext";

/** Vibe entry points woven into the Spotify shell (Home card + Search bar). */
export function VibeEntry({ variant }: { variant: "card" | "bar" }) {
  const { openVibe, vibeInProgress, vibe } = useApp();

  if (variant === "card") {
    return (
      <button
        onClick={() => openVibe()}
        className="group relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-4 py-3.5 text-left active:scale-[0.99]"
        style={{
          background:
            "linear-gradient(110deg, #1ed760 0%, #11aa4f 55%, #0c7d57 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute -right-6 -top-10 h-32 w-32 rounded-full opacity-30"
          style={{ background: "radial-gradient(closest-side, #ffffff, transparent)" }}
        />
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/20">
          <Sparkles className="h-5 w-5 text-black" fill="currentColor" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-extrabold text-black">
              Start a Vibe
            </span>
            <span className="rounded-full bg-black/25 px-1.5 py-[1px] text-[9px] font-bold uppercase tracking-wide text-black">
              New
            </span>
          </div>
          <div className="truncate text-[12px] font-medium text-black/70">
            Describe what you want to hear — we&apos;ll build the set
          </div>
        </div>
      </button>
    );
  }

  // bar variant (Search) — when there's unsaved Vibe work, the bar quietly
  // shows it's live (pulsing dot + the words you're working with) rather than
  // the default invitation.
  if (vibeInProgress) {
    return (
      <button
        onClick={() => openVibe()}
        className="flex w-full items-center gap-2.5 rounded-lg border border-green/40 bg-green/[0.08] px-3 py-2.5 text-left active:bg-green/[0.12]"
      >
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green" />
        </span>
        <span className="truncate text-[14px] font-medium text-white">
          {vibe.prompt.trim() || "Your vibe"}
        </span>
        <Sparkles
          className="ml-auto h-[16px] w-[16px] shrink-0 text-green"
          fill="currentColor"
        />
      </button>
    );
  }

  return (
    <button
      onClick={() => openVibe()}
      className="flex w-full items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-left active:bg-white/[0.07]"
    >
      <Sparkles className="h-[18px] w-[18px] shrink-0 text-green" fill="currentColor" />
      <span className="text-[14px] font-medium text-subtle">
        or describe a vibe…
      </span>
    </button>
  );
}
