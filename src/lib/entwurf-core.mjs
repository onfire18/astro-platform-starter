/**
 * MediaDrift Website-Entwurf — Core-Logik v2
 * Geteilte Module für CLI und Web-App.
 *
 * Exports:
 *   - scrapeWebsite(url, opts) → ScrapedData
 *   - buildPrompt(data, companyName, sourceUrl) → string
 *   - generateEntwurf(data, opts) → html
 *   - detectCompanyName / makeSlug / normalizeUrl
 */

import * as cheerio from 'cheerio';
import Anthropic from '@anthropic-ai/sdk';

// ─── Config ──────────────────────────────────────────────────────────────────

export const DEFAULT_MODEL = 'claude-opus-4-8';

const SUBPAGES_TO_TRY = [
  '/ueber-uns', '/uber-uns', '/ueber-mich', '/about', '/about-us',
  '/leistungen', '/services', '/angebote', '/dienstleistungen', '/loesungen',
  '/kontakt', '/contact', '/kontaktieren',
  '/referenzen', '/projekte', '/portfolio', '/arbeiten',
  '/team', '/unternehmen', '/wir',
  '/preise', '/pricing',
];

const FETCH_OPTS = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function normalizeUrl(url) {
  url = String(url || '').trim();
  if (!url) return '';
  if (!url.startsWith('http')) url = 'https://' + url;
  return url.replace(/\/$/, '');
}

function getOrigin(url) {
  try { return new URL(url).origin; } catch { return url; }
}

function cleanText(text = '') {
  return text.replace(/\s+/g, ' ').replace(/[\r\n\t]/g, ' ').trim();
}

function unique(arr) {
  return [...new Set(arr.filter(Boolean))];
}

function extractPhone(text = '') {
  const matches = text.match(/(\+49[\s\-\/\d]{8,20}|0[\d\s\-\/]{8,20})/g);
  return matches?.[0]?.replace(/\s+/g, ' ').trim() ?? null;
}

function extractEmail(text = '') {
  const m = text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
  return m?.[0] ?? null;
}

// CSS-Farben aus dem HTML extrahieren (für Stil-Hinweise)
function extractColors(html = '') {
  const colors = new Set();
  const hexMatches = html.match(/#([0-9A-Fa-f]{6})\b/g) || [];
  hexMatches.slice(0, 20).forEach(c => colors.add(c.toLowerCase()));
  return [...colors].slice(0, 8);
}

// ─── Scraper ─────────────────────────────────────────────────────────────────

async function fetchPage(url, timeoutMs = 18000) {
  try {
    const res = await fetch(url, {
      ...FETCH_OPTS,
      redirect: 'follow',
      signal: AbortSignal.timeout(timeoutMs),
    });
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

  // Störendes entfernen
  $('script, style, noscript, iframe, svg, [class*="cookie"], [id*="cookie"],'
    + '[class*="popup"], [id*="popup"], [class*="modal"], [id*="modal"],'
    + '[class*="banner"], [class*="overlay"]').remove();

  const title    = cleanText($('title').text()) || cleanText($('h1').first().text());
  const metaDesc = cleanText($('meta[name="description"]').attr('content') ?? '');
  const ogTitle  = cleanText($('meta[property="og:title"]').attr('content') ?? '');
  const ogDesc   = cleanText($('meta[property="og:description"]').attr('content') ?? '');
  const ogImage  = $('meta[property="og:image"]').attr('content') ?? '';
  const lang     = $('html').attr('lang') ?? 'de';

  const headings = [];
  $('h1, h2, h3, h4').each((_, el) => {
    const t = cleanText($(el).text());
    if (t.length > 2 && t.length < 220) headings.push(t);
  });

  const paragraphs = [];
  $('p, li, dd, blockquote, .text, .content').each((_, el) => {
    const t = cleanText($(el).text());
    if (t.length > 40 && t.length < 700) paragraphs.push(t);
  });

  const images = [];
  $('img').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src');
    const alt = $(el).attr('alt') ?? '';
    if (!src) return;
    try {
      const abs = new URL(src, baseUrl).href;
      if (!abs.includes('data:') && !abs.match(/\.(gif|svg|ico|png.*icon)/i) && abs.startsWith('http')) {
        images.push({ url: abs, alt: cleanText(alt) });
      }
    } catch {}
  });

  const fullText = $('body').text();
  const phone    = extractPhone(fullText);
  const email    = extractEmail(fullText);
  const colors   = extractColors(html);

  const addressEl = $('address, [class*="address"], [class*="adresse"], [itemprop="address"]').first().text();
  const address   = cleanText(addressEl).slice(0, 250);

  const navLinks = [];
  $('nav a[href], header a[href], .menu a[href]').each((_, el) => {
    const href = $(el).attr('href');
    try {
      const abs = new URL(href, baseUrl).href;
      if (abs.startsWith(getOrigin(baseUrl))) navLinks.push(abs);
    } catch {}
  });

  const navTexts = [];
  $('nav a, header a').each((_, el) => {
    const t = cleanText($(el).text());
    if (t.length > 1 && t.length < 40) navTexts.push(t);
  });

  return {
    title, metaDesc, ogTitle, ogDesc, ogImage, lang,
    headings: unique(headings).slice(0, 25),
    paragraphs: unique(paragraphs).slice(0, 35),
    images: images.slice(0, 25),
    phone, email, address, colors,
    navLinks: unique(navLinks).slice(0, 60),
    navTexts: unique(navTexts).slice(0, 20),
  };
}

