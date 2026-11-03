exec(open('maps4.py').read())
M['fundo']['exits']=[(10,0,'correio',11,18),(11,0,'correio',12,18)]
SOLID='#~BcxrTKNPDHJYOMFL'
def passable(m,x,y,tide,occ):
    g=m['rows']
    if not(0<=y<len(g) and 0<=x<len(g[0])): return False
    c=g[y][x]
    if (x,y) in occ: return False
    if c=='a': return tide=='low'
    if c=='b': return tide=='high'
    return c not in SOLID
def check(name):
    m=M[name]; occ={(e[2],e[3]) for e in m['ents'] if e[0] not in('enemy','door')}
    exits=[(e[0],e[1]) for e in m['exits']]
    bells=[(e[2],e[3]) for e in m['ents'] if e[0]=='bell']
    targets=[(e[1],e[2],e[3]) for e in m['ents'] if e[0] not in('enemy','door')]
    def nb(s):
        x,y,t=s
        for dx,dy in((1,0),(-1,0),(0,1),(0,-1)):
            if passable(m,x+dx,y+dy,t,occ): yield (x+dx,y+dy,t)
            if (x+dx,y+dy) in bells: yield (x,y,'low' if t=='high' else 'high')
    def reach(starts):
        seen=set(starts); st=list(starts)
        while st:
            s=st.pop()
            for n in nb(s):
                if n not in seen: seen.add(n); st.append(n)
        return seen
    ok=True
    for (ex,ey) in exits:
        for t in('low','high'):
            R=reach([(ex,ey,t)])
            pos={(x,y) for x,y,_ in R}
            miss=[tid for tid,x,y in targets if not any((x+dx,y+dy) in pos for dx,dy in((1,0),(-1,0),(0,1),(0,-1)))]
            missx=[(x,y) for x,y in exits if (x,y) not in pos]
            if miss or missx: ok=False; print(name,'from',(ex,ey),t,'MISSING',miss,missx)
            # softlock: from every state, all exits reachable
            for s in list(R)[::7]:
                R2=reach([s]); p2={(x,y) for x,y,_ in R2}
                if any(e not in p2 for e in exits): ok=False; print(name,'STUCK at',s); break
    # enemies on passable tiles?
    for e in m['ents']:
        if e[0]=='enemy':
            c=m['rows'][e[3]][e[2]]
            if c not in '.,R': print(name,'enemy on',repr(c),e[1]); ok=False
        else:
            c=m['rows'][e[3]][e[2]]
            if c not in '.,R' and e[0] not in ('npc2','boss3','door'): print(name,'ent on',repr(c),e[1])
    for (bx_,by_) in bells:
        for dx,dy in((1,0),(-1,0),(0,1),(0,-1)):
            if m['rows'][by_+dy][bx_+dx] in 'ab': print(name,'bell next to tidal tile',(bx_,by_)); ok=False
    print(name,'OK' if ok else 'FAIL')
for k in M: check(k)
