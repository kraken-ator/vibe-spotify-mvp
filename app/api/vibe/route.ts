import Groq from "groq-sdk";
import type { Track, VibeRequest, VibeResponse } from "@/lib/types";

export const runtime = "nodejs";

const VIBE_SYSTEM_INSTRUCTION = `You are the intent + curation engine for "Vibe," a music discovery feature.

Given a user's natural-language description (prompt mode) OR their recent listening history (infer mode), return ONLY a JSON object — no markdown, no preamble.

If mode === "infer":
1. Read the provided session history.
2. Infer the underlying vibe connecting these tracks. 
3. Generate 16-20 REAL, well-known songs that fit this inferred vibe. 
4. Generate 4-6 tailored steering suggestions.

If mode === "prompt":
1. Parse the prompt into structured intent.
2. Produce 16-20 REAL, well-known songs that fit. 
3. If a steeringAction + currentSet are provided, ADJUST the current set IN PLACE.

CRITICAL INSTRUCTION: You MUST return valid JSON matching this EXACT structure:
{
  "inferredLabel": "2-4 words (only if infer mode)",
  "confidence": "high or medium (only if infer mode)",
  "whyInferred": [{"title": "Song", "artist": "Artist", "reason": "Detailed explanation of why this song inspired the vibe (15-25 words)"}],
  "intent": {"mood": "", "energy": 3, "genres": [], "era": "", "referenceArtists": [], "exclusions": [], "context": ""},
  "tracks": [{"id": "slug", "title": "Song", "artist": "Artist", "album": "Album", "durationSec": 210, "reason": "Detailed reason why it fits (12-20 words)"}],
  "title": "Short Playlist Name",
  "whyThese": "Detailed explanation of the cohesive vibe (20-30 words)",
  "steeringSuggestions": [{"label": "Punchy Label", "action": "snake_case_action"}]
}`;

function buildUserMessage(body: VibeRequest): string {
  const { prompt, currentSet, steeringAction, seedTrack, familiarity, mode, sessionHistory } = body;
  let msg = "";

  if (mode === "infer") {
    msg = "Mode: INFER\n\nRecent Listening History:\n";
    if (sessionHistory && sessionHistory.length > 0) {
      msg += sessionHistory.map((t, i) => `${i + 1}. "${t.title}" by ${t.artist}`).join("\n");
    } else {
      msg += "(No history provided, make a best guess for a great default vibe.)\n";
    }
  } else {
    msg = `User prompt: "${prompt}"`;
  }

  if (seedTrack) {
    msg += `\n\nSeed track: "${seedTrack.title}" by ${seedTrack.artist}. Build the set around this seed's sound and feel.`;
  }

  if (typeof familiarity === "number") {
    msg += `\n\nFamiliarity dial: ${familiarity}/100. Bias selection accordingly (0=hits, 100=new/obscure).`;
  }

  if (steeringAction && currentSet && currentSet.length > 0) {
    msg += `\n\nSteering action: ${steeringAction}. Here is the CURRENT tracklist. 
    CRITICAL INSTRUCTION: You MUST keep at least 90% of these tracks exactly the same. 
    ONLY remove the specific track mentioned in the steering action and replace it with 1 or 2 new tracks. DO NOT generate a completely new list:\n`;
    msg += currentSet
      .map((t, i) => `${i + 1}. "${t.title}" — ${t.artist} (${t.album}) [${t.durationSec}s]`)
      .join("\n");
  }

  return msg;
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60);
}

function stripFences(text: string): string {
  const t = text.trim();
  if (t.startsWith("```")) {
    return t.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  }
  return t;
}

function normalize(raw: VibeResponse): VibeResponse {
  const tracks: Track[] = (raw.tracks ?? [])
    .filter((t) => t && t.title && t.artist)
    .map((t, i) => ({
      id: t.id?.trim() || slugify(`${t.title}-${t.artist}`) || `track-${i}`,
      title: t.title,
      artist: t.artist,
      album: t.album || "Single",
      durationSec: Math.min(360, Math.max(120, Math.round(Number(t.durationSec) || 210))),
      reason: t.reason || "",
    }));

  const seen = new Set<string>();
  for (const t of tracks) {
    let id = t.id;
    let n = 2;
    while (seen.has(id)) id = `${t.id}-${n++}`;
    t.id = id;
    seen.add(id);
  }

  const steeringSuggestions = Array.isArray(raw.steeringSuggestions)
    ? raw.steeringSuggestions
        .filter((s) => s && s.label && s.action)
        .slice(0, 8)
        .map((s) => ({
          label: String(s.label).slice(0, 24),
          action: String(s.action).slice(0, 40),
        }))
    : undefined;

  return {
    intent: raw.intent ?? { mood: "", energy: 3, genres: [], era: "", referenceArtists: [], exclusions: [], context: "" },
    tracks,
    title: (raw.title ?? "").toString().trim().slice(0, 40) || "Your Vibe",
    whyThese: raw.whyThese ?? "",
    note: raw.note,
    isSearch: raw.isSearch,
    steeringSuggestions,
    inferredLabel: raw.inferredLabel,
    confidence: raw.confidence,
    whyInferred: raw.whyInferred,
  };
}

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    return Response.json({ error: "Missing GROQ_API_KEY in .env.local" }, { status: 500 });
  }

  let body: VibeRequest;
  try {
    body = (await req.json()) as VibeRequest;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (body.mode !== "infer" && (!body.prompt || !body.prompt.trim())) {
    return Response.json({ error: "Prompt is required." }, { status: 400 });
  }

  try {
    const groq = new Groq({ apiKey });
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: VIBE_SYSTEM_INSTRUCTION },
        { role: "user", content: buildUserMessage(body) }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      response_format: { type: "json_object" }, 
    });

    const text = chatCompletion.choices[0]?.message?.content;
    if (!text) return Response.json({ error: "The model returned an empty response. Try again." }, { status: 502 });

    let parsed: VibeResponse;
    try {
      parsed = JSON.parse(text) as VibeResponse;
    } catch {
      try {
        parsed = JSON.parse(stripFences(text)) as VibeResponse;
      } catch {
        return Response.json({ error: "The model returned malformed JSON. Try again." }, { status: 502 });
      }
    }

    const normalized = normalize(parsed);
    if (normalized.tracks.length === 0) return Response.json({ error: "No tracks came back. Try rephrasing your vibe." }, { status: 502 });

    return Response.json(normalized);
  } catch (e) {
    console.error("=== GROQ API CRASHED ===", e);
    const message = e instanceof Error ? e.message : String(e);
    
    if (/429|quota|exhausted|rate.?limit|resource_exhausted/i.test(message)) {
      return Response.json({ 
        error: "API Limit Reached: The AI is catching its breath! Please wait a few seconds." 
      }, { status: 429 });
    }
    
    if (/503|high demand|unavailable|overloaded/i.test(message)) {
      return Response.json({ 
        error: "Servers are experiencing high demand right now. Please try clicking again in a few seconds!" 
      }, { status: 503 });
    }

    return Response.json({ error: "Couldn't update the set — try again in a moment." }, { status: 500 });
  }
}