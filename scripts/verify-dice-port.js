#!/usr/bin/env node
/* Parity gate: the JS port (dice-engine.js) must reproduce engine.py v0.3
   byte for byte — same JSON draw, same raw manifest text, same hash.
   Usage: node scripts/verify-dice-port.js
   Needs the Python reference (default ~/framework/engine.py, override with
   DICE_ENGINE=...). Exits 1 on any mismatch. */
"use strict";
const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const DICE = require(path.join(__dirname, "..", "dice-engine.js"));

const ENGINE = process.env.DICE_ENGINE || path.join(os.homedir(), "framework", "engine.py");
if (!fs.existsSync(ENGINE)) {
  console.error("Python engine not found at " + ENGINE + " (set DICE_ENGINE=...)");
  process.exit(2);
}

const FIXTURES = [
  { seed: "plazma shake known earthquake background", config: "03", clarifier: false },
  { seed: "plazma shake known earthquake background", config: "03", clarifier: true },
  { seed: "silver lantern market drift", config: "01", clarifier: false },
  { seed: "silver lantern market drift", config: "04", clarifier: true },
  { seed: "Čokolada Torta! MLEKO, so; kaše123", config: "02", clarifier: false },
  { seed: "торта песак ветар", config: "01", clarifier: false },
  { seed: "  mixed   CASE!!! žđčć89 ", config: "02", clarifier: true }
];

function deepEqual(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

(async function main() {
  if (DICE.DECK.length !== 78) {
    console.error("FATAL: JS deck size is " + DICE.DECK.length + ", canon is 78");
    process.exit(1);
  }
  let pass = 0, fail = 0;
  for (const f of FIXTURES) {
    const args = [ENGINE, f.seed, "--config", f.config];
    if (f.clarifier) args.push("--clarifier");
    const pyJson = JSON.parse(execFileSync("python3", args.concat("--json"), { encoding: "utf8", maxBuffer: 1024 * 1024 }));
    const pyText = execFileSync("python3", args, { encoding: "utf8", maxBuffer: 1024 * 1024 }).replace(/\n$/, "");

    const result = await DICE.draw(f.seed, f.config, f.clarifier);
    const jsJson = {
      seed_normalized: result.norm,
      entropy_index: result.entropy,
      deck_size: DICE.DECK.length,
      draw: result.picks.map(([card, orientation], i) => ({
        position: i + 1, card, orientation,
        raw_meaning: DICE.rawMeaning(card, orientation)
      }))
    };
    const jsText = DICE.render(f.seed, f.config, f.clarifier, result);

    const jsonOK = deepEqual(pyJson, jsJson);
    const textOK = pyText === jsText;
    const label = '"' + f.seed.trim() + '" cfg ' + f.config + (f.clarifier ? " +clarifier" : "");
    if (jsonOK && textOK) {
      pass++;
      console.log("PASS  " + label + "  · hash " + DICE.bytesToHex(result.digest).slice(0, 16));
    } else {
      fail++;
      console.log("FAIL  " + label);
      if (!jsonOK) {
        console.log("  json differs. python seed_normalized=" + JSON.stringify(pyJson.seed_normalized) + " js=" + JSON.stringify(jsJson.seed_normalized));
        console.log("  python cards=" + JSON.stringify(pyJson.draw.map(d => d.card + ":" + d.orientation[0])));
        console.log("  js     cards=" + JSON.stringify(jsJson.draw.map(d => d.card + ":" + d.orientation[0])));
      }
      if (!textOK) {
        const pl = pyText.split("\n"), jl = jsText.split("\n");
        for (let i = 0; i < Math.max(pl.length, jl.length); i++) {
          if (pl[i] !== jl[i]) { console.log("  first text diff at line " + (i + 1) + ":"); console.log("   py: " + JSON.stringify(pl[i])); console.log("   js: " + JSON.stringify(jl[i])); break; }
        }
      }
    }
  }
  console.log("\n" + pass + " passed, " + fail + " failed against " + ENGINE);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
