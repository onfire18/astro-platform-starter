#!/usr/bin/env bash
# Lädt Stimmen (Piper DE+IT) und die Schrift (Baloo 2). Einmalig nötig.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
mkdir -p "$HERE/voices" "$HERE/fonts"
dl(){ curl -sSL --retry 4 -o "$1" "$2"; }

REL="https://github.com/rhasspy/piper/releases/download/v0.0.2"
if [[ ! -f "$HERE/voices/de-thorsten-low.onnx" ]]; then
  echo "Lade deutsche Stimme …"; dl /tmp/de.tar.gz "$REL/voice-de-thorsten-low.tar.gz"
  tar xzf /tmp/de.tar.gz -C "$HERE/voices" && rm -f /tmp/de.tar.gz
fi
if [[ ! -f "$HERE/voices/it-riccardo_fasol-x-low.onnx" ]]; then
  echo "Lade italienische Stimme …"; dl /tmp/it.tar.gz "$REL/voice-it-riccardo_fasol-x-low.tar.gz"
  tar xzf /tmp/it.tar.gz -C "$HERE/voices" && rm -f /tmp/it.tar.gz
fi

GF="https://raw.githubusercontent.com/google/fonts/main/ofl"
[[ -f "$HERE/fonts/Baloo2.ttf" ]] || dl "$HERE/fonts/Baloo2.ttf" "$GF/baloo2/Baloo2%5Bwght%5D.ttf"
echo "Assets bereit."
