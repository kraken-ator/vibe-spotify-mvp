"use client";

import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import type { Tab, Track, SeedTrack, VibeResponse, VibeSession, SavedVibe, VibeRequest } from "./types";
import { INITIAL_TRACK, INITIAL_LIKED } from "./data";

interface OpenVibeOptions {
  seed?: SeedTrack;
  prompt?: string;
  autoRun?: boolean;
  mode?: "infer" | "prompt";
}

interface AppContextValue {
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
  vibeOpen: boolean;
  openVibe: (opts?: OpenVibeOptions) => void;
  closeVibe: () => void;
  vibeInProgress: boolean;
  vibe: VibeSession;
  setVibePrompt: (p: string) => void;
  runVibe: (prompt: string, seed?: SeedTrack, mode?: "prompt" | "infer") => Promise<void>;
  steer: (action: string) => Promise<void>;
  setFamiliarity: (n: number) => void;
  commitFamiliarity: (n: number) => Promise<void>;
  setAnchorTrack: (id?: string) => void;
  resetVibe: () => void;
  acceptInferred: () => void;
  editInferred: () => void;
  nowPlaying: Track | null;
  nowPlayingContext: string;
  isPlaying: boolean;
  playTrack: (t: Track, context?: string) => void;
  togglePlay: () => void;
  playerExpanded: boolean;
  expandPlayer: () => void;
  collapsePlayer: () => void;
  sessionHistory: Track[];
  likedSongs: Track[];
  isLiked: (id: string) => boolean;
  toggleLike: (t: Track) => void;
  savedVibes: SavedVibe[];
  saveCurrentVibe: (name: string) => void;
  updateSavedVibe: () => void;
  openSavedVibe: (sv: SavedVibe) => void;
  likedOpen: boolean;
  openLiked: () => void;
  closeLiked: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const EMPTY_SESSION: VibeSession = {
  status: "empty",
  prompt: "",
  mode: "prompt",
  result: null,
  familiarity: 50,
  steering: false,
  saved: false,
};

function isInProgress(s: VibeSession): boolean {
  if (s.saved) return false;
  if (s.status === "result" || s.status === "loading" || s.status === "error" || s.status === "inferred" || s.status === "inferring") return true;
  return s.status === "empty" && s.prompt.trim() !== "";
}

async function callVibe(body: VibeRequest): Promise<VibeResponse> {
  const res = await fetch("/api/vibe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(err?.error || `Vibe request failed (${res.status})`);
  }
  return (await res.json()) as VibeResponse;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [vibeOpen, setVibeOpen] = useState(false);
  const [vibe, setVibe] = useState<VibeSession>(EMPTY_SESSION);
  const vibeRef = useRef(vibe);
  vibeRef.current = vibe;

  const [nowPlaying, setNowPlaying] = useState<Track | null>(INITIAL_TRACK);
  const [nowPlayingContext, setNowPlayingContext] = useState("After Hours");
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerExpanded, setPlayerExpanded] = useState(false);
  const [sessionHistory, setSessionHistory] = useState<Track[]>(INITIAL_TRACK ? [INITIAL_TRACK] : []);
  const sessionHistoryRef = useRef(sessionHistory);
  sessionHistoryRef.current = sessionHistory;

  const [likedSongs, setLikedSongs] = useState<Track[]>(INITIAL_LIKED);
  const [savedVibes, setSavedVibes] = useState<SavedVibe[]>([]);
  const [likedOpen, setLikedOpen] = useState(false);

  const setVibePrompt = (p: string) => setVibe((s) => ({ ...s, prompt: p }));
  const setAnchorTrack = (id?: string) => setVibe((s) => ({ ...s, anchorTrackId: s.anchorTrackId === id ? undefined : id }));
  const resetVibe = () => setVibe(EMPTY_SESSION);
  const acceptInferred = () => setVibe((s) => ({ ...s, status: "result" }));
  
