# PROMPT-SAMMLUNG — Street Activation

Fertige Prompts zum Kopieren. Teil A ist für **Claude (Design/Code, z. B. Claude Code)**,
Teil B für **Bildgenerierungs-Tools** (Midjourney, DALL·E, Ideogram, Recraft o. Ä.).

**So benutzt du sie:**
1. Bei Teil A: immer zuerst den MASTER-KONTEXT kopieren, dann den jeweiligen Prompt darunter.
2. Bei Teil B: immer den STIL-BLOCK ans Ende des jeweiligen Prompts anhängen.
3. Wo `[ECKIGE KLAMMERN]` stehen, eigene Inhalte einsetzen (oder weglassen, dann bleibt es Platzhalter).

---
---

# TEIL A — PROMPTS FÜR CLAUDE (DESIGN & ANIMATIONEN)

## A0 · MASTER-KONTEXT (immer zuerst einfügen)

```
KONTEXT — bitte strikt einhalten:

Projekt: Sales-Landingpage „Street Activation" von Isabelle Wurm (Agentur „Wir machen
Content", München — Marke & Produktion) und Paul Dunker (Mediadrift — Reichweite &
Energie). Wir produzieren Straßeninterviews, Challenges und Social Experiments für
lokale Unternehmen in München & Umgebung. Zielgruppe: Gastro-Inhaber und
Franchisenehmer, dazu Shopping Center und Fitnessstudios. Ein Ziel: Der Besucher soll
nach 30 Sekunden ein kostenloses Erstgespräch buchen wollen.

Tech-Regeln:
- Reines HTML/CSS/Vanilla-JS, KEINE Frameworks, KEINE externen Bibliotheken.
- Mobile-first (360px zuerst), Breakpoints 640/960/1280px, kein horizontaler Scroll.
- Alle Animationen über CSS-Transitions/Keyframes + IntersectionObserver.
- prefers-reduced-motion: reduce MUSS respektiert werden (Animationen aus, alles sichtbar).
- Performance: nichts, was das Scrollen auf einem Mittelklasse-Handy ruckeln lässt.

Design-Tokens (NUR diese Werte verwenden):
- Hintergrund: #0B0B0F · Flächen/Karten: #16161D · Ränder: #26262F
- Text: #F5F5F7 · Text gedämpft: #A0A0AB
- Akzent (Buttons/Highlights): #FF3D2E · Akzent 2 (sparsam): #FFC531
- Headlines: 'Archivo Black' (laut, uppercase) · Fließtext: 'Inter'
- Radius: 16px · Buttons: rund (999px), Akzentfarbe

Sprache & Ton: Deutsch, Duz-Form („ihr/euch"), kurze Sätze, direkt, selbstbewusst,
menschlich. VERBOTEN: jedes Versprechen wie „Millionen Views" oder garantierte
Reichweite. Erlaubt: „Formate mit dem Potenzial für hohe Reichweiten und starke
Interaktionen".
```

## A1 · Hero-Animation (Fallback, solange das Video fehlt)

```
AUFGABE: Baue für die Hero-Sektion einen animierten Hintergrund als Fallback, solange
das Hintergrund-Reel fehlt (und als Ebene UNTER dem Video, wenn es da ist).

Gewünschte Wirkung: Energie einer nächtlichen Straße — Bewegung, Licht, Menschen-Vibe —
ohne ein einziges Bild zu verwenden. Rein mit CSS (Gradients, Keyframes) und optional
einem leichtgewichtigen Canvas (max. ~60 Zeilen JS).

Konkret:
1. Ein langsam wanderndes, mehrfarbiges Glow-Feld (Radial-Gradients in #FF3D2E und
   #FFC531 auf #0B0B0F, stark abgedunkelt, subtile Bewegung, 20–30s Loop).
2. Ein feines Korn/Noise darüber (CSS oder winziges data-URI-PNG), damit es nach Film
   aussieht, nicht nach Bildschirmschoner.
3. Der dunkle Overlay-Verlauf und die Textlesbarkeit (Kontrast!) haben immer Vorrang.
4. Bei prefers-reduced-motion: statisches, stimmiges Standbild des Verlaufs.
5. Die Headline erscheint beim Laden mit einer kurzen, harten „Stempel"-Animation
   (scale 1.06 → 1, 250ms, kein weiches Gefade — es soll LAUT wirken), danach Ruhe.

Liefere: fertigen Code (HTML-Snippet + CSS + ggf. JS) zum Einfügen in die bestehende
Hero-Sektion, mit deutschen Kommentaren.
```

