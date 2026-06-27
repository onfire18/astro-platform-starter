#!/usr/bin/env python3
"""
"Wie sagt man?" — Deutsch → Spanisch Quiz-Reel
==============================================
Erzeugt ein ~60s-Hochformat-Video (9:16) im Notizblock-Look:
Pro Wort wird das deutsche Wort gezeigt + gesprochen, eine Rate-Pause folgt,
dann erscheint die spanische Lösung und wird gesprochen.

Stimme (bilingual DE+ES) über tts.py:
  --backend piper        offline, läuft überall (Standard)
  --backend edge         Microsoft Neural (braucht Netz)
  --backend elevenlabs   ElevenLabs multilingual, EINE Stimme DE+ES (braucht Key)

  python3 generate_quiz.py                      # nächster Tag, Piper
  python3 generate_quiz.py --day 0 --backend elevenlabs
"""

import os, sys, json, argparse, subprocess, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import tts

# ── Pfade ─────────────────────────────────────────────────────────────────────
HERE       = os.path.dirname(os.path.abspath(__file__))
CURRICULUM = os.path.join(HERE, "curriculum.json")
STATE      = os.path.join(HERE, "state.json")
OUT_DIR    = os.path.join(HERE, "output")
FONT_DIR   = os.path.join(HERE, "fonts")
EMOJI_FONT = "/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf"

# ── Video ─────────────────────────────────────────────────────────────────────
W, H = 1080, 1920
FPS  = 25
AR   = 44100

# ── Farben ────────────────────────────────────────────────────────────────────
INK    = (38, 46, 78)        # dunkles Tintenblau
RED    = (176, 38, 44)       # Spanisch-Rot
PAPER  = (245, 240, 222)
PAPER2 = (236, 230, 210)
LINE   = (170, 158, 130)
HILITE = (255, 226, 120)     # Zeilen-Highlight
GREEN  = (34, 130, 70)

# ── Schrift-Cache ─────────────────────────────────────────────────────────────
_F = {}
def hand(size):           # Patrick Hand — saubere Handschrift (Wörter)
    k = ("p", size)
    if k not in _F: _F[k] = ImageFont.truetype(os.path.join(FONT_DIR, "PatrickHand.ttf"), size)
    return _F[k]
def marker(size):         # Caveat — markerartig (Titel/Header)
    k = ("c", size)
    if k not in _F: _F[k] = ImageFont.truetype(os.path.join(FONT_DIR, "Caveat-Bold.ttf"), size)
    return _F[k]

# ── Emoji-Rendering (NotoColorEmoji, Bitmap @109) ─────────────────────────────
_EMO = {}
def emoji_img(ch, size=92):
    key = (ch, size)
    if key in _EMO: return _EMO[key]
    try:
        ef = ImageFont.truetype(EMOJI_FONT, 109)
        canvas = Image.new("RGBA", (140, 140), (0, 0, 0, 0))
        d = ImageDraw.Draw(canvas)
        d.text((6, 6), ch, font=ef, embedded_color=True)
        bbox = canvas.getbbox()
        if bbox:
            canvas = canvas.crop(bbox)
        out = canvas.resize((size, size), Image.LANCZOS)
    except Exception:
        out = None
    _EMO[key] = out
    return out


# ══════════════════════════════════════════════════════════════════════════════
#  Hintergrund: Holz + Notizblock
# ══════════════════════════════════════════════════════════════════════════════

def wood_bg():
    """Prozeduraler Holz-Hintergrund mit Maserung."""
    base = np.zeros((H, W, 3), dtype=np.float32)
    y = np.linspace(0, 1, H)[:, None]
    x = np.linspace(0, 1, W)[None, :]
    # Grundton Walnuss
    r = 120 + 22 * np.sin(y * 40 + np.sin(x * 3) * 2)
    g =  78 + 16 * np.sin(y * 40 + np.sin(x * 3) * 2)
    b =  42 + 11 * np.sin(y * 40 + np.sin(x * 3) * 2)
    # langsame Planken-Variation
    plank = (np.floor(x * 4) % 2) * 10
    base[..., 0] = r - plank
    base[..., 1] = g - plank * 0.7
    base[..., 2] = b - plank * 0.5
    img = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8))
    # feine Körnung
    noise = (np.random.RandomState(7).randn(H, W, 1) * 6).astype(np.float32)
    arr = np.clip(np.array(img, np.float32) + noise, 0, 255).astype(np.uint8)
    return Image.fromarray(arr).filter(ImageFilter.GaussianBlur(0.6))


# Notizblock-Geometrie
PAD_X   = 48
TOP     = 250
BOT     = 1760
COL_X   = 548                 # vertikale Trennlinie
ROW_TOP = 600
ROW_H   = 158
N_ROWS  = 7


