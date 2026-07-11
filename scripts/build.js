const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');

function loadEnvFile() {
  const envPath = path.join(root, '.env');
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function escapeJsString(value) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function getSiteOrigin() {
  const siteUrl =
    process.env.SITE_URL ||
    process.env.URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');

  return siteUrl.replace(/\/$/, '');
}

function injectSiteOrigin(html) {
  const origin = getSiteOrigin();

  if (!origin) {
    console.warn(
      'SITE_URL not set — Open Graph image URLs may not preview correctly when shared. Set SITE_URL in your host env vars.'
    );
    return html.replace(/__SITE_ORIGIN__/g, '');
  }

  return html.replace(/__SITE_ORIGIN__/g, origin);
}

function writeConfig(dest, url, key) {
  const content = [
    '// Generated at build time — do not edit in dist/',
    `window.SUPABASE_URL = '${escapeJsString(url)}';`,
    `window.SUPABASE_ANON_KEY = '${escapeJsString(key)}';`,
    '',
  ].join('\n');

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, content);
}

const copyTargets = [
  'index.html',
  'favicon.ico',
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

loadEnvFile();

for (const target of copyTargets) {
  const src = path.join(root, target);
  if (!fs.existsSync(src)) {
    console.warn(`Skipping missing path: ${target}`);
    continue;
  }
  copyItem(src, path.join(dist, target));
}

const indexSrc = path.join(root, 'index.html');
const indexDest = path.join(dist, 'index.html');
if (fs.existsSync(indexSrc)) {
  const html = injectSiteOrigin(fs.readFileSync(indexSrc, 'utf8'));
  fs.writeFileSync(indexDest, html);
}

const configSrc = path.join(root, 'js', 'config.js');
const configExampleSrc = path.join(root, 'js', 'config.example.js');
const configDest = path.join(dist, 'js', 'config.js');
const envUrl = process.env.SUPABASE_URL;
const envKey = process.env.SUPABASE_ANON_KEY;

if (envUrl && envKey) {
  writeConfig(configDest, envUrl, envKey);
  console.log('Wrote js/config.js from environment variables.');
} else if (fs.existsSync(configSrc)) {
  fs.copyFileSync(configSrc, configDest);
  console.log('Copied local js/config.js.');
} else if (fs.existsSync(configExampleSrc)) {
  fs.copyFileSync(configExampleSrc, configDest);
  console.warn(
    'Supabase not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in Netlify/Vercel env vars, or create js/config.js locally.'
  );
}

console.log('Build complete → dist/');
console.log('Deploy the dist/ folder to Netlify, Vercel, Cloudflare Pages, or any static host.');
