import type { APIRoute } from 'astro';
// @ts-ignore — plain ESM core module, kein Typdeklaration nötig
import { scrapeWebsite, generateEntwurf, detectCompanyName, makeSlug, normalizeUrl } from '../../lib/entwurf-core.mjs';

export const prerender = false;

/**
 * POST /api/entwurf
 * Body: { url: string, companyName?: string, apiKey?: string }
 *
 * Antwort: Server-Sent Events (text/event-stream) mit Fortschritt + finalem HTML.
 *   event: progress  → { message }
 *   event: done      → { html, filename, meta }
 *   event: error     → { message }
 *
 * Der API-Key kommt aus dem ENV (ANTHROPIC_API_KEY) oder optional aus dem Body
 * (für lokale Nutzung). Body-Key hat Vorrang.
 */
export const POST: APIRoute = async ({ request }) => {
  let body: { url?: string; companyName?: string; apiKey?: string };
  try {
    body = await request.json();
  } catch {
    return json({ message: 'Ungültiger Request-Body (JSON erwartet).' }, 400);
  }

  const url = normalizeUrl(body.url || '');
  const companyName = body.companyName?.trim() || null;
  const apiKey = body.apiKey?.trim() || import.meta.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;

  if (!url) return json({ message: 'Bitte eine URL angeben.' }, 400);
  if (!apiKey) return json({ message: 'Kein API-Key konfiguriert. ANTHROPIC_API_KEY setzen oder im Formular eingeben.' }, 400);

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };
      const progress = (message: string) => send('progress', { message });

      try {
        const data = await scrapeWebsite(url, { onProgress: progress });
        const html = await generateEntwurf(data, {
          apiKey, companyName, sourceUrl: url, onProgress: progress,
        });

        const name = detectCompanyName(data, companyName);
        const slug = makeSlug(name, url);
        const date = new Date().toISOString().slice(0, 10);

        send('done', {
          html,
          filename: `${slug}-entwurf-${date}.html`,
          meta: {
            name,
            phone: data.phone || null,
            email: data.email || null,
            address: data.address || null,
            images: data.images.length,
            headings: data.headings.length,
            paragraphs: data.paragraphs.length,
          },
        });
      } catch (err: any) {
        send('error', { message: err?.message || 'Unbekannter Fehler.' });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
