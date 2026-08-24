# MeinExpress – TikTok Outro (3 Sekunden)

Fertige 3-Sekunden-Animation zum Anhängen ans Ende jedes TikTok-Videos:
Logo fährt ein → Claim „Jetzt Transporte auf & nach Mallorca“ → Button „Jetzt buchen“ →
Website `mein-express.com`.

## Fertige Dateien (`dist/`)

| Datei | Format | Wofür |
|---|---|---|
| `meinexpress-outro-1080x1920.mp4` | 1080×1920, 30 fps, H.264, 3 s | Direkt in TikTok/CapCut/Reels/Shorts ans Video-Ende hängen |
| `meinexpress-outro-alpha.webm` | 1080×1920, VP9 mit Alphakanal | Zum **Drüberlegen** über die letzten Sekunden des Videos (transparenter Hintergrund) |
| `meinexpress-outro.gif` | 400 px breit | Schnelle Vorschau, z. B. für WhatsApp |
| `meinexpress-outro.html` | eigenständige HTML-Datei | Vorschau im Browser (läuft in Schleife, Klick = neu abspielen). Enthält Logo + Schriften eingebettet, funktioniert offline |

Kein Ton – das Outro läuft über der Musik des Videos weiter.

### So hängst du es an ein TikTok-Video (CapCut)

1. Video in CapCut öffnen → `meinexpress-outro-1080x1920.mp4` importieren.
2. Clip ans Ende der Timeline ziehen (3 s).
3. Optional Übergang „Auflösen“ (0,3 s) zwischen Video und Outro.
4. Exportieren mit 1080×1920, 30 fps.

Alternative mit der Alpha-Version: `meinexpress-outro-alpha.webm` als **zweite Spur**
über die letzten 3 Sekunden legen – dann bleibt das Video im Hintergrund sichtbar.
(CapCut Desktop und Premiere/DaVinci lesen WebM mit Alpha; die TikTok-App selbst nicht –
dort die MP4-Variante verwenden.)

## Texte / Farben ändern

Alles steht in `template.html`:

* Zeilen im `<div class="headline">` – z. B. Claim umformulieren
* `<span class="txt">Jetzt buchen</span>` – Button-Text
* `<div class="site">mein-express.com</div>` – Website-Adresse
* `<div class="kicker">…</div>` – Zeile ganz unten
* Farben oben in `:root` (`--blue`, `--orange`, …)
* Länge: `window.OUTRO_DURATION` (Sekunden) im `<script>`-Block

Danach neu bauen:

```bash
cd outro
npm i -D playwright-core ffmpeg-static   # einmalig
node build.mjs                            # baut dist/meinexpress-outro.html
node render.mjs                           # rendert MP4 + Alpha-WebM + GIF
```

Optionen: `node render.mjs --fps 60 --duration 4 --no-gif --keep-frames`

`render.mjs` nimmt die Animation Bild für Bild in Chromium auf (jedes Bild wird exakt
auf seinen Zeitpunkt gesetzt, deshalb ist das Ergebnis absolut ruckelfrei) und encodet
sie anschließend mit ffmpeg. Ist Chromium nicht über Playwright installiert, den Pfad
angeben: `CHROMIUM_PATH=/pfad/zu/chrome node render.mjs`.

## Dateien

* `template.html` – Quelle der Animation (Logo/Schriften als Platzhalter)
* `build.mjs` – bettet Logo + Schriften ein → `dist/meinexpress-outro.html`
* `render.mjs` – Frames aufnehmen + Video encodieren
* `logo.png` – freigestelltes Logo (transparenter Hintergrund)
* `logo-source.jpg` – Original-Logo wie geliefert
* `fonts/` – Anton (Headline) + Montserrat (Button/URL), latin-Subset
