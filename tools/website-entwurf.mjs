#!/usr/bin/env node
/**
 * MediaDrift Website-Entwurf Generator
 * Scrapet eine bestehende Website, extrahiert Inhalte und generiert
 * einen modernen HTML-Entwurf mit Claude AI.
 *
 * Verwendung:
 *   node tools/website-entwurf.mjs <URL> [Firmenname]
 *
 * Beispiel:
 *   node tools/website-entwurf.mjs https://www.alteweb.de "Müller GmbH"
 */

import Anthropic from '@anthropic-ai/sdk';
import * as cheerio from 'cheerio';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Config ──────────────────────────────────────────────────────────────────

const SUBPAGES_TO_TRY = [
  '/ueber-uns', '/uber-uns', '/about', '/about-us', '/ueber-mich',
  '/leistungen', '/services', '/angebote', '/dienstleistungen',
  '/kontakt', '/contact', '/impressum',
  '/referenzen', '/projekte', '/portfolio',
  '/team', '/unternehmen',
];

const FETCH_OPTS = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
  },
  signal: AbortSignal.timeout(15000),
};

// ─── Helper ───────────────────────────────────────────────────────────────────

function normalizeUrl(url) {
  if (!url.startsWith('http')) url = 'https://' + url;
  return url.replace(/\/$/, '');
}

function getOrigin(url) {
  try { return new URL(url).origin; } catch { return url; }
}

function cleanText(text) {
  return text?.replace(/\s+/g, ' ').trim() ?? '';
}

function unique(arr) {
  return [...new Set(arr.filter(Boolean))];
}

function extractPhone(text) {
  const m = text.match(/(\+49|0)[\s\-\/]?[\d\s\-\/]{6,20}/g);
  return m ? m[0].replace(/\s+/g, ' ').trim() : null;
}

function extractEmail(text) {
  const m = text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
  return m ? m[0] : null;
}

// ─── Scraper ─────────────────────────────────────────────────────────────────

async function fetchPage(url) {
  try {
    const res = await fetch(url, FETCH_OPTS);
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') ?? '';
    if (!ct.includes('html')) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function parsePage(html, baseUrl) {
  const $ = cheerio.load(html);

  // Remove noise
  $('script, style, noscript, nav, footer, header, .cookie, #cookie, [class*="cookie"], [id*="cookie"]').remove();

  const title = cleanText($('title').text()) || cleanText($('h1').first().text());
  const metaDesc = cleanText($('meta[name="description"]').attr('content') ?? '');
  const ogTitle = cleanText($('meta[property="og:title"]').attr('content') ?? '');
  const ogDesc = cleanText($('meta[property="og:description"]').attr('content') ?? '');

  // Headings
  const headings = [];
  $('h1, h2, h3').each((_, el) => {
    const t = cleanText($(el).text());
    if (t.length > 3 && t.length < 200) headings.push(t);
  });

  // Paragraphs
  const paragraphs = [];
  $('p, li').each((_, el) => {
    const t = cleanText($(el).text());
    if (t.length > 30 && t.length < 600) paragraphs.push(t);
  });

  // Images
  const images = [];
  $('img').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src');
    const alt = $(el).attr('alt') ?? '';
    if (!src) return;
    try {
      const absUrl = new URL(src, baseUrl).href;
      if (!absUrl.includes('data:') && !absUrl.match(/\.(gif|svg|ico)$/i)) {
        images.push({ url: absUrl, alt: cleanText(alt) });
      }
    } catch {}
  });

  // Full text for contact extraction
  const fullText = $('body').text();
  const phone = extractPhone(fullText);
  const email = extractEmail(fullText);

  // Address hint
  const addressEl = $('[class*="address"], [class*="adresse"], [itemprop="address"], address').first().text();
  const address = cleanText(addressEl).slice(0, 200);

  // Nav links for subpage discovery
  const navLinks = [];
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    try {
      const abs = new URL(href, baseUrl).href;
      if (abs.startsWith(getOrigin(baseUrl))) navLinks.push(abs);
    } catch {}
  });

  return {
    title, metaDesc, ogTitle, ogDesc,
    headings: unique(headings).slice(0, 20),
    paragraphs: unique(paragraphs).slice(0, 30),
    images: images.slice(0, 20),
    phone, email, address,
    navLinks: unique(navLinks).slice(0, 50),
  };
}

