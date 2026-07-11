import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";

// FitFlow (DESIGN.md): Inter carries both display and body roles —
// single-family rhythm, weights 400–700 only. JetBrains Mono handles
// code, metrics, and tabular data.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
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
    // FitFlow is light-first (warm beige); dark mode is the Warm
    // Inversion, available for a future toggle.
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
