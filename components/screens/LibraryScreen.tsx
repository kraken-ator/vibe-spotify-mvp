"use client";

import { Search, Plus, ArrowDownUp, LayoutGrid, Heart, Pin, Sparkles } from "lucide-react";
import { useApp } from "@/lib/AppContext";
import { STATUS_BAR_H } from "@/components/StatusBar";
import { AlbumArt } from "@/components/AlbumArt";
import { PROFILE, LIBRARY_ITEMS, type LibraryItem } from "@/lib/data";

const FILTERS = ["Playlists", "Artists", "Albums", "Podcasts"];

function ItemCover({ item }: { item: LibraryItem }) {
  const isArtist = item.kind === "artist";
  const round = isArtist ? "rounded-full" : "rounded-[4px]";
  if (item.kind === "liked") {
    return (
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center ${round}`}
        style={{ background: "linear-gradient(135deg, #4300a3 0%, #877bdf 100%)" }}
      >
        <Heart className="h-6 w-6 text-white" fill="currentColor" />
      </div>
    );
  }
  if (item.gradient) {
    return (
      <div
        className={`h-12 w-12 shrink-0 ${round}`}
        style={{
          background: `linear-gradient(150deg, ${item.gradient[0]}, ${item.gradient[1]})`,
        }}
      />
    );
  }
  return (
    <AlbumArt
      artist={item.coverArtist ?? ""}
      title={item.coverTitle ?? ""}
      rounded={round}
      className="h-12 w-12 shrink-0"
    />
  );
}

export function LibraryScreen() {
  const { savedVibes, openSavedVibe, openLiked } = useApp();

  return (
    <div className="no-scrollbar h-full overflow-y-auto bg-base">
      <div style={{ paddingTop: STATUS_BAR_H + 6 }}>
        {/* header */}
        <div className="flex items-center justify-between px-4 pb-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold text-white"
              style={{
                background: `linear-gradient(135deg, ${PROFILE.gradient[0]}, ${PROFILE.gradient[1]})`,
              }}
            >
              {PROFILE.initial}
            </div>
            <h1 className="text-[22px] font-bold tracking-[-0.01em] text-white">
              Your Library
            </h1>
          </div>
          <div className="flex items-center gap-5 text-white">
            <Search className="h-[22px] w-[22px]" strokeWidth={2.25} />
            <Plus className="h-6 w-6" strokeWidth={2.25} />
          </div>
        </div>

        {/* filter chips */}
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              className="shrink-0 rounded-full border border-[#3a3a3a] bg-transparent px-3 py-1.5 text-[13px] font-medium text-white"
            >
              {f}
            </button>
          ))}
        </div>

        {/* sort row */}
        <div className="flex items-center justify-between px-4 pb-1 pt-3">
          <button className="flex items-center gap-2 text-white">
            <ArrowDownUp className="h-4 w-4" strokeWidth={2} />
            <span className="text-[13px] font-medium">Recents</span>
          </button>
          <LayoutGrid className="h-[18px] w-[18px] text-white" strokeWidth={2} />
        </div>

        {/* Saved Vibes */}
        {savedVibes.length > 0 && (
          <div className="px-2 pt-1">
            {savedVibes.map((v) => (
              <button
                key={v.id}
                onClick={() => openSavedVibe(v)}
                className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left active:bg-white/5"
              >
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[4px]"
                  style={{
                    background: "linear-gradient(135deg, #1ed760, #0c7d57)",
                  }}
                >
                  <Sparkles className="h-6 w-6 text-black" fill="currentColor" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[15px] font-semibold text-white">
                    {v.name}
                  </div>
                  <div className="flex items-center gap-1.5 text-[13px] text-subtle">
                    <Sparkles className="h-3 w-3 text-green" fill="currentColor" />
                    <span className="truncate">Vibe • {v.tracks.length} songs</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* library list */}
        <div className="px-2 pb-4 pt-1">
          {LIBRARY_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={item.kind === "liked" ? openLiked : undefined}
              className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left active:bg-white/5"
            >
              <ItemCover item={item} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[15px] font-semibold text-white">
                  {item.name}
                </div>
                <div className="flex items-center gap-1.5 text-[13px] text-subtle">
                  {item.pinned && (
                    <Pin
                      className="h-3 w-3 rotate-45 text-green"
                      fill="currentColor"
                    />
                  )}
                  <span className="truncate">{item.subtitle}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
