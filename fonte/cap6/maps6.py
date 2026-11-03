# Mapas do Capítulo 6. Gera src/maps6.js. Valida caminhos e entidades.
import json, sys
def grid(w, h, fill='#'): return [[fill]*w for _ in range(h)]
def rect(g, x0, y0, x1, y1, c):
    for y in range(y0, y1+1):
        for x in range(x0, x1+1): g[y][x] = c
def put(g, pts, c):
    for x, y in pts: g[y][x] = c
def rows(g): return [''.join(r) for r in g]
M = {}

# ---- 1) PONTO DA PADARIA (hub) 24x16 ----
P = [
"###########..###########",
"#II...................I#",
"#I..######....#######..#",
"#...######....#######..#",
"#...######....#######..#",
"#......................#",
"#..K......,.......K....#",
"........................",
"........................",
"#...UUU..........Q.Q...#",
"#......................#",
"#..,.......I.......,...#",
"#...K..............K...#",
"#......................#",
"#......................#",
"###########..###########"]
M['padaria'] = dict(rows=P,
 exits=[(0,7,'feira',28,7),(0,8,'feira',28,8),(11,0,'escola',12,18),(12,0,'escola',13,18),(23,7,'coreto',1,8),(23,8,'coreto',1,9),(11,15,'pontofinal',10,1,'finalOpen'),(12,15,'pontofinal',11,1,'finalOpen')],
 ents=[dict(id='save_pd',kind='save',x=8,y=10), dict(id='itin6',kind='npc2',x=7,y=9,sp='itin',talk='itin6'),
       dict(id='padeira6',kind='npc2',x=7,y=5,sp='padeira',talk='padeira6'),
       dict(id='dfin1',kind='npc2',x=11,y=14,sp='door_final',talk='portaFinal',hide='finalOpen',glow='rgba(255,255,255,0.18)'),
       dict(id='dfin2',kind='npc2',x=12,y=14,sp='door_final',talk='portaFinal',hide='finalOpen',glow='rgba(255,255,255,0.18)')])

# ---- 2) FEIRA DE SEGUNDA 30x18 ----
F = [
"##############################",
"#AAAA..AAAA..AAAA..AAAA......#",
"#...........................K#",
"#..,.......,..........,......#",
"#AAAA..AAAA..AAAA..AAAA..AAA.#",
"#.......................,....#",
"#K...........................#",
"#..AAA..AAAA..AAAA..AAAA......",
"#.............................",
"#..AAA..AAAA..AAAA..AAAA.....#",
"#............................#",
"#...,..........,.............#",
"#AAAA..AAAA..##.##..AAAA..AAA#",
"#.............#...#..........#",
"#.............#...#..........#",
"#.............#####..........#",
"#............................#",
"##############################"]
M['feira'] = dict(rows=F,
 exits=[(29,7,'padaria',1,7),(29,8,'padaria',1,8)],
 ents=[dict(id='cida6',kind='npc2',x=26,y=9,sp='cida',talk='cida6',float=True,glow='rgba(200,180,255,0.15)'),
       dict(id='ozorio6',kind='npc2',x=3,y=15,sp='tachoW',talk='ozorio6',hide='ozorioDone',glow='rgba(255,180,80,0.15)'),
       dict(id='ozorioH',kind='npc2',x=3,y=15,sp='ozorio',talk='ozorio6',cond='ozorioLembrou'),
       dict(id='papagaio6',kind='npc2',x=5,y=14,sp='papagaio',talk='papagaio6',cond='ozorioPerdido'),
       dict(id='caderno6',kind='npc2',x=16,y=14,sp='caderno',talk='caderno6',hide='cadernoGot',float=True,glow='rgba(255,224,160,0.2)'),
       dict(id='dfe1',kind='npc2',x=15,y=12,sp='door_onibus',talk='tuneDoor',tune='onibus',flag='d_fe1',hide='d_fe1',glow='rgba(255,224,102,0.18)'),
       dict(id='r_canto',kind='rune',x=24,y=10,rune='canto'),
       dict(id='cr_fe1',kind='chest',x=1,y=13,item='frag',n=1),
       dict(id='cr_fe2',kind='chest',x=28,y=1,item='pastel',n=2),
       dict(id='cr_fe3',kind='chest',x=12,y=16,rune='seiva',n=2),
       dict(id='e_fe1',kind='enemy',x=8,y=3,group=['pombo','pombo']),
       dict(id='e_fe2',kind='enemy',x=17,y=5,group=['feirante']),
       dict(id='e_fe3',kind='enemy',x=10,y=10,group=['carrinho','pombo']),
       dict(id='e_fe4',kind='enemy',x=21,y=8,group=['feirante','carrinho']),
       dict(id='e_fe5',kind='enemy',x=8,y=16,group=['pombo','pombo','feirante']),
       dict(id='p_fe1',kind='patrol',x=2,y=11,path=[[2,11],[26,11]],delay=16,range=4,group=['feirante','pombo'],sp='feirante')])

