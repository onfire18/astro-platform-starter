#!/usr/bin/env bash
# Lädt hochwertige Stimmen (sherpa-onnx Piper-VITS, DE+IT) und die Schrift (Baloo 2).
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
mkdir -p "$HERE/voices" "$HERE/fonts"
dl(){ curl -sSL --retry 4 -o "$1" "$2"; }

SB="https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models"
for v in kokoro-multi-lang-v1_0 vits-piper-de_DE-miro-high; do
  if [[ ! -d "$HERE/voices/$v" ]]; then
    echo "Lade Kokoro-Stimme $v (~370 MB) …"
    dl "/tmp/$v.tar.bz2" "$SB/$v.tar.bz2"
    tar xjf "/tmp/$v.tar.bz2" -C "$HERE/voices" && rm -f "/tmp/$v.tar.bz2"
  fi
done

GF="https://raw.githubusercontent.com/google/fonts/main/ofl"
[[ -f "$HERE/fonts/Baloo2.ttf" ]] || dl "$HERE/fonts/Baloo2.ttf" "$GF/baloo2/Baloo2%5Bwght%5D.ttf"
echo "Assets bereit."
