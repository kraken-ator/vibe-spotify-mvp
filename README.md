# 🎵 Vibe — a Spotify Discovery Concept

**Describe the music you want in your own words, then steer it in real time.**

Vibe turns discovery from something *pushed* at you into a short, low-effort, controllable loop. You type a vibe (or let it infer one from your history), get a real tracklist, and nudge it — *more energy, less sad, more like this, familiar ↔ new* — until it's right.

A high-fidelity, pixel-accurate Spotify mobile prototype (dark mode) built as a product case study. Real AI powers the core (Groq Llama 3); real cover art comes from the iTunes Search API. No audio plays — transport controls are visual only.

> ⚠️ Private, non-commercial case study. Uses Spotify's real styling and logo for fidelity. Not affiliated with Spotify.

---

## ✨ What It Does

### Prompted or Inferred → A Real Set

Groq parses your prompt into structured intent or reads your recent listening history to infer the vibe. It returns 16–20 real songs, each with a detailed multi-sentence explanation of why it fits.

### Real-Time Steering — The Heart of the Feature

One-tap chips and a Familiarity dial re-call the AI and adjust the set *in place* (keep what fits, replace what doesn't) instead of regenerating from scratch.

### Tailored Steering Chips

Ask for:

- **"gym, aggressive, no EDM"**
  - Heavier Metal
  - More Rap
  - Industrial Edge

- **"heartbreak but pretty"**
  - Dreamier Vocals
  - More Indie Folk

### "Adjust This Vibe" from Now Playing

When a recommendation misses, the steering lever is right there — it opens Vibe pre-seeded from the current track.

### Save & Manage Playlists

- Heart individual tracks to **Liked Songs**
- Save an entire set as a named **Vibe**
- Edit an existing Vibe and choose to:
  - Update the existing playlist (with a fresh AI-generated name)
  - Save a completely new playlist

### Graceful Edge Cases

Vague, contradictory, niche, and accidental search prompts are handled gracefully.

Includes:

- Loading shimmers
- Retry states
- Error handling
- Artwork fallbacks
- Friendly empty states

---

## 🧭 Where Vibe Lives

| Surface | Entry Point |
|--------|-------------|
| **Home** | "Start a Vibe" card |
| **Search** | "or describe a vibe…" input |
| **Now Playing** | "Adjust this vibe" |

Saved Vibes and Liked Songs live inside **Your Library**.

---

## 🏗️ Architecture

```text
Browser (React shell)
   │
   │ POST /api/vibe
   │ { mode, prompt, currentSet?, steeringAction?,
   │   seedTrack?, sessionHistory? }
   ▼
app/api/vibe/route.ts
   │
   ├── Groq (llama-3.3-70b-versatile)
   │
   │ structured JSON:
   │ - intent
   │ - tracks
   │ - title
   │ - whyThese
   │ - steeringSuggestions
   │ - note
   │ - isSearch
   ▼
app/api/artwork/route.ts
   │
   └── iTunes Search API
         ↓
      512×512 artwork URL
```

---

## ⚙️ Implementation Details

- API keys remain **server-side only**
- Groq uses:

```ts
response_format: {
  type: "json_object"
}
```

- Explicit schema instructions ensure reliable structured output
- Defensive parsing handles:
  - Quota limits
  - Invalid keys
  - Network failures
- All state is stored in React Context

> No database.  
> No localStorage.  
> Everything is intentionally ephemeral.

---

## 🧱 Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- groq-sdk
- Framer Motion
- lucide-react
- React Context API
- Montserrat font

Montserrat acts as a free stand-in for Spotify's proprietary Circular font and is wired as a single design token for easy swapping.

---

## 📱 Screens

- Home
- Search
- Vibe Generation
- Real-Time Steering
- Now Playing
- Liked Songs
- Saved Vibes
- Playlist Update Flow

---

## ▶️ Live Demo

**Live Demo:** https://vibe-spotify-mvp.vercel.app/

---

## 🚀 Run Locally

```bash
git clone https://github.com/kraken-ator/vibe-spotify-mvp.git

cd vibe-spotify-mvp

npm install

# macOS / Linux
cp env.example .env.local

# PowerShell
Copy-Item env.example .env.local
```

Open `.env.local`:

```env
GROQ_API_KEY=your_key_here
```

Get a Groq API key:

https://console.groq.com

Start the development server:

```bash
npm run dev
```

Visit:

```text
http://localhost:3000
```

---

## 💡 Example Prompts

- "Late-night city driving in the rain"
- "Gym music, aggressive, no EDM"
- "Heartbreak but make it beautiful"
- "Songs that feel like leaving home"
- "Indie music for studying at 2am"
- "Summer road trip with friends"

---

## 📝 Notes

- Audio playback is not implemented.
- Play, pause, scrubber, and transport controls are visual only.
- Refreshing clears:
  - Liked Songs
  - Saved Vibes
- State is intentionally in-memory.
- All personal playlists and listening history shown in the prototype have been replaced with neutral Spotify editorial content for privacy.

---

## ⚠️ Disclaimer

This project is a private, non-commercial product case study created for design and product exploration purposes.

Spotify branding, styling, and visual language are used solely to achieve interface fidelity.

This project is **not affiliated with, endorsed by, or associated with Spotify.**
