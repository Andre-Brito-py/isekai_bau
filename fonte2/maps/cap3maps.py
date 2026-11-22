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
# ---------- Bairro Baixo de Auren (44x30) — BAIRRO OPERÁRIO ORGÂNICO ----------
# Sobrados estreitos em profundidades diferentes, um quarteirão solto no meio (as ruas contornam), pracinha da feira
# com árvore, varais sobre a rua do canal, canal com mureta em curva, viela com a grade do bueiro.
import math
g=grid(44,30,',')
for x,y,w in [(0,10,5),(6,9,6),(13,8,7),(21,11,8),(30,8,6),(37,10,7)]: R(g,x,0,w,y,'X')
for x,h in [(5,9),(12,8),(20,8),(29,8),(36,8)]: R(g,x,0,1,h,'X')
R(g,24,15,10,4,'X')                                     # quarteirão solto (casas de costas para a viela de cima)
def topo_au(x): return 25+int(round(math.sin(x/6+2)*1.1))
for x in range(44):
    t=topo_au(x); g[t-1][x]='#'
    for y in range(t,30): g[y][x]='~'
R(g,8,13,9,7,';'); R(g,0,17,2,3,'t')                    # pracinha da feira (grama) e a entrada de terra
M['auren']=S(g)
P['auren']=dict(chegada=[1,19], estradaDoor=[[0,18],[0,19]], estradaOut=[1,18], papDoor=[[8,9],[9,9]], papOut=[8,10], marco=[3,13],
  festDoor=[[43,14],[43,15]], festOut=[42,14], tico=[32,9], pavio=[20,11], poeta=[14,20], guarda=[41,13],
  feira=[[9,16],[14,16],[17,12]], cacador=[20,15], cacPath=[[19,14],[22,14],[22,20],[19,20]], bau=[1,23],
  postes=[[5,12],[19,11],[36,12],[11,22],[31,21],[40,20]], arvores=[[12,13],[22,22],[38,17],[3,21]],
  feirante1=[10,17], feirante2=[15,17], feirante3=[18,13], crianca=[13,15], velha=[3,15], lavadeira=[34,22],
  bueiro=[6,22], bueiroTico=[7,22], bueiroOut=[6,21], varais=[[32,21],[16,22]], quarteirao=[[24,19,5],[29,19,5]])
SOL['auren']=[(x,y) for (fx,fy) in P['auren']['feira'] for x in range(fx,fx+3) for y in (fy,)]+[tuple(p) for p in P['auren']['postes']]+[tuple(p) for p in P['auren']['arvores']]
# ---------- Papelaria Pena & Fuligem (12x10) ----------
def interior(w,h):
    g=grid(w,h,'o'); R(g,0,0,w,3,'w'); R(g,0,0,1,h,'w'); R(g,w-1,0,1,h,'w'); R(g,0,h-1,w,1,'w'); return g
g=interior(12,10); R(g,1,6,3,2,'r'); g[9][5]='o'; g[9][6]='o'; M['papelaria']=S(g)
P['papelaria']=dict(door=[[5,9],[6,9]], entra=[5,8], iolanda=[6,3], balcao=[6,4], mesa=[2,5], estante=[9,3])
SOL['papelaria']=[(x,4) for x in range(3,9)]+[(2,5),(3,5)]
# ---------- Avenida do Festival (52x28) — BULEVAR PLANEJADO ----------
# Palacetes simétricos nos dois lados de uma praça recuada com o palco no meio; avenida larga com duas alamedas de
# árvores e postes; barracas na calçada; jardim com balaustrada embaixo. Saída para o Bairro Baixo à esquerda e para o
# Largo do Hospital à direita.
g=grid(52,28,',')
for x,w in [(1,7),(9,7),(35,7),(43,7)]: R(g,x,0,w,7,'X')
for x,w in [(0,1),(8,1),(16,4),(32,3),(42,1),(50,2)]: R(g,x,0,w,6,'X')
R(g,20,0,12,6,'X'); R(g,20,6,12,2,'.')                   # o palco e o tablado na frente
R(g,0,22,52,4,';'); R(g,0,26,52,2,'#')                   # jardim e balaustrada
M['festival']=S(g)
ARV_FE=[[x,10] for x in (2,10,41,49)]+[[x,20] for x in (2,10,18,26,34,42,50)]
POS_FE=[[x,10] for x in (6,14,37,45)]+[[x,20] for x in (6,14,22,30,38,46)]
P['festival']=dict(chegada=[1,15], aurenDoor=[[0,14],[0,15]], aurenOut=[1,14], largoDoor=[[51,14],[51,15]], largoOut=[50,14],
  palco=[26,6], frente=[[24,9],[25,9],[26,9],[27,9]],
  barracas=[[3,13],[8,13],[40,13],[45,13],[5,17],[12,17],[36,17],[44,17]], pastel=[8,13], marco=[4,16],
  povo=[[22,11],[24,12],[28,11],[30,13],[26,14],[19,13],[33,12],[21,15]], fatima=[9,12], vesperP=[26,7],
  arvores=ARV_FE, postes=POS_FE, jardim=[[6,23],[14,23],[22,23],[30,23],[38,23],[46,23]],
  varais=[[10.2,6,14],[10.2,37,45],[20.2,6,14],[20.2,14,22],[20.2,22,30],[20.2,30,38],[20.2,38,46],[7.6,19,32]])
