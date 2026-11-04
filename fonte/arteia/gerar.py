# Gera src/arte_ia.js a partir das artes enviadas pelo usuário (elenco.png e lume.png).
# 1) proc.py e lume_proc.py recortam e reduzem cada personagem; 2) aqui montamos as animações e os retratos.
import numpy as np, base64, json, subprocess, os
from PIL import Image
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(['python3', '-I', 'proc.py', '6.4'], check=True, capture_output=True)
subprocess.run(['python3', '-I', 'lume_proc.py'], check=True, capture_output=True)
def load(n): return np.array(Image.open(n).convert('RGBA'))
def shift_rows(a, y0, y1, dy):
    """move as linhas [y0,y1) dy pixels (dy>0 = para baixo), preenchendo o buraco com a linha vizinha"""
    b = a.copy(); band = a[y0:y1].copy()
    b[y0:y1] = 0
    t0, t1 = max(0, y0 + dy), min(a.shape[0], y1 + dy)
    b[t0:t1] = band[t0 - (y0 + dy): t1 - (y0 + dy)]
    if dy > 0: b[y1:y1 + dy] = np.where(b[y1:y1 + dy, ..., 3:4] > 0, b[y1:y1 + dy], a[y1 - 1:y1 - 1 + dy])
    return b
def pad(a, top=2):
    return np.concatenate([np.zeros((top, a.shape[1], 4), np.uint8), a], 0)
def human(a):
    a = pad(a); h = a.shape[0]; waist = int(h * 0.56); neck = int(h * 0.3)
    f1 = shift_rows(a, 0, waist, 1)                       # respira (desce o tronco e a cabeça)
    f3 = shift_rows(a, 0, neck, 1)                        # acena com a cabeça
    return [a, f1, a, f3]
def ghost(a):
    a = pad(a); h = a.shape[0]; fr = []
    for k in range(4):
        b = a.copy()
        for y in range(int(h * 0.7), h):
            s = int(round(np.sin(k * np.pi / 2 + y * 0.5) * 1))
            b[y] = np.roll(a[y], s, axis=0)
        fr.append(b)
    return fr
def floaty(a):
    a = pad(a); up = shift_rows(a, 0, a.shape[0], -1)
    return [a, up, up, a]
def breathe(a, frac=0.6):
    a = pad(a); return [a, shift_rows(a, 0, int(a.shape[0] * frac), 1), a, a]
SP = {}
for k in ['jorge', 'tiago', 'marlene', 'neide', 'ozorio', 'duda', 'rita', 'brida', 'maren', 'clara', 'pip', 'nina', 'tolo', 'anselmo']: SP[k] = human(load(f'sp_{k}.png'))
SP['ofelia'] = ghost(load('sp_ofelia.png'))
SP['escriba'] = floaty(load('sp_escriba.png'))
SP['musgo'] = breathe(load('sp_musgo.png'), 0.62)
SP['cida'] = breathe(load('sp_cida.png'), 0.55)
SP['bento'] = breathe(load('sp_bento.png'), 0.5)
SP['valdir'] = breathe(load('sp_valdir.png'), 0.75)
L = [load(f'lume_{i}.png') for i in range(12)]
def same(fs):  # mesmo tamanho para todos os quadros (centralizado embaixo)
    W = max(f.shape[1] for f in fs); H = max(f.shape[0] for f in fs); out = []
    for f in fs:
        c = np.zeros((H, W, 4), np.uint8); y = H - f.shape[0]; x = (W - f.shape[1]) // 2; c[y:y + f.shape[0], x:x + f.shape[1]] = f; out.append(c)
    return out
SP['lume'] = same([L[0], L[1], L[7], L[1]])          # cantando
SP['lumeCalm'] = same([L[11], L[0], L[11], L[11]])   # sorrindo
SP['lumeTurn'] = same([L[2], L[3], L[9], L[0]])      # dá uma volta (cenas)
# retratos 32x32: a cabeça ampliada 2x (ou a criatura inteira, reduzida para caber)
PORT = {}
def portrait(a, creature=False):
    al = a[..., 3] > 0
    if creature:
        ys, xs = np.where(al); a = a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
        im = Image.fromarray(a); s = min(30 / a.shape[1], 30 / a.shape[0], 2)
        im = im.resize((max(1, int(a.shape[1] * s)), max(1, int(a.shape[0] * s))), Image.NEAREST)
        c = Image.new('RGBA', (32, 32)); c.alpha_composite(im, ((32 - im.width) // 2, 32 - im.height)); base = np.array(c)
    else:
        ys, xs = np.where(al); top = ys.min(); rows = al[top:top + 12]; cx = int(round(np.where(rows)[1].mean()))
        x0 = max(0, cx - 8); crop = np.zeros((16, 16, 4), np.uint8); part = a[top:top + 16, x0:x0 + 16]; crop[:part.shape[0], :part.shape[1]] = part
        base = np.array(Image.fromarray(crop).resize((32, 32), Image.NEAREST))
    talk = np.roll(base, 1, axis=0); talk[0] = 0
    return [base, talk, base]
for k in ['jorge', 'tiago', 'marlene', 'neide', 'ozorio', 'duda', 'rita', 'brida', 'maren', 'clara', 'pip', 'nina', 'anselmo', 'escriba', 'ofelia']: PORT[k] = portrait(SP[k][0])
for k in ['lume', 'musgo', 'cida', 'bento', 'valdir']: PORT[k] = portrait(SP[k][0], True)
def enc(a):
    h, w = a.shape[:2]; pal = []; idx = {}; data = bytearray()
    for y in range(h):
        for x in range(w):
            p = a[y, x]
            if p[3] < 128: data.append(0); continue
            c = '%02x%02x%02x' % tuple(p[:3])
            if c not in idx: idx[c] = len(pal) + 1; pal.append(c)
            data.append(idx[c])
    assert len(pal) < 255
    return {'w': w, 'h': h, 'p': ''.join(pal), 'd': base64.b64encode(bytes(data)).decode()}
out = {'sp': {k: [enc(f) for f in v] for k, v in SP.items()}, 'port': {k: [enc(f) for f in v] for k, v in PORT.items()}}
js = '// gerado por build/arteia/gerar.py a partir das artes enviadas pelo usuário (não editar à mão)\nconst ARTE_IA = ' + json.dumps(out, separators=(',', ':')) + ';\n'
open('/home/claude/rpg/src/arte_ia.js', 'w').write(js)
print('ok', len(js) // 1024, 'KB', {k: (v[0].shape[1], v[0].shape[0]) for k, v in SP.items()})
