"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure the component only renders the toggle after the theme is known
  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid rendering UI before the theme is determined (hydration mismatch)
  if (!mounted) return null;

  return (
    <button
      aria-label="Toggle Dark Mode"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="p-2 rounded-md border border-gray-300 dark:border-gray-600
                 transition-colors text-gray-600 dark:text-gray-300
                 hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  );
}
