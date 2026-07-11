const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');

const copyTargets = [
  'index.html',
  'admin',
  'css',
  'js',
  'fonts',
  'img',
];

function removeDir(dir) {
  if (!fs.existsSync(dir)) return;
  fs.rmSync(dir, { recursive: true, force: true });
}

function copyItem(src, dest) {
  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      if (entry === '.DS_Store') continue;
      copyItem(path.join(src, entry), path.join(dest, entry));
    }
    return;
  }

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

if (process.argv.includes('--clean')) {
  removeDir(dist);
  console.log('Removed dist/');
  process.exit(0);
}

removeDir(dist);
fs.mkdirSync(dist, { recursive: true });

for (const target of copyTargets) {
  const src = path.join(root, target);
  if (!fs.existsSync(src)) {
    console.warn(`Skipping missing path: ${target}`);
    continue;
  }
  copyItem(src, path.join(dist, target));
}

const configSrc = path.join(root, 'js', 'config.js');
const configExampleSrc = path.join(root, 'js', 'config.example.js');
const configDest = path.join(dist, 'js', 'config.js');

if (fs.existsSync(configSrc)) {
  fs.copyFileSync(configSrc, configDest);
} else if (fs.existsSync(configExampleSrc)) {
  fs.copyFileSync(configExampleSrc, configDest);
  console.warn('Using js/config.example.js — copy it to js/config.js and add your Supabase keys.');
}

console.log('Build complete → dist/');
console.log('Deploy the dist/ folder to Netlify, Vercel, Cloudflare Pages, or any static host.');
