# Parte 2 das artes do usuário: vistas de lado/costas, baús (17 formas), Lume, Madame Pavio, Bento e formas humanas.
import sys, os, json, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); os.chdir(os.path.dirname(os.path.abspath(__file__)))
from ext import *
from PIL import Image
OUT = {'sp': {}, 'chest': {}, 'human': {}, 'port': {}}
FRONT_H = {k: Image.open(f'sp_{k}.png').size[1] for k in ['jorge','tiago','marlene','neide','ozorio','duda','valdir','rita','brida','maren','ofelia','clara','nina','tolo','anselmo','escriba','musgo','cida','bento']}
MAIN = {'ofelia', 'clara'}
# ---- vistas de lado e de costas (elenco3.png) ----
src, fg = load('elenco3.png')
def box_split(b, n, i):
    w = (b[2] - b[0]) / n; return (int(b[0] + w * i), b[1], int(b[0] + w * (i + 1)), b[3])
R1, R2, R3 = (60, 250), (335, 535), (600, 810)
P1, P2, P3 = pieces(fg, *R1), pieces(fg, *R2), pieces(fg, *R3)
V = {  # personagem: (peça de lado, peça de costas)
 'jorge': (P1[1], P1[2]), 'tiago': (P1[4], P1[5]), 'marlene': (None, P1[7]), 'neide': (P1[9], P1[10]),
 'ozorio': (box_split(P1[11], 3, 1), box_split(P1[11], 3, 2)), 'duda': (P1[13], P1[14]), 'valdir': (box_split(P1[15], 3, 1), box_split(P1[15], 3, 2)),
 'rita': (P2[17 - 16], P2[18 - 16]), 'brida': (P2[20 - 16], P2[21 - 16]), 'maren': (box_split(P2[22 - 16], 2, 1), None), 'ofelia': (P2[24 - 16], P2[25 - 16]),
 'clara': (box_split(P2[26 - 16], 2, 1), P2[27 - 16]), 'nina': (P2[29 - 16], P2[30 - 16]), 'tolo': (P2[32 - 16], P2[33 - 16]),
 'anselmo': (P3[35 - 34], None), 'escriba': (box_split(P3[38 - 34], 2, 0), box_split(P3[38 - 34], 2, 1)), 'musgo': (P3[42 - 34], P3[43 - 34]), }
for k, (sb, bb) in V.items():
    for suf, b in (('_s', sb), ('_b', bb)):
        if not b: continue
        if k in MAIN: a = xp(src, fg, b, FRONT_H[k], k=16)
        else: a = extract(src, fg, b, 1, H=FRONT_H[k] - (6 if suf == '_s' and k in ('valdir', 'musgo') else 0), largest=True)
        OUT['sp'][k + suf] = [enc(f) for f in breathe(a)]
# ---- principais (Ofélia e Clara): frente e retrato refeitos a partir da arte em alta (elenco.png) ----
from gerar_anim import ghost, human
srcE, fgE = load('elenco.png')
for k, b, top, yo in [('ofelia', (592, 340, 746, 700), 0.34, 0.10), ('clara', (746, 340, 884, 700), 0.34, 0.0)]:
    f = xp(srcE, fgE, b, FRONT_H[k], k=16)
    OUT['sp'][k] = [enc(x) for x in (ghost(f) if k == 'ofelia' else human(f))]
    p = xp(srcE, fgE, b, 32, k=18, top=top, W=32, outline=False, y0=yo)
    t = np.roll(p, 1, axis=0); t[0] = 0
    OUT['port'][k] = [enc(x) for x in [p, t, p]]
