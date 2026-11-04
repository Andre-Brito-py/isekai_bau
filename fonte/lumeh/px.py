# Lume humana: alta resolução -> pixel art, com o rosto retocado à mão nos dois tamanhos
import sys, numpy as np
sys.path.insert(0, '/home/claude/rpg/build/lumeh'); sys.path.insert(0, '/home/claude/rpg/build/arteia')
from hi import draw, to_rgba, C
from pixel import pixelate
K = C['lash']; IR = C['iris']; ID = C['irisD']; WH = C['white']; SK = C['skin']; BL = C['blush']; MO = C['mouth']; PU = C['pup']
def stamp(a, x, y, rows, pal):
    for j, r in enumerate(rows):
        for i, ch in enumerate(r):
            if ch == '.': continue
            yy, xx = y + j, x + i
            if 0 <= yy < a.shape[0] and 0 <= xx < a.shape[1]: a[yy, xx, :3] = pal[ch]; a[yy, xx, 3] = 255
PAL = {'k': K, 'E': IR, 'e': PU, 'w': WH, 'S': SK, 'p': BL, 'm': MO, 'd': ID}
def body(blink=False, talk=False, sway=0, flick=0, H=42):
    rgb, m = to_rgba(draw(sway=sway, flick=flick, face=False)); ys, xs = np.where(m); y0, x0 = ys.min(), xs.min()
    rgb = rgb[y0:ys.max() + 1, x0:xs.max() + 1]; m = m[y0:ys.max() + 1, x0:xs.max() + 1]
    a = pixelate(rgb, m, H, k=22, dark=1.2, sig=0.5)
    f = m.shape[0] / H; Wd = a.shape[1]; fx = m.shape[1] / Wd
    P = lambda X, Y: (int(round((X - x0) / fx)), int(round((Y - y0) / f)))
    # rosto à mão: olhos 2x3 (cílio, íris com brilho), bochechas e boca
    for ex in (98, 142):
        x, y = P(ex, 112); x -= 1
        if blink: stamp(a, x, y + 1, ['kk'], PAL)
        else: stamp(a, x, y - 1, ['kk', 'wE', 'Ed'], PAL)
    cx, cy = P(120, 134)
    stamp(a, cx - 4, cy - 1, ['p......p'], PAL)
    stamp(a, cx, cy + 1, ['m'] if not talk else ['m', 'k'], PAL)
    return a
def portrait(blink=False, talk=False, flick=0):
    rgb, m = to_rgba(draw(flick=flick, face=False)); X0, Y0, X1, Y1 = 46, 28, 194, 176
    a = pixelate(rgb[Y0:Y1, X0:X1], m[Y0:Y1, X0:X1], 32, k=24, W=31, dark=1.1, sig=0.5, outline=True)
    fy = (Y1 - Y0) / 32; fx = (X1 - X0) / 31
    P = lambda X, Y: (int(round((X - X0) / fx)), int(round((Y - Y0) / fy)))
    for ex in (98, 142):
        x, y = P(ex, 100); x -= 2
        if blink: stamp(a, x, y + 3, ['.kk.', 'k..k'], PAL)
        else: stamp(a, x - 1, y, ['.kkkk', 'kwwEE', '.wEeE', '.EeeE', '.dEEd', '..dd.'], PAL)
    cx, cy = P(120, 140)
    stamp(a, cx - 6, cy - 2, ['pp........pp'], PAL)
    stamp(a, cx - 1, cy, ['k..k', '.kk.'] if not talk else ['.kk.', 'kmmk', '.kk.'], PAL)
    return a
