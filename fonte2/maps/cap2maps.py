# Mapas do Cap. 2: gerados e VALIDADOS aqui (larguras, alcance, correntezas sem prender, entidades em chão válido),
# exportados para src/mapas2.js como ROWS2 (tiles) e POS2 (posições nomeadas usadas pelo cap2.js).
import json, collections
def grid(w,h,ch): return [[ch]*w for _ in range(h)]
def R(g,x,y,w,h,ch):
    for j in range(h):
        for i in range(w): g[y+j][x+i]=ch
def S(g): return [''.join(r) for r in g]
M={}; P={}; SOL={}   # SOL: tiles sólidos extras (props) por mapa, só para a validação
# ---------- Cais da Ponte (36x24): fundo de casas (0-7), cais (8-15), rio (16-23) ----------
g=grid(36,24,'.'); R(g,0,0,36,8,'X'); R(g,0,16,36,8,'~'); R(g,18,16,2,6,'p'); R(g,29,0,3,8,',')
M['cais']=S(g)
P['cais']=dict(chegada=[14,11], bazarDoor=[[5,8],[6,8]], ruaPraca=[[29,0],[30,0],[31,0]], jorge=[21,14], ze=[19,21], cacador=[26,10],
  cacPath=[[23,10],[28,10],[28,12],[23,12]], placa=[24,8], bazarOut=[5,9], pracaIn=[30,1], caixas=[[2,13],[3,13],[33,9]], marco=[11,9])
SOL['cais']=[(x,y) for x in range(8,20) for y in (13,14)]+[(2,13),(3,13),(33,9)]
# ---------- Praça do Sino (32x28) ----------
g=grid(32,28,','); R(g,0,0,32,8,'X')
R(g,24,11,8,9,'X')                          # bloco da igreja (o desenho cobre)
R(g,4,22,28,1,'#')                          # mureta da beira-rio
R(g,6,23,26,5,'~'); R(g,26,20,2,3,'=')      # rio e escadaria da igreja descendo para a água
R(g,0,23,6,5,',')                           # ladeira para o cais (canto de baixo à esquerda)
M['praca']=S(g)
P['praca']=dict(caisIn=[2,26], caisDoor=[[1,27],[2,27],[3,27]], tavDoor=[[4,8],[5,8]], tobDoor=[[21,8],[22,8]], guildaDoor=[13,8],
  tavOut=[4,9], tobOut=[21,9], celeste=[15,14], bras=[12,9], pedrinho=[8,18], pavioPoste=[11,11], marco=[2,11],
  cac1=[6,12], cac1Path=[[4,12],[11,12]], cac2=[14,19], cac2Path=[[10,19],[21,19]], escada=[[26,20],[27,20]],
  ruaDoor=[31,27], ruaOut=[30,26], fonte=[5,17], postes=[[10,9],[19,9],[9,20],[20,20]])
SOL['praca']=[(x,y) for x in range(14,18) for y in (12,13)]+[(x,y) for x in range(5,9) for y in (15,16)]+[tuple(p) for p in P['praca']['postes']]
# ---------- interiores ----------
def interior(w,h):
    g=grid(w,h,'o'); R(g,0,0,w,3,'w'); R(g,0,0,1,h,'w'); R(g,w-1,0,1,h,'w'); R(g,0,h-1,w,1,'w'); return g
g=interior(12,10); R(g,4,6,4,2,'r'); g[9][5]='o'; g[9][6]='o'; M['bazar']=S(g)
P['bazar']=dict(door=[[5,9],[6,9]], entra=[5,8], graca=[6,3], balcao=[6,4])
SOL['bazar']=[(x,4) for x in range(3,9)]+[(1,3),(2,3),(9,3),(10,3)]
g=interior(14,10); R(g,5,5,4,3,'r'); g[9][6]='o'; g[9][7]='o'; M['taverna']=S(g)
P['taverna']=dict(door=[[6,9],[7,9]], entra=[6,8], neusa=[3,3], balcao=[3,4], pavio=[10,5], bebum=[2,7], mesa=[[9,6],[10,6]])
SOL['taverna']=[(x,4) for x in range(1,6)]+[(9,6),(10,6),(11,6)]
g=interior(12,10); R(g,1,6,10,3,'~'); R(g,5,6,2,3,'o'); g[9][5]='o'; g[9][6]='o'; M['tobias']=S(g)
P['tobias']=dict(door=[[5,9],[6,9]], entra=[5,8], tobias=[8,4], cama=[2,3])
SOL['tobias']=[(1,3),(2,3),(1,4),(2,4)]
# ---------- Rua Submersa (28x22): ilhas de telhado, água livre e correntezas ----------
g=grid(28,22,'~')
R(g,0,0,28,1,'#'); R(g,0,21,28,1,'#'); R(g,0,0,1,22,'#'); R(g,27,0,1,22,'#')
R(g,1,1,6,4,'.'); R(g,10,2,5,3,'.'); R(g,20,1,6,4,'.'); R(g,2,13,6,5,'.'); R(g,13,9,4,4,'.'); R(g,19,15,7,5,'.')
R(g,8,5,1,8,'#'); R(g,17,4,1,6,'#'); R(g,9,17,9,1,'#'); R(g,18,11,1,6,'#')
for x in range(9,25): g[6][x]='>'; g[7][x]='>'
for y in range(6,12): g[y][25]='v'; g[y][26]='v'
for x in range(19,27): g[12][x]='<'; g[13][x]='<'
M['rua1']=S(g)
P['rua1']=dict(chegada=[3,2], pracaDoor=[1,1], merDoor=[25,19], merOut=[24,18], bau1=[13,2], bau2=[25,1], guarda=[22,2],
  marco=[4,14], marina=[15,10], tenda=[13,10], lambe1=[4,9], lambe2=[12,15], cara1=[11,4], sapo1=[21,17], bau3=[2,17])
