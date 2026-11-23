# Mapas do Cap. 9 (A SUBIDA DO MORRO): o SOPÉ (o acampamento dos aliados, a cancela da Guarda), a ENCOSTA (seis
# patamares em zigue-zague; VENTANIA: o vento do morro empurra para o SUL, para a beira; quem não estiver abrigado
# atrás de uma pedra, ou encostado numa mureta, escorrega e CAI no patamar de baixo), a CRISTA (o Jardim das Lentes:
# feixe de luar, espelhos, a Porta das Lentes) e o PÁTIO DO FAROL (o Faroleiro).
# Tiles: 'n' neve, 'c' trilha, 'l' laje, 'e' degrau (rampa, o vento não pega), 'R' rocha, 'r' chão de rocha,
# ' ' abismo (a beira), 'N' neve sólida (base de objeto), 'i' gelo.
# Validação: larguras; alcance; na encosta, cada patamar tem abrigo a cada <= 9 passos (dá para atravessar entre duas
# rajadas) e toda queda cai em chão; na crista, o feixe tem solução com 3 espelhos e não tem sem espelho.
import json, collections
def grid(w,h,ch): return [[ch]*w for _ in range(h)]
def R(g,x,y,w,h,ch):
    for j in range(h):
        for i in range(w): g[y+j][x+i]=ch
def S(g): return [''.join(r) for r in g]
M={}; P={}
SOLID=set('RN# X')
def reach(name,start,extra_solid=set(),passa=set()):
    rows=M[name]; h=len(rows); w=len(rows[0])
    def ok(x,y): return 0<=x<w and 0<=y<h and ((rows[y][x] not in SOLID and (x,y) not in extra_solid) or (x,y) in passa)
    v={tuple(start)}; q=collections.deque([tuple(start)])
    while q:
        x,y=q.popleft()
        for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)):
            n=(x+dx,y+dy)
            if n not in v and ok(*n): v.add(n); q.append(n)
    return v

# ---------- O Sopé do Morro (48x32): o acampamento do cerco ----------
g=grid(48,32,'n')
R(g,0,0,48,3,'R')
for x in range(48):                                   # a encosta subindo atrás
    h=3+round(2.2*abs(((x-23.5)/23.5))**1.4*3)
    for y in range(3,min(h,12)): g[y][x]='R'
for y in range(0,12): g[y][23]=g[y][24]='c'           # a trilha da cancela
for x in range(0,26): g[27][x]=g[28][x]='c'           # a estrada da Cidade Alta (entra pela esquerda)
for y in range(12,28): g[y][23]=g[y][24]='c'
for x in range(24,44): g[20][x]='c'                   # o caminho das barracas da Guilda
R(g,0,31,48,1,'R');
for y in range(12,31): g[y][47]='R'
for y in range(13,27): g[y][0]='R'
M['sope9']=S(g)
P['sope9']=dict(entra=[1,27], saida=[[0,27],[0,28]], cancela=[[23,8],[24,8]], acima=[[23,0],[24,0]], cancelaGuarda=[[22,9],[25,9]],
  fogueira=[18,21], tenda=[6,17], dalva=[9,20], guilda=[[32,16],[38,16]], bras=[30,19], iolanda=[14,14], mesa=[13,13], tico=[40,12], dito=[42,12],
  chamine=[41,9], marco=[5,25], fila=[[27,12],[28,11],[29,10],[30,9]], pinheiros=[[3,5],[7,7],[41,6],[45,5],[2,14],[44,26],[37,29],[14,30],[30,29]],
  tiago=[24,12], bau=[46,24])

# ---------- A Encosta (40x64): seis patamares em zigue-zague ----------
W,H=40,64
g=grid(W,H,'R')
PAT=[]   # (y0, ent_x, sai_x)   cada patamar: 5 linhas de chão; 2 de beira (abismo) embaixo; o resto é paredão
ys=[54,44,34,23,13,3]
for k,y0 in enumerate(ys):
    alto=7 if k==3 else 5
    R(g,3,y0,34,alto,'n')
    for x in range(3,37): g[y0+alto-1][x]='c' if x%2 else 'n'
    # a beira: duas linhas de abismo embaixo do patamar
    for x in range(3,37):
        for y in (y0+alto,y0+alto+1):
            if y<H: g[y][x]=' '
    PAT.append((y0,alto))
