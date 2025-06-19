export type Theme = 'light' | 'dark';

export const themes: Record<Theme, { background: string; foreground: string }> = {
  light: {
    background: '#ffffff',
    foreground: '#171717',
  },
  dark: {
    background: '#1a1a1a',
    foreground: '#f5f5f5',
  },
};

export const applyThemeColors = (theme: Theme) => {
  const colors = themes[theme];
  const root = document.documentElement;
  root.style.setProperty('--background', colors.background);
  root.style.setProperty('--foreground', colors.foreground);
  root.classList.toggle('dark', theme === 'dark');
};
