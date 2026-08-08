import { createHash, timingSafeEqual } from 'node:crypto';

/**
 * Zugangsprüfung für das interne Entwurf-Tool.
 *
 * Vorher lag der PIN im `define:vars` des Seiten-Skripts und stand damit im
 * ausgelieferten HTML (`correctPin = "mediadrift"`); die API `/api/entwurf`
 * prüfte gar nichts. Der PIN-Schirm war reine Dekoration.
 *
 * Jetzt: Der PIN verlässt den Server nie. Nach erfolgreicher Anmeldung setzt
 * `/api/entwurf-auth` ein HttpOnly-Cookie mit dem Hash des PIN; Seite und API
 * prüfen dieses Cookie serverseitig.
 */

export const COOKIE_NAME = 'md_entwurf';

/** Aus der Umgebung, ohne Fallback: ein veröffentlichter Standard-PIN wäre kein Schutz. */
export function getPin(): string | null {
  const pin = import.meta.env.ENTWURF_PIN || process.env.ENTWURF_PIN || '';
  return pin.trim() ? pin.trim() : null;
}

function hash(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

/** Vergleich in konstanter Zeit — ein Längen- oder Zeitunterschied verrät sonst den PIN. */
function sicherGleich(a: string, b: string): boolean {
  const ba = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export function pinKorrekt(eingabe: string): boolean {
  const pin = getPin();
  if (!pin) return false;
  // Beide Seiten hashen: timingSafeEqual verlangt gleiche Länge, und der Hash
  // hat sie immer — sonst würde schon die Länge des Versuchs etwas verraten.
  return sicherGleich(hash(eingabe), hash(pin));
}

export function cookieWert(): string | null {
  const pin = getPin();
  return pin ? hash(pin) : null;
}

/** Prüft den Cookie-Wert eines Requests. Ohne gesetzten ENTWURF_PIN immer false. */
export function istAngemeldet(wert: string | undefined | null): boolean {
  const soll = cookieWert();
  if (!soll || !wert) return false;
  return sicherGleich(wert, soll);
}
