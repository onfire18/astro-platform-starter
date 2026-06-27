#!/usr/bin/env python3
"""
Italiano-Reels — täglicher Vokabel-Video-Generator
===================================================
Erzeugt ein ~60-Sekunden-Video (9:16, 1080x1920) mit 7 italienischen Wörtern
für Italienisch-Lernende, inklusive moderner KI-Stimme (neuronale TTS).

  • Stimme:   Piper (offline, neuronales TTS) ODER edge-tts (Microsoft, online)
  • Bild:     Pillow-gerenderte Karten + Ken-Burns-Animation
  • Schnitt:  ffmpeg (gebündelt via imageio-ffmpeg)
  • Quelle:   curriculum.json (Wortbank), state.json (welcher Tag ist dran)

Aufruf:
  python3 generate_lesson.py                 # nächster Tag laut state.json
  python3 generate_lesson.py --day 2         # bestimmter Tag (0-basiert)
  python3 generate_lesson.py --voice edge    # statt Piper die edge-tts Stimme
  python3 generate_lesson.py --voice edge --edge-voice it-IT-DiegoNeural
"""

import os, sys, json, argparse, subprocess, wave, struct, math
import numpy as np
from PIL import Image, ImageDraw, ImageFont

# ── Pfade ─────────────────────────────────────────────────────────────────────
HERE       = os.path.dirname(os.path.abspath(__file__))
CURRICULUM = os.path.join(HERE, "curriculum.json")
STATE      = os.path.join(HERE, "state.json")
OUT_DIR    = os.path.join(HERE, "output")
VOICE_DIR  = os.path.join(HERE, "voices")
PIPER_MODEL = os.path.join(VOICE_DIR, "it-riccardo_fasol-x-low.onnx")

FONT_BOLD = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
FONT_REG  = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"

# ── Video-Konstanten ──────────────────────────────────────────────────────────
W, H   = 1080, 1920
FPS    = 25
AR     = 44100               # Master-Audio-Samplerate

# ── Markenfarben ──────────────────────────────────────────────────────────────
BG_TOP    = (28, 37, 87)     # tiefes Indigo
BG_BOT    = (12, 16, 44)
GREEN     = ( 0, 140, 69)    # Italien-Grün
RED       = (206, 43, 55)    # Italien-Rot
WHITE     = (255, 255, 255)
CREAM     = (245, 240, 225)
GOLD      = (255, 200, 60)
MALE      = (90, 170, 255)   # maskulin -> blau (il)
FEMALE    = (255, 120, 170)  # feminin  -> rosa (la)
NEUTRAL   = (200, 200, 210)


# ══════════════════════════════════════════════════════════════════════════════
#  TTS
# ══════════════════════════════════════════════════════════════════════════════

def tts_piper(text, out_wav):
    """Offline neuronale Stimme (Piper). Erzeugt WAV (16 kHz mono)."""
    p = subprocess.run(
        [sys.executable, "-m", "piper", "--model", PIPER_MODEL,
         "--output_file", out_wav, "--length_scale", "1.18",
         "--sentence_silence", "0.45"],
        input=text.encode("utf-8"),
        stdout=subprocess.DEVNULL, stderr=subprocess.PIPE,
    )
    if p.returncode != 0:
        raise RuntimeError(f"Piper-Fehler: {p.stderr.decode()[:300]}")
    return out_wav


def tts_edge(text, out_mp3, voice="it-IT-IsabellaNeural"):
    """Online Microsoft-Stimme (edge-tts). Bessere Qualität, braucht Netz."""
    subprocess.run(
        ["edge-tts", "--voice", voice, "--text", text,
         "--rate", "-8%", "--write-media", out_mp3],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE,
    )
    return out_mp3


def load_audio_mono(path, ffmpeg):
    """Liest beliebiges Audio über ffmpeg als float32-Array @ AR (mono)."""
    p = subprocess.run(
        [ffmpeg, "-v", "quiet", "-i", path, "-ac", "1", "-ar", str(AR),
         "-f", "f32le", "-"],
        stdout=subprocess.PIPE, stderr=subprocess.DEVNULL,
    )
    return np.frombuffer(p.stdout, dtype=np.float32).copy()


# ══════════════════════════════════════════════════════════════════════════════
#  Schrift-Cache + Text-Helfer
# ══════════════════════════════════════════════════════════════════════════════

_FONTS = {}
def fnt(size, bold=True):
    key = (size, bold)
    if key not in _FONTS:
        _FONTS[key] = ImageFont.truetype(FONT_BOLD if bold else FONT_REG, size)
    return _FONTS[key]


