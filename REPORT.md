# Auto-Verbesserungs-Loop — Abschlussbericht

**Branch:** `claude/website-deployment-security-dpw830`
**Datum:** 2026-06-26
**Gesamt-Durchgänge:** 14 (Iter 0–5 Phase A + B1–B8 Phase B)

---

## Phase A — Vertrieb-Seite persönlicher (6 Iterationen)

**Ziel:** Die Vertrieb-Seite auf "Leute von 0 auf 100 ausbilden — Einsteiger UND Profis, wichtig ist nur Motivation" ausrichten.

| Iter | Commit | Was |
|------|--------|-----|
| 0 | `7b4e2d2` | Neue Kern-Sektion „Du musst nur wollen" (dunkler Navy-Block); Reframe „Für wen"-Karten; Hero-Subline |
| 1 | `8a6de0e` | Sales-FAQ komplett umgeschrieben: Lead-Frage „Ich hab noch nie etwas verkauft", neues Langzeit-Lernpfad-FAQ |
| 2 | `bd49c3b` | „Dein Lernweg"-Timeline: Woche 1 → Monat 3 → ab Monat 6 eigenes Unternehmen |
| 3 | `d153710` | Paul-Signatur (kursiv, leicht rotiert); Einsteiger-Satz; Support-Intro → Mentoring |
| 4 | `63db645` | Meta-Title & Description auf 0-auf-100; Closing-CTA „Motiviert — aber noch unsicher?" |
| 5 | `cd6d0da` | Formular-Label „Erfahrung im Verkauf?" → „Erzähl kurz von dir" (letzter Widerspruch beseitigt) |

**Ergebnis:** Die gesamte Vertrieb-Seite sendet eine einheitliche Botschaft — kein Vorwissen nötig, verdienen + lernen, Sprungbrett für eigenes Unternehmen. Kein einziger versteckter Widerspruch mehr.

---

## Phase B — Allgemeiner Website-Audit (8 Iterationen)

**Vorgehen:** Audit aller Seiten gegen Design-Skills und A11y-Standards → priorisierte Liste → je 1 Verbesserung pro Durchgang.

| Iter | Commit | Datei | Was |
|------|--------|-------|-----|
| B1 | `0f491f7` | Nav.astro | `focus-visible` Outlines auf Nav-Links, CTA und Mobile-Menü (WCAG 2.4.7) |
| B2 | `070f809` | blog/index.astro | Blog-Grid 2-Spalten-Breakpoint von 900px auf 1100px erhöht (Tablet-Layout) |
| B3 | `c32829d` | ueber-uns.astro | `loading="lazy" decoding="async"` auf Profilbild |
| B4 | `31e1cc5` | webdesign.astro | Hover-States auf beide Compare-Karten; Filler-Phrase → konkreter Kostenvorteil |
| B5 | `3e396b8` | ueber-uns.astro | „Direktkontakt" → „Persönlicher Kontakt"; 24h-Reaktionszeit ergänzt |
| B6 | `df00c4e` | index.astro | Sales-Teaser auf 0-auf-100-Theme umgeschrieben (Badge, Headline, Copy) |
| B7 | `f225901` | Nav.astro, Footer.astro | Nav-Logo `eager`, Footer-Logo `lazy` + `decoding="async"` |
| B8 | `e14a9df` | vertrieb.astro | `decoding="async"` auf Testimonial-Bilder — alle Bilder komplett |

---

## Phase C — Dauerhafter Verbesserungs-Loop (läuft)

Selbst-neustartender Loop, ein echter Verbesserungsschritt pro Durchgang. Stoppt nur auf User-„stopp".

