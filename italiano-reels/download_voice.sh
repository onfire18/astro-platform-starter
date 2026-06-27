#!/usr/bin/env bash
# Lädt die italienische Piper-Stimme (neuronales Offline-TTS) von GitHub.
# Wird einmalig benötigt – das Modell ist ~28 MB und wird NICHT eingecheckt.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VOICE_DIR="$HERE/voices"
mkdir -p "$VOICE_DIR"

URL="https://github.com/rhasspy/piper/releases/download/v0.0.2/voice-it-riccardo_fasol-x-low.tar.gz"

if [[ -f "$VOICE_DIR/it-riccardo_fasol-x-low.onnx" ]]; then
  echo "Stimme bereits vorhanden – überspringe Download."
  exit 0
fi

echo "Lade italienische Stimme …"
curl -sSL --retry 4 -o "$VOICE_DIR/voice.tar.gz" "$URL"
tar xzf "$VOICE_DIR/voice.tar.gz" -C "$VOICE_DIR"
rm -f "$VOICE_DIR/voice.tar.gz"
echo "Fertig: $VOICE_DIR/it-riccardo_fasol-x-low.onnx"
