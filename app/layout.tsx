import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "UXterity — AI Design Copilot",
  description:
    "Upload any UI screenshot and receive an expert-level UX audit powered by local AI models. Privacy-first design intelligence.",
  keywords: ["UX audit", "AI design", "design intelligence", "accessibility", "usability"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-[#0a0a0f] text-[#f0f0ff] antialiased">
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-64 -left-64 w-[600px] h-[600px] rounded-full bg-purple-900/20 blur-[120px]" />
          <div className="absolute -bottom-64 -right-64 w-[600px] h-[600px] rounded-full bg-blue-900/20 blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-purple-950/10 blur-[160px]" />
        </div>
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
