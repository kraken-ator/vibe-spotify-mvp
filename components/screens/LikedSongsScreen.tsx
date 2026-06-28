"use client";

import {
  ChevronLeft,
  Search,
  ArrowDownUp,
  ArrowDown,
  Shuffle,
  Play,
  Plus,
  Heart,
} from "lucide-react";
import { useApp } from "@/lib/AppContext";
import { STATUS_BAR_H } from "@/components/StatusBar";
import { AlbumArt } from "@/components/AlbumArt";
import { LIKED_GENRES } from "@/lib/data";

export function LikedSongsScreen() {
  const { likedSongs, closeLiked, playTrack, toggleLike } = useApp();

  return (
    <div
      className="animate-sheet-up absolute inset-0 z-50 flex flex-col"
      style={{
        background:
          "linear-gradient(180deg, #4750b5 0%, #2f3473 26%, #1b1c3a 42%, #161616 56%, #121212 70%)",
      }}
    >
      <div
        className="no-scrollbar flex-1 overflow-y-auto"
        style={{ paddingTop: STATUS_BAR_H + 4 }}
      >
        {/* back */}
        <div className="px-4 pb-2 pt-1">
          <button onClick={closeLiked} aria-label="Back">
            <ChevronLeft className="h-7 w-7 text-white" strokeWidth={2.25} />
          </button>
        </div>

        {/* search + sort */}
        <div className="flex items-center gap-3 px-4 pb-4">
          <div className="flex flex-1 items-center gap-2 rounded-[4px] bg-white/15 px-3 py-2.5">
            <Search className="h-4 w-4 text-white" strokeWidth={2.5} />
            <span className="text-[14px] font-medium text-white">
              Find in Liked Songs
            </span>
          </div>
          <button className="flex items-center gap-1 text-[13px] font-semibold text-white">
            Sort
            <ArrowDownUp className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {/* title */}
        <div className="px-4">
          <h1 className="text-[28px] font-black tracking-[-0.02em] text-white">
            Liked Songs
          </h1>
          <p className="pt-1 text-[13px] font-medium text-white/90">
            {likedSongs.length.toLocaleString()} songs
          </p>
        </div>

        {/* controls */}
        <div className="flex items-center justify-between px-4 pb-2 pt-4">
          <button
            className="rounded-full border-2 border-[#b3b3b3] p-1 text-[#b3b3b3]"
            aria-label="Download"
          >
            <ArrowDown className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <div className="flex items-center gap-5">
            <Shuffle className="h-6 w-6 text-green" strokeWidth={2.25} />
            <button
              onClick={() =>
                likedSongs[0] && playTrack(likedSongs[0], "Liked Songs")
              }
              className="flex h-14 w-14 items-center justify-center rounded-full bg-green active:scale-95"
              aria-label="Play"
            >
              <Play
                className="h-7 w-7 translate-x-[1px] text-black"
                fill="currentColor"
                strokeWidth={0}
              />
            </button>
          </div>
        </div>

        {/* genre chips */}
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2 pt-2">
          {LIKED_GENRES.map((g) => (
            <button
              key={g}
              className="shrink-0 rounded-[4px] bg-white/10 px-3 py-1.5 text-[13px] font-medium text-white"
            >
              {g}
            </button>
          ))}
        </div>

        {/* add songs */}
        <button className="flex w-full items-center gap-3 px-4 py-2.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-[4px] bg-white/10">
            <Plus className="h-6 w-6 text-white" strokeWidth={2.25} />
          </div>
          <span className="text-[15px] font-semibold text-white">Add songs</span>
        </button>

        {/* tracklist */}
        <div className="px-2 pb-12">
          {likedSongs.length === 0 ? (
            <div className="px-4 pt-10 text-center text-[13px] text-subtle">
              Songs you like will appear here. Tap the ♡ on any track.
            </div>
          ) : (
            likedSongs.map((t) => (
              <div
                key={t.id}
                onClick={() => playTrack(t, "Liked Songs")}
                className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 active:bg-white/[0.06]"
              >
                <AlbumArt
                  artist={t.artist}
                  title={t.title}
                  className="h-12 w-12 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[15px] font-medium leading-tight text-white">
                    {t.title}
                  </div>
                  <div className="truncate text-[13px] leading-tight text-subtle">
                    {t.artist}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(t);
                  }}
                  className="shrink-0 p-1"
                  aria-label="Remove from Liked Songs"
                >
                  <Heart className="h-[18px] w-[18px] text-green" fill="currentColor" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
