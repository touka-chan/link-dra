// Theme store. Deliberately has no Provider component: a tiny external store read
// through useSyncExternalStore keeps this module free of React components, so
// fast refresh stays happy in files that also export components.

import { useSyncExternalStore } from "react";

const KEY = "lk-theme";
const listeners = new Set();

const read = () => {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    /* private mode - fall through to the system preference */
  }
  return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
};

let current = read();

// The whole palette is scoped to :root[data-theme], so a bare <html> has no
// --bg and no --panel at all - it is not "dark by default", it is undefined.
// The attribute therefore has to be on the element before the first paint. An
// effect cannot do this: the browser paints before any component mounts, which
// left the page rendering unthemed for one frame and any JS-driven ink
// calculation a frame out of step with the CSS behind it.
const paint = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.colorScheme = theme;
};

paint(current);

const apply = (theme) => {
  current = theme;
  paint(theme);
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* not fatal, the choice just won't survive a reload */
  }
  listeners.forEach((fn) => fn());
};

const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, () => current, () => "dark");
  return { theme, isDark: theme === "dark", setTheme: apply, toggle: () => apply(current === "dark" ? "light" : "dark") };
}