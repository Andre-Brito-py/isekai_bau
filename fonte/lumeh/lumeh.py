# Lume em forma humana: pixel art original desenhada por primitivas e retocada (corpo 24x42, retrato 32x32)
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
P = dict(k=(26,18,32), H=(240,200,96), h=(200,144,42), Y=(255,240,168), F=(255,154,58), f=(224,96,42),
         S=(246,214,192), s=(224,168,144), E=(214,120,30), e=(90,36,16), w=(255,248,240), M=(192,96,112),
         C=(239,230,212), c=(196,182,152), G=(224,176,64), L=(192,160,240), l=(140,110,200),
         T=(42,32,48), B=(110,66,40), b=(64,38,26), R=(150,82,40), r=(92,44,26), p=(255,170,190))
def canvas(w, h): return Image.new('RGB', (w, h), (255, 0, 255))
def col(c): return P[c]
def body(blink=False, sway=0, flick=0):
    W, H = 24, 42; im = canvas(W, H); d = ImageDraw.Draw(im)
    # violão nas costas (aparece por cima do ombro esquerdo dela = direita da tela)
    d.line([(19, 7), (15, 19)], fill=col('r'), width=1); d.line([(20, 7), (16, 19)], fill=col('R'), width=1)
    d.rectangle([19, 4, 21, 7], fill=col('R')); d.point([(20, 5)], fill=col('G'))
    # cabelo de trás (longo, até a cintura, pontas em chama)
    d.polygon([(6, 4), (17, 4), (19, 12), (20 + sway, 28), (17 + sway, 32), (12, 29), (7 - sway, 32), (3 - sway, 28), (4, 12)], fill=col('H'))
    d.polygon([(4, 18), (7, 18), (7 - sway, 31), (3 - sway, 28)], fill=col('h')); d.polygon([(17, 18), (20, 18), (20 + sway, 28), (17 + sway, 31)], fill=col('h'))
    # pontas em chama
    for (x, y) in [(3 - sway, 27), (4 - sway, 29), (6 - sway, 31), (18 + sway, 30), (19 + sway, 28), (20 + sway, 27)]:
        d.point([(x, y)], fill=col('F' if (x + y + flick) % 2 else 'f'))
    for (x, y) in [(4 - sway, 26), (19 + sway, 26), (5 - sway, 30), (18 + sway, 29)]: d.point([(x, y)], fill=col('F'))
    # casaco (creme, barra dourada, botões de cristal)
    d.polygon([(7, 17), (16, 17), (18, 21), (18, 33), (5, 33), (5, 21)], fill=col('C'))
    d.polygon([(5, 22), (7, 22), (7, 33), (5, 33)], fill=col('c')); d.polygon([(16, 22), (18, 22), (18, 33), (16, 33)], fill=col('c'))
    d.line([(5, 33), (18, 33)], fill=col('G')); d.line([(11, 18), (11, 32)], fill=col('G'))
    d.point([(12, 21), (12, 25), (12, 29)], fill=col('L'))
    # gola e alça do violão cruzando o peito
    d.line([(8, 17), (15, 17)], fill=col('G')); d.line([(8, 18), (16, 26)], fill=col('r'))
    # braços (mangas) e mãos
    d.rectangle([4, 19, 5, 28], fill=col('c')); d.rectangle([18, 19, 19, 28], fill=col('c'))
    d.rectangle([4, 29, 5, 30], fill=col('S')); d.rectangle([18, 29, 19, 30], fill=col('S'))
    # pernas e botas
    d.rectangle([9, 34, 10, 38], fill=col('T')); d.rectangle([13, 34, 14, 38], fill=col('T'))
    d.rectangle([8, 39, 10, 40], fill=col('B')); d.rectangle([13, 39, 15, 40], fill=col('B'))
    d.line([(8, 40), (10, 40)], fill=col('b')); d.line([(13, 40), (15, 40)], fill=col('b'))
    # pescoço e rosto
    d.rectangle([11, 15, 12, 16], fill=col('s'))
    d.ellipse([7, 5, 16, 15], fill=col('S')); d.line([(8, 14), (15, 14)], fill=col('s'))
    # franja e mechas laterais
    d.polygon([(6, 3), (17, 3), (18, 8), (16, 6), (14, 8), (12, 6), (10, 8), (8, 6), (5, 9)], fill=col('H'))
    d.line([(7, 3), (16, 3)], fill=col('Y')); d.point([(9, 4), (10, 4)], fill=col('Y'))
    d.line([(6, 8), (6, 15)], fill=col('H')); d.line([(17, 8), (17, 15)], fill=col('H'))
    d.line([(7, 9), (7, 13)], fill=col('h')); d.line([(16, 9), (16, 13)], fill=col('h'))
    # presilha: suporte de vela dourado com cristal lilás
    d.point([(16, 4)], fill=col('G')); d.point([(17, 4)], fill=col('L'))
    # olhos, bochechas, boca
    if blink:
        d.line([(9, 11), (10, 11)], fill=col('e')); d.line([(13, 11), (14, 11)], fill=col('e'))
    else:
        for x in (9, 13):
            d.line([(x, 9), (x + 1, 9)], fill=col('e')); d.point([(x, 10)], fill=col('E')); d.point([(x + 1, 10)], fill=col('e')); d.point([(x, 11)], fill=col('E')); d.point([(x + 1, 11)], fill=col('E'))
            d.point([(x, 10)], fill=col('w'))
    d.point([(8, 12), (15, 12)], fill=col('p')); d.point([(11, 13), (12, 13)], fill=col('M'))
    return finish(im)
