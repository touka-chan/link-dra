// Proves the tokenisation was value-preserving: compares the computed px value
// of every spacing declaration before and after, by resolving var() through the
// token definitions. Run against the committed version vs the working tree.

import fs from "node:fs";
import { execSync } from "node:child_process";

const current = fs.readFileSync("src/index.css", "utf8");
const original = execSync("git show HEAD:src/index.css", { encoding: "utf8" });

// Resolve token names to px from the :root block.
const tokens = {};
for (const m of current.matchAll(/(--[\w-]+):\s*(\d+)px;/g)) tokens[m[1]] = m[2];

function resolve(value) {
  return value
    .replace(/var\((--[\w-]+)\)/g, (whole, name) => {
      if (!tokens[name]) throw new Error(`unknown token ${name}`);
      return `${tokens[name]}px`;
    })
    .replace(/\s+/g, " ")
    .trim();
}

const DECL = /((?:padding|margin|gap)(?:-(?:top|right|bottom|left|block|inline))?)\s*:\s*([^;{}]+)(;)/g;
const collect = (src) => {
  const out = [];
  for (const m of src.matchAll(DECL)) {
    let value;
    try {
      value = resolve(m[2]);
    } catch {
      continue; // a pre-existing var() we did not touch
    }
    if (/\d/.test(value)) out.push(`${m[1]}: ${value}`);
  }
  return out;
};

const before = collect(original);
const after = collect(current);

console.log(`declarations compared : ${before.length} before / ${after.length} after`);
if (before.length !== after.length) {
  console.error("MISMATCH: declaration count changed - aborting.");
  process.exit(1);
}

const diffs = [];
for (let i = 0; i < before.length; i++) {
  if (before[i] !== after[i]) diffs.push({ line: i + 1, before: before[i], after: after[i] });
}

if (diffs.length === 0) {
  console.log("PASS - every spacing declaration resolves to an identical value.");
} else {
  console.error(`FAIL - ${diffs.length} declarations changed value:`);
  diffs.slice(0, 20).forEach((d) => console.error(`  #${d.line}  ${d.before}  ->  ${d.after}`));
  process.exit(1);
}