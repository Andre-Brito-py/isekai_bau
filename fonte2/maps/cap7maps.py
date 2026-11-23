# Mapas do Cap. 7 (A MINA DE ORIGEM): o Acampamento da Mina (serra, à noite é turno), as Galerias de Bombeamento (VÁLVULAS
# e VAPOR: cada válvula liga/desliga dois respiros), o CORAÇÃO (o poço: escuro; pontes de cristal que só existem
# enquanto o ECO do canto da Lume ilumina), o ANDAR 1 da masmorra do jogo 1 visto de cima (Câmara do Despertar, Galeria
# Úmida, Sala de Leitura Afogada, Antessala do Musgo) e o FUNDO (o Extrator). Validação: larguras, alcance, simulação das
# válvulas (sem preso, sempre há saída) e das pontes (sem eco não passa; com eco passa).
# Tiles: ',' pedra, ';' grama, '#' muro, 'X' sólido, '~' água, 'R' rocha (sólida), 'r' chão de rocha, 'm' musgo,
# 'a' veio de âmbar (chão), 't' trilho, 'v' respiro de vapor (anda quando desligado), 'b' ponte de cristal (só com eco),
# ' ' abismo, 'o' pedra de eco, '=' escada.
import json, collections, itertools, math
def grid(w,h,ch): return [[ch]*w for _ in range(h)]
def R(g,x,y,w,h,ch):
    for j in range(h):
        for i in range(w): g[y+j][x+i]=ch
def S(g): return [''.join(r) for r in g]
M={}; P={}; SOL={}
SOLID=set('#XR ~')

# ---------- Acampamento da Mina de Origem (56x34) ----------
g=grid(56,34,';')
R(g,0,0,56,8,'R')                                                  # a encosta da serra
for x in range(56):
    h=8+round(1.5*math.sin(x/4.0)+math.sin(x/9.0))
    for y in range(8,h): g[y][x]='R'
R(g,25,5,6,5,'R'); g[9][27]=g[9][28]='r'; g[8][27]=g[8][28]='r'    # a boca da mina
for y in range(10,33):                                             # trilhos da boca até o pátio de carga
    for x in (27,28): g[y][x]='t'
for x in range(28,46): g[22][x]='t'
for x in range(0,24):                                              # a estrada velha (de baixo, à esquerda)
    for y in (29,30,31): g[y][x]=','
for y in range(14,32): g[y][22]=','; g[y][23]=','
R(g,4,14,7,4,'X'); R(g,13,13,6,4,'X')                              # barracas da Guarda
R(g,38,12,9,5,'X')                                                 # o galpão de bombas (casa de máquinas)
R(g,40,26,8,4,'X')                                                 # o refeitório de lona
R(g,0,33,56,1,'R')
M['acampamento']=S(g)
P['acampamento']=dict(chegada=[3,30], onibus=[1,27], jorge=[6,28], boca=[[27,8],[28,8]], bocaOut=[27,11], guarda=[29,10], barreira=[[27,10],[28,10]],
  marco=[10,27], fogueira=[20,22], cozinheiro=[44,31], cao=[33,24], pavios=[[30,18],[35,23]], pipas=[[31,10],[44,11],[52,18]],
  vagonetes=[[28,16],[36,22],[42,22]], arvores=[[2,11],[12,10],[34,10],[50,11],[3,20],[52,24],[30,29],[18,27]], postes=[[21,14],[24,20],[26,12],[46,21],[9,24]],
  barracas=[[4,18,7],[13,17,6]], galpao=[38,17,9], refeit=[40,30,8], rondas=[[[12,21],[21,21]],[[30,14],[37,14]]], bau=[54,28], placa=[25,12])
SOL['acampamento']=[tuple(p) for p in P['acampamento']['arvores']+P['acampamento']['postes']+[P['acampamento']['fogueira']]]

# ---------- Galerias de Bombeamento (44x30): válvulas e vapor ----------
g=grid(44,30,'R')
for y0 in (1,7,13,19,25): R(g,2,y0,40,4,'r')                        # cinco galerias (S4 em cima ... S0 embaixo)
GAP={'A':(34,24),'B':(8,18),'C':(34,12),'D':(8,6)}                  # o respiro que separa cada galeria da de cima
for k,(x,y) in GAP.items():
    for i in (0,1):
        for j in (0,1): g[y-j][x+i]='v'
for x,y in ((10,26),(18,26),(26,27),(14,20),(22,21),(30,20),(12,14),(20,15),(28,14),(16,8),(24,9),(32,8)): R(g,x,y,2,2,'R')   # máquinas e pilares
for y0 in (1,7,13,19,25):
    for x in range(4,40,7): g[y0+3][x]='a' if g[y0+3][x]=='r' else g[y0+3][x]