# rampas (degraus, sem vento): patamar k -> k+1, alternando direita/esquerda
RAMP=[]
for k in range(5):
    y0,alto=PAT[k]; y1,a1=PAT[k+1]
    x=33 if k%2==0 else 4
    for y in range(y1+a1,y0): g[y][x]=g[y][x+1]='e'
    RAMP.append((x,y1+a1,y0))
# entrada (de baixo, do Sopé) e saída (em cima, para a Crista)
for y in range(ys[0]+5,H): g[y][19]=g[y][20]='e'
for y in range(0,ys[5]): g[y][4]=g[y][5]='e'
# a chaminé velha (atalho do Tico): porta no patamar 1 (esquerda) e saída no patamar 3 (esquerda)
# muretas na beira (a última linha do patamar) e pedras-abrigo; o vento empurra para o SUL
MUR={}; PED={}
MUR[0]=[(7,4),(13,4),(23,5),(30,4)];  PED[0]=[(17,1),(27,2)]
MUR[1]=[(6,4),(15,4),(26,5)];  PED[1]=[(11,1),(21,2),(31,1)]
MUR[2]=[(9,5),(20,4),(29,4)];  PED[2]=[(15,1),(25,2)]
MUR[3]=[(7,6),(17,4),(27,6)];  PED[3]=[(12,2),(22,1),(32,2)]
MUR[4]=[(5,4),(14,5),(24,4)];  PED[4]=[(10,1),(19,2),(30,2)]
MUR[5]=[(9,4),(19,5),(28,4)];  PED[5]=[(14,1),(23,1),(33,2)]
mureta=[]; pedras=[]
for k,(y0,alto) in enumerate(PAT):
    for (x,w) in MUR[k]:
        for i in range(w): mureta.append((x+i,y0+alto-1))
    for (x,dy) in PED[k]: pedras.append((x,y0+dy))
for (x,y) in mureta+pedras: g[y][x]='N'
M['encosta9']=S(g)
# simulação do vento: de um tile, o vento empurra para baixo até bater em sólido; cair = cair no abismo
def solido(x,y): return y>=H or M['encosta9'][y][x] in 'RN'
def abismo(x,y): return M['encosta9'][y][x]==' '
def abrigado(x,y): return solido(x,y-1)          # pedra logo ao norte: o vento não pega
def empurra(x,y):
    if abrigado(x,y) or M['encosta9'][y][x]=='e': return (x,y,False)
    for _ in range(8):
        if solido(x,y+1): return (x,y,False)
        y+=1
        if abismo(x,y): return (x,y,True)
    return (x,y,False)
def onde_cai(x,y):   # cai pelo abismo e pelo paredão até o chão do patamar de baixo
    while y<H-1 and M['encosta9'][y][x] in ' R': y+=1
    return (x,y)
seguros=[]
for k,(y0,alto) in enumerate(PAT):
    safe=set()
    for x in range(3,37):
        for y in range(y0,y0+alto):
            if M['encosta9'][y][x] in 'nc' and not empurra(x,y)[2]: safe.add((x,y))
    xs=sorted(set(x for x,_ in safe))
    # ao longo do patamar, nunca mais que 9 colunas sem abrigo
    gaps=[b-a for a,b in zip(xs,xs[1:])]
    assert max(gaps)<=9, f'patamar {k}: trecho sem abrigo {gaps}'
    seguros.append(sorted(safe))
    for x in range(3,37):
        for y in range(y0,y0+alto):
            if M['encosta9'][y][x] in 'nc':
                ex,ey,caiu=empurra(x,y)
                if caiu and k>0:
                    lx,ly=onde_cai(ex,ey); assert M['encosta9'][ly][lx] in 'nce', f'queda sem chão {x},{y} -> {lx},{ly}'
