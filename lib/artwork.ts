// Client-side album-art fetching with an in-memory cache + request dedupe.
// The actual iTunes lookup happens server-side in /api/artwork (avoids CORS);
// this just calls that route and remembers the result for the session.

const cache = new Map<string, string | null>();
const inflight = new Map<string, Promise<string | null>>();

const keyOf = (artist: string, title: string) =>
  `${artist.trim().toLowerCase()}|${title.trim().toLowerCase()}`;

/** Synchronous peek — returns the URL, null (known miss), or undefined (unknown). */
export function peekArtwork(
  artist: string,
  title: string,
): string | null | undefined {
  return cache.get(keyOf(artist, title));
}

export async function fetchArtwork(
  artist: string,
  title: string,
): Promise<string | null> {
  const key = keyOf(artist, title);
  if (cache.has(key)) return cache.get(key) ?? null;
  const existing = inflight.get(key);
  if (existing) return existing;

  const p = (async (): Promise<string | null> => {
    try {
      const res = await fetch(
        `/api/artwork?artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(
          title,
        )}`,
      );
      if (!res.ok) {
        cache.set(key, null);
        return null;
      }
      const data = (await res.json()) as { artworkUrl?: string | null };
      const url = data?.artworkUrl ?? null;
      cache.set(key, url);
      return url;
    } catch {
      cache.set(key, null);
      return null;
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, p);
  return p;
}
