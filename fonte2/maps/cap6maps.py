# Mapas do Cap. 6 (A CIDADE DOS PAVIOS): a Vila dos Pavios (bairro operário da Coroa, ao sul do Largo do Hospital),
# a Casa do Selo (Galpão das Esteiras) e o Cofre das Lembranças. Gerados e VALIDADOS aqui: larguras, alcance, e o
# QUEBRA-CABEÇA DAS ESTEIRAS é simulado (com as alavancas iniciais não se chega à saída; com a sequência certa, chega;
# e nunca há ilha sem saída).
# Tiles: ',' pedra, ';' grama, '#' muro, '~' água, 'X' sólido (prédios), '=' escada, 'c' chão de fábrica, 'f' faixa
# amarela de trabalho, 'e' esteira (a direção vem do estado), 'P' prensa (anda, mas a prensa desce), 'k' tapete.
import json, collections
def grid(w,h,ch): return [[ch]*w for _ in range(h)]
def R(g,x,y,w,h,ch):
    for j in range(h):
        for i in range(w): g[y+j][x+i]=ch
def S(g): return [''.join(r) for r in g]
M={}; P={}; SOL={}
SOLID=set('#XS~ ')

# ---------- Vila dos Pavios (52x36) ----------
# Bairro planejado: casinhas IGUAIS, numeradas, em fileiras; praça com o relógio parado no meio; lavanderia com
# varais de casacos cinza; refeitório; um canal torto que corta a vila (a única coisa torta do lugar); ao sul, o muro
# da CASA DO SELO, com chaminés e o portão do turno da noite.
g=grid(52,36,',')
R(g,0,0,52,2,'#'); g[0][8]=g[0][9]=g[1][8]=g[1][9]=','              # portão de cima (vem do Largo)
R(g,0,0,1,36,'#'); R(g,51,0,1,36,'#')
R(g,12,2,3,2,'X')                                                 # guarita
R(g,1,4,50,1,'#'); g[4][8]=g[4][9]=','                               # o muro da vila: só se entra pela cancela
casas=[]
for row,y in enumerate((7,14)):
    for x in (3,10,17,33,39,45):
        R(g,x,y-2,5,3,'X'); casas.append([x,y])                     # 5 tiles de largura; a porta na linha y
        R(g,x,y+1,5,1,';'); g[y+1][x+2]=','                       # jardinzinho igual na frente de todas
R(g,25,5,3,4,'X')                                                 # a torre do relógio
R(g,23,10,7,6,';')                                                # gramado da praça
for x,y in ((24,11),(28,11),(24,14),(28,14)): g[y][x]=','
R(g,3,19,9,4,'X')                                                 # lavanderia
R(g,36,19,11,4,'X')                                               # refeitório
# canal torto: entra pela esquerda e sai pela direita, ondulando entre as linhas 24 e 27
import math
for x in range(1,51):
    yc=25+round(1.4*math.sin(x/5.0))
    for y in (yc,yc+1): g[y][x]='~'
    g[yc-1][x]='#' if g[yc-1][x]==',' else g[yc-1][x]
    g[yc+2][x]='#' if g[yc+2][x]==',' else g[yc+2][x]
pontes=[8,25,26,42]
for x in pontes:
    for y in range(22,30):
        if g[y][x] in '~#': g[y][x]=','
R(g,1,30,50,6,'X')                                                # o muro da Casa do Selo
R(g,22,29,8,1,',')
g[30][25]=g[30][26]=','                                           # o portão do turno da noite
M['ruaPavios']=S(g)
P['ruaPavios']=dict(chegada=[8,2], largoDoor=[[8,0],[9,0]], guarita=[12,2], barreira=[[8,4],[9,4]], guarda=[10,3],
  casas=casas, relogio=[25,5], relogioPe=[26,9], marco=[23,16], vigiaMarco=[22,16], lavDoor=[7,23], varais=[[14,20],[18,20]], varalPega=[16,21],
  refDoor=[41,23], seloDoor=[[25,30],[26,30]], seloGuarda=[24,29], seloBarreira=[[25,29],[26,29]], canal=[[x,25+round(1.4*math.sin(x/5.0))] for x in range(1,51)],
  osvaldo=[27,16], cotinha=[19,15], afonso=[44,23], zelia=[5,23], semNumero=[32,9], bancos=[[23,12],[29,12],[23,15],[29,15]],
  postes=[[2,5],[16,5],[22,9],[31,9],[2,17],[32,17],[49,17],[13,23],[49,23]], arvores=[[33,5],[48,5],[22,13],[30,13],[11,18],[48,28]],
  rondaDia=[[23,5],[23,18]], pavioRotas=[[[2,9],[2,16],[9,16],[9,9]],[[38,9],[38,16],[50,16],[50,9]],[[15,17],[15,18],[33,18],[33,17]]])
