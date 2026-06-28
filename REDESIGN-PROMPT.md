# MediaDrift – Vollständige Website-Überarbeitung

## Kontext für Claude

Du arbeitest an der Website von **MediaDrift**, einer deutschen Webdesign-Agentur.

- **Tech-Stack:** Astro 4.16 · Hybrid-Output · @astrojs/netlify
- **Branch:** `claude/website-deployment-security-dpw830` auf `onfire18/astro-platform-starter`
- **Arbeitsverzeichnis:** `/home/user/astro-platform-starter`
- **Seiten:** `index.astro`, `webdesign.astro`, `ueber-uns.astro`, `vertrieb.astro`, `agb.astro`, `datenschutz.astro`, `impressum.astro`, `404.astro`
- **Shared Components:** `src/components/md/Nav.astro`, `Footer.astro`, `Assistant.astro`, `ConsentBanner.astro`
- **Basis-CSS:** `src/styles/mediadrift.css` (CSS-Variablen, Emil Kowalski Easing, globale Klassen)
- **Installierte Skills:** 96 Skills (Emil Design Eng, Impeccable, Taste-Skill, Caveman, Firecrawl, Marketing-Skills, UI/UX Pro Max u.v.m.)

---

## VERBINDLICHE SICHERHEITSREGELN (niemals verletzen)

1. **Erfinde keine Kunden, Referenzen, Bewertungen, Umsätze oder Ergebnisse** — keine erfundenen Zahlen, Testimonials, Kundennamen, Statistiken.
2. **Keine externen Fonts ohne Einwilligung** — nur self-hosted: `@fontsource/dm-serif-display` + `@fontsource-variable/jost`.
3. **Keine automatisch geladenen YouTube-Inhalte, Karten oder Social-Media-Pixel.**
4. **Ungeklärte rechtliche Punkte** → mit `[RECHTLICH PRÜFEN]` markieren.
5. **AGB sichtbar als Entwurf kennzeichnen.**
6. **Kein Pull Request** ohne explizite Aufforderung.
7. Nach jeder größeren Änderung: `npm run build` ausführen und Build-Erfolg bestätigen.
8. Commit und Push auf Branch `claude/website-deployment-security-dpw830`.

---

## DEINE AUFGABE

Überarbeite die gesamte MediaDrift-Website vollständig – visuell, inhaltlich und technisch.  
**Beginne mit den folgenden Fragen, bevor du eine einzige Zeile Code schreibst.**

---

## PHASE 1 – STRATEGIE-FRAGEN (zuerst beantworten lassen)

Stelle dem Nutzer diese Fragen und warte auf Antworten, bevor du weitermachst:

### 1. Design-Richtung
> Welcher visuelle Stil soll die überarbeitete Website haben?
> - A) **Modern Minimal** – viel Weißraum, klare Typografie, dezente Animationen (wie Linear, Stripe)
> - B) **Premium Dark** – dunkles Farbschema, Glassmorphism, leuchtende Akzente (wie Vercel, Raycast)
> - C) **Warm & Persönlich** – warme Farben, organische Formen, menschliche Fotos (wie Mailchimp, Notion)
> - D) **Anderes** → Beschreibung des gewünschten Stils

### 2. Zielgruppe & Ton
> Wen spricht MediaDrift hauptsächlich an?
> - A) Lokale Einzelunternehmer & Handwerksbetriebe (Du-Ansprache, bodenständig)
> - B) Mittelständische Unternehmen & Kanzleien (Sie-Ansprache, professionell)
> - C) Beide gleichermaßen
> - D) Startups & moderne Unternehmen (informell, innovativ)

### 3. Hauptziel der Überarbeitung
> Was ist die wichtigste Verbesserung?
> - A) Mehr Anfragen durch bessere CTAs und Conversion-Optimierung
> - B) Professionellerer visueller Eindruck (Design-Qualität)
> - C) Klarere Kommunikation des Angebots (Texte & Struktur)
> - D) Alle drei gleichwertig

### 4. Hero-Section
> Was soll der Besucher als erstes sehen?
> - A) Starke Headline + Subline + CTA (aktueller Ansatz, verbessert)
> - B) Großes Video-Background oder animierter Hero
> - C) Split-Screen: Text links, Mockup/Bild rechts
> - D) Vollbild-Hintergrundbild mit Overlay-Text

### 5. Neue Sektionen oder Inhalte
> Was soll neu hinzukommen oder erweitert werden?
> - A) Preisübersicht / Pakete (z.B. Starter, Professional, Premium)
> - B) Vor-/Nachher-Vergleiche (Split-Screen: alte vs. neue Website)
> - C) Prozess-Timeline (wie läuft ein Projekt ab – detaillierter)
> - D) Testimonials / Bewertungen (nur wenn echte vorhanden)
> - E) FAQ erweitern
> - F) Nichts Neues – nur optimieren was da ist

