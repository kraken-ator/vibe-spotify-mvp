import type { NextRequest } from "next/server";

// Server-side iTunes Search proxy (avoids browser CORS) with an in-memory
// cache keyed per track. Returns a crisp 512x512 artwork URL or null on miss.
const cache = new Map<string, string | null>();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const artist = (searchParams.get("artist") ?? "").trim();
  const title = (searchParams.get("title") ?? "").trim();

  if (!artist && !title) {
    return Response.json({ artworkUrl: null });
  }

  const key = `${artist.toLowerCase()}|${title.toLowerCase()}`;
  if (cache.has(key)) {
    return Response.json({ artworkUrl: cache.get(key) ?? null });
  }

  try {
    const term = encodeURIComponent(`${artist} ${title}`.trim());
    const res = await fetch(
      `https://itunes.apple.com/search?term=${term}&entity=song&limit=1`,
      {
        headers: { Accept: "application/json" },
        // small server timeout so a slow lookup never blocks the UI long
        signal: AbortSignal.timeout(6000),
      },
    );
    if (!res.ok) {
      cache.set(key, null);
      return Response.json({ artworkUrl: null });
    }
    const data = (await res.json()) as {
      results?: { artworkUrl100?: string }[];
    };
    const raw = data.results?.[0]?.artworkUrl100;
    const url = raw ? raw.replace("100x100", "512x512") : null;
    cache.set(key, url);
    return Response.json({ artworkUrl: url });
  } catch {
    cache.set(key, null);
    return Response.json({ artworkUrl: null });
  }
}
