#!/usr/bin/env python3
"""Profil-Logo (1080x1080, kreis-sicher) für Instagram & TikTok."""
import os, math
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import generate_quiz as g   # nutzt Schrift + Bleistift der Serie

HERE = os.path.dirname(os.path.abspath(__file__))
OUT  = os.path.join(HERE, "brand"); os.makedirs(OUT, exist_ok=True)
S = 1080; C = S//2

INK=(38,46,78); INK2=(20,26,54); RED=(196,38,44); GREEN=(0,140,69)
CREAM=(245,240,222); WHITE=(255,255,255); GOLD=(240,196,70)

def font(size, w="ExtraBold"):
    f=ImageFont.truetype(os.path.join(HERE,"fonts","Baloo2.ttf"),size)
    try: f.set_variation_by_name(w)
    except Exception: pass
    return f

def radial_bg():
    img=Image.new("RGB",(S,S),INK)
    px=img.load()
    for y in range(S):
        for x in range(S):
            d=math.hypot(x-C,y-C)/C
            t=min(d,1)
            px[x,y]=tuple(int(INK[i]+(INK2[i]-INK[i])*t) for i in range(3))
    return img

def arc_text(draw, text, radius, center_angle_deg, font, fill, up=True, spacing=1.0):
    """Text entlang eines Kreisbogens. up=True -> oben (270°), up=False -> unten (90°)."""
    widths=[draw.textlength(ch,font=font) for ch in text]
    span=sum(w*spacing for w in widths)/radius          # Gesamtwinkel (rad)
    step = 1 if up else -1                               # Leserichtung links->rechts
    a = math.radians(center_angle_deg) - step*span/2
    for ch,w in zip(text,widths):
        wr=w*spacing
        a += step*(wr/2)/radius
        x=C+radius*math.cos(a); y=C+radius*math.sin(a)
        rot = (270 if up else 90) - math.degrees(a)
        ci=Image.new("RGBA",(int(w)+20,font.size+30),(0,0,0,0))
        ImageDraw.Draw(ci).text((10,8),ch,font=font,fill=fill)
        ci=ci.rotate(rot,expand=True,resample=Image.BICUBIC)
        img_target.paste(ci,(int(x-ci.width/2),int(y-ci.height/2)),ci)
        a += step*(wr/2)/radius

def flag_bar(d, x0,y0,x1,y1, r=10):
    w=(x1-x0)/3
    d.rounded_rectangle([x0,y0,x0+w+ r,y1],radius=r,fill=GREEN)
    d.rectangle([x0+w,y0,x0+2*w,y1],fill=WHITE)
    d.rounded_rectangle([x0+2*w-r,y0,x1,y1],radius=r,fill=RED)

def build(variant="icon"):
    global img_target
    base=radial_bg()
    img_target=base.convert("RGBA")
    d=ImageDraw.Draw(img_target,"RGBA")

    # Außenring (Italien-Tricolore als drei Bögen)
    ring_r=C-28; lw=46
    box=[C-ring_r,C-ring_r,C+ring_r,C+ring_r]
    d.arc(box,150,270,fill=GREEN,width=lw)
    d.arc(box,270,30, fill=WHITE,width=lw)
    d.arc(box,30,150,  fill=RED,  width=lw)
    # feiner weißer Innenring
    d.ellipse([C-ring_r+lw, C-ring_r+lw, C+ring_r-lw, C+ring_r-lw], outline=(255,255,255,60), width=4)

    if variant=="icon":
        # Notizblock-Karte mittig
        cw,ch=560,520; x0=C-cw//2; y0=C-ch//2-10
        d.rounded_rectangle([x0+10,y0+14,x0+cw+10,y0+ch+14],radius=46,fill=(0,0,0,90))
        d.rounded_rectangle([x0,y0,x0+cw,y0+ch],radius=46,fill=CREAM)
        # Spiral-Punkte oben
        for i in range(6):
            sx=x0+70+i*((cw-140)/5)
            d.ellipse([sx-12,y0-16,sx+12,y0+18],fill=INK)
        # Flaggen-Leiste
        flag_bar(d, x0+60,y0+70, x0+cw-60,y0+118, r=12)
        # großes Fragezeichen
        qf=font(360)
        qw=d.textlength("?",font=qf)
        d.text((C-qw/2, y0+150),"?",font=qf,fill=RED)
        # Bleistift diagonal
        pencil,tip=g.make_pencil(length=430,width=66)
        prot,_=g.rotate_tip(pencil,tip,-38)
        img_target.alpha_composite(prot,(C+40,C+30))
        # Bogentexte (innen auf dunklem Grund -> guter Kontrast)
        arc_text(d,"WIE SAGT MAN?",ring_r-74,270,font(72),WHITE,up=True,spacing=1.06)
        arc_text(d,"ITALIENISCH  LERNEN",ring_r-70,90,font(54),GOLD,up=False,spacing=1.08)

    else:  # wordmark
        flag_bar(d, C-300,C-250, C+300,C-188, r=14)
        t1=font(150); t2=font(150); t3=font(150)
        for i,(line,col,fs) in enumerate([("Wie",WHITE,150),("sagt",WHITE,150),("man?",GOLD,150)]):
            f=font(fs); w=d.textlength(line,font=f)
            d.text((C-w/2, C-150+i*150), line, font=f, fill=col)
        pencil,tip=g.make_pencil(length=380,width=58)
        prot,_=g.rotate_tip(pencil,tip,-40)
        img_target.alpha_composite(prot,(C+120,C+120))
        arc_text(d,"ITALIENISCH JEDEN TAG",ring_r-70,90,font(52),CREAM,up=False,spacing=1.06)

    # Kreis-Maske (für runde Avatare; Ecken transparent)
    mask=Image.new("L",(S,S),0)
    ImageDraw.Draw(mask).ellipse([6,6,S-6,S-6],fill=255)
    out=Image.new("RGBA",(S,S),(0,0,0,0))
    out.paste(img_target,(0,0),mask)
    # zusätzlich Version mit vollem Quadrat-Hintergrund (TikTok zeigt teils Quadrat)
    sq=img_target.convert("RGB")
    return out, sq

for v in ["icon","wordmark"]:
    circ,sq=build(v)
    circ.save(f"{OUT}/logo_{v}_circle.png")
    sq.save(f"{OUT}/logo_{v}_square.png")
    print("ok",v)
print("fertig ->",OUT)
