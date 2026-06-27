# 🇩🇪→🇪🇸 „Wie sagt man?" — Deutsch→Spanisch Quiz-Reels

Tägliches Vokabel-Quiz im **Notizblock-Look** (nach dem Vorbild von Kanälen wie
*Thomas Spanisch*), für TikTok / Instagram Reels / YouTube Shorts.
Hochformat 9:16, **~60 Sekunden**, **7 Wörter** pro Tag, mit **bilingualer KI-Stimme**.

## Ablauf eines Videos

1. **Intro** — „Wie sagt man das auf Spanisch? Rate mit!"
2. Pro Wort (7×):
   - deutsches Wort + Emoji erscheinen, die KI-**Stimme spricht es deutsch**,
   - kurze **Rate-Pause**,
   - die spanische Lösung wird **aufgedeckt** und **spanisch gesprochen**.
3. **Outro** — „Wie viele hattest du richtig? Folge für mehr!"

Holz-Hintergrund, Spiralblock, Handschrift, weiches Aufdecken, Zeilen-Highlight.

## Die Stimme — ElevenLabs (DE + ES mit EINER Stimme)

`tts.py` unterstützt drei Backends. Der Wunsch-Fall ist **ElevenLabs**:
eine einzige multilinguale Stimme (`eleven_multilingual_v2`) spricht sowohl
**Deutsch als auch Spanisch**.

| Backend | Qualität | Voraussetzung |
|---------|----------|---------------|
| `elevenlabs` | ★★★ (wie gewünscht) | `ELEVENLABS_API_KEY` (Umgebungsvariable / GH-Secret) |
| `edge`       | ★★ Microsoft Neural | nur Internet |
| `piper`      | ★ offline | nichts (läuft überall, auch in der Claude-Sandbox) |

```bash
export ELEVENLABS_API_KEY="sk_..."
python3 generate_quiz.py --backend elevenlabs        # eine Stimme DE+ES
python3 generate_quiz.py --backend edge              # Microsoft Neural
python3 generate_quiz.py                              # Piper (offline, Standard)
```

Optional die ElevenLabs-Stimme wählen: `export ELEVENLABS_VOICE_ID="..."`.

> Hinweis: In der Cloud-Sandbox von Claude Code ist die ElevenLabs-API (wie alle
> Cloud-TTS) blockiert — dort läuft nur Piper (deutsche + spanische Stimme).
> Auf deinem Rechner oder in GitHub Actions funktioniert `elevenlabs` voll.

## Schnellstart

```bash
cd wie-sagt-man
pip install -r requirements.txt
bash download_assets.sh         # Piper-Stimmen + Handschrift-Fonts
python3 generate_quiz.py        # nächstes Tagesvideo -> output/
```

## Täglich automatisch

`.github/workflows/daily-wie-sagt-man.yml` läuft **täglich (06:23 UTC)** und manuell.
Er nutzt **ElevenLabs**, falls das Secret `ELEVENLABS_API_KEY` gesetzt ist —
sonst automatisch Piper. Das fertige Video liegt als **Artefakt** (90 Tage) bereit;
`state.json` rückt einen Tag weiter.

→ ElevenLabs aktivieren: im GitHub-Repo unter *Settings → Secrets and variables →
Actions* ein Secret `ELEVENLABS_API_KEY` anlegen.

## Inhalte erweitern

Neue Tage in `curriculum.json`. Jedes Wort:

```json
{ "emoji": "🍎", "de": "Apfel", "es": "la manzana" }
```

Emoji werden über *Noto Color Emoji* gerendert.

## Dateien

| Datei | Zweck |
|-------|-------|
| `generate_quiz.py` | Pipeline (Notizblock-Render + bilinguale TTS + Schnitt) |
| `tts.py`           | Stimmen-Backends (ElevenLabs / edge / Piper) |
| `curriculum.json`  | Wortbank (DE→ES, mit Emoji), nach Themen |
| `state.json`       | nächster Tag |
| `download_assets.sh` | lädt Stimmen + Fonts |