### 6. Farben & Branding
> Sollen die Farben angepasst werden?
> - A) Behalte Blau (`#0369A1`) als Hauptfarbe
> - B) Wechsle zu einer anderen Hauptfarbe → welche?
> - C) Füge eine zweite Akzentfarbe hinzu → welche?
> - D) Komplett neues Farbsystem

### 7. Bilder & Medien
> Woher kommen neue Bilder für die Überarbeitung?
> - A) Nur CSS/SVG/Animationen – keine echten Fotos
> - B) Ich lade eigene Fotos hoch (📎)
> - C) KI-generierte Mockup-Bilder (als „Musterdesign" gekennzeichnet)
> - D) Placeholder – Bilder kommen später

### 8. Mobile-First oder Desktop-First?
> Welches Gerät hat bei der Überarbeitung Priorität?
> - A) Mobile-First (70%+ der Besucher kommen per Handy)
> - B) Desktop-First (Zielkunden sitzen am Computer)
> - C) Gleichwertig

---

## PHASE 2 – TECHNISCHE FRAGEN

Stelle diese Fragen nach Phase 1:

### 9. Performance-Ziel
> Welches Lighthouse-Score-Ziel?
> - A) 90+ in allen Kategorien (Performance, A11y, SEO, Best Practices)
> - B) 95+ Performance (stark optimiert)
> - C) Kein spezifisches Ziel – einfach besser als vorher

### 10. SEO-Fokus
> Welche Keywords soll die Seite ranken?
> - A) „Webdesign [Stadt]" (lokale SEO)
> - B) „Webdesign Agentur" (national)
> - C) Branchenspezifisch (z.B. „Website für Kanzleien")
> - D) Aktuell kein SEO-Fokus

### 11. Analytics
> Soll Tracking eingebaut werden?
> - A) Nein – vollständig cookiefrei (aktueller Stand)
> - B) Datenschutzfreundliches Analytics (z.B. Plausible, ohne Cookie)
> - C) Google Analytics 4 (mit Cookie-Consent)

---

## PHASE 3 – UMSETZUNGSPLAN

Nachdem du alle Antworten gesammelt hast, erstelle einen **strukturierten Plan** nach diesem Format:

```
## Überarbeitungsplan für MediaDrift

### Design-Entscheidungen
- Stil: [Antwort]
- Farben: [Antwort]
- Typografie: [bestehend / angepasst]

### Seiten-Reihenfolge der Bearbeitung
1. src/styles/mediadrift.css (globale Basis)
2. src/pages/index.astro (Hauptseite)
3. src/components/md/Nav.astro + Footer.astro
4. src/pages/webdesign.astro
5. src/pages/ueber-uns.astro
6. src/pages/vertrieb.astro
7. src/pages/404.astro

### Neue Elemente
- [Liste neuer Sektionen / Features]

### Zu entfernende Elemente
- [Was rausfliegt]

### Skills die eingesetzt werden
- [Welche der 96 installierten Skills relevant sind]
```

Erst nach Freigabe des Plans → Umsetzung beginnen.

---

## PHASE 4 – UMSETZUNG

Arbeite Seite für Seite. Nach jeder Seite:
1. `npm run build` → Build-Erfolg bestätigen
2. Kurze Zusammenfassung der Änderungen
3. Fragen ob du weitermachen sollst oder Anpassungen gewünscht sind

**Verwende bevorzugt Sub-Agenten** für parallele Arbeiten an verschiedenen Seiten (aber nie gleichzeitig an `mediadrift.css` oder `index.astro`).

### Animationsregeln (Emil Kowalski – immer einhalten)
- Custom Easing: `var(--ease-out)` = `cubic-bezier(0.23, 1, 0.32, 1)`
- Kein `transition: all` – immer exakte Properties
- Hover-States in `@media (hover: hover) and (pointer: fine)`
- `:active { transform: scale(0.97) }` auf Buttons
- Nur `transform` + `opacity` animieren (GPU)
- `prefers-reduced-motion` immer respektieren

---

## ABSCHLUSS-CHECKLISTE

Nach vollständiger Überarbeitung prüfe:

- [ ] Alle Seiten bauen fehlerfrei (`npm run build`)
- [ ] Keine erfundenen Inhalte (Zahlen, Testimonials, Kundennamen)
- [ ] Keine externen Fonts eingebunden
- [ ] Alle Hover-States in `@media (hover: hover)`
- [ ] `prefers-reduced-motion` überall berücksichtigt
- [ ] DSGVO-Consent-Banner funktioniert
- [ ] Kontaktformular funktioniert (inkl. Honeypot + Rate-Limiter)
- [ ] Security-Headers in `netlify.toml` erhalten
- [ ] Mobile-Ansicht geprüft (max-width: 480px)
- [ ] Alle Commits auf Branch `claude/website-deployment-security-dpw830`
- [ ] Kein Pull Request erstellt (es sei denn explizit gewünscht)

---

*Dieser Prompt wurde für das Projekt `onfire18/astro-platform-starter` erstellt.*
*Branch: `claude/website-deployment-security-dpw830`*
