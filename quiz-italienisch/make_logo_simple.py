#!/usr/bin/env python3
"""Simples Logo: Italien-Flagge als Hintergrund (1080x1080, kreis-sicher)."""
import os, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE=os.path.dirname(os.path.abspath(__file__))
OUT=os.path.join(HERE,"brand"); os.makedirs(OUT,exist_ok=True)
S=1080; C=S//2
GREEN=(0,140,69); WHITE=(244,245,240); RED=(206,33,42); INK=(33,40,74)

def font(size,w="ExtraBold"):
    f=ImageFont.truetype(os.path.join(HERE,"fonts","Baloo2.ttf"),size)
    try: f.set_variation_by_name(w)
    except Exception: pass
    return f

def flag_bg():
    img=Image.new("RGB",(S,S),WHITE)
    d=ImageDraw.Draw(img)
    d.rectangle([0,0,S//3,S],fill=GREEN)
    d.rectangle([S//3,0,2*S//3,S],fill=WHITE)
    d.rectangle([2*S//3,0,S,S],fill=RED)
    return img

def circle_mask(img):
    mask=Image.new("L",(S,S),0)
    ImageDraw.Draw(mask).ellipse([6,6,S-6,S-6],fill=255)
    out=Image.new("RGBA",(S,S),(0,0,0,0)); out.paste(img,(0,0),mask); return out

def center_text(d,y,text,f,fill):
    w=d.textlength(text,font=f); d.text((C-w/2,y),text,font=f,fill=fill);
    bb=d.textbbox((0,0),text,font=f); return bb[3]-bb[1]

def variant_q():
    img=flag_bg(); d=ImageDraw.Draw(img)
    # weißer Kreis mit großem rotem ?
    r=300
    d.ellipse([C-r-8,C-r-8,C+r+8,C+r+8],fill=(0,0,0,40))
    d.ellipse([C-r,C-r,C+r,C+r],fill=WHITE)
    qf=font(440); qw=d.textlength("?",font=qf)
    d.text((C-qw/2,C-300),"?",font=qf,fill=RED)
    return img

def variant_text():
    img=flag_bg(); d=ImageDraw.Draw(img)
    # weiße Pille mit "Wie sagt man?"
    f=font(112)
    t="Wie sagt man?"
    tw=d.textlength(t,font=f); th=140
    px,py=70,46
    x0=C-tw/2-px; y0=C-th/2-py; x1=C+tw/2+px; y1=C+th/2+py
    d.rounded_rectangle([x0+8,y0+10,x1+8,y1+10],radius=70,fill=(0,0,0,45))
    d.rounded_rectangle([x0,y0,x1,y1],radius=70,fill=WHITE)
    d.text((C-tw/2,C-th/2-6),t,font=f,fill=INK)
    return img

for name,fn in [("simple_q",variant_q),("simple_text",variant_text)]:
    img=fn()
    img.save(f"{OUT}/logo_{name}_square.png")
    circle_mask(img).save(f"{OUT}/logo_{name}_circle.png")
    print("ok",name)
print("fertig")
