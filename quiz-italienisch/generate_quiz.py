#!/usr/bin/env python3
"""
"Wie sagt man?" — Deutsch → Italienisch  (Lehrer-Edition)
=========================================================
~60-70s Hochformat-Quiz im Notizblock-Look mit:
  • gut lesbarer Schrift (Baloo 2 ExtraBold)
  • Bleistift-Zeiger, der zur aktuellen Zeile wandert ("wo bin ich gerade")
  • Lehrer-Stimme: Frage → Rate-Pause → Lösung → "Sag's mit mir" (Wiederholung)
  • kurze Wiederholung in der Mitte
  • erstes Wort = lustiger Hook

  python3 generate_quiz.py                 # nächster Tag, Piper (offline)
  python3 generate_quiz.py --backend elevenlabs   # eine Stimme DE+IT (Key nötig)
"""
import os, sys, json, math, argparse, subprocess, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import tts

HERE       = os.path.dirname(os.path.abspath(__file__))
CURRICULUM = os.path.join(HERE, "curriculum.json")
STATE      = os.path.join(HERE, "state.json")
OUT_DIR    = os.path.join(HERE, "output")
FONT       = os.path.join(HERE, "fonts", "Baloo2.ttf")
EMOJI_FONT = "/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf"

W, H = 1080, 1920
FPS  = 25
AR   = 44100

INK=(38,46,78); RED=(176,38,44); PAPER=(245,240,222); PAPER2=(236,230,210)
LINE=(170,158,130); GREEN=(34,130,70); GOLD=(225,150,30)

# ── Schrift (Baloo 2, gewichtsvariabel) ───────────────────────────────────────
_F = {}
def font(size, weight="ExtraBold"):
    k = (size, weight)
    if k not in _F:
        f = ImageFont.truetype(FONT, size)
        try: f.set_variation_by_name(weight)
        except Exception: pass
        _F[k] = f
    return _F[k]

# ── Emoji ─────────────────────────────────────────────────────────────────────
_EMO = {}
def emoji_img(ch, size=84):
    key=(ch,size)
    if key in _EMO: return _EMO[key]
    try:
        ef=ImageFont.truetype(EMOJI_FONT,109)
        c=Image.new("RGBA",(140,140),(0,0,0,0)); ImageDraw.Draw(c).text((6,6),ch,font=ef,embedded_color=True)
        bb=c.getbbox()
        out=(c.crop(bb) if bb else c).resize((size,size),Image.LANCZOS)
    except Exception:
        out=None
    _EMO[key]=out; return out

