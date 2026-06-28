"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Sparkles,
  Mic,
  ArrowUp,
  Loader2,
  Play,
  Bookmark,
  RotateCcw,
  AlertCircle,
  Info,
  Check,
  Search as SearchIcon,
} from "lucide-react";
import { useApp } from "@/lib/AppContext";
import { STATUS_BAR_H } from "@/components/StatusBar";
import { TrackRow } from "@/components/TrackRow";
import { SteeringControls } from "@/components/vibe/SteeringControls";
import { SaveVibeSheet } from "@/components/vibe/SaveVibeSheet";
import { SaveChoiceSheet } from "@/components/vibe/SaveChoiceSheet";
import { EXAMPLE_PROMPTS } from "@/lib/data";

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

export function VibeScreen() {
  const {
    vibe,
    resetVibe,
    closeVibe,
    saveCurrentVibe,
    updateSavedVibe,
    savedVibes,
  } = useApp();

  const [saveOpen, setSaveOpen] = useState(false);
  const [choiceOpen, setChoiceOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1800);
  };

  const linked = savedVibes.find((v) => v.id === vibe.savedVibeId);

  // Linked playlist + new edits → ask update-or-new; otherwise straight to name.
  const handleSaveClick = () => {
    if (vibe.savedVibeId && linked) setChoiceOpen(true);
    else setSaveOpen(true);
  };

  return (
    <div
      className="animate-sheet-up absolute inset-0 z-50 flex flex-col"
      style={{
        background:
          "linear-gradient(180deg, #1a2e22 0%, #161616 30%, #121212 55%)",
      }}
    >
      {/* sticky header */}
      <div
        className="flex shrink-0 items-center justify-between px-4 pb-2"
        style={{ paddingTop: STATUS_BAR_H + 4 }}
      >
        <button onClick={closeVibe} aria-label="Close Vibe">
          <ChevronDown className="h-6 w-6 text-white" strokeWidth={2.25} />
        </button>
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-green" fill="currentColor" />
          <span className="text-[16px] font-bold text-white">Vibe</span>
        </div>
        {vibe.status === "result" ? (
          <button
            onClick={resetVibe}
            className="flex items-center gap-1 text-[13px] font-semibold text-subtle active:text-white"
          >
            <RotateCcw className="h-4 w-4" /> New
          </button>
        ) : (
          <span className="w-10" />
        )}
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto">
        {vibe.status === "empty" && <EmptyState />}
        {vibe.status === "loading" && <LoadingState />}
        {vibe.status === "error" && <ErrorState />}
        {vibe.status === "result" && vibe.result && (
          <ResultState
            onSave={handleSaveClick}
            onLikeToast={() => showToast("Added to Liked Songs")}
          />
        )}
      </div>

      <SaveVibeSheet
        open={saveOpen}
        defaultName={vibe.result?.title?.trim() || vibe.prompt.slice(0, 40)}
        onClose={() => setSaveOpen(false)}
        onSave={(name) => {
          saveCurrentVibe(name);
          setSaveOpen(false);
          showToast("Saved to Your Library");
        }}
      />

      <SaveChoiceSheet
        open={choiceOpen}
        name={linked?.name ?? ""}
        onClose={() => setChoiceOpen(false)}
        onUpdate={() => {
          updateSavedVibe();
          setChoiceOpen(false);
          showToast(`Updated “${linked?.name ?? "playlist"}”`);
        }}
        onSaveNew={() => {
          setChoiceOpen(false);
          setSaveOpen(true);
        }}
      />

      {toast && (
        <div className="animate-fade-in pointer-events-none absolute bottom-8 left-1/2 z-[58] -translate-x-1/2 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-black shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------
// Empty state — prompt input + seeded example chips
// ------------------------------------------------------------------
function EmptyState() {
  const { vibe, setVibePrompt, runVibe } = useApp();

  const submit = () => {
    const v = vibe.prompt.trim();
    if (v) void runVibe(v, vibe.seed);
  };

  return (
    <div className="px-4 pb-10 pt-4">
      <h1 className="text-[26px] font-black leading-tight tracking-[-0.02em] text-white">
        What do you
        <br />
        want to hear?
      </h1>
      <p className="pt-2 text-[14px] leading-snug text-subtle">
        Describe a mood, a moment, an artist — in your own words. Then steer it
        until it&apos;s right.
      </p>

      {vibe.seed && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-green/30 bg-green/10 px-3 py-2 text-[12px] text-white">
          <Sparkles className="h-3.5 w-3.5 text-green" fill="currentColor" />
          Adjusting from “{vibe.seed.title}” · {vibe.seed.artist}
        </div>
      )}

      {/* prompt input */}
      <div className="mt-4 rounded-2xl border border-white/10 bg-[#1d1d1d] p-3">
        <textarea
          value={vibe.prompt}
          onChange={(e) => setVibePrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={3}
          placeholder="upbeat but not annoying, like early Joji, for a late-night drive…"
          className="w-full resize-none bg-transparent text-[15px] leading-snug text-white outline-none placeholder:text-[#6f6f6f]"
        />
        <div className="flex items-center justify-between pt-1">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full text-subtle active:bg-white/10"
            aria-label="Voice input"
          >
            <Mic className="h-5 w-5" strokeWidth={2} />
          </button>
          <button
            onClick={submit}
            disabled={!vibe.prompt.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-green text-black disabled:opacity-30"
            aria-label="Generate vibe"
          >
            <ArrowUp className="h-5 w-5" strokeWidth={2.75} />
          </button>
        </div>
      </div>

      {/* example chips */}
      <p className="pb-2.5 pt-6 text-[13px] font-bold uppercase tracking-wide text-subtle">
        Try one of these
      </p>
      <div className="flex flex-wrap gap-2">
        {EXAMPLE_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => setVibePrompt(p)}
            className="rounded-full border border-white/15 px-3.5 py-2 text-[13px] text-white active:bg-white/10"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Loading shimmer
// ------------------------------------------------------------------
function LoadingState() {
  const { vibe } = useApp();
  return (
    <div className="px-4 pt-4">
      <div className="flex items-center gap-2 text-subtle">
        <Loader2 className="h-4 w-4 animate-spin text-green" />
        <span className="text-[14px]">
          Building your vibe
          {vibe.prompt ? ` — “${truncate(vibe.prompt, 32)}”` : ""}…
        </span>
      </div>
      <div className="mt-6 space-y-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-12 w-12 shrink-0 rounded-[4px] shimmer" />
            <div className="flex-1 space-y-2">
              <div
                className="h-3 rounded shimmer"
                style={{ width: `${55 + ((i * 7) % 35)}%` }}
              />
              <div className="h-2.5 w-1/3 rounded shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Error state
// ------------------------------------------------------------------
function ErrorState() {
  const { vibe, runVibe, resetVibe } = useApp();
  return (
    <div className="flex flex-col items-center px-8 pt-24 text-center">
      <AlertCircle className="h-10 w-10 text-subtle" strokeWidth={1.5} />
      <h2 className="pt-4 text-[17px] font-bold text-white">
        Couldn&apos;t build that vibe
      </h2>
      <p className="pt-2 text-[13px] leading-snug text-subtle">{vibe.error}</p>
      <div className="flex gap-3 pt-6">
        <button
          onClick={() => void runVibe(vibe.prompt, vibe.seed)}
          className="rounded-full bg-green px-6 py-2.5 text-[14px] font-bold text-black"
        >
          Try again
        </button>
        <button
          onClick={resetVibe}
          className="rounded-full border border-white/20 px-6 py-2.5 text-[14px] font-bold text-white"
        >
          Start over
        </button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Result state — header + steering + steerable tracklist
// ------------------------------------------------------------------
function ResultState({
  onSave,
  onLikeToast,
}: {
  onSave: () => void;
  onLikeToast: () => void;
}) {
  const {
    vibe,
    setAnchorTrack,
    playTrack,
    nowPlaying,
    isLiked,
    toggleLike,
  } = useApp();

  const result = vibe.result!;
  const prevIds = useRef<Set<string>>(new Set());
  const currentIds = result.tracks.map((t) => t.id);
  const changed = new Set(currentIds.filter((id) => !prevIds.current.has(id)));
  useEffect(() => {
    prevIds.current = new Set(result.tracks.map((t) => t.id));
  }, [result]);

  const playFirst = () => {
    if (result.tracks[0]) {
      setAnchorTrack(undefined);
      playTrack(result.tracks[0], "Vibe");
    }
  };

  return (
    <div className="pb-12">
      {/* header block */}
      <div className="px-4 pt-1">
        {vibe.seed && (
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-green/10 px-2.5 py-1 text-[11px] text-white">
            <Sparkles className="h-3 w-3 text-green" fill="currentColor" />
            from “{vibe.seed.title}”
          </div>
        )}
        {result.isSearch && (
          <div className="mb-2 flex items-center gap-1.5 text-[12px] font-medium text-subtle">
            <SearchIcon className="h-3.5 w-3.5" /> Looked like a search — here&apos;s
            what I found
          </div>
        )}
        <h1 className="text-[20px] font-bold leading-snug text-white">
          {vibe.prompt}
        </h1>
        {result.whyThese && (
          <p className="flex items-start gap-1.5 pt-1.5 text-[13px] leading-snug text-[#c9c9c9]">
            <Sparkles
              className="mt-[2px] h-3.5 w-3.5 shrink-0 text-green"
              fill="currentColor"
            />
            {result.whyThese}
          </p>
        )}
        {result.note && (
          <div className="mt-2.5 flex items-start gap-2 rounded-lg bg-[#3a2f12] px-3 py-2 text-[12px] leading-snug text-[#e6c980]">
            <Info className="mt-[1px] h-3.5 w-3.5 shrink-0" />
            {result.note}
          </div>
        )}

        {/* action row */}
        <div className="flex items-center justify-between pt-4">
          {vibe.saved ? (
            <div className="flex items-center gap-2 px-1 text-[13px] font-semibold text-subtle">
              <Check className="h-4 w-4 text-green" strokeWidth={3} />
              Saved to Library
            </div>
          ) : (
            <button
              onClick={onSave}
              className="flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-[13px] font-bold text-white active:bg-white/10"
            >
              <Bookmark className="h-4 w-4" />
              {vibe.savedVibeId ? "Save changes" : "Save this Vibe"}
            </button>
          )}
          <button
            onClick={playFirst}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-green active:scale-95"
            aria-label="Play"
          >
            <Play
              className="h-6 w-6 translate-x-[1px] text-black"
              fill="currentColor"
              strokeWidth={0}
            />
          </button>
        </div>
      </div>

      {/* steering */}
      <div className="mt-3">
        <SteeringControls />
      </div>

      {/* steering status */}
      {vibe.steering && (
        <div className="flex items-center justify-center gap-2 py-2 text-[12px] text-subtle">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-green" /> Updating your
          vibe…
        </div>
      )}
      {vibe.error && !vibe.steering && (
        <div className="px-4 py-2 text-center text-[12px] text-[#ff6b6b]">
          {vibe.error}
        </div>
      )}

      {/* tracklist */}
      <div
        className={`px-2 pt-1 transition-opacity ${
          vibe.steering ? "pointer-events-none opacity-50" : ""
        }`}
      >
        {result.tracks.map((t) => (
          <TrackRow
            key={t.id}
            track={t}
            liked={isLiked(t.id)}
            isAnchor={vibe.anchorTrackId === t.id}
            isCurrent={nowPlaying?.id === t.id}
            changed={changed.has(t.id)}
            onTap={() => {
              setAnchorTrack(t.id);
              playTrack(t, "Vibe");
            }}
            onToggleLike={() => {
              const wasLiked = isLiked(t.id);
              toggleLike(t);
              if (!wasLiked) onLikeToast();
            }}
          />
        ))}
      </div>
    </div>
  );
}
