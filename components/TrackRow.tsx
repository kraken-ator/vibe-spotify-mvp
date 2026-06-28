"use client";

import { Heart, Sparkles } from "lucide-react";
import { AlbumArt } from "./AlbumArt";
import { formatDuration } from "@/lib/data";
import type { Track } from "@/lib/types";

function PlayingBars() {
  return (
    <div className="flex items-end gap-[2px]">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-[2px] rounded-full bg-green"
          style={{
            height: 11,
            animation: `eq 0.9s ease-in-out ${i * 0.18}s infinite`,
            transformOrigin: "bottom",
          }}
        />
      ))}
      <style>{`@keyframes eq{0%,100%{transform:scaleY(0.35)}50%{transform:scaleY(1)}}`}</style>
    </div>
  );
}

interface Props {
  track: Track;
  liked: boolean;
  isAnchor?: boolean;
  isCurrent?: boolean;
  showReason?: boolean;
  changed?: boolean;
  onTap: () => void;
  onToggleLike: () => void;
}

export function TrackRow({
  track,
  liked,
  isAnchor,
  isCurrent,
  showReason = true,
  changed,
  onTap,
  onToggleLike,
}: Props) {
  return (
    <div
      onClick={onTap}
      className={`flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 active:bg-white/[0.06] ${
        changed ? "animate-row-in" : ""
      } ${isAnchor ? "bg-green/[0.07] ring-1 ring-green/30" : ""}`}
    >
      <div className="relative h-12 w-12 shrink-0">
        <AlbumArt artist={track.artist} title={track.title} className="h-12 w-12" />
        {isCurrent && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/45">
            <PlayingBars />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div
          className={`truncate text-[15px] font-medium leading-tight ${
            isCurrent || isAnchor ? "text-green" : "text-white"
          }`}
        >
          {track.title}
        </div>
        <div className="truncate text-[13px] leading-tight text-subtle">
          {track.artist}
        </div>
        {showReason && track.reason && (
          <div className="mt-0.5 flex items-center gap-1 text-[11px] leading-tight text-[#8b8b8b]">
            <Sparkles className="h-[10px] w-[10px] shrink-0 text-green/70" fill="currentColor" />
            <span className="truncate">{track.reason}</span>
          </div>
        )}
      </div>

      <span className="shrink-0 text-[12px] tabular-nums text-subtle">
        {formatDuration(track.durationSec)}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleLike();
        }}
        className="shrink-0 p-1"
        aria-label={liked ? "Remove from Liked Songs" : "Save to Liked Songs"}
      >
        <Heart
          className={`h-[18px] w-[18px] ${liked ? "text-green" : "text-subtle"}`}
          fill={liked ? "currentColor" : "none"}
          strokeWidth={2}
        />
      </button>
    </div>
  );
}
