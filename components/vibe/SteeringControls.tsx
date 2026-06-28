"use client";

import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import { useApp } from "@/lib/AppContext";

// Used only if the model doesn't return tailored suggestions (e.g. older saved
// vibes). Live results get chips generated for the specific prompt.
const FALLBACK = [
  { label: "Less sad", action: "less_sad" },
  { label: "More energy", action: "more_energy" },
  { label: "Swap the slow ones", action: "swap_slow" },
  { label: "Less mainstream", action: "less_mainstream" },
];

export function SteeringControls() {
  const { vibe, steer, setFamiliarity, commitFamiliarity } = useApp();
  const liveValue = useRef(vibe.familiarity);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Let a vertical mouse wheel scroll the chip row horizontally (desktop).
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      if (el.scrollWidth <= el.clientWidth) return;
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const result = vibe.result;
  if (!result) return null;

  const anchorTrack = vibe.anchorTrackId
    ? result.tracks.find((t) => t.id === vibe.anchorTrackId)
    : undefined;
  const deeperArtist =
    anchorTrack?.artist ?? result.intent.referenceArtists?.[0];

  const suggestions =
    result.steeringSuggestions && result.steeringSuggestions.length > 0
      ? result.steeringSuggestions
      : FALLBACK;

  const chips: { label: string; action: string; disabled?: boolean }[] = [
    {
      label: anchorTrack ? `More like “${anchorTrack.title}”` : "More like this",
      action: `more_like:${vibe.anchorTrackId ?? ""}`,
      disabled: !vibe.anchorTrackId,
    },
    ...suggestions.map((s) => ({ label: s.label, action: s.action })),
  ];
  if (deeperArtist) {
    chips.push({
      label: `Go deeper on ${deeperArtist}`,
      action: `deeper_on_artist:${deeperArtist}`,
    });
  }

  const fam = vibe.familiarity;

  return (
    <div className="border-y border-divider bg-base/60 py-3">
      {/* steering chips — tailored to the prompt, scroll left/right */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="no-scrollbar flex gap-2 overflow-x-auto scroll-smooth px-4"
        >
          {chips.map((c, i) => (
            <button
              key={`${c.action}-${i}`}
              disabled={vibe.steering || c.disabled}
              onClick={() => steer(c.action)}
              className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                c.disabled
                  ? "border-white/10 text-white/30"
                  : "border-white/20 text-white active:bg-white/10"
              } ${vibe.steering ? "opacity-60" : ""}`}
            >
              {c.label}
            </button>
          ))}
        </div>
        {/* edge fades hint there's more to scroll */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-[#141414] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#141414] to-transparent" />
      </div>

      {/* familiarity dial */}
      <div className="px-4 pt-4">
        <div className="mb-1.5 flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-green" fill="currentColor" />
          <span className="text-[11px] font-bold uppercase tracking-wide text-subtle">
            Familiarity
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={fam}
          disabled={vibe.steering}
          onChange={(e) => {
            const v = Number(e.target.value);
            liveValue.current = v;
            setFamiliarity(v);
          }}
          onPointerUp={() => commitFamiliarity(liveValue.current)}
          onKeyUp={() => commitFamiliarity(liveValue.current)}
          className="vibe-slider w-full"
          style={{
            background: `linear-gradient(to right, #1ed760 ${fam}%, #4d4d4d ${fam}%)`,
          }}
        />
        <div className="flex justify-between pt-1 text-[11px] text-subtle">
          <span className={fam < 50 ? "text-white" : ""}>Familiar</span>
          <span className={fam >= 50 ? "text-white" : ""}>New</span>
        </div>
      </div>
    </div>
  );
}
