"use client";

import { Play, Pause, MonitorSpeaker } from "lucide-react";
import { useApp } from "@/lib/AppContext";
import { AlbumArt } from "./AlbumArt";

export function MiniPlayer() {
  const { nowPlaying, isPlaying, togglePlay, expandPlayer } = useApp();
  if (!nowPlaying) return null;

  return (
    <div className="relative z-20 px-2">
      <div
        onClick={expandPlayer}
        className="flex cursor-pointer items-center gap-2.5 rounded-md bg-[#2c2c2c] px-2 py-2 active:bg-[#363636]"
      >
        <AlbumArt
          artist={nowPlaying.artist}
          title={nowPlaying.title}
          className="h-10 w-10 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-semibold leading-tight text-white">
            {nowPlaying.title}
          </div>
          <div className="truncate text-[11px] leading-tight text-subtle">
            {nowPlaying.artist}
          </div>
        </div>
        <button
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 p-1.5 text-white/90"
          aria-label="Connect to a device"
        >
          <MonitorSpeaker className="h-[22px] w-[22px]" strokeWidth={1.75} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className="shrink-0 p-1 text-white"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" fill="currentColor" strokeWidth={0} />
          ) : (
            <Play className="h-6 w-6" fill="currentColor" strokeWidth={0} />
          )}
        </button>
      </div>
      {/* progress line */}
      <div className="mx-2 mt-[3px] h-[2px] overflow-hidden rounded-full bg-white/25">
        <div className="h-full w-[28%] rounded-full bg-white" />
      </div>
    </div>
  );
}
