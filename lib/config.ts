/**
 * Single source of truth for the Gemini model id.
 * Swap via the GEMINI_MODEL env var or by editing this constant.
 * Referenced server-side only (in app/api/vibe/route.ts).
 *
 * Using flash-lite: it has the largest free-tier daily quota of the Gemini
 * models and still supports structured JSON output. Free-tier quotas are
 * per-project-per-model, so this also has its own bucket separate from
 * gemini-2.5-flash. Override anytime with the GEMINI_MODEL env var
 * (e.g. "gemini-2.5-flash" for higher quality, or "gemini-flash-lite-latest").
 */
export const GEMINI_MODEL =
  process.env.GEMINI_MODEL ?? "gemini-2.5-flash-lite";
