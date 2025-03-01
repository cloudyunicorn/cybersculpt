// app/layout.tsx
import "@/app/globals.css";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Cyber Sculpt",
  description: "A modern health and fitness app.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light">
          {/* Top-right theme toggle */}
          <div className="absolute top-6 right-6">
            <ThemeToggle />
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
