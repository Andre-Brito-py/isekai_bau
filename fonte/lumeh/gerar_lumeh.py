# gera src/arte_lumeh.js: a Lume em forma humana, a partir da folha desenhada pelo usuário (src_img/lumeh_sheet.png)
import sys, json, os
sys.path.insert(0, '/home/claude/rpg/build/arteia'); os.chdir('/home/claude/rpg/build/arteia')
from ext import load, xp, enc, same, breathe
src, fg = load('/home/claude/rpg/build/lumeh/src_img/lumeh_sheet.png')
FRONT, SIDE, BACK, BUST = (46, 18, 334, 510), (963, 12, 1150, 510), (650, 12, 908, 510), (1150, 80, 1530, 840)
WALK = [(25, 531, 284, 971), (353, 533, 596, 979), (633, 542, 863, 989), (890, 541, 1116, 979)]
px = lambda b, H=46: xp(src, fg, b, H, k=20, dark=1.15, sig=0.5, largest='big')
f = px(FRONT)
out = {
    'body': [enc(x) for x in breathe(f)],
    'side': [enc(x) for x in breathe(px(SIDE))],
    'back': [enc(x) for x in breathe(px(BACK))],
    'walk': [enc(x) for x in same([px(b) for b in WALK])],
}
p = xp(src, fg, BUST, 32, k=24, W=32, top=0.37, y0=0.13, cx=0.40, dark=1.0, sig=0.5, outline=False, largest='big')
import numpy as np
t = np.roll(p, 1, axis=0); t[0] = 0
out['port'] = [enc(x) for x in [p, t, p]]
open('/home/claude/rpg/src/arte_lumeh.js', 'w').write('// gerado por build/lumeh/gerar_lumeh.py a partir da folha do usuário (não editar à mão)\nconst ARTE_LUMEH = ' + json.dumps(out, separators=(',', ':')) + ';\n')
print('ok', f.shape, len(out['body']))