PE=dict(entra=[19,62], volta=[[19,63],[20,63]], saida=[[4,0],[5,0]],
  patamares=[dict(y0=y0,h=alto,ent=([19,y0+alto-1] if k==0 else [RAMP[k-1][0]+(0 if k%2 else 0), y0+alto-1])) for k,(y0,alto) in enumerate(PAT)],
  rampas=[[x,ya,yb] for (x,ya,yb) in RAMP], mureta=[list(p) for p in mureta], pedras=[list(p) for p in pedras],
  chamineA=[3,ys[1]+1], chamineB=[3,ys[3]+1], rondas=[[[8,ys[1]+1],[30,ys[1]+1]],[[30,ys[2]+2],[8,ys[2]+2]],[[10,ys[4]+3],[28,ys[4]+3]]],
  holofotes=[[12,ys[4]-1,'down'],[26,ys[5]-1,'down']],
  espantalho=[20,ys[3]+1], espTrig=[[16,ys[3]+r] for r in range(7)], marco=[26,ys[3]+2], foes=[[12,ys[0]+2],[22,ys[2]+3],[16,ys[5]+3]],
  bau=[[35,ys[0]+1],[4,ys[4]+1]], fila=[[30,ys[0]+1],[33,ys[1]+3]])
# os patamares: a entrada de cada um (o topo da rampa de baixo)
for k in range(6):
    if k==0: PE['patamares'][k]['ent']=[19,ys[0]+4]
    else:
        x,ya,yb=RAMP[k-1]; PE['patamares'][k]['ent']=[x,PAT[k][0]+PAT[k][1]-2]
P['encosta9']=PE
# alcance (sem as rondas): tudo ligado
v=reach('encosta9',PE['entra'])
for p in PE["saida"]+[PE["marco"],PE["espantalho"]]+PE["foes"]+PE["bau"]: assert tuple(p) in v or any((p[0]+a,p[1]+b) in v for a,b in ((1,0),(-1,0),(0,1),(0,-1))), f'encosta: {p}'
for pt in PE['patamares']: assert tuple(pt['ent']) in v, pt

# ---------- A Crista: o Jardim das Lentes (48x30) ----------
g=grid(48,30,'r')
R(g,0,0,48,2,'R'); R(g,0,28,48,2,'R')
for y in range(30): g[y][0]=g[y][47]='R'
for x in range(1,47):                                  # a beira norte e sul, irregular
    for y in range(2,2+(x*7)%3): g[y][x]='R'
for x in range(1,47):
    for y in range(26-(x*5)%2,28): g[y][x]=' '
for y in range(26,30): g[y][4]=g[y][5]='e'             # chegada da Encosta (embaixo, à esquerda)
R(g,20,0,8,4,'R')                                      # a Porta das Lentes (no paredão, em cima)
for y in range(0,4): g[y][23]=g[y][24]='l'
# neve por cima da rocha em partes
for (x,y,w,h) in [(6,18,10,6),(30,18,12,5),(36,6,8,6)]:
    for j in range(h):
        for i in range(w):
            if g[y+j][x+i]=='r': g[y+j][x+i]='n'
# colunas e oficinas em ruína (sólidas): a do lado do emissor obriga o feixe a desviar
COL=[(9,13),(9,14),(9,15),(23,6),(25,6),(17,8),(17,9),(30,11),(31,11),(14,19),(15,19),(36,6),(36,7),(28,21),(40,19),(20,16),(33,16)]
for (x,y) in COL: g[y][x]='R'
M['crista9']=S(g)
EMI=[2,14,'right']; ALVO=[24,3]; ALARME=[45,5]
P['crista9']=dict(entra=[4,26], volta=[[4,29],[5,29]], porta=[[23,3],[24,3]], saida=[[23,0],[24,0]], emissor=EMI, alvo=ALVO, alarme=ALARME,
  espelhos=[[8,22],[38,22],[42,9]], atril=[12,17], rainha=[24,9], rainhaTrig=[[x,7] for x in range(19,30)], marco=[6,24], bau=[[44,24],[2,4]], foes=[[30,16],[16,8]])
