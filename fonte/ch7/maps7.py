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
# ---- 1) ANTESSALA DA PORTA 24x16 ----
A = [
"########################",
"######ZZZZZZZZZZZZ######",
"#....ZZZZZZZZZZZZZZ....#",
"#....ZZZZZZZZZZZZZZ....#",
"#......ZZZZZZZZZZ......#",
"#......................#",
"#.VVVVV..........T..T..#",
"#.VVVVV.....,.........K#",
"#......................#",
"#..K.......,.....T..T..#",
"#......................#",
"#...,..........,.......#",
"#..KK.............KK...#",
"#......................#",
"#......................#",
"########################"]
M['antessala7'] = dict(rows=A, start=(12, 13), exits=[],
 ents=[dict(id='save_an',kind='save',x=12,y=12), dict(id='fech32',kind='npc2',x=11,y=5,sp='fechadura',talk='fechadura7',glow='rgba(255,224,102,0.2)'),
       dict(id='onibus7',kind='npc2',x=4,y=8,sp='mancha',talk='onibus7'),
       dict(id='musgo7',kind='npc2',x=15,y=8,sp='musgo',talk='musgo7',glow='rgba(150,220,120,0.15)'),
       dict(id='ozorio7',kind='npc2',x=9,y=10,sp='ozorio',talk='ozorio7',cond='ozorioLembrou'),
       dict(id='rita7',kind='npc2',x=21,y=10,sp='rita',talk='rita7',cond='dateDone'),
       dict(id='marlene7',kind='npc2',x=6,y=12,sp='marlene',talk='marlene7',cond='marleneGone'),
       dict(id='duda7',kind='npc2',x=20,y=13,sp='duda',talk='duda7',cond='dudaMet'),
       dict(id='neide7',kind='npc2',x=16,y=12,sp='neide',talk='neide7',cond='c7_neide',float=True),
       dict(id='cida7',kind='npc2',x=8,y=13,sp='cida',talk='cida7',cond='c7_cida',float=True),
       dict(id='pip7',kind='npc2',x=18,y=5,sp='pip',talk='pip7',cond='aprendizesDone')])

# ---- 2) CAIS DE ÂMBAR 28x18 (gerado) ----
g = grid(28, 18, 'u')  # 'u' = mar de âmbar (o 'G' é o Portão de Musgo do Cap. 1)
rect(g, 13, 0, 14, 16, '.')
for y in (4, 9, 13):
    rect(g, 5, y, 22, y, '.')
    rect(g, 2, y - 1, 4, y + 1, '.'); rect(g, 23, y - 1, 25, y + 1, '.')
rect(g, 9, 14, 18, 16, '.')
rect(g, 15, 6, 16, 7, '.'); rect(g, 11, 10, 12, 11, '.')
for (x, y) in [(5,4),(9,9),(20,13),(17,4)]: g[y][x] = ','
put(g, [(9,16),(18,14)], 'K')
g[0][0] = 'u'
M['cais'] = dict(rows=rows(g),
 exits=[(13,0,'conves',12,16),(14,0,'conves',13,16)],
 ents=[dict(id='volta7',kind='npc2',x=13,y=16,sp='fechadura',talk='volta7',glow='rgba(255,224,102,0.2)'),
       dict(id='cr_kaua',kind='npc2',x=3,y=4,sp='cristal',talk='cristal7',who='kaua',hide='carry_kaua',glow='rgba(240,192,64,0.18)'),
       dict(id='cr_ozorio',kind='npc2',x=24,y=4,sp='cristal',talk='cristal7',who='ozorio',hide='carry_ozorio',cond='c7_ozorioLost',glow='rgba(240,192,64,0.18)'),
       dict(id='cr_cida',kind='npc2',x=3,y=9,sp='cristal',talk='cristal7',who='cida',hide='carry_cida',cond='c7_cidaLost',glow='rgba(240,192,64,0.18)'),
       dict(id='cr_zelia',kind='npc2',x=24,y=9,sp='cristal',talk='cristal7',who='zelia',hide='carry_zelia',glow='rgba(240,192,64,0.18)'),
       dict(id='cr_benedito',kind='npc2',x=3,y=13,sp='cristal',talk='cristal7',who='benedito',hide='carry_benedito',glow='rgba(240,192,64,0.18)'),
       dict(id='cr_neide',kind='npc2',x=24,y=13,sp='cristal',talk='cristal7',who='neide',hide='carry_neide',cond='c7_neideLost',glow='rgba(240,192,64,0.18)'),
       dict(id='r_ambar',kind='rune',x=16,y=6,rune='ambar'),
       dict(id='ch_ca1',kind='chest',x=11,y=11,item='frag',n=1),
       dict(id='ch_ca2',kind='chest',x=16,y=15,item='bala',n=2),
       dict(id='e_ca1',kind='enemy',x=13,y=11,group=['peixe','peixe']),
       dict(id='e_ca2',kind='enemy',x=8,y=4,group=['gaivota','gaivota']),
       dict(id='e_ca3',kind='enemy',x=19,y=9,group=['ladrao']),
       dict(id='e_ca4',kind='enemy',x=8,y=13,group=['peixe','gaivota','ladrao']),
       dict(id='e_ca5',kind='enemy',x=19,y=4,group=['marujo'])])

