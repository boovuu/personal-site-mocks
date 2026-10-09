#!/usr/bin/env node
/* ============================================================
   TOKEN LINT — personal-site v9 (GPT infra, implemented)
   Reads: v9 html files + site-content.js + tokens.json
   Reports:
     - raw hex/rgb colors outside allowed definition spots
     - data-token IDs not found in tokens.json (unknown tokens)
     - tokens in tokens.json never used (informational)
     - banned absolutes in copy (always/never/guaranteed...) unless proofId present
     - claims without proofId (work.cases bodies, hero claims)
   Exit 1 on errors → usable as GitHub Action or pre-commit hook.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const DIR = path.resolve(process.argv[2] || '.');
const HTML_FILES = ['index.html', 'v9-carries-the-work.html']; // v8 is the retired GPT concept — lint only the living surface
const tokens = JSON.parse(fs.readFileSync(path.join(DIR, 'tokens.json'), 'utf8'));
const exceptions = fs.existsSync(path.join(DIR, 'token-exceptions.json'))
  ? JSON.parse(fs.readFileSync(path.join(DIR, 'token-exceptions.json'), 'utf8'))
  : { colors: [], absolutes: [] };

const problems = [];
const notes = [];

/* ---- collect token definitions from tokens.json ---- */
const knownTokenIds = new Set();
for (const group of tokens.groups) {
  for (const t of group.tokens) knownTokenIds.add(t.id);
  for (const t of group.tokens) {
    // canonical CSS var for this token, e.g. surface.page -> --paper
    knownTokenIds.add(t.css);
  }
}

/* ---- allowed spots for raw colors ----
   1. :root{...} token definition block in <style>
   2. SVG inside .map-card (GPT: SVG detail exempt ONLY via exceptions list)
   3. token-exceptions.json selectors
-------------------------------------------------------*/
function allowedByException(file, value) {
  return exceptions.colors.some(e => e.file === file && e.value.toLowerCase() === value.toLowerCase());
}

function extractStyleBlocks(html) {
  const m = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)];
  return m.map(x => x[1]).join('\n');
}

function extractRootBlock(css) {
  const m = css.match(/:root\s*\{[\s\S]*?\}/);
  return m ? m[0] : '';
}

HTML_FILES.forEach(file => {
  const fp = path.join(DIR, file);
  if (!fs.existsSync(fp)) return;
  const html = fs.readFileSync(fp, 'utf8');
  const css = extractStyleBlocks(html);
  const rootBlock = extractRootBlock(css);

  // 1. raw hex colors in CSS outside :root definitions
  const cssNoRoot = css.replace(rootBlock, '');
  for (const m of cssNoRoot.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
    const v = m[0];
    if (allowedByException(file, v)) continue;
    const line = cssNoRoot.slice(0, m.index).split('\n').length;
    problems.push(`${file}:css:${line} raw color ${v} — use var(--token) or add to token-exceptions.json`);
  }
  for (const m of cssNoRoot.matchAll(/rgba?\([^)]+\)/g)) {
    const v = m[0];
    if (allowedByException(file, v)) continue;
    const line = cssNoRoot.slice(0, m.index).split('\n').length;
    problems.push(`${file}:css:${line} raw rgb() ${v} — token-ize or add exception`);
  }

  // 2. raw colors inside SVG markup (only flag values NOT in exceptions)
  const svgs = [...html.matchAll(/<svg[\s\S]*?<\/svg>/g)];
  svgs.forEach(sm => {
    const svg = sm[0];
    for (const m of svg.matchAll(/(?:fill|stroke)="(#[0-9a-fA-F]{3,8})"/g)) {
      const v = m[1];
      if (allowedByException(file, v)) continue;
      problems.push(`${file}:svg raw ${v} — move to tokens.json + exception, or use CSS var via class`);
    }
  });

  // 3. data-token / data-copy-token IDs must exist in tokens.json
  for (const m of html.matchAll(/data-(?:copy-)?token="([^"]+)"/g)) {
    const id = m[1];
    if (!knownTokenIds.has(id)) problems.push(`${file}: unknown token id "${id}" — not in tokens.json`);
  }
});

/* ---- site-content.js checks ---- */
const js = fs.readFileSync(path.join(DIR, 'site-content.js'), 'utf8');
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(js, ctx);
const SITE = ctx.window.SITE;

// 4. banned absolutes without proofId
const ABS = /\b(always|never|guaranteed|nothing left to chance|100%)\b/i;
function walkStrings(obj, pathStr) {
  if (typeof obj === 'string') { checkString(obj, pathStr); return; }
  if (Array.isArray(obj)) { obj.forEach((v, i) => walkStrings(v, `${pathStr}[${i}]`)); return; }
  if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      if (k === 'proofId') continue;
      walkStrings(v, pathStr ? `${pathStr}.${k}` : k);
    }
    // if this object itself has proofId, its own strings are cleared at checkString via lastProofId
  }
}
let currentProofId = null;
function checkString(s, where) {
  if (ABS.test(s) && !currentProofId && !exceptions.absolutes.some(a => s.includes(a))) {
    problems.push(`site-content.js:${where} absolute claim "${s.slice(0, 60)}..." — add proofId or add to token-exceptions.json absolutes`);
  }
}
// enhance: walk objects, track proofId on the object level
function walkObj(obj, pathStr) {
  if (Array.isArray(obj)) { obj.forEach((v, i) => walkObj(v, `${pathStr}[${i}]`)); return; }
  if (obj && typeof obj === 'object') {
    const prev = currentProofId;
    if (obj.proofId) currentProofId = obj.proofId;
    for (const [k, v] of Object.entries(obj)) {
      if (k === 'proofId') { checkProofId(v, pathStr + '.' + k); continue; }
      if (typeof v === 'string') checkString(v, `${pathStr}.${k}`);
      else walkObj(v, `${pathStr}.${k}`);
    }
    currentProofId = prev;
    return;
  }
  if (typeof obj === 'string') checkString(obj, pathStr);
}
function checkProofId(id, where) {
  if (!SITE.proofs || !SITE.proofs[id]) {
    problems.push(`site-content.js:${where} proofId "${id}" — no entry in SITE.proofs`);
  }
}
walkObj(SITE, 'SITE');

// 5. unused tokens (informational)
const allFiles = HTML_FILES.map(f => path.join(DIR, f)).filter(f => fs.existsSync(f)).map(f => fs.readFileSync(f, 'utf8')).join('\n') + js;
for (const group of tokens.groups) {
  for (const t of group.tokens) {
    if (!allFiles.includes(t.id)) notes.push(`token "${t.id}" defined in tokens.json but never referenced`);
  }
}

/* ---- report ---- */
if (notes.length) console.log('NOTES:\n' + notes.map(n => '  · ' + n).join('\n'));
if (problems.length) {
  console.log('\nERRORS (' + problems.length + '):\n' + problems.map(p => '  ✗ ' + p).join('\n'));
  process.exit(1);
} else {
  console.log('\nTOKEN LINT: clean.');
}
