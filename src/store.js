// Single place to read and write the demo account. Production swaps these
// helpers for API calls; no component touches localStorage directly.

const KEYS = {
  user: "lk-user",
  profile: "lk-profile",
  connections: "lk-connections",
  order: "lk-last-order",
  sent: "lk-sent",
  cookies: "lk-cookies",
  theme: "lk-theme",
};

export function read(key, fallback = null) {
  try {
    const raw = localStorage.getItem(KEYS[key]);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function write(key, value) {
  try {
    localStorage.setItem(KEYS[key], JSON.stringify(value));
  } catch {
    /* storage full or blocked: the demo still works in memory */
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(KEYS[key]);
  } catch {
    /* nothing to do */
  }
}