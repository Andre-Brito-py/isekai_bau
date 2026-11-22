# Mapas do Cap. 5 (O CADERNO PRETO): Cidade Alta (jardins de vidro), Estufa, Acendedoria (Sala das Lentes, Arquivo das
# Velas, Escritório) e os Telhados de Auren (fuga). Gerados e VALIDADOS aqui (larguras, alcance, e o FEIXE DE LUZ da Sala
# das Lentes é simulado: o estado inicial não resolve, a solução resolve e o erro dispara o alarme).
# Tiles: ',' pedra, ';' grama, '#' muro/balaustrada, '=' escada, 'X' sólido (prédios), 'm' mármore, 'g' cascalho,
# 'S' sebe (sólida), 'V' parede de vidro (sólida), '.' telha, ' ' vão (abismo, sólido), 'p' tábua.
import json, collections, math, random
def grid(w,h,ch): return [[ch]*w for _ in range(h)]
def R(g,x,y,w,h,ch):
    for j in range(h):
        for i in range(w): g[y+j][x+i]=ch
def S(g): return [''.join(r) for r in g]
M={}; P={}; SOL={}
SOLID=set('#XSV wT')

# ---------- Cidade Alta · Jardins de Vidro (56x40) ----------
# Em cima, a torre da Acendedoria e casarões; balaustrada com escadaria; no meio, o jardim (labirinto de sebes à
# esquerda, fonte com estátua no centro, a ESTUFA à direita); balaustrada; embaixo, a praça do mirante e o bondinho.
g=grid(56,40,'m')
R(g,18,0,20,12,'X')                                            # a torre (a fachada cobre)
for x,y,w in [(2,10,8),(10,9,6),(40,10,8),(48,9,7)]: R(g,x,0,w,y,'X')
for x,w,h in [(0,2,8),(16,2,8),(38,2,8),(55,1,8)]: R(g,x,0,w,h,'X')
R(g,0,14,56,1,'#')
for x in (26,27,28,29): g[14][x]='='
for x in (5,6,49,50): g[14][x]='='
R(g,0,15,56,13,';')                                             # o jardim
R(g,36,16,16,7,'X')                                            # a estufa (o desenho cobre)
R(g,25,19,6,3,'X')                                             # a fonte com a estátua
for x in range(21,36): g[24][x]='g'; g[25][x]='g'               # caminhos de cascalho
for y in range(15,28): g[y][27]='g'; g[y][28]='g'
for x in range(36,54): g[24][x]='g'
for y in range(23,28): g[y][43]='g'; g[y][44]='g'
# labirinto de sebes (x 2..20, y 15..26), gerado e fixo
mx,my,mw,mh=2,15,19,12
for y in range(my,my+mh):
    for x in range(mx,mx+mw): g[y][x]='S'
rnd=random.Random(51); cw,ch=(mw-1)//2,(mh-1)//2
vis=set(); st=[(0,0)]; vis.add((0,0)); g[my+1][mx+1]=';'
while st:
    cx,cy=st[-1]; ns=[(cx+dx,cy+dy,dx,dy) for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)) if 0<=cx+dx<cw and 0<=cy+dy<ch and (cx+dx,cy+dy) not in vis]
    if not ns: st.pop(); continue
    nx,ny,dx,dy=rnd.choice(ns); vis.add((nx,ny)); g[my+1+cy*2+dy][mx+1+cx*2+dx]=';'; g[my+1+ny*2][mx+1+nx*2]=';'; st.append((nx,ny))
