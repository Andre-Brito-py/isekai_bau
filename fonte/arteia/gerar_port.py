import numpy as np
from PIL import Image
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