def finish(im):
    a = np.array(im); mask = ~((a[..., 0] == 255) & (a[..., 1] == 0) & (a[..., 2] == 255))
    out = np.zeros(a.shape[:2] + (4,), np.uint8); out[..., :3] = a; out[..., 3] = mask * 255
    ring = ndimage.binary_dilation(mask) & ~mask
    out[ring, :3] = P['k']; out[ring, 3] = 255
    return out
def bust(blink=False, talk=False):
    S = 32; im = canvas(S, S); d = ImageDraw.Draw(im)
    d.polygon([(5, 4), (26, 4), (30, 14), (31, 31), (0, 31), (1, 14)], fill=col('H'))
    d.polygon([(0, 20), (5, 20), (5, 31), (0, 31)], fill=col('h')); d.polygon([(26, 20), (31, 20), (31, 31), (26, 31)], fill=col('h'))
    for (x, y) in [(0, 29), (1, 30), (30, 30), (31, 28), (2, 31), (29, 31)]: d.point([(x, y)], fill=col('F'))
    d.point([(0, 31), (31, 31), (1, 28)], fill=col('f'))
    # casaco e gola
    d.polygon([(8, 25), (23, 25), (27, 31), (4, 31)], fill=col('C')); d.line([(9, 25), (22, 25)], fill=col('G')); d.line([(15, 26), (15, 31)], fill=col('G')); d.point([(16, 29)], fill=col('L'))
    d.line([(8, 26), (14, 31)], fill=col('r'))
    d.rectangle([13, 21, 18, 25], fill=col('s'))
    # rosto
    d.ellipse([7, 6, 24, 23], fill=col('S')); d.line([(10, 22), (21, 22)], fill=col('s'))
    # franja
    d.polygon([(5, 3), (26, 3), (27, 12), (24, 8), (21, 11), (18, 7), (15, 11), (12, 7), (9, 11), (6, 8), (4, 13)], fill=col('H'))
    d.line([(8, 3), (23, 3)], fill=col('Y')); d.line([(10, 4), (14, 4)], fill=col('Y')); d.point([(18, 5), (19, 5)], fill=col('Y'))
    d.line([(5, 12), (5, 24)], fill=col('H')); d.line([(26, 12), (26, 24)], fill=col('H')); d.line([(6, 13), (6, 21)], fill=col('h')); d.line([(25, 13), (25, 21)], fill=col('h'))
    d.rectangle([24, 4, 25, 5], fill=col('G')); d.rectangle([26, 5, 26, 6], fill=col('L'))
    # olhos grandes de anime
    for x in (10, 18):
        if blink: d.line([(x, 15), (x + 3, 15)], fill=col('e')); continue
        d.line([(x - 1, 12), (x + 3, 12)], fill=col('e')); d.rectangle([x, 13, x + 3, 16], fill=col('E'))
        d.rectangle([x + 1, 14, x + 2, 15], fill=col('e')); d.point([(x, 13), (x + 1, 13)], fill=col('w')); d.point([(x + 3, 16)], fill=col('Y'))
        d.line([(x, 17), (x + 3, 17)], fill=col('s'))
    d.line([(9, 11), (12, 10)], fill=col('h')); d.line([(19, 10), (22, 11)], fill=col('h'))
    d.rectangle([8, 17, 9, 18], fill=col('p')); d.rectangle([22, 17, 23, 18], fill=col('p'))
    if talk: d.rectangle([15, 19, 16, 20], fill=col('M')); d.point([(15, 19), (16, 19)], fill=col('e'))
    else: d.line([(14, 19), (17, 19)], fill=col('M')); d.point([(14, 18), (17, 18)], fill=col('s'))
    return finish(im)
if __name__ == '__main__':
    fr = [body(), body(sway=1, flick=1), body(blink=True), bust(), bust(talk=True), bust(blink=True)]
    sc = 8; Wt = sum(f.shape[1] * sc + 10 for f in fr); Ht = max(f.shape[0] for f in fr) * sc
    S = Image.new('RGB', (Wt, Ht), (58, 58, 74)); x = 0
    for f in fr:
        t = Image.fromarray(f, 'RGBA').resize((f.shape[1] * sc, f.shape[0] * sc), Image.NEAREST); S.paste(t, (x, 0), t); x += f.shape[1] * sc + 10
    S.save('/tmp/claude-0/-home-claude/21d632bd-691d-5171-96af-6be176f77e4e/scratchpad/lumeh.png')
