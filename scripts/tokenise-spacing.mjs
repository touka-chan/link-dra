// Replaces literal px values in spacing properties with scale tokens.
//
// Zero visual change: every token holds the exact value it replaces, so this is
// tokenisation rather than restyling. Only padding, margin and gap are touched;
// radii, font sizes, borders, widths, heights and transforms are left alone.
//
//   node scripts/tokenise-spacing.mjs            (dry run, prints a summary)
//   node scripts/tokenise-spacing.mjs --write    (applies)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.join(root, "src", "index.css");
const write = process.argv.includes("--write");

// 1px and 2px are deliberately absent: the scale starts at 4px, so mapping them
// onto --sp-1/--sp-2 would quadruple every hairline border.
const TOKENS = {
  "4px": "--sp-1", "8px": "--sp-2", "12px": "--sp-3", "16px": "--sp-4",
  "24px": "--sp-5", "32px": "--sp-6", "48px": "--sp-7", "64px": "--sp-8",
  "80px": "--sp-9", "96px": "--sp-10", "112px": "--sp-11", "128px": "--sp-12",
  "6px": "--in-1", "10px": "--in-2", "14px": "--in-3", "18px": "--in-4",
  "22px": "--in-5",
};

const source = fs.readFileSync(file, "utf8");
const counts = new Map();
const skipped = new Map();
let matched = 0;

const replaced = source.replace(
  /((?:padding|margin|gap)(?:-(?:top|right|bottom|left|block|inline))?)\s*:\s*([^;{}]+)(;)/g,
  (match, head, value, tail) => {
    matched++;
    const next = value.replace(/\d+px/g, (px) => {
      const token = TOKENS[px];
      if (!token) {
        if (px !== "0px") skipped.set(px, (skipped.get(px) ?? 0) + 1);
        return px;
      }
      counts.set(token, (counts.get(token) ?? 0) + 1);
      return `var(${token})`;
    });
    return next === value ? match : `${head}: ${next}${tail}`;
  }
);

const total = [...counts.values()].reduce((a, b) => a + b, 0);
const left = [...skipped.values()].reduce((a, b) => a + b, 0);

console.log(`Scanned ${matched} spacing declarations`);
console.log(`${write ? "Replacing" : "Would replace"} ${total} literal values\n`);

[...counts.entries()]
  .sort((a, b) => a[0].localeCompare(b[0]))
  .forEach(([k, v]) => console.log(`  var(${k.padEnd(8)}) x${v}`));

if (left) {
  console.log(`\nLeft as literals (no token defined, so no visual change): ${left}`);
  [...skipped.entries()]
    .sort((a, b) => b[1] - a[1])
    .forEach(([k, v]) => console.log(`  ${k.padEnd(6)} x${v}`));
}

if (matched === 0) {
  console.error("\nNo spacing declarations matched - aborting without writing.");
  process.exit(1);
}

if (write) {
  fs.writeFileSync(file, replaced, "utf8");
  console.log(`\nSaved ${path.relative(root, file)}`);
}