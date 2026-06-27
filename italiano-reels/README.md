# 🇮🇹 Italiano-Reels — täglich 7 Wörter

Ein automatisches Content-System für eine Sprachlern-Seite (TikTok / Instagram Reels /
YouTube Shorts) nach dem Vorbild von Kanälen wie `@thomas.spanisch` — nur für
**Italienisch**. Jeden Tag ein Video im Hochformat (9:16, 1080×1920), **~60 Sekunden**,
mit **7 Vokabeln** und **moderner KI-Stimme**.

## Was es macht

Pro Tag wird ein Video gebaut aus:

1. **Intro** — Thema des Tages + „Pronti? Via!"
2. **7 Wort-Karten** — jeweils:
   - großes italienisches Wort (eingefärbt nach Genus: 🔵 maskulin `il` / 🌸 feminin `la`)
   - deutsche Übersetzung
   - Beispielsatz (Italienisch + Deutsch) in einer sauberen Karte
   - **KI-Stimme** spricht das Wort 2× + den Beispielsatz
3. **Outro** — „Bravo! Segui + Condividi" Call-to-Action

Italien-Flaggen-Akzente, sanfte Ken-Burns-Zooms und weiche Überblendungen.

## Die KI-Stimme (kein Claude)

Zwei Stimm-Optionen — **keine** davon ist Claude:

| Option | Qualität | Netz nötig | Einsatz |
|--------|----------|-----------|---------|
| **Piper** (`it-riccardo_fasol`) | gut, neuronal | nein (offline) | Standard, läuft überall |
| **edge-tts** (`it-IT-IsabellaNeural` u.a.) | sehr gut, Microsoft Neural | ja | eigene Maschine / CI |

```bash
python3 generate_lesson.py                 # Piper (offline)
python3 generate_lesson.py --voice edge     # Microsoft Neural (Isabella)
python3 generate_lesson.py --voice edge --edge-voice it-IT-DiegoNeural
```

> Hinweis: In der Cloud-Sandbox von Claude Code sind Microsoft/Google/ElevenLabs
> blockiert — dort läuft nur Piper. Auf deinem Rechner oder in GitHub Actions
> funktioniert `edge` für die bessere Stimme.

## Schnellstart (lokal)

```bash
cd italiano-reels
pip install -r requirements.txt
bash download_voice.sh          # holt die Piper-Stimme (~28 MB) von GitHub
python3 generate_lesson.py      # baut das nächste Tagesvideo -> output/
```

## Der automatische Workflow (jeden Tag)

`.github/workflows/daily-italiano.yml` läuft **täglich um 06:17 UTC** (anpassbar)
und ist auch manuell auslösbar (`workflow_dispatch`). Er:

1. zieht die nächsten **7 Wörter** aus `curriculum.json` (siehe `state.json`),
2. erzeugt das Video mit KI-Stimme,
3. lädt es als **Artefakt** hoch (90 Tage abrufbar),
4. committet den Fortschritt (`state.json`) zurück.

Das Video lädst du danach aus dem Actions-Lauf herunter und postest es.

## Inhalte erweitern

Neue Tage einfach in `curriculum.json` ergänzen — jedes `day` hat ein `theme`
und genau 7 `words` mit Feldern:

```json
{ "it": "il caffè", "de": "der Kaffee", "gender": "m",
  "ex_it": "Vorrei un caffè, per favore.",
  "ex_de": "Ich hätte gern einen Kaffee, bitte." }
```

`gender`: `"m"` (maskulin, blau), `"f"` (feminin, rosa) oder `"-"` (neutral).

## Dateien

| Datei | Zweck |
|-------|-------|
| `generate_lesson.py` | Hauptpipeline (TTS + Bild + Schnitt) |
| `curriculum.json`    | Wortbank, nach Themen-Tagen geordnet |
| `state.json`         | merkt sich, welcher Tag als nächstes dran ist |
| `download_voice.sh`  | lädt die Piper-Stimme |
| `requirements.txt`   | Python-Abhängigkeiten |
| `output/`            | fertige Videos |
