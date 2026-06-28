import type { ReactNode } from "react";

/** Centered iPhone-class device with a subtle bezel; the faux-app lives inside. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#0a0a0c] p-3 sm:p-6">
      {/* faint Spotify-green wash behind the device */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(30,215,96,0.10), transparent 70%)",
        }}
      />
      <div className="relative">
        <div className="rounded-[54px] bg-black p-[11px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9),0_0_0_2px_rgba(255,255,255,0.04)] ring-1 ring-white/5">
          <div className="relative h-[844px] w-[390px] overflow-hidden rounded-[44px] bg-base">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
