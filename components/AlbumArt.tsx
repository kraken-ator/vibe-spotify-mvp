"use client";

import { useEffect, useState } from "react";
import { Music2 } from "lucide-react";
import { fetchArtwork, peekArtwork } from "@/lib/artwork";

interface Props {
  artist: string;
  title: string;
  /** sizing + position classes for the box (e.g. "h-12 w-12") */
  className?: string;
  /** tailwind rounding class for the tile */
  rounded?: string;
}

/**
 * Album tile that pulls real cover art from the iTunes Search API (via our
 * server route), showing a shimmer while it loads and a neutral fallback on a
 * miss. Plain <img> on purpose — keeps us off next/image's remote-pattern
 * config and the v16 image restrictions for a local prototype.
 */
export function AlbumArt({
  artist,
  title,
  className = "",
  rounded = "rounded-[4px]",
}: Props) {
  const [url, setUrl] = useState<string | null | undefined>(() =>
    peekArtwork(artist, title),
  );
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    const cached = peekArtwork(artist, title);
    if (cached !== undefined) {
      setUrl(cached);
      return;
    }
    setUrl(undefined);
    setImgLoaded(false);
    fetchArtwork(artist, title).then((u) => {
      if (active) setUrl(u);
    });
    return () => {
      active = false;
    };
  }, [artist, title]);

  return (
    <div
      className={`relative overflow-hidden bg-surface-2 ${rounded} ${className}`}
    >
      {url === undefined && <div className="absolute inset-0 shimmer" />}

      {url === null && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#3a3a3a] to-[#1c1c1c]">
          <Music2
            className="h-1/3 w-1/3 text-[#7a7a7a]"
            strokeWidth={1.5}
          />
        </div>
      )}

      {typeof url === "string" && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt=""
            draggable={false}
            onLoad={() => setImgLoaded(true)}
            onError={() => setUrl(null)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
          {!imgLoaded && <div className="absolute inset-0 shimmer" />}
        </>
      )}
    </div>
  );
}
