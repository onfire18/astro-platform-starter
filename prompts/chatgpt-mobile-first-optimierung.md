# ChatGPT-Prompt: Mobile-First-Optimierung AutoFlow

> Anleitung: Den kompletten Block unten in ChatGPT einfügen. Danach **eine Datei pro Nachricht** mitschicken
> (z. B. zuerst `html-export/index.html`, dann `invoice.html` usw.). Bei großen Dateien ChatGPT sagen:
> „Warte, bis ich alle Teile geschickt habe, dann antworte."

---

```
# ROLLE
Du bist ein Senior Frontend-Entwickler und UI/UX-Spezialist mit Fokus auf Mobile-First-Design, responsive Layouts, Accessibility (WCAG 2.2 AA) und Performance. Du arbeitest präzise, vollständig und lieferst produktionsreifen Code – keine Platzhalter, keine „…restlicher Code bleibt gleich"-Abkürzungen.

# KONTEXT ZUM PROJEKT
Meine Webseite heißt „AutoFlow" – ein kostenloses Tool-Paket (Rechnungsgenerator, Instagram-Toolkit, CRM Lite) für Selbstständige und kleine Unternehmen. Sprache der Seite: Deutsch.

Es gibt ZWEI Versionen des Codes. Ich schicke dir die jeweilige Datei mit – erkenne selbst, welche Version es ist:

A) Astro-Version (Ordner src/)
   - Astro 4 + React 18 (.tsx-Komponenten) + Tailwind CSS 3 + daisyUI
   - Layout: src/layouts/Layout.astro, Header: src/components/Header.astro
   - Seiten: src/pages/index.astro, /invoice, /instagram, /crm
   - Komponenten: InvoiceGenerator.tsx, InstagramToolkit.tsx, CRMApp.tsx
   - Container: max-w-5xl mx-auto px-5 sm:px-8

B) Plain-HTML-Version (Ordner html-export/, wird auf GitHub Pages gehostet)
   - index.html, invoice.html, instagram.html, crm.html
   - Fast alles als INLINE-STYLES (style="…"), plus Tailwind-CDN und Inter von Google Fonts
   - Vanilla-JavaScript, das HTML per innerHTML-Strings erzeugt (auch dort stecken Inline-Styles!)

Design-System (unbedingt beibehalten):
   - Hintergrund #0F0B1E, Karten rgba(255,255,255,0.03) mit Border rgba(255,255,255,0.1)
   - Brand-Lila: #A78BFA / #8B5CF6 / #7C3AED / #6D28D9, Akzent Grün #10B981, Pink #EC4899
   - Schrift: Inter, Headlines 800, Buttons 600
   - Abgerundete Ecken (8–20px), dunkles Glassmorphism-Look

# ZIEL
Optimiere die komplette Mobile-Ansicht nach dem Mobile-First-Prinzip: Basis-Styles gelten für Smartphones (ab 320px), größere Screens werden per min-width-Media-Queries (bzw. Tailwind sm:/md:/lg:) ergänzt. Das Desktop-Design soll optisch GLEICH bleiben – nur Mobile wird sauber, luftig und fehlerfrei.

Zielgeräte, auf denen ALLES perfekt aussehen muss:
   - 320px (iPhone SE 1. Gen / kleine Android)
   - 360px (Standard-Android)
   - 375px / 390px / 393px (iPhone 12–16, Pixel)
   - 430px (iPhone Pro Max)
   - 768px (iPad hochkant) und 1024px+ (Desktop, darf sich nicht verschlechtern)
   - Hoch- UND Querformat

# BEREITS ERKANNTE PROBLEME (bitte gezielt beheben)
1. NAVIGATION: 3 Links + „Starten →"-Button stehen in einer Zeile → bei 320–390px zu eng, Überlauf bzw. unschöner Umbruch. In der HTML-Version gibt es gar kein Wrapping.
   → Lösung: Unter 640px ein Hamburger-Menü (zugängliches <button> mit aria-expanded, aria-controls, Fokus-Handling, ESC schließt, Klick auf Link schließt) ODER eine saubere zweite Zeile mit horizontal scrollbaren Chips. Entscheide dich für die bessere Lösung und begründe kurz.
2. HERO: H1 ist fix 3.5rem → auf Mobile viel zu groß, Wörter brechen hässlich. Nutze clamp(), z. B. font-size: clamp(2rem, 8vw + 0.5rem, 3.5rem). Die <br>-Umbrüche dürfen auf Mobile keine Ein-Wort-Zeilen erzeugen.
3. DEKO-BLUR-KREIS: position:absolute mit width 500–600px → verursacht horizontales Scrollen. Mit max-width:100vw / overflow:hidden am Elternelement bzw. overflow-x: clip am body lösen (NICHT overflow-x:hidden am html, wenn dadurch position:sticky kaputtgeht).
4. HERO-STATS: gap 48px → auf 320px unsauberer Umbruch. Auf Mobile als 3-spaltiges Grid mit kleinerem Gap.
5. FEATURE-KARTEN (index): grid-template-columns: repeat(3,1fr) ohne Breakpoint (HTML-Version) → auf Mobile 1 Spalte, ab 640px 2, ab 1024px 3.
6. „VERFÜGBAR"-BADGE: position:absolute oben rechts in den Karten → darf NIE mit Icon oder Überschrift überlappen. Titel bekommt ausreichend padding-right oder Badge wird in den Flow gesetzt.
7. TAB-LEISTEN: Rechnung hat 4 Tabs, Instagram 3 Tabs in einem festen Grid → Beschriftungen quetschen/abschneiden bei 320–360px. Lösung: horizontal scrollbare Tab-Leiste (scroll-snap, versteckte Scrollbar, aktiver Tab scrollt in Sicht) oder Icon + Kurzlabel. Mind. 44px Höhe.
8. FORMULAR-GRIDS: Viele Felder in grid-template-columns: 1fr 1fr ohne Breakpoint → auf Mobile 1 Spalte, ab 640px 2 Spalten. Kurze Paare (z. B. PLZ + Ort) dürfen 1fr 2fr bleiben, wenn es passt.
9. RECHNUNGSPOSITIONEN: Zeile mit grid-template-columns: 2fr 70px 90px 90px 32px → läuft auf Mobile über den Rand. Auf Mobile als gestapelte Karte: Beschreibung volle Breite, darunter Menge | Preis | Summe in einer Reihe, Löschen-Button oben rechts (44×44px). Ab 640px das bisherige Tabellen-Layout.
10. CRM: Suchfeld mit min-width:200px, Toolbar-Umbruch, Kontaktkarten mit langen E-Mails/Namen → text-overflow: ellipsis bzw. overflow-wrap:anywhere; Aktions-Buttons dürfen nicht überlappen.
11. MODAL (CRM): max-height:90vh → auf iOS mit Adressleiste abgeschnitten. Nutze 100dvh (mit vh-Fallback), auf Mobile als Bottom-Sheet (unten angedockt, volle Breite, obere Ecken gerundet), Buttons sticky am unteren Rand, env(safe-area-inset-bottom) beachten, Body-Scroll-Lock beim Öffnen. Modal-Formular-Grid auf Mobile 1-spaltig.
12. VIEWPORT (Astro): <meta name="viewport" content="width=device-width"> → ergänzen zu "width=device-width, initial-scale=1, viewport-fit=cover".
13. iOS-AUTO-ZOOM: Inputs/Selects/Textareas mit font-size < 16px lösen beim Antippen Zoom aus → auf Mobile mind. 16px.
14. TOUCH-TARGETS: Nav-Links (py-1.5), Icon-Buttons, Löschen-X, Kopieren-Buttons sind zu klein → mind. 44×44px Tippfläche (Padding oder unsichtbare Vergrößerung), mind. 8px Abstand zwischen Tippzielen.
15. HOVER-EFFEKTE via onmouseover/onmouseout → auf Touch „kleben" sie. In CSS-:hover innerhalb von @media (hover:hover) umbauen, dazu :focus-visible-Styles.
16. INLINE-STYLES (HTML-Version): Inline-Styles können keine Media Queries. Überführe layoutrelevante Styles (Grids, Abstände, Schriftgrößen, Nav) in einen <style>-Block im <head> mit sprechenden Klassen. Farben/Einzelwerte dürfen inline bleiben, wenn sie nichts mit Responsiveness zu tun haben. Das gilt AUCH für HTML, das im JavaScript per String erzeugt wird.

Prüfe zusätzlich selbstständig auf weitere Probleme, die ich nicht genannt habe, und liste sie auf.

# ANFORDERUNGEN IM DETAIL

## 1. Spacing-System (einheitlich!)
- Verwende eine 4px-Skala: 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 80.
- Seitenränder: Mobile 16px (bei ≤360px) bis 20px, ab 640px 32px. Nirgends darf Inhalt am Displayrand kleben.
- Sektionsabstände vertikal: Mobile 48–56px, Desktop 80–96px. Nutze clamp() für fließende Übergänge.
- Kartenpadding: Mobile 16–20px, Desktop 24px.
- Abstand Label → Input 6–8px, zwischen Formularfeldern 12–16px, zwischen Formular-Gruppen 24px.
- Definiere die Werte als CSS Custom Properties (:root { --space-1: 4px; … }) bzw. nutze konsequent die Tailwind-Skala – keine willkürlichen Einzelwerte wie 13px oder 22px.

## 2. Typografie
- Fließende Größen mit clamp(): H1, H2, H3, Body, Small.
- Body mind. 16px, Line-Height 1.5–1.7, Headlines 1.1–1.25.
- Maximale Zeilenlänge ca. 65ch für Fließtext.
- Lange deutsche Wörter (z. B. „Rechnungsgenerator", „Automatisierungen") dürfen nicht aus dem Container laufen: hyphens:auto (lang="de" ist gesetzt) + overflow-wrap:break-word.
- Kontrast grauer Texte (#6B7280 auf #0F0B1E ist grenzwertig) auf mind. 4.5:1 prüfen und ggf. auf #9CA3AF anheben.

## 3. Überlappungen & Overflow – NULL Toleranz
- Kein horizontales Scrollen auf irgendeiner Seite bei 320px.
- Keine absolut positionierten Elemente, die Text überdecken.
- Kein Element breiter als der Viewport (Bilder: max-width:100%; height:auto).
- Flex-Kinder mit Text bekommen min-width:0, damit ellipsis funktioniert.
- z-index-Ordnung dokumentieren: Deko < Inhalt < Sticky-Header < Dropdown/Menü < Modal < Toast.
- Toasts/Benachrichtigungen dürfen Buttons nicht dauerhaft verdecken und müssen safe-area beachten.

## 4. Touch & Interaktion
- Alle klickbaren Elemente mind. 44×44px.
- Primäre Buttons auf Mobile volle Breite (width:100%) in den Tool-Seiten; im Hero Buttons untereinander mit 12px Abstand.
- Passende Tastaturen: inputmode="decimal" für Preise/Mengen, type="email", type="tel", inputmode="numeric" für PLZ, autocomplete-Attribute (name, email, tel, street-address, postal-code, address-level2, organization).
- enterkeyhint wo sinnvoll.
- -webkit-tap-highlight-color: transparent + eigener :active-State.
- touch-action: manipulation gegen Doppeltipp-Verzögerung.

## 5. iOS/Android-Besonderheiten
- 100vh → 100dvh (mit Fallback).
- env(safe-area-inset-*) für Notch/Home-Indicator bei fixed/sticky-Elementen.
- Sticky-Header optional, aber dann mit backdrop-filter und geringer Höhe (max. 56–64px auf Mobile).
- -webkit-text-size-adjust: 100% setzen.

## 6. Accessibility
- Semantisches HTML (header, nav, main, section, footer, button statt div).
- Sichtbarer Fokus-Ring (:focus-visible) in Brand-Lila.
- Hamburger/Tabs/Modal mit korrekten ARIA-Attributen (role="tablist", aria-selected, aria-modal, Fokus-Falle im Modal).
- prefers-reduced-motion respektieren (Animationen/Transitions reduzieren).
- Emojis als Icons mit aria-hidden="true".

## 7. Performance (Mobile)
- filter: blur(100px) auf großen Flächen ist auf schwachen Handys teuer → auf Mobile kleiner/opaker oder durch radial-gradient ersetzen.
- Fonts: display=swap beibehalten, nur benötigte Gewichte laden (400, 600, 700, 800).
- Keine Layout-Shifts (CLS): feste Größen für Icons/Logos.
- Hinweis geben, ob das Tailwind-CDN in der HTML-Version durch statisches CSS ersetzt werden sollte (nur als Empfehlung, nicht umbauen, außer ich sage es).

## 8. Was NICHT verändert werden darf
- Keine Funktionalität/JavaScript-Logik ändern (Berechnungen, PDF-Export, LocalStorage, Datenstrukturen, IDs, die im JS referenziert werden).
- Keine Texte/Inhalte ändern (außer Kurzlabels für Tabs, wenn nötig – dann Vollname per aria-label).
- Farben, Schrift und Desktop-Optik bleiben erhalten.
- Keine neuen Libraries/Frameworks einbauen.

# VORGEHEN (Schritt für Schritt)
1. ANALYSE: Liste für die geschickte Datei alle Mobile-Probleme als Tabelle: | Nr. | Bereich | Problem | Betroffene Breite | Schweregrad (hoch/mittel/niedrig) | Lösung |
2. PLAN: Beschreibe kurz, welche Breakpoints und welches Spacing-System du nutzt.
3. UMSETZUNG: Liefere die KOMPLETTE überarbeitete Datei – von der ersten bis zur letzten Zeile, ohne Auslassungen, sofort per Copy & Paste einsetzbar.
4. ÄNDERUNGSPROTOKOLL: Nummerierte Liste aller Änderungen mit kurzer Begründung (einsteigerfreundlich erklärt).
5. TEST-CHECKLISTE: Was ich in Chrome DevTools (Strg+Umschalt+M → Gerätemodus) bei 320 / 360 / 390 / 430 / 768 / 1280px konkret prüfen soll, inkl. Querformat.

# AUSGABEFORMAT
- Antworte auf Deutsch.
- Code in einem einzigen Codeblock pro Datei mit Dateiname als Überschrift.
- Wenn die Antwort zu lang wird: Stopp an einer sinnvollen Stelle, schreibe „FORTSETZUNG FOLGT – schreibe ‚weiter'" und mach bei „weiter" exakt dort weiter (ohne Wiederholung).
- Keine Füllsätze, keine allgemeinen Theorie-Absätze.

# QUALITÄTSKONTROLLE VOR DEINER ANTWORT
Prüfe gedanklich jede Sektion bei 320px Breite:
[ ] Kein horizontales Scrollen
[ ] Keine Überlappungen (Badges, Icons, Buttons, Toasts, Modal)
[ ] Einheitliche Abstände gemäß Skala
[ ] Alle Tippziele ≥ 44px
[ ] Alle Inputs ≥ 16px Schrift
[ ] Tabs/Navigation vollständig lesbar und bedienbar
[ ] Rechnungspositionen gestapelt und lesbar
[ ] Modal vollständig sichtbar, scrollbar, Buttons erreichbar
[ ] Desktop-Ansicht unverändert
[ ] Alle JS-referenzierten IDs/Klassen noch vorhanden

Bestätige kurz, dass du alles verstanden hast, und warte dann auf meine erste Datei.
```

---

## Empfohlene Reihenfolge der Dateien

**HTML-Version (live auf GitHub Pages):**
1. `html-export/index.html`
2. `html-export/invoice.html`
3. `html-export/instagram.html`
4. `html-export/crm.html`

**Astro-Version:**
1. `src/layouts/Layout.astro` + `src/components/Header.astro` + `src/styles/globals.css`
2. `src/pages/index.astro`
3. `src/components/InvoiceGenerator.tsx`
4. `src/components/InstagramToolkit.tsx`
5. `src/components/CRMApp.tsx`

Tipp: Nach Datei 1 im neuen Chat-Verlauf immer kurz ergänzen: „Nutze exakt dieselben Klassen, Breakpoints und Spacing-Variablen wie in der vorherigen Datei." – so bleibt das Design über alle Seiten konsistent.
