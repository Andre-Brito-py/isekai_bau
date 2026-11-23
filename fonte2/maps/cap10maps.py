# Mapas do Cap. 10 (O FAROL DE CEM INVERNOS): A TORRE (quatro andares de escada e prateleiras de vidro cheias de potes;
# BALANÇAS que só descem com o peso de um pote, levado pelo Vão; grades que abrem quando todas as balanças do andar
# descem; a sala das máquinas com O CONTRAPESO) e A SALA DA LANTERNA (a luta final).
# Tiles: 'l' laje, 'R' parede/rocha, 'g' vidro (sólido), '=' degrau (KEY9 'e'), ' ' vão.
# Validação: alcance; cada grade só passa com as balanças do andar apertadas e há potes alcançáveis suficientes antes dela.
import json, collections
def grid(w,h,ch): return [[ch]*w for _ in range(h)]
def R(g,x,y,w,h,ch):
    for j in range(h):
        for i in range(w): g[y+j][x+i]=ch
def S(g): return [''.join(r) for r in g]
M={}; P={}
SOLID=set('Rg X')
W,H=30,60
g=grid(W,H,'R')
FL=[(48,8),(36,8),(24,8),(6,14)]           # (y0, altura) de cada andar: F0 embaixo ... F3 (sala das máquinas)
for (y0,h) in FL: R(g,2,y0,26,h,'l')
# prateleiras de vidro com potes na parede de cima de cada andar (sólidas)
for (y0,h) in FL[:3]:
    for x in range(4,26):
        if x%5!=0: g[y0][x]='g'
# escadas: F0->F1 à direita, F1->F2 à esquerda, F2->F3 à direita; F3 -> lanterna no meio, em cima
ESC=[(24,44,48),(3,32,36),(24,20,24)]
for (x,ya,yb) in ESC:
    for y in range(ya,yb): g[y][x]=g[y][x+1]='e'
for y in range(0,6): g[y][14]=g[y][15]='e'
for y in range(56,60): g[y][14]=g[y][15]='e'
# o poço de luz no meio da sala das máquinas (a corrente do contrapeso), sólido
R(g,13,9,4,3,'X')
M['torre10']=S(g)
# grades (no pé de cada escada de subida) e as balanças que as abrem
GRADES={'g1':dict(at=[[3,36],[4,36]],placas=[[8,41],[18,41]]),   # F1: duas balanças
        'g2':dict(at=[[24,24],[25,24]],placas=[[6,29],[13,29],[20,27]]),  # F2: três balanças
        'g0':dict(at=[[24,48],[25,48]],placas=[[12,53]])}         # F0: uma balança (o tutorial)
POTES={'F0':[[6,51],[19,54]], 'F1':[[22,39],[12,43],[5,38]], 'F2':[[9,26],[17,30],[23,29],[4,27]]}
P['torre10']=dict(entra=[14,56], volta=[[14,59],[15,59]], saida=[[14,0],[15,0]], grades=GRADES, potes=POTES,
  especiais={'jorge':[26,25],'ze':[3,49],'antonio':[26,38],'rosa':[2,30]}, marco=[6,55], bau=[[26,54],[2,41],[26,31]],
  foes=[[18,50],[14,38],[10,25],[20,13]], contrapeso=[14,13], cpTrig=[[x,17] for x in range(3,27)], maquinas=[[5,8],[24,8],[5,16],[24,16]],
  andares=[dict(y0=y0,h=h) for (y0,h) in FL])
T=P['torre10']
def reach(start,closed):
    rows=M['torre10']; blocked=set()
    for k,gd in GRADES.items():
        if k in closed: blocked|={tuple(p) for p in gd['at']}
    v={tuple(start)}; q=collections.deque([tuple(start)])
    while q:
        x,y=q.popleft()
        for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)):
            n=(x+dx,y+dy)
            if 0<=n[0]<W and 0<=n[1]<H and n not in v and rows[n[1]][n[0]] not in SOLID and n not in blocked: v.add(n); q.append(n)
    return v
v=reach(T['entra'],{'g0','g1','g2'})
assert not any((p[0],p[1]) in v for p in [[24,46]]), 'F0: passa sem a balança'
assert all(tuple(p) in v for p in POTES['F0']+GRADES['g0']['placas']), 'F0'
assert len(POTES['F0'])>=len(GRADES['g0']['placas'])
v=reach(T['entra'],{'g1','g2'})
assert all(tuple(p) in v for p in POTES['F1']+GRADES['g1']['placas']), 'F1'
assert tuple([3,34]) not in v
assert len(POTES['F0'])+len(POTES['F1'])-1>=len(GRADES['g1']['placas'])
v=reach(T['entra'],{'g2'})
assert all(tuple(p) in v for p in POTES['F2']+GRADES['g2']['placas']), 'F2'
assert tuple([24,22]) not in v
v=reach(T['entra'],set())
for p in T['saida']+[T['marco'],T['contrapeso']]+T['foes']+T['bau']+list(T['especiais'].values()): assert tuple(p) in v or any((p[0]+a,p[1]+b) in v for a,b in ((1,0),(-1,0),(0,1),(0,-1))), f'torre: {p}'
for (y0,h) in FL[:3]:
    for p in []: pass
# ---------- A Sala da Lanterna (26x22) ----------
g=grid(26,22,'R')
for y in range(22):
    for x in range(26):
        if ((x-12.5)/12)**2+((y-10.5)/10)**2<=1: g[y][x]='l'
for y in range(22):
    for x in range(26):
        if g[y][x]=='l' and ((x-12.5)/12)**2+((y-10.5)/10)**2>0.82: g[y][x]='g'
R(g,10,4,6,5,'X')                              # a lanterna (a lâmpada do Farol), no meio-norte
for y in range(18,22): g[y][12]=g[y][13]='e'
M['lanterna10']=S(g)
P['lanterna10']=dict(entra=[12,19], volta=[[12,21],[13,21]], vesper=[13,10], trig=[[x,14] for x in range(5,21)], lampada=[10,4,6,5])
rows=M['lanterna10']
def reach2(start):
    v={tuple(start)}; q=collections.deque([tuple(start)])
    while q:
        x,y=q.popleft()
        for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)):
            n=(x+dx,y+dy)
            if 0<=n[0]<26 and 0<=n[1]<22 and n not in v and rows[n[1]][n[0]] not in SOLID: v.add(n); q.append(n)
    return v
v=reach2(P['lanterna10']['entra']); assert all(tuple(p) in v for p in P['lanterna10']['trig']) and (13,10) in v
for k in M: assert len(set(len(r) for r in M[k]))==1, k
print('ok')
open('/home/claude/rpg2/src/mapas10.js','w').write('// gerado por maps/cap10maps.py (balanças e grades verificadas)\nconst ROWS10 = '+json.dumps(M,ensure_ascii=False)+';\nconst POS10 = '+json.dumps(P,ensure_ascii=False)+';\n')
for k in M: print('\n'+k); print('\n'.join(f'{i:2} {r}' for i,r in enumerate(M[k])))
