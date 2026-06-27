#!/usr/bin/env bash
# Lädt Stimmen (Piper DE+ES) und Handschrift-Fonts. Einmalig nötig.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
mkdir -p "$HERE/voices" "$HERE/fonts"

dl() { curl -sSL --retry 4 -o "$1" "$2"; }

# ── Piper-Stimmen ─────────────────────────────────────────────────────────────
REL="https://github.com/rhasspy/piper/releases/download/v0.0.2"
if [[ ! -f "$HERE/voices/de-thorsten-low.onnx" ]]; then
  echo "Lade deutsche Stimme …"
  dl /tmp/de.tar.gz "$REL/voice-de-thorsten-low.tar.gz"
  tar xzf /tmp/de.tar.gz -C "$HERE/voices" && rm -f /tmp/de.tar.gz
fi
if [[ ! -f "$HERE/voices/es-carlfm-x-low.onnx" ]]; then
  echo "Lade spanische Stimme …"
  dl /tmp/es.tar.gz "$REL/voice-es-carlfm-x-low.tar.gz"
  tar xzf /tmp/es.tar.gz -C "$HERE/voices" && rm -f /tmp/es.tar.gz
fi

# ── Handschrift-Fonts (Google Fonts, OFL) ─────────────────────────────────────
GF="https://raw.githubusercontent.com/google/fonts/main/ofl"
[[ -f "$HERE/fonts/PatrickHand.ttf" ]] || dl "$HERE/fonts/PatrickHand.ttf" "$GF/patrickhand/PatrickHand-Regular.ttf"
[[ -f "$HERE/fonts/Caveat-Bold.ttf" ]] || dl "$HERE/fonts/Caveat-Bold.ttf" "$GF/caveat/Caveat%5Bwght%5D.ttf"

echo "Assets bereit."
