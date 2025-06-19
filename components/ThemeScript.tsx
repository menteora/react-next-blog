"use client";
import React from "react";
import { themes } from "../utils/themes";

const ThemeScript: React.FC = () => {
  const code = `(() => {
    try {
      const stored = localStorage.getItem('theme') as Theme | null;
      const theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const colors = ${JSON.stringify(themes)}[theme];
      const root = document.documentElement;
      root.style.setProperty('--background', colors.background);
      root.style.setProperty('--foreground', colors.foreground);
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    } catch (e) {}
  })()`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
};

export default ThemeScript;
