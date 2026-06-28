import type { Track } from "./types";

// ------------------------------------------------------------------
// Generic, privacy-safe profile. (No real user name anywhere.)
// ------------------------------------------------------------------
export const PROFILE = {
  initial: "A",
  // soft gradient avatar, Spotify-style
  gradient: ["#5b6470", "#3a4049"] as [string, string],
};

export const formatDuration = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

// ------------------------------------------------------------------
// Vibe: seeded example prompt chips (empty-state) + steering chips.
// ------------------------------------------------------------------
export const EXAMPLE_PROMPTS: string[] = [
  "focus, no lyrics",
  "heartbreak but make it pretty",
  "gym, aggressive",
  "late-night drive, mellow",
  "upbeat but not annoying, like early Joji",
  "sunday morning, coffee, slow",
];

export interface SteeringChip {
  label: string;
  action: string;
  /** Some chips only make sense with a selected anchor track. */
  needsAnchor?: boolean;
}

export const STEERING_CHIPS: SteeringChip[] = [
  { label: "More like this", action: "more_like", needsAnchor: true },
  { label: "Less sad", action: "less_sad" },
  { label: "More energy", action: "more_energy" },
  { label: "Swap the slow ones", action: "swap_slow" },
  { label: "Less mainstream", action: "less_mainstream" },
];

// ------------------------------------------------------------------
// Spotify shell content — neutral editorial playlists & real albums.
// (Personal/custom playlists intentionally omitted for privacy.)
// ------------------------------------------------------------------

export interface HomeTile {
  id: string;
  name: string;
  kind: "liked" | "playlist" | "album" | "artist";
  /** gradient cover for editorial playlists with no real artwork */
  gradient?: [string, string];
  /** real-artwork lookups for albums/artists */
  coverArtist?: string;
  coverTitle?: string;
}

// Top 2-column grid on Home ("recents").
export const HOME_GRID: HomeTile[] = [
  { id: "liked", name: "Liked Songs", kind: "liked" },
  {
    id: "discover-weekly",
    name: "Discover Weekly",
    kind: "playlist",
    gradient: ["#2d46b9", "#509bf5"],
  },
  {
    id: "daily-mix-1",
    name: "Daily Mix 1",
    kind: "playlist",
    gradient: ["#1e3264", "#a0c3d2"],
  },
  {
    id: "release-radar",
    name: "Release Radar",
    kind: "playlist",
    gradient: ["#8d67ab", "#e8115b"],
  },
  {
    id: "chill-hits",
    name: "Chill Hits",
    kind: "playlist",
    gradient: ["#477d95", "#b3e0dc"],
  },
  {
    id: "daily-mix-2",
    name: "Daily Mix 2",
    kind: "playlist",
    gradient: ["#a56752", "#e7cba9"],
  },
  {
    id: "rapcaviar",
    name: "RapCaviar",
    kind: "playlist",
    gradient: ["#1e1e1e", "#535353"],
  },
  {
    id: "top-hits",
    name: "Today's Top Hits",
    kind: "playlist",
    gradient: ["#d84000", "#ffb27a"],
  },
];

// "Made for you" Daily Mix shelf.
export interface DailyMix {
  id: string;
  title: string;
  artists: string;
  color: string;
}
export const DAILY_MIXES: DailyMix[] = [
  { id: "dm1", title: "Daily Mix 1", artists: "Tame Impala, MGMT, Glass Animals and more", color: "#7a4eab" },
  { id: "dm2", title: "Daily Mix 2", artists: "Kendrick Lamar, Tyler, The Creator and more", color: "#b06f3a" },
  { id: "dm3", title: "Daily Mix 3", artists: "Bon Iver, Sufjan Stevens, The National", color: "#2d6e7e" },
  { id: "dm4", title: "Daily Mix 4", artists: "Daft Punk, Justice, Disclosure and more", color: "#b13a4e" },
  { id: "dm5", title: "Daily Mix 5", artists: "Phoebe Bridgers, Mitski, Clairo", color: "#3a59b1" },
];

// "Jump back in" shelf — real albums (artwork fetched from iTunes).
export interface AlbumCard {
  id: string;
  title: string;
  subtitle: string;
  artist: string;
  album: string;
}
export const JUMP_BACK_IN: AlbumCard[] = [
  { id: "j1", title: "After Hours", subtitle: "The Weeknd", artist: "The Weeknd", album: "After Hours" },
  { id: "j2", title: "Currents", subtitle: "Tame Impala", artist: "Tame Impala", album: "Currents" },
  { id: "j3", title: "Blonde", subtitle: "Frank Ocean", artist: "Frank Ocean", album: "Blonde" },
  { id: "j4", title: "DAMN.", subtitle: "Kendrick Lamar", artist: "Kendrick Lamar", album: "DAMN." },
  { id: "j5", title: "Dreamland", subtitle: "Glass Animals", artist: "Glass Animals", album: "Dreamland" },
];

