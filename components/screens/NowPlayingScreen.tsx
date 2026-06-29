"use client";

import {
  ChevronDown,
  MoreHorizontal,
  Shuffle,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Repeat,
  MonitorSpeaker,
  Share2,
  ListMusic,
  CheckCircle2,
  PlusCircle,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/lib/AppContext";
import { STATUS_BAR_H } from "@/components/StatusBar";
import { AlbumArt } from "@/components/AlbumArt";
import { formatDuration } from "@/lib/data";

export function NowPlayingScreen() {
  const {
    nowPlaying,
    nowPlayingContext,
    isPlaying,
    togglePlay,
    collapsePlayer,
    isLiked,
    toggleLike,
    openVibe,
  } = useApp();

  if (!nowPlaying) return null;
  const liked = isLiked(nowPlaying.id);

  const progress = 0.3;
  const cur = Math.round(nowPlaying.durationSec * progress);
  const remaining = nowPlaying.durationSec - cur;

  return (
    <div
      className="animate-sheet-up absolute inset-0 z-[60] flex flex-col"
      style={{
        background: "linear-gradient(180deg, #45356b 0%, #241d33 45%, #121212 80%)",
      }}
    >
      <div
        className="no-scrollbar flex-1 overflow-y-auto px-6"
        style={{ paddingTop: STATUS_BAR_H + 4 }}
      >
        {/* header */}
        <div className="flex items-center justify-between py-2">
          <button onClick={collapsePlayer} aria-label="Collapse">
            <ChevronDown className="h-6 w-6 text-white" strokeWidth={2.25} />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-white/70">
              Playing from
            </span>
            <span className="text-[13px] font-bold text-white">
              {nowPlayingContext}
            </span>
          </div>
          <button aria-label="More">
            <MoreHorizontal className="h-6 w-6 text-white" strokeWidth={2.25} />
          </button>
        </div>

        {/* album art */}
        <div className="flex justify-center px-1 pt-10">
          <AlbumArt
            artist={nowPlaying.artist}
            title={nowPlaying.title}
            rounded="rounded-[6px]"
            className="aspect-square w-full max-w-[320px] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.7)]"
          />
        </div>

        {/* title row */}
        <div className="flex items-center justify-between pt-9">
          <div className="min-w-0 flex-1 pr-3">
            <div className="truncate text-[22px] font-bold leading-tight text-white">
              {nowPlaying.title}
            </div>
            <div className="truncate text-[15px] text-subtle">
              {nowPlaying.artist}
            </div>
          </div>
          <button onClick={() => toggleLike(nowPlaying)} aria-label="Save">
            {liked ? (
              <CheckCircle2
                className="h-7 w-7 text-green"
                fill="currentColor"
                stroke="#121212"
                strokeWidth={2}
              />
            ) : (
              <PlusCircle className="h-7 w-7 text-white/80" strokeWidth={1.75} />
            )}
          </button>
        </div>

        {/* scrubber */}
        <div className="pt-5">
          <div className="relative h-1 w-full rounded-full bg-white/25">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-white"
              style={{ width: `${progress * 100}%` }}
            />
            <div
              className="absolute top-1/2 h-3 w-3 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white shadow"
              style={{ left: `${progress * 100}%` }}
            />
          </div>
          <div className="flex justify-between pt-1.5 text-[11px] text-subtle tabular-nums">
            <span>{formatDuration(cur)}</span>
            <span>-{formatDuration(remaining)}</span>
          </div>
        </div>

        {/* transport */}
        <div className="flex items-center justify-between pt-3">
          <button aria-label="Shuffle">
            <Shuffle className="h-5 w-5 text-green" strokeWidth={2.25} />
          </button>
          <button aria-label="Previous">
            <SkipBack className="h-8 w-8 text-white" fill="currentColor" strokeWidth={0} />
          </button>
          <button
            onClick={togglePlay}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-white active:scale-95"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="h-7 w-7 text-black" fill="currentColor" strokeWidth={0} />
            ) : (
              <Play className="h-7 w-7 translate-x-[1px] text-black" fill="currentColor" strokeWidth={0} />
            )}
          </button>
          <button aria-label="Next">
            <SkipForward className="h-8 w-8 text-white" fill="currentColor" strokeWidth={0} />
          </button>
          <button aria-label="Repeat">
            <Repeat className="h-5 w-5 text-white/80" strokeWidth={2.25} />
          </button>
        </div>

        {/* bottom controls */}
        <div className="flex items-center justify-between pt-5">
          <MonitorSpeaker className="h-5 w-5 text-white/80" strokeWidth={1.75} />
          <div className="flex items-center gap-5">
            <Share2 className="h-5 w-5 text-white/80" strokeWidth={2} />
            <ListMusic className="h-5 w-5 text-white/80" strokeWidth={2} />
          </div>
        </div>

        {/* What's my vibe? — Primary Vibe entry point (inferred) */}
        <button
          onClick={() =>
            openVibe({
              mode: "infer",
            })
          }
          className="mt-6 flex w-full items-center gap-3 rounded-xl border border-green/30 bg-green/10 px-4 py-3 text-left active:bg-green/15"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green">
            <Sparkles className="h-[18px] w-[18px] text-black" fill="currentColor" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-bold text-white">
              What&apos;s my vibe?
            </div>
            <div className="truncate text-[12px] text-subtle">
              Identify the vibe of your recent tracks →
            </div>
          </div>
        </button>

        {/* About the artist */}
        <section className="mt-6 overflow-hidden rounded-xl bg-[#1c1c1c]">
          <div
            className="flex h-28 items-end p-4"
            style={{
              background: "linear-gradient(135deg, #5a3a2a, #2a1c14)",
            }}
          >
            <span className="text-[16px] font-bold text-white">
              About the artist
            </span>
          </div>
          <div className="p-4">
            <div className="text-[15px] font-bold text-white">
              {nowPlaying.artist}
            </div>
            <div className="pt-1 text-[12px] text-subtle">
              4,182,665 monthly listeners
            </div>
          </div>
        </section>

        <div className="h-6" />
      </div>
    </div>
  );
}