## A2 · Ablauf-Kette als Scroll-Story (Sektion „Was passiert bei unseren Formaten?")

```
AUFGABE: Mache aus der vertikalen Ablauf-Kette (7 Pillen: „Menschen bleiben stehen" →
… → „Mehr Umsatz") eine kleine Scroll-Story, die sich wie eine Kettenreaktion anfühlt.

Konkret:
1. Jede Pille erscheint nacheinander beim Scrollen (IntersectionObserver), mit ~120ms
   Versatz: kurzer Slide von unten (16px) + Opacity, snappy (cubic-bezier, ~350ms).
2. Der Pfeil zwischen zwei Pillen wird „gezeichnet": ein vertikaler Strich, der von
   oben nach unten wächst (transform: scaleY, transform-origin: top), erst danach
   triggert die nächste Pille.
3. Die letzte Pille „Mehr Umsatz" bekommt einen Extra-Moment: kurzer Puls (Box-Shadow
   in #FF3D2E, 1× — kein Dauerblinken).
4. Auf Desktop (ab 960px) darf die Kette leicht versetzt links/rechts pendeln
   (Zickzack), auf Handy bleibt sie strikt untereinander.
5. prefers-reduced-motion: alles sofort sichtbar, Pfeile statisch.

Liefere: Ersatz-Code für die bestehende Sektion #ablauf (HTML-Anpassungen minimal
halten, Klassen wiederverwenden), deutsche Kommentare.
```

## A3 · Micro-Interactions (Buttons, Karten, FAQ)

```
AUFGABE: Verpasse der Seite konsistente Micro-Interactions. Dezent, schnell, überall
gleiche Logik — nichts darf „billig" oder verspielt wirken.

1. Primär-Buttons („Kostenloses Erstgespräch buchen"): beim Hover minimal anheben
   (translateY -2px) + Glow in Akzentfarbe; beim Klick kurzes Eindrücken (scale 0.97).
   Fokus-Ring in #FFC531 deutlich sichtbar (Tastatur!).
2. Karten (Formate, Duo, Warum-wir): Hover hebt die Karte 4–6px, Rand färbt sich
   #FF3D2E, Übergang 200ms. Auf Touch-Geräten: kein „hängender" Hover-Zustand.
3. Beispiel-Kacheln: beim Hover zoomt der Hintergrund minimal (scale 1.03), der
   „▶ Ansehen"-Status springt 2px nach oben.
4. FAQ (<details>): das Auf-/Zuklappen soll weich animiert sein (height/grid-rows
   Trick, ~250ms), das +/−-Zeichen rotiert dabei.
5. Alles über gemeinsame CSS-Variablen für Dauer/Easing, damit es EIN Timing-System
   gibt. prefers-reduced-motion: alle Transitions auf 0.

Liefere: CSS (+ minimal nötiges JS für den FAQ-Height-Trick) als Patch zu den
bestehenden Klassen, deutsche Kommentare.
```

## A4 · Zahlen-Sektion mit mehr Dramatik

```
AUFGABE: Die Zahlen-Sektion (5 Kacheln mit Zähl-Animation) soll der „Beweis-Moment"
der Seite werden.

1. Die Kacheln erscheinen als Stagger (nacheinander, 80ms Versatz).
2. Beim Hochzählen: leichtes „Ticker"-Gefühl — die Zahl skaliert beim letzten Schritt
   kurz auf 1.08 und rastet ein.
3. Unter jeder Zahl ein dünner Fortschrittsbalken in #FF3D2E, der synchron zum
   Hochzählen füllt.
4. Der Intro-Satz („Plätze gefüllt, Videos viral…") bekommt Wort-für-Wort-Reveal
   (jedes Wort 30ms versetzt, nur beim ersten Erscheinen).
5. Solange eine Zahl noch Platzhalter „XX" ist: Kachel bleibt ruhig (keine Animation
   ins Leere), aber optisch gleichwertig.
6. prefers-reduced-motion: Zahlen stehen sofort final da.

Liefere: Patch für Sektion #zahlen (HTML minimal, CSS, JS-Erweiterung der bestehenden
Zähl-Logik in main.js), deutsche Kommentare.
```

## A5 · Neue Sektionen: Rezensionen + Erfahrung/Über uns (Design + Einbau)

