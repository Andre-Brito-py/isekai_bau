import json
from PIL import Image, ImageDraw, ImageFont
f = ImageFont.truetype('/usr/share/fonts/opentype/unifont/unifont.otf', 16)
chars = ''.join(chr(c) for c in range(32,127)) + "áàâãäéêèíóôõöúüçÁÀÂÃÉÊÍÓÔÕÚÇºª—–…“”‘’•►▼▲◄★♥♪←→↑↓×·°"
out = {}
for ch in chars:
    w = int(round(f.getlength(ch)))
    img = Image.new('1', (w, 16), 0)
    d = ImageDraw.Draw(img)
    asc, desc = f.getmetrics()
    d.text((0, 0), ch, font=f, fill=1)
    rows = []
    for y in range(16):
        v = 0
        for x in range(w):
            if img.getpixel((x, y)): v |= 1 << x
        rows.append(v)
    out[ch] = [w, rows]
json.dump(out, open('/home/claude/rpg/build/font.json','w'), ensure_ascii=False, separators=(',',':'))
print(len(out), out['A'], out['ã'], out['★'][0])
