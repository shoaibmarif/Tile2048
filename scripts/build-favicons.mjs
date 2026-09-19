import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const webPublic = path.join(rootDir, 'packages', 'web', 'public');
const extIcons = path.join(rootDir, 'packages', 'extension', 'public', 'icons');
const svgPath = path.join(webPublic, 'favicon.svg');

if (!fs.existsSync(webPublic)) {
  fs.mkdirSync(webPublic, { recursive: true });
}
if (!fs.existsSync(extIcons)) {
  fs.mkdirSync(extIcons, { recursive: true });
}

if (!fs.existsSync(svgPath)) {
  console.error(`SVG file not found at: ${svgPath}`);
  process.exit(1);
}

const svgContent = fs.readFileSync(svgPath, 'utf8');

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-48x48.png', size: 48 },
  { name: 'favicon-96x96.png', size: 96 },
  { name: 'icon-128.png', size: 128 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
];

console.log('Generating PNG favicon suite using Headless Chrome...');

const tempDir = path.join(rootDir, '.temp_favicon_build');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

for (const { name, size } of sizes) {
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: ${size}px; height: ${size}px; overflow: hidden; background: transparent; }
    svg { width: 100%; height: 100%; display: block; }
  </style>
</head>
<body>
  ${svgContent}
</body>
</html>`;

  const tempHtml = path.join(tempDir, `render-${size}.html`);
  fs.writeFileSync(tempHtml, htmlContent, 'utf8');
  const targetPng = path.join(webPublic, name);

  try {
    execFileSync(
      chromePath,
      [
        '--headless=new',
        '--disable-gpu',
        '--hide-scrollbars',
        '--default-background-color=00000000',
        `--window-size=${size},${size}`,
        `--screenshot=${targetPng}`,
        `file:///${tempHtml.replace(/\\/g, '/')}`,
      ],
      { stdio: 'ignore' }
    );
    console.log(`✓ Rendered ${name} (${size}x${size})`);
  } catch (err) {
    console.error(`Error rendering ${name}:`, err);
  }
}

// Generate Social Share OG-Image (1200x630)
const ogHtmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    html, body { width: 1200px; height: 630px; overflow: hidden; }
    body {
      background: linear-gradient(135deg, #090d16 0%, #1e1b4b 50%, #0f172a 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      text-align: center;
      position: relative;
    }
    .badge {
      background: rgba(237, 194, 46, 0.15);
      border: 1px solid rgba(237, 194, 46, 0.4);
      color: #edc22e;
      padding: 8px 20px;
      border-radius: 9999px;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 24px;
    }
    .title {
      font-size: 88px;
      font-weight: 900;
      letter-spacing: -2px;
      background: linear-gradient(to right, #ffffff, #fef08a, #edc22e);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 16px;
    }
    .subtitle {
      font-size: 32px;
      color: #94a3b8;
      max-width: 800px;
      line-height: 1.4;
    }
    .tiles-row {
      display: flex;
      gap: 16px;
      margin-top: 40px;
    }
    .tile {
      width: 72px;
      height: 72px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 800;
      color: #ffffff;
      box-shadow: 0 10px 25px rgba(0,0,0,0.4);
    }
  </style>
</head>
<body>
  <div class="badge">Classic & Modern Puzzle</div>
  <h1 class="title">Tile 2048</h1>
  <p class="subtitle">Join the numbers, get to the 2048 tile! Featuring AI hints, unlimited undo, customizable grids, and offline play.</p>
  <div class="tiles-row">
    <div class="tile" style="background:#edc22e;">2048</div>
    <div class="tile" style="background:#edc53f;">1024</div>
    <div class="tile" style="background:#f67c5f;">64</div>
    <div class="tile" style="background:#f59563;">16</div>
  </div>
</body>
</html>`;

const tempOgHtml = path.join(tempDir, 'render-og.html');
fs.writeFileSync(tempOgHtml, ogHtmlContent, 'utf8');
const ogImagePath = path.join(webPublic, 'og-image.png');
try {
  execFileSync(
    chromePath,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--window-size=1200,630',
      `--screenshot=${ogImagePath}`,
      `file:///${tempOgHtml.replace(/\\/g, '/')}`,
    ],
    { stdio: 'ignore' }
  );
  console.log('✓ Rendered og-image.png (1200x630)');
} catch (err) {
  console.error('Error rendering og-image:', err);
}

// Build multi-resolution binary favicon.ico (16, 32, 48)
console.log('Building multi-size binary favicon.ico...');
const icoResolutions = [16, 32, 48];
const iconBuffers = [];

for (const res of icoResolutions) {
  const p = path.join(webPublic, `favicon-${res}x${res}.png`);
  if (fs.existsSync(p)) {
    iconBuffers.push({ size: res, buffer: fs.readFileSync(p) });
  }
}

if (iconBuffers.length > 0) {
  const count = iconBuffers.length;
  // Header: 6 bytes
  // Directory entries: count * 16 bytes
  const headerSize = 6 + count * 16;
  let currentOffset = headerSize;

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type = 1 (ICO)
  header.writeUInt16LE(count, 4); // Count of images

  const entries = [];
  for (const { size, buffer } of iconBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bit depth
    entry.writeUInt32LE(buffer.length, 8); // bytes in resource
    entry.writeUInt32LE(currentOffset, 12); // image offset
    entries.push(entry);
    currentOffset += buffer.length;
  }

  const icoBuffer = Buffer.concat([
    header,
    ...entries,
    ...iconBuffers.map((b) => b.buffer),
  ]);

  fs.writeFileSync(path.join(webPublic, 'favicon.ico'), icoBuffer);
  console.log(`✓ Assembled favicon.ico containing resolutions: ${icoResolutions.join(', ')}`);
}

// Copy Chrome Extension icons
const copyMapping = [
  { src: 'favicon-16x16.png', dest: 'icon16.png' },
  { src: 'favicon-48x48.png', dest: 'icon48.png' },
  { src: 'icon-128.png', dest: 'icon128.png' },
];

for (const { src, dest } of copyMapping) {
  const srcPath = path.join(webPublic, src);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(extIcons, dest));
    console.log(`✓ Copied extension icon: ${dest}`);
  }
}

// Clean up temp directory
try {
  fs.rmSync(tempDir, { recursive: true, force: true });
} catch {
  // ignore cleanup error
}

console.log('Favicon generation completed successfully!');