# ---- 3) ESCOLA ESTADUAL 26x20 (gerada por salas) ----
g = grid(26, 20)
rect(g, 1, 1, 24, 4, '.')            # pátio
rect(g, 12, 5, 13, 19, '.')          # corredor central
# seção 3 (y6..8), seção 2 (y10..13), seção 1 (y15..18)
for (y0, y1) in [(6, 8), (10, 13), (15, 18)]:
    rect(g, 1, y0, 10, y1, '.'); rect(g, 15, y0, 24, y1, '.')
# aberturas das salas para o corredor
for (x, y) in [(11,7),(14,7),(11,12),(14,11),(11,17),(14,16)]: g[y][x] = '.'
# carteiras e lousas
for y in (6, 11, 16):
    for x in (2,3,5,6,8,9): g[y][x] = 'S'
    for x in (17,18,20,21,23,24): g[y][x] = 'S'
for x in range(1, 11): g[10][x] = 'B' if x % 3 else '.'   # biblioteca da escola (seção 2, esquerda)
for x in (17,18,19,20): g[1][x] = 'E'
for x in (5,6,7,8): g[1][x] = 'E'
put(g, [(3,2),(22,2)], 'I')
put(g, [(1,18),(24,15)], 'K')
g[19][12] = '.'; g[19][13] = '.'
# banheiro (seção 1, esquerda) com divisórias
for x in (3, 6): g[15][x] = '#'; g[16][x] = '#'
M['escola'] = dict(rows=rows(g),
 exits=[(12,19,'padaria',11,1),(13,19,'padaria',12,1)],
 ents=[dict(id='save_es',kind='save',x=15,y=18) if False else dict(id='d_es1a',kind='npc2',x=12,y=14,sp='classdoor',talk='chamada6',q=1,hide='cham1'),
       dict(id='d_es1b',kind='npc2',x=13,y=14,sp='classdoor',talk='chamada6',q=1,hide='cham1'),
       dict(id='d_es2a',kind='npc2',x=12,y=9,sp='classdoor',talk='chamada6',q=2,hide='cham2'),
       dict(id='d_es2b',kind='npc2',x=13,y=9,sp='classdoor',talk='chamada6',q=2,hide='cham2'),
       dict(id='d_es3a',kind='npc2',x=12,y=5,sp='classdoor',talk='chamada6',q=3,hide='cham3'),
       dict(id='d_es3b',kind='npc2',x=13,y=5,sp='classdoor',talk='chamada6',q=3,hide='cham3'),
       dict(id='duda6',kind='npc2',x=2,y=17,sp='duda',talk='duda6'),
       dict(id='des1',kind='npc2',x=11,y=12,sp='door_pregao',talk='tuneDoor',tune='pregao',flag='d_es1',hide='d_es1',glow='rgba(240,120,48,0.18)'),
       dict(id='diario6',kind='npc2',x=2,y=12,sp='diarioC',talk='diario6',hide='diarioGot',float=True,glow='rgba(120,220,160,0.2)'),
       dict(id='neide6',kind='npc2',x=7,y=3,sp='neide',talk='neide6',float=True,glow='rgba(220,230,255,0.18)'),
       dict(id='sino6',kind='npc2',x=18,y=3,sp='bell',talk='sino6',glow='rgba(122,208,240,0.15)'),
       dict(id='cr_es1',kind='chest',x=24,y=12,rune='bilhete',n=1),
       dict(id='cr_es2',kind='chest',x=24,y=7,item='caldo',n=2),
       dict(id='cr_es3',kind='chest',x=1,y=7,item='cordinha',n=2),
       dict(id='e_es1',kind='enemy',x=19,y=17,group=['lousa']),
       dict(id='e_es2',kind='enemy',x=19,y=12,group=['lousa','saudade']),
       dict(id='e_es3',kind='enemy',x=5,y=8,group=['bedel','lousa']),
       dict(id='e_es4',kind='enemy',x=20,y=8,group=['saudade','saudade']),
       dict(id='p_es1',kind='patrol',x=12,y=18,path=[[12,15],[12,18]],delay=20,range=3,group=['bedel'],sp='bedel')])

