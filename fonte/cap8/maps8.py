# Mapas do Capítulo 8. Gera src/maps8.js. Valida caminhos e entidades.
import json
def grid(w, h, fill='#'): return [[fill]*w for _ in range(h)]
def rect(g, x0, y0, x1, y1, c):
    for y in range(y0, y1+1):
        for x in range(x0, x1+1): g[y][x] = c
def put(g, pts, c):
    for x, y in pts: g[y][x] = c
def rows(g): return [''.join(r) for r in g]
def obst(i, x, y, kind, hide): return dict(id=f'ob_{i}', kind='npc2', x=x, y=y, sp='ob_'+kind, talk='obst8', obst=kind, hide=hide)
def page(n, x, y): return dict(id=f'pg8_{n}', kind='npc2', x=x, y=y, sp='pagina8', talk='pagina8', n=n, hide=f'pg8_{n}', glow='rgba(168,236,255,0.18)')
M = {}
# ---- 1) GARGANTA DA LINHA 24x20 ----
g = grid(24, 20)
rect(g, 11, 0, 12, 1, '.'); rect(g, 7, 2, 15, 4, '.'); rect(g, 11, 5, 11, 5, '.')
rect(g, 5, 6, 17, 8, '.'); rect(g, 5, 9, 5, 10, '.'); rect(g, 16, 9, 16, 10, '.')
rect(g, 2, 11, 8, 13, '.'); rect(g, 13, 11, 19, 13, '.')
rect(g, 6, 14, 6, 14, '.'); rect(g, 14, 14, 14, 14, '.')
rect(g, 4, 15, 18, 18, '.')
put(g, [(6,17),(7,17),(8,17),(9,17),(10,17),(6,18),(7,18),(8,18),(9,18),(10,18)], 'V')
put(g, [(9,4),(3,13),(18,11),(8,7)], 'K'); put(g, [(14,7),(13,3),(17,16)], 'r'); put(g, [(10,7),(15,15)], ',')
M['garganta'] = dict(rows=rows(g), start=(13,17),
 exits=[(11,0,'terminal8',12,16),(12,0,'terminal8',13,16)],
 ents=[dict(id='save_ga',kind='save',x=12,y=16),
       dict(id='onibus8',kind='npc2',x=11,y=17,sp='jorge',talk='onibus8'),
       obst(1, 6, 14, 'escuro', 'ob_g1'), obst(2, 14, 14, 'entulho', 'ob_g2'), obst(3, 11, 5, 'vao', 'ob_g3'),
       page(1, 2, 11),
       dict(id='ch_ga1',kind='chest',x=19,y=13,item='pagina',n=2),
       dict(id='e_ga1',kind='enemy',x=15,y=16,group=['passageiro']),
       dict(id='e_ga2',kind='enemy',x=5,y=12,group=['tinteiro','tinteiro']),
       dict(id='e_ga3',kind='enemy',x=16,y=12,group=['marcador','passageiro']),
       dict(id='e_ga4',kind='enemy',x=11,y=7,group=['passageiro','tinteiro','marcador']),
       dict(id='e_ga5',kind='enemy',x=8,y=3,group=['marcador','marcador'])],
 booms=[dict(tiles=[[x, y]], T=150 + (i % 3) * 20, off=i * 37 % 150, type='bomb') for i, (x, y) in enumerate([(7,7),(12,8),(16,6),(9,16),(15,17),(4,12),(17,12),(10,3),(14,2)])])
# ---- 2) TERMINAL EM RUÍNAS 26x18 ----
g = grid(26, 18)
rect(g, 12, 0, 13, 8, '.'); rect(g, 2, 9, 23, 15, '.'); rect(g, 12, 16, 13, 17, '.')
rect(g, 2, 2, 9, 6, '.'); rect(g, 5, 7, 5, 8, '.'); rect(g, 16, 2, 23, 6, '.'); rect(g, 20, 7, 20, 8, '.')
for x in (5, 6, 7, 18, 19, 20): g[11][x] = 'K'; g[13][x] = 'K'
put(g, [(3,14),(4,14),(5,14),(3,15),(4,15),(5,15)], 'V')
put(g, [(2,2),(9,2),(16,6),(23,2)], 'K'); put(g, [(15,10),(9,15),(22,9)], 'r'); put(g, [(10,10),(16,14)], ',')
M['terminal8'] = dict(rows=rows(g),
 exits=[(12,0,'scriptorium8',11,16),(13,0,'scriptorium8',12,16),(12,17,'garganta',11,1),(13,17,'garganta',12,1)],
 ents=[dict(id='save_te',kind='save',x=10,y=14),
       obst(4, 12, 6, 'fila', 'ob_t1'), obst(5, 13, 6, 'fila', 'ob_t1'), obst(6, 5, 7, 'porta', 'ob_t2'),
       dict(id='r_ceu',kind='rune',x=3,y=3,rune='ceu'),
       page(2, 8, 3),
       dict(id='maren8',kind='npc2',x=21,y=3,sp='maren5',talk='maren8',cond='marenSpared'),
       dict(id='ch_te1',kind='chest',x=22,y=5,item='frag',n=1),
       dict(id='ch_te2',kind='chest',x=17,y=3,item='bala',n=2),
       dict(id='e_te1',kind='enemy',x=9,y=12,group=['fichario']),
       dict(id='e_te2',kind='enemy',x=16,y=12,group=['leitor']),
       dict(id='e_te3',kind='enemy',x=20,y=10,group=['passageiro','leitor']),
       dict(id='e_te4',kind='enemy',x=20,y=8,group=['boca']),
       dict(id='e_te5',kind='enemy',x=12,y=3,group=['fichario','tinteiro','marcador'])])
