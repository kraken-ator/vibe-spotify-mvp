"use client";

import { Home, Search, Library } from "lucide-react";
import { useApp } from "@/lib/AppContext";
import type { Tab } from "@/lib/types";

const ITEMS: {
  tab: Tab;
  label: string;
  icon: (active: boolean) => React.ReactNode;
}[] = [
  {
    tab: "home",
    label: "Home",
    icon: (a) => (
      <Home className="h-6 w-6" fill={a ? "currentColor" : "none"} strokeWidth={a ? 1.5 : 2} />
    ),
  },
  {
    tab: "search",
    label: "Search",
    icon: (a) => <Search className="h-6 w-6" strokeWidth={a ? 3 : 2.25} />,
  },
  {
    tab: "library",
    label: "Your Library",
    icon: (a) => (
      <Library className="h-6 w-6" strokeWidth={a ? 2.5 : 2} />
    ),
  },
];

export function BottomNav() {
  const { activeTab, setActiveTab, closeVibe } = useApp();

  return (
    <nav className="relative z-20 flex items-stretch justify-around bg-gradient-to-t from-black via-black to-black/95 pb-5 pt-2">
      {ITEMS.map((item) => {
        const active = activeTab === item.tab;
        return (
          <button
            key={item.tab}
            onClick={() => {
              setActiveTab(item.tab);
              closeVibe();
            }}
            className="flex flex-1 flex-col items-center gap-1 outline-none"
          >
            <span className={active ? "text-white" : "text-[#a7a7a7]"}>
              {item.icon(active)}
            </span>
            <span
              className={`text-[10px] leading-none ${
                active ? "font-medium text-white" : "text-[#a7a7a7]"
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