// ------------------------------------------------------------------
// Search — "Browse all" colorful genre grid.
// ------------------------------------------------------------------
export interface BrowseTile {
  id: string;
  name: string;
  color: string;
}
export const BROWSE_TILES: BrowseTile[] = [
  { id: "made-for-you", name: "Made For You", color: "#1e3264" },
  { id: "new-releases", name: "New Releases", color: "#e8115b" },
  { id: "pop", name: "Pop", color: "#148a08" },
  { id: "hiphop", name: "Hip-Hop", color: "#ba5d07" },
  { id: "podcasts", name: "Podcasts", color: "#006450" },
  { id: "charts", name: "Charts", color: "#8d67ab" },
  { id: "rock", name: "Rock", color: "#e91429" },
  { id: "dance", name: "Dance/Electronic", color: "#d84000" },
  { id: "mood", name: "Mood", color: "#dc148c" },
  { id: "indie", name: "Indie", color: "#608108" },
  { id: "rnb", name: "R&B", color: "#477d95" },
  { id: "chill", name: "Chill", color: "#503750" },
  { id: "sleep", name: "Sleep", color: "#1e3264" },
  { id: "workout", name: "Workout", color: "#777777" },
  { id: "focus", name: "Focus", color: "#7358ff" },
  { id: "decades", name: "Decades", color: "#b02897" },
];

// ------------------------------------------------------------------
// Library list (neutral editorial entries only).
// ------------------------------------------------------------------
export interface LibraryItem {
  id: string;
  name: string;
  kind: "liked" | "playlist" | "album" | "artist";
  subtitle: string;
  pinned?: boolean;
  gradient?: [string, string];
  coverArtist?: string;
  coverTitle?: string;
}
export const LIBRARY_ITEMS: LibraryItem[] = [
  { id: "liked", name: "Liked Songs", kind: "liked", subtitle: "Playlist", pinned: true },
  {
    id: "discover-weekly",
    name: "Discover Weekly",
    kind: "playlist",
    subtitle: "Playlist • Spotify",
    pinned: true,
    gradient: ["#2d46b9", "#509bf5"],
  },
  {
    id: "release-radar",
    name: "Release Radar",
    kind: "playlist",
    subtitle: "Playlist • Spotify",
    gradient: ["#8d67ab", "#e8115b"],
  },
  { id: "the-weeknd", name: "The Weeknd", kind: "artist", subtitle: "Artist", coverArtist: "The Weeknd", coverTitle: "Blinding Lights" },
  {
    id: "chill-hits",
    name: "Chill Hits",
    kind: "playlist",
    subtitle: "Playlist • Spotify",
    gradient: ["#477d95", "#b3e0dc"],
  },
  { id: "tame-impala", name: "Tame Impala", kind: "artist", subtitle: "Artist", coverArtist: "Tame Impala", coverTitle: "The Less I Know The Better" },
  { id: "currents", name: "Currents", kind: "album", subtitle: "Album • Tame Impala", coverArtist: "Tame Impala", coverTitle: "Currents" },
];

// ------------------------------------------------------------------
// Initial now-playing track (neutral, popular) so the shell feels live.
// ------------------------------------------------------------------
export const INITIAL_TRACK: Track = {
  id: "blinding-lights",
  title: "Blinding Lights",
  artist: "The Weeknd",
  album: "After Hours",
  durationSec: 200,
};

// ------------------------------------------------------------------
// Liked Songs — seeded with neutral popular tracks so the screen is
// populated on first open (the user can like/unlike more from anywhere).
// ------------------------------------------------------------------
export const INITIAL_LIKED: Track[] = [
  { id: "blinding-lights", title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", durationSec: 200 },
  { id: "midnight-city", title: "Midnight City", artist: "M83", album: "Hurry Up, We're Dreaming", durationSec: 244 },
  { id: "redbone", title: "Redbone", artist: "Childish Gambino", album: "Awaken, My Love!", durationSec: 327 },
  { id: "nights", title: "Nights", artist: "Frank Ocean", album: "Blonde", durationSec: 307 },
  { id: "less-i-know", title: "The Less I Know The Better", artist: "Tame Impala", album: "Currents", durationSec: 216 },
  { id: "sunflower", title: "Sunflower", artist: "Post Malone, Swae Lee", album: "Spider-Man: Into the Spider-Verse", durationSec: 158 },
  { id: "electric-feel", title: "Electric Feel", artist: "MGMT", album: "Oracular Spectacular", durationSec: 229 },
  { id: "instant-crush", title: "Instant Crush", artist: "Daft Punk", album: "Random Access Memories", durationSec: 337 },
];

// Spotify auto-generated mood/genre filter chips on the Liked Songs page.
export const LIKED_GENRES = ["Calm", "Pop", "Rap", "Soundtrack", "Rock", "Electronic"];
