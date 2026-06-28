import type { Metadata, Viewport } from "next";
import { appFont } from "@/lib/fonts";
import { AppProvider } from "@/lib/AppContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vibe — Spotify",
  description:
    "Vibe — describe the music you want and steer it in real time. A Spotify discovery concept.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${appFont.variable} h-full`}>
      <body className="min-h-full antialiased">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
