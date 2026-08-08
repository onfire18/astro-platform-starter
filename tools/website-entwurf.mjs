#!/usr/bin/env node
/**
 * MediaDrift Website-Entwurf Generator — CLI
 * Scrapet eine bestehende Website und generiert einen modernen HTML-Entwurf.
 *
 * Verwendung:
 *   node tools/website-entwurf.mjs <URL> [Firmenname]
 *
 * Voraussetzung:
 *   export ANTHROPIC_API_KEY=sk-ant-...   (Linux/macOS)
 *   $env:ANTHROPIC_API_KEY="sk-ant-..."   (PowerShell)
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  scrapeWebsite, generateEntwurf, detectCompanyName, makeSlug, normalizeUrl,
} from '../src/lib/entwurf-core.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help') {
    console.log(`
MediaDrift Website-Entwurf Generator
=====================================
Verwendung:
  node tools/website-entwurf.mjs <URL> [Firmenname]

Beispiele:
  node tools/website-entwurf.mjs https://www.alteweb.de
  node tools/website-entwurf.mjs https://www.alteweb.de "Müller GmbH"

Voraussetzung:
  export ANTHROPIC_API_KEY=sk-ant-...    (Linux/macOS)
  $env:ANTHROPIC_API_KEY="sk-ant-..."    (PowerShell)
`);
    process.exit(0);
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('\n❌ ANTHROPIC_API_KEY nicht gesetzt.');
    console.error('   Linux/macOS:  export ANTHROPIC_API_KEY=sk-ant-...');
    console.error('   PowerShell:   $env:ANTHROPIC_API_KEY="sk-ant-..."\n');
    process.exit(1);
  }

  const rawUrl = normalizeUrl(args[0]);
  const companyName = args[1] || null;

  console.log('━'.repeat(60));
  console.log('  MediaDrift · Website-Entwurf Generator');
  console.log('━'.repeat(60));
  console.log(`  URL:     ${rawUrl}`);
  if (companyName) console.log(`  Firma:   ${companyName}`);
  console.log();

  try {
    const log = (msg) => console.log(`  ${msg}`);

    const data = await scrapeWebsite(rawUrl, { onProgress: log });
    const html = await generateEntwurf(data, {
      apiKey, companyName, sourceUrl: rawUrl, onProgress: log,
    });

    const slug = makeSlug(companyName || detectCompanyName(data), rawUrl);
    const date = new Date().toISOString().slice(0, 10);
    const filename = `${slug}-entwurf-${date}.html`;
    const outputDir = join(__dirname, 'output');
    mkdirSync(outputDir, { recursive: true });
    const filepath = join(outputDir, filename);
    writeFileSync(filepath, html, 'utf8');

    console.log('\n' + '━'.repeat(60));
    console.log('  ✅ Entwurf fertig!');
    console.log(`  📄 Datei: tools/output/${filename}`);
    console.log(`  💡 Im Browser öffnen und dem Kunden senden.`);
    console.log('━'.repeat(60) + '\n');

    const name = detectCompanyName(data, companyName);
    console.log('Gescrapte Daten:');
    console.log(`  Firma:         ${name}`);
    console.log(`  Telefon:       ${data.phone || '—'}`);
    console.log(`  E-Mail:        ${data.email || '—'}`);
    console.log(`  Adresse:       ${data.address?.slice(0, 60) || '—'}`);
    console.log(`  Bilder:        ${data.images.length}`);
    console.log(`  Überschriften: ${data.headings.length}`);
    console.log(`  Absätze:       ${data.paragraphs.length}\n`);

  } catch (err) {
    console.error('\n❌ Fehler:', err.message, '\n');
    process.exit(1);
  }
}

main();
