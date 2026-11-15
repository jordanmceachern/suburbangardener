export type ThemeMode = "light" | "dark";

export const THEME_STORAGE_KEY = "suburban-gardener-theme";

export function normalizeThemeMode(value: unknown): ThemeMode | null {
  if (value === "dark" || value === "light") {
    return value;
  }

  return null;
}

export function getSystemThemePreference(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  const mediaQuery = window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;

  return mediaQuery?.matches ? "dark" : "light";
}

export function resolveInitialTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = normalizeThemeMode(
    window.localStorage.getItem(THEME_STORAGE_KEY)
  );

  return savedTheme ?? getSystemThemePreference();
}

export function applyThemeMode(
  mode: ThemeMode,
  root = document.documentElement
) {
  root.classList.toggle("dark", mode === "dark");
  root.dataset.theme = mode;
}
