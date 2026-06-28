import { Montserrat } from "next/font/google";

/**
 * Single, swappable font token for the whole app.
 *
 * Spotify ships in "Circular," which is proprietary and can't be installed
 * freely. Montserrat is the closest free match. The entire app references the
 * `--font-app` CSS variable (wired into Tailwind's `--font-sans` in
 * globals.css), so dropping in a licensed Circular .woff2 later is a one-file
 * change: swap this for `next/font/local` pointing at the Circular files and
 * keep `variable: "--font-app"`.
 */
export const appFont = Montserrat({
  subsets: ["latin"],
  variable: "--font-app",
  display: "swap",
  // Montserrat is a variable font on Google Fonts — the full weight range
  // (400 regular → 900 black) is available without listing static weights.
});