SOL['rua1']=[(13,10),(14,10)]
# ---------- Mercado Afundado (24x18) ----------
g=grid(24,18,'~'); R(g,0,0,24,1,'#'); R(g,0,17,24,1,'#'); R(g,0,0,1,18,'#'); R(g,23,0,1,18,'#')
R(g,1,7,5,4,'.'); R(g,8,2,7,4,'.'); R(g,8,12,7,4,'.'); R(g,17,6,5,7,'.'); R(g,6,8,2,2,'.')
for y in range(1,8): g[y][16]='v'
for x in range(15,23): g[16][x]='<' if x<22 else '^'
M['rua2']=S(g)
P['rua2']=dict(chegada=[2,8], ruaDoor=[1,8], pocoDoor=[20,12], marco=[18,7], barco=[13,2], placa=[9,14], anel=[14,15],
  cara=[11,4], lambe1=[4,13], lambe2=[19,3], sapo=[11,13], bau=[21,6], barracas=[[9,2],[12,12]])
SOL['rua2']=[(9,2),(10,2),(12,12),(13,12)]
# ---------- Poço do Sino (16x14) ----------
g=grid(16,14,'_'); R(g,0,0,16,2,'#'); R(g,0,0,1,14,'#'); R(g,15,0,1,14,'#'); R(g,0,13,16,1,'#'); R(g,4,2,8,3,'~'); g[13][7]='_'; g[13][8]='_'
M['poco']=S(g)
P['poco']=dict(chegada=[7,11], door=[[7,13],[8,13]], gatilho=[[5,7],[6,7],[7,7],[8,7],[9,7],[10,7]], ancora=[7,4])

# ---------- validação ----------
SOLID=set('#X wx'); PUSH={'>':(1,0),'<':(-1,0),'v':(0,1),'^':(0,-1)}; WATER=set('~><v^')
def reach(name,start,swim=True):
    rows=M[name]; h=len(rows); w=len(rows[0]); assert all(len(r)==w for r in rows), name+': larguras diferentes'
    sol=set(SOL.get(name,[]))
    def ok(x,y): return 0<=x<w and 0<=y<h and rows[y][x] not in SOLID and (x,y) not in sol and (swim or rows[y][x] not in WATER)
    def settle(x,y):
        seen=set()
        while rows[y][x] in PUSH and (x,y) not in seen:
            seen.add((x,y)); dx,dy=PUSH[rows[y][x]]
            if ok(x+dx,y+dy): x,y=x+dx,y+dy
            else: break
        return x,y
    q=collections.deque([tuple(start)]); vis={tuple(start)}
    while q:
        x,y=q.popleft()
        if rows[y][x] in PUSH and settle(x,y)!=(x,y): continue
        for dx,dy in [(1,0),(-1,0),(0,1),(0,-1)]:
            nx,ny=x+dx,y+dy
            if not ok(nx,ny): continue
            nx,ny=settle(nx,ny)
            if (nx,ny) not in vis: vis.add((nx,ny)); q.append((nx,ny))
    return vis
def adj(v,p): return any((p[0]+dx,p[1]+dy) in v for dx,dy in [(1,0),(-1,0),(0,1),(0,-1)])
def check(name,start,on=[],near=[],swim=True,stuck=True):
    v=reach(name,start,swim)
    for k in on:
        for p in (P[name][k] if isinstance(P[name][k][0],list) else [P[name][k]]):
            assert tuple(p) in v, f'{name}: {k} {p} não alcançável/sobre sólido'
    for k in near:
        p=P[name][k]; assert adj(v,p), f'{name}: ninguém chega perto de {k} {p}'
    if stuck:
        for p in v: assert tuple(start) in reach(name,p,swim), f'{name}: preso em {p}'
    print(name,'ok',len(v))
check('cais',P['cais']['chegada'],on=['bazarDoor','ruaPraca','pracaIn','bazarOut','cacador'],near=['jorge','ze','placa','marco'],swim=False)
check('praca',P['praca']['caisIn'],on=['caisDoor','tavDoor','tobDoor','tavOut','tobOut','escada','cac1','cac2'],near=['celeste','bras','pedrinho','pavioPoste','marco'],swim=False)
check('praca',P['praca']['caisIn'],on=['ruaDoor','ruaOut'],swim=True,stuck=False)
check('bazar',P['bazar']['entra'],on=['door'],near=['balcao'],swim=False)
check('taverna',P['taverna']['entra'],on=['door'],near=['balcao','pavio','bebum'],swim=False)
check('tobias',P['tobias']['entra'],on=['door'],near=['tobias'],swim=False)
check('rua1',P['rua1']['chegada'],on=['pracaDoor','merDoor','merOut','lambe1','lambe2','cara1','sapo1','guarda'],near=['bau1','bau2','marco','marina','bau3'])
check('rua2',P['rua2']['chegada'],on=['ruaDoor','pocoDoor','cara','lambe1','lambe2','sapo'],near=['marco','barco','placa','anel','bau'])
check('poco',P['poco']['chegada'],on=['door','gatilho'],swim=False)
open('/home/claude/rpg2/src/mapas2.js','w').write('// gerado por maps/cap2maps.py (validado: larguras, alcance, correntezas sem prender, entidades em chão válido)\nconst ROWS2 = '+json.dumps(M,ensure_ascii=False)+';\nconst POS2 = '+json.dumps(P,ensure_ascii=False)+';\n')