```
AUFGABE: Entwirf und baue zwei neue Sektionen im bestehenden Design-System:

SEKTION „DAS SAGEN UNTERNEHMEN" (Rezensionen):
- 2–4 Zitat-Karten: Zitat, Name, Betrieb, optional Foto-Platzhalter (Kreis).
- WICHTIG: KEINE erfundenen Zitate! Baue die Karten mit sichtbaren Platzhaltern
  ([PLATZHALTER: Zitat Kunde 1 — z. B. Gastro], …) und trage sie in PLATZHALTER.md ein.
- Auf Handy horizontal snappbar (CSS scroll-snap, ohne Bibliothek), auf Desktop als Grid.
- Dezente, große Anführungszeichen in #26262F als Deko-Element.

SEKTION „WARUM WIR DAS KÖNNEN" (Erfahrung, ersetzt nichts — ergänzt die Duo-Sektion):
- 3–4 Fakten-Zeilen mit Platzhaltern: seit wann aktiv ([PLATZHALTER: Jahr]), Anzahl
  produzierter Videos ([PLATZHALTER]), Branchenerfahrung (Content-Agentur München +
  Social-Media-Agentur seit Gründung mit 16), gemeinsame Drehs (Forum, Gastro).
- Als kompakte Zeitleiste oder Fakten-Band — KEIN zweites Zahlen-Grid (das gibt es
  schon), bewusst anderes Layout.

Platzierung: Rezensionen nach der Beispiele-Sektion, Erfahrung direkt nach der
Duo-Sektion „Strategie trifft Straße". Scroll-Reveals wie im Rest der Seite.
Liefere: komplettes HTML + CSS (+ JS falls nötig) und aktualisiere PLATZHALTER.md.
```

## A6 · Reel-Karussell: Handy-Mockups mit durchlaufenden Straßeninterview-Videos (schnelle Ladezeit)

```
AUFGABE: Baue für die Street-Activation-Landingpage ein „Reel-Karussell": mehrere
iPhone-Mockups nebeneinander, in denen Straßeninterview-Videos laufen, während die
Reihe langsam endlos horizontal durchzieht. Das mittlere Handy ist groß und hell,
die äußeren kleiner und abgedunkelt. Vorbild: Agentur-Heroes mit Phone-Carousel.

DESIGN:
- Design-Tokens der Seite: Hintergrund #0B0B0F, Flächen #16161D, Text #F5F5F7,
  Akzent #FF3D2E, Akzent 2 #FFC531, Headlines 'Archivo Black', Text 'Inter', Radius 16px.
- iPhone-Rahmen komplett in CSS/SVG (abgerundeter Rahmen, Dynamic Island,
  Home-Indicator) — KEINE PNG-Mockups.
- Reel-UI (Herz, Kommentar, Teilen, Username, Caption) als leichtes Inline-SVG/CSS
  mit Platzhalter-Texten — keine echten Marken oder Logos.
- Center-Phone: scale 1, volle Helligkeit. Nachbarn: scale ~0.85, brightness ~0.5.
- Bewegung: nahtloser Endlos-Loop über eine duplizierte Spur (CSS-Keyframe auf
  transform: translateX, GPU-freundlich), ca. 40–60 s pro Durchlauf.
- Der Haupt-Button „Kostenloses Erstgespräch buchen" (Klasse js-buchung, zentrale
  BUCHUNGS_LINK-Logik aus main.js) liegt prominent über oder unter dem Karussell.

PERFORMANCE — HARTES BUDGET (die Seite muss trotz Videos schnell laden):
1. KEIN Video lädt beim Seitenaufruf: alle <video> mit preload="none" und Poster
   (WebP, ≤ 30 KB, 480×854). Erst das macht die Ladezeit niedrig.
2. Es spielt IMMER NUR EIN Video gleichzeitig — das im mittleren Phone. Alle
   anderen zeigen ihr Poster-Bild.
3. Videos erst nach dem First Paint initialisieren (requestIdleCallback, Fallback
   setTimeout) und nur, wenn das Karussell im Viewport ist (IntersectionObserver).
   Verlässt es den Viewport oder wird der Tab gewechselt (visibilitychange): pausieren.
4. Maximal 2 Videos gleichzeitig „warm": das laufende + das nächste mit
   preload="metadata". Alte Videos zurück auf Poster.
5. Fokus-Rotation: alle ~8 s wird das nächste Phone zum Center — neues Video
   startet (muted, loop, playsinline), altes stoppt.
6. Datei-Vorgaben als Kommentar in den Code schreiben: Clips 5–8 Sekunden, 480px
   breit, H.264, CRF ~28, OHNE Tonspur, Ziel ≤ 1,5 MB pro Clip — inklusive fertigem
   ffmpeg-Beispielbefehl zum Komprimieren.
7. Zusatz-Payload des Karussells beim Laden ≤ 200 KB (ohne Videos). Kein
   Layout-Shift: Phones mit fester Aspect-Ratio (9:19.5), Container reserviert Höhe.
8. prefers-reduced-motion: reduce → keine Laufbewegung, statische Phone-Reihe,
   Videos starten nur per Tipp.
9. Fallback ohne Videodateien: dunkle Poster-Fläche mit Titel — Layout nie kaputt.
   Erwartete Dateien: assets/videos/karussell-1.mp4 … karussell-6.mp4 und
   assets/poster/karussell-1.webp … — alle in PLATZHALTER.md ergänzen.

TECHNIK: Reines HTML/CSS/Vanilla-JS, keine Bibliotheken. Mobile-first: am Handy
1 zentriertes Phone mit angeschnittenen Nachbarn, am Desktop 3–5 Phones. Kein
horizontaler Scroll der Seite. Deutsche Kommentare.

EINBAU: Entweder in den Hero (hinter Headline + Button) oder als eigene Sektion
direkt nach dem Hero — entscheide nach Lesefluss und begründe kurz.
```

