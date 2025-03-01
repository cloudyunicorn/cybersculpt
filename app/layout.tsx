// app/layout.tsx
import "@/app/globals.css";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "My Next.js 13 App",
  description: "An example Next.js 13 application with Tailwind CSS and theming",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark">
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