  const editInferred = () => {
    const label = vibeRef.current.result?.inferredLabel || "";
    setVibe((s) => ({ ...EMPTY_SESSION, prompt: label }));
  };

  const runVibe = async (prompt: string, seed?: SeedTrack, mode: "prompt" | "infer" = "prompt") => {
    const trimmed = prompt.trim();
    if (mode === "prompt" && !trimmed) return;
    
    setVibe((s) => ({
      ...s,
      status: mode === "infer" ? "inferring" : "loading",
      prompt: mode === "prompt" ? trimmed : "",
      mode,
      seed,
      error: undefined,
      anchorTrackId: undefined,
      saved: false,
      savedVibeId: undefined,
    }));
    try {
      const data = await callVibe({
        prompt: mode === "prompt" ? trimmed : undefined,
        mode,
        sessionHistory: mode === "infer" ? sessionHistoryRef.current : undefined,
        seedTrack: seed,
        familiarity: vibeRef.current.familiarity,
      });
      setVibe((s) => ({ ...s, status: mode === "infer" ? "inferred" : "result", result: data, steering: false }));
    } catch (e) {
      setVibe((s) => ({
        ...s,
        status: "error",
        error: e instanceof Error ? e.message : "Something went wrong",
        steering: false,
      }));
    }
  };

  const steer = async (action: string) => {
    const cur = vibeRef.current;
    if (!cur.result || cur.steering) return;
    setVibe((s) => ({ ...s, steering: true, error: undefined }));
    try {
      // FIX: Ensure we ALWAYS have a string to send, even if inference didn't return a prompt
      const safePrompt = cur.prompt || cur.result.inferredLabel || cur.result.title || "My Vibe";
      
      const data = await callVibe({
        prompt: safePrompt,
        currentSet: cur.result.tracks,
        steeringAction: action,
        seedTrack: cur.seed,
        familiarity: cur.familiarity,
        mode: "prompt",
      });
      setVibe((s) => ({ ...s, result: data, steering: false, saved: false }));
    } catch (e) {
      setVibe((s) => ({
        ...s,
        steering: false,
        // FIX: Surface the actual error so it's not hidden
        error: e instanceof Error ? e.message : "Couldn't update the set — try again.",
      }));
    }
  };

  const setFamiliarity = (n: number) => setVibe((s) => ({ ...s, familiarity: n }));
  const commitFamiliarity = async (n: number) => {
    const cur = vibeRef.current;
    setVibe((s) => ({ ...s, familiarity: n }));
    if (!cur.result || cur.steering) return;
    const action = n >= 67 ? "mostly_new_and_obscure" : n >= 34 ? "mix_of_familiar_and_new" : "mostly_familiar_and_popular";
    setVibe((s) => ({ ...s, steering: true, error: undefined }));
    try {
      // FIX: Ensure we ALWAYS have a string to send
      const safePrompt = cur.prompt || cur.result.inferredLabel || cur.result.title || "My Vibe";
      
      const data = await callVibe({
        prompt: safePrompt,
        currentSet: cur.result.tracks,
        steeringAction: action,
        seedTrack: cur.seed,
        familiarity: n,
        mode: "prompt"
      });
      setVibe((s) => ({ ...s, result: data, steering: false, saved: false }));
    } catch (e) {
      setVibe((s) => ({
        ...s,
        steering: false,
        // FIX: Surface the actual error
        error: e instanceof Error ? e.message : "Couldn't update the set — try again.",
      }));
    }
  };

  const openVibe = (opts: OpenVibeOptions = {}) => {
    const { seed, prompt, autoRun, mode } = opts;
    setPlayerExpanded(false);
    setLikedOpen(false);

    if (mode === "infer") {
      setVibeOpen(true);
      void runVibe("", undefined, "infer");
      return;
    }

    if (autoRun) {
      setVibeOpen(true);
      const p = prompt ?? (seed ? `More songs like “${seed.title}” by ${seed.artist}` : "");
      void runVibe(p, seed, "prompt");
      return;
    }

    if (prompt !== undefined) {
      setVibeOpen(true);
      setVibe((s) => ({ ...s, prompt, seed }));
      return;
    }

    if (!isInProgress(vibeRef.current)) setVibe(EMPTY_SESSION);
    setVibeOpen(true);
  };
  
