"""
Bilinguale TTS-Abstraktion (Deutsch + Spanisch).
Drei Backends — eine einheitliche Funktion synth(text, lang, out_path).

  ┌─────────────┬────────────────────────┬──────────────┬────────────────────────┐
  │ Backend     │ Qualität               │ Netz / Key   │ DE+ES mit EINER Stimme │
  ├─────────────┼────────────────────────┼──────────────┼────────────────────────┤
  │ elevenlabs  │ ★★★ (wie gewünscht)    │ API-Key      │ ja (multilingual_v2)   │
  │ edge        │ ★★  Microsoft Neural   │ nur Netz     │ nein (Stimme je Sprache)│
  │ piper       │ ★   offline, läuft hier│ nichts       │ nein (Modell je Sprache)│
  └─────────────┴────────────────────────┴──────────────┴────────────────────────┘

ElevenLabs ist der Wunsch-Fall: EINE Stimme, die Deutsch UND Spanisch spricht
(Model `eleven_multilingual_v2`). Key über Umgebungsvariable ELEVENLABS_API_KEY.
In der Claude-Sandbox ist die ElevenLabs-API blockiert → dort Piper nutzen.
"""

import os, sys, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))

# ── Piper: ein Modell je Sprache ──────────────────────────────────────────────
PIPER_MODELS = {
    "de": os.path.join(HERE, "voices", "de-thorsten-low.onnx"),
    "es": os.path.join(HERE, "voices", "es-carlfm-x-low.onnx"),
}

# ── edge-tts: eine Neural-Stimme je Sprache ───────────────────────────────────
EDGE_VOICES = {
    "de": "de-DE-KatjaNeural",
    "es": "es-ES-ElviraNeural",
}

# ── ElevenLabs: EINE multilinguale Stimme für beide Sprachen ──────────────────
# Default = "Sarah" (vielseitig, warm). Über ELEVENLABS_VOICE_ID überschreibbar.
ELEVEN_VOICE_ID = os.environ.get("ELEVENLABS_VOICE_ID", "EXAVITQu4vr4xnSDxMaL")
ELEVEN_MODEL    = "eleven_multilingual_v2"


def synth(text, lang, out_path, backend="piper"):
    """Erzeugt eine Audiodatei (out_path) mit gesprochenem `text` in `lang` (de|es)."""
    if backend == "elevenlabs":
        return _eleven(text, out_path)
    if backend == "edge":
        return _edge(text, lang, out_path)
    return _piper(text, lang, out_path)


def _piper(text, lang, out_path):
    model = PIPER_MODELS[lang]
    p = subprocess.run(
        [sys.executable, "-m", "piper", "--model", model,
         "--output_file", out_path, "--length_scale", "1.12",
         "--sentence_silence", "0.4"],
        input=text.encode("utf-8"),
        stdout=subprocess.DEVNULL, stderr=subprocess.PIPE,
    )
    if p.returncode != 0:
        raise RuntimeError(f"Piper-Fehler ({lang}): {p.stderr.decode()[:300]}")
    return out_path


def _edge(text, lang, out_path):
    voice = EDGE_VOICES[lang]
    subprocess.run(
        ["edge-tts", "--voice", voice, "--rate", "-6%",
         "--text", text, "--write-media", out_path],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE,
    )
    return out_path


def _eleven(text, out_path):
    """ElevenLabs multilingual — eine Stimme, Deutsch + Spanisch."""
    import requests
    key = os.environ.get("ELEVENLABS_API_KEY")
    if not key:
        raise RuntimeError("ELEVENLABS_API_KEY nicht gesetzt.")
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVEN_VOICE_ID}"
    r = requests.post(
        url,
        headers={"xi-api-key": key, "Content-Type": "application/json"},
        json={
            "text": text,
            "model_id": ELEVEN_MODEL,
            "voice_settings": {"stability": 0.45, "similarity_boost": 0.8,
                                "style": 0.0, "use_speaker_boost": True},
        },
        timeout=60,
    )
    r.raise_for_status()
    with open(out_path, "wb") as f:
        f.write(r.content)
    return out_path
