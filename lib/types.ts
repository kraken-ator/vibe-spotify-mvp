// Shared types for the Vibe prototype.

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  durationSec: number;
  /** <= 8 words on why it fits the vibe (only present for AI-generated sets). */
  reason?: string;
}

export interface VibeIntent {
  mood: string;
  energy: number; // 1-5
  genres: string[];
  era: string;
  referenceArtists: string[];
  exclusions: string[];
  context: string;
}

/** A one-tap steering chip tailored to the current vibe. */
export interface SteeringSuggestion {
  label: string; // short chip text, <= 3 words
  action: string; // directive passed back verbatim as steeringAction
}

/** Exact response shape returned by /api/vibe. */
export interface VibeResponse {
  intent: VibeIntent;
  tracks: Track[];
  title: string; // short AI-generated playlist name (2–4 words)
  whyThese: string; // <= 18 words
  note?: string; // surfaces vague/contradictory handling
  isSearch?: boolean; // true if the prompt was really a direct search
  steeringSuggestions?: SteeringSuggestion[]; // tailored to this prompt
}

export interface SeedTrack {
  title: string;
  artist: string;
}

/** Body POSTed to /api/vibe. */
export interface VibeRequest {
  prompt: string;
  currentSet?: Track[];
  steeringAction?: string;
  seedTrack?: SeedTrack;
  familiarity?: number; // 0 (familiar) .. 100 (new) — included for steering context
}

export interface SavedVibe {
  id: string;
  name: string;
  prompt: string;
  tracks: Track[];
  whyThese: string;
  intent?: VibeIntent;
  steeringSuggestions?: SteeringSuggestion[];
}

export type Tab = "home" | "search" | "library";

export type VibeStatus = "empty" | "loading" | "result" | "error";

export interface VibeSession {
  status: VibeStatus;
  prompt: string;
  result: VibeResponse | null;
  seed?: SeedTrack;
  familiarity: number; // 0..100
  error?: string;
  /** A steering call is in flight; keep showing the current result underneath. */
  steering: boolean;
  /** id of a track the user selected as the "more like this" anchor. */
  anchorTrackId?: string;
  /** true once the current set has been saved to Library with no edits since. */
  saved: boolean;
  /** id of the Library playlist this session is linked to, if any. */
  savedVibeId?: string;
}
