"use client";

import { useApp } from "@/lib/AppContext";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";
import { BottomNav } from "@/components/BottomNav";
import { MiniPlayer } from "@/components/MiniPlayer";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { SearchScreen } from "@/components/screens/SearchScreen";
import { LibraryScreen } from "@/components/screens/LibraryScreen";
import { NowPlayingScreen } from "@/components/screens/NowPlayingScreen";
import { VibeScreen } from "@/components/screens/VibeScreen";
import { LikedSongsScreen } from "@/components/screens/LikedSongsScreen";

export default function Page() {
  const { activeTab, nowPlaying, playerExpanded, vibeOpen, likedOpen } =
    useApp();

  return (
    <PhoneFrame>
      {/* base layer: active tab + bottom chrome */}
      <div className="absolute inset-0 flex flex-col">
        <div className="relative flex-1 overflow-hidden">
          {activeTab === "home" && <HomeScreen />}
          {activeTab === "search" && <SearchScreen />}
          {activeTab === "library" && <LibraryScreen />}
        </div>
        {nowPlaying && <MiniPlayer />}
        <BottomNav />
      </div>

      {/* overlays */}
      {likedOpen && <LikedSongsScreen />}
      {vibeOpen && <VibeScreen />}
      {playerExpanded && <NowPlayingScreen />}

      {/* status bar floats above everything */}
      <StatusBar />
    </PhoneFrame>
  );
}