---
---

# TEIL B — PROMPTS FÜR BILDGENERIERUNG

> **Wichtig, bevor du generierst:**
> 1. **Isabelle & Paul niemals per KI generieren** — für die Duo-/Über-uns-Sektion
>    immer echte Fotos verwenden. KI-Porträts echter Personen wirken unseriös und
>    zerstören genau das Vertrauen, das die Sektion aufbauen soll.
> 2. **Keine echten Markenlogos** (Burger King etc.) generieren lassen — Markenrecht.
>    Generische Szenen („burger restaurant") sind okay.
> 3. **Keine erfundenen Rezensionen/Bewertungssterne** als Bild.
> 4. Diese Bilder sind **Platzhalter/Entwürfe** — echte Drehfotos ersetzen sie später.
>    (Alle Dateipfade stehen in PLATZHALTER.md.)

## B0 · STIL-BLOCK (an jeden Prompt anhängen)

```
Style: cinematic street documentary photography, night urban energy, natural motion
blur, candid people, authentic German city street (Munich vibe), dark moody background
#0B0B0F, warm accent light in red-orange #FF3D2E and yellow #FFC531, high contrast,
shallow depth of field, shot on 35mm, NO text, NO logos, NO watermarks, NO celebrity
faces. --no text, logos, watermark, cartoon, illustration
```
*(Das `--no …` am Ende ist Midjourney-Syntax — bei DALL·E/anderen Tools einfach als
„Avoid: text, logos, watermark, cartoon" anhängen.)*

## B1 · Hero-Hintergrund (Fallback-Bild, bis das Reel da ist)
Datei danach: `assets/images/hero-fallback.jpg` (quer) — wird als Poster/Fallback hinterlegt.

```
A lively city shopping street at dusk, a small excited crowd gathered around two young
content creators holding a microphone, people laughing and raising hands to
participate, energy of a street interview moment, motion and joy, wide 16:9
composition with darker edges so overlaid headline text stays readable, main subjects
slightly right of center leaving negative space left.
Aspect ratio 16:9, also render a 9:16 vertical crop variant.
[+ STIL-BLOCK B0]
```

## B2 · OG-Vorschaubild (Link-Vorschau WhatsApp/Instagram)
Datei danach: `assets/images/og-bild.jpg` (1200×630).

```
Over-the-shoulder shot of a street interview: microphone in the foreground pointing at
a laughing passerby, blurred neon-lit shopping street behind, bold empty dark area on
the left third for later text overlay, composition designed as a social media link
preview card.
Aspect ratio 1.91:1 (1200x630).
[+ STIL-BLOCK B0]
```

## B3 · Poster für die 6 Beispiel-Kacheln (je 9:16 hochkant)
Dateien danach: `assets/poster/beispiel-*.jpg`. Ein Prompt pro Kachel — Motiv tauschen:

```
Vertical 9:16 video poster frame: [MOTIV], candid street-interview energy, one person
mid-laugh or mid-action, microphone visible, blurred urban background, dark cinematic
grade with red-orange rim light, bottom third darker for a title overlay.
[+ STIL-BLOCK B0]

MOTIVE zum Einsetzen:
1. Burger-Kachel:   "a young person doing a blind taste test with a burger outside a fast-food restaurant"
2. Pommes-Kachel:   "friends ranking a portion of french fries on a busy pedestrian street, thumbs up"
3. Pizza-Kachel:    "a street poll moment in front of a pizzeria, person holding a pizza slice, surprised face"
4. Cookie-Kachel:   "a guessing game with fresh cookies at a small dessert shop window, delighted reaction"
5. Center-Kachel:   "a push-up challenge drawing a crowd inside a modern shopping mall atrium"
6. Fitness-Kachel:  "a plank-hold competition in a gym, small cheering crowd, phones filming"
```

## B4 · Sektions-Entwürfe (UI-Mockups mit Platzhaltern)
Für Tools, die UI/Layouts können (Ideogram, Recraft, Galileo …). Ein Prompt pro
Sektion — so bekommst du grobe visuelle Entwürfe, in die später deine echten Bilder kommen.
Gemeinsamer Rahmen für alle:

```
UI mockup of one landing page section, dark theme background #0B0B0F, card surfaces
#16161D, white text #F5F5F7, red-orange accent #FF3D2E, loud condensed uppercase
headline font, rounded 16px cards, mobile-first 390px width, grey placeholder boxes
with an X where photos/videos go, German placeholder labels allowed.
SECTION: [SEKTIONS-BESCHREIBUNG]
```

SEKTIONS-BESCHREIBUNGEN zum Einsetzen:
1. **Hero:** `full-height hero, video placeholder background with dark gradient, huge two-line uppercase headline, subline, one big rounded red CTA button, small location tag "München" below`
2. **Warum wir:** `five small cards in a row, each with an emoji icon and one short line of text, equal height, subtle borders`
3. **Über uns / Duo:** `two profile cards side by side, each with a 4:3 photo placeholder, name, colored role label, three lines of bio text, two small link chips below`
4. **Erfahrung/Track-Record:** `a horizontal fact band with four compact stat entries separated by thin dividers, small uppercase labels, timeline feel, no big number tiles`
5. **Formate:** `three tall cards: Straßeninterviews, Challenges, Individuelle Aktionen — each with a heading in accent color and a 4-item bullet list`
6. **Beispiele:** `grid of six vertical 9:16 video tiles with play buttons and title labels, three columns on desktop, one column on mobile`
7. **Rezensionen:** `three quote cards with large decorative quotation marks, round avatar placeholder, name and business line, horizontally scrollable on mobile`
8. **Warum Straßeninterviews funktionieren:** `bold centered statement text followed by a vertical checklist with yellow check marks, very generous spacing`
9. **Zahlen:** `five stat tiles with huge accent-colored numbers and small uppercase labels, one intro sentence above`
10. **Finaler CTA:** `full-width section in strong red-orange gradient, huge white uppercase headline, subline, one white pill button, most dominant section of the page`

## B5 · Logo-Entwürfe „Street Activation"
Nur als Ideengeber — finales Logo besser vom Designer.

```
Minimal wordmark logo concept for "STREET ACTIVATION", bold condensed uppercase
letters, a subtle microphone or sound-wave element integrated into one letter, works
white-on-dark (#0B0B0F) and red-orange (#FF3D2E) monochrome, flat vector style, on
plain dark background, presented as 4 variations in a grid.
Avoid: gradients, 3D, mockups, taglines.
```

## B6 · Zielgruppen-/Stimmungsbilder (optional, z. B. für spätere Pitches/Decks)

```
[MOTIV], documentary style, real business owner in their environment, warm practical
light, honest and unposed, German city context.
Aspect ratio 3:2.
[+ STIL-BLOCK B0]

MOTIVE:
- "proud franchise restaurant owner standing in front of his burger restaurant at golden hour"
- "female gym owner leaning on the front desk of a modern boutique fitness studio"
- "shopping mall marketing manager walking through a busy mall atrium with a tablet"
- "café owner flipping the open sign of a small Munich café, morning light"
```

---

## Empfohlene Reihenfolge

1. **B1 + B3** generieren → sofort als Poster/Fallback einbauen (Pfade siehe PLATZHALTER.md) — größter sichtbarer Effekt.
2. **A1 + A2** an Claude geben → Hero + Ablauf-Kette leben, auch ohne Videos.
3. **A5** → Rezensionen- & Erfahrungs-Sektion einbauen (Zitate von echten Kunden einholen!).
4. **A3 + A4** → Feinschliff.
5. **B4** nur nutzen, wenn ihr Layout-Alternativen sehen wollt; **B5** als Logo-Inspiration.