# ---- 3) CONVÉS DA BARCA 26x18 ----
V = [
"##########################",
"#########........#########",
"#########........#########",
"####.................#####",
"###...................####",
"##.....##.......##.....###",
"#......##.......##......##",
"#.......................K#",
"#..K....,.........,......#",
"#........................#",
"#.....##.........##......#",
"#.....##.........##......#",
"#........................#",
"#..,....................##",
"##......................##",
"###....................###",
"####.........,.......#####",
"########............######"]
M['conves'] = dict(rows=V, start=(12,16),
 exits=[(12,17,'cais',13,1),(13,17,'cais',14,1),(20,12,'porao',4,2,'timoneiroDone')],
 ents=[dict(id='save_cv',kind='save',x=4,y=14),
       dict(id='timoneiroE',kind='boss3',x=12,y=2,sp='timoneiroW',done='timoneiroDone',script='timoneiro7',glow='rgba(240,192,64,0.18)'),
       dict(id='d_esc',kind='door',x=20,y=12,cond='timoneiroDone',dark=True,msg='escotilha7'),
       dict(id='cr_priscila',kind='npc2',x=2,y=7,sp='cristal',talk='cristal7',who='priscila',hide='carry_priscila',glow='rgba(240,192,64,0.18)'),
       dict(id='cr_teo',kind='npc2',x=23,y=9,sp='cristal',talk='cristal7',who='teo',hide='carry_teo',glow='rgba(240,192,64,0.18)'),
       dict(id='ch_cv1',kind='chest',x=23,y=13,item='agua',n=2),
       dict(id='e_cv1',kind='enemy',x=6,y=9,group=['marujo','marujo']),
       dict(id='e_cv2',kind='enemy',x=19,y=8,group=['ancoraviva']),
       dict(id='e_cv3',kind='enemy',x=12,y=12,group=['marujo','ladrao']),
       dict(id='e_cv4',kind='enemy',x=12,y=5,group=['gaivota','gaivota','marujo'])])

# ---- 4) PORÃO DA BARCA 26x18 ----
H = [
"##########################",
"#........#...............#",
"#........#...............#",
"#..KK....#..K....KK......#",
"#........................#",
"#........#...............#",
"#####.####...............#",
"#........#..K.......K....#",
"#........#...............#",
"#........#######.#########",
"#........................#",
"#..K.....................#",
"#........................#",
"#######.#####.#####.######",
"#.....#.#.........#......#",
"#.....#.#.........#......#",
"#.......#.........#......#",
"##########################"]
M['porao'] = dict(rows=H, start=(4,2),
 exits=[(13,16,'cela',10,12)],
 ents=[dict(id='volta_cv',kind='npc2',x=4,y=1,sp='fechadura',talk='subir7'),
       dict(id='manif7',kind='npc2',x=7,y=1,sp='manifesto',talk='manifesto7',float=True,glow='rgba(240,192,64,0.15)'),
       dict(id='r_chave',kind='rune',x=22,y=2,rune='chave'),
       dict(id='cr_luzia',kind='npc2',x=1,y=8,sp='cristal',talk='cristal7',who='luzia',hide='carry_luzia',glow='rgba(240,192,64,0.18)'),
       dict(id='cr_rafael',kind='npc2',x=24,y=7,sp='cristal',talk='cristal7',who='rafael',hide='carry_rafael',glow='rgba(240,192,64,0.18)'),
       dict(id='cr_nilo',kind='npc2',x=1,y=12,sp='cristal',talk='cristal7',who='nilo',hide='carry_nilo',glow='rgba(240,192,64,0.18)'),
       dict(id='s_cabine',kind='seal',x=7,y=13,flag='s_cabine',need={'form':'chave'},look='cabin'),
       dict(id='capitaoE',kind='boss3',x=3,y=15,sp='capitaoW',done='capitaoDone',script='capitao7',glow='rgba(255,80,80,0.15)'),
       dict(id='ch_po1',kind='chest',x=5,y=14,item='frag',n=1),
       dict(id='ch_po2',kind='chest',x=24,y=1,item='bala',n=2),
       dict(id='e_po1',kind='enemy',x=4,y=4,group=['lacaio']),
       dict(id='e_po2',kind='enemy',x=14,y=4,group=['afogado']),
       dict(id='e_po3',kind='enemy',x=5,y=10,group=['lacaio','ladrao']),
       dict(id='e_po4',kind='enemy',x=20,y=11,group=['ancoraviva','marujo']),
       dict(id='e_po5',kind='enemy',x=22,y=15,group=['afogado','lacaio'])])

