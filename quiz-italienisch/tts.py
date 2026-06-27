"""
Bilinguale TTS (Deutsch + Italienisch) mit Tempo-Steuerung.

Backends:
  sherpa     : hochwertige neuronale Stimmen (Piper-VITS via sherpa-onnx, 22 kHz),
               offline, mit Geschwindigkeit (für langsames Wiederholen). STANDARD.
  elevenlabs : EINE multilinguale Stimme DE+IT (braucht ELEVENLABS_API_KEY)
  edge       : Microsoft Neural (braucht Netz)
  piper      : alte x-low Offline-Stimme (Fallback)

synth(text, lang, out_path, backend, speed) -> out_path
  speed < 1.0 = langsamer (nur sherpa/piper).
"""
import os, sys, subprocess, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))

# ── sherpa-onnx Stimmen (Ordner + Modellname) ─────────────────────────────────
SHERPA = {
    "it": ("voices/vits-piper-it_IT-paola-medium",     "it_IT-paola-medium"),
    "de": ("voices/vits-piper-de_DE-thorsten-medium",  "de_DE-thorsten-medium"),
}
EDGE_VOICES = {"de": "de-DE-KatjaNeural", "it": "it-IT-IsabellaNeural"}
PIPER_MODELS = {
    "de": os.path.join(HERE, "voices", "de-thorsten-low.onnx"),
    "it": os.path.join(HERE, "voices", "it-riccardo_fasol-x-low.onnx"),
}
ELEVEN_VOICE_ID = os.environ.get("ELEVENLABS_VOICE_ID", "EXAVITQu4vr4xnSDxMaL")
ELEVEN_MODEL    = "eleven_multilingual_v2"


def synth(text, lang, out_path, backend="sherpa", speed=1.0):
    if backend == "sherpa":     return _sherpa(text, lang, out_path, speed)
    if backend == "elevenlabs": return _eleven(text, out_path)
    if backend == "edge":       return _edge(text, lang, out_path)
    return _piper(text, lang, out_path, speed)


# ── sherpa-onnx (Standard) ────────────────────────────────────────────────────
_TTS = {}
def _sherpa(text, lang, out_path, speed):
    import sherpa_onnx
    if lang not in _TTS:
        rel, name = SHERPA[lang]; d = os.path.join(HERE, rel)
        cfg = sherpa_onnx.OfflineTtsConfig(
            model=sherpa_onnx.OfflineTtsModelConfig(
                vits=sherpa_onnx.OfflineTtsVitsModelConfig(
                    model=f"{d}/{name}.onnx", tokens=f"{d}/tokens.txt",
                    data_dir=f"{d}/espeak-ng-data"),
                num_threads=2),
            max_num_sentences=2)
        _TTS[lang] = sherpa_onnx.OfflineTts(cfg)
    a = _TTS[lang].generate(text, sid=0, speed=speed)
    samples = (np.array(a.samples, dtype=np.float32) * 32767).astype(np.int16)
    with wave.open(out_path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(a.sample_rate)
        w.writeframes(samples.tobytes())
    return out_path


def _piper(text, lang, out_path, speed):
    ls = str(round(1.1 / max(speed, 0.5), 2))
    p = subprocess.run(
        [sys.executable, "-m", "piper", "--model", PIPER_MODELS[lang],
         "--output_file", out_path, "--length_scale", ls, "--sentence_silence", "0.35"],
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
