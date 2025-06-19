"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { applyThemeColors, Theme } from "../utils/themes";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) {
      setTheme(stored);
      applyThemeColors(stored);
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const systemPref: Theme = mediaQuery.matches ? "dark" : "light";
    setTheme(systemPref);
    applyThemeColors(systemPref);

    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme: Theme = e.matches ? "dark" : "light";
      setTheme(newTheme);
      applyThemeColors(newTheme);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    applyThemeColors(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
};
