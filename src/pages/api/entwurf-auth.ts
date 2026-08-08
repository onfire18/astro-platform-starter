import type { APIRoute } from 'astro';
import { COOKIE_NAME, cookieWert, getPin, pinKorrekt } from '../../lib/entwurf-auth';

export const prerender = false;

/**
 * POST /api/entwurf-auth
 * Body JSON: { pin }
 *
 * Setzt bei korrektem PIN ein HttpOnly-Cookie. Der PIN selbst wird nie an den
 * Browser ausgeliefert — anders als vorher, wo er im Seitenquelltext stand.
 */
export const POST: APIRoute = async ({ request, cookies }) => {
  if (!getPin()) {
    return json({ message: 'Kein Zugang konfiguriert. ENTWURF_PIN als Umgebungsvariable setzen.' }, 503);
  }

  let body: { pin?: string };
  try {
    body = await request.json();
  } catch {
    return json({ message: 'Ungültiger Request-Body (JSON erwartet).' }, 400);
  }

  if (!pinKorrekt(body.pin ?? '')) {
    return json({ message: 'Falscher PIN.' }, 401);
  }

  cookies.set(COOKIE_NAME, cookieWert()!, {
    httpOnly: true,
    sameSite: 'strict',
    secure: import.meta.env.PROD,
    path: '/',
    maxAge: 60 * 60 * 8,
  });

  return json({ ok: true }, 200);
};

/** Abmelden — sonst bliebe die Sitzung acht Stunden offen. */
export const DELETE: APIRoute = async ({ cookies }) => {
  cookies.delete(COOKIE_NAME, { path: '/' });
  return json({ ok: true }, 200);
};

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
