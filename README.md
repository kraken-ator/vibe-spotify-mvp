# Vibe — a Spotify discovery concept

**Describe the music you want in your own words, then steer it in real time.**

Vibe turns discovery from something *pushed* at you into a short, low-effort,
controllable loop. You type a vibe (or let it infer one from your history), get
a real tracklist, and nudge it — *more energy, less sad, more like this,
familiar ↔ new* — until it's right.

A high-fidelity, pixel-accurate Spotify mobile prototype (dark mode) built as a
product case study. Real AI powers the core (Groq Llama 3); real cover art
comes from the iTunes Search API. No audio plays — transport controls are
visual only.

> ⚠️ Private, non-commercial case study. Uses Spotify's real styling/logo for
> fidelity. Not affiliated with Spotify.

---

## ✨ What it does

- **Prompted or Inferred → a real set.** Groq parses your prompt into structured
  intent OR reads your recent listening history to infer the vibe. It returns
  16–20 real songs, each with a detailed multi-sentence explanation of why it fits.
- **Real-time steering — the heart of the feature.** One-tap chips and a
  Familiarity dial re-call the AI and adjust the set *in place* (keep what fits,
  replace what doesn't) instead of regenerating from scratch.
- **Steering chips are tailored to your prompt.** Ask for "gym, aggressive, no
  EDM" and you get *Heavier Metal · More Rap · Industrial Edge*; ask for
  "heartbreak but pretty" and you get *Dreamier vocals · More indie folk*.
- **"Adjust this vibe" from Now-Playing.** When a recommendation misses, the
  steering lever is right there — it opens Vibe pre-seeded from the current
  track.
- **Save & manage playlists.** Heart individual tracks to Liked Songs, or save
  the whole set as a named Vibe. Edit a saved Vibe and you're asked to **update
  the existing playlist (with a fresh AI-recommended name) or save a new one**.
- **Graceful edges.** Vague, contradictory, niche, and "this is actually a
  search" prompts are all handled; loading shimmers, error/retry states, and
  artwork fallbacks throughout.

## 🧭 Where Vibe lives (entry points)

| Surface | Entry |
| --- | --- |
| **Home** | "Start a Vibe" card |
| **Search** | "or describe a vibe…" bar (shows a live indicator if you have unsaved work) |
| **Now-Playing** | "Adjust this vibe" — seeded from the current track |

Saved Vibes and Liked Songs appear in **Your Library**.

## 🏗️ How it works

Browser (React shell)
   │  POST /api/vibe   { mode, prompt, currentSet?, steeringAction?, seedTrack?, sessionHistory? }
   ▼
app/api/vibe/route.ts  ──►  Groq (llama-3.3-70b-versatile)
   │  structured JSON: intent, tracks, title, whyThese, steeringSuggestions, note, isSearch
   ▼
app/api/artwork/route.ts  ──►  iTunes Search API (server-side, cached) → 512×512 cover URL

- The API key is **server-side only** — it never reaches the browser bundle.
- Groq is called with `response_format: { type: "json_object" }` and explicit
  schema instructions for reliable structured output, with defensive parsing
  and friendly error states (quota, bad key, network).
- All app state is in-memory React Context — **no database, no localStorage**.

## 🧱 Tech stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · `groq-sdk` ·
`lucide-react` · Framer Motion · Montserrat (a free stand-in for Spotify's
proprietary Circular, wired as a single swappable token).

## ▶️ Run locally

🔗 **Live Demo:** [vibe-spotify-mvp.vercel.app](https://vibe-spotify-mvp.vercel.app/)

git clone https://github.com/kraken-ator/vibe-spotify-mvp.git
cd vibe-spotify-mvp
npm install
cp env.example .env.local          # PowerShell: Copy-Item env.example .env.local
# open .env.local and set GROQ_API_KEY=...   (get one at https://console.groq.com)
npm run dev                          # http://localhost:3000

## 📝 Notes

- No audio playback — play/pause/scrubber are visual only.
- Refreshing resets Liked Songs and Saved Vibes (in-memory state, by design).
- All personal/custom playlists are replaced with neutral Spotify editorial
  content for privacy.