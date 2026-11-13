// Keep the public HTML usable from a plain static server, including without JavaScript.
// Run node scripts/sync-navigation.js after editing the shared header.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const template = fs.readFileSync(path.join(root, 'assets/site-header.html'), 'utf8').trim();
const pages = {
  'index.html': ['/', 'page'],
  'atlas/aeo.html': ['/atlas/', 'location'],
  'atlas/index.html': ['/atlas/', 'page'],
  'dice.html': ['/dice.html', 'page'],
  'dice-story.html': ['/dice.html', 'location'],
  'workbench.html': [],
  'archive.html': [],
};
for (const file of fs.readdirSync(path.join(root, 'notes'))) {
  if (file.endsWith('.html')) pages['notes/' + file] = [];
}
for (const [file, [active, current]] of Object.entries(pages)) {
  const dest = path.join(root, file);
  const source = fs.readFileSync(dest, 'utf8');
  const header = active ? template.replace('href="' + active + '"', 'href="' + active + '" aria-current="' + current + '"') : template;
  const slot = /<!-- shared navigation -->[\s\S]*?<!-- end shared navigation -->/;
  if (!slot.test(source)) throw new Error('Missing shared navigation in ' + file);
  const updated = source.replace(slot, '<!-- shared navigation -->\n' + header + '\n<!-- end shared navigation -->');
  if (updated === source) continue;
  if (process.argv.includes('--check')) {
    console.error('Outdated navigation in ' + file);
    process.exitCode = 1;
  } else fs.writeFileSync(dest, updated);
}
