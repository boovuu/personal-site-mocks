#!/usr/bin/env node
// build-from-duckdb.js — the CMS pipeline: content.duckdb -> generated JSON -> verify against SITE
// Run: node build-from-duckdb.js   (from the mocks repo root)
const fs = require("fs");
const { execSync } = require("child_process");

// 1. regenerate JSON straight from the database
execSync(`duckdb content.duckdb < render-json.sql`, { stdio: "inherit" });

// 2. unwrap the {to_json(t): ...} wrapper
const unw = f => JSON.parse(fs.readFileSync(`generated/${f}`, "utf8")).map(x => x["to_json(t)"]);
const db = {
  cases: unw("cases.json"),
  principles: unw("principles.json"),
  exhibits: unw("exhibits.json"),
};

// 3. compare against the live site-content.js (drift check)
global.window = {};
eval(fs.readFileSync("site-content.js", "utf8"));
const SITE = window.SITE;
let drift = 0;
const cmp = (label, dbArr, siteArr, key) => {
  const a = dbArr.map(x => x[key]).join("|");
  const b = siteArr.map(x => x[key]).join("|");
  if (a !== b) { console.log(`DRIFT in ${label}:`); console.log("  db:  ", a.slice(0, 140)); console.log("  site:", b.slice(0, 140)); drift++; }
  else console.log(`OK ${label} (${dbArr.length})`);
};
cmp("cases", db.cases, SITE.work.cases, "title");
cmp("principles", db.principles, SITE.principles.items, "title");
cmp("exhibits", db.exhibits, SITE.exhibits, "title");

// 4. publish gate: every non-draft claim must have disclosure
const unsafe = db.cases.filter(c => !c.disclosure);
if (unsafe.length) { console.log("BLOCKED: cases without disclosure:", unsafe.map(c => c.id)); process.exit(1); }

console.log(drift === 0 ? "CMS AND SITE IN SYNC" : `${drift} drift section(s) — update site-content.js from generated/site-content-from-db.json`);
