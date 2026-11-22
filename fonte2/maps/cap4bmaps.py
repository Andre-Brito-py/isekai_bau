# Mapas do Cap. 4 (Parte 2): Estrada da Serra, Candeia (a vila apagada) e a Mina de Candeia.
# Gerados e VALIDADOS aqui; exportados para src/mapas4b.js como ROWS4B e POS4B.
# Tiles: 't' terra, 'T' mata (sólido), ';' grama, ',' pedra, 'X' sólido, '#' muro; mina usa KEY_GAL (',' chão de
# fuligem/rocha clara, 'X' rocha sólida).
import json, collections
def grid(w,h,ch): return [[ch]*w for _ in range(h)]
def R(g,x,y,w,h,ch):
    for j in range(h):
        for i in range(w): g[y+j][x+i]=ch
def S(g): return [''.join(r) for r in g]
M={}; P={}; SOL={}
SOLID=set('#XTw')
# ---------- Estrada da Serra (34x16): caminho em zigue-zague subindo, mata dos lados ----------
g=grid(34,16,'T')
R(g,0,12,12,3,'t'); R(g,9,7,3,8,'t'); R(g,9,7,14,3,'t'); R(g,20,2,3,8,'t'); R(g,20,2,14,3,'t')
R(g,1,10,6,2,';'); R(g,12,11,8,4,';'); R(g,23,6,9,5,';'); R(g,4,2,12,4,';'); R(g,12,4,3,3,'t')   # clareiras
M['serra']=S(g)
P['serra']=dict(chegada=[1,13], onibus=[0,12], marco=[3,11], cand=[[33,2],[33,3],[33,4]], placa=[30,3],
  n1=[10,10], n2=[16,8], m1=[21,6], m2=[14,12], bau=[6,3], velha=[25,8], mirante=[5,4])
SOL['serra']=[(0,12),(0,13),(0,14),(1,12)]
# ---------- Candeia (34x24) ----------
g=grid(34,24,','); R(g,0,0,34,8,'X'); R(g,0,22,34,2,'#')
R(g,13,12,8,6,';'); R(g,3,14,4,3,';'); R(g,26,15,5,3,';')
M['candeia']=S(g)
P['candeia']=dict(entra=[1,19], serraDoor=[[0,18],[0,19],[0,20]], minaDoor=[[16,8],[17,8]], minaOut=[16,9],
  ildaDoor=[[5,8],[6,8]], ildaOut=[5,9], pensaoDoor=[[26,8],[27,8]], marco=[3,19],
  parados=[[9,9],[12,9],[22,9],[30,9],[8,16],[24,19],[19,20]], postes=[[10,11],[23,11],[10,19],[23,19]], poco=[16,14],
  bau=[32,20], crianca=[28,13], placa=[14,9])
SOL['candeia']=[tuple(p) for p in P['candeia']['postes']]+[(x,y) for x in range(15,19) for y in (13,14)]+[tuple(p) for p in P['candeia']['parados']]
# ---------- Casa da Dona Ilda (12x10, interior) ----------
def interior(w,h):
    g=grid(w,h,'o'); R(g,0,0,w,3,'w'); R(g,0,0,1,h,'w'); R(g,w-1,0,1,h,'w'); R(g,0,h-1,w,1,'w'); return g
g=interior(12,10); R(g,3,5,6,3,'r'); g[9][5]='o'; g[9][6]='o'; M['ilda']=S(g)
P['ilda']=dict(door=[[5,9],[6,9]], entra=[5,8], ilda=[6,4], mesa=[8,3], estante=[2,3], cadernos=[10,4])
SOL['ilda']=[(8,3),(9,3),(2,3),(3,3),(10,4)]
# ---------- Mina de Candeia (32x20) ----------
g=grid(32,20,'X')
def C(x,y,w,h): R(g,x,y,w,h,',')
C(1,15,12,3); C(10,9,3,9); C(10,9,10,3); C(17,4,3,8); C(17,4,12,3); C(4,9,6,3); C(4,4,3,8); C(4,4,8,2)
C(22,12,8,5); C(19,13,3,2); C(24,7,3,6); C(26,1,5,4)   # galeria lateral e a CAPELA no alto
M['mina']=S(g)
P['mina']=dict(entra=[2,16], saida=[[1,17]], marco=[4,16], m1=[11,13], n1=[14,10], m2=[5,6], n2=[18,8], mix=[25,14],
  veios=[[8,15],[12,10],[6,5],[20,5],[27,13]], bau1=[9,4], bau2=[29,15], chefe=[28,2], gatilhoChefe=[[26,3],[27,3],[28,3],[29,3],[30,3]],
  lampioes=[[3,15],[11,11],[18,6],[23,13],[27,4]], trilhos=[[2,16],[12,16]])
SOL['mina']=[]

def reach(name,start):
    rows=M[name]; h=len(rows); w=len(rows[0]); sol=set(SOL.get(name,[]))
    def ok(x,y): return 0<=x<w and 0<=y<h and rows[y][x] not in SOLID and (x,y) not in sol
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
s=P['serra']; check('serra',s['chegada'],on=[s['marco'],s['n1'],s['n2'],s['m1'],s['m2'],s['velha'],s['mirante']]+s['cand'],near=[s['bau'],s['placa']])
c=P['candeia']; check('candeia',c['entra'],on=c['serraDoor']+c['minaDoor']+c['ildaDoor']+c['pensaoDoor']+[c['marco'],c['minaOut'],c['ildaOut'],c['crianca'],c['placa']],near=c['parados']+[c['bau'],c['poco']])
i=P['ilda']; check('ilda',i['entra'],on=i['door'],near=[i['ilda'],i['mesa'],i['estante'],i['cadernos']])
m=P['mina']; check('mina',m['entra'],on=m['saida']+[m['marco'],m['m1'],m['n1'],m['m2'],m['n2'],m['mix'],m['chefe']]+m['gatilhoChefe'],near=m['veios']+[m['bau1'],m['bau2']]+m['lampioes'])
open('/home/claude/rpg2/src/mapas4b.js','w').write('// gerado por maps/cap4bmaps.py (validado)\nconst ROWS4B = '+json.dumps(M,ensure_ascii=False)+';\nconst POS4B = '+json.dumps(P,ensure_ascii=False)+';\n')
for k in M: print('\n'+k); print('\n'.join(M[k]))
