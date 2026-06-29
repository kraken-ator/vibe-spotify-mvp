# Vibe — Complete Feature List

Every feature in the MVP, grouped by area. Vibe is a high-fidelity Spotify
mobile prototype (dark mode) with one new feature — **Vibe** — woven through it:
describe music in natural language, get a real AI-generated set, and steer it in
real time.

---

## 1. The Vibe engine (core)

- **Natural-language prompt → real tracklist.** Type a vibe in your own words
  ("upbeat but not annoying, like early Joji, for a late-night drive") and get
  **16–20 real, well-known songs** that fit.
- **Structured intent parsing.** Groq (via Llama 3) converts the prompt into structured
  intent behind the scenes: mood, energy (1–5), genres, era, reference artists,
  exclusions, and context/activity.
- **Per-track reasons (trust mechanic).** Every track shows a detailed 1-2 sentence reason it
  was picked, fully text-wrapped for readability (e.g. "Mellow, intimate, perfect for introspection").
- **"Why these" summary.** A detailed paragraph (3-4 sentences) explaining how the set
  matches the prompt, completely visible with multi-line text wrapping at the top.
- **AI-generated playlist title.** A short, catchy 2–4 word name is generated
  from the prompt's meaning (e.g. "late-night drive…" → "Neon Reflections") and
  used as the default when saving.
- **Real metadata only.** Title, artist, album, and a realistic duration per
  track — no fabricated songs.

## 2. Real-time steering (the heart of the feature)

- **In-place adjustment.** Steering keeps the tracks that still fit and replaces
  only those that don't, re-biasing toward your action — it does **not**
  regenerate from scratch.
- **Prompt-tailored steering chips.** The one-tap chips are generated per prompt,
  not a fixed list. "gym, aggressive, no EDM" → *Heavier Metal · More Rap ·
  Industrial Edge*; "heartbreak but pretty" → *Dreamier vocals · More indie
  folk · More atmospheric*.
- **Scrollable chip row.** The chips scroll horizontally via touch, trackpad,
  **and mouse-wheel** (vertical wheel maps to horizontal scroll on desktop),
  with left/right fade edges hinting there's more.
- **"More like this" (anchor).** Tap any track to make it the anchor (it
  highlights green and starts "playing"); the chip becomes *More like "<that
  track>"* and biases the set around it.
- **"Go deeper on <artist>".** A contextual chip that pulls more from the
  anchored track's artist (or the set's top reference artist).
- **Familiarity dial.** A Familiar ↔ New slider that re-biases between popular
  hits / deeper cuts you already love and genuinely new, lesser-known artists.
  Releasing it triggers a steering call using the dial's absolute position.
- **Responsive feedback.** An "Updating your vibe…" state with the list dimmed
  while a steering call is in flight; changed rows animate in when it returns.

## 3. Entry points (Vibe is reachable from 3 surfaces)

- **Home — "Start a Vibe" card.** A prominent green card near the top of the
  Home feed.
- **Search — "or describe a vibe…" bar.** Sits under the search bar.
- **Search — in-progress indicator.** When you have unsaved Vibe work, that bar
  quietly changes to a **pulsing green dot + the words you're working with**
  (instead of the default invite) — implying live, resumable work.
- **Now-Playing — "Adjust this vibe".** Opens Vibe **pre-seeded from the current
  track** (passes the song as a seed) — intercepting the exact moment a
  recommendation misses.
- **Resume vs. fresh logic.** Opening Vibe from Home/Search **resumes** unsaved
  in-progress work, but starts a **completely fresh prompt space** if the current
  vibe was already saved to Library.

## 4. Vibe screen states

- **Empty state.** Heading, prompt textarea, a mic button (visual stub), a
  green generate button, and **seeded example chips** that fill the prompt on tap
  (solving the blank-page problem).
- **Loading state.** A Spotify-style shimmer skeleton tracklist while the AI
  runs, echoing your prompt.
- **Result state.** Prompt header + "why these" + the steerable tracklist +
  steering controls + save/play actions.
- **Error state.** A clean "Couldn't build that vibe" screen with the reason and
  **Try again / Start over** buttons (never a crash).
- **Seed banner.** When launched via "Adjust this vibe," the result shows a
  "from '<track>'" tag.
