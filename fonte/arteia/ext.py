import numpy as np
from PIL import Image
from scipy import ndimage
def load(fn, bg='magenta'):
    src = np.array(Image.open(fn).convert('RGB')).astype(int); r, g, b = src[..., 0], src[..., 1], src[..., 2]
    if bg == 'white': fg = ~((r > 232) & (g > 232) & (b > 232))
    else: fg = ~((r > 140) & (b > 140) & (g < 110) & (np.abs(r - b) < 90))
    return src, ndimage.binary_opening(fg, iterations=1)
def pieces(fg, y0, y1, x0=0, x1=None, gap=3, minw=20):
    """divide uma faixa horizontal em peças separadas por colunas vazias"""
    x1 = x1 or fg.shape[1]; col = fg[y0:y1, x0:x1].sum(0) > 2; xs = np.where(col)[0]
    if not len(xs): return []
    runs = []; s = p = xs[0]
    for x in xs[1:]:
        if x - p > gap: runs.append((s, p + 1)); s = x
        p = x
    runs.append((s, p + 1)); out = []
    for a, b in runs:
        if b - a < minw: continue
        ys = np.where(fg[y0:y1, x0 + a:x0 + b].any(1))[0]; out.append((x0 + a, y0 + ys.min(), x0 + b, y0 + ys.max() + 1))
    return out
def extract(src, fg, box, factor, colors=18, outline=True, largest=False, H=None):
    x0, y0, x1, y1 = box; m = fg[y0:y1, x0:x1].copy()
    if largest:
        lab, n = ndimage.label(ndimage.binary_dilation(m, iterations=2)); s = ndimage.sum(m, lab, range(1, n + 1)); m &= lab == (np.argmax(s) + 1)
    ys, xs = np.where(m); m = m[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    rgb = src[y0 + ys.min():y0 + ys.max() + 1, x0 + xs.min():x0 + xs.max() + 1].astype(float)
    if H: factor = m.shape[0] / H
    W = max(1, round(m.shape[1] / factor)); Hh = max(1, round(m.shape[0] / factor)); mf = m.astype(float)
    A = np.array(Image.fromarray(mf * 255).resize((W, Hh), Image.BOX)).astype(float) / 255
    C = np.stack([np.array(Image.fromarray(rgb[..., c] * mf).resize((W, Hh), Image.BOX)) for c in range(3)], -1) / np.maximum(A[..., None], 1e-3)
    al = A > 0.45
    Q = np.array(Image.fromarray(np.clip(C, 0, 255).astype(np.uint8)).quantize(colors=colors, method=Image.Quantize.MEDIANCUT).convert('RGB')).astype(int)
    out = np.zeros((Hh, W, 4), np.uint8); out[..., :3] = Q; out[..., 3] = al * 255
    if outline:
        edge = al & ~ndimage.binary_erosion(al)
        for y, x in zip(*np.where(edge)): out[y, x, :3] = np.clip(Q[y, x] * 0.45 + np.array([20, 10, 40]) * 0.55, 0, 255)
    return out
import base64
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
    return {'w': int(w), 'h': int(h), 'p': ''.join(pal), 'd': base64.b64encode(bytes(data)).decode()}
def pad(a, top=2, side=0):
    b = np.zeros((a.shape[0] + top, a.shape[1] + side * 2, 4), np.uint8); b[top:, side:side + a.shape[1]] = a; return b
def shift_rows(a, y0, y1, dy):
    b = a.copy(); band = a[y0:y1].copy(); b[y0:y1] = 0
    t0, t1 = max(0, y0 + dy), min(a.shape[0], y1 + dy); b[t0:t1] = band[t0 - (y0 + dy): t1 - (y0 + dy)]
    if dy > 0: b[y1:y1 + dy] = np.where(b[y1:y1 + dy, ..., 3:4] > 0, b[y1:y1 + dy], a[y1 - 1:y1 - 1 + dy])
    return b
def breathe(a, frac=0.56):
    a = pad(a); return [a, shift_rows(a, 0, int(a.shape[0] * frac), 1)]
def same(fs):
    W = max(f.shape[1] for f in fs); H = max(f.shape[0] for f in fs); out = []
    for f in fs:
        c = np.zeros((H, W, 4), np.uint8); c[H - f.shape[0]:, (W - f.shape[1]) // 2:(W - f.shape[1]) // 2 + f.shape[1]] = f; out.append(c)
    return out
def enc_rle(a):
    """como enc, mas com os índices comprimidos em pares (repetições, índice)"""
    e = enc(a); raw = base64.b64decode(e['d']); out = bytearray(); i = 0
    while i < len(raw):
        j = i
        while j < len(raw) and raw[j] == raw[i] and j - i < 255: j += 1
        out += bytes([j - i, raw[i]]); i = j
    e['d'] = base64.b64encode(bytes(out)).decode(); e['r'] = 1; return e
def same_h(fs):
    H = max(f.shape[0] for f in fs); return [np.concatenate([np.zeros((H - f.shape[0], f.shape[1], 4), np.uint8), f], 0) for f in fs]
import io
def enc_png(a):
    im = Image.fromarray(a, 'RGBA'); al = a[..., 3] > 127
    p = Image.fromarray(a[..., :3]).quantize(colors=63, method=Image.Quantize.MEDIANCUT)
    idx = np.array(p); idx[~al] = 63; pal = p.getpalette()[:63 * 3] + [255, 0, 255]
    q = Image.fromarray(idx.astype(np.uint8), 'P'); q.putpalette(pal + [0] * (768 - len(pal)))
    buf = io.BytesIO(); q.save(buf, 'PNG', optimize=True, transparency=63)
    return {'w': int(a.shape[1]), 'h': int(a.shape[0]), 'png': base64.b64encode(buf.getvalue()).decode()}
