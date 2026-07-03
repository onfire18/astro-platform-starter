# PLATZHALTER — Einkaufsliste für Paul

Alles hier abarbeiten, dann ist die Seite komplett. Die Seite funktioniert auch jetzt schon —
fehlende Inhalte werden sauber als Platzhalter angezeigt.

## Marke & Design
- [ ] Markenname — Was: Standard ist „Street Activation", Alternative „Attention Marketing". Änderung an **einer** Stelle: `js/main.js`, Konstante `MARKEN_NAME` — Format: Text
- [ ] Logo — Was: Logo für Navigation + Footer. In `index.html` den Kommentar bei `nav-logo` beachten — Format: SVG oder PNG mit transparentem Hintergrund, ca. 200×50 px → `assets/images/logo.svg`
- [ ] OG-Vorschaubild — Was: Bild, das beim Teilen des Links (WhatsApp, Instagram etc.) erscheint — Format: JPG 1200×630 → `assets/images/og-bild.jpg`

## Videos (einfach Datei mit genau diesem Namen ablegen — Seite erkennt sie automatisch)
- [ ] Sektion 1 (Hero) — Was: Hintergrund-Reel, stumm, viele Menschen/Lachen/Action — Format: MP4 quer 16:9, max. 10 MB, ohne Ton nötig → `assets/videos/hero-reel.mp4`
- [ ] Sektion 2 — Was: Vorstellungsvideo Isabelle & Paul (90 Sek.) — Format: MP4 16:9, max. 50 MB → `assets/videos/vorstellung.mp4`
- [ ] Sektion 2 — Was: Vorschaubild (Poster) fürs Vorstellungsvideo — Format: JPG 1280×720 → `assets/poster/vorstellung.jpg`
- [ ] Sektion 6 — Was: Beispielvideo Burger King — Format: MP4 vertikal 9:16, max. 10 MB → `assets/videos/beispiel-burger-king.mp4` (+ Poster `assets/poster/beispiel-burger-king.jpg`, JPG 720×960)
- [ ] Sektion 6 — Was: Beispielvideo Forum — Format: wie oben → `assets/videos/beispiel-forum.mp4` (+ Poster `assets/poster/beispiel-forum.jpg`)
- [ ] Sektion 6 — Was: Beispielvideo Cookie Shop — Format: wie oben → `assets/videos/beispiel-cookie-shop.mp4` (+ Poster `assets/poster/beispiel-cookie-shop.jpg`)
- [ ] Sektion 6 — Was: Beispielvideo Pommes — Format: wie oben → `assets/videos/beispiel-pommes.mp4` (+ Poster `assets/poster/beispiel-pommes.jpg`)
- [ ] Sektion 6 — Was: Beispielvideo Pizza — Format: wie oben → `assets/videos/beispiel-pizza.mp4` (+ Poster `assets/poster/beispiel-pizza.jpg`)
- [ ] Sektion 6 — Was: Beispielvideo Fitnessstudio — Format: wie oben → `assets/videos/beispiel-fitnessstudio.mp4` (+ Poster `assets/poster/beispiel-fitnessstudio.jpg`)

## Fotos
- [ ] Fotos Isabelle & Paul — Was: aktuell nicht auf der Seite eingebaut (Sales-Page lebt von den Videos). Optional für Impressum/„Über uns"-Erweiterung bereithalten — Format: JPG 1200×800

## Zahlen (Sektion 8 — alle in `js/main.js`, Konstante `ZAHLEN` eintragen)
- [ ] Sektion 8 — Was: Views in Mio. (nur Zahl, z. B. 12) — Format: Zahl → `views`
- [ ] Sektion 8 — Was: Impressionen in Mio. — Format: Zahl → `impressionen`
- [ ] Sektion 8 — Was: Teilnehmer gesamt — Format: Zahl → `teilnehmer`
- [ ] Sektion 8 — Was: Anzahl Unternehmen — Format: Zahl → `unternehmen`
- [ ] Sektion 8 — Was: Kommentare gesamt — Format: Zahl → `kommentare`

## Links & Kontakt
- [ ] Alle Buttons — Was: Buchungs-Link (Calendly o. Ä.) für „Kostenloses Erstgespräch buchen". Nur an **einer** Stelle eintragen: `js/main.js`, Konstante `BUCHUNGS_LINK` — Format: URL (https://…)
- [ ] Footer — Was: E-Mail-Adresse — Format: Text, in `index.html` im Footer ersetzen
- [ ] Footer — Was: Telefonnummer — Format: Text, in `index.html` im Footer ersetzen (Mediadrift-Bezug optional: mediadrift.org · +49 0159 05405185 steht schon als Vorschlag drin)

## Recht (DSGVO)
- [ ] impressum.html — Was: Anbieter, Anschrift, Kontakt, Verantwortlicher, ggf. USt-IdNr., EU-Streitschlichtung — Format: Text in die `[PLATZHALTER]`-Blöcke
- [ ] datenschutz.html — Was: Verantwortlicher, Hosting-Hinweis, Google-Fonts-Hinweis, Buchungs-Tool-Hinweis, Betroffenenrechte, Speicherdauer — Format: Text in die `[PLATZHALTER]`-Blöcke
- [ ] DSGVO / Google Fonts — Was: Die Schriften (Archivo Black, Inter) werden aktuell per Link von Google geladen. **Empfehlung: lokal hosten** (Dateien herunterladen, in `assets/` legen, `<link>`-Zeilen in allen 3 HTML-Dateien ersetzen). Solange sie von Google kommen, muss die Datenschutzerklärung darüber informieren — Format: Entscheidung + ggf. WOFF2-Dateien
- [ ] DSGVO / Buchungs-Tool — Was: Calendly & Co. werden bewusst **nicht eingebettet**, sondern nur verlinkt (öffnet neuen Tab). Das ist DSGVO-freundlich. Beim Einbetten wäre eine Einwilligung nötig — Format: nichts zu tun, nur wissen

## Hinweise zur Pflege (kein To-do)
- Videos/Poster: Dateien einfach unter den oben genannten Namen ablegen — die Kacheln schalten sich automatisch von „Video folgt" auf „▶ Ansehen" um.
- Alle sichtbaren `[PLATZHALTER: …]`-Hinweise auf der Seite verschwinden automatisch, sobald der jeweilige Inhalt da ist (Hero-Reel, Buchungs-Link) oder müssen im HTML ersetzt werden (Footer-Kontakt, Rechtsseiten).