g[29][21]=g[29][22]='r'                                             # entrada (de baixo)
g[0][21]=g[0][22]='r'                                               # saída (de cima, para o Coração)
M['bombas']=S(g)
VAL={'V1':dict(at=[4,27],tog=['A','B']),'V2':dict(at=[38,21],tog=['B','C']),'V3':dict(at=[4,15],tog=['C','D']),'V4':dict(at=[38,9],tog=['A','D'])}
INI={'A':1,'B':0,'C':1,'D':1}
P['bombas']=dict(entra=[21,28], saida=[[21,0],[22,0]], entrada=[[21,29],[22,29]], respiros={k:[[x,y],[x+1,y],[x,y-1],[x+1,y-1]] for k,(x,y) in GAP.items()}, valvulas=VAL, ini=INI,
  foes=[[30,26],[12,21],[26,16],[30,10]], broca=[21,3], brocaTrig=[[x,4] for x in range(14,30)], marco=[3,26], bau=[[40,26],[3,2]], mineiro=[39,27])
SOL['bombas']=[]
SEC=[(1,'S4'),(7,'S3'),(13,'S2'),(19,'S1'),(25,'S0')]
def sec_de(y):
    for y0,k in SEC:
        if y0<=y<y0+4: return k
def bombas_sim():
    def reach_state(st,start):
        rows=M['bombas']; vent={tuple(c):k for k,cs in P['bombas']['respiros'].items() for c in cs}
        def ok(x,y):
            if not(0<=x<44 and 0<=y<30): return False
            c=rows[y][x]
            if c=='v': return st[vent[(x,y)]]==0
            return c not in SOLID
        v={start}; q=[start]
        while q:
            x,y=q.pop()
            for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)):
                n=(x+dx,y+dy)
                if n not in v and ok(*n): v.add(n); q.append(n)
        return v
    ini=(tuple(sorted(INI.items())),(21,28)); seen={ini}; q=[ini]; chegou=False; estados={}
    while q:
        stt,pos=q.pop(); st=dict(stt); v=reach_state(st,pos); estados[(stt,pos)]=v
        if (21,1) in v: chegou=True
        for k,V in VAL.items():
            if any(abs(V['at'][0]-x)+abs(V['at'][1]-y)<=1 for x,y in v):
                s2=dict(st)
                for t in V['tog']: s2[t]=1-s2[t]
                p2=min(v)
                n=(tuple(sorted(s2.items())),p2)
                if n not in seen: seen.add(n); q.append(n)
    assert chegou,'bombas: sem caminho'
    # de qualquer estado alcançável, ainda dá para chegar à saída (ninguém fica preso entre vapores)
    def vizinhos(stt,pos):
        st=dict(stt); v=reach_state(st,pos); out=[]
        for k,V in VAL.items():
            if any(abs(V['at'][0]-x)+abs(V['at'][1]-y)<=1 for x,y in v):
                s2=dict(st)
                for t in V['tog']: s2[t]=1-s2[t]
                out.append((tuple(sorted(s2.items())),min(v)))
        return v,out
    for (stt,pos) in list(seen):
        vs={(stt,pos)}; q2=[(stt,pos)]; ok=False
        while q2:
            a_=q2.pop(); v,out=vizinhos(*a_)
            if (21,1) in v: ok=True; break
            for n in out:
                if n not in vs: vs.add(n); q2.append(n)
        assert ok, f'bombas: preso em {stt} {pos}'
    st0=dict(INI); v0=reach_state(st0,(21,28)); assert (21,1) not in v0, 'bombas: dá pra passar sem mexer'
    print('bombas ok: estados',len(seen))
bombas_sim()

# ---------- O Coração (34x44): o poço, no escuro ----------
g=grid(34,44,' ')
LED=[(2,1,30,5),(2,12,12,5),(20,12,12,5),(2,23,30,5),(10,34,14,8)]   # patamares
for x,y,w,h in LED: R(g,x,y,w,h,'r')
for x,y,w,h in LED:
    for i in range(x,x+w,5): g[y+h-1][i]='a'
BRIDGES={'p1':[(7,y) for y in range(6,12)],'p2':[(x,14) for x in range(14,20)],'p3':[(26,y) for y in range(17,23)],'p4':[(16,y) for y in range(28,34)]}
for cs in BRIDGES.values():
    for x,y in cs: g[y][x]='b'
ECO={'p1':[8,5],'p2':[13,15],'p3':[25,16],'p4':[17,27]}
g[0][16]=g[0][17]='r'
R(g,0,0,1,44,'R'); R(g,33,0,1,44,'R')
M['coracao']=S(g)
P['coracao']=dict(entra=[16,1], volta=[[16,0],[17,0]], pontes={k:[list(c) for c in v] for k,v in BRIDGES.items()}, eco=ECO, elevador=[[16,41],[17,41]], bau=[[30,13],[3,24]], foes=[[25,3],[5,26]],
  marco=[4,2], marca=[20,38])
SOL['coracao']=[]