SOL['ruaPavios']=[tuple(p) for p in P['ruaPavios']['postes']+P['ruaPavios']['arvores']]

# ---------- Casa do Selo · Galpão das Esteiras (44x32) ----------
# Embaixo: o chão de fábrica com FAIXAS amarelas (Pavio fora da faixa chama atenção) e Selos Vivos de ronda.
# No meio: o PISO DAS ESTEIRAS (ilhas ligadas só por esteiras; alavancas viram o sentido). Em cima: o corredor das
# PRENSAS (passar no tempo certo) e a porta do Cofre.
g=grid(44,32,'X')
R(g,2,22,40,8,'c')                                                # chão de fábrica
R(g,20,30,4,2,'c')                                                # entrada (de baixo)
faixa=[(21,30),(22,30)]+[(x,y) for y in range(21,30) for x in (21,22)]+[(x,27) for x in range(4,40)]+[(x,y) for y in range(21,28) for x in (6,)]+[(x,y) for y in range(23,28) for x in (37,)]+[(x,23) for x in range(22,38)]
for x,y in faixa: g[y][x]='f'
for x,y,w,h in ((9,23,5,3),(26,24,6,2),(14,28,4,1),(30,28,5,1)): R(g,x,y,w,h,'X')   # máquinas (o desenho cobre)
# ilhas e esteiras (piso do meio, linhas 9..20)
ILH={'I0':(5,17,3,3),'I1':(5,9,3,3),'I2':(19,9,3,3),'I3':(19,17,3,3),'I4':(33,9,3,3),'I5':(33,17,3,3)}
for k,(x,y,w,h) in ILH.items(): R(g,x,y,w,h,'c')
g[20][6]='f'; g[21][6]='f'                                         # do chão até a ilha I0
BELT={'A':dict(cells=[(6,y) for y in range(15,11,-1)],dirs=['up'],ini=0),
      'B':dict(cells=[(x,10) for x in range(8,19)],dirs=['left','right'],ini=0,lev='L1'),
      'C':dict(cells=[(20,y) for y in range(12,17)],dirs=['down'],ini=0),
      'D':dict(cells=[(x,18) for x in range(22,33)],dirs=['right'],ini=0),
      'E':dict(cells=[(34,y) for y in range(12,17)],dirs=['down','up'],ini=0,lev='L2'),
      'F':dict(cells=[(x,10) for x in range(22,33)],dirs=['left','right'],ini=0,lev='L3'),
      'G':dict(cells=[(x,18) for x in range(8,19)],dirs=['left'],ini=0)}
# A (vertical) usa as linhas 12..15 ao lado da ilha I0 (17..19) e I1 (9..11): liga 16
BELT['A']['cells']=[(6,y) for y in range(16,11,-1)]
for b in BELT.values():
    for x,y in b['cells']: g[y][x]='e'
LEV={'L1':[7,9],'L2':[35,19],'L3':[33,11]}
# corredor das prensas (linhas 3..6), da saída da I4 (34,8) até a porta do cofre (8..9, 2)
R(g,34,7,1,2,'c'); R(g,8,3,27,4,'c')
prensas=[28,21,14]
for x in prensas:
    for y in range(3,7): g[y][x]='P'
    for y in range(3,7): g[y][x+1]='P'
