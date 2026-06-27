# MediaDrift — Website-Blueprint & Übergabe-Dokument

> **Zweck:** Dieses Dokument enthält **alle Informationen, die ein anderer Claude-Chat (oder Entwickler) braucht**, um diese Website nach allen geforderten Kriterien zu **verbessern** oder von Grund auf **neu zu erstellen** — ohne Vorwissen aus der ursprünglichen Session.
>
> Wenn du dieser Chat bist: Lies dieses Dokument vollständig, bevor du Änderungen machst. Es ist die einzige verbindliche Quelle für Marke, Design-System, Tonalität und Qualitätskriterien.

---

## 0. WICHTIGSTER GRUNDSATZ — Individualitäts-Mandat

**Jede Website bleibt individuell. Niemals zwei Seiten gleich aussehen lassen.**

Dieses Dokument enthält zwei Arten von Inhalt — verwechsle sie nie:

| Kategorie | Gilt für | Übertragbar auf Kundenwebsites? |
|---|---|---|
| **Marken-spezifisch** — §3 Marke, §4 Palette „Bayerisch Cobalt", Outfit/Plus-Jakarta-Fonts | **NUR** für mediadrift.de selbst | ❌ **NEIN — niemals kopieren** |
| **Universell** — §6.1 Ton-Regeln, §7 Qualitätskriterien, §8 Anti-Patterns, §9 Prozess, §13 Arbeitsweise | **jede** Website | ✅ **JA — immer anwenden** |

