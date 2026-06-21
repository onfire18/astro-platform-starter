export interface Industry {
  id: string;
  label: string;
  headline: string;
  subline: string;
  pages: string[];
  accent: string;
  /** Optionales Musterdesign-Bild (Beispielentwurf, keine echten Kundendaten). Pfad relativ zu /public, z.B. '/images/branchen/immobilien.jpg'. Wenn gesetzt, ersetzt es den SVG-Wireframe. */
  image?: string;
  /** Alt-Text für das Musterdesign-Bild. */
  imageAlt?: string;
}

export const industries: Industry[] = [
  {
    id: 'kanzlei',
    label: 'Kanzleien',
    headline: 'Vertrauen beginnt noch vor dem Erstgespräch.',
    subline: 'Klare Positionierung, Leistungsgebiete und ein professioneller erster Eindruck für Anwälte und Steuerberater.',
    pages: ['Startseite', 'Leistungsgebiete', 'Team', 'Mandanten-FAQ', 'Kontakt'],
    accent: '#1e3a5f',
  },
  {
    id: 'handwerk',
    label: 'Handwerk',
    headline: 'Zeigen Sie, was Sie können – bevor der Kunde anruft.',
    subline: 'Mobile-optimierte Auftritte für Handwerksbetriebe mit Projektfotos, Leistungsübersicht und direkter Anfrage.',
    pages: ['Startseite', 'Leistungen', 'Referenzprojekte', 'Einsatzgebiet', 'Anfrage'],
    accent: '#7c3626',
  },
  {
    id: 'immobilien',
    label: 'Immobilien',
    headline: 'Hochwertig präsentieren – hochwertig verkaufen.',
    subline: 'Professionelle Online-Auftritte für Makler mit Objektpräsentation, Bewertungsanfrage und Expertenprofil.',
    pages: ['Startseite', 'Aktuelle Angebote', 'Bewertung anfragen', 'Über mich', 'Kontakt'],
    accent: '#1a4731',
  },
  {
    id: 'gastronomie',
    label: 'Gastronomie',
    headline: 'Ihr Restaurant – auch online ein Erlebnis.',
    subline: 'Appetitliche Websites mit digitaler Speisekarte, Reservierungsmöglichkeit und der Geschichte dahinter.',
    pages: ['Startseite', 'Speisekarte', 'Reservierung', 'Galerie', 'Über uns'],
    accent: '#5c2a0e',
  },
  {
    id: 'beratung',
    label: 'Beratung & Coaching',
    headline: 'Kompetenz, die man sofort spürt.',
    subline: 'Positionierungsstarke Websites für Coaches und Berater mit klarem Angebot und direktem Erstkontakt.',
    pages: ['Startseite', 'Mein Angebot', 'Meine Methode', 'Über mich', 'Erstgespräch'],
    accent: '#2d1b69',
  },
  {
    id: 'dienstleister',
    label: 'Lokale Dienstleister',
    headline: 'Gefunden werden – und sofort überzeugen.',
    subline: 'Regional optimierte Websites für lokale Unternehmen mit klarer Leistungsdarstellung und Kontaktweg.',
    pages: ['Startseite', 'Leistungen', 'Einzugsgebiet', 'Über uns', 'Kontakt & Angebot'],
    accent: '#1a3a4a',
  },
];
