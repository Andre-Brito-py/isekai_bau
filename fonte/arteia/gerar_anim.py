import numpy as np
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
