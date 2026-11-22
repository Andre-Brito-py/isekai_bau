# Mapas do Cap. 4 (Parte 1): Largo do Hospital, Casa de Saúde (térreo), Ala do Descanso (2º andar) e a Sala do
# Diretor. Gerados e VALIDADOS aqui; exportados para src/mapas4.js como ROWS4 e POS4.
# Tiles novos: 'h' ladrilho de hospital, 'W' parede de hospital (sólida), '=' escada; e os de antes.
import json, collections
def grid(w,h,ch): return [[ch]*w for _ in range(h)]
def R(g,x,y,w,h,ch):
    for j in range(h):
        for i in range(w): g[y+j][x+i]=ch
def S(g): return [''.join(r) for r in g]
M={}; P={}; SOL={}
SOLID=set('#XTwW'); WATER=set('~')
def interior(w,h,fl='h',wl='W'):
    g=grid(w,h,fl); R(g,0,0,w,3,wl); R(g,0,0,1,h,wl); R(g,w-1,0,1,h,wl); R(g,0,h-1,w,1,wl); return g
# ---------- Largo do Hospital (34x20) ----------
g=grid(34,20,','); R(g,0,0,34,8,'X'); R(g,0,18,34,2,'#')
R(g,3,10,5,3,';'); R(g,25,13,5,3,';'); R(g,12,14,10,2,'.')
M['largo']=S(g)
P['largo']=dict(chegada=[1,12], festDoor=[[0,12],[0,13]], hospDoor=[[16,8],[17,8]], hospOut=[16,9], lavDoor=[31,8], lavOut=[31,9],
  marco=[3,15], tico=[10,11], pregoeiro=[22,12], fila=[[19,10],[20,10],[21,10]], porteiro=[15,8], guarda=[18,8],
  postes=[[6,9],[27,9],[6,16],[27,16]], arvores=[[2,9],[31,12]], fonte=[16,12], bau=[32,16], velho=[12,16], banco=[[13,13],[20,13]])
SOL['largo']=[tuple(p) for p in P['largo']['postes']]+[tuple(p) for p in P['largo']['arvores']]+[(x,y) for x in range(15,19) for y in (12,13)]
# ---------- Casa de Saúde do Largo, térreo (30x14) ----------
g=interior(30,14); R(g,11,3,1,10,'W'); g[7][11]='h'; g[8][11]='h'; g[13][14]='h'; g[13][15]='h'; g[3][27]='='; g[3][28]='='
M['hosp1']=S(g)
camas1=[[13,4],[17,4],[21,4],[13,9],[17,9],[21,9],[25,9]]
P['hosp1']=dict(door=[[14,13],[15,13]], entra=[14,12], dalva=[5,4], balcao=[5,5], bancos=[[2,9],[2,11]], camas=camas1,
  escada=[[27,3],[28,3]], escOut=[27,4], cartaz=[8,3], visita=[4,10], vaso=[9,11])
SOL['hosp1']=[(x,5) for x in range(3,9)]+[(x,y+d) for x,y in camas1 for d in (0,1)]+[(2,9),(2,11)]
# ---------- Ala do Descanso, 2º andar (30x20) ----------
g=interior(30,20); R(g,1,3,28,16,'W')
def C(x,y,w,h): R(g,x,y,w,h,'h')
C(1,3,28,2); C(1,9,28,2); C(1,16,28,2); C(4,3,2,15); C(14,3,2,15); C(24,3,2,15)
C(7,12,6,3); g[11][9]='h'; g[11][10]='h'        # quarto 1 (Dito? não: pesadelo)
C(17,5,6,3); g[8][19]='h'; g[8][20]='h'         # quarto 2 (a cama do Dito)
C(17,12,6,3); g[11][21]='h'                     # quarto 3 (potes)
C(7,5,6,3); g[8][7]='h'                         # quarto 4 (rouparia)
g[2][27]='h'; g[2][26]='h'                      # porta da Sala do Diretor (no alto)
g[18][2]='='
M['hosp2']=S(g)
P['hosp2']=dict(entra=[2,17], descida=[[2,18]], salaDoor=[[26,2],[27,2]], salaOut=[26,3], relogio=[26,4],
  rondas=[dict(path=[[2,9],[27,9]],at=[6,9]), dict(path=[[14,4],[14,16]],at=[14,13]), dict(path=[[6,3],[22,3]],at=[20,3]), dict(path=[[24,16],[24,5]],at=[24,12])],
  pes1=[9,13], len1=[19,13], pes2=[10,16], len2=[8,6], misto=[20,6],
  camaDito=[21,5], potes=[[18,12],[22,12]], rouparia=[11,5], bau=[12,14], marco=[1,16], nota=[5,12], quartoDito=[19,7])
SOL['hosp2']=[(21,5),(21,6),(18,12),(22,12),(11,5),(12,5)]
# ---------- Sala do Diretor (12x10) ----------
g=interior(12,10,'r'); R(g,1,3,10,6,'h'); R(g,3,5,6,3,'r'); g[9][5]='h'; g[9][6]='h'; M['sala']=S(g)
P['sala']=dict(door=[[5,9],[6,9]], entra=[5,8], mesa=[6,4], arquivo=[2,3], quadro=[9,3], lixo=[10,7])
SOL['sala']=[(5,4),(6,4),(7,4),(2,3),(10,7)]

def reach(name,start):
    rows=M[name]; h=len(rows); w=len(rows[0]); sol=set(SOL.get(name,[]))
    def ok(x,y): return 0<=x<w and 0<=y<h and rows[y][x] not in SOLID and (x,y) not in sol and rows[y][x] not in WATER
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
L=P['largo']; check('largo',L['chegada'],on=[L['marco'],L['tico'],L['pregoeiro'],L['hospOut'],L['lavOut'],L['velho'],L['guarda'],L['porteiro']]+L['festDoor']+L['hospDoor']+L['fila']+[L['lavDoor']],near=[L['bau']]+L['banco'])
H1=P['hosp1']; check('hosp1',H1['entra'],on=H1['door']+H1['escada']+[H1['escOut'],H1['visita']],near=[H1['dalva'],H1['cartaz'],H1['vaso']]+H1['camas']+H1['bancos'])
H2=P['hosp2']; ronda_pts=[p for r in H2['rondas'] for p in r['path']+[r['at']]]
check('hosp2',H2['entra'],on=H2['descida']+H2['salaDoor']+[H2['salaOut'],H2['relogio'],H2['pes1'],H2['len1'],H2['pes2'],H2['len2'],H2['misto'],H2['marco'],H2['nota'],H2['quartoDito']]+ronda_pts,near=[H2['camaDito'],H2['rouparia'],H2['bau']]+H2['potes'])
# as rondas andam em linha reta por chão livre
for r in H2['rondas']:
    (x0,y0),(x1,y1)=r['path']; assert x0==x1 or y0==y1
    for x in range(min(x0,x1),max(x0,x1)+1):
        for y in range(min(y0,y1),max(y0,y1)+1): assert M['hosp2'][y][x]=='h', ('ronda',x,y)
SA=P['sala']; check('sala',SA['entra'],on=SA['door'],near=[SA['mesa'],SA['arquivo'],SA['quadro'],SA['lixo']])
open('/home/claude/rpg2/src/mapas4.js','w').write('// gerado por maps/cap4maps.py (validado: larguras, alcance, entidades em chão válido)\nconst ROWS4 = '+json.dumps(M,ensure_ascii=False)+';\nconst POS4 = '+json.dumps(P,ensure_ascii=False)+';\n')
for k in M: print('\n'+k); print('\n'.join(M[k]))
