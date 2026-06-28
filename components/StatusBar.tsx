// iOS-style status bar. Always white text, sits above all screens/overlays.
// Pointer-events disabled so it never blocks taps on the UI beneath it.

export const STATUS_BAR_H = 44;

export function StatusBar() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-[60] flex items-center justify-between px-7"
      style={{ height: STATUS_BAR_H }}
    >
      <span className="text-[15px] font-semibold tracking-tight text-white tabular-nums">
        9:41
      </span>

      <div className="flex items-center gap-[6px]">
        {/* cellular */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden>
          <rect x="0" y="8" width="3" height="4" rx="1" fill="white" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="white" />
          <rect x="10" y="3" width="3" height="9" rx="1" fill="white" />
          <rect x="15" y="0.5" width="3" height="11.5" rx="1" fill="white" />
        </svg>

        {/* wifi */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="white" aria-hidden>
          <path d="M8.5 1.2c2.93 0 5.6 1.13 7.6 2.98.22.2.23.55.02.76l-1.06 1.06a.53.53 0 0 1-.74.01A8.4 8.4 0 0 0 8.5 3.78a8.4 8.4 0 0 0-5.82 2.23.53.53 0 0 1-.74-.01L.88 4.94a.54.54 0 0 1 .02-.76A11.16 11.16 0 0 1 8.5 1.2Z" />
          <path d="M8.5 5.5c1.62 0 3.1.6 4.23 1.6.23.2.24.55.03.77l-1.1 1.1a.52.52 0 0 1-.72.02 3.66 3.66 0 0 0-4.94 0 .52.52 0 0 1-.72-.02l-1.1-1.1a.54.54 0 0 1 .03-.77A6.37 6.37 0 0 1 8.5 5.5Z" />
          <path d="M8.5 9.2c.74 0 1.42.27 1.94.71.24.2.26.57.04.8l-1.6 1.62a.53.53 0 0 1-.76 0L6.52 10.7a.54.54 0 0 1 .04-.8c.52-.43 1.2-.7 1.94-.7Z" />
        </svg>

        {/* battery (charging, ~80%) */}
        <div className="flex items-center">
          <div className="relative h-[12px] w-[24px] rounded-[3px] border border-white/40">
            <div
              className="absolute inset-y-[1.5px] left-[1.5px] rounded-[1.5px] bg-[#34c759]"
              style={{ width: "16px" }}
            />
            {/* charging bolt */}
            <svg
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              width="7"
              height="9"
              viewBox="0 0 7 9"
              fill="white"
              aria-hidden
            >
              <path d="M4 0 0 5h2.4L3 9 7 3.5H4.4L4 0Z" />
            </svg>
          </div>
          <div className="ml-[1px] h-[4px] w-[1.5px] rounded-r-full bg-white/40" />
        </div>
      </div>
    </div>
  );
}