# ---- 4) CORETO DA PRAÇA 26x18 ----
C = [
"##########################",
"#I.....I.....,.....I....I#",
"#........................#",
"#..Q..Q...........Q..Q...#",
"#........................#",
"#.......,..........,.....#",
"#I.........CCCCC........I#",
"#..........CCCCC.........#",
"...........CCCCC..........",
"..........................",
"#........................#",
"#..I.................I...#",
"#..Q...Q..........Q...Q..#",
"#........................#",
"#.....,..........,.......#",
"#######..#######.#########",
"#.......#................#",
"##########################"]
M['coreto'] = dict(rows=C,
 exits=[(0,8,'padaria',22,7),(0,9,'padaria',22,8)],
 ents=[dict(id='save_co6',kind='save',x=3,y=9),
       dict(id='maestroE',kind='boss3',x=13,y=4,sp='maestroW',done='maestroDone',script='maestro6',glow='rgba(122,208,240,0.18)'),
       dict(id='valdir6',kind='npc2',x=13,y=9,sp='valdir',talk='valdir6',glow='rgba(150,220,120,0.12)'),
       dict(id='marlene6',kind='npc2',x=4,y=13,sp='marlene',talk='marlene6',hide='marleneGone'),
       dict(id='dco1',kind='npc2',x=16,y=15,sp='door_recreio',talk='tuneDoor',tune='recreio',flag='d_co1',hide='d_co1',glow='rgba(122,208,240,0.18)'),
       dict(id='cr_co1',kind='chest',x=24,y=16,item='frag',n=1),
       dict(id='cr_co2',kind='chest',x=1,y=16,rune='canto',n=2),
       dict(id='cr_co3',kind='chest',x=24,y=2,item='caldo',n=1),
       dict(id='e_co1',kind='enemy',x=6,y=5,group=['musico','pombo']),
       dict(id='e_co2',kind='enemy',x=20,y=5,group=['saudade','musico']),
       dict(id='e_co3',kind='enemy',x=9,y=13,group=['pombo','pombo','saudade']),
       dict(id='e_co4',kind='enemy',x=20,y=13,group=['musico','musico']),
       dict(id='e_co5',kind='enemy',x=12,y=16,group=['saudade','feirante'])])

# ---- 5) PONTO FINAL 22x16 ----
Z = [
"##########..##########",
"#....................#",
"#..,.......,......,..#",
"#....................#",
"#.KK.............KK..#",
"#....................#",
"#.......,......,.....#",
"#....................#",
"#....................#",
"#..,.............,...#",
"#....................#",
"#....................#",
"#...VVVVVVVVVVVVVV...#",
"#...VVVVVVVVVVVVVV...#",
"#....................#",
"######################"]
M['pontofinal'] = dict(rows=Z,
 exits=[(10,0,'padaria',11,13),(11,0,'padaria',12,13)],
 ents=[dict(id='save_pf',kind='save',x=2,y=2),
       dict(id='p32E',kind='boss3',x=11,y=10,sp='p32W',done='p32Done',script='p32',glow='rgba(192,208,232,0.18)'),
       dict(id='fila1',kind='npc2',x=6,y=10,sp='semrosto',talk='fila6'),
       dict(id='fila2',kind='npc2',x=7,y=11,sp='semrosto',talk='fila6'),
       dict(id='fila3',kind='npc2',x=15,y=11,sp='semrosto',talk='fila6'),
       dict(id='fila4',kind='npc2',x=16,y=10,sp='semrosto',talk='fila6'),
       dict(id='cr_pf1',kind='chest',x=20,y=1,item='pastel',n=2),
       dict(id='e_pf1',kind='enemy',x=5,y=6,group=['semrosto']),
       dict(id='e_pf2',kind='enemy',x=16,y=6,group=['semrosto','saudade'])])

