# 🇩🇪→🇮🇹 „Wie sagt man?" — Deutsch → Italienisch (Lehrer-Edition)

Tägliches Vokabel-Quiz im Notizblock-Look mit **Stift-Zeiger** und **Lehrer-Stimme**.
9:16, ~60 Sekunden, 7 Wörter (Wortfeld pro Tag). Für TikTok / Reels / Shorts.

## Besonderheiten

- **Wortfelder**: jedes Video ein Thema (Einkaufen, Imperativ, Gefühle …).
- **Hook am Anfang**: erstes Wort ist ein lustiger Aufmacher (z. B. *scemo*, *Basta!*).
- **Stift-Zeiger**: ein Bleistift unterstreicht das **italienische** Lösungswort,
  wischt hin und her und gleitet Zeile für Zeile nach unten — verdeckt keine Wörter.
- **Lehrer-Stimme**: Frage → Rate-Pause → Lösung → „Sag's mit mir" (Wiederholung),
  kurze Wiederholung in der Mitte, motivierende Anmoderation/Outro.
- **Gut lesbare Schrift**: Baloo 2 ExtraBold.

## Stimme (kein Claude)

| Backend | Qualität | Voraussetzung |
|---------|----------|---------------|
| `elevenlabs` | ★★★ — EINE Stimme spricht DE + IT | `ELEVENLABS_API_KEY` |
| `edge`       | ★★ Microsoft Neural | Internet |
| `piper`      | ★ offline (läuft überall) | nichts |

```bash
python3 generate_quiz.py                       # Piper (offline, Standard)
python3 generate_quiz.py --backend elevenlabs   # ElevenLabs (Key nötig)
```

> In der Claude-Sandbox sind Cloud-TTS blockiert → dort nur Piper.

## Schnellstart

```bash
cd quiz-italienisch
pip install -r requirements.txt
bash download_assets.sh        # Stimmen (DE+IT) + Schrift
python3 generate_quiz.py       # nächstes Tagesvideo -> output/
```

## Täglich automatisch

`.github/workflows/daily-quiz-italienisch.yml` läuft täglich, nutzt ElevenLabs
falls Secret `ELEVENLABS_API_KEY` gesetzt ist, sonst Piper, und lädt das Video
als Artefakt hoch. `state.json` rückt einen Tag weiter.

## Inhalte erweitern

`curriculum.json` → neue Tage. Pro Wort:

```json
{ "emoji": "🛒", "de": "kaufen", "it": "comprare", "repeat": true }
```

`hook: true` markiert das Aufmacher-Wort (gold), `repeat: true` fügt eine
„Sag's mit mir"-Wiederholung hinzu.