# feixe: sem espelho, vai direto e bate no alarme (ou numa coluna)
def feixe(espelhos):
    D={'right':(1,0),'left':(-1,0),'up':(0,-1),'down':(0,1)}
    x,y=EMI[0],EMI[1]; d=D[EMI[2]]
    REF={'/':{(1,0):(0,-1),(0,-1):(1,0),(-1,0):(0,1),(0,1):(-1,0)},'\\':{(1,0):(0,1),(0,1):(1,0),(-1,0):(0,-1),(0,-1):(-1,0)}}
    for _ in range(300):
        x+=d[0]; y+=d[1]
        if [x,y]==ALVO: return 'alvo'
        if [x,y]==ALARME: return 'alarme'
        if M['crista9'][y][x] in SOLID: return 'parede'
        if (x,y) in espelhos: d=REF[espelhos[(x,y)]][d]
    return 'longe'
assert feixe({})!='alvo', 'crista: abre sem espelho'
# busca: caminho do feixe com <=3 desvios, desvios em chão livre (nem coluna, nem abismo, nem a porta)
def livre(x,y): return M['crista9'][y][x] in 'rn' and [x,y] not in (ALVO,ALARME) and [x,y]!=EMI[:2]
best=None
start=(EMI[0],EMI[1],(1,0),0,())
q=collections.deque([start]); seen=set()
while q and not best:
    x,y,d,t,path=q.popleft()
    nx,ny=x+d[0],y+d[1]
    if not (0<=nx<48 and 0<=ny<30): continue
    if [nx,ny]==ALVO: best=path; break
    if M['crista9'][ny][nx] in SOLID or M['crista9'][ny][nx]==' ' and False: continue
    if M['crista9'][ny][nx] in SOLID or [nx,ny]==ALARME: continue
    key=(nx,ny,d,t)
    if key in seen: continue
    seen.add(key)
    q.append((nx,ny,d,t,path))
    if t<3 and livre(nx,ny):
        for nd in ((0,1),(0,-1)) if d[1]==0 else ((1,0),(-1,0)):
            m='/' if (d,nd) in [((1,0),(0,-1)),((0,-1),(1,0)),((-1,0),(0,1)),((0,1),(-1,0))] else '\\'
            q.append((nx,ny,nd,t+1,path+((nx,ny,m),)))
assert best, 'crista: sem solução com 3 espelhos'
assert len(best)==3, f'crista: fácil demais {best}'
assert feixe({(x,y):m for x,y,m in best})=='alvo'
P['crista9']['solucao']=[[x,y,m] for x,y,m in best]
v=reach('crista9',P['crista9']['entra'])
for p in [P['crista9']['atril'],P['crista9']['marco']]+P['crista9']['espelhos']+P['crista9']['bau']+P['crista9']['foes']: assert tuple(p) in v or any((p[0]+a,p[1]+b) in v for a,b in ((1,0),(-1,0),(0,1),(0,-1))), f'crista: {p}'
for x,y,m in best: assert (x,y) in v, f'espelho inalcançável {x},{y}'
assert (24,4) in v

# ---------- O Pátio do Farol (32x26) ----------
g=grid(32,26,'l')
R(g,0,0,32,7,'R'); R(g,0,0,3,26,'R'); R(g,29,0,3,26,'R')
for y in range(22,26):
    for x in range(3,29):
        if not 13<=x<=18: g[y][x]=' '
for y in range(7,22):
    for x in (3,28): g[y][x]='n'
for y in range(22,26): g[y][15]=g[y][16]='e'
g[6][15]=g[6][16]='l'
M['farol9']=S(g)
P['farol9']=dict(entra=[15,24], volta=[[15,25],[16,25]], porta=[[15,6],[16,6]], tiago=[18,8], trig=[[x,13] for x in range(4,28)], postes=[[6,9],[25,9],[6,18],[25,18]], frente=[16,11])
v=reach('farol9',P['farol9']['entra']); assert all(tuple(p) in v for p in P['farol9']['trig'])

for k in M: assert len(set(len(r) for r in M[k]))==1, k
print('ok')
open('/home/claude/rpg2/src/mapas9.js','w').write('// gerado por maps/cap9maps.py (vento e feixe verificados)\nconst ROWS9 = '+json.dumps(M,ensure_ascii=False)+';\nconst POS9 = '+json.dumps(P,ensure_ascii=False)+';\n')
for k in M: print('\n'+k); print('\n'.join(f'{i:2} {r}' for i,r in enumerate(M[k])))
print('solução', best)
