import { GoogleGenAI, Type } from "@google/genai";
import { GEMINI_MODEL } from "@/lib/config";
import type { Track, VibeRequest, VibeResponse } from "@/lib/types";

export const runtime = "nodejs";

const VIBE_SYSTEM_INSTRUCTION = `You are the intent + curation engine for "Vibe," a music discovery feature.
Given a user's natural-language description of what they want to hear (and optionally a current tracklist plus a steering action), return ONLY a JSON object — no markdown, no preamble.

Do this:
1. Parse the prompt into structured intent: mood, energy (1-5), genres, era, referenceArtists, exclusions, context/activity.
2. Produce 16–20 REAL, well-known songs that fit, using real artists and track titles you know. Respect exclusions. Aim for a coherent set that matches the vibe, with some variety.
3. If a steeringAction + currentSet are provided, ADJUST the current set in place: keep tracks that still fit, replace only those that don't, and re-bias toward the action. Do not start over from scratch.
4. Edge cases:
   - Vague prompt ("good music"): pick a sensible interpretation and explain it briefly in "note".
   - Contradictory prompt ("calm but high energy"): make a reasonable choice and name the tension in "note".
   - Niche/empty ("Mongolian throat-singing lo-fi"): return the closest real matches; never return an empty list.
   - If the prompt is actually a direct search for one song/artist ("play Bohemian Rhapsody"): set "isSearch": true and return that song/those songs.
   - "note" is ONLY for when the user's natural-language prompt itself is vague, contradictory, or very niche. NEVER use "note" to explain, justify, or narrate a steeringAction, the familiarity dial, or your internal reasoning. When a steeringAction is provided, leave "note" empty unless the original prompt itself warranted one. The familiarity value is authoritative — just follow it silently.
5. Each track needs: id (slug), title, artist, album, durationSec (realistic 120–360), reason (<=8 words on why it fits).
6. whyThese: one sentence (<=18 words) summarizing the match.
6b. title: a short, catchy playlist name (2–4 words, Title Case, no quotes or emoji) that captures the vibe from the prompt's context — e.g. "Late Night Drive", "Gym Beast Mode", "Pretty Heartbreak", "Focus Deep". Not a literal echo of the prompt.
7. steeringSuggestions: 4–6 short, TAILORED one-tap steering chips specific to THIS vibe — mood/energy/genre/era tweaks that actually make sense for this prompt, never a generic boilerplate list. Each has: label (<=3 words, punchy, e.g. "Even harder", "More melodic", "Less EDM", "Warmer", "More 80s", "Dreamier") and action (a short snake_case directive the engine will receive verbatim next turn, e.g. "even_harder", "more_melodic"). Do NOT include a "more like this" chip or a familiarity control — those are handled separately by the app.
Return valid JSON only.`;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    intent: {
      type: Type.OBJECT,
      properties: {
        mood: { type: Type.STRING },
        energy: { type: Type.NUMBER },
        genres: { type: Type.ARRAY, items: { type: Type.STRING } },
        era: { type: Type.STRING },
        referenceArtists: { type: Type.ARRAY, items: { type: Type.STRING } },
        exclusions: { type: Type.ARRAY, items: { type: Type.STRING } },
        context: { type: Type.STRING },
      },
      required: [
        "mood",
        "energy",
        "genres",
        "era",
        "referenceArtists",
        "exclusions",
        "context",
      ],
    },
    tracks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          artist: { type: Type.STRING },
          album: { type: Type.STRING },
          durationSec: { type: Type.NUMBER },
          reason: { type: Type.STRING },
        },
        required: ["id", "title", "artist", "album", "durationSec", "reason"],
      },
    },
    title: { type: Type.STRING },
    whyThese: { type: Type.STRING },
    note: { type: Type.STRING },
    isSearch: { type: Type.BOOLEAN },
    steeringSuggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING },
          action: { type: Type.STRING },
        },
        required: ["label", "action"],
      },
    },
  },
  required: ["intent", "tracks", "title", "whyThese", "steeringSuggestions"],
};

