"""
Bilinguale TTS (Deutsch + Italienisch) — drei Backends, eine Funktion.
  elevenlabs : EINE multilinguale Stimme spricht DE + IT  (braucht ELEVENLABS_API_KEY)
  edge       : Microsoft Neural, Stimme je Sprache         (braucht Netz)
  piper      : offline, Modell je Sprache                  (läuft überall)
"""
import os, sys, subprocess
HERE = os.path.dirname(os.path.abspath(__file__))

PIPER_MODELS = {
    "de": os.path.join(HERE, "voices", "de-thorsten-low.onnx"),
    "it": os.path.join(HERE, "voices", "it-riccardo_fasol-x-low.onnx"),
}
EDGE_VOICES = {"de": "de-DE-KatjaNeural", "it": "it-IT-IsabellaNeural"}

ELEVEN_VOICE_ID = os.environ.get("ELEVENLABS_VOICE_ID", "EXAVITQu4vr4xnSDxMaL")
ELEVEN_MODEL    = "eleven_multilingual_v2"


def synth(text, lang, out_path, backend="piper"):
    if backend == "elevenlabs": return _eleven(text, out_path)
    if backend == "edge":       return _edge(text, lang, out_path)
    return _piper(text, lang, out_path)


def _piper(text, lang, out_path):
    p = subprocess.run(
        [sys.executable, "-m", "piper", "--model", PIPER_MODELS[lang],
         "--output_file", out_path, "--length_scale", "1.1",
         "--sentence_silence", "0.35"],
        input=text.encode("utf-8"), stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    if p.returncode != 0:
        raise RuntimeError(f"Piper ({lang}): {p.stderr.decode()[:200]}")
    return out_path


def _edge(text, lang, out_path):
    subprocess.run(["edge-tts", "--voice", EDGE_VOICES[lang], "--rate", "-6%",
                    "--text", text, "--write-media", out_path],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    return out_path


def _eleven(text, out_path):
    import requests
    key = os.environ.get("ELEVENLABS_API_KEY")
    if not key:
        raise RuntimeError("ELEVENLABS_API_KEY nicht gesetzt.")
    r = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVEN_VOICE_ID}",
        headers={"xi-api-key": key, "Content-Type": "application/json"},
        json={"text": text, "model_id": ELEVEN_MODEL,
              "voice_settings": {"stability": 0.45, "similarity_boost": 0.8,
                                 "style": 0.0, "use_speaker_boost": True}},
        timeout=60)
    r.raise_for_status()
    open(out_path, "wb").write(r.content)
    return out_path