# ---------- validação ----------
SOLID = set('#~BcxrTKNPDHJYOMFLQXVWASEIUCR')
def check(name):
    m = M[name]; g = m['rows']; H = len(g); W = len(g[0]); ok = True
    if any(len(r) != W for r in g): print(name, 'larguras', [len(r) for r in g]); return False
    block = {(e['x'], e['y']) for e in m['ents'] if e['kind'] not in ('enemy', 'patrol')}
    gates = {(e['x'], e['y']) for e in m['ents'] if e['kind'] == 'npc2' and e.get('hide')}   # portas que somem
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
    full = flood(ex[0], True)
    for e in ex:
        if e not in full: print(name, 'saída inalcançável', e); ok = False
    for e in m['ents']:
        x, y = e['x'], e['y']
        if g[y][x] not in '.,': print(name, 'entidade em', repr(g[y][x]), e['id']); ok = False
        if e['kind'] in ('enemy', 'patrol'):
            if (x, y) not in full: print(name, 'inimigo inalcançável', e['id']); ok = False
            for a, b in zip(e.get('path', []), e.get('path', [])[1:]):
                for xx in range(min(a[0], b[0]), max(a[0], b[0]) + 1):
                    for yy in range(min(a[1], b[1]), max(a[1], b[1]) + 1):
                        if not pas(xx, yy, True) or (xx, yy) in block: print(name, 'patrulha bloqueada', e['id'], (xx, yy)); ok = False
            continue
        if not any((x+dx, y+dy) in full for dx, dy in ((1,0),(-1,0),(0,1),(0,-1))): print(name, 'entidade inalcançável', e['id']); ok = False
    print(name, 'OK' if ok else 'FALHOU', W, 'x', H)
    return ok
allok = all([check(k) for k in M])
# ---------- saída JS ----------
TH = {'padaria': "TH_PAD", 'feira': "TH_FEI", 'escola': "TH_ESC", 'coreto': "TH_COR", 'pontofinal': "TH_FIN"}
META = {'padaria': ('Ponto da Padaria', 'padaria', 0.3), 'feira': ('Feira de Segunda', 'feira', 0.25), 'escola': ('Escola Estadual', 'escola', 0.35), 'coreto': ('Coreto da Praça', 'coreto', 0.45), 'pontofinal': ('Ponto Final', 'pontofinal', 0.6)}
out = ["// gerado por build/ch6/maps6.py (não editar à mão)",
"const TH_PAD = { floor: '#3a3036', speck: '#443a40', dark: '#2e262c', wall: '#5a4448', mortar: '#2e2226', wallHi: '#7a5a5a' };",
"const TH_FEI = { floor: '#3a3428', speck: '#463e30', dark: '#2e2a20', wall: '#4e4434', mortar: '#2e2a20', wallHi: '#6e604a' };",
"const TH_ESC = { floor: '#34383a', speck: '#3e4244', dark: '#2a2e30', wall: '#4a5a52', mortar: '#2a302c', wallHi: '#6a7a72' };",
"const TH_COR = { floor: '#2e3440', speck: '#383e4a', dark: '#262a34', wall: '#3a4456', mortar: '#22283a', wallHi: '#5a6478' };",
"const TH_FIN = { floor: '#22242c', speck: '#2a2c34', dark: '#1a1c22', wall: '#30323c', mortar: '#1a1c22', wallHi: '#4a4c58' };",
"Object.assign(MAPS, {"]
for k, m in M.items():
    name, mus, dark = META[k]
    exits = [dict(x=e[0], y=e[1], to=e[2], tx=e[3], ty=e[4], **({'cond': e[5]} if len(e) > 5 else {})) for e in m['exits']]
    out.append(f"  {k}: {{ name: {json.dumps(name, ensure_ascii=False)}, music: '{mus}', dark: {dark}, theme: {TH[k]}, rows: {json.dumps(m['rows'])},\n    exits: {json.dumps(exits)},\n    ents: {json.dumps(m['ents'], ensure_ascii=False)} }},")
out.append("});")
open('/home/claude/rpg/src/maps6.js', 'w').write('\n'.join(out) + '\n')
print('JS escrito' if allok else 'JS escrito (COM ERROS)')
