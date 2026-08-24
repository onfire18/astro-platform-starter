/**
 * Rendert die Outro-Animation Bild fuer Bild in Chromium und encodet daraus
 *   dist/meinexpress-outro-1080x1920.mp4   (TikTok / Reels / Shorts)
 *   dist/meinexpress-outro-alpha.webm      (transparent, zum Drueberlegen im Schnittprogramm)
 *   dist/meinexpress-outro.gif             (Vorschau)
 *
 * Voraussetzungen:  npm i -D playwright-core ffmpeg-static   (Chromium muss installiert sein)
 * Aufruf:           node render.mjs [--fps 30] [--duration 3] [--no-gif]
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';
import ffmpegPath from 'ffmpeg-static';

const dir = path.dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};

const FPS = Number(arg('fps', 30));
const DURATION = Number(arg('duration', 3));
const W = 1080, H = 1920;
const frames = Math.round(FPS * DURATION);
const distDir = path.join(dir, 'dist');
const framesDir = path.join(distDir, 'frames');
const alphaDir = path.join(distDir, 'frames-alpha');
const htmlFile = path.join(distDir, 'meinexpress-outro.html');

if (!fs.existsSync(htmlFile)) {
  console.error('dist/meinexpress-outro.html fehlt – bitte zuerst "node build.mjs" ausfuehren.');
  process.exit(1);
}

const ff = (args) => {
  const r = spawnSync(ffmpegPath, args, { stdio: ['ignore', 'ignore', 'pipe'] });
  if (r.status !== 0) {
    console.error(r.stderr?.toString().split('\n').slice(-12).join('\n'));
    throw new Error('ffmpeg failed: ' + args.join(' '));
  }
};

async function shoot(outDir, { alpha }) {
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ['--force-color-profile=srgb', '--font-render-hinting=none', '--disable-lcd-text'],
  });
  const page = await browser.newPage({
    viewport: { width: W, height: H },
    deviceScaleFactor: 1,
  });
  const url = pathToFileURL(htmlFile).href + (alpha ? '?alpha=1&still=1' : '?still=1');
  await page.goto(url, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);

  for (let f = 0; f < frames; f++) {
    const t = f / FPS;
    await page.evaluate((tt) => window.seek(tt), t);
    await page.screenshot({
      path: path.join(outDir, `f${String(f).padStart(4, '0')}.png`),
      omitBackground: alpha,
    });
  }
  await browser.close();
  console.log(`✓ ${frames} Frames gerendert (${alpha ? 'transparent' : 'opak'})`);
}

// ---- 1. MP4 (H.264, yuv420p – laeuft ueberall, auch beim TikTok-Upload) ----
await shoot(framesDir, { alpha: false });
const mp4 = path.join(distDir, 'meinexpress-outro-1080x1920.mp4');
ff(['-y', '-v', 'error', '-framerate', String(FPS), '-i', path.join(framesDir, 'f%04d.png'),
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p',
  '-profile:v', 'high', '-movflags', '+faststart', '-r', String(FPS), mp4]);
console.log('✓ ' + path.relative(process.cwd(), mp4));

// ---- 2. WebM mit Alphakanal (zum Einblenden ueber bestehendes Videomaterial) ----
await shoot(alphaDir, { alpha: true });
const webm = path.join(distDir, 'meinexpress-outro-alpha.webm');
ff(['-y', '-v', 'error', '-framerate', String(FPS), '-i', path.join(alphaDir, 'f%04d.png'),
  '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '0', '-crf', '26',
  '-auto-alt-ref', '0', '-r', String(FPS), webm]);
console.log('✓ ' + path.relative(process.cwd(), webm));

// ---- 3. GIF-Vorschau ----
if (!argv.includes('--no-gif')) {
  const gif = path.join(distDir, 'meinexpress-outro.gif');
  const pal = path.join(distDir, 'palette.png');
  ff(['-y', '-v', 'error', '-framerate', String(FPS), '-i', path.join(framesDir, 'f%04d.png'),
    '-vf', 'fps=12,scale=400:-1:flags=lanczos,palettegen=stats_mode=diff', pal]);
  ff(['-y', '-v', 'error', '-framerate', String(FPS), '-i', path.join(framesDir, 'f%04d.png'), '-i', pal,
    '-lavfi', 'fps=12,scale=400:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=sierra2_4a', '-loop', '0', gif]);
  fs.rmSync(pal, { force: true });
  console.log('✓ ' + path.relative(process.cwd(), gif));
}

// Frames aufraeumen (mit --keep-frames behalten)
if (!argv.includes('--keep-frames')) {
  fs.rmSync(framesDir, { recursive: true, force: true });
  fs.rmSync(alphaDir, { recursive: true, force: true });
}
