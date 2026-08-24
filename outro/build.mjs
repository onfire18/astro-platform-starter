/**
 * Baut aus template.html eine einzelne, komplett eigenstaendige HTML-Datei
 * (Logo + Schriften als Data-URLs eingebettet) -> dist/meinexpress-outro.html
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const b64 = (p, mime) => `data:${mime};base64,${fs.readFileSync(path.join(dir, p)).toString('base64')}`;

const html = fs
  .readFileSync(path.join(dir, 'template.html'), 'utf8')
  .replace('__FONT_ANTON__', b64('fonts/anton-latin.woff2', 'font/woff2'))
  .replace('__FONT_MONT__', b64('fonts/montserrat-latin.woff2', 'font/woff2'))
  .replace('__LOGO__', b64('logo.png', 'image/png'));

fs.mkdirSync(path.join(dir, 'dist'), { recursive: true });
const out = path.join(dir, 'dist', 'meinexpress-outro.html');
fs.writeFileSync(out, html);
console.log(`✓ ${path.relative(process.cwd(), out)}  (${(html.length / 1024 / 1024).toFixed(2)} MB)`);