async function scrapeWebsite(startUrl) {
  console.log(`\n🔍 Scrappe Startseite: ${startUrl}`);
  const origin = getOrigin(startUrl);

  const mainHtml = await fetchPage(startUrl);
  if (!mainHtml) throw new Error(`Konnte ${startUrl} nicht laden.`);

  const main = parsePage(mainHtml, startUrl);
  const allData = { ...main, pages: [{ url: startUrl, data: main }] };

  // Try known subpages + discovered links
  const toVisit = new Set([
    ...SUBPAGES_TO_TRY.map(p => origin + p),
    ...main.navLinks.slice(0, 15),
  ]);

  let visited = new Set([startUrl]);
  let subpageCount = 0;

  for (const url of toVisit) {
    if (visited.has(url) || subpageCount >= 5) continue;
    visited.add(url);

    process.stdout.write(`  → ${url.replace(origin, '')} ... `);
    const html = await fetchPage(url);
    if (!html) { console.log('❌'); continue; }

    const data = parsePage(html, url);
    console.log(`✓ (${data.headings.length} Überschriften, ${data.paragraphs.length} Absätze)`);

    // Merge data
    allData.headings = unique([...allData.headings, ...data.headings]).slice(0, 40);
    allData.paragraphs = unique([...allData.paragraphs, ...data.paragraphs]).slice(0, 60);
    allData.images = unique([...allData.images.map(i => i.url), ...data.images.map(i => i.url)])
      .slice(0, 30)
      .map(url => allData.images.find(i => i.url === url) || data.images.find(i => i.url === url) || { url, alt: '' });
    allData.phone = allData.phone || data.phone;
    allData.email = allData.email || data.email;
    allData.address = allData.address || data.address;

    subpageCount++;
  }

  console.log(`\n✅ Scraping abgeschlossen: ${subpageCount + 1} Seiten, ${allData.headings.length} Überschriften, ${allData.paragraphs.length} Absätze, ${allData.images.length} Bilder`);
  return allData;
}

// ─── Claude Prompt ────────────────────────────────────────────────────────────

function buildPrompt(data, companyName, sourceUrl) {
  const name = companyName || data.ogTitle || data.title?.split('|')[0]?.split('-')[0]?.trim() || 'Das Unternehmen';
  const images = data.images.slice(0, 8).map(i => `- ${i.url}${i.alt ? ' (' + i.alt + ')' : ''}`).join('\n');

  return `Du bist ein Premium-Webdesigner der Agentur MediaDrift (München). Deine Aufgabe: Erstelle einen vollständigen, professionellen Website-Entwurf für "${name}" als selbstständige HTML-Datei.

## UNTERNEHMENSDATEN (gescrapt von ${sourceUrl})

**Firmenname:** ${name}
**Titel der alten Website:** ${data.title}
**Meta-Beschreibung:** ${data.metaDesc || data.ogDesc || '(keine)'}
**Telefon:** ${data.phone || '(nicht gefunden)'}
**E-Mail:** ${data.email || '(nicht gefunden)'}
**Adresse:** ${data.address || '(nicht gefunden)'}

**Gefundene Überschriften (Inhalt der alten Website):**
${data.headings.slice(0, 25).map((h, i) => `${i + 1}. ${h}`).join('\n')}

**Wichtige Textinhalte:**
${data.paragraphs.slice(0, 20).map((p, i) => `${i + 1}. ${p}`).join('\n')}

**Verfügbare Bilder (echte URLs von der alten Website):**
${images || '(keine Bilder gefunden)'}

## DESIGN-ANFORDERUNGEN

Erstelle einen modernen, vollständigen HTML-Entwurf mit folgenden Eigenschaften:

**Stil:** Professionell, vertrauenswürdig, für KMU-Zielgruppe. Premium ohne Protz.
**Palette:** Midnight Navy (#0B1828), Cobalt CTA (#1455A8), Hintergrund (#EFF2F7), Weiß für Cards.
**Typografie:** Verwende Google Fonts — "Outfit" für Headlines, "Plus Jakarta Sans" für Fließtext.
**Sprache:** Deutsch. Verwende echte Inhalte aus den gescrapten Daten.

**Pflicht-Sektionen:**
1. **Navigation** — Logo (Firmenname), Links (Leistungen, Über uns, Kontakt), CTA-Button "Beratung anfragen"
2. **Hero** — Großer Headline mit Value-Proposition, Subtext, 2 CTA-Buttons, Trust-Badges
3. **Leistungen** — 3–6 Cards mit Icons (SVG inline), echte Leistungen aus den Daten
4. **Über uns** — Kurzer Text, Vertrauens-Elemente (Jahre, Kunden, etc.)
5. **Referenzen/Zahlen** — Stats-Bar mit 3–4 Kennzahlen (glaubwürdig schätzen)
6. **FAQ** — 4–5 Fragen mit Accordion (reines CSS, kein JS nötig)
7. **Kontakt** — Echte Kontaktdaten + einfaches Formular (optisch, kein Backend)
8. **Footer** — Adresse, Links, Copyright

**Technische Anforderungen:**
- Eine einzige, vollständig selbstständige HTML-Datei
- Kein externes CSS außer Google Fonts CDN
- Kein externes JavaScript
- Mobile-responsive mit CSS Media Queries
- Smooth Scroll, dezente CSS-Transitions
- Professionelle Box-Shadows, Border-Radius 12–16px für Cards
- Echte Bilder von der alten Website einbinden wo sinnvoll (img src mit den echten URLs)
- Am Ende der Seite ein diskreter Hinweis: "Entwurf erstellt von MediaDrift · mediadrift.de"

**WICHTIG:**
- Verwende die echten Inhalte aus den gescrapten Daten, nicht generische Platzhalter
- Schätze fehlende Infos glaubwürdig (z.B. Gründungsjahr basierend auf Inhalt)
- Keine Lorem-Ipsum-Texte
- Die Seite soll beeindrucken — das ist ein Verkaufsdokument für MediaDrift

Gib NUR die vollständige HTML-Datei aus, nichts anderes. Beginne mit <!DOCTYPE html>.`;
}

