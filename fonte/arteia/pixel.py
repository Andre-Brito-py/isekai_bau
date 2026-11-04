# Pixelização "de artista": paleta limitada na fonte, voto por bloco com prioridade para traço escuro, contorno limpo.
import numpy as np
from PIL import Image
from scipy import ndimage
def crop(src, fg, box, largest=True):
    x0, y0, x1, y1 = box; m = fg[y0:y1, x0:x1].copy()
    if largest:
        lab, n = ndimage.label(ndimage.binary_dilation(m, iterations=2)); s = ndimage.sum(m, lab, range(1, n + 1)); m &= lab == (np.argmax(s) + 1)
    m = m & ~ndimage.binary_dilation(~ndimage.binary_fill_holes(m), iterations=2)  # tira só a franja magenta de fora
    ys, xs = np.where(m)
    return src[y0 + ys.min():y0 + ys.max() + 1, x0 + xs.min():x0 + xs.max() + 1].astype(float), m[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
def palette(rgb, m, k):
    px = rgb[m].astype(np.uint8)
    im = Image.fromarray(px.reshape(1, -1, 3)).quantize(colors=k, method=Image.Quantize.MEDIANCUT, kmeans=3)
    pal = np.array(im.getpalette()[:k * 3]).reshape(-1, 3)
    idx = np.full(m.shape, -1); idx[m] = np.array(im).reshape(-1); return pal, idx
def pixelate(rgb, m, H, k=16, dark=1.8, cov=0.42, W=None, sig=0.42, outline=True, darken=0.0):
    pal, idx = palette(rgb, m, k)
    lum = pal @ [0.3, 0.59, 0.11]; order = np.argsort(lum)
    f = m.shape[0] / H; Wd = W or max(1, round(m.shape[1] / f))
    fx = m.shape[1] / Wd
    out = np.zeros((H, Wd), int) - 1
    wdark = 1 + (dark - 1) * np.clip((lum.max() - lum) / (lum.max() - lum.min() + 1e-6), 0, 1) ** 2
    for j in range(H):
        ya, yb = int(j * f), max(int(j * f) + 1, int((j + 1) * f))
        for i in range(Wd):
            xa, xb = int(i * fx), max(int(i * fx) + 1, int((i + 1) * fx))
            blk = idx[ya:yb, xa:xb]; mm = blk >= 0
            if mm.mean() < cov: continue
            yy, xx = np.mgrid[ya:yb, xa:xb]; cy, cx = (ya + yb - 1) / 2, (xa + xb - 1) / 2
            w = np.exp(-(((yy - cy) / (f * sig + 1e-6)) ** 2 + ((xx - cx) / (fx * sig + 1e-6)) ** 2))
            votes = np.bincount(blk[mm], weights=w[mm], minlength=len(pal)) * wdark
            out[j, i] = votes.argmax()
    # limpeza: pixel isolado (diferente dos 4 vizinhos, que concordam entre si) vira o vizinho
    o2 = out.copy()
    for j in range(1, H - 1):
        for i in range(1, Wd - 1):
            n4 = [out[j-1, i], out[j+1, i], out[j, i-1], out[j, i+1]]
            if out[j, i] >= 0 and len(set(n4)) == 1 and n4[0] != out[j, i] and n4[0] >= 0 and lum[out[j, i]] > lum.min() + 30: o2[j, i] = n4[0]
    out = o2
    a = np.zeros((H, Wd, 4), np.uint8)
    for j in range(H):
        for i in range(Wd):
            if out[j, i] >= 0: a[j, i, :3] = pal[out[j, i]]; a[j, i, 3] = 255
    if outline:
        al = a[..., 3] > 0; edge = al & ~ndimage.binary_erosion(al)
        dk = pal[order[0]]
        for y, x in zip(*np.where(edge)):
            c = a[y, x, :3].astype(float)
            if c @ [0.3, 0.59, 0.11] > lum.min() + 40: a[y, x, :3] = np.clip(c * 0.35 + dk * 0.65, 0, 255)
    return a
def show(arrs, fn, sc=6, bg=(58, 58, 74)):
    W = sum(a.shape[1] * sc + 8 for a in arrs); H = max(a.shape[0] for a in arrs) * sc
    S = Image.new('RGB', (W, H), bg); x = 0
    for a in arrs:
        im = Image.fromarray(a, 'RGBA').resize((a.shape[1] * sc, a.shape[0] * sc), Image.NEAREST); S.paste(im, (x, 0), im); x += a.shape[1] * sc + 8
    S.save(fn)
def fix_mouth(a, minfrac=0.4, period=3):
    """redesenha a boca do baú em tamanho pequeno: fenda escura limpa e dentes regulares"""
    a = a.copy(); al = a[..., 3] > 0; lum = a[..., :3].astype(float) @ [0.3, 0.59, 0.11]
    if not al.any(): return a
    lo = lum[al].min(); dark = al & (lum < lo + 28)
    H, W = al.shape; rows = []
    for y in range(int(H * 0.2), int(H * 0.8)):
        xs = np.where(al[y])[0]
        if len(xs) and dark[y].sum() >= minfrac * len(xs): rows.append(y)
    if len(rows) < 2: return a
    # maior faixa contínua (aceita buraco de 1 linha)
    best, cur = [rows[0]], [rows[0]]
    for y in rows[1:]:
        cur = cur + [y] if y - cur[-1] <= 2 else [y]
        if len(cur) > len(best): best = cur
    y0, y1 = best[0], best[-1]
    if y1 - y0 < 1: return a
    teeth = a[y0:y1 + 1][al[y0:y1 + 1] & (lum[y0:y1 + 1] > lo + 120)]
    tc = teeth[np.argmax(teeth[:, :3].astype(float) @ [0.3, 0.59, 0.11])][:3] if len(teeth) else np.array([242, 236, 220])
    dk = a[dark][np.argmin(lum[dark])][:3]
    xs = np.where(dark[y0:y1 + 1].any(0))[0]; xa, xb = xs.min(), xs.max()
    for y in range(y0, y1 + 1):
        for x in range(xa, xb + 1):
            if al[y, x]: a[y, x, :3] = dk
    for x in range(xa + 1, xb, period):
        for (yy, w) in ((y0, 2), (y0 + 1, 1)):
            for dx in range(w):
                xx = x + dx + (0 if w == 2 else 0)
                if xa <= xx <= xb - 1 and al[yy, xx] and yy <= y1: a[yy, xx, :3] = tc
    for x in range(xa + 2, xb, period):
        for (yy, w) in ((y1, 2), (y1 - 1, 1)):
            for dx in range(w):
                xx = x + dx
                if xa <= xx <= xb - 1 and al[yy, xx] and yy >= y0 + 2: a[yy, xx, :3] = tc
    return a
