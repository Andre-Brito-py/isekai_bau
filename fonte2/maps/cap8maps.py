# Mapas do Cap. 8 (O INVERNO ESCURO): as CISTERNAS de Auren (debaixo do Largo do Hospital; canais, braseiros, dois
# SALÕES DE GELO e o corredor escuro da escolta) e o CORAÇÃO FRIO (a arena da Friagem). Os salões de gelo foram
# gerados por busca (scratchpad/ice/gen2.py) e são re-verificados aqui: sem acender braseiro não se atravessa; com os
# braseiros certos (cada um só alcançável depois de outro) sim. Gelo: quem pisa escorrega até bater. Braseiro aceso
# derrete o gelo em volta (vira chão molhado: para de escorregar).
# Tiles: ',' pedra, '~' água, 'R' rocha, 'r' chão de rocha, 'i' gelo, '#' muro, 'X' sólido.
import json, collections
def grid(w,h,ch): return [[ch]*w for _ in range(h)]
def R(g,x,y,w,h,ch):
    for j in range(h):
        for i in range(w): g[y+j][x+i]=ch
def S(g): return [''.join(r) for r in g]
M={}; P={}
SOLID=set('#XR~ ')
ROOM1=["RRRRRRR.RRRRRRR","RiiiiiiiiiiRiiR","RiiiiRiiiiiiiiR","RiiiiiiiiiiiiiR","RiiiiiiRiiiiiiR","RiiiiRRiiiiiiiR","RiRiiiiiiiiiiiR","RiiiiiiiiiiiiiR","RiiiiiiiiiiiiRR","RiiiiRiiiRiiiiR","Riiiiii.iiiiiiR","RRRRRRR.RRRRRRR"]
B1={'B0':(7,2),'B1':(10,5)}
ROOM2=["RRRRRRRR.RRRRRRRR","RiiiiiiiiiiiiiiiR","RRiiiiiiiiiiiiiiR","RiiiiiiiiiiiRiiiR","RiiiiiiiiiiiiiiiR","RiiiRiiiiRiiiiiiR","RiRiiiiiiiiiiiiiR","RiiiiiiiiiiiiiiiR","RiRiiiRiRiiiiiiiR","RRiiiiiiiiiiiRiiR","RiiiiiiRiiiiiiRiR","Riiiiiii.iiiiiiiR","RRRRRRRR.RRRRRRRR"]
B2={'B0':(2,7),'B1':(8,3),'B2':(11,9)}
# os salões são usados de cabeça para baixo (entra-se por cima, sai-se por baixo): a física é simétrica
def flip(room,braz): H=len(room); return room[::-1], {k:(x,H-1-y) for k,(x,y) in braz.items()}
ROOM1,B1=flip(ROOM1,B1); ROOM2,B2=flip(ROOM2,B2)
def sim(rows, braz, lit, start):
    H=len(rows); W=len(rows[0]); g=[list(r) for r in rows]
    for k in lit:
        bx,by=braz[k]
        for dx in (-1,0,1):
            for dy in (-1,0,1):
                x,y=bx+dx,by+dy
                if 0<=x<W and 0<=y<H and g[y][x]=='i': g[y][x]='.'
    def free(x,y): return 0<=x<W and 0<=y<H and g[y][x] in '.i' and (x,y) not in braz.values()
    def moves(p):
        out=[]
        for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)):
            x,y=p
            if not free(x+dx,y+dy): continue
            x+=dx; y+=dy
            while g[y][x]=='i' and free(x+dx,y+dy): x+=dx; y+=dy
            out.append((x,y))
        return out
    v={start}; q=[start]
    while q:
        p=q.pop()
        for n in moves(p):
            if n not in v: v.add(n); q.append(n)
    return v
def check_room(room,braz):
    H=len(room); st=(room[0].index('.'),0); gl=(room[-1].index('.'),H-1)
    adj=lambda v,b: any(abs(x-b[0])+abs(y-b[1])==1 for x,y in v)
    seen={frozenset()}; q=[frozenset()]; ok=False
    while q:
        L=q.pop(); v=sim(room,braz,L,st)
        if gl in v: ok=True
        for k,b in braz.items():
            if k not in L and adj(v,b):
                n=L|{k}
                if n not in seen: seen.add(n); q.append(n)
    assert ok, 'gelo: sem solução'
    assert gl not in sim(room,braz,frozenset(),st), 'gelo: passa sem braseiro'
    # sempre dá para voltar à entrada (ninguém fica preso no gelo)
    for L in seen:
        v=sim(room,braz,L,st)
        for p in v:
            assert st in sim(room,braz,L,p) or gl in sim(room,braz,L,p) or any(adj(sim(room,braz,L,p),b) for k,b in braz.items() if k not in L), f'gelo: preso em {p} {set(L)}'
    print('salão de gelo ok', len(seen))
check_room(ROOM1,B1); check_room(ROOM2,B2)

# ---------- As Cisternas (56x46) ----------
g=grid(56,46,'R')
R(g,2,1,52,9,'r')                                                   # A: o salão dos canais
for y in (3,4): 
    for x in range(4,52): g[y][x]='~'