/**
 * Scrapt eine Website (Hauptseite + Unterseiten).
 */
export async function scrapeWebsite(startUrl, opts = {}) {
  const { onProgress = () => {}, maxSubpages = 6 } = opts;
  startUrl = normalizeUrl(startUrl);
  const origin = getOrigin(startUrl);

  onProgress(`Lade Hauptseite: ${startUrl}`);
  const mainHtml = await fetchPage(startUrl);
  if (!mainHtml) {
    // HTTP→HTTPS fallback
    const altUrl = startUrl.startsWith('https://') ? startUrl.replace('https://', 'http://') : null;
    if (altUrl) {
      onProgress(`HTTPS nicht erreichbar, versuche HTTP…`);
      const altHtml = await fetchPage(altUrl);
      if (!altHtml) throw new Error(`Konnte ${startUrl} nicht laden. URL erreichbar?`);
      return _scrape(altUrl, altHtml, opts);
    }
    throw new Error(`Konnte ${startUrl} nicht laden. URL korrekt und erreichbar?`);
  }

  return _scrape(startUrl, mainHtml, opts);
}

async function _scrape(startUrl, mainHtml, opts = {}) {
  const { onProgress = () => {}, maxSubpages = 6 } = opts;
  const origin = getOrigin(startUrl);

  const main  = parsePage(mainHtml, startUrl);
  const allData = {
    ...main,
    sourceUrl: startUrl,
    pages: [{ url: startUrl, data: main }],
  };

  // Zu besuchende Unterseiten: feste + aus Nav
  const candidates = [
    ...SUBPAGES_TO_TRY.map(p => origin + p),
    ...main.navLinks,
  ];
  const toVisit = unique(candidates);
  const visited = new Set([startUrl]);
  let subpageCount = 0;

  for (const url of toVisit) {
    if (visited.has(url) || subpageCount >= maxSubpages) continue;
    // Nur gleiche Domain, keine Anker/Queries
    try {
      const u = new URL(url);
      if (u.origin !== origin || u.pathname.includes('.') && !u.pathname.endsWith('/')) continue;
    } catch { continue; }
    visited.add(url);

    const html = await fetchPage(url);
    if (!html) continue;

    const data = parsePage(html, url);
    const slug = new URL(url).pathname || '/';
    onProgress(`Unterseite: ${slug} (${data.headings.length} Überschriften, ${data.images.length} Bilder)`);

    allData.headings   = unique([...allData.headings,   ...data.headings]).slice(0, 50);
    allData.paragraphs = unique([...allData.paragraphs, ...data.paragraphs]).slice(0, 70);
    allData.images     = unique([
      ...allData.images.map(i => i.url),
      ...data.images.map(i => i.url),
    ]).slice(0, 30).map(u =>
      allData.images.find(i => i.url === u) || data.images.find(i => i.url === u) || { url: u, alt: '' }
    );
    allData.phone   = allData.phone   || data.phone;
    allData.email   = allData.email   || data.email;
    allData.address = allData.address || data.address;
    allData.colors  = unique([...allData.colors, ...data.colors]).slice(0, 10);
    allData.navTexts = unique([...allData.navTexts, ...data.navTexts]).slice(0, 25);
    allData.pages.push({ url, data });
    subpageCount++;
  }

  onProgress(`Scraping abgeschlossen — ${allData.pages.length} Seiten, ${allData.images.length} Bilder, ${allData.headings.length} Überschriften`);
  return allData;
}

// ─── Prompt ───────────────────────────────────────────────────────────────────

export function detectCompanyName(data, companyName) {
  return companyName?.trim()
    || data.ogTitle?.split(/[|\-–·]/)[0]?.trim()
    || data.title?.split(/[|\-–·]/)[0]?.trim()
    || 'Das Unternehmen';
}