def measure(draw, text, font):
    bb = draw.textbbox((0, 0), text, font=font)
    return bb[2] - bb[0], bb[3] - bb[1]


def text_center(draw, y, text, font, fill, shadow=4, tracking=0):
    w, h = measure(draw, text, font)
    x = (W - w) // 2
    if shadow > 0:
        for dx, dy in [(-shadow, shadow), (shadow, shadow), (0, shadow + 1)]:
            draw.text((x + dx, y + dy), text, font=font, fill=(0, 0, 0))
    draw.text((x, y), text, font=font, fill=fill)
    return h


def wrap(draw, text, font, max_w):
    words, lines, cur = text.split(), [], []
    for wd in words:
        if measure(draw, " ".join(cur + [wd]), font)[0] <= max_w:
            cur.append(wd)
        else:
            if cur: lines.append(" ".join(cur))
            cur = [wd]
    if cur: lines.append(" ".join(cur))
    return lines


# ══════════════════════════════════════════════════════════════════════════════
#  Hintergrund
# ══════════════════════════════════════════════════════════════════════════════

def gradient_bg():
    base = Image.new("RGB", (W, H))
    px = base.load()
    for y in range(H):
        t = y / H
        r = int(BG_TOP[0] + (BG_BOT[0] - BG_TOP[0]) * t)
        g = int(BG_TOP[1] + (BG_BOT[1] - BG_TOP[1]) * t)
        b = int(BG_TOP[2] + (BG_BOT[2] - BG_TOP[2]) * t)
        for x in range(W):
            px[x, y] = (r, g, b)
    return base

_BG_CACHE = None
def bg():
    global _BG_CACHE
    if _BG_CACHE is None:
        _BG_CACHE = gradient_bg()
    return _BG_CACHE.copy()


def flag_bar(img, y, h=14):
    """Italienische Flagge als dünner Balken."""
    d = ImageDraw.Draw(img)
    third = W // 3
    d.rectangle([0, y, third, y + h], fill=GREEN)
    d.rectangle([third, y, 2 * third, y + h], fill=WHITE)
    d.rectangle([2 * third, y, W, y + h], fill=RED)


def ease(t):
    return t * t * (3 - 2 * t)


def ken_burns(card, i, n, z0=1.0, z1=1.05):
    """Sanfter Zoom auf eine vorgerenderte Karte (W×H)."""
    t = ease(i / max(n - 1, 1))
    z = z0 + (z1 - z0) * t
    cw, ch = int(W / z), int(H / z)
    x0, y0 = (W - cw) // 2, (H - ch) // 2
    return card.crop((x0, y0, x0 + cw, y0 + ch)).resize((W, H), Image.LANCZOS)


# ══════════════════════════════════════════════════════════════════════════════
#  Karten-Renderer
# ══════════════════════════════════════════════════════════════════════════════

def gender_color(g):
    return {"m": MALE, "f": FEMALE}.get(g, NEUTRAL)

def gender_label(g):
    return {"m": "maschile (il)", "f": "femminile (la)"}.get(g, "")


def card_intro(theme, day_num):
    img = bg(); d = ImageDraw.Draw(img)
    flag_bar(img, 250)
    text_center(d, 360, "IMPARA L'ITALIANO", fnt(66), WHITE)
    text_center(d, 470, "7 parole al giorno", fnt(50, bold=False), GOLD)
    # Theme box
    lines = wrap(d, theme, fnt(58), W - 160)
    y = 820
    for ln in lines:
        y += text_center(d, y, ln, fnt(58), WHITE) + 14
    text_center(d, y + 40, f"Giorno {day_num}", fnt(44, bold=False), CREAM)
    flag_bar(img, H - 264)
    text_center(d, H - 230, "Pronti? Via!", fnt(48), GOLD)
    return img