function buildUserMessage(body: VibeRequest): string {
  const { prompt, currentSet, steeringAction, seedTrack, familiarity } = body;
  let msg = `User prompt: "${prompt}"`;

  if (seedTrack) {
    msg += `\n\nThis Vibe was launched from a now-playing track the listener wants to steer around. Seed track: "${seedTrack.title}" by ${seedTrack.artist}. Build the set around this seed's sound and feel.`;
  }

  if (typeof familiarity === "number") {
    msg += `\n\nFamiliarity dial: ${familiarity}/100. 0 = very familiar (popular hits + deeper cuts from artists the listener already loves); 100 = mostly new / lesser-known artists they likely haven't heard. Bias selection accordingly.`;
  }

  if (steeringAction && currentSet && currentSet.length > 0) {
    msg += `\n\nSteering action: ${steeringAction}. Here is the CURRENT tracklist. Adjust it IN PLACE — keep the tracks that still fit, replace only the ones that don't, and re-bias the set toward this action. Do NOT start over:\n`;
    msg += currentSet
      .map(
        (t, i) =>
          `${i + 1}. "${t.title}" — ${t.artist} (${t.album}) [${t.durationSec}s]`,
      )
      .join("\n");
  }

  return msg;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

/** Strip stray ``` fences if the model ignored responseMimeType. */
function stripFences(text: string): string {
  const t = text.trim();
  if (t.startsWith("```")) {
    return t
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();
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
      durationSec: Math.min(
        360,
        Math.max(120, Math.round(Number(t.durationSec) || 210)),
      ),
      reason: t.reason || "",
    }));

  // de-dupe ids defensively
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
    intent: raw.intent ?? {
      mood: "",
      energy: 3,
      genres: [],
      era: "",
      referenceArtists: [],
      exclusions: [],
      context: "",
    },
    tracks,
    title: (raw.title ?? "").toString().trim().slice(0, 40) || "Your Vibe",
    whyThese: raw.whyThese ?? "",
    note: raw.note,
    isSearch: raw.isSearch,
    steeringSuggestions,
  };
}

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    return Response.json(
      {
        error:
          "Missing GEMINI_API_KEY. Add it to vibe-app/.env.local and restart the dev server.",
      },
      { status: 500 },
    );
  }

  let body: VibeRequest;
  try {
    body = (await req.json()) as VibeRequest;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.prompt || !body.prompt.trim()) {
    return Response.json({ error: "Prompt is required." }, { status: 400 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const res = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: buildUserMessage(body),
      config: {
        systemInstruction: VIBE_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0.9,
      },
    });

    const text = res.text;
    if (!text) {
      return Response.json(
        { error: "The model returned an empty response. Try again." },
        { status: 502 },
      );
    }

    let parsed: VibeResponse;
    try {
      parsed = JSON.parse(text) as VibeResponse;
    } catch {
      try {
        parsed = JSON.parse(stripFences(text)) as VibeResponse;
      } catch {
        return Response.json(
          { error: "The model returned malformed JSON. Try again." },
          { status: 502 },
        );
      }
    }

    const normalized = normalize(parsed);
    if (normalized.tracks.length === 0) {
      return Response.json(
        { error: "No tracks came back. Try rephrasing your vibe." },
        { status: 502 },
      );
    }

    return Response.json(normalized);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    let friendly: string;
    if (/429|quota|exhausted|rate.?limit|resource_exhausted/i.test(message)) {
      friendly =
        "You've hit the Gemini free-tier limit for this model today. Wait a bit and retry, switch GEMINI_MODEL in .env.local, or enable billing on your key.";
    } else if (
      /api[_ ]?key|permission|unauthenticated|invalid argument|400|403/i.test(
        message,
      )
    ) {
      friendly =
        "Gemini rejected the request — check GEMINI_API_KEY in vibe-app/.env.local, then restart the dev server.";
    } else {
      friendly =
        "Couldn't reach the Vibe engine. Check your connection and try again.";
    }
    return Response.json({ error: friendly }, { status: 500 });
  }
}
