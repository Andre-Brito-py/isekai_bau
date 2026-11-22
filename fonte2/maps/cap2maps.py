# Mapas do Cap. 2: gerados e VALIDADOS aqui (larguras, alcance, correntezas sem prender, entidades em chão válido),
# exportados para src/mapas2.js como ROWS2 (tiles) e POS2 (posições nomeadas usadas pelo cap2.js).
import json, collections
def grid(w,h,ch): return [[ch]*w for _ in range(h)]
def R(g,x,y,w,h,ch):
    for j in range(h):
        for i in range(w): g[y+j][x+i]=ch
def S(g): return [''.join(r) for r in g]
M={}; P={}; SOL={}   # SOL: tiles sólidos extras (props) por mapa, só para a validação
# ---------- Cais da Ponte (48x30) — PORTO (estilo: beira-rio de trabalho) ----------
# Armazéns e lojas em profundidades diferentes, calçada de pedra junto às casas, deque de madeira na beira, três píeres
# de comprimentos diferentes entrando no rio (o do meio é o do Zé, comprido), barraquinhas de feira, caixotes e barris.
import math
g=grid(48,30,',')
CASAS_CA=[('c1',0,9,3),('baz',4,10,7),('c3',13,8,6),('arm',20,7,11),('c5',34,9,5),('c6',40,8,6)]
for _,x,y,w in CASAS_CA: R(g,x,0,w,y,'X')
R(g,11,0,2,6,'X'); R(g,39,0,1,7,'X'); R(g,46,0,2,7,'X'); R(g,3,0,1,9,'X'); R(g,19,0,1,7,'X')   # quintais e muros (árvores cobrem)
R(g,31,0,3,9,',')                                               # ladeira para a praça
def topo_ca(x): return 20+int(round(math.sin(x/6.5+1)*1.1))
for x in range(48):
    t=topo_ca(x)
    for y in range(14,t): g[y][x]='.'                            # deque de madeira
    for y in range(t,30): g[y][x]='~'
for (px,pw,pl) in [(7,2,5),(21,2,8),(35,3,4)]:                 # píeres
    for x in range(px,px+pw):
        for y in range(topo_ca(x),topo_ca(x)+pl): g[y][x]='p'
M['cais']=S(g)
P['cais']=dict(chegada=[17,12], bazarDoor=[[6,10],[7,10]], ruaPraca=[[31,0],[32,0],[33,0]], jorge=[25,15], ze=[22,topo_ca(22)+7], cacador=[30,13],
  cacPath=[[27,13],[37,13],[37,16],[27,16]], placa=[24,7], bazarOut=[6,11], pracaIn=[32,1], marco=[11,12],
  caixas=[[1,13],[2,13],[29,18],[30,18],[44,15]], barris=[[45,10],[46,10],[3,16]], postes=[[10,10],[28,11],[40,17]],
  barracas=[[36,11],[41,13]], bus=[12,14], bau=[46,17], barco=[34,topo_ca(35)+1])
SOL['cais']=[(x,y) for x in range(12,24) for y in (14,15)]+[tuple(c) for c in P['cais']['caixas']+P['cais']['barris']+P['cais']['postes']]+[(x+i,y) for x,y in P['cais']['barracas'] for i in range(3)]
# ---------- Praça do Sino (46x34) — ORGÂNICA (pedido do usuário: "muito retilínea... claustrofobia... parece um beco") ----------
# Fachadas em profundidades diferentes (recuos e becos), largo aberto no meio (torre + fonte), igreja num patamar à
# direita, rio que faz curva embaixo com a mureta acompanhando, ladeira para o cais no canto de baixo à esquerda.
import math
g=grid(46,34,',')
CASAS_PR=[('tav',2,10,7),('gui',12,8,7),('tob',21,11,6),('c4',29,8,6),('c5',37,9,6),('c6',0,19,4)]   # (id, x, linha da porta, largura)
for _,x,y,w in CASAS_PR: R(g,x,0 if y<=12 else y-5,w,y-(0 if y<=12 else y-5),'X')
R(g,9,0,3,6,'X'); R(g,19,0,2,7,'X'); R(g,27,0,2,6,'X'); R(g,35,0,2,5,'X'); R(g,43,0,3,7,'X')   # muros/quintais entre as casas
R(g,33,13,8,9,'X')                                    # bloco da igreja (o desenho cobre)
def topo_rio(x): return 28+int(round(math.sin(x/5.5)*1.2))
for x in range(7,46):
    t=topo_rio(x); g[t-1][x]='#'
    for y in range(t,34): g[y][x]='~'