g[my+1+(ch-1)*2][mx+mw-1]=';'                                       # entrada do labirinto (lado direito, embaixo)
R(g,0,28,56,1,'#')
for x in (26,27,28,29,8,9,46,47): g[28][x]='='
R(g,25,38,6,2,'p')                                              # plataforma do bondinho
R(g,0,29,3,9,'S'); R(g,53,29,3,9,'S')
M['cidadeAlta']=S(g)
labC=[mx+1+(cw//2)*2, my+1+(ch//2)*2]
P['cidadeAlta']=dict(chegada=[27,37], bondinho=[[26,39],[27,39],[28,39],[29,39]], marco=[6,33], portao=[[27,12],[28,12]],
  estufaDoor=[[43,23],[44,23]], estufaOut=[43,24], jardineiro=[21,24], tesoura=labC, bauLab=[mx+1,my+1], bau=[52,31],
  dama=[12,32], crianca=[34,33], sorveteiro=[20,33], guardas=[[26,13],[29,13]], estatua=[27,22], mirante=[50,36],
  postes=[[8,30],[19,30],[36,30],[47,30],[22,17],[33,17],[12,11],[43,11]], arvores=[[4,36],[16,35],[39,35],[51,34],[33,26],[23,16]],
  bancos=[[13,36],[41,36],[24,33],[31,33]], holofotes=[[18,13,'down'],[37,13,'down'],[53,22,'left']],
  vigias=[{'path':[[37,26],[52,26]],'at':[44,26]}], pavio=[30,31], placaTorre=[30,12])
SOL['cidadeAlta']=[tuple(p) for p in P['cidadeAlta']['postes']+P['cidadeAlta']['arvores']]

# ---------- Estufa (26x18) ----------
g=grid(26,18,'g'); R(g,0,0,26,3,'V'); R(g,0,0,1,18,'V'); R(g,25,0,1,18,'V'); R(g,0,17,26,1,'V')
g[17][12]='g'; g[17][13]='g'
for (x,y,w,h) in [(3,5,3,2),(8,4,4,2),(15,4,4,2),(20,6,3,3),(3,10,2,3),(21,11,2,3),(9,13,3,1)]: R(g,x,y,w,h,'S')   # canteiros
M['estufa']=S(g)
P['estufa']=dict(door=[[12,17],[13,17]], entra=[12,16], placas=[[6,8],[13,7],[19,10]], vasos=[[4,14],[10,11],[17,13],[22,15]],
  alcapao=[13,10], areia=[22,4], mariposas=[7,3], plantas=[[2,4],[13,4],[23,3],[2,15]])
SOL['estufa']=[]

# ---------- Acendedoria 1: Sala das Lentes (28x20) ----------
g=grid(28,20,'m'); R(g,0,0,28,3,'V'); R(g,0,0,1,20,'V'); R(g,27,0,1,20,'V'); R(g,0,19,28,1,'V')
g[2][25]='='; g[2][26]='='                                       # escada para o Arquivo (atrás da porta de vidro)
R(g,14,9,1,3,'V'); R(g,5,13,4,1,'V'); R(g,22,8,3,1,'V')         # colunas de vidro
M['lentes']=S(g)
P['lentes']=dict(entra=[2,17], subida=[[25,2],[26,2]], porta=[[25,3],[26,3]], emissor=[1,10,'right'],
  espelhos=[[10,10,'\\'],[10,4,'\\'],[20,4,'/']], movel={'espelho':[4,17],'caixa':[15,4]}, alvo=[26,15], alarme=[20,3],
  solucao={'espelhos':[[10,10,'/'],[10,4,'/'],[20,4,'\\'],[20,15,'\\']]}, vigia=[[3,6],[3,15]])
# simulação do feixe (mesma regra do jogo)
REFL={'/':{(1,0):(0,-1),(0,-1):(1,0),(-1,0):(0,1),(0,1):(-1,0)},'\\':{(1,0):(0,1),(0,1):(1,0),(-1,0):(0,-1),(0,-1):(-1,0)}}
def feixe(name,emis,esp,obst):
    rows=M[name]; x,y,d=emis[0],emis[1],{'right':(1,0),'left':(-1,0),'up':(0,-1),'down':(0,1)}[emis[2]]; vis=set()
    for _ in range(400):
        x+=d[0]; y+=d[1]
        if (x,y,d) in vis: return None
        vis.add((x,y,d))
        if rows[y][x] in SOLID: return ('parede',x,y)
        if (x,y) in obst: return ('bloqueio',x,y)
        if (x,y) in esp: d=REFL[esp[(x,y)]][d]; continue
        for nm,p in (('alvo',P[name]['alvo']),('alarme',P[name]['alarme'])):
            if [x,y]==p: return (nm,x,y)
    return None
L=P['lentes']
ini=feixe('lentes',L['emissor'],{(x,y):o for x,y,o in L['espelhos']},{tuple(L['movel']['caixa'])})
sol=feixe('lentes',L['emissor'],{(x,y):o for x,y,o in L['solucao']['espelhos']},set())
err=feixe('lentes',L['emissor'],{(10,10):'/',(10,4):'/',(20,4):'/'},set())
assert ini[0]!='alvo', ini; assert sol[0]=='alvo', sol; assert err[0]=='alarme', err
blk=feixe('lentes',L['emissor'],{(x,y):o for x,y,o in L['solucao']['espelhos']},{tuple(L['movel']['caixa'])})
assert blk[0]=='bloqueio', blk
print('feixe ok: inicial',ini,'solução',sol,'erro',err)
SOL['lentes']=[(x,y) for x,y,o in L['espelhos']]+[tuple(L['alvo']),tuple(L['alarme'])]

# ---------- Acendedoria 2: Arquivo das Velas (30x22) ----------
g=grid(30,22,'m'); R(g,0,0,30,3,'V'); R(g,0,0,1,22,'V'); R(g,29,0,1,22,'V'); R(g,0,21,30,1,'V')
for (y,gaps) in [(6,(4,15,25)),(10,(9,20)),(14,(4,14,25)),(18,(10,21))]:
    R(g,2,y,26,1,'X')
    for gx in gaps: g[y][gx]=','; g[y][gx+1]=','
g[2][27]='='; g[2][28]='='
M['arquivo']=S(g)
nomes=['Osvaldo Candeia','Joaquim','Dito','Marta Pena','Severino','Aurora','Lurdinha','Benício','Ana do Cais','Juca','Celestino','Rosa Maria']
velas=[]
for i,nm in enumerate(nomes):
    row=[6,10,14,18][i%4]; x=3+((i*7)%22)
    while g[row][x]!='X': x+=1
    velas.append([x,row,nm])
P['arquivo']=dict(entra=[3,20], descida=[[3,21]], subida=[[27,2],[28,2]], porta=[[27,3],[28,3]], velas=velas,
  ordem=['Osvaldo Candeia','Joaquim','Dito'], alta='Dito', escadinha=[25,20], nota=[6,19], vitral=[[26,4],[27,4],[28,4]], vitralPos=[27,4])
SOL['arquivo']=[]

# ---------- Acendedoria 3: o Escritório (18x12) ----------
g=grid(18,12,'r'); R(g,0,0,18,3,'V'); R(g,0,0,1,12,'V'); R(g,17,0,1,12,'V'); R(g,0,11,18,1,'V'); g[11][8]='r'; g[11][9]='r'
R(g,7,4,4,1,'X')
M['escritorio']=S(g)
P['escritorio']=dict(entra=[8,10], saida=[[8,11],[9,11]], mesa=[8,4], caderno=[9,4], janela=[[3,2],[14,2]], vesper=[9,6], cha=[12,5], estante=[2,3])
SOL['escritorio']=[]

# ---------- Os Telhados de Auren (64x30), à noite ----------
# Telhados (telha) ligados por cumeeiras; VÃOS de um tile (abismo) que só se atravessam pondo uma TÁBUA (do Vão);
# guaritas com holofotes; no fim, a torre do sino com o Grande Holofote e a descida para o Bairro Baixo.
g=grid(64,30,' ')
ilhas=[(1,20,9,7),(12,18,8,8),(22,15,9,9),(33,17,7,8),(42,12,8,9),(52,14,10,10),(23,4,9,7),(13,6,7,6),(44,3,8,6)]
for x,y,w,h in ilhas: R(g,x,y,w,h,'.')
pontes=[(10,22),(11,22),(20,20),(21,20),(31,19),(32,19),(40,18),(41,18),(50,16),(51,16),(26,11),(26,12),(26,13),(26,14),(20,8),(21,8),(22,8),(48,9),(48,10),(48,11)]
for x,y in pontes: g[y][x]='p'                                  # cumeeiras fixas (atalhos)
vaos=[(10,22),(20,20),(32,19),(41,18),(51,16)]
for x,y in vaos: g[y][x]=' '                                   # o tile do meio de cada ligação caiu: precisa de tábua
M['telhados']=S(g)
P['telhados']=dict(entra=[3,23], marco=[5,25], vaos=[[x,y] for x,y in vaos], tabuas=[[7,21],[16,21]], chamines=[[14,19],[25,17],[36,19],[45,14],[57,17],[27,6]],
  holofotes=[[30,16,'down'],[47,13,'left'],[16,8,'down']], guardas=[[24,21],[46,18]], fim=[60,20], chefe=[60,17], descida=[[59,23],[60,23]],
  bau=[[15,8],[47,4]], gatos=[[5,21],[36,18]])
SOL['telhados']=[tuple(p) for p in P['telhados']['chamines']]

def reach(name,start,extra=set(),block=set()):
    rows=M[name]; h=len(rows); w=len(rows[0]); sol=set(SOL.get(name,[]))|block
    def ok(x,y): return 0<=x<w and 0<=y<h and ((rows[y][x] not in SOLID) or (x,y) in extra) and (x,y) not in sol
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
C=P['cidadeAlta']
check('cidadeAlta',C['chegada'],on=C['bondinho']+C['portao']+C['estufaDoor']+[C['estufaOut'],C['marco'],C['jardineiro'],C['dama'],C['crianca'],C['sorveteiro'],C['tesoura'],C['bauLab'],C['pavio']]+C['guardas']+[v['at'] for v in C['vigias']],near=[C['bau'],C['estatua'],C['mirante'],C['placaTorre']])
E=P['estufa']; check('estufa',E['entra'],on=E['door']+E['placas']+E['vasos']+[E['alcapao']],near=[E['areia'],E['mariposas']])
check('lentes',L['entra'],on=[L['movel']['espelho'],L['movel']['caixa'],[20,15]]+L['vigia'],near=[[x,y] for x,y,o in L['espelhos']]+[L['alvo']])
# a escada só depois da porta de vidro (aberta pela luz)
v=check('lentes',L['entra'],on=L['subida'])
A=P['arquivo']; check('arquivo',A['entra'],on=A['subida']+[A['escadinha'],A['nota']]+A['vitral'],near=[[x,y] for x,y,_ in A['velas']])
check('escritorio',P['escritorio']['entra'],on=P['escritorio']['saida']+[P['escritorio']['vesper']],near=[P['escritorio']['caderno']])
T=P['telhados']
# sem tábuas não se chega ao fim; com as tábuas nos vãos, chega
v0=reach('telhados',T['entra']); assert tuple(T['fim']) not in v0, 'telhados: dá pra chegar sem tábua'
check('telhados',T['entra'],on=[T['fim']]+T['descida']+T['guardas'],near=T['bau']+T['tabuas'],extra={tuple(p) for p in T['vaos']})
open('/home/claude/rpg2/src/mapas5.js','w').write('// gerado por maps/cap5maps.py (validado, com simulação do feixe)\nconst ROWS5 = '+json.dumps(M,ensure_ascii=False)+';\nconst POS5 = '+json.dumps(P,ensure_ascii=False)+';\n')
for k in M: print('\n'+k); print('\n'.join(M[k]))