def card_word(idx, total, w):
    img = bg(); d = ImageDraw.Draw(img)
    gcol = gender_color(w["gender"])

    # Zähler oben
    text_center(d, 150, f"{idx}/{total}", fnt(44, bold=False), CREAM)
    flag_bar(img, 230)

    # Großes italienisches Wort (Genus-farbig)
    it_lines = wrap(d, w["it"], fnt(112), W - 120)
    y = 430
    for ln in it_lines:
        y += text_center(d, y, ln, fnt(112), gcol) + 6

    # Genus-Hinweis
    gl = gender_label(w["gender"])
    if gl:
        y += text_center(d, y + 10, gl, fnt(38, bold=False), gcol) + 10

    # Trennlinie
    y += 40
    d.rectangle([W // 4, y, 3 * W // 4, y + 4], fill=(255, 255, 255, 160))
    y += 40

    # Deutsche Übersetzung
    de_lines = wrap(d, w["de"], fnt(72), W - 120)
    for ln in de_lines:
        y += text_center(d, y, ln, fnt(72), WHITE) + 8

    # Beispielsatz-Box unten — helle Karte mit dunklem Text (gut lesbar)
    DARK_TXT = (24, 32, 74)
    box_y = H - 560
    d.rounded_rectangle([60, box_y, W - 60, H - 200], radius=36,
                        fill=(248, 245, 238))
    # dünner Akzentstreifen oben in Genus-Farbe
    d.rounded_rectangle([60, box_y, W - 60, box_y + 12], radius=6, fill=gcol)
    yy = box_y + 48
    text_center(d, yy, "ESEMPIO", fnt(34), GREEN, shadow=0); yy += 64
    for ln in wrap(d, w["ex_it"], fnt(48), W - 200):
        yy += text_center(d, yy, ln, fnt(48), DARK_TXT, shadow=0) + 10
    yy += 16
    for ln in wrap(d, w["ex_de"], fnt(40, bold=False), W - 200):
        yy += text_center(d, yy, ln, fnt(40, bold=False), (90, 96, 120), shadow=0) + 6
    return img


def card_outro():
    img = bg(); d = ImageDraw.Draw(img)
    flag_bar(img, 360)
    text_center(d, 520, "Bravo!", fnt(96), GOLD)
    y = 760
    for ln in ["Hai imparato", "7 parole nuove!"]:
        y += text_center(d, y, ln, fnt(60), WHITE) + 12
    y += 60
    for ln in ["Segui per imparare", "l'italiano ogni giorno"]:
        y += text_center(d, y, ln, fnt(50, bold=False), CREAM) + 10
    # CTA-Pille
    cta = "SEGUI  +  CONDIVIDI"
    cw, ch = measure(d, cta, fnt(52))
    px, py = 70, 28
    bx0 = (W - cw) // 2 - px
    by0 = H - 380
    d.rounded_rectangle([bx0, by0, W - bx0, by0 + ch + 2 * py], radius=48, fill=RED)
    text_center(d, by0 + py, cta, fnt(52), WHITE, shadow=0)
    flag_bar(img, H - 240)
    return img


# ══════════════════════════════════════════════════════════════════════════════
#  Segment = (Karte, Audiotext, Mindestdauer)
# ══════════════════════════════════════════════════════════════════════════════

def build_segments(day):
    segs = []
    theme = day["theme"]
    words = day["words"]
    total = len(words)

    segs.append({
        "card": card_intro(theme, None),     # day_num gefüllt vom caller
        "speech": f"Impara l'italiano. {theme.split('—')[0].strip()}. Pronti? Via!",
        "min_dur": 4.5, "z": (1.0, 1.06),
    })
    for i, w in enumerate(words, 1):
        # Stimme: Wort zweimal + Beispielsatz
        speech = f"{w['it']}. ... {w['it']}. ... {w['ex_it']}"
        segs.append({
            "card": card_word(i, total, w),
            "speech": speech,
            "min_dur": 6.8, "z": (1.0, 1.05),
        })
    segs.append({
        "card": card_outro(),
        "speech": "Bravo! Hai imparato sette parole nuove. A domani!",
        "min_dur": 5.0, "z": (1.0, 1.06),
    })
    return segs


# ══════════════════════════════════════════════════════════════════════════════
#  Hauptpipeline
# ══════════════════════════════════════════════════════════════════════════════

def generate(day_index, voice_mode, edge_voice):
    import imageio, imageio_ffmpeg
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    os.makedirs(OUT_DIR, exist_ok=True)
    tmp = os.path.join(OUT_DIR, "_tmp"); os.makedirs(tmp, exist_ok=True)

    cur = json.load(open(CURRICULUM, encoding="utf-8"))
    days = cur["days"]
    day = days[day_index % len(days)]
    day_num = day_index + 1
    print(f"▶ Tag {day_num}: {day['theme']}")

    segs = build_segments(day)
    segs[0]["card"] = card_intro(day["theme"], day_num)   # day_num einsetzen

    # ── 1) Audio je Segment erzeugen + Dauer messen ───────────────────────────
    print("  • Erzeuge KI-Stimme …")
    seg_audio = []
    for k, s in enumerate(segs):
        raw = os.path.join(tmp, f"seg{k}.wav" if voice_mode == "piper"
                                else f"seg{k}.mp3")
        if voice_mode == "edge":
            tts_edge(s["speech"], raw, edge_voice)
        else:
            tts_piper(s["speech"], raw)
        a = load_audio_mono(raw, ffmpeg)
        seg_audio.append(a)

    # ── 2) Segment-Dauern festlegen (Audio + Puffer, mind. min_dur) ───────────
    PAD = 0.9                       # Atempuffer nach der Stimme
    durations = []
    for s, a in zip(segs, seg_audio):
        d = max(s["min_dur"], len(a) / AR + PAD)
        durations.append(d)

    # Auf ~60 s skalieren, falls nötig (TikTok/Reels/Shorts-Ziel)
    total = sum(durations)
    TARGET = 60.0
    if total > TARGET:
        sc = TARGET / total
        durations = [max(s["min_dur"] * 0.8, d * sc) for s, d in zip(segs, durations)]
    print(f"  • Segmentdauern: {[round(x,1) for x in durations]}  → {sum(durations):.1f}s")

    # ── 3) Master-Audiospur bauen (Stimme an Segmentstart, Rest Stille) ───────
    n_total = int(sum(durations) * AR)
    master = np.zeros(n_total, dtype=np.float32)
    cursor = 0
    for d, a in zip(durations, seg_audio):
        seg_n = int(d * AR)
        copy_n = min(len(a), seg_n)
        master[cursor:cursor + copy_n] += a[:copy_n] * 0.92
        cursor += seg_n
    # leichtes Fade-out am Ende
    fade = int(0.4 * AR)
    master[-fade:] *= np.linspace(1, 0, fade)
    wav_path = os.path.join(tmp, "master.wav")
    with wave.open(wav_path, "wb") as wf:
        wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(AR)
        wf.writeframes((np.clip(master, -1, 1) * 32767).astype(np.int16).tobytes())

    # ── 4) Video-Frames rendern (mit Ken-Burns + Crossfades) ──────────────────
    print("  • Rendere Video-Frames …")
    FADE = 10
    frames = []
    seg_frames = []
    for s, d in zip(segs, durations):
        nf = max(int(d * FPS), FADE + 1)
        seg_frames.append([ken_burns(s["card"], i, nf, *s["z"]) for i in range(nf)])

    frames = list(seg_frames[0])
    for idx in range(1, len(seg_frames)):
        prev, cur_f = seg_frames[idx - 1], seg_frames[idx]
        for fi in range(FADE):
            t = (fi + 1) / (FADE + 1)
            a = np.array(prev[-1], np.float32)
            b = np.array(cur_f[0], np.float32)
            frames.append(Image.fromarray((a * (1 - t) + b * t).astype(np.uint8)))
        frames.extend(cur_f[FADE:])

    silent = os.path.join(tmp, "silent.mp4")
    writer = imageio.get_writer(
        silent, fps=FPS, codec="libx264", quality=9, macro_block_size=None,
        ffmpeg_params=["-pix_fmt", "yuv420p", "-crf", "19", "-movflags", "+faststart"],
    )
    for f in frames:
        writer.append_data(np.array(f))
    writer.close()

    # ── 5) Audio + Video muxen ────────────────────────────────────────────────
    print("  • Mux Audio + Video …")
    safe_theme = day["theme"].split("—")[0].strip().lower().replace(" ", "_").replace("'", "")
    out = os.path.join(OUT_DIR, f"giorno{day_num:02d}_{safe_theme}.mp4")
    subprocess.run(
        [ffmpeg, "-y", "-i", silent, "-i", wav_path,
         "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-shortest", out],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )

    dur = sum(durations)
    mb = os.path.getsize(out) / 1024 / 1024
    print(f"✓ Fertig: {out}  ({mb:.1f} MB | {dur:.1f}s | Stimme: {voice_mode})")
    return out, day_num, day["theme"], dur


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--day", type=int, default=None, help="Tag-Index (0-basiert)")
    ap.add_argument("--voice", choices=["piper", "edge"], default="piper")
    ap.add_argument("--edge-voice", default="it-IT-IsabellaNeural")
    ap.add_argument("--no-advance", action="store_true",
                    help="state.json NICHT weiterzählen")
    args = ap.parse_args()

    state = json.load(open(STATE, encoding="utf-8"))
    day_index = args.day if args.day is not None else state["next_day_index"]

    out, day_num, theme, dur = generate(day_index, args.voice, args.edge_voice)

    if args.day is None and not args.no_advance:
        state["next_day_index"] = day_index + 1
        state["generated"].append({"day": day_num, "theme": theme,
                                    "file": os.path.basename(out)})
        json.dump(state, open(STATE, "w", encoding="utf-8"),
                  ensure_ascii=False, indent=2)
    print(f"\nNÄCHSTER TAG: Index {state['next_day_index']}")


if __name__ == "__main__":
    main()