| Iter | Commit | Was |
|------|--------|-----|
| C1 | `030c4c2` | Beschreibende Alt-Texte auf Referenz-Screenshots (SEO + A11y) |
| C2 | `a44f44e` | On-brand Platzhalter-Bilder (sharp): Paul-Porträt + 2 Testimonial-Avatare — externe KI-Bilddienste sind netzwerkseitig blockiert |
| C3 | `76fcc80` | 5 Raster-OG-Bilder (1200×630 JPG) pro Seite verdrahtet (SVG-OG wird sozial nicht angezeigt) + `WEBSITE-BLUEPRINT.md` Übergabe-Dokument |
| C4 | `dd4f2df` | Individualitäts-Mandat (§0) im Blueprint: Cobalt/Outfit = nur MediaDrift-Identität, keine Vorlage für Kundenseiten |
| C5 | `cbbe063` | Blog-Kategorie-Chips mit `aria-label="Kategorie: …"` |
| C6 | `e54e3da` | Aktive-Seite-Markierung + `aria-current` im Mobile-Menü (Parität zur Desktop-Nav) |
| C7 | `fc96f01` | 404-Seite: Direktlinks zu Hauptseiten, `70dvh`, Focus-Outlines |
| C8 | `29f8748` | Report-Meilenstein (Phase-C-Log C1–C7) |
| C9 | `fa58670` | `IconWhatsApp.astro`-Komponente — 11 duplizierte Inline-SVGs ersetzt (index 5×, vertrieb 4×, ueber-uns, Footer) |
| C10 | `560bb6d` | `--md-subtle` verdunkelt auf #54718E — WCAG AA bestanden (4.53:1 auf bg, vorher 3.66:1) |
| C11 | `b1f3332` | Blog-Artikel: Blog-OG-Bild, Focus-States auf Links, Related-Grid-Breakpoint-Parität (1100px) |
| C12 | `c4b9e95` | aria-hidden-Focus-Trap im Hero-Slider behoben (fokussierbare Controls waren für Screenreader versteckt — WCAG 4.1.2) |
| C13 | `a1e48a3` | robots.txt: interne Tools (/tools/) + Starter-Demo-Seiten (crm, invoice, blobs, edge, …) für Crawler gesperrt |
| C14 | `5401f5b` | apple-touch-icon (180×180 aus Logo generiert) + theme-color #0A0A0A im Head |
| C15 | `6bd0e5e` | Roving-Tabindex auf Branchen-Tabs (WAI-ARIA-Tabs-Pattern vervollständigt) |
| C16 | `e1a54f2` | Report-Meilenstein (C8–C15) |
| C17 | `9293e3b` | entwurf-Tool: PIN-Label, `role=alert` für PIN-Fehler, `role=log`+`aria-live` fürs Fortschritts-Log, Focus-States |
| C18 | `5063be3` | Mobile-Sticky-Bar: versteckte Links aus Tab-Order entfernt (visibility+aria-hidden synchron); WhatsApp-Button & Assistant heben sich jetzt über die Bar statt überdeckt zu werden |
| C19 | `ba1b2d6` | Assistant-Dialog: Eintritts-Animation (Drawer-Kurve, reduced-motion-Guard) + max-height/Scroll für kleine Screens |
| C20 | `ebf3f03` | Falsche SearchAction aus WebSite-Schema entfernt (Blog hat keine Suche — tote Sitelinks-Suchbox riskiert) |
| C21 | `a6c64ac` | **BUGFIX:** Vertrieb-Formular validierte nie (novalidate ohne JS-Check) — leere Bewerbungen gingen als „Erfolg" durch. Jetzt: aria-invalid, rote Markierung, Fokus aufs erste Fehlerfeld, Live-Region-Meldung |
| C22 | `f405952` | Copy-Widerspruch: webdesign-CTA „48 Stunden Einschätzung" → einheitlich „Entwurf am nächsten Tag, kostenlos & unverbindlich" |
| C23 | `b74a81d` | Fokusring auf dunklen Flächen (Hero, Footer, v-closing, Artikel): Cobalt 2,46:1 → helles Blau 7:1 (WCAG-Fokus-Sichtbarkeit) |
| C24 | `c62f1b0` | Report-Meilenstein (C16–C23) |
| C25 | `c35ebf3` | **Performance:** Hero-Slider-Screenshots PNG→WebP: 1,83 MB→99 KB + 1,35 MB→123 KB (−95 %), `fetchpriority="high"` aufs LCP-Bild |
| C26 | `0cea931` | Referenz-Bilder PNG→WebP (1,99 MB→118 KB; 1,32 MB→55 KB) + 4 MB unreferenzierte Dateien gelöscht (ref-vivacasa ×2, rupert.png) |
| C27 | `74feb2f` | Paul-Porträt 451 KB JPEG→183 KB WebP @840px (Korrektur: Commit-Message nannte fälschlich „~50 KB") |
| C28 | `312d80a` | 44px-Touch-Targets für Anrufen/WhatsApp auf ueber-uns (WCAG 2.5.8) |
| C29 | `ea4d306` | Touch-Target-Sweep: Footer-Kontaktlinks 44px + Nav-Padding, Blog-Breadcrumb 44px |
| C30 | `0973b1c` | Blueprint-Checkliste §7 um alle C-Phase-Erkenntnisse erweitert (Touch-Targets, novalidate-Validierung, dunkle Fokusringe, Bild-Budget, ehrliche Schema-Daten, Copy-Konsistenz) |
| C31 | `29b6fa6` | **iOS-Fokus-Zoom behoben:** Formular-Inputs (Kontakt + Bewerbung) hatten 15,2px Schrift → `max(0.95rem, 16px)`; v-input zusätzlich 44px Mindesthöhe |
| C32 | `6d62cb6` | Report-Meilenstein (C24–C31) |
| C33 | `ecf1a26` | **Blog-Pagination:** 176 Artikel rendern nicht mehr auf einer Seite — Featured + 24/Seite, ältere unter `/blog/seite/2–8`; Index-HTML 152 KB → 44 KB (−71 %) |
| C34 | `2156990` | Sitemap um die 7 paginierten Blog-Seiten ergänzt |
| C35 | `e35acdf` | Kontakt-Avatar profilbild: 96 KB JPEG (1080px) → 3,4 KB WebP (128px) |
| C36 | `d500e29` | Consent-Banner UX: 44px-Buttons, `100dvh`-Überlauf-Schutz, sanfter Eintritt mit reduced-motion-Guard (Semantik unangetastet) |
| C37 | `f9faab4` | autoflowki-Referenzbild 157 KB PNG → 39 KB WebP — Bild-Budget der Seite damit komplett eingehalten |
| C38 | `87c43cf` | Assistant-Flow-Copy: Kernversprechen („Entwurf am nächsten Tag") im Neue-Website-Schritt, Vertriebs-Schritt in Du-Form/„0 auf 100"-Ton |
| C39 | `83f4909` | webdesign Service-Icons korrigiert: „UI/UX Design" zeigte eine Uhr, „Betreuung" ein Balkendiagramm → Stift/Rettungsring im Bestandsstil |
| C40 | `d784d2a` | Report-Meilenstein (C32–C39) |
| C41 | `3c178fe` | FAQ-Politur: Antworten faden sanft ein, `name`-Attribut macht die Accordions exklusiv (eine offene Frage schließt die vorige) |
| C42 | `ecb0214` | Audit-Runde (Rechtsseiten, Vertriebs-Timeline: sauber) + **Blog-Keyword-Kannibalisierung dokumentiert** (siehe Backlog Punkt 0 — User-Entscheidung) |
| C43 | `a92882e` | Mobile-Menü schließt jetzt beim Klick auf einen Link (Anker-Ziele scrollten vorher unter dem offenen Menü weg), Burger auf 44px, aria-State in einer `closeMenu()` zusammengeführt |
| C44 | `4d7ac59` | entwurf-Tool: ehrlicher Fehlerstatus (grünes Häkchen erschien bisher auch nach Fehlschlägen) + ein defektes SSE-Event bricht nicht mehr den ganzen Stream ab |
| C45 | `423d17d` | **REGRESSION GEFIXT — vom User im Live-Preview entdeckt:** Der Assistent-Dialog stand auf jeder Seite offen. Ursache war mein `display: flex` aus C19, das das `display:none` von `[hidden]` (nur UA-Stylesheet) überschrieb. Dieselbe Falle steckte in den Zurück/Neu-starten-Buttons. Beide mit expliziter `[hidden]{display:none}`-Regel behoben, alle 5 Seiten gegengeprüft |
| C46 | `c87a7c5` | Cookie-Banner deutlich zurückhaltender: 640px mittig über dem Hero (17 % Viewport) → 360px unten links (10 %), kompaktere Typo, weicherer Schatten. **Dark Pattern vermieden:** durch das schmalere Layout wäre „Alle akzeptieren" volle Breite geworden, „Nur notwendige" nur halbe — beide stehen jetzt exakt gleich breit nebeneinander. Wortlaut und Logik unangetastet, alle drei Buttons einzeln getestet |
| C47 | `bbccd08` | Branchen-Bilder 5,10 MB → 261 KB WebP (handwerk 1626→69 KB, gastronomie 1343→65, immobilien 1156→63, coaching 813→48, kanzlei 283→14). `withoutEnlargement`, da kanzlei nativ nur 656px breit ist; Textschärfe bei q82 in 2×-Ansicht geprüft |
| C48 | `1e056f6` | Report-Meilenstein (C40–C47) + zwei Blueprint-Regeln (`[hidden]`-Falle, Screenshot-Pflicht) |
| C49 | `e75075c` | Mobil-Spacing Startseite: Hero-Umbrüche fließen unter 900px (waren fürs Desktop gesetzt und zerrissen „nicht" allein auf eine Zeile), Karten-Header 160→92px einspaltig, Assistent-Trigger mobil Icon-only. **Falle:** Das Ausblenden der `<br>` verschluckte das Leerzeichen → „nichtnur gut" und „Kundengewinnen." lief über den Rand; nur im Screenshot sichtbar |
| C50 | `0e1d87d` | vertrieb mobil: Das Badge „Antwortet in < 24 Std." ist breiter als sein −14px-Versatz und verdeckte die Bildunterschrift „Paul · Foto folgt"; fließt jetzt darunter. Platzhalter 320→230px **per aspect-ratio** — der erste Versuch kappte die Höhe, worauf `object-fit: cover` die Unterschrift wegschnitt |
| C51 | `5d003ea` | **GRÖSSTER FUND: Die Markenschriften wurden nie geladen.** `@import '@fontsource-variable/outfit'` in der CSS — Vite löst nackte Paketnamen in CSS-`@import` nicht auf, also 0 Fontdateien im Build, 0 `@font-face` zur Laufzeit, alles rendete in system-ui. Bewiesen per Textbreitenmessung: identische 1105px unter Outfit, Jakarta und einem Phantasienamen; nach Umzug ins Layout-Frontmatter 945px bzw. 1029px |
| C52 | `b75dc6b` | Touch-Targets gemessen statt geschätzt: Mobil-Menü (Hauptnavigation!) 31→48px, Footer-Seiten/Rechtliches-Links 31→44px (C29 hatte nur die Kontaktspalte erfasst), Consent-Kategorie-Zeilen 22→44px (durch meine C46-Verkleinerung entstanden). Bewusst NICHT angefasst: Datenschutz-Checkboxen (Label liefert schon 276×84) und Fließtext-Links (WCAG 2.5.8-Ausnahme) |
| C53 | `ae14cf3` | Footer-Kontrast auf jeder Seite unter AA: Spaltenüberschriften und Copyright 2,56, Tagline/Adresse 4,10 → jetzt 5,20 bzw. 5,79 bei erhaltener Abstufung (Links bleiben 7,72) |
| C54 | `786612c` | Hero-Float-Cards: „DSGVO-konform" 3,10→4,72, grüner Chip 3,00→4,57, Kartenlabels 2,41→5,14. Gleichzeitig die sechs Gradient-Verdachtsfälle aus C53 **per Pixelmessung als Fehlalarm widerlegt** (6,73–16,36) — CSS-Kette liefert auf Verläufen weiß-auf-weiß |
| C55 | `8cdd9e1` | Blog-Tabellen: 480px breite Vergleichstabelle in 334px Spalte. rehype-Plugin wickelt jede Markdown-Tabelle in eine scrollbare Region mit `tabindex=0`/`role=region` (kein `display:block` auf der Tabelle — das nimmt Screenreadern die Tabellenrolle). Alle 176 Artikel vorher durchsucht: genau eine Tabelle >2 Spalten |

**Geprüft, bewusst NICHT geändert:** Rechtstexte mit `[RECHTLICH PRÜFEN]`-Markern (Anwalts-Entscheidung), Consent-Banner-Escape-Verhalten (DSGVO-Semantik), Sitemap (bereits vollständig), Assistant-Dialog-ARIA (bereits korrekt inkl. Escape + Focus-Management).

## Verbleibende Empfehlungen (Backlog für weitere Durchgänge)

0. **[USER-ENTSCHEIDUNG] Blog: Keyword-Kannibalisierung auflösen.** `website-fuer-handwerksbetrieb.md` und `website-fuer-handwerksbetriebe.md` zielen auf dasselbe Haupt-Keyword (fast identische Titel/Keywords) — Google wertet das als konkurrierende Seiten. Ebenso überschneiden sich `website-fuer-steuerberater.md` und `website-fuer-steuerberaterkanzlei.md` (die übrigen 4 Steuerberater-Varianten haben eigene Winkel und sind ok). Empfehlung: je Paar den schwächeren Artikel löschen oder per Redirect/Canonical auf den stärkeren zeigen — Auswahl bitte durch den User.

1. **Echte Fotos** statt Platzhalter: `/images/paul-portrait.jpg`, `/images/partner-1.jpg`, `/images/partner-2.jpg` (braucht echte Aufnahmen vom User)
2. **Blog-Inhalte**: weitere Artikel wären inzwischen SEO-wirksamer als weitere Code-Politur
3. **ueber-uns** frisches Mobile-Audit (Werte-Karten, Kontakt-Card)
4. **Font-Pass**: `font-display` / Subsetting der beiden Variable Fonts prüfen (Bild-Budget ist abgeschlossen, Fonts sind der verbleibende Ladeposten)
5. **Frische Gesamt-Audits** der schon bearbeiteten Seiten — ab jetzt mit Screenshot-Kontrolle, nicht nur Code-Review (siehe C45)

---

## Zusammenfassung (Stand C56)

- **Phase A:** 6 Iterationen (Vertrieb „0 auf 100") · **Phase B:** 8 Iterationen (Site-Audit) · **Phase C:** 56 Iterationen (laufend)
- **70 Loop-Commits**, alle gebaut (0 Build-Fehler), alle gepusht
- **Wichtigste Funde:**
  - **C51 — die Markenschriften wurden nie geladen.** Die ganze Typografie des Design-Systems lief auf System-Fallback
  - C45 — Assistent-Dialog stand auf jeder Seite offen (Regression aus C19, vom User im Live-Preview entdeckt)
  - C21 — Bewerbungsformular akzeptierte leere Submissions als Erfolg
  - C25–C27/C35/C37/C47 — **~16 MB Bildgewicht entfernt**, Bild-Budget abgeschlossen
  - C52/C53/C54 — Touch-Targets und Kontrast site-weit gemessen und auf AA gebracht
  - C31 — iOS-Fokus-Zoom auf allen Formularen · C33 — Blog-Index −71 % durch Pagination · C55 — Blog-Tabellen brachen aus dem Layout
- **Live-Preview:** https://deploy-preview-2--endearing-cranachan-3bdba4.netlify.app (PR #2, baut bei jedem Push neu)
- **Dokumente:** `WEBSITE-BLUEPRINT.md` (Übergabe-Spezifikation), dieses `REPORT.md` (Logbuch)

### Prozess-Lehre: messen statt annehmen

Die gravierendsten Fehler dieses Projekts waren im Code unauffällig und wurden erst durch Messung oder Screenshot sichtbar — der offene Dialog (C45), die nie geladenen Schriften (C51), die 31px-Navigation (C52). Deshalb gilt:

1. **Sichtbare Änderungen werden angesehen**, nicht nur gelesen.
2. **Wirkung wird gemessen**, nicht angenommen (Schriften über Textbreite, Kontrast über Pixel, Touch-Targets über Geometrie).
3. **Vor jedem Fix wird geprüft, ob überhaupt ein Problem vorliegt.** Zweimal war die Antwort nein: C52 (Checkbox-Label lieferte längst 276×84) und C54 (Gradient-„Verstöße" waren Messartefakte).

Die Prüfskripte liegen im Scratchpad unter `pw/`: `fonts2.mjs` (Schrift wirklich aktiv?), `tap.mjs` (Touch-Targets), `cb.mjs` (effektive Tap-Fläche inkl. Label), `px2.mjs` (Kontrast per Pixel), `hidden.mjs` (`[hidden]`-Elemente, die trotzdem rendern), `scan.mjs`/`overflow.mjs` (Layout-Überlauf).
