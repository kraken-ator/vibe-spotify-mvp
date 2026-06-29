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

export interface SteeringSuggestion {
  label: string; 
  action: string;
}

export interface VibeResponse {
  intent: VibeIntent;
  tracks: Track[];
  title: string; 
  whyThese: string; 
  note?: string; 
  isSearch?: boolean; 
  steeringSuggestions?: SteeringSuggestion[]; 
  
  inferredLabel?: string;
  confidence?: "high" | "medium" | "low";
  whyInferred?: { title: string; artist: string; reason: string }[];
}

export interface SeedTrack {
  title: string;
  artist: string;
}

export interface VibeRequest {
  prompt?: string;
  mode?: "prompt" | "infer";
  sessionHistory?: Track[];
  currentSet?: Track[];
  steeringAction?: string;
  seedTrack?: SeedTrack;
  familiarity?: number;
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

export type VibeStatus = "empty" | "loading" | "inferring" | "inferred" | "result" | "error";

export interface VibeSession {
  status: VibeStatus;
  prompt: string;
  mode: "prompt" | "infer"; // <-- ADDED THIS
  result: VibeResponse | null;
  seed?: SeedTrack;
  familiarity: number; 
  error?: string;
  steering: boolean;
  anchorTrackId?: string;
  saved: boolean;
  savedVibeId?: string;
}