# ---- Lume (lume2.png) ----
src, fg = load('lume2.png'); LB = [(50, 290), (290, 520), (530, 760), (770, 1000)]
LP = [pieces(fg, a, b, 0, 1150) for a, b in LB]
def lu(r, i): return xp(src, fg, LP[r][i], 32, k=14)
LUP = lambda r, i: xp(src, fg, LP[r][i], 32, k=16, top=0.78, W=32)
OUT['port']['lume'] = [enc(f) for f in [LUP(0, 0), LUP(0, 1), LUP(0, 0)]]
OUT['sp']['lume'] = [enc(f) for f in same([lu(0, 0), lu(1, 1), lu(0, 1), lu(1, 1)])]
OUT['sp']['lumeSleep'] = [enc(f) for f in same([lu(2, 5), lu(2, 6)])]
OUT['sp']['lumeLaugh'] = [enc(f) for f in same([lu(3, 0), lu(3, 1), lu(3, 2), lu(3, 1)])]
OUT['sp']['lumeBack'] = [enc(f) for f in same([lu(0, 2), lu(0, 3)])]
# ---- Madame Pavio e Bento (pavio_bento.png) ----
src, fg = load('pavio_bento.png'); PB = [pieces(fg, a, b) for a, b in [(20, 280), (290, 540), (580, 760), (780, 990)]]
pv = lambda r, i: extract(src, fg, PB[r][i], 1, H=46, largest=True)
be = lambda r, i: extract(src, fg, PB[r][i], 1, H=FRONT_H['bento'], largest=True)
OUT['sp']['pavio'] = [enc(f) for f in same([pad(pv(0, 0)), pad(pv(0, 1)), pad(pv(1, 0)), pad(pv(0, 1))])]
OUT['sp']['pavio_s'] = [enc(f) for f in breathe(pv(0, 2))]; OUT['sp']['pavio_b'] = [enc(f) for f in breathe(pv(0, 3))]
OUT['sp']['bento'] = [enc(f) for f in same([pad(be(2, 0)), pad(be(2, 1)), pad(be(2, 0)), pad(be(3, 0))])]
OUT['sp']['bento_s'] = [enc(f) for f in breathe(be(2, 2))]; OUT['sp']['bento_b'] = [enc(f) for f in breathe(be(2, 7))]
OUT['sp']['bentoSleep'] = [enc(f) for f in breathe(be(3, 5))]
from gerar_port import portrait
OUT['port']['pavio'] = [enc(f) for f in portrait(same([pad(pv(0, 0))])[0])]
# ---- baús: 17 formas x (aberto de frente, aberto de lado, fechado) ----
src, fg = load('baus.png')
rows = [(20, 180), (185, 350), (355, 520), (520, 705), (705, 860), (860, 1010)]
FORMS = ['caixote', 'ferro', 'arcano', 'fortaleza', 'espinho', 'grimorio', 'estelar', 'bastiao', 'abismo', 'ferrao', 'carniceiro', 'biblioteca', 'proibido', 'eclipse', 'constelacao', 'arca', 'vazio']
allp = []
for a, b in rows: allp += [p for p in pieces(fg, a, b, gap=6) if p[2] - p[0] > 60]
assert len(allp) == 51, len(allp)
for i, k in enumerate(FORMS):
    f, t, c = allp[i * 3:i * 3 + 3]
    m = lambda bx, H: (xp(src, fg, bx, H, k=18) if H > 30 and k != 'vazio' else extract(src, fg, bx, 1, H=H, colors=22, largest=(k != 'vazio')))
    OUT['chest'][k] = {'map': [enc(x) for x in same([m(f, 26), m(t, 26), m(c, 26)])], 'bat': [enc(x) for x in same([m(f, 36), m(t, 36), m(c, 36)])]}
# ---- formas humanas (linha de 4º grau) ----
def human_rows(fn, bands, names):
    src, fg = load(fn)
    for (a, b), k in zip(bands, names):
        ps = pieces(fg, a, b)
        body = ps[1] if ps[1][2] - ps[1][0] < 150 else box_split(ps[1], 2, 0)
        x0 = 655 if fn == 'humano_b.png' else ps[5][0]; x1 = 1100 if fn == 'humano_b.png' else ps[8][2]
        busts = [(int(x0 + (x1 - x0) * i / 4), a, int(x0 + (x1 - x0) * (i + 1) / 4), b) for i in range(4)]
        bod = xp(src, fg, body, 48, k=20, dark=1.15, sig=0.5)
        b48 = [xp(src, fg, bb, 46, k=24, dark=1.0, sig=0.5) for bb in busts]
        b32 = [xp(src, fg, bb, 31, k=22, dark=1.0, sig=0.5) for bb in busts]
        sq = lambda im, S: np.array(Image.fromarray(same([im])[0]).crop((0, 0, max(S, im.shape[1]), max(S, im.shape[0]))).resize((S, S), Image.NEAREST)) if False else fit(im, S)
        OUT['human'][k] = {'body': [enc(x) for x in breathe(bod)], 'big': [enc(fit(x, 48)) for x in b48], 'port': [enc(fit(x, 32)) for x in b32]}
def fit(im, S):
    c = np.zeros((S, S, 4), np.uint8); h, w = im.shape[:2]; im = im[:S, :S]; h, w = im.shape[:2]
    c[S - h:, (S - w) // 2:(S - w) // 2 + w] = im; return c
human_rows('humano_b.png', [(i * 168 + 2, (i + 1) * 168 + 2) for i in range(7)], ['abismo', 'ferrao', 'carniceiro', 'biblioteca', 'proibido', 'eclipse', 'constelacao'])
human_rows('humano_a.png', [(830, 1020)], ['bastiao'])
js = '// gerado por build/arteia/gerar2.py a partir das artes enviadas pelo usuário (não editar à mão)\nconst ARTE_IA2 = ' + json.dumps(OUT, separators=(',', ':')) + ';\n'
open('/home/claude/rpg/src/arte_ia2.js', 'w').write(js); print('ok', len(js) // 1024, 'KB', list(OUT['sp'].keys()))