# ---- 3) SCRIPTORIUM DESABADO 24x18 ----
g = grid(24, 18)
rect(g, 11, 0, 11, 1, '.'); rect(g, 6, 1, 17, 5, '.'); rect(g, 11, 6, 11, 8, '.')
rect(g, 3, 9, 20, 13, '.'); rect(g, 11, 14, 12, 17, '.')
for x in range(3, 21, 3): g[9][x] = 'B'
put(g, [(6,11),(7,11),(15,11),(16,11)], 'K'); put(g, [(9,13),(18,10),(4,12)], 'r'); put(g, [(6,1),(17,1)], 'B')
M['scriptorium8'] = dict(rows=rows(g),
 exits=[(11,0,'biblioteca8',10,14,'escribaDone'),(11,17,'terminal8',12,1),(12,17,'terminal8',13,1)],
 ents=[dict(id='save_sc',kind='save',x=8,y=5),
       obst(7, 11, 7, 'vao', 'ob_s1'),
       page(3, 20, 13),
       dict(id='escribaE',kind='boss3',x=11,y=2,sp='escriba',done='escribaDone',script='escriba8',glow='rgba(168,236,255,0.18)'),
       dict(id='e_sc1',kind='enemy',x=5,y=10,group=['leitor','tinteiro']),
       dict(id='e_sc2',kind='enemy',x=17,y=12,group=['fichario','marcador']),
       dict(id='e_sc3',kind='enemy',x=12,y=10,group=['boca','tinteiro'])])
# ---- 4) BIBLIOTECA AFOGADA 22x16 ----
g = grid(22, 16)
rect(g, 2, 1, 19, 13, '.'); rect(g, 10, 14, 11, 15, '.')
for y in (3, 6, 9):
    for x in list(range(3, 8)) + list(range(14, 19)): g[y][x] = 'B'
put(g, [(2,12),(19,12),(9,4),(12,4)], 'c'); put(g, [(5,11),(16,11)], 'K')
M['biblioteca8'] = dict(rows=rows(g),
 exits=[(10,15,'scriptorium8',11,1),(11,15,'scriptorium8',11,1)],
 ents=[dict(id='save_bi',kind='save',x=10,y=11),
       dict(id='ofelia8',kind='npc2',x=10,y=4,sp='ofelia',talk='ofelia8',float=True),
       dict(id='alcapao8',kind='npc2',x=11,y=1,sp='ob_vao',talk='alcapao8',glow='rgba(168,236,255,0.22)'),
       dict(id='ch_bi1',kind='chest',x=2,y=1,item='pagina',n=2),
       dict(id='e_bi1',kind='enemy',x=4,y=8,group=['tinteiro','fichario']),
       dict(id='e_bi2',kind='enemy',x=17,y=8,group=['leitor','marcador'])])
# ---- 5) O ÍNDICE 20x16 ----
g = grid(20, 16)
rect(g, 3, 1, 16, 13, '.'); rect(g, 2, 3, 17, 11, '.')
for (x, y) in [(4,4),(15,4),(4,10),(15,10),(6,2),(13,2),(6,12),(13,12)]: g[y][x] = 'B'
put(g, [(2,3),(17,3),(2,11),(17,11)], 'B')
M['indice'] = dict(rows=rows(g), start=(9,12), exits=[],
 ents=[dict(id='save_in',kind='save',x=10,y=12),
       dict(id='gavetaBrida',kind='npc2',x=3,y=7,sp='gaveta',talk='brida8',cond='bridaArchived',glow='rgba(255,107,107,0.15)'),
       dict(id='catalogoE',kind='boss3',x=9,y=4,sp='catalogoW',done='catalogoDone',script='catalogo8',glow='rgba(168,236,255,0.25)')])
# ---- 6) A TAMPA 16x12 ----
g = grid(16, 12)
rect(g, 2, 2, 13, 9, '.'); rect(g, 7, 1, 8, 1, '.')
put(g, [(2,2),(13,2)], 'c')
M['tampa'] = dict(rows=rows(g), start=(7,8), exits=[], ents=[dict(id='saida8',kind='npc2',x=7,y=1,sp='ob_vao',talk='saida8',glow='rgba(143,216,255,0.3)')])