# ---------- Andar 1 da masmorra (40x30): a Câmara do Despertar, de cima ----------
g=grid(40,30,'R')
ROOMS={'despertar':(15,1,10,7),'galeria':(3,10,16,6),'leitura':(24,10,13,7),'antessala':(12,20,16,8)}
for x,y,w,h in ROOMS.values(): R(g,x,y,w,h,'m')
for x,y in [(19,8),(19,9),(20,8),(20,9)]: g[y][x]='r'                # do despertar para baixo
for x in range(10,24): g[9][x]='r'
for y in range(9,10): pass
for x in range(19,25): g[12][x]='r'                                  # galeria -> leitura
for y in range(16,20): g[y][12]='r'; g[y][13]='r'                    # galeria -> antessala
for y in range(17,20): g[y][30]='r'                                  # leitura -> antessala
for x in range(27,31): g[19][x]='r'
for x,y in [(5,12),(6,12),(7,13),(14,11),(15,11),(26,13),(27,13),(28,14),(33,12)]: g[y][x]='~'   # poças (a Galeria Úmida e a Sala Afogada)
for x in range(16,24): g[1][x]='a'
g[0][19]=g[0][20]='r'
g[28][19]=g[28][20]='a'                                            # o buraco da broca (desce)
M['andar1']=S(g)
P['andar1']=dict(entra=[19,1], volta=[[19,0],[20,0]], pedestal=[20,4], gancho=[17,3], ofelia=[33,11], estantes=[[25,15],[35,15]], musgo=[20,23], musgoTrig=[[x,22] for x in range(14,27)],
  descida=[[19,28],[20,28]], foes=[[6,14],[29,15],[22,9]], bau=[[4,11],[35,16]], marco=[16,6])
SOL['andar1']=[]

# ---------- O Fundo (30x22): a câmara do Extrator ----------
g=grid(30,22,'R')
R(g,2,6,26,14,'r'); R(g,9,1,12,5,'R')                               # o Extrator ocupa o alto
for x in range(3,27,4): g[18][x]='a'
g[20][14]=g[20][15]='r'; g[21][14]=g[21][15]='r'
M['fundo7']=S(g)
P['fundo7']=dict(entra=[14,19], extrator=[9,6], frente=[[x,9] for x in range(11,19)], jorge=[12,14], vesper=[17,12], veio=[14,8])
SOL['fundo7']=[]

def reach(name,start,extra=set(),block=set(),ok_ch=None):
    rows=M[name]; h=len(rows); w=len(rows[0]); sol=set(SOL.get(name,[]))|block
    def ok(x,y): return 0<=x<w and 0<=y<h and ((rows[y][x] not in SOLID and rows[y][x] not in 'vb') or (x,y) in extra) and (x,y) not in sol
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
A=P['acampamento']
check('acampamento',A['chegada'],on=[A['jorge'],A['marco'],A['cozinheiro'],A['cao'],A['bocaOut'],A['guarda'],A['placa']]+A['barreira']+A['boca']+A['pavios']+[p for r in A['rondas'] for p in r],near=[A['bau']]+A['vagonetes'])
B=P['bombas']; allv={tuple(c) for cs in B['respiros'].values() for c in cs}
check('bombas',B['entra'],on=B['saida']+B['entrada']+[B['broca'],B['marco'],B['mineiro']]+B['foes']+B['brocaTrig'],near=B['bau']+[v['at'] for v in B['valvulas'].values()],extra=allv)
C=P['coracao']; allb={tuple(c) for cs in C['pontes'].values() for c in cs}
v0=reach('coracao',C['entra']); assert tuple(C['elevador'][0]) not in v0, 'coração: passa sem eco'
check('coracao',C['entra'],on=C['volta']+C['elevador']+C['foes']+[C['marco'],C['marca']]+[tuple(e) for e in C['eco'].values()],near=C['bau'],extra=allb)
# cada pedra de eco fica no patamar de onde a ponte dela sai
for k,(ex,ey) in C['eco'].items():
    b0=BRIDGES[k][0]; assert abs(b0[0]-ex)+abs(b0[1]-ey)<=6, f'eco {k} longe da ponte'
D=P['andar1']; check('andar1',D['entra'],on=D['volta']+D['descida']+D['foes']+D['musgoTrig']+[D['marco'],D['musgo']],near=D['bau']+D['estantes']+[D['pedestal'],D['gancho'],D['ofelia']])
F=P['fundo7']; check('fundo7',F['entra'],on=F['frente']+[F['jorge'],F['vesper']],near=[F['veio']])
open('/home/claude/rpg2/src/mapas7.js','w').write('// gerado por maps/cap7maps.py (validado: válvulas e pontes de eco simuladas)\nconst ROWS7 = '+json.dumps(M,ensure_ascii=False)+';\nconst POS7 = '+json.dumps(P,ensure_ascii=False)+';\n')
for k in M: print('\n'+k); print('\n'.join(f'{i:2} {r}' for i,r in enumerate(M[k])))
