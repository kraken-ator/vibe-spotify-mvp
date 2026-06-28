"use client";

import { Search, Camera } from "lucide-react";
import { STATUS_BAR_H } from "@/components/StatusBar";
import { VibeEntry } from "@/components/VibeEntry";
import { PROFILE, BROWSE_TILES } from "@/lib/data";

export function SearchScreen() {
  return (
    <div className="no-scrollbar h-full overflow-y-auto bg-base">
      <div className="px-4 pb-4" style={{ paddingTop: STATUS_BAR_H + 6 }}>
        {/* header */}
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold text-white"
              style={{
                background: `linear-gradient(135deg, ${PROFILE.gradient[0]}, ${PROFILE.gradient[1]})`,
              }}
            >
              {PROFILE.initial}
            </div>
            <h1 className="text-[26px] font-bold tracking-[-0.02em] text-white">
              Search
            </h1>
          </div>
          <Camera className="h-6 w-6 text-white" strokeWidth={2} />
        </div>

        {/* search bar */}
        <div className="flex items-center gap-2.5 rounded-[4px] bg-white px-3 py-3">
          <Search className="h-5 w-5 text-black" strokeWidth={2.5} />
          <span className="text-[15px] font-medium text-[#5a5a5a]">
            What do you want to listen to?
          </span>
        </div>

        {/* Vibe entry */}
        <div className="pt-2.5">
          <VibeEntry variant="bar" />
        </div>

        {/* Browse all */}
        <h2 className="pb-3 pt-6 text-[20px] font-bold tracking-[-0.01em] text-white">
          Browse all
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {BROWSE_TILES.map((t) => (
            <button
              key={t.id}
              className="relative aspect-[1.15/1] overflow-hidden rounded-lg p-3 text-left active:opacity-90"
              style={{ background: t.color }}
            >
              <span className="relative z-10 text-[15px] font-bold leading-tight text-white">
                {t.name}
              </span>
              <div
                className="absolute -bottom-2 -right-3 h-[58px] w-[58px] rotate-[25deg] rounded-[3px] shadow-[0_4px_10px_rgba(0,0,0,0.35)]"
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.35), rgba(0,0,0,0.45))`,
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