# ---------- validação ----------
SOLID = set('#~BcxrTKNPDHJYOMFLQXVWASEIUCRGZ')
def check(name):
    m = M[name]; g = m['rows']; H = len(g); W = len(g[0]); ok = True
    if any(len(r) != W for r in g): print(name, 'larguras', [len(r) for r in g]); return False
    block = {(e['x'], e['y']) for e in m['ents'] if e['kind'] not in ('enemy', 'patrol')}
    gates = {(e['x'], e['y']) for e in m['ents'] if (e['kind'] == 'npc2' and e.get('hide')) or e['kind'] in ('door', 'seal', 'boss3')}
    def pas(x, y, open_gates):
        if not (0 <= x < W and 0 <= y < H) or g[y][x] in SOLID: return False
        if (x, y) in block and not (open_gates and (x, y) in gates): return False
        return True
    def flood(start, open_gates):
        seen = {start}; st = [start]
        while st:
            x, y = st.pop()
            for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
                n = (x+dx, y+dy)
                if n not in seen and pas(*n, open_gates): seen.add(n); st.append(n)
        return seen
    ex = [(e[0], e[1]) for e in m['exits']]
    st0 = m.get('start') or ex[-1]
    full = flood(st0, True)
    for e in ex:
        if e not in full: print(name, 'saída inalcançável', e); ok = False
    for e in m['ents']:
        x, y = e['x'], e['y']
        if g[y][x] not in '.,': print(name, 'entidade em', repr(g[y][x]), e['id']); ok = False
        if e['kind'] in ('enemy', 'patrol'):
            if (x, y) not in full: print(name, 'inimigo inalcançável', e['id']); ok = False
            continue
        if not any((x+dx, y+dy) in full for dx, dy in ((1,0),(-1,0),(0,1),(0,-1))): print(name, 'entidade inalcançável', e['id']); ok = False
    for b in m.get('booms', []):
        for x, y in b['tiles']:
            if g[y][x] not in '.,': print(name, 'pedra em parede', (x, y)); ok = False
    # sem os obstáculos abertos, a saída de cima precisa estar fechada (o obstáculo tem que bloquear de verdade)
    closed = flood(st0, False)
    up = [e for e in m['exits'] if e[1] == 0]
    if name in ('garganta', 'terminal8', 'scriptorium8') and any((e[0], e[1]) in closed for e in up): print(name, 'AVISO: dá para subir sem resolver os obstáculos')
    print(name, 'OK' if ok else 'FALHOU', W, 'x', H)
    return ok
allok = all([check(k) for k in M])
TH = {'garganta': "{ floor: '#3a2a1c', speck: '#463424', dark: '#2e2216', wall: '#2a1c12', mortar: '#1a120a', wallHi: '#5a3a24' }",
      'terminal8': "{ floor: '#3a3428', speck: '#463e30', dark: '#2e2a20', wall: '#4a4030', mortar: '#2a2418', wallHi: '#6a5a40' }",
      'scriptorium8': "{ floor: '#2a2238', speck: '#342a44', dark: '#201a2c', wall: '#3a2e52', mortar: '#1e1830', wallHi: '#5a4a78' }",
      'biblioteca8': "{ floor: '#2e2630', speck: '#382e38', dark: '#231c25', wall: '#43303a', mortar: '#26191f', wallHi: '#5e4450' }",
      'indice': "{ floor: '#16162a', speck: '#1e1e36', dark: '#10101e', wall: '#2a2448', mortar: '#14102a', wallHi: '#4a3a78' }",
      'tampa': "{ floor: '#2b2535', speck: '#342c41', dark: '#211b2b', wall: '#3d3550', mortar: '#1e1828', wallHi: '#5a5070' }"}
META = {'garganta': ('Garganta da Linha', 'garganta8', 0.45), 'terminal8': ('Terminal em Ruínas', 'ruinas8', 0.4), 'scriptorium8': ('Scriptorium Desabado', 'ruinas8', 0.45),
        'biblioteca8': ('Sala de Leitura Afogada', 'biblio8', 0.35), 'indice': ('O Índice', 'indice8', 0.55), 'tampa': ('A Tampa', 'ceu8', 0.2)}
out = ["// gerado por build/ch8/maps8.py (não editar à mão)", "Object.assign(MAPS, {"]
for k, m in M.items():
    name, mus, dark = META[k]
    exits = [dict(x=e[0], y=e[1], to=e[2], tx=e[3], ty=e[4], **({'cond': e[5]} if len(e) > 5 else {})) for e in m['exits']]
    extra = f",\n    booms: {json.dumps(m['booms'])}" if m.get('booms') else ''
    out.append(f"  {k}: {{ name: {json.dumps(name, ensure_ascii=False)}, music: '{mus}', dark: {dark}, theme: {TH[k]}, rows: {json.dumps(m['rows'])},\n    exits: {json.dumps(exits)},\n    ents: {json.dumps(m['ents'], ensure_ascii=False)}{extra} }},")
out.append("});")
open('/home/claude/rpg/src/maps8.js', 'w').write('\n'.join(out) + '\n')
print('JS escrito' if allok else 'JS escrito (COM ERROS)')
for k in M: print(k); print('\n'.join(M[k]['rows']))
