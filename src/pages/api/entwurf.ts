import type { APIRoute } from 'astro';
// @ts-ignore
import { scrapeWebsite, generateEntwurf, detectCompanyName, makeSlug, normalizeUrl } from '../../lib/entwurf-core.mjs';

export const prerender = false;

/**
 * POST /api/entwurf
 * Body JSON: { url, companyName?, industry?, apiKey? }
 *
 * Antwort: Server-Sent Events (text/event-stream)
 *   event: progress  → { message: string }
 *   event: done      → { html, filename, meta }
 *   event: error     → { message: string }
 */
export const POST: APIRoute = async ({ request }) => {
  let body: { url?: string; companyName?: string; industry?: string; apiKey?: string };
  try {
    body = await request.json();
  } catch {
    return jsonErr('Ungültiger Request-Body (JSON erwartet).');
  }

  const url      = normalizeUrl(body.url || '');
  const company  = body.companyName?.trim() || null;
  const industry = body.industry?.trim() || null;
  const apiKey   =
    body.apiKey?.trim() ||
    (import.meta.env.ANTHROPIC_API_KEY as string | undefined) ||
    (process.env.ANTHROPIC_API_KEY as string | undefined) ||
    '';

  if (!url)    return jsonErr('Bitte eine URL angeben.', 400);
  if (!apiKey) return jsonErr('Kein API-Key. ANTHROPIC_API_KEY als Umgebungsvariable setzen oder im Formular eingeben.', 400);

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      };

      try {
        const data = await scrapeWebsite(url, {
          onProgress: (msg: string) => send('progress', { message: msg }),
        });

        const html = await generateEntwurf(data, {
          apiKey,
          companyName: company,
          industry,
          sourceUrl: url,
          onProgress: (msg: string) => send('progress', { message: msg }),
        });

        const name     = detectCompanyName(data, company);
        const slug     = makeSlug(name, url);
        const date     = new Date().toISOString().slice(0, 10);

        send('done', {
          html,
          filename: `${slug}-entwurf-${date}.html`,
          meta: {
            name,
            phone:      data.phone      || null,
            email:      data.email      || null,
            address:    data.address    || null,
            images:     data.images?.length     ?? 0,
            headings:   data.headings?.length   ?? 0,
            paragraphs: data.paragraphs?.length ?? 0,
          },
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        send('error', { message: msg });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type':  'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection':    'keep-alive',
      'X-Accel-Buffering': 'no',   // Nginx-Buffering deaktivieren
    },
  });
};

function jsonErr(message: string, status = 400) {
  return new Response(JSON.stringify({ message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