**Konkret heißt das:**
- Cobalt `#1455A8` + Outfit ist **die Identität von MediaDrift**, nicht eine Vorlage. Eine Kundenwebsite bekommt eine **eigene, aus ihrem Briefing abgeleitete Identität**: eigene Palette, eigenes Font-Pairing, eigenes Layout-Archetyp, eigene Bildsprache.
- Für jede neue/zu verbessernde Kundenseite zuerst den **Brief lesen** (Branche, Zielgruppe, Wettbewerb, vorhandene Marken-Assets) und daraus eine **passende, einzigartige** Designrichtung ableiten — siehe Skill `design-taste-frontend` (Abschnitt „Brief Inference" + Dials) und `high-end-visual-design` (Variance Engine).
- **Nie** denselben Look/dieselbe Palette zweimal hintereinander ausliefern. Keine generischen AI-Defaults (Lila-Gradient, zentriertes Hero, drei gleiche Cards).
- Was bei **allen** Seiten gleich ist, ist nur das **Qualitätsniveau** (§7) und der **Prozess** — nicht die Optik.

> Merksatz: Das Blueprint hebt die **Messlatte**, es liefert keine **Schablone**. Qualität ist universell, Identität ist pro Projekt einzigartig.

---

## 1. Projekt-Überblick

**MediaDrift** ist das Webdesign-Geschäft von **Paul Dunker** (München). Die Website verkauft individuelle Unternehmens-Websites an KMU (Handwerker, Kanzleien, Dienstleister) und wirbt zusätzlich **Vertriebspartner** an.

Zwei Zielgruppen / zwei Conversion-Pfade:
1. **Kunden** → wollen eine Website → CTA: Erstgespräch / WhatsApp / Entwurf
2. **Vertriebspartner** → vermitteln Kunden gegen 10 % Provision → CTA: Bewerbung / Kennenlerngespräch

Geschäftskern: schnell (Entwurf am nächsten Tag), persönlich (direkt mit Paul, kein Agentur-Overhead), kein Baukasten/Abo, Website gehört dem Kunden.

---

## 2. Tech-Stack & Architektur

| Bereich | Technologie |
|---|---|
| Framework | **Astro 4.16.18**, `output: 'hybrid'` (SSR + statisch) |
| Adapter | `@astrojs/netlify` v5 (Deploy auf Netlify) |
| UI-Inseln | React 18 (`@astrojs/react`) — nur für Tools (CRM, Invoice, Entwurf-UI) |
| Styling MediaDrift-Seiten | **Vanilla CSS** mit CSS Custom Properties (KEIN Tailwind auf den MediaDrift-Marketing-Seiten) |
| Tailwind | nur im Starter-Demo-Teil vorhanden (`applyBaseStyles: false`); **nicht** für MediaDrift-Seiten verwenden |
| Fonts | self-hosted via `@fontsource-variable/*` (Outfit + Plus Jakarta Sans) |
| HTML-Scraping (Tool) | `cheerio` |
| KI (Entwurf-Tool) | `@anthropic-ai/sdk`, Modell `claude-opus-4-8` |
| Node | 22.x |

**Wichtig:** Die Marketing-Seiten (`index`, `vertrieb`, `webdesign`, `ueber-uns`, `blog`) nutzen **ausschließlich Vanilla CSS in `<style>`-Blöcken** + globale Variablen aus `src/styles/mediadrift.css`. Nicht auf Tailwind/React umstellen.

---

## 3. Marke & Kontaktdaten (`src/config/site.ts`)

```
Name:      MediaDrift
Inhaber:   Paul Dunker
Tagline:   „Websites, die nicht nur gut aussehen. Sondern Kunden gewinnen."
URL:       https://mediadrift.de
Adresse:   Balanstraße 102, 81539 München, Deutschland
Telefon:   +49 159 05405185
E-Mail:    info@mediadrift.org
WhatsApp:  4915905405185 (mit vordefinierten Texten für customer/sales)
Booking:   https://calendly.com/mediadrift/30min
GA4:       G-W4VQVNXJP4
```

Alle Kontaktdaten **immer** aus `SITE` (config/site.ts) ziehen, nie hardcoden.

---

## 4. Design-System — „Bayerisch Cobalt"

> ⚠️ **Nur für mediadrift.de.** Diese Palette und Fonts sind die Identität von MediaDrift selbst. Auf **Kundenwebsites NICHT übertragen** — jede bekommt ihre eigene Identität (siehe §0). Übertragbar sind nur die *Konventionen* (eine Akzentfarbe, eine Radius-Skala, getönte Shadows, Custom-Easing), nicht die *konkreten Werte*.

### 4.1 Farben (CSS-Variablen, `:root` in `src/styles/mediadrift.css`)

```css
--md-bg:        #EFF2F7;  /* Seiten-Hintergrund (hell, blau-grau) */
--md-surface:   #FFFFFF;  /* Cards */
--md-primary:   #0B1828;  /* Headlines, dunkles Navy */
--md-secondary: #1B3254;
--md-cta:       #1455A8;  /* Haupt-Akzent / Buttons / Links — "Cobalt" */
--md-cta-dark:  #1B6AC5;  /* Hover/Akzent hell */
--md-muted:     #486172;  /* Fließtext gedämpft */
--md-border:    #C8D8E8;
--md-text:      #0B1828;
--md-subtle:    #6280A0;
--md-accent:    #D0E6FF;  /* helle Akzentfläche */
--nav-h:        72px;
```

**Akzent-Lock:** Genau EINE Akzentfarbe für die ganze Seite: Cobalt `#1455A8`. rgba-Werte immer aus `rgba(20, 85, 168, …)`. **Verboten** (alte Palette, wurde komplett entfernt): `#0369A1` und `rgba(3, 105, 161, …)`.

Dunkle Sektionen (Hero Vertrieb, Closing-CTA, „0 auf 100"-Block) nutzen Navy-Gradient: `#080C14 → #0C1828 → #0F172A` mit Cobalt-Glow `rgba(20,85,168,0.18)`.

### 4.2 Typografie

| Rolle | Font | Einsatz |
|---|---|---|
| Headlines | **Outfit Variable** | h1–h4, Zahlen, Labels; `letter-spacing: -0.02em`, `line-height: 1.1`, `font-weight: 700` |
| Fließtext | **Plus Jakarta Sans Variable** | Body, `line-height: 1.7` |

Import via `@import '@fontsource-variable/outfit';` und `@import '@fontsource-variable/plus-jakarta-sans';`. Keine Google-Fonts-`<link>`. **Kein** Inter, kein Serif als Default.

### 4.3 Easing (Emil Kowalski Kurven, bereits in `:root`)

```css
--ease-out:    cubic-bezier(0.23, 1, 0.32, 1);   /* Enter/Exit, Hover */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);  /* On-screen-Bewegung */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);   /* Drawer/iOS-Feel */
```
**Nie** `linear`/`ease-in` für UI. UI-Animationen < 300 ms. Buttons: `:active { transform: scale(0.97) }`. Nur `transform`/`opacity` animieren.

### 4.4 Komponenten-Konventionen

- Klassen-Präfixe pro Seite, z. B. `v-*` (vertrieb), `ref-*`, `compare-*`, `md-*` (global: `.md-btn`, `.md-card`, `.md-label`, `.md-badge`, `.md-container`, `.md-section`).
- Border-Radius: 12–16 px Cards, 999 px Buttons/Pills. **Eine** Radius-Skala konsistent halten.
- Shadows immer in Cobalt getönt (`rgba(20,85,168,…)`), nie reines Schwarz.
- Hover-Effekte nur in `@media (hover: hover) and (pointer: fine)` kapseln.
- Jede neue Sektion: `prefers-reduced-motion`-Fallback ergänzen.

---

## 5. Seitenstruktur (MediaDrift)

| Datei | Route | Zweck |
|---|---|---|
| `src/pages/index.astro` | `/` | Startseite: Hero (Browser-Mockup-Slider), Leistungen, Vergleich, Branchen, Referenzen, Testimonials, Vertriebs-Teaser, Kontakt |
| `src/pages/webdesign.astro` | `/webdesign` | Leistungsseite: Baukasten-vs-Individual-Vergleich, Services, Qualität, FAQ, CTA |
| `src/pages/ueber-uns.astro` | `/ueber-uns` | Story, Werte, persönlicher Kontakt zu Paul |
| `src/pages/vertrieb.astro` | `/vertrieb` | **Vertriebspartner-Anwerbung** (siehe §6 für Tonalität/Thema) |
| `src/pages/blog/index.astro` | `/blog` | Blog-Übersicht (3-Spalten-Grid, ab 1100 px 2-spaltig) |
| `src/pages/blog/[...slug].astro` | `/blog/…` | Einzelartikel |
| `src/pages/impressum/datenschutz/agb/404` | — | Pflicht/Recht |

Layout: `src/layouts/MDLayout.astro` (SEO-Meta, OG-Tags, Schema.org, GA4). Props: `title`, `description`, `ogImage` (default `/og-default.svg` — **TODO:** auf Raster-JPG umstellen, SVG-OG wird sozial nicht angezeigt).

Globale Komponenten: `src/components/md/Nav.astro` (Sticky-Glas-Nav, Burger-Morph, focus-visible), `Footer.astro`, `Assistant.astro` (Chat-Bubble), `ConsentBanner.astro`.

Daten: `src/data/faq.ts` (`faqMain`, `faqSales`), `industries.ts`, `references.ts`.

---

## 6. Inhaltliche Leitlinien / Tonalität

### 6.1 Allgemein
- **Kunden-Seiten** (index, webdesign, ueber-uns): **Sie**-Form, professionell, ehrlich, konkret.
- **Vertrieb-Seite**: **Du**-Form, persönlich, erste Person von Paul.
- Keine AI-Floskeln: kein „Elevate", „Seamless", „Unleash", „Next-Gen", „nahtlos", „In der Welt von…". Klar, spezifisch, aktiv.
- Keine Ausrufezeichen in Erfolgsmeldungen. Sentence case, nicht Title Case.

### 6.2 Vertrieb-Kernbotschaft (WICHTIG — vom Kunden vorgegeben)
> **„Von 0 auf 100" — wir bilden Vertriebspartner aus. Einsteiger UND Profis sind willkommen, wichtig ist nur Motivation.**

Das Versprechen, das **konsistent über die ganze Vertrieb-Seite** durchgehalten werden muss (kein Widerspruch!):
- **Kein Vorwissen nötig** — weder Webdesign noch Verkauf. Paul bildet aus.
- **Erst verdienen, dabei lernen** — 10 % Provision pro Abschluss, von Anfang an.
- **Sprungbrett** — mit dem Gelernten später ein **eigenes Unternehmen** gründen; Paul begleitet.
- **Motivation > Erfahrung** — Erfahrung ist ein Bonus, keine Bedingung.

Niemals Formulierungen, die Einsteiger ausschließen („Erfahrung erforderlich", „nur für Profis"). Wenn du Vertriebs-Copy änderst: gegen dieses Versprechen prüfen.

---

## 7. Geforderte Qualitäts-Kriterien (Checkliste vor jedem Ship)

Diese Kriterien stammen aus den Projekt-Skills (`design-taste-frontend`, `redesign-existing-projects`, `emil-design-eng`, `high-end-visual-design`) und gelten verbindlich.

### 7.1 Design / Layout
- [ ] Eine Akzentfarbe (Cobalt), eine Grau-Familie, eine Radius-Skala — konsistent über ALLE Sektionen.
- [ ] Kein zentriertes 08/15-Hero, keine drei gleichen Feature-Cards als Standard. Asymmetrie/Split nutzen, wo passend.
- [ ] Großzügiger Whitespace (`py-24`+ Gefühl), Sektionen atmen.
- [ ] Cards nur, wenn Elevation echte Hierarchie kommuniziert; sonst Border/Spacing.
- [ ] `min-height: 100dvh` statt `100vh` für Full-Height (iOS-Safari).
- [ ] CSS Grid statt Flex-Prozent-Mathe.
- [ ] Max-Breite-Container (`.md-container`), kein Edge-to-Edge auf großen Screens.

### 7.2 Motion (Emil Kowalski)
- [ ] Nur `transform`/`opacity` animieren. Custom-Easing, kein `linear`/`ease-in`. Dauer < 300 ms.
- [ ] Buttons `:active scale(0.97)`. Nie aus `scale(0)` einfaden (min. `scale(0.95)` + opacity).
- [ ] Häufig wiederholte/keyboard-getriggerte Aktionen NICHT animieren.
- [ ] `prefers-reduced-motion: reduce` überall respektieren.
- [ ] Scroll-Reveals via `IntersectionObserver`, nicht `scroll`-Listener.

### 7.3 Accessibility (A11y)
- [ ] Sichtbare `:focus-visible`-Outlines auf allen interaktiven Elementen.
- [ ] `aria-label` auf icon-only Buttons; sinnvoller, beschreibender Alt-Text auf Bildern.
- [ ] Semantisches HTML (`<nav>`, `<main>`, `<article>`, `<section>`, `<figure>`).
- [ ] Kontrast WCAG AA (4.5:1 Text, 3:1 große Schrift). Button-Text muss lesbar sein.
- [ ] „Skip to content"-Link vorhanden.
- [ ] Formulare: Validierung, Inline-Fehlermeldungen (kein `alert()`), Pflichtfeld-Markierung.

### 7.4 Performance
- [ ] `loading="lazy"` + `decoding="async"` auf allen Below-the-fold-Bildern (erstes Hero-Bild `eager`).
- [ ] `width`/`height` auf `<img>` (CLS vermeiden).
- [ ] Keine `backdrop-blur` auf scrollenden Containern (nur fixed/sticky).

### 7.5 SEO
- [ ] Pro Seite eigener `title` + `description` (konkret, kein Boilerplate).
- [ ] OG-Tags + **Raster** (JPG/PNG) OG-Bild 1200×630 (SVG wird sozial NICHT angezeigt).
- [ ] Saubere Heading-Hierarchie (genau ein `h1`).
- [ ] `sitemap.xml`, Schema.org (in MDLayout vorhanden).

### 7.6 Content-Qualität
- [ ] Keine Lorem Ipsum, keine Platzhalter-`[TAGS]`, keine `John Doe`.
- [ ] Echte/realistische Zahlen, keine `99.99 %`.
- [ ] Aktive Sprache, keine AI-Floskeln (§6.1).

---

## 8. Anti-Patterns (NICHT tun)
- ❌ AI-Lila/Purple-Gradients, generisches Glassmorphism überall.
- ❌ Inter oder Serif als Default-Font.
- ❌ Tailwind/React auf den Marketing-Seiten.
- ❌ Alte Palette `#0369A1` / `rgba(3,105,161,…)`.
- ❌ Lucide-Icons als Default; inkonsistente Stroke-Widths. (Inline-SVG mit `stroke-width: 1.75` ist der Bestand.)
- ❌ Widersprüche zum „Einsteiger willkommen"-Versprechen auf der Vertrieb-Seite.
- ❌ Funktionalität brechen; große Rewrites statt gezielter Verbesserungen.

---

## 9. Build, Befehle & Branch-Regeln

```bash
npm install
npm run dev      # Dev-Server (astro dev)
npm run build    # MUSS fehlerfrei durchlaufen vor jedem Commit
npm run preview  # (Netlify-Adapter: eingeschränkt)
```

- **Branch:** Entwicklung auf `claude/website-deployment-security-dpw830`. Nie ungefragt auf andere Branches pushen.
- **Workflow:** Änderung → `npm run build` (grün) → Commit mit klarer Message → `git push -u origin <branch>` (bei Netzwerkfehler bis 4× mit Backoff retrien).
- **Kein PR** ohne ausdrückliche Aufforderung.
- Commit-Konvention der laufenden Verbesserungs-Schleife: `Loop iter <N>: <was>`.

### Hilfsskript: Platzhalter-Bilder lokal rendern (sharp)
Da externe Bild-Dienste blockiert sind (§10), Platzhalter via `sharp` (bereits Dependency) aus SVG zu JPG rendern. Beispiel siehe Commit `a44f44e` (Cobalt-Gradient + Silhouette/Monogramm). Script im Projekt-Root ablegen (damit `sharp` aufgelöst wird), ausführen, danach löschen.

---

## 10. Bekannte Einschränkungen der Ausführungsumgebung
- **Externe KI-Bilddienste sind blockiert** (Netzwerk-Policy; Pollinations/Unsplash/etc. → 403). Es gibt **kein lokales KI-Bildmodell**. → Echte KI-Fotos können hier nicht erzeugt werden; stattdessen lokal gerenderte on-brand Platzhalter (sharp).
- **Kein E-Mail-Versand** möglich (kein Mail-Tool). Reports als Datei im Repo + Push-Benachrichtigung.
- **Weekly/Usage-Limit nicht auslesbar** — kann nicht programmatisch überwacht werden; Plattform pausiert bei Limit automatisch.
- **Container ist ephemer** — wird bei Inaktivität recycelt. Darum: nach jedem Schritt committen+pushen (GitHub = sicher), nicht auf lokalen Zustand verlassen.

---

## 11. Benötigte echte Bilder (aktuell Platzhalter)
Diese Dateien existieren als **lokal gerenderte Platzhalter** und sollten durch echte Fotos ersetzt werden (gleiche Dateinamen → automatisch übernommen):
- `/public/images/paul-portrait.jpg` — echtes Porträt von Paul (Vertrieb „Hallo, ich bin Paul").
- `/public/images/partner-1.jpg`, `/public/images/partner-2.jpg` — Fotos der Testimonial-Partner (Kreisausschnitt).
- Optional: seitenspezifische OG-Bilder unter `/public/images/og/` (1200×630 JPG) + in MDLayout/Seiten als `ogImage` verdrahten.

---

## 12. Stand & offener Backlog

**Erledigt** (Branch `claude/website-deployment-security-dpw830`): Rebrand auf Cobalt; Vertrieb-Seite auf „0 auf 100"/Motivation umgebaut (Kern-Sektion, FAQ, Lernweg-Timeline, Paul-Signatur, Meta/CTA, Widersprüche entfernt); Website-Audit (Nav focus-visible, Blog-Breakpoint, lazy-loading, Compare-Hover, Ton-Konsistenz, Startseiten-Teaser, Logo-Loading); beschreibende Alt-Texte; Platzhalter-Bilder.

**Offen / empfohlen:**
1. **Raster-OG-Bilder** pro Seite generieren + in MDLayout default und je Seite als `ogImage` setzen (SVG-OG ersetzen). *(angefangen: `public/images/og/home.jpg`, `webdesign.jpg`)*
2. Echte Fotos statt Platzhalter (§11).
3. Wiederholte Inline-SVG-Icons in eine `Icon.astro`-Komponente extrahieren (ab ~3× Duplikat).
4. Blog-Kategorie-Label semantisch (`role="doc-subtitle"` statt nacktem `<span>`).
5. Erweiterte Alt-Texte auf weiteren Bildern; Kontrast-Audit Subtle-Töne.

---

## 13. Wie ein anderer Chat hiermit arbeitet
1. Dieses Dokument + die genannten Skills lesen.
2. `npm install`, `npm run build` (grün?) — Baseline herstellen.
3. Für **Verbesserungen**: Backlog (§12) oder ein frisches Audit einer Seite gegen §7; **eine** konkrete Verbesserung pro Schritt, build → commit → push.
4. Für **Neuerstellung von mediadrift.de**: §2–§7 sind die verbindliche Spezifikation. Marke (§3), Palette/Fonts (§4), Botschaft (§6) exakt übernehmen; Kriterien (§7) erfüllen; Anti-Patterns (§8) vermeiden.
5. Für **eine Kundenwebsite** (die MediaDrift baut): §0 beachten — eigene, einzigartige Identität aus dem Kunden-Brief ableiten. Nur die **universellen** Teile übernehmen: Ton-Regeln (§6.1), Qualitätskriterien (§7), Anti-Patterns (§8), Prozess (§9, §13). **Niemals** MediaDrifts Cobalt/Outfit aufzwingen.
6. Immer gegen das Individualitäts-Mandat (§0) und die Qualitäts-Checkliste (§7) prüfen, bevor du committest — und bei der Vertrieb-Seite zusätzlich gegen das „Einsteiger-willkommen / 0 auf 100"-Versprechen (§6.2).
