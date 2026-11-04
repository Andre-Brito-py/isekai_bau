# Lume humana desenhada em alta (10x) com formas planas; depois vira pixel art pelo pixelizador do jogo.
import numpy as np, math
from PIL import Image, ImageDraw
C = dict(out=(34,22,40), hair=(246,206,96), hairS=(214,160,52), hairD=(170,110,40), hairL=(255,242,176),
         fl1=(255,170,64), fl2=(240,104,44), fl3=(196,58,40), skin=(250,222,204), skinS=(232,178,156),
         blush=(255,160,170), iris=(222,128,36), irisD=(150,64,20), pup=(70,24,12), white=(255,250,244),
         lash=(52,26,30), mouth=(200,90,100), coat=(242,234,218), coatS=(206,192,166), gold=(230,180,70),
         goldD=(170,120,40), lil=(196,166,246), lilD=(136,108,206), tight=(46,36,56), boot=(120,72,44), bootD=(74,44,30),
         wood=(158,92,48), woodD=(104,56,30), strap=(110,52,34))
def wave(x0, y0, x1, y1, amp, n, t):
    return [(x0 + (x1 - x0) * i / n + amp * math.sin(i * 1.3 + t), y0 + (y1 - y0) * i / n) for i in range(n + 1)]
def draw(blink=False, talk=False, sway=0.0, flick=0, smile=True, W=240, H=420, face=True):
    im = Image.new('RGB', (W, H), (255, 0, 255)); d = ImageDraw.Draw(im)
    cx = 120
    # cabelo de trás: longo até abaixo da cintura, pontas em chama
    s = sway * 8
    left = wave(70, 72, 34 - s, 330, 6, 10, sway)
    right = wave(170, 72, 206 + s, 330, 6, 10, sway + 1)
    back = [(62, 80)] + left + [(60 - s, 336), (120, 330), (180 + s, 336)] + right[::-1] + [(178, 80)]
    d.polygon(back, fill=C['hair'])
    d.polygon([(52, 140), (78, 140), (82, 330), (44 - s, 330)], fill=C['hairS']); d.polygon([(162, 140), (190, 140), (198 + s, 330), (160, 330)], fill=C['hairS'])
    # chamas nas pontas (três camadas, tremulando)
    for i, (x, y) in enumerate([(40 - s, 306), (60 - s, 320), (180 + s, 320), (200 + s, 306)]):
        f = (i + flick) % 2
        d.polygon([(x - 14, y), (x + 14, y), (x + 6 + 4 * f, y + 40 + 6 * f), (x - 2, y + 26), (x - 8 - 3 * f, y + 44)], fill=C['fl1'])
        d.polygon([(x - 8, y + 14), (x + 8, y + 14), (x + 4 + 3 * f, y + 40), (x - 4, y + 30)], fill=C['fl2'])
        d.polygon([(x - 3, y + 26), (x + 3, y + 26), (x + 1, y + 38)], fill=C['fl3'])
    # pernas e botas (baixinha: pernas curtas)
    d.rectangle([98, 318, 114, 386], fill=C['tight']); d.rectangle([126, 318, 142, 386], fill=C['tight'])
    d.rounded_rectangle([90, 380, 116, 408], 6, fill=C['boot']); d.rounded_rectangle([124, 380, 150, 408], 6, fill=C['boot'])
    d.rectangle([90, 400, 116, 408], fill=C['bootD']); d.rectangle([124, 400, 150, 408], fill=C['bootD'])
    # casaco curto evasê
    coat = [(88, 172), (152, 172), (176, 214), (190, 326), (50, 326), (64, 214)]
    d.polygon(coat, fill=C['coat'])
    d.polygon([(64, 214), (86, 214), (80, 326), (50, 326)], fill=C['coatS']); d.polygon([(154, 214), (176, 214), (190, 326), (160, 326)], fill=C['coatS'])
    d.line([(50, 326), (190, 326)], fill=C['gold'], width=8); d.line([(120, 186), (120, 322)], fill=C['gold'], width=6)
    for y in (206, 240, 274): d.polygon([(130, y - 7), (137, y), (130, y + 7), (123, y)], fill=C['lil']); d.point([(128, y - 2)], fill=C['white'])
    # alça do violão cruzando o peito
    # gola alta dourada
    d.polygon([(92, 164), (148, 164), (156, 186), (84, 186)], fill=C['gold']); d.polygon([(100, 168), (140, 168), (144, 180), (96, 180)], fill=C['goldD'])
    # braços: mangas largas, mãos para trás nos quadris (pose confiante)
    d.polygon([(64, 184), (88, 176), (80, 272), (54, 266)], fill=C['coat']); d.polygon([(152, 176), (176, 184), (186, 266), (160, 272)], fill=C['coat'])
    d.polygon([(54, 252), (80, 258), (80, 272), (54, 266)], fill=C['gold']); d.polygon([(160, 258), (186, 252), (186, 266), (160, 272)], fill=C['gold'])
    d.ellipse([56, 266, 78, 288], fill=C['skin']); d.ellipse([162, 266, 184, 288], fill=C['skin'])
    # pescoço
    d.rectangle([110, 146, 130, 168], fill=C['skinS'])
    # rosto (queixo levemente pontudo)
    d.polygon([(74, 96), (166, 96), (164, 128), (140, 156), (120, 162), (100, 156), (76, 128)], fill=C['skin'])
    d.ellipse([72, 46, 168, 142], fill=C['skin'])
    # mechas laterais que emolduram o rosto
    d.polygon([(66, 70), (86, 80), (84, 170), (74, 196), (62, 150)], fill=C['hair']); d.polygon([(174, 70), (154, 80), (156, 170), (166, 196), (178, 150)], fill=C['hair'])
    d.polygon([(70, 120), (80, 120), (78, 186), (70, 170)], fill=C['hairS']); d.polygon([(160, 120), (170, 120), (170, 170), (162, 186)], fill=C['hairS'])
    # topo da cabeça e franja em mechas pontudas
    d.ellipse([62, 38, 178, 120], fill=C['hair'])
    fr = [(62, 78), (70, 112), (84, 84), (92, 110), (106, 80), (116, 106), (126, 78), (138, 106), (148, 82), (158, 110), (166, 84), (178, 112), (178, 78)]
    d.polygon(fr, fill=C['hair'])
    for (x0, y0, x1, y1) in [(92, 56, 86, 104), (110, 50, 106, 100), (130, 50, 134, 100), (150, 56, 154, 102), (78, 70, 72, 108), (164, 70, 170, 108)]:
        d.line([(x0, y0), (x1, y1)], fill=C['hairS'], width=4)
    d.arc([76, 44, 164, 104], 200, 330, fill=C['hairL'], width=6)
    d.line([(96, 54), (110, 48)], fill=C['hairL'], width=5)
    d.polygon([(84, 84), (92, 110), (88, 100)], fill=C['hairS']); d.polygon([(148, 82), (158, 110), (152, 100)], fill=C['hairS'])
    # presilha: um pequeno lustre dourado de três velinhas (lembrança da forma de lustre)
    d.rectangle([150, 50, 176, 56], fill=C['gold'])
    for x in (152, 161, 170):
        d.rectangle([x, 42, x + 4, 50], fill=C['white']); d.polygon([(x - 1, 42), (x + 5, 42), (x + 2, 32 - 2 * ((x + flick) % 2))], fill=C['fl1'])
    d.polygon([(160, 56), (166, 56), (163, 66)], fill=C['lil'])
    # brincos de cristal
    d.polygon([(74, 132), (80, 140), (74, 152), (68, 140)], fill=C['lil']); d.polygon([(166, 132), (172, 140), (166, 152), (160, 140)], fill=C['lil'])
    # olhos grandes
    for ex in ((98, 142) if face else ()):
        if blink:
            d.arc([ex - 14, 106, ex + 14, 126], 200, 340, fill=C['lash'], width=5); continue
        d.ellipse([ex - 13, 98, ex + 13, 130], fill=C['white'])
        d.ellipse([ex - 11, 100, ex + 11, 130], fill=C['iris']); d.ellipse([ex - 11, 100, ex + 11, 114], fill=C['irisD'])
        d.ellipse([ex - 5, 108, ex + 5, 124], fill=C['pup'])
        d.ellipse([ex - 9, 104, ex - 1, 112], fill=C['white']); d.ellipse([ex + 3, 120, ex + 7, 124], fill=C['white'])
        d.arc([ex - 15, 96, ex + 15, 132], 195, 345, fill=C['lash'], width=5)
    # sobrancelhas
    if face: d.ellipse([78, 128, 94, 136], fill=C['blush']); d.ellipse([146, 128, 162, 136], fill=C['blush'])
    if not face: pass
    elif talk: d.ellipse([112, 138, 128, 152], fill=C['mouth']); d.ellipse([114, 138, 126, 144], fill=C['lash'])
    elif smile: d.arc([108, 132, 132, 148], 20, 160, fill=C['mouth'], width=4)
    return im
def to_rgba(im):
    a = np.array(im); m = ~((a[..., 0] == 255) & (a[..., 1] == 0) & (a[..., 2] == 255)); return a.astype(float), m
if __name__ == '__main__':
    draw().save('/tmp/claude-0/-home-claude/21d632bd-691d-5171-96af-6be176f77e4e/scratchpad/lumeh_hi.png')
