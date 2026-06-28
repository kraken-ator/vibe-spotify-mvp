"use client";

import { Heart } from "lucide-react";
import { useApp } from "@/lib/AppContext";
import { STATUS_BAR_H } from "@/components/StatusBar";
import { AlbumArt } from "@/components/AlbumArt";
import { VibeEntry } from "@/components/VibeEntry";
import { SpotifyGlyph } from "@/components/SpotifyMark";
import {
  HOME_GRID,
  DAILY_MIXES,
  JUMP_BACK_IN,
  PROFILE,
  type HomeTile,
} from "@/lib/data";

function TileCover({ tile, size }: { tile: HomeTile; size: string }) {
  if (tile.kind === "liked") {
    return (
      <div
        className={`flex items-center justify-center ${size}`}
        style={{
          background: "linear-gradient(135deg, #4300a3 0%, #877bdf 100%)",
        }}
      >
        <Heart className="h-1/2 w-1/2 text-white" fill="currentColor" />
      </div>
    );
  }
  if (tile.gradient) {
    return (
      <div
        className={size}
        style={{
          background: `linear-gradient(150deg, ${tile.gradient[0]}, ${tile.gradient[1]})`,
        }}
      />
    );
  }
  return (
    <AlbumArt
      artist={tile.coverArtist ?? ""}
      title={tile.coverTitle ?? ""}
      rounded=""
      className={size}
    />
  );
}

function FilterPill({
  label,
  active,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`rounded-full px-3 py-1.5 text-[13px] font-medium ${
        active ? "bg-green text-black" : "bg-[#2a2a2a] text-white"
      }`}
    >
      {label}
    </button>
  );
}

export function HomeScreen() {
  const { openLiked } = useApp();
  return (
    <div
      className="no-scrollbar h-full overflow-y-auto"
      style={{
        background:
          "linear-gradient(180deg, #1f1f22 0%, #141414 22%, #121212 40%)",
      }}
    >
      <div className="px-3 pb-4" style={{ paddingTop: STATUS_BAR_H + 6 }}>
        {/* header: avatar + filter pills */}
        <div className="flex items-center gap-2 pb-2">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
            style={{
              background: `linear-gradient(135deg, ${PROFILE.gradient[0]}, ${PROFILE.gradient[1]})`,
            }}
          >
            {PROFILE.initial}
          </div>
          <FilterPill label="All" active />
          <FilterPill label="Music" />
          <FilterPill label="Podcasts" />
        </div>

        {/* Vibe entry */}
        <div className="pb-4 pt-1">
          <VibeEntry variant="card" />
        </div>

        {/* recents grid */}
        <div className="grid grid-cols-2 gap-2">
          {HOME_GRID.map((tile) => (
            <button
              key={tile.id}
              onClick={tile.kind === "liked" ? openLiked : undefined}
              className="flex h-[54px] items-center overflow-hidden rounded-[4px] bg-white/[0.08] text-left active:bg-white/[0.14]"
            >
              <TileCover tile={tile} size="h-[54px] w-[54px] shrink-0" />
              <span className="line-clamp-2 px-2 text-[13px] font-bold leading-tight text-white">
                {tile.name}
              </span>
            </button>
          ))}
        </div>

        {/* Made For You */}
        <Shelf title="Made For You">
          {DAILY_MIXES.map((m) => (
            <div key={m.id} className="w-[148px] shrink-0">
              <div
                className="relative mb-2 flex aspect-square flex-col justify-between overflow-hidden rounded-[4px] p-2.5"
                style={{
                  background: `linear-gradient(160deg, ${m.color}, #101010)`,
                }}
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/85">
                  Daily Mix
                </span>
                <span className="text-[44px] font-black leading-none text-white">
                  {m.title.split(" ")[2]}
                </span>
                <SpotifyGlyph className="absolute bottom-2 right-2 h-5 w-5 text-white" />
              </div>
              <div className="line-clamp-2 text-[12px] leading-tight text-subtle">
                {m.artists}
              </div>
            </div>
          ))}
        </Shelf>

        {/* Jump back in */}
        <Shelf title="Jump back in">
          {JUMP_BACK_IN.map((a) => (
            <div key={a.id} className="w-[140px] shrink-0">
              <AlbumArt
                artist={a.artist}
                title={a.album}
                className="mb-2 aspect-square w-full"
              />
              <div className="truncate text-[13px] font-semibold text-white">
                {a.title}
              </div>
              <div className="truncate text-[12px] text-subtle">
                {a.subtitle}
              </div>
            </div>
          ))}
        </Shelf>
      </div>
    </div>
  );
}

function Shelf({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="pt-5">
      <h2 className="mb-3 text-[20px] font-bold tracking-[-0.01em] text-white">
        {title}
      </h2>
      <div className="no-scrollbar -mx-3 flex gap-3.5 overflow-x-auto px-3">
        {children}
      </div>
    </section>
  );
}