- **Search-vs-vibe handling.** If the prompt was really a search ("play Bohemian
  Rhapsody"), the result shows a "Looked like a search" label and returns that
  song/artist.
- **Edge-case note.** Vague or contradictory prompts surface a subtle amber
  note explaining the interpretation/tension (notes are reserved for the prompt
  itself, never for steering reasoning).

## 5. Saving & playlist management

- **Save individual tracks.** A heart on every track row toggles it in/out of
  Liked Songs, with an "Added to Liked Songs" toast.
- **Save the whole set as a named Vibe.** A safely padded bottom sheet pre-filled with the
  AI-generated title; editable; saves to Your Library.
- **"Saved" state.** After saving, the "Save this Vibe" button disappears,
  replaced by a subtle "✓ Saved to Library" indicator.
- **Returns on edits.** The moment you steer or move the dial, the action
  returns — now labeled **"Save changes."**
- **Update vs. new playlist.** Saving a vibe that's already a Library playlist
  (with new edits) opens a choice popup: **Update "<name>"** (with a fresh AI-recommended title)
  or **Save as new playlist** (keep the original, branch a copy).
- **Reopen from Library.** Tapping a saved Vibe reopens it in full result state
  (as already-saved), re-linked so further edits know which playlist to update.

## 6. Liked Songs

- **Dedicated Liked Songs screen**, matching Spotify: blue gradient header,
  "Find in Liked Songs" + Sort, the live song count, download / shuffle / play
  controls, mood/genre filter chips (Calm · Pop · Rap · Soundtrack · Rock ·
  Electronic), an "Add songs" row, and the tracklist.
- **Openable from two places** — the Home grid "Liked Songs" tile and the
  Library "Liked Songs" row.
- **Live two-way sync.** Hearting a track anywhere (Vibe list, Now-Playing) adds
  it here; the green heart on each row removes it.
- **Seeded with real songs** so the screen is populated on first open.
- **Empty state** if you remove everything.

## 7. Now-Playing (expanded player)

- Full-screen player: large real album art, title/artist, scrubber with elapsed
  / remaining times, and transport controls (shuffle, prev, play/pause, next,
  repeat) — **visual only**, no audio.
- **Save indicator** — a green check (added) / plus-circle (add) toggle tied to
  Liked Songs.
- **"Adjust this vibe"** entry (the seeded Vibe flow).
- **"About the artist"** section with monthly-listener styling.
- Collapses back to the mini player.

## 8. Mini player

- Sits above the tab bar whenever a track is "playing": album thumbnail,
  title/artist, connect-device icon, play/pause (visual), and a progress line.
- Tapping it expands the full Now-Playing screen.
- Updates live when you play a track from any list (Vibe set, Liked Songs).

## 9. The Spotify shell (faux app)

- **Device frame.** Centered iPhone-class frame (390×844) with bezel and a
  realistic iOS status bar (time, signal, wifi, charging battery).
- **Bottom tab bar.** Home · Search · Your Library (the Premium tab was removed
  for a premium-only target segment), with filled/active states.
- **Home tab.** Profile avatar + filter pills (All / Music / Podcasts), the Vibe
  card, a 2-column recents grid, a "Made For You" Daily Mix shelf, and a "Jump
  back in" album shelf with real covers.
- **Search tab.** Search header + camera, the white search bar, the Vibe entry,
  and a "Browse all" grid of colorful genre tiles.
- **Your Library tab.** Avatar + header, filter chips, a Recents sort row, a
  **Saved Vibes** section (your created Vibes), and the library list with pins,
  circular artist avatars, and album covers.

## 10. Album art

- **Real cover art** fetched at runtime from the keyless **iTunes Search API**.
- **Server-side + cached.** Lookups go through an internal route (avoids CORS)
  and are cached in memory per track (client and server) with request dedupe.
- **512×512 crisp tiles**, a shimmer while loading, and a neutral fallback tile
  on a miss — a lookup miss never breaks the layout.

## 11. Edge cases & robustness

- **Vague prompts** ("good music") → a sensible interpretation + an explanatory
  note.
- **Contradictory prompts** ("calm but high energy") → a reasonable choice + a
  note naming the tension.
- **Niche prompts** ("Mongolian throat-singing lo-fi") → closest real matches,
  never an empty list.
- **Direct searches** → detected and returned with a label.
- **API errors handled gracefully** with clear in-app messages for: missing key,
  rejected key, rate-limit/quota exhaustion, malformed JSON, empty response, and
  network failure — each with retry.

## 12. Technical & architecture features

- **AI is the engine.** Groq (`groq-sdk`) running Llama 3.3 does both intent parsing
  and curation at lightning speed, via a single server route (`/api/vibe`).
- **Server-side key only.** The API key is read from `GROQ_API_KEY` on the
  server and never reaches the browser bundle. `.env.local` is gitignored.
- **Reliable structured output.** Groq is called with `response_format: { type: "json_object" }`
  and explicit schema instructions, with defensive JSON parsing (fence-stripping fallback)
  and normalization (id slugs, duration clamping, de-duping).
- **Generous quotas.** The Llama 3.3 70B model provides the perfect balance of reasoning
  capability and ultra-low latency generation, easily bypassing standard free-tier API rate limits.
- **No database, no localStorage.** All state (now-playing, liked songs, saved
  Vibes, the active session) lives in a single in-memory React Context.
- **Next.js 16 (App Router) + TypeScript + Tailwind v4**, Turbopack.

## 13. Design, polish & privacy

- **Pixel-accurate Spotify styling** — exact palette (base `#121212`, surfaces
  `#181818`/`#282828`, green `#1ED760`), spacing, type scale, pill chips, rounded
  play buttons, and nav iconography.
- **Swappable font token.** Spotify's proprietary Circular is approximated with
  **Montserrat** via a single `--font-app` token — a licensed Circular file can
  be dropped in without touching anything else.
- **Smooth motion** — flawlessly padded sheet slide-ups, tab/now-playing transitions, row-update
  animations, loading shimmers, and an equalizer indicator on the playing track.
- **No audio** — all transport controls are visual only (by design).
- **Privacy-scrubbed** — all personal/friend-created playlists from the source
  screenshots were replaced with neutral Spotify editorial content and a generic
  profile avatar; no real user name appears anywhere.

---

*Vibe is a private, non-commercial product case study and is not affiliated with
Spotify.*