# ---- 5) CELA DO SELO 20x14 ----
S = [
"####################",
"########....########",
"#####..........#####",
"####............####",
"###..............###",
"##................##",
"##.......,........##",
"##................##",
"###..............###",
"####............####",
"#####..........#####",
"######........######",
"######........######",
"#########..#########"]
M['cela'] = dict(rows=S,
 exits=[(9,13,'porao',13,15),(10,13,'porao',13,15)],
 ents=[dict(id='save_ce',kind='save',x=7,y=11),
       dict(id='lacreE',kind='boss3',x=9,y=3,sp='lacreW',done='lacreDone',script='lacre7',glow='rgba(255,80,80,0.18)'),
       dict(id='moca7',kind='npc2',x=10,y=1,sp='moca',talk='moca7',cond='lacreDone',float=True,glow='rgba(255,224,160,0.25)')])

# ---------- validação ----------
SOLID = set('#~BcxrTKNPDHJYOMFLQXVWASEIUCRGZ')
def check(name):
    m = M[name]; g = m['rows']; H = len(g); W = len(g[0]); ok = True
    if any(len(r) != W for r in g): print(name, 'larguras', [len(r) for r in g]); return False
    block = {(e['x'], e['y']) for e in m['ents'] if e['kind'] not in ('enemy', 'patrol')}
    gates = {(e['x'], e['y']) for e in m['ents'] if (e['kind'] == 'npc2' and e.get('hide')) or e['kind'] in ('door', 'seal')}   # portas que somem
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
    full = flood(ex[0] if ex else m['start'], True)
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
TH = {'antessala7': 'TH_ANT', 'cais': 'TH_CAI', 'conves': 'TH_CON', 'porao': 'TH_POR', 'cela': 'TH_CEL'}
META = {'antessala7': ('Antessala da Porta', 'antessala', 0.4), 'cais': ('Cais de Âmbar', 'ambar', 0.3), 'conves': ('Convés da Barca', 'barca', 0.35), 'porao': ('Porão da Barca', 'barca', 0.55), 'cela': ('Cela do Selo', 'cela', 0.5)}
out = ["// gerado por build/ch7/maps7.py (não editar à mão)",
"const TH_ANT = { floor: '#36302a', speck: '#403a32', dark: '#2a2620', wall: '#4e4640', mortar: '#2a2420', wallHi: '#6e6458' };",
"const TH_CAI = { floor: '#5a3a24', speck: '#6a4a2e', dark: '#4a2e1c', wall: '#3a2414', mortar: '#2a1a0e', wallHi: '#7a5a3a' };",
"const TH_CON = { floor: '#5a3a24', speck: '#6a4a2e', dark: '#4a2e1c', wall: '#3a2414', mortar: '#2a1a0e', wallHi: '#7a5a3a' };",
"const TH_POR = { floor: '#3a2a1c', speck: '#463424', dark: '#2e2216', wall: '#2a1c12', mortar: '#1a120a', wallHi: '#4a3a2a' };",
"const TH_CEL = { floor: '#3a1c1e', speck: '#462426', dark: '#2e1618', wall: '#4a1a1e', mortar: '#2a0e10', wallHi: '#6a2a2e' };",
"Object.assign(MAPS, {"]
for k, m in M.items():
    name, mus, dark = META[k]
    exits = [dict(x=e[0], y=e[1], to=e[2], tx=e[3], ty=e[4], **({'cond': e[5]} if len(e) > 5 else {})) for e in m['exits']]
    out.append(f"  {k}: {{ name: {json.dumps(name, ensure_ascii=False)}, music: '{mus}', dark: {dark}, theme: {TH[k]}, rows: {json.dumps(m['rows'])},\n    exits: {json.dumps(exits)},\n    ents: {json.dumps(m['ents'], ensure_ascii=False)} }},")
out.append("});")
open('/home/claude/rpg/src/maps7.js', 'w').write('\n'.join(out) + '\n')
print('JS escrito' if allok else 'JS escrito (COM ERROS)')