g[2][8]=g[2][9]='c'
M['selo1']=S(g)
P['selo1']=dict(entra=[21,29], saida=[[21,31],[22,31]], cofreDoor=[[8,2],[9,2]], belts={k:dict(cells=[list(c) for c in v['cells']],dirs=v['dirs'],ini=v['ini'],lev=v.get('lev')) for k,v in BELT.items()},
  ilhas={k:list(v) for k,v in ILH.items()}, alavancas=LEV, prensas=[[x,3,2,4] for x in prensas], prensaVolta=[33,5],
  maquinas=[[9,25,5],[26,25,6],[14,28,4],[30,28,5]], rondas=[[[3,26],[19,26]],[[24,25],[24,29]],[[33,22],[40,22]]], foe1=[38,25],
  bau=[40,28], marco=[19,29], quadro=[25,22])
SOL['selo1']=[]

def belt_sim(state):
    # a partir de cada ilha, onde as esteiras levam (uma passada de ponta a ponta); devolve o grafo ilha->ilha
    rows=M['selo1']
    cellmap={}
    for k,b in BELT.items():
        for c in b['cells']: cellmap[c]=k
    def ilha_de(p):
        for k,(x,y,w,h) in ILH.items():
            if x<=p[0]<x+w and y<=p[1]<y+h: return k
        return None
    D={'up':(0,-1),'down':(0,1),'left':(-1,0),'right':(1,0)}
    G=collections.defaultdict(set)
    for k,(x,y,w,h) in ILH.items():
        for i in range(x,x+w):
            for j in range(y,y+h):
                for d in D.values():
                    n=(i+d[0],j+d[1])
                    if n in cellmap:
                        p=n; seen=set()
                        while p in cellmap and p not in seen:
                            seen.add(p); b=BELT[cellmap[p]]; dd=D[b['dirs'][state[cellmap[p]]]]; p=(p[0]+dd[0],p[1]+dd[1])
                        dest=ilha_de(p)
                        if dest and dest!=k: G[k].add(dest)
                        elif dest is None: assert rows[p[1]][p[0]] in 'c' , f'esteira joga para fora: {p}'
    return G
def alcance(state,ini='I0'):
    G=belt_sim(state); v={ini}; q=[ini]
    while q:
        a=q.pop()
        for b in G[a]:
            if b not in v: v.add(b); q.append(b)
    return v,G
st0={k:b['ini'] for k,b in BELT.items()}
v,G=alcance(st0); assert 'I4' not in v, 'esteiras: dá para chegar sem as alavancas'
# busca: estados alcançáveis (ilha, alavancas) a partir de I0 mexendo nas alavancas das ilhas onde se está
LEVI={'L1':'I1','L2':'I5','L3':'I4'}; LEVB={v_['lev']:k for k,v_ in BELT.items() if v_.get('lev')}
def chave(il,st): return (il,tuple(sorted(st.items())))
def vizinhos(il,st):
    nxt=[]; G=belt_sim(st)
    for b in G[il]: nxt.append((b,dict(st)))
    for L,ilha in LEVI.items():
        if ilha==il: s2=dict(st); bk=LEVB[L]; s2[bk]=1-s2[bk]; nxt.append((il,s2))
    return nxt
ini=('I0',dict(st0)); seen={chave(*ini):ini}; q=[ini]; chegou=False
while q:
    il,st=q.pop()
    if il=='I4': chegou=True
    for n in vizinhos(il,st):
        c=chave(*n)
        if c not in seen: seen[c]=n; q.append(n)
assert chegou, 'esteiras: não chega na saída'
# de qualquer estado alcançável, sempre dá para chegar à saída (I4) e voltar à entrada (I0): nada de ficar preso
for c,(il,st) in seen.items():
    for alvo in ('I4','I0'):
        v2={c}; q2=[(il,st)]; ok=False
        while q2:
            a,s_=q2.pop()
            if a==alvo: ok=True; break
            for n in vizinhos(a,s_):
                cc=chave(*n)
                if cc not in v2: v2.add(cc); q2.append(n)
        assert ok, f'esteiras: preso em {il} {st} (sem caminho para {alvo})'
print('esteiras ok: estados', len(seen))