# ── Bleistift-Sprite ──────────────────────────────────────────────────────────
def make_pencil(length=430, width=70):
    pad=30; Wp=width+2*pad; Hp=length+2*pad
    img=Image.new("RGBA",(Wp,Hp),(0,0,0,0)); d=ImageDraw.Draw(img)
    cx=Wp//2; x0,x1=pad,pad+width; top=pad
    YEL=(245,190,40); YEL_D=(210,150,20); PINK=(236,96,110); METAL=(200,200,205)
    METAL_D=(150,150,160); WOOD=(236,205,150); GRAPH=(40,40,44); OUT=(30,28,26)
    er=int(length*0.10); fer=int(length*0.06); body=int(length*0.66); cone=int(length*0.13)
    tip_h=length-er-fer-body-cone
    y=top
    d.rounded_rectangle([x0,y,x1,y+er+18],radius=width//2,fill=PINK,outline=OUT,width=4)
    d.rectangle([x0,y+er-4,x1,y+er+10],fill=PINK); y+=er
    d.rectangle([x0,y,x1,y+fer],fill=METAL,outline=OUT,width=4)
    for k in range(1,4): d.line([x0,y+int(fer*k/4),x1,y+int(fer*k/4)],fill=METAL_D,width=3)
    y+=fer
    d.rectangle([x0,y,x1,y+body],fill=YEL,outline=OUT,width=4)
    d.line([x0+width//3,y,x0+width//3,y+body],fill=YEL_D,width=3)
    d.line([x0+2*width//3,y,x0+2*width//3,y+body],fill=YEL_D,width=3); y+=body
    d.polygon([(x0,y),(x1,y),(cx,y+cone)],fill=WOOD,outline=OUT); y+=cone
    d.polygon([(cx-width*0.16,y),(cx+width*0.16,y),(cx,y+tip_h)],fill=GRAPH,outline=OUT)
    return img,(cx,y+tip_h)

def rotate_tip(pencil,tip,angle):
    rot=pencil.rotate(angle,expand=True,resample=Image.BICUBIC)
    w,h=pencil.size; rw,rh=rot.size; a=math.radians(-angle)
    tx,ty=tip[0]-w/2,tip[1]-h/2
    nx=tx*math.cos(a)-ty*math.sin(a); ny=tx*math.sin(a)+ty*math.cos(a)
    return rot,(rw/2+nx,rh/2+ny)

# ── Notizblock-Geometrie ──────────────────────────────────────────────────────
PAD_X=48; TOP=250; BOT=1770; COL_X=560; ROW_TOP=640; ROW_H=150; N_ROWS=7

def ease(t): return t*t*(3-2*t)

def wood_bg():
    base=np.zeros((H,W,3),np.float32)
    y=np.linspace(0,1,H)[:,None]; x=np.linspace(0,1,W)[None,:]
    s=np.sin(y*40+np.sin(x*3)*2)
    base[...,0]=120+22*s-(np.floor(x*4)%2)*10
    base[...,1]=78+16*s-(np.floor(x*4)%2)*7
    base[...,2]=42+11*s-(np.floor(x*4)%2)*5
    img=Image.fromarray(np.clip(base,0,255).astype(np.uint8))
    n=(np.random.RandomState(7).randn(H,W,1)*6).astype(np.float32)
    return Image.fromarray(np.clip(np.array(img,np.float32)+n,0,255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))

def draw_spiral(d):
    n=11
    for i in range(n):
        cx=PAD_X+50+i*((W-2*(PAD_X+50))/(n-1))
        d.ellipse([cx-16,TOP-18,cx+16,TOP+14],fill=(60,50,40))
        d.arc([cx-22,TOP-54,cx+22,TOP+6],200,340,fill=(225,225,230),width=10)
        d.arc([cx-22,TOP-54,cx+22,TOP+6],200,340,fill=(140,140,150),width=3)

def page_skeleton(theme):
    """Holz + Papier + Spirale + Titel + Header + Raster (ohne Wörter)."""
    img=wood_bg(); d=ImageDraw.Draw(img,"RGBA")
    d.rounded_rectangle([PAD_X+8,TOP+8,W-PAD_X+8,BOT+8],radius=34,fill=(0,0,0,90))
    d.rounded_rectangle([PAD_X,TOP,W-PAD_X,BOT],radius=34,fill=PAPER)
    d.rounded_rectangle([PAD_X,BOT-120,W-PAD_X,BOT],radius=34,fill=PAPER2)
    draw_spiral(d)
    tf=font(104)
    tw=d.textbbox((0,0),"Wie sagt man?",font=tf)[2]; tx=(W-tw)//2
    d.text((tx,TOP+60),"Wie sagt man?",font=tf,fill=INK)
    d.line([tx+6,TOP+200,tx+tw-6,TOP+200],fill=INK,width=6)
    hf=font(60,"Bold")
    d.text((PAD_X+120,TOP+240),"Deutsch",font=hf,fill=INK)
    sw=d.textbbox((0,0),"Italienisch",font=hf)[2]
    d.text((COL_X+(W-PAD_X-COL_X-sw)//2+10,TOP+240),"Italienisch",font=hf,fill=RED)
    d.line([COL_X,ROW_TOP-30,COL_X,BOT-40],fill=LINE,width=4)
    for i in range(N_ROWS+1):
        d.line([PAD_X+30,ROW_TOP+i*ROW_H,W-PAD_X-30,ROW_TOP+i*ROW_H],fill=LINE,width=3)
    return img

def page_with_reveal(skeleton, words, revealed):
    """Skelett + deutsche Wörter + Emoji + (bis `revealed`) italienische Lösungen."""
    img=skeleton.copy(); d=ImageDraw.Draw(img,"RGBA")
    wf=font(62); hookf=font(62)
    for i,w in enumerate(words):
        cy=ROW_TOP+i*ROW_H+ROW_H//2
        em=emoji_img(w["emoji"],76)
        if em is not None: img.paste(em,(PAD_X+36,cy-38),em)
        col=GOLD if w.get("hook") else INK
        d.text((PAD_X+150,cy-40),w["de"],font=wf,fill=col)
        if i<revealed:
            es=w["it"]; ew=d.textbbox((0,0),es,font=wf)[2]
            d.text((COL_X+(W-PAD_X-COL_X-ew)//2+6,cy-40),es,font=wf,fill=RED)
    return img

def load_audio(path,ffmpeg):
    p=subprocess.run([ffmpeg,"-v","quiet","-i",path,"-ac","1","-ar",str(AR),"-f","f32le","-"],
                     stdout=subprocess.PIPE,stderr=subprocess.DEVNULL)
    return np.frombuffer(p.stdout,dtype=np.float32).copy()

# ── Lehrer-Skript ─────────────────────────────────────────────────────────────
def build_segments(theme, words):
    """Segmente: dict(revealed, row(int|None), text, lang, min_dur, speed).
    Kein Intro – direkt los. Pro Wort: kurze Frage → vorlesen → langsam wiederholen.
    Ein Spruch in der Mitte, einer am Ende. Kurze, simple Sätze."""
    S=[]
    def add(rev,row,text,lang,md,speed=1.0):
        S.append(dict(revealed=rev,row=row,text=text,lang=lang,md=md,speed=speed))
    n=len(words); mid=n//2
    for i,w in enumerate(words):
        add(i,   i, f"Wie sagt man {w['de']}?", "de", 3.0)      # kurze Frage + Rate-Pause
        add(i+1, i, w["it"], "it", 1.6)                          # vorlesen
        add(i+1, i, w["it"], "it", 2.6, speed=0.7)               # langsam wiederholen
        if i==mid-1:                                             # Spruch in der Mitte
            add(i+1, None, "Italienisch lernen. Jeden Tag eine Minute. In neunzig Tagen sprichst du fließend.", "de", 4.8)
    add(n, None, "Folge mir, wenn du Italienisch lernen willst. Es ist nicht schwer. Du musst mir nur folgen.", "de", 5.0)
    return S

# ── Pipeline ──────────────────────────────────────────────────────────────────
def generate(day_index, backend):
    import imageio, imageio_ffmpeg
    ffmpeg=imageio_ffmpeg.get_ffmpeg_exe()
    os.makedirs(OUT_DIR,exist_ok=True); tmp=os.path.join(OUT_DIR,"_tmp"); os.makedirs(tmp,exist_ok=True)
    cur=json.load(open(CURRICULUM,encoding="utf-8")); day=cur["days"][day_index%len(cur["days"])]
    words=day["words"]; theme=day["theme"]; day_num=day_index+1
    print(f"▶ Tag {day_num}: {theme}  (Stimme: {backend})")

    segs=build_segments(theme,words)

    # 1) Audio
    print(f"  • Erzeuge Lehrer-Stimme … ({len(segs)} Segmente)")
    ext="mp3" if backend in ("edge","elevenlabs") else "wav"
    seg_audio=[]
    for k,s in enumerate(segs):
        raw=os.path.join(tmp,f"s{k}.{ext}")
        tts.synth(s["text"],s["lang"],raw,backend,speed=s.get("speed",1.0))
        seg_audio.append(load_audio(raw,ffmpeg))

    # 2) Dauern
    PAD=0.55
    durations=[max(s["md"],len(a)/AR+PAD) for s,a in zip(segs,seg_audio)]
    print(f"  • Dauer gesamt: {sum(durations):.1f}s")

    # 3) Master-Audio
    master=np.zeros(int(sum(durations)*AR)+AR,np.float32); cpos=0
    for dur,a in zip(durations,seg_audio):
        n=int(dur*AR); m=min(len(a),n); master[cpos:cpos+m]+=a[:m]*0.95; cpos+=n
    master=master[:cpos]; fade=int(0.4*AR); master[-fade:]*=np.linspace(1,0,fade)
    wav=os.path.join(tmp,"master.wav")
    with wave.open(wav,"wb") as wf:
        wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(AR)
        wf.writeframes((np.clip(master,-1,1)*32767).astype(np.int16).tobytes())

    # 4) Frames — diagonaler Stift unterstreicht das aktuelle Wort & wischt hin/her
    print("  • Rendere Frames (mit Stift-Zeiger) …")
    skel=page_skeleton(theme)
    pages=[page_with_reveal(skel,words,r) for r in range(len(words)+1)]   # 0..N

    # Bleistift: volle Länge, wie in der Referenz — Spitze oben-links am ITALIENISCHEN
    # Wort, Körper nach unten-rechts (Radiergummi unten-rechts, in die leeren Felder)
    pencil,tip=make_pencil(length=430,width=70); prot,ptip=rotate_tip(pencil,tip,210)

    # Pro Zeile: Mitte & halbe Breite des ITALIENISCHEN Wortes (für das Hin-und-Her)
    mdraw=ImageDraw.Draw(pages[0]); wf=font(62)
    it_geo=[]
    for w in words:
        ew=mdraw.textbbox((0,0),w["it"],font=wf)[2]
        cx=COL_X+(W-PAD_X-COL_X-ew)//2+6+ew/2
        it_geo.append((cx, ew/2))

    SWEEP_PERIOD=1.25   # Sekunden pro Hin-und-Her
    def paste_pencil(base, rowf, gframe):
        row=int(round(rowf)); cx,half=it_geo[row]
        sweep=(half+6)*math.sin(2*math.pi*gframe/(FPS*SWEEP_PERIOD))   # unter dem ital. Wort wischen
        uy=ROW_TOP+rowf*ROW_H+ROW_H//2+42       # knapp unter der Schriftlinie
        tx=cx+sweep
        img=base.copy(); img.paste(prot,(int(tx-ptip[0]),int(uy-ptip[1])),prot); return img

    silent=os.path.join(tmp,"silent.mp4")
    writer=imageio.get_writer(silent,fps=FPS,codec="libx264",quality=9,macro_block_size=None,
                              ffmpeg_params=["-pix_fmt","yuv420p","-crf","19","-movflags","+faststart"])
    FADE=6; gframe=0; cur_row=None
    for si,(s,dur) in enumerate(zip(segs,durations)):
        nf=max(int(dur*FPS),FADE+1); rev=s["revealed"]; target=s["row"]
        # Stift nur zeigen, wenn das ital. Wort dieser Zeile sichtbar ist
        show = target is not None and rev>target
        reveal_up = si>0 and rev>segs[si-1]["revealed"]
        for f in range(nf):
            if reveal_up and f<FADE:
                a=np.array(pages[segs[si-1]["revealed"]],np.float32); b=np.array(pages[rev],np.float32)
                base=Image.fromarray((a*(1-(f+1)/(FADE+1))+b*(f+1)/(FADE+1)).astype(np.uint8))
            else:
                base=pages[rev]
            if not show:
                writer.append_data(np.array(base))
            else:
                if cur_row is None: cur_row=float(target)
                else: cur_row+=(target-cur_row)*0.30       # sanftes Gleiten zur Zeile
                writer.append_data(np.array(paste_pencil(base, cur_row, gframe)))
            gframe+=1
        if show: cur_row=float(target)
    writer.close()

    # 5) Mux
    print("  • Mux …")
    safe=theme.lower().replace(" ","_").replace("(","").replace(")","").replace("ü","ue")
    out=os.path.join(OUT_DIR,f"tag{day_num:02d}_{safe}.mp4")
    subprocess.run([ffmpeg,"-y","-i",silent,"-i",wav,"-c:v","copy","-c:a","aac","-b:a","160k","-shortest",out],
                   check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    print(f"✓ Fertig: {out}  ({os.path.getsize(out)/1024/1024:.1f} MB | {sum(durations):.1f}s)")
    return out,day_num,theme

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--day",type=int,default=None)
    ap.add_argument("--backend",choices=["sherpa","piper","edge","elevenlabs"],default="sherpa")
    ap.add_argument("--no-advance",action="store_true")
    args=ap.parse_args()
    state=json.load(open(STATE,encoding="utf-8"))
    di=args.day if args.day is not None else state["next_day_index"]
    out,day_num,theme=generate(di,args.backend)
    if args.day is None and not args.no_advance:
        state["next_day_index"]=di+1
        state["generated"].append({"day":day_num,"theme":theme,"file":os.path.basename(out)})
        json.dump(state,open(STATE,"w",encoding="utf-8"),ensure_ascii=False,indent=2)

if __name__=="__main__":
    main()
