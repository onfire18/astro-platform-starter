# PROGRESS — Street Activation Landingpage

Checkliste (Definition of Done). Fertig = alles `[x]`.

## Sektionen
- [x] Navigation (sticky, Logo + Button) — Schlanke Sticky-Bar mit Logo-Platzhalter links und „Erstgespräch"-Button rechts, mit Blur-Effekt.
- [x] Sektion 1 Hero (Headline/Unterheadline wörtlich, Reel-Platzhalter, Text lesbar) — Headline & Unterheadline wörtlich übernommen, Video-Element mit dunklem Overlay-Verlauf, Fallback-Fläche wenn Reel fehlt.
- [x] Sektion 2 Vorstellungsvideo (Hook-Text mit Pause, Video-Platzhalter, klick-to-play) — Zweizeiliger Hook mit optischer Pause (2. Zeile in Akzentfarbe), Video mit Play-Overlay, startet erst per Klick mit Ton.
- [x] Sektion 3 Warum wir? (5 Emoji-Punkte, „Millionen Views" ersetzt) — 5 Karten mit Emojis, „Hohe Reichweiten & starke Interaktionen" statt Views-Versprechen.
- [x] Sektion 4 Ablauf-Animation (Kette mit Scroll-Reveal, kein Fließtext) — 7 Schritt-Pillen mit Pfeilen dazwischen, erscheinen gestaffelt beim Scrollen, letzter Schritt „Mehr Umsatz" in Akzentfarbe.
- [x] Sektion 5 Formate (3 große Karten) — Straßeninterviews / Challenges / Individuelle Aktionen mit Hover-Effekt und Stichpunkten.
- [x] Sektion 6 Beispiele (6 Video-Kacheln als Platzhalter) — 6 hochkant-Kacheln (Burger King, Forum, Cookie Shop, Pommes, Pizza, Fitnessstudio) mit „Video folgt"; erkennen Videodateien automatisch und öffnen dann eine Lightbox.
- [x] Sektion 7 Warum funktioniert das? (Text + ✔-Liste) — Kraftvoller Textblock + 5 Häkchen-Punkte in Gelb.
- [x] Sektion 8 Zahlen (5 Kacheln, Zähl-Animation, Platzhalter) — 5 Kacheln zeigen „XX" bis Paul echte Zahlen in `ZAHLEN` (js/main.js) einträgt; dann Zähl-Animation von 0 beim Erscheinen.
- [x] Sektion 9 Für wen? (8 Zielgruppen) — 8 Chips mit Emojis, zentriert ab Desktop.
- [x] Sektion 10 Finaler CTA (stärkster Moment, Button) — Vollflächiger roter Verlauf, größte Headline, weißer Kontrast-Button.
- [x] Footer + Impressum + Datenschutz — Footer mit Marke, Kontakt-Platzhaltern und Links; beide Rechtsseiten als vollständiges Platzhalter-Gerüst (kein erfundener Text).

## Technik
- [x] Kein horizontaler Scroll bei 360px — Im Browser geprüft (Playwright): index, impressum, datenschutz alle scrollWidth = clientWidth = 360. (Fix: Silbentrennung für lange Wörter wie „Datenschutzerklärung".)
- [x] Alle Buttons zeigen auf zentrale `BUCHUNGS_LINK`-Variable — 3 Buttons mit Klasse `js-buchung`, Link wird zentral in js/main.js gesetzt; ohne Link scrollen sie zum CTA.
- [x] Scroll-Animationen laufen + respektieren reduced-motion — IntersectionObserver mit Staffelung; bei reduced-motion alles sofort sichtbar.
- [x] `prefers-reduced-motion` getestet — Im Browser mit emuliertem reduced-motion geprüft: 0 unsichtbare Elemente, keine Animationen.
- [x] Alle Videos korrekt (Hero muted/autoplay, Content klick-to-play) — Hero: muted/autoplay/loop/playsinline; Vorstellungsvideo & Beispiele: klick-to-play mit Poster und Ton.
- [x] Bilder lazy, Videos preload=metadata — Alle Videos preload="metadata"; Poster werden erst geladen, wenn die Datei existiert; keine schweren Bilder eingebunden.
- [x] SEO-Tags + genau eine `<h1>` — title, description, OG-Tags gesetzt; h1-Anzahl im Browser geprüft: genau 1 pro Seite.
- [x] Kontrast & alt-Texte ok — Heller Text (#F5F5F7) auf Dunkel (#0B0B0F), Emojis mit aria-hidden, Videos mit title, Buttons als echte <a>/<button>, sichtbare Fokus-Ringe in Gelb.
- [x] `PLATZHALTER.md` vollständig (alles Fehlende gelistet) — Alle Videos, Zahlen, Logo, Links, Kontakt und Rechtstexte als Einkaufsliste dokumentiert.
- [x] DSGVO-Check gelaufen (falls Skill da) + Findings behoben — Eigener DSGVO-Skill nicht verfügbar → manuell geprüft: kein Tracking, keine Cookies, keine Auto-Embeds von Drittanbietern, Buchungs-Tool nur als externer Link, Rechtsseiten verlinkt. Offener Punkt (Google Fonts lokal hosten) in PLATZHALTER.md dokumentiert.

## Optimierung Runde 2 (auf Basis Zielgruppenanalyse + Recherche)
- [x] Duo-Sektion „Strategie trifft Straße" — Isabelle (Marke & Produktion) × Paul (Reichweite & Energie) mit Foto-Platzhaltern, Kurzprofilen und Links zu beiden Agenturen + Instagram.
- [x] FAQ-Sektion „Ehrliche Antworten" vor dem finalen CTA — beantwortet die zwei echten Einwände (Wirkung, Angst) plus Recht & Preis; native <details>-Elemente, barrierearm.
- [x] Beweis-Dreiklang + Publikums-Argument — Intro über den Zahlen: „Plätze gefüllt, Videos viral, Läden voller — Publikum 16 bis 50."
- [x] Lokale Verankerung — „München & Umgebung" in Hero, Footer, title und Meta-Description (als zu bestätigender Punkt in PLATZHALTER.md notiert).
- [x] Footer-Partner-Zeile — „Eine Zusammenarbeit von wir-machen-content.de × mediadrift.org" + beide Instagram-Handles.
- [x] Beispiele Gastro-first sortiert — Burger King, Pommes, Pizza, Cookie Shop vor Forum und Fitnessstudio (Kernzielgruppe zuerst).
- [x] Browser-Check wiederholt — kein horizontaler Scroll bei 360px, eine <h1>, FAQ auf/zu funktioniert, reduced-motion ok.

## Optimierung Runde 3 (Mobile)
- [x] Sticky Buchungs-Leiste am unteren Rand (nur Handy) — erscheint nach dem Hero, verschwindet am finalen CTA; safe-area-inset für iPhone-Homebalken; getestet.
- [x] Beispiele als 2-Spalten-Reel-Grid schon am Handy — halbiert die Scroll-Länge, wirkt wie ein Reels-Feed.
- [x] „Warum wir?"-Karten kompakter (weniger Padding) — 5 Karten stapeln nicht mehr endlos.
- [x] Hero-Höhe mit svh-Einheit — stabil trotz ein-/ausblendender Browser-Leiste am Handy.
- [x] iOS-Safari-Fixes — -webkit-backdrop-filter (Nav + Sticky-Leiste), -webkit-hyphens.
- [x] Browser-Test 360px — kein horizontaler Scroll, keine JS-Fehler, Sticky-Logik verifiziert.

## Optimierung Runde 4 (Inhalte)
- [x] Echte TikTok-Beispielvideos (Burger King, Forum) mit DSGVO-Zwei-Klick-Lösung; lokale MP4s behalten Vorrang.
- [x] Referenzen-Sektion „Marken, die uns vertrauen" — Logo-Marquee mit 9 echten Partner-Logos (aus Vorlage übernommen, ins Design-System übersetzt): Endlos-Lauf, Hover-Pause, Kanten-Fades, reduced-motion = statisch scrollbar; platziert nach den Beispielen.

## Wirkung
- [x] „30-Sekunden-Test" — Hero-Botschaft + Hook + Video-Play + Zahlen-Kacheln stehen in den ersten zwei Scroll-Screens; ein einziges Ziel (Erstgespräch) von der Navigation bis zum CTA.
- [x] Es liest sich wie eine Sales-Page, nicht wie eine Agentur-Website — Kein Menü, keine Leistungsübersicht, eine durchgehende Argumentationslinie Richtung CTA.
- [x] Nirgends steht „Wir bringen euch Millionen Views" o. Ä. — Formulierung überall: Formate „mit dem Potenzial für hohe Reichweiten und starke Interaktionen".