# ---------- Cofre das Lembranças (30x22) ----------
# Estantes de frascos com selo (cada frasco, uma lembrança com data e lote), o Livro dos Lotes, e no fundo a
# SELADORA REAL, a máquina que tampa e carimba. Saída dos fundos: a calha de descarte (dá na vila).
g=grid(30,22,'k')
R(g,0,0,30,2,'X'); R(g,0,0,1,22,'X'); R(g,29,0,1,22,'X'); R(g,0,21,30,1,'X')
g[21][14]=g[21][15]='k'
for y in (6,10,14):
    for x0 in (3,17):
        R(g,x0,y,10,2,'X')
R(g,10,2,10,3,'X')                                               # a Seladora (o desenho cobre)
M['selo2']=S(g)
P['selo2']=dict(entra=[14,20], saida=[[14,21],[15,21]], estantes=[[5,8],[22,8],[8,12],[20,12],[5,16],[24,16]], livro=[2,19], seladora=[10,4], frente=[[13,6],[14,6],[15,6],[16,6]],
  calha=[[27,2],[27,3]], calhaOut=[26,3], gatilho=[[12,8],[13,8],[14,8],[15,8],[16,8],[17,8]], bau=[27,19])
SOL['selo2']=[]

def reach(name,start,extra=set(),block=set()):
    rows=M[name]; h=len(rows); w=len(rows[0]); sol=set(SOL.get(name,[]))|block
    def ok(x,y): return 0<=x<w and 0<=y<h and ((rows[y][x] not in SOLID and rows[y][x]!='e') or (x,y) in extra) and (x,y) not in sol
    v={tuple(start)}; q=collections.deque([tuple(start)])
    while q:
        x,y=q.popleft()
        for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)):
            n=(x+dx,y+dy)
            if n not in v and ok(*n): v.add(n); q.append(n)
    return v
def adj(v,p): return any((p[0]+dx,p[1]+dy) in v for dx,dy in ((0,0),(1,0),(-1,0),(0,1),(0,-1)))
def check(name,start,on=[],near=[],extra=set(),block=set()):
    rows=M[name]; assert all(len(r)==len(rows[0]) for r in rows), name+': largura'
    v=reach(name,start,extra,block)
    for p in on: assert tuple(p) in v, f'{name}: {p} fora do alcance'
    for p in near: assert adj(v,p), f'{name}: {p} sem acesso'
    print(name,'ok',len(v)); return v
V=P['ruaPavios']
check('ruaPavios',V['chegada'],on=V['largoDoor']+V['barreira']+[V['marco'],V['osvaldo'],V['cotinha'],V['afonso'],V['zelia'],V['semNumero'],V['varalPega'],V['lavDoor'],V['refDoor'],V['seloGuarda']]+V['seloDoor']+[p for r in V['pavioRotas'] for p in r]+V['rondaDia'],
  near=[[x+2,y] for x,y in V['casas']]+[V['relogioPe'],V['vigiaMarco']])
S1=P['selo1']
v=check('selo1',S1['entra'],on=S1['saida']+[S1['marco'],S1['foe1'],S1['quadro'],[6,20]]+[p for r in S1['rondas'] for p in r],near=[S1['bau']])
for p in [(x,y) for x,y in [(6,20)]]: assert p in v
for k,(x,y,w,h) in ILH.items():
    vi=reach('selo1',(x,y)); assert all((i,j) in vi for i in range(x,x+w) for j in range(y,y+h))
for L,(x,y) in LEV.items():
    il=ILH[LEVI[L]]; assert il[0]<=x<il[0]+il[2] and il[1]<=y<il[1]+il[3], f'alavanca {L} fora da ilha'
vt=reach('selo1',(34,8)); assert (8,2) in vt and (34,9) in vt, 'corredor das prensas'
S2=P['selo2']; check('selo2',S2['entra'],on=S2['saida']+S2['frente']+S2['calha']+[S2['calhaOut']]+S2['gatilho'],near=S2['estantes']+[S2['livro'],S2['bau']])
open('/home/claude/rpg2/src/mapas6.js','w').write('// gerado por maps/cap6maps.py (validado, com simulação das esteiras)\nconst ROWS6 = '+json.dumps(M,ensure_ascii=False)+';\nconst POS6 = '+json.dumps(P,ensure_ascii=False)+';\n')
for k in M: print('\n'+k); print('\n'.join(f'{i:2} {r}' for i,r in enumerate(M[k])))