def draw_spiral(d):
    """Spiralbindung am oberen Rand."""
    n = 11
    for i in range(n):
        cx = PAD_X + 50 + i * ((W - 2 * (PAD_X + 50)) / (n - 1))
        # Loch
        d.ellipse([cx - 16, TOP - 18, cx + 16, TOP + 14], fill=(60, 50, 40))
        # Metallring
        d.arc([cx - 22, TOP - 54, cx + 22, TOP + 6], start=200, end=340,
              fill=(225, 225, 230), width=10)
        d.arc([cx - 22, TOP - 54, cx + 22, TOP + 6], start=200, end=340,
              fill=(140, 140, 150), width=3)


def static_base():
    """Holz + Papier + Spirale + Titel + Header + Raster + deutsche Spalte + Emoji.
    Wird einmal gerendert und gecacht (ändert sich pro Frame nicht)."""
    img = wood_bg()
    d = ImageDraw.Draw(img, "RGBA")

    # Schlagschatten Papier
    d.rounded_rectangle([PAD_X + 8, TOP + 8, W - PAD_X + 8, BOT + 8],
                        radius=34, fill=(0, 0, 0, 90))
    # Papier
    d.rounded_rectangle([PAD_X, TOP, W - PAD_X, BOT], radius=34, fill=PAPER)
    # leichte Papier-Vignette unten
    d.rounded_rectangle([PAD_X, BOT - 120, W - PAD_X, BOT], radius=34, fill=PAPER2)

    draw_spiral(d)

    # Titel
    title = "Wie sagt man?"
    tf = marker(118)
    tw = d.textbbox((0, 0), title, font=tf)[2]
    tx = (W - tw) // 2
    d.text((tx, TOP + 70), title, font=tf, fill=INK)
    d.line([tx + 6, TOP + 205, tx + tw - 6, TOP + 205], fill=INK, width=6)

    # Header
    hf = marker(78)
    d.text((PAD_X + 110, TOP + 250), "Deutsch", font=hf, fill=INK)
    sw = d.textbbox((0, 0), "Spanisch", font=hf)[2]
    d.text((COL_X + (W - PAD_X - COL_X - sw) // 2 + 10, TOP + 250),
           "Spanisch", font=hf, fill=RED)

    # Raster: vertikale Trennlinie + horizontale Zeilenlinien
    d.line([COL_X, ROW_TOP - 30, COL_X, BOT - 40], fill=LINE, width=4)
    for i in range(N_ROWS + 1):
        y = ROW_TOP + i * ROW_H
        d.line([PAD_X + 30, y, W - PAD_X - 30, y], fill=LINE, width=3)

    return img


def render_frame(base, words, revealed, highlight):
    """Kopiert die statische Basis und zeichnet: Zeilen-Highlight, deutsche Wörter,
    Emoji und (bis `revealed`) die spanischen Lösungen. `highlight`=Zeilenindex(0-based) oder None."""
    img = base.copy()
    d = ImageDraw.Draw(img, "RGBA")

    # Highlight aktive Zeile
    if highlight is not None:
        y0 = ROW_TOP + highlight * ROW_H
        d.rounded_rectangle([PAD_X + 26, y0 + 6, W - PAD_X - 26, y0 + ROW_H - 6],
                            radius=14, fill=HILITE + (90,))

    wf = hand(72)
    for i, w in enumerate(words):
        y0 = ROW_TOP + i * ROW_H
        cy = y0 + ROW_H // 2
        # Emoji
        em = emoji_img(w["emoji"], 86)
        if em is not None:
            img.paste(em, (PAD_X + 36, cy - 43), em)
        # Deutsches Wort
        d.text((PAD_X + 150, cy - 44), w["de"], font=wf, fill=INK)
        # Spanische Lösung (falls aufgedeckt)
        if i < revealed:
            es = w["es"]
            ew = d.textbbox((0, 0), es, font=wf)[2]
            ex = COL_X + (W - PAD_X - COL_X - ew) // 2 + 6
            d.text((ex, cy - 44), es, font=wf, fill=RED)
    return img


# ══════════════════════════════════════════════════════════════════════════════
#  Audio
# ══════════════════════════════════════════════════════════════════════════════

def load_audio(path, ffmpeg):
    p = subprocess.run([ffmpeg, "-v", "quiet", "-i", path, "-ac", "1",
                        "-ar", str(AR), "-f", "f32le", "-"],
                       stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    return np.frombuffer(p.stdout, dtype=np.float32).copy()


# ══════════════════════════════════════════════════════════════════════════════
#  Pipeline
# ══════════════════════════════════════════════════════════════════════════════

def build_segments(words):
    """Liste von (revealed, highlight, speech_text, lang, min_dur)."""
    segs = []
    segs.append((0, None, "Wie sagt man das auf Spanisch? Rate mit!", "de", 3.5))
    for i, w in enumerate(words):
        segs.append((i,     i, f"{w['de']}?",                "de", 3.2))   # Frage + Rate-Pause
        segs.append((i + 1, i, f"{w['es']}, {w['es']}.",     "es", 3.8))   # Lösung 2×
    segs.append((len(words), None,
                 "Wie viele hattest du richtig? Folge für mehr Spanisch!", "de", 4.5))
    return segs


def generate(day_index, backend):
    import imageio, imageio_ffmpeg
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    os.makedirs(OUT_DIR, exist_ok=True)
    tmp = os.path.join(OUT_DIR, "_tmp"); os.makedirs(tmp, exist_ok=True)

    cur = json.load(open(CURRICULUM, encoding="utf-8"))
    days = cur["days"]
    day = days[day_index % len(days)]
    words = day["words"]
    day_num = day_index + 1
    print(f"▶ Tag {day_num}: {day['theme']}  (Stimme: {backend})")

    segs = build_segments(words)

    # 1) Audio je Segment
    print("  • Erzeuge bilinguale KI-Stimme …")
    ext = "mp3" if backend in ("edge", "elevenlabs") else "wav"
    seg_audio = []
    for k, (_, _, text, lang, _) in enumerate(segs):
        raw = os.path.join(tmp, f"s{k}.{ext}")
        tts.synth(text, lang, raw, backend)
        seg_audio.append(load_audio(raw, ffmpeg))

    # 2) Dauern (Audio + Puffer, mind. min_dur), Ziel ~60s
    PAD = 0.7
    durations = [max(md, len(a) / AR + PAD) for (_, _, _, _, md), a in zip(segs, seg_audio)]
    total = sum(durations)
    if total > 60:
        sc = 60 / total
        durations = [max(md * 0.85, d * sc) for (_, _, _, _, md), d in zip(segs, durations)]
    print(f"  • Dauer gesamt: {sum(durations):.1f}s  ({len(segs)} Segmente)")

    # 3) Master-Audio
    master = np.zeros(int(sum(durations) * AR) + AR, dtype=np.float32)
    cur_s = 0
    for d, a in zip(durations, seg_audio):
        n = int(d * AR)
        m = min(len(a), n)
        master[cur_s:cur_s + m] += a[:m] * 0.95
        cur_s += n
    master = master[:cur_s]
    fade = int(0.4 * AR); master[-fade:] *= np.linspace(1, 0, fade)
    wav = os.path.join(tmp, "master.wav")
    with wave.open(wav, "wb") as wf:
        wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(AR)
        wf.writeframes((np.clip(master, -1, 1) * 32767).astype(np.int16).tobytes())

    # 4) Frames (statische Basis einmal, dann pro Segment Zustand zeichnen)
    print("  • Rendere Notizblock-Frames …")
    base = static_base()
    FADE = 8
    seg_frames = []
    for (revealed, hl, _, _, _), d in zip(segs, durations):
        nf = max(int(d * FPS), FADE + 1)
        frame = render_frame(base, words, revealed, hl)   # statisch je Segment
        seg_frames.append([frame] * nf)

    # Zusammenfügen mit Crossfades (deckt das "Aufdecken" der Lösung sanft auf)
    frames = list(seg_frames[0])
    for idx in range(1, len(seg_frames)):
        prev, curf = seg_frames[idx - 1], seg_frames[idx]
        a = np.array(prev[-1], np.float32); b = np.array(curf[0], np.float32)
        for fi in range(FADE):
            t = (fi + 1) / (FADE + 1)
            frames.append(Image.fromarray((a * (1 - t) + b * t).astype(np.uint8)))
        frames.extend(curf[FADE:])

    silent = os.path.join(tmp, "silent.mp4")
    writer = imageio.get_writer(silent, fps=FPS, codec="libx264", quality=9,
                                macro_block_size=None,
                                ffmpeg_params=["-pix_fmt", "yuv420p", "-crf", "19",
                                               "-movflags", "+faststart"])
    for f in frames:
        writer.append_data(np.array(f))
    writer.close()

    # 5) Mux
    print("  • Mux Audio + Video …")
    safe = day["theme"].lower().replace(" ", "_").replace("&", "und").replace("__", "_")
    out = os.path.join(OUT_DIR, f"tag{day_num:02d}_{safe}.mp4")
    subprocess.run([ffmpeg, "-y", "-i", silent, "-i", wav, "-c:v", "copy",
                    "-c:a", "aac", "-b:a", "160k", "-shortest", out],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    mb = os.path.getsize(out) / 1024 / 1024
    print(f"✓ Fertig: {out}  ({mb:.1f} MB | {sum(durations):.1f}s)")
    return out, day_num, day["theme"]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--day", type=int, default=None)
    ap.add_argument("--backend", choices=["piper", "edge", "elevenlabs"], default="piper")
    ap.add_argument("--no-advance", action="store_true")
    args = ap.parse_args()

    state = json.load(open(STATE, encoding="utf-8"))
    di = args.day if args.day is not None else state["next_day_index"]
    out, day_num, theme = generate(di, args.backend)

    if args.day is None and not args.no_advance:
        state["next_day_index"] = di + 1
        state["generated"].append({"day": day_num, "theme": theme,
                                   "file": os.path.basename(out)})
        json.dump(state, open(STATE, "w", encoding="utf-8"),
                  ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