export function buildPrompt(data, companyName, sourceUrl) {
  const name    = detectCompanyName(data, companyName);
  const images  = data.images.slice(0, 10).map(i => `- ${i.url}${i.alt ? ' ("' + i.alt + '")' : ''}`).join('\n');
  const colors  = data.colors.length ? data.colors.join(', ') : 'nicht erkannt';
  const navHints = data.navTexts.length ? data.navTexts.join(', ') : '—';

  return `Du bist ein Premium-Webdesigner der Münchner Agentur MediaDrift. Deine Aufgabe: Erstelle einen vollständigen, professionellen und modernen Website-Entwurf für "${name}" als eine einzige selbstständige HTML-Datei. Dieser Entwurf ist ein Verkaufsdokument — er soll den Kunden begeistern.

## GESCRAPTE DATEN (von ${sourceUrl})

Firmenname:        ${name}
Seiten-Titel:      ${data.title || '—'}
Meta-Beschreibung: ${data.metaDesc || data.ogDesc || '—'}
Navigation (IST):  ${navHints}
Telefon:           ${data.phone || '—'}
E-Mail:            ${data.email || '—'}
Adresse:           ${data.address?.slice(0, 180) || '—'}
Bisherige Farben:  ${colors}
Hauptbild (og):    ${data.ogImage || '—'}

### Inhalte (Überschriften von der alten Website):
${data.headings.slice(0, 28).map((h, i) => `${i + 1}. ${h}`).join('\n')}

### Wichtige Textabschnitte:
${data.paragraphs.slice(0, 22).map((p, i) => `${i + 1}. ${p}`).join('\n')}

### Bilder (echte URLs — direkt in <img src="..."> einbinden):
${images || '(keine gefunden)'}

## DESIGN-AUFTRAG

Erstelle einen **vollständigen modernen Website-Entwurf** auf Basis der Daten oben.

### Designsprache:
- Professionell und vertrauenswürdig — für KMU-Kunden (Handwerker, Kanzleien, Dienstleister)
- Midnight Navy Primärfarbe: #0B1828
- CTA-Blau: #1455A8 (Buttons, Links, Akzente)
- Hintergrund: #EFF2F7 (helles Blau-Grau), Cards: #FFFFFF
- Fonts via Google Fonts CDN: "Outfit" (Headlines, 700/800), "Plus Jakarta Sans" (Fließtext, 400/600)
- Border-Radius: 14–16px für Cards, 999px für Buttons
- Shadows: `0 4px 24px rgba(20,85,168,0.08)`

### Pflicht-Sektionen (alle vollständig ausarbeiten):
1. **Sticky Navigation** — Logo (Firmenname), Haupt-Links aus den Nav-Texten, CTA-Button
2. **Hero-Bereich** — Großes H1 mit echter Value-Proposition aus den Daten, Subtext, 2 Buttons (primär + sekundär), optionales Bild rechts
3. **Leistungen** — Grid 2–3 Spalten, Cards mit inline-SVG Icons, echte Leistungen aus den Überschriften
4. **Über uns / Vertrauen** — Kurztext, 3–4 Trust-Badges (Zahlen: Gründungsjahr schätzen, Kundenprojekte, etc.)
5. **Referenzen/Zahlen-Bar** — 4 animierte Statswerte (CSS counter, kein JS)
6. **FAQ** — 5 echte Fragen mit CSS-only Accordion (details/summary)
7. **Kontaktformular** — echte Kontaktdaten + optisches Formular (Backend nicht nötig)
8. **Footer** — Adresse, Copyright, Links (Impressum, Datenschutz)

### Technische Anforderungen:
- **Eine einzige .html-Datei**, vollständig self-contained
- Kein externes CSS außer Google Fonts (CDN-Link im <head>)
- Kein JavaScript (reine HTML/CSS Interaktivität: accordion, smooth scroll)
- Responsive: Mobile-first, Media-Query bei 768px
- Echte Bilder von der alten Website per <img src="URL"> einbinden (top 4–5)
- CSS Custom Properties für alle Farben
- Professionelle Hover-Effekte auf Buttons und Cards (transform: translateY)
- Am Ende im Footer diskret: "Entwurf · MediaDrift · mediadrift.de"

### Wichtig:
- Verwende die echten gescrapten Inhalte — keine Lorem-Ipsum-Platzhalter
- Schätze fehlende Infos glaubwürdig (Gründungsjahr, Kundenzahl, etc.)
- Der Entwurf soll so gut sein, dass der Kunde sofort sagt: "Das wollen wir"

Gib **nur die HTML-Datei** aus, keine Erklärungen. Beginne mit <!DOCTYPE html>.`;
}

// ─── Generator ────────────────────────────────────────────────────────────────

/**
 * Generiert den HTML-Entwurf via Claude.
 */
export async function generateEntwurf(data, opts) {
  const {
    apiKey, companyName, sourceUrl, model = DEFAULT_MODEL, onProgress = () => {},
  } = opts;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY fehlt.');

  const client = new Anthropic({ apiKey });
  const prompt = buildPrompt(data, companyName, sourceUrl || data.sourceUrl);

  onProgress('Claude generiert den Entwurf … (ca. 30–90 Sekunden)');

  const message = await client.messages.create({
    model,
    max_tokens: 8000,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw  = message.content[0]?.type === 'text' ? message.content[0].text : '';
  const html = raw.match(/<!DOCTYPE[\s\S]*/i)?.[0] ?? raw;

  if (!html.toLowerCase().includes('<html')) {
    throw new Error('Claude hat kein valides HTML zurückgegeben. Bitte erneut versuchen.');
  }

  return html;
}

// ─── Utilities ────────────────────────────────────────────────────────────────

export function makeSlug(name, fallbackUrl) {
  let base = name;
  if (!base) {
    try { base = new URL(normalizeUrl(fallbackUrl)).hostname; } catch { base = 'entwurf'; }
  }
  return String(base)
    .toLowerCase()
    .replace(/[äöü]/g, m => ({ ä: 'ae', ö: 'oe', ü: 'ue' }[m]))
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'entwurf';
}
