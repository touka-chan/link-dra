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

const themeArg = process.argv.indexOf("--theme");
const theme = themeArg > -1 ? process.argv[themeArg + 1] : "dark";
const only = process.argv.find((a) => a.startsWith("--only="))?.split("=")[1];

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
          `--window-size=${w},${h}`,
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