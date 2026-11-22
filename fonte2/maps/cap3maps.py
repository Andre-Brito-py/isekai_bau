# Mapas do Cap. 3 (Parte 1): Estrada dos Lampiões, Bairro Baixo de Auren, Papelaria, Avenida do Festival e o
# INTERIOR DO BAÚ (a base). Gerados e VALIDADOS aqui; exportados para src/mapas3.js como ROWS3 e POS3.
# Tiles novos: 't' terra (caminho), 'T' mata (sólido), além dos do Cap. 2 (';' grama, ',' pedra, '.' tábua, '~' água,
# '#' muro, 'X' sólido, 'o' piso, 'w' parede, 'r' tapete).
import json, collections
def grid(w,h,ch): return [[ch]*w for _ in range(h)]
def R(g,x,y,w,h,ch):
    for j in range(h):
        for i in range(w): g[y+j][x+i]=ch
def S(g): return [''.join(r) for r in g]
M={}; P={}; SOL={}
SOLID=set('#XTw'); WATER=set('~')
# ---------- Estrada dos Lampiões (40x20) ----------
g=grid(40,20,';')
R(g,0,0,40,2,'T'); R(g,0,18,40,2,'T'); R(g,0,0,1,20,'T'); R(g,39,0,1,20,'T')
R(g,0,9,13,2,'t'); R(g,11,5,2,6,'t'); R(g,11,5,14,2,'t'); R(g,23,5,2,8,'t'); R(g,23,11,17,2,'t')
R(g,4,3,4,3,'T'); R(g,15,12,5,4,'T'); R(g,29,2,6,3,'T'); R(g,7,14,6,3,'T'); R(g,30,15,5,2,'~'); R(g,26,7,2,2,'T')
g[9][0]='t'; g[10][0]='t'; g[11][39]='t'; g[12][39]='t'
M['estrada']=S(g)
P['estrada']=dict(chegada=[2,10], onibus=[1,8], jorge=[6,11], marco=[14,7], postes=[[8,11],[15,4],[21,4],[27,10],[34,10]],
  mar1=[9,4], mar2=[19,8], mar3=[27,14], band=[33,7], rainha=[36,11], bau1=[3,16], bau2=[37,3], saida=[[39,11],[39,12]], trava=[35,11],
  arvores=[[3,6],[10,15],[20,3],[33,15],[37,6],[17,10],[26,16]])
SOL['estrada']=[tuple(p) for p in P['estrada']['postes']]+[tuple(p) for p in P['estrada']['arvores']]+[(x,y) for x in range(1,12) for y in (7,8)]+[(36,10)]
# ---------- Bairro Baixo de Auren (36x24) ----------
g=grid(36,24,','); R(g,0,0,36,8,'X'); R(g,0,20,36,1,'#'); R(g,0,21,36,3,'~')
R(g,0,14,4,4,'t'); R(g,12,11,5,3,';'); R(g,24,14,6,3,';')
g[12][35]=','; g[13][35]=','
M['auren']=S(g)
P['auren']=dict(chegada=[1,16], estradaDoor=[[0,15],[0,16]], estradaOut=[1,15], papDoor=[[8,8],[9,8]], papOut=[8,9], marco=[4,11],
  festDoor=[[35,12],[35,13]], festOut=[34,12], tico=[29,9], pavio=[20,10], iolandaF=[7,9], poeta=[14,15], guarda=[33,11],
  feira=[[11,16],[17,16],[23,10]], cacador=[22,13], cacPath=[[19,13],[27,13],[27,17],[19,17]], bau=[1,19], chamine=[30,8],
  postes=[[6,10],[16,10],[26,10],[11,19],[25,19]], arvores=[[13,13],[27,16]],
  feirante1=[12,17], feirante2=[18,17], feirante3=[24,11], crianca=[15,12], velha=[3,13], lavadeira=[30,19])
SOL['auren']=[(x,y) for (fx,fy) in P['auren']['feira'] for x in range(fx,fx+3) for y in (fy,)]+[tuple(p) for p in P['auren']['postes']]+[tuple(p) for p in P['auren']['arvores']]
# ---------- Papelaria Pena & Fuligem (12x10) ----------
def interior(w,h):
    g=grid(w,h,'o'); R(g,0,0,w,3,'w'); R(g,0,0,1,h,'w'); R(g,w-1,0,1,h,'w'); R(g,0,h-1,w,1,'w'); return g