R(g,0,26,7,8,',')                                     # ladeira para o cais
for y in range(22,topo_rio(35)): g[y][35]='='; g[y][36]='='   # escadaria da igreja descendo para a água
M['praca']=S(g)
P['praca']=dict(caisIn=[2,31], caisDoor=[[1,33],[2,33],[3,33]], tavDoor=[[5,10],[6,10]], tobDoor=[[23,11],[24,11]], guildaDoor=[16,8],
  tavOut=[5,11], tobOut=[23,12], celeste=[17,20], bras=[15,9], pedrinho=[9,24], pavioPoste=[11,12], marco=[3,14],
  cac1=[8,15], cac1Path=[[5,15],[16,15]], cac2=[22,23], cac2Path=[[16,23],[30,23]], escada=[[35,22],[36,22]],
  ruaDoor=[45,33], ruaOut=[44,32], fonte=[7,23], fonteSol=[[x,y] for x in range(7,11) for y in (21,22)], fonteA=[8,23],
  postes=[[10,12],[28,13],[15,24],[29,24]], torre=[16,20], igrejaSinais=[[37,21],[38,21]], igrejaOut=[37,22],
  arvores=[[28,16],[3,23],[42,12],[30,20],[23,25],[7,12]], bau=[44,11], figurinha=[18,8])
SOL['praca']=[(x,y) for x in range(16,20) for y in (18,19)]+[tuple(p) for p in P['praca']['fonteSol']]+[tuple(p) for p in P['praca']['postes']]+[tuple(p) for p in P['praca']['arvores']]
# ---------- interiores ----------
def interior(w,h):
    g=grid(w,h,'o'); R(g,0,0,w,3,'w'); R(g,0,0,1,h,'w'); R(g,w-1,0,1,h,'w'); R(g,0,h-1,w,1,'w'); return g
g=interior(12,10); R(g,4,6,4,2,'r'); g[9][5]='o'; g[9][6]='o'; M['bazar']=S(g)
P['bazar']=dict(door=[[5,9],[6,9]], entra=[5,8], graca=[6,3], balcao=[6,4])
SOL['bazar']=[(x,4) for x in range(3,9)]+[(1,3),(2,3),(9,3),(10,3)]
g=interior(20,13); R(g,6,6,8,5,'r'); g[12][9]='o'; g[12][10]='o'; M['taverna']=S(g)
# balcão (linha 4, x1-6), lareira (x15-17, linha 3), mesas (3 tiles de largura, 1 de altura), banquinhos de cada lado
P['taverna']=dict(door=[[9,12],[10,12]], entra=[9,11], neusa=[3,3], balcao=[3,4], quadro=[11,3], lareira=[15,3],
  mesas=[[2,7],[7,7],[12,7],[2,10],[12,10],[16,7]],
  bebum=[1,7], lia=[5,10], bardo=[14,3], garcom=[7,5], garconete=[11,5], cleide=[6,7], toninho=[11,7], marujo=[1,10], cacadorF=[15,10],
  balcaoFim=[7,4], cozinha=[9,3])
SOL['taverna']=[(x,4) for x in range(1,7)]+[(15,3),(16,3),(17,3)]+[(x+i,y) for x,y in [[2,7],[7,7],[12,7],[2,10],[12,10],[16,7]] for i in range(3)]
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
check('praca',P['praca']['caisIn'],on=['caisDoor','tavDoor','tobDoor','tavOut','tobOut','escada','cac1','cac2','igrejaOut','bau','figurinha','guildaDoor','fonteA'],near=['celeste','bras','pedrinho','pavioPoste','marco'],swim=False)
check('praca',P['praca']['caisIn'],on=['ruaDoor','ruaOut'],swim=True,stuck=False)
check('bazar',P['bazar']['entra'],on=['door'],near=['balcao'],swim=False)
check('taverna',P['taverna']['entra'],on=['door','garcom','garconete','balcaoFim','cozinha','bebum','lia','cleide','toninho','marujo','cacadorF','bardo'],near=['balcao','quadro','lareira'],swim=False)
check('tobias',P['tobias']['entra'],on=['door'],near=['tobias'],swim=False)
check('rua1',P['rua1']['chegada'],on=['pracaDoor','merDoor','merOut','lambe1','lambe2','cara1','sapo1','guarda'],near=['bau1','bau2','marco','marina','bau3'])
check('rua2',P['rua2']['chegada'],on=['ruaDoor','pocoDoor','cara','lambe1','lambe2','sapo'],near=['marco','barco','placa','anel','bau'])
check('poco',P['poco']['chegada'],on=['door','gatilho'],swim=False)
open('/home/claude/rpg2/src/mapas2.js','w').write('// gerado por maps/cap2maps.py (validado: larguras, alcance, correntezas sem prender, entidades em chão válido)\nconst ROWS2 = '+json.dumps(M,ensure_ascii=False)+';\nconst POS2 = '+json.dumps(P,ensure_ascii=False)+';\n')