SOL['festival']=[(x+i,y) for x,y in P['festival']['barracas'] for i in range(3)]+[tuple(p) for p in ARV_FE+POS_FE]+[tuple(p) for p in P['festival']['jardim']]
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
A=P['auren']; check('auren',A['chegada'],on=[A['marco'],A['tico'],A['pavio'],A['poeta'],A['guarda'],A['cacador'],A['crianca'],A['velha'],A['lavadeira'],A['feirante1'],A['feirante2'],A['feirante3'],A['papOut'],A['festOut'],A['bueiroTico'],A['bueiroOut']]+A['cacPath']+A['festDoor']+A['estradaDoor'],near=[A['bau'],A['bueiro']])
for x,y in A['papDoor']: assert M['auren'][y][x]==',', 'porta da papelaria'
check('papelaria',P['papelaria']['entra'],on=P['papelaria']['door'],near=[P['papelaria']['iolanda'],P['papelaria']['estante']])
F=P['festival']; check('festival',F['chegada'],on=[F['marco']]+F['frente']+F['povo']+F['aurenDoor']+F['largoDoor'],near=[F['fatima']])
I=P['interior']; check('interior',I['entra'],on=I['saida'],near=[I['vela'],I['meia'],I['estante'],I['forja'],I['cama'],I['parede']])
open('/home/claude/rpg2/src/mapas3.js','w').write('// gerado por maps/cap3maps.py (validado: larguras, alcance, entidades em chão válido)\nconst ROWS3 = '+json.dumps(M,ensure_ascii=False)+';\nconst POS3 = '+json.dumps(P,ensure_ascii=False)+';\n')

# ================= PARTE 2: GALERIAS DE FULIGEM =================
M2={}; P2={}; SOL2={}
# ---------- Galerias 1: túneis (34x22) ----------
g=grid(34,22,'X')
def T_(x,y,w,h,ch=','): R(g,x,y,w,h,ch)
T_(1,1,6,5); T_(3,6,3,8); T_(3,13,12,3); T_(12,8,3,8); T_(12,8,12,3); T_(21,3,3,8); T_(21,3,10,3); T_(28,6,3,12); T_(16,15,15,3); T_(16,15,3,5); T_(8,17,9,3)
T_(5,17,4,3,'_'); T_(24,12,3,2,'~'); T_(1,1,2,2,',')
M2['galerias1']=S(g)
P2['galerias1']=dict(entra=[2,2], subida=[[1,1],[2,1]], marco=[5,2], cinza1=[4,9], rato1=[13,9], cinza2=[22,4], rato2=[29,10], misto=[20,16], bigorna=[6,18], bau=[30,4],
  saida=[[17,19],[18,19]], brasas=[[3,4],[14,14],[22,9],[29,16],[9,18]], pavioT=[25,16])
SOL2['galerias1']=[(6,18)]
# ---------- Galerias 2: o Salão das Lanternas (30x20) ----------
g=grid(30,20,'X'); T_(1,1,28,3,','); T_(13,4,4,14); T_(2,7,26,4); T_(2,14,26,4); T_(13,18,4,2)
T_(6,8,3,2,'~'); T_(21,8,3,2,'~')
M2['galerias2']=S(g)
P2['galerias2']=dict(entra=[14,2], volta=[[14,1],[15,1]], veio=[14,9], marco=[3,2], prat=[[4,7],[9,7],[19,7],[24,7],[4,14],[9,14],[19,14],[24,14]],
  pav1=[5,16], pav2=[22,16], pav3=[10,9], cinza=[25,9], rato=[4,9], misto=[21,15], descida=[[14,19],[15,19]], bau=[27,2])
SOL2['galerias2']=[(14,9),(15,9)]
# ---------- O Coração da Fuligem (sala do chefe, 20x14) ----------
g=grid(20,14,'X'); T_(2,2,16,10); T_(9,0,2,2); T_(3,3,2,2,'_'); T_(15,8,2,2,'_')
M2['fundo']=S(g)
P2['fundo']=dict(entra=[9,1], volta=[[9,0],[10,0]], chefe=[10,5], gatilho=[[8,3],[9,3],[10,3],[11,3]], lanterna=[10,9])
SOL2['fundo']=[]
for k in M2: M[k]=M2[k]; P[k]=P2[k]; SOL[k]=SOL2[k]
G1=P['galerias1']; check('galerias1',G1['entra'],on=[G1['marco'],G1['cinza1'],G1['rato1'],G1['cinza2'],G1['rato2'],G1['misto'],G1['pavioT']]+G1['saida']+G1['subida'],near=[G1['bigorna'],G1['bau']]+G1['brasas'])
G2=P['galerias2']; check('galerias2',G2['entra'],on=[G2['marco'],G2['pav1'],G2['pav2'],G2['pav3'],G2['cinza'],G2['rato'],G2['misto']]+G2['descida']+G2['volta'],near=[G2['veio'],G2['bau']]+G2['prat'])
F3=P['fundo']; check('fundo',F3['entra'],on=F3['gatilho']+F3['volta']+[F3['chefe'],F3['lanterna']])
open('/home/claude/rpg2/src/mapas3.js','w').write('// gerado por maps/cap3maps.py (validado: larguras, alcance, entidades em chão válido)\nconst ROWS3 = '+json.dumps(M,ensure_ascii=False)+';\nconst POS3 = '+json.dumps(P,ensure_ascii=False)+';\n')
