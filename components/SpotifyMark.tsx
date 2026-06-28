// Real Spotify glyph (the canonical circular logo path) + a wordmark lockup.

export function SpotifyGlyph({
  className = "",
  filled = false,
}: {
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? "currentColor" : "currentColor"}
      aria-hidden
    >
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.622.622 0 0 1-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.622.622 0 1 1-.277-1.215c3.809-.871 7.077-.496 9.712 1.115a.623.623 0 0 1 .207.857zm1.223-2.722a.78.78 0 0 1-1.072.257c-2.687-1.652-6.785-2.131-9.965-1.166A.78.78 0 1 1 6.34 11.3c3.632-1.102 8.147-.568 11.234 1.328a.78.78 0 0 1 .235 1.073zm.105-2.835C14.692 9.16 9.375 8.99 6.297 9.925a.935.935 0 1 1-.543-1.79c3.533-1.072 9.404-.865 13.115 1.338a.935.935 0 1 1-.95 1.614z" />
    </svg>
  );
}

export function SpotifyWordmark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <SpotifyGlyph className="h-7 w-7 text-white" />
      <span className="text-[22px] font-bold tracking-[-0.04em] text-white">
        Spotify
      </span>
    </div>
  );
}