g=interior(12,10); R(g,1,6,3,2,'r'); g[9][5]='o'; g[9][6]='o'; M['papelaria']=S(g)
P['papelaria']=dict(door=[[5,9],[6,9]], entra=[5,8], iolanda=[6,3], balcao=[6,4], mesa=[2,5], estante=[9,3])
SOL['papelaria']=[(x,4) for x in range(3,9)]+[(2,5),(3,5)]
# ---------- Avenida do Festival (40x22) ----------
g=grid(40,22,','); R(g,0,0,40,6,'X'); R(g,0,20,40,2,'#'); R(g,0,6,40,1,'.'); R(g,14,6,12,2,'.')
g[10][0]=','; g[11][0]=','
M['festival']=S(g)
P['festival']=dict(chegada=[1,10], aurenDoor=[[0,10],[0,11]], aurenOut=[1,11], palco=[20,5], frente=[[18,8],[19,8],[20,8],[21,8]],
  barracas=[[4,9],[9,9],[28,9],[33,9],[4,16],[11,16],[26,16],[33,16]], pastel=[9,9], marco=[2,14],
  povo=[[15,12],[17,13],[23,12],[25,14],[20,15],[8,13],[31,13],[36,12]], fatima=[10,8], vesperP=[20,6])
SOL['festival']=[(x+i,y) for x,y in P['festival']['barracas'] for i in range(3)]
# ---------- Interior do Baú (a base) (14x10) ----------
g=interior(14,10); R(g,5,5,4,3,'r'); g[9][6]='o'; g[9][7]='o'; M['interior']=S(g)
P['interior']=dict(saida=[[6,9],[7,9]], entra=[6,8], vela=[3,3], meia=[10,3], estante=[6,3], cama=[1,6], forja=[11,7], parede=[8,3])
SOL['interior']=[(1,6),(1,7),(2,6),(2,7),(11,7),(12,7)]

def reach(name,start,swim=False):
    rows=M[name]; h=len(rows); w=len(rows[0]); sol=set(SOL.get(name,[]))
    def ok(x,y): return 0<=x<w and 0<=y<h and rows[y][x] not in SOLID and (x,y) not in sol and (swim or rows[y][x] not in WATER)
    v=set([tuple(start)]); q=collections.deque([tuple(start)])
    while q:
        x,y=q.popleft()
        for dx,dy in [(1,0),(-1,0),(0,1),(0,-1)]:
            n=(x+dx,y+dy)
            if n not in v and ok(*n): v.add(n); q.append(n)
    return v
def adj(v,p): return any((p[0]+dx,p[1]+dy) in v for dx,dy in [(0,0),(1,0),(-1,0),(0,1),(0,-1)])
def check(name,start,on=[],near=[]):
    rows=M[name]; assert all(len(r)==len(rows[0]) for r in rows), name+': largura'
    v=reach(name,start)
    for p in on: assert tuple(p) in v, f'{name}: {p} fora do alcance'
    for p in near: assert adj(v,p), f'{name}: {p} sem acesso'
    print(name,'ok',len(v),'tiles')
E=P['estrada']; check('estrada',E['chegada'],on=[E['marco'],E['mar1'],E['mar2'],E['mar3'],E['band'],E['rainha'],E['trava'],E['jorge']]+E['saida'],near=[E['bau1'],E['bau2']]+E['postes'])
A=P['auren']; check('auren',A['chegada'],on=[A['marco'],A['tico'],A['pavio'],A['poeta'],A['guarda'],A['cacador'],A['crianca'],A['velha'],A['lavadeira'],A['feirante1'],A['feirante2'],A['feirante3'],A['papOut'],A['festOut']]+A['cacPath']+A['festDoor']+A['estradaDoor'],near=[A['bau']])
for x,y in A['papDoor']: assert M['auren'][y][x]==',', 'porta da papelaria'
check('papelaria',P['papelaria']['entra'],on=P['papelaria']['door'],near=[P['papelaria']['iolanda'],P['papelaria']['estante']])
F=P['festival']; check('festival',F['chegada'],on=[F['marco']]+F['frente']+F['povo']+F['aurenDoor'],near=[F['fatima']])
I=P['interior']; check('interior',I['entra'],on=I['saida'],near=[I['vela'],I['meia'],I['estante'],I['forja'],I['cama'],I['parede']])
open('/home/claude/rpg2/src/mapas3.js','w').write('// gerado por maps/cap3maps.py (validado: larguras, alcance, entidades em chão válido)\nconst ROWS3 = '+json.dumps(M,ensure_ascii=False)+';\nconst POS3 = '+json.dumps(P,ensure_ascii=False)+';\n')