for y in (7,):
    for x in range(6,50): g[y][x]='~'
for x in (10,11,27,28,44,45):                                       # pontes de pedra
    for y in (3,4,7): g[y][x]='r'
g[0][27]=g[0][28]='r'                                               # a escada do Largo
# salão de gelo 1 (oeste): x 6..20, y 11..22
X1,Y1=6,11
for j,row in enumerate(ROOM1):
    for i,c in enumerate(row): g[Y1+j][X1+i]='r' if c=='.' else c
g[10][X1+ROOM1[0].index('.')]='r'
# B: a câmara da menina (y 24..31, x 3..24)
R(g,3,24,22,8,'r'); g[23][X1+ROOM1[-1].index('.')]='r'
# o corredor escuro da volta: da câmara B sobe pela esquerda até o salão A (x 2..3, y 10..23)
R(g,2,10,2,15,'r')
# salão de gelo 2 (leste): x 32..48, y 11..23
X2,Y2=32,11
for j,row in enumerate(ROOM2):
    for i,c in enumerate(row): g[Y2+j][X2+i]='r' if c=='.' else c
g[10][X2+ROOM2[0].index('.')]='r'
# C: o patamar da descida (y 25..33, x 30..52) e a escada para o Coração Frio
R(g,30,25,23,9,'r'); g[24][X2+ROOM2[-1].index('.')]='r'
R(g,40,34,2,3,'r'); g[37][40]=g[37][41]='r'
R(g,0,38,56,8,'R')
M['cisternas']=S(g)
P['cisternas']=dict(entra=[27,1], saida=[[27,0],[28,0]], gelo1=dict(x=X1,y=Y1,braz={k:[X1+x,Y1+y] for k,(x,y) in B1.items()},w=len(ROOM1[0]),h=len(ROOM1)),
  gelo2=dict(x=X2,y=Y2,braz={k:[X2+x,Y2+y] for k,(x,y) in B2.items()},w=len(ROOM2[0]),h=len(ROOM2)),
  comporta=[[X2+ROOM2[0].index('.'),10]], pai=[36,8], nina=[20,28], escuroBraz=[[3,22],[2,17],[3,12],[8,27]], canalBraz=[[8,1],[20,8],[34,1],[48,8]],
  descida=[[40,37],[41,37]], grade=[[2,10],[3,10]], alavancaGrade=[5,25], foes=[[16,5],[40,5],[12,29],[44,29]], marco=[30,2], bau=[[50,30],[22,25]], salao=[[x,1] for x in range(2,54)])
# ---------- O Coração Frio (32x24) ----------
g=grid(32,24,'R')
R(g,3,4,26,17,'i'); R(g,3,16,26,5,'r'); R(g,6,4,20,3,'r')
for x in range(3,29,6): g[17][x]='r'
g[21][15]=g[21][16]='r'; g[22][15]=g[22][16]='r'; g[23][15]=g[23][16]='r'
M['friagem8']=S(g)
P['friagem8']=dict(entra=[15,22], volta=[[15,23],[16,23]], frente=[[x,16] for x in range(8,24)], trono=[16,6], lume=[14,18])
def reach(name,start,extra=set()):
    rows=M[name]; h=len(rows); w=len(rows[0])
    def ok(x,y): return 0<=x<w and 0<=y<h and (rows[y][x] not in SOLID or (x,y) in extra)
    v={tuple(start)}; q=collections.deque([tuple(start)])
    while q:
        x,y=q.popleft()
        for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)):
            n=(x+dx,y+dy)
            if n not in v and ok(*n): v.add(n); q.append(n)
    return v
Ci=P['cisternas']
v=reach('cisternas',Ci['entra'])
for p in Ci['saida']+[Ci['pai'],Ci['marco'],Ci['nina'],Ci['comporta'][0]]+Ci['escuroBraz']+Ci['descida']+Ci['foes']: 
    assert tuple(p) in v or any((p[0]+dx,p[1]+dy) in v for dx,dy in ((1,0),(-1,0),(0,1),(0,-1))), f'cisternas: {p}'
for p in Ci['canalBraz']: assert any((p[0]+dx,p[1]+dy) in v for dx,dy in ((1,0),(-1,0),(0,1),(0,-1),(0,0))), f'braseiro {p}'
assert all(len(r)==56 for r in M['cisternas'])
F=P['friagem8']; vf=reach('friagem8',F['entra']); assert all(tuple(p) in vf for p in F['frente']+F['volta'])
print('cisternas ok', len(v))
open('/home/claude/rpg2/src/mapas8.js','w').write('// gerado por maps/cap8maps.py (salões de gelo verificados)\nconst ROWS8 = '+json.dumps(M,ensure_ascii=False)+';\nconst POS8 = '+json.dumps(P,ensure_ascii=False)+';\n')
for k in M: print('\n'+k); print('\n'.join(f'{i:2} {r}' for i,r in enumerate(M[k])))