// ─── Generator ────────────────────────────────────────────────────────────────

async function generateEntwurf(data, companyName, sourceUrl) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY nicht gesetzt. Bitte: export ANTHROPIC_API_KEY=sk-ant-...');
  }

  const client = new Anthropic({ apiKey });
  const prompt = buildPrompt(data, companyName, sourceUrl);

  console.log('\n🤖 Generiere Entwurf mit Claude AI...');
  console.log('   (Das dauert ca. 30–60 Sekunden)');

  const message = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 8000,
    messages: [{ role: 'user', content: prompt }],
  });

  const html = message.content[0].text;

  // Sanity check
  if (!html.includes('<!DOCTYPE') && !html.includes('<html')) {
    throw new Error('Claude hat kein valides HTML zurückgegeben. Bitte nochmal versuchen.');
  }

  // Extract only the HTML if Claude added extra text
  const htmlMatch = html.match(/<!DOCTYPE[\s\S]*$/i);
  return htmlMatch ? htmlMatch[0] : html;
}

// ─── Save Output ──────────────────────────────────────────────────────────────

function saveOutput(html, companyName, sourceUrl) {
  const slug = (companyName || new URL(sourceUrl).hostname)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const date = new Date().toISOString().slice(0, 10);
  const filename = `${slug}-entwurf-${date}.html`;
  const outputDir = join(__dirname, 'output');

  mkdirSync(outputDir, { recursive: true });
  const filepath = join(outputDir, filename);
  writeFileSync(filepath, html, 'utf8');

  return { filepath, filename };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

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
  export ANTHROPIC_API_KEY=sk-ant-...
`);
    process.exit(0);
  }

  const rawUrl = normalizeUrl(args[0]);
  const companyName = args[1] || null;

  console.log('━'.repeat(60));
  console.log('  MediaDrift · Website-Entwurf Generator');
  console.log('━'.repeat(60));
  console.log(`  URL:     ${rawUrl}`);
  if (companyName) console.log(`  Firma:   ${companyName}`);

  try {
    // Phase 1: Scrape
    const data = await scrapeWebsite(rawUrl);

    // Phase 2: Generate
    const html = await generateEntwurf(data, companyName, rawUrl);

    // Phase 3: Save
    const { filepath, filename } = saveOutput(html, companyName || data.title, rawUrl);

    console.log('\n━'.repeat(60));
    console.log('  ✅ Entwurf fertig!');
    console.log(`  📄 Datei: tools/output/${filename}`);
    console.log(`  💡 Öffne die HTML-Datei im Browser und sende sie dem Kunden.`);
    console.log('━'.repeat(60) + '\n');

    // Print quick summary
    const detectedName = companyName || data.ogTitle || data.title?.split(/[|\-]/)[0]?.trim();
    console.log(`Zusammenfassung der gescrapten Daten:`);
    console.log(`  Firma:       ${detectedName}`);
    console.log(`  Telefon:     ${data.phone || '—'}`);
    console.log(`  E-Mail:      ${data.email || '—'}`);
    console.log(`  Adresse:     ${data.address?.slice(0, 60) || '—'}`);
    console.log(`  Bilder:      ${data.images.length}`);
    console.log(`  Überschriften: ${data.headings.length}`);
    console.log(`  Absätze:     ${data.paragraphs.length}`);
    console.log();

  } catch (err) {
    console.error('\n❌ Fehler:', err.message);
    if (err.message.includes('ANTHROPIC_API_KEY')) {
      console.error('\nBitte API Key setzen:');
      console.error('  export ANTHROPIC_API_KEY=sk-ant-...\n');
    }
    process.exit(1);
  }
}

main();
