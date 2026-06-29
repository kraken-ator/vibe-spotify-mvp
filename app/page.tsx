"use client";

import { useApp } from "@/lib/AppContext";
import { PhoneFrame } from "@/components/PhoneFrame";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { SearchScreen } from "@/components/screens/SearchScreen";
import { LibraryScreen } from "@/components/screens/LibraryScreen";
import { LikedSongsScreen } from "@/components/screens/LikedSongsScreen";
import { NowPlayingScreen } from "@/components/screens/NowPlayingScreen";
import { VibeScreen } from "@/components/screens/VibeScreen";
import { BottomNav } from "@/components/BottomNav";
import { MiniPlayer } from "@/components/MiniPlayer";

export default function Page() {
  const { activeTab, vibeOpen, likedOpen, playerExpanded } = useApp();

  return (
    <PhoneFrame>
      {/* 1. Main Tabs (Base Layer) */}
      <div className="absolute inset-0 bg-[#121212] pb-[130px]">
        {activeTab === "home" && <HomeScreen />}
        {activeTab === "search" && <SearchScreen />}
        {activeTab === "library" && <LibraryScreen />}
      </div>

      {/* 2. Secondary Overlays */}
      {likedOpen && <LikedSongsScreen />}
      {vibeOpen && <VibeScreen />}

      {/* 3. Global Bottom UI (Always visible on all screens) */}
      <div className="absolute bottom-0 left-0 w-full z-50 bg-gradient-to-t from-[#121212] via-[#121212] to-transparent pointer-events-auto">
        <MiniPlayer />
        <BottomNav />
      </div>

      {/* 4. Full Screen Player (Top Layer - covers everything when expanded) */}
      {playerExpanded && <NowPlayingScreen />}
    </PhoneFrame>
  );
}