  const closeVibe = () => setVibeOpen(false);
  const openLiked = () => { setPlayerExpanded(false); setLikedOpen(true); };
  const closeLiked = () => setLikedOpen(false);

  const playTrack = (t: Track, context = "Vibe") => {
    setNowPlaying(t);
    setNowPlayingContext(context);
    setIsPlaying(true);
    setSessionHistory((prev) => {
      const filtered = prev.filter((x) => x.id !== t.id);
      return [t, ...filtered].slice(0, 5);
    });
  };
  
  const togglePlay = () => setIsPlaying((p) => !p);
  const expandPlayer = () => setPlayerExpanded(true);
  const collapsePlayer = () => setPlayerExpanded(false);

  const isLiked = (id: string) => likedSongs.some((t) => t.id === id);
  const toggleLike = (t: Track) =>
    setLikedSongs((prev) => prev.some((x) => x.id === t.id) ? prev.filter((x) => x.id !== t.id) : [t, ...prev]);

  const saveCurrentVibe = (name: string) => {
    const cur = vibeRef.current;
    if (!cur.result) return;
    const sv: SavedVibe = {
      id: `vibe-${Date.now()}`,
      name: name.trim() || cur.result.title || cur.prompt.slice(0, 40) || cur.result.inferredLabel || "Untitled Vibe",
      prompt: cur.prompt || cur.result.inferredLabel || "",
      tracks: cur.result.tracks,
      whyThese: cur.result.whyThese,
      intent: cur.result.intent,
      steeringSuggestions: cur.result.steeringSuggestions,
    };
    setSavedVibes((prev) => [sv, ...prev]);
    setVibe((s) => ({ ...s, saved: true, savedVibeId: sv.id }));
  };

  const updateSavedVibe = () => {
    const cur = vibeRef.current;
    if (!cur.result || !cur.savedVibeId) return;
    const id = cur.savedVibeId;
    setSavedVibes((prev) =>
      prev.map((v) => v.id === id ? {
        ...v,
        prompt: cur.prompt || cur.result!.inferredLabel || "",
        tracks: cur.result!.tracks,
        whyThese: cur.result!.whyThese,
        intent: cur.result!.intent,
        steeringSuggestions: cur.result!.steeringSuggestions,
      } : v),
    );
    setVibe((s) => ({ ...s, saved: true }));
  };

  const openSavedVibe = (sv: SavedVibe) => {
    setVibe({
      status: "result",
      prompt: sv.prompt,
      mode: "prompt",
      result: {
        intent: sv.intent ?? { mood: "", energy: 3, genres: [], era: "", referenceArtists: [], exclusions: [], context: "" },
        tracks: sv.tracks,
        title: sv.name,
        whyThese: sv.whyThese,
        steeringSuggestions: sv.steeringSuggestions,
      },
      familiarity: 50,
      steering: false,
      saved: true,
      savedVibeId: sv.id,
    });
    setLikedOpen(false);
    setVibeOpen(true);
  };

  const value: AppContextValue = {
    activeTab, setActiveTab, vibeOpen, openVibe, closeVibe, vibeInProgress: isInProgress(vibe),
    vibe, setVibePrompt, runVibe, steer, setFamiliarity, commitFamiliarity, setAnchorTrack, resetVibe, acceptInferred, editInferred,
    nowPlaying, nowPlayingContext, isPlaying, playTrack, togglePlay, playerExpanded, expandPlayer, collapsePlayer, sessionHistory,
    likedSongs, isLiked, toggleLike, savedVibes, saveCurrentVibe, updateSavedVibe, openSavedVibe, likedOpen, openLiked, closeLiked,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}