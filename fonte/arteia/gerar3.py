# Chefes (artes do usuário): chefes1.png e chefes2.png -> src/arte_ia3.js
import sys, os, json, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); os.chdir(os.path.dirname(os.path.abspath(__file__)))
from ext import *
# id do inimigo: (folha, faixa y, espelhar?, altura, quadros {idle:[..], atk, hurt, p2, dead})
B = {
 'boss':    ('chefes1.png', (17, 172), False, 100, dict(idle=[0, 1], atk=3, hurt=4, p2=5, dead=6)),
 'octo':    ('chefes1.png', (181, 312), True, 92, dict(idle=[0, 1], atk=3, hurt=4, p2=5, dead=6)),
 'brida':   ('chefes1.png', (323, 466), True, 84, dict(idle=[0, 1], atk=3, hurt=5, p2=1, dead=6)),
 'jailer':  ('chefes1.png', (474, 628), False, 100, dict(idle=[0, 1], atk=3, hurt=4, p2=5, dead=6)),
 'knight':  ('chefes1.png', (639, 806), False, 100, dict(idle=[0, 1], atk=3, hurt=4, p2=5, dead=6)),
 'maren':   ('chefes1.png', (816, 999), True, 100, dict(idle=[0, 1], atk=3, hurt=4, p2=5, dead=6)),
 'clara':   ('chefes2.png', (13, 163), True, 96, dict(idle=[0, 1], atk=3, hurt=4, p2=5, dead=6)),
 'maren5':  ('chefes2.png', (170, 311), True, 96, dict(idle=[0, 1], atk=3, hurt=4, p2=5, dead=6)),
 'fiscal':  ('chefes2.png', (321, 452), False, 92, dict(idle=[0, 1], atk=3, hurt=4, p2=5, dead=6)),
 'jorge':   ('chefes2.png', (460, 579), True, 92, dict(idle=[1, 2], atk=3, hurt=5, p2=4, dead=6)),
 'tacho':   ('chefes2.png', (585, 722), True, 96, dict(idle=[0, 1], atk=3, hurt=4, p2=5, dead=6)),
 'maestro': ('chefes2.png', (722, 859), True, 96, dict(idle=[0, 1], atk=3, hurt=4, p2=5, dead=6)),
 'p32':     ('chefes2.png', (865, 1004), True, 96, dict(idle=[0, 1], atk=2, hurt=5, p2=3, dead=6)),
 'carro':   ('chefes3.png', (14, 162), True, 88, dict(idle=[0, 1], atk=3, hurt=4, p2=5, dead=6)),
 'timoneiro': ('chefes3.png', (180, 312), True, 96, dict(idle=[0, 1], atk=3, hurt=4, p2=5, dead=6)),
 'capitao': ('chefes3.png', (328, 471), True, 96, dict(idle=[0, 1], atk=3, hurt=4, p2=5, dead=6)),
 'lacre':   ('chefes3.png', (480, 620), True, 96, dict(idle=[0, 1], atk=3, hurt=4, p2=5, dead=6)),
 'escriba8': ('chefes3.png', (633, 813), False, 100, dict(idle=[0, 1], atk=2, hurt=4, p2=5, dead=6)),
 'catalogo': ('chefes3.png', (815, 991), False, 100, dict(idle=[0, 1], atk=2, hurt=4, p2=3, p3=5, dead=6)),
}
cache = {}
OUT = {}
for k, (fn, (y0, y1), flip, H, M) in B.items():
    if fn not in cache: cache[fn] = load(fn)
    src, fg = cache[fn]
    cols = [(int(10 + i * (1335 / 7)), y0, int(10 + (i + 1) * (1335 / 7)), y1) for i in range(7)]
    fr = {}
    base_h = None
    for i in range(7):
        a = extract(src, fg, cols[i], 1, H=H if i != 6 else None, largest=True, colors=28) if i != 6 else None
        fr[i] = a
    # o quadro de derrota usa a mesma escala do quadro parado
    scale = (cols[0][3] - cols[0][1])
    hA = fg[y0:y1, cols[0][0]:cols[0][2]].any(1).sum()
    fr[6] = extract(src, fg, cols[6], hA / H, largest=True, colors=28)
    if k == 'jorge':  # o letreiro '31' do ônibus não pode sair espelhado
        for i, a in fr.items():
            h, w = a.shape[:2]; r = a[:int(h * 0.32), int(w * 0.4):]
            m = (r[..., 3] > 0) & (r[..., 0].astype(int) > 170) & (r[..., 1].astype(int) > 110) & (r[..., 2].astype(int) < 140)
            from scipy import ndimage as _nd
            lab, n = _nd.label(_nd.binary_dilation(m, iterations=2))
            if not n: continue
            best = max(range(1, n + 1), key=lambda j: (m & (lab == j)).sum())
            ys, xs = np.nonzero(m & (lab == best))
            for j in range(1, n + 1):  # junta os dígitos vizinhos (o '3' e o '1' às vezes saem separados)
                yj, xj = np.nonzero(m & (lab == j))
                if j != best and len(xj) >= 3 and xj.min() < xs.max() + 14 and xj.max() > xs.min() - 14 and yj.max() >= ys.min() - 4 and yj.min() <= ys.max() + 4: ys, xs = np.r_[ys, yj], np.r_[xs, xj]
            if len(xs) < 6: continue
            ya, yb, xa, xb = ys.min() - 1, ys.max() + 2, xs.min() - 1, xs.max() + 2
            r[ya:yb, xa:xb] = r[ya:yb, xa:xb][:, ::-1].copy()
    if flip: fr = {i: a[:, ::-1].copy() for i, a in fr.items()}
    allf = same_h([fr[i] for i in range(7)])
    E = lambda i: enc_png(allf[i])
    OUT[k] = {'idle': [E(i) for i in M['idle']], 'atk': [E(M['atk'])], 'hurt': [E(M['hurt'])], 'p2': [E(M['p2'])], 'dead': [E(M['dead'])], **({'p3': [E(M['p3'])]} if 'p3' in M else {})}
    print(k, allf[0].shape)
js = '// gerado por build/arteia/gerar3.py a partir das artes enviadas pelo usuário (não editar à mão)\nconst ARTE_IA3 = ' + json.dumps(OUT, separators=(',', ':')) + ';\n'
open('/home/claude/rpg/src/arte_ia3.js', 'w').write(js); print('ok', len(js) // 1024, 'KB')
