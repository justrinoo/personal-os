import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";

// Plus Jakarta Sans carries body text (modern grotesque, excellent at
// small sizes); Space Grotesk gives headings a technical character that
// fits the deep-navy theme. Geist Mono stays for data and numbers.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Personal OS",
    template: "%s · Personal OS",
  },
  description: "Personal Engineering Operating System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Midnight Harbor is a dark-first theme; light tokens exist for a
    // future toggle.
    <html lang="en" className="dark">
      <body
        className={`${jakarta.variable} ${spaceGrotesk.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
