// Full-page screenshots at real viewport widths, via headless Chrome.
//
// This exists because the in-app browser panel renders narrower than the viewport
// it is asked for, so vw-based type and media queries could not be checked there.
// Headless Chrome honours --window-size exactly.
//
//   node scripts/shots.mjs [--theme dark|light]

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, ".shots");
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const base = "http://localhost:5173/";

// Accepts both --theme=light and --theme light.
const flag = (name) => {
  const inline = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (inline) return inline.split("=").slice(1).join("=");
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
};
const theme = flag("theme") ?? "dark";
const only = flag("only");

const ROUTES = [
  ["home", ""],
  ["how", "#/how-it-works"],
  ["features", "#/features"],
  ["pricing", "#/pricing"],
  ["order", "#/order"],
  ["login", "#/login"],
  ["dashboard", "#/dashboard"],
  ["profile", "#/c/john"],
  ["help", "#/help-center"],
  ["faq", "#/faq"],
  ["about", "#/about"],
  ["teams", "#/teams"],
  ["contact", "#/contact"],
  ["coming-soon", "#/coming-soon"],
  ["privacy", "#/legal/privacy"],
];

const WIDTHS = [
  ["desktop", 1440, 1000],
  ["tablet", 768, 1024],
  ["mobile", 390, 844],
];

// Chrome on Windows refuses window widths below roughly 500px: it lays out
// wider than asked and still writes the smaller image, so the capture is
// cropped rather than showing a real phone. That reads exactly like a layout
// overflow and sent me chasing a CSS bug that does not exist. Doubling the
// window and the device scale factor halves the CSS viewport instead, which
// Chrome honours, so the capture shows what a real phone shows.
const MIN_WINDOW = 520;
const scaleFor = (w) => (w < MIN_WINDOW ? 2 : 1);

fs.mkdirSync(outDir, { recursive: true });

// The theme lives in localStorage, falling back to prefers-color-scheme, so
// both have to be pinned or the sweep silently captures whatever the OS says.
// A profile per theme keeps the two runs from overwriting each other's choice.
const seed = `--user-data-dir=${path.join(outDir, `.profile-${theme}`)}`;
const scheme = `--blink-settings=preferredColorScheme=${theme === "dark" ? 0 : 1}`;

let shots = 0;
for (const [name, hash] of ROUTES) {
  if (only && name !== only) continue;
  for (const [label, w, h] of WIDTHS) {
    const scale = scaleFor(w);
    const file = path.join(outDir, `${name}-${label}-${theme}.png`);
    try {
      execFileSync(
        CHROME,
        [
          "--headless=new",
          "--disable-gpu",
          "--hide-scrollbars",
          "--no-first-run",
          "--no-default-browser-check",
          `--window-size=${w * scale},${h * scale}`,
          `--force-device-scale-factor=${scale}`,
          seed,
          scheme,
          `--screenshot=${file}`,
          // eslint-disable-next-line no-template-curly-in-string
          `${base}#${hash.replace("#", "")}`,
        ],
        { stdio: "pipe", timeout: 45000 }
      );
      if (fs.existsSync(file)) {
        shots++;
        process.stdout.write(`  ${name} @ ${label}\n`);
      }
    } catch (e) {
      process.stdout.write(`  ${name} @ ${label} FAILED: ${String(e.message).slice(0, 90)}\n`);
    }
  }
}
console.log(`\n${shots} screenshots written to ${path.relative(root, outDir)} (theme: ${theme})`);