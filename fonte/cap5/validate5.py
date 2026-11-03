exec(open('maps5.py').read())
SOLID='#~BcxrTKNPDHJYOMFLQXVW'
def check(name):
    m=M[name]; g=m['rows']; H=len(g); W=len(g[0]); ok=True
    if any(len(r)!=W for r in g): print(name,'widths',{len(r) for r in g}); ok=False
    occ={(e[2],e[3]) for e in m['ents'] if e[0] not in('enemy','patrol','door')}
    def pas(x,y): return 0<=x<W and 0<=y<H and g[y][x] not in SOLID and (x,y) not in occ
    exits=[(e[0],e[1]) for e in m['exits']]
    st=[exits[0]]; seen={exits[0]}
    while st:
        x,y=st.pop()
        for dx,dy in((1,0),(-1,0),(0,1),(0,-1)):
            n=(x+dx,y+dy)
            if n not in seen and pas(*n): seen.add(n); st.append(n)
    for e in exits:
        if e not in seen: print(name,'exit unreachable',e); ok=False
    for e in m['ents']:
        x,y=e[2],e[3]
        if e[0] in('enemy','patrol'):
            if g[y][x] not in '.,=' : print(name,'enemy on',g[y][x],e[1]); ok=False
            if e[0]=='patrol':
                for a,b in zip(e[4],e[4][1:]):
                    for xx in range(min(a[0],b[0]),max(a[0],b[0])+1):
                        for yy in range(min(a[1],b[1]),max(a[1],b[1])+1):
                            if not pas(xx,yy): print(name,'patrol path blocked',e[1],(xx,yy)); ok=False
            continue
        if e[0]=='door': continue
        if g[y][x] not in '.,=' and e[0]!='seal': print(name,'ent on',repr(g[y][x]),e[1]); ok=False
        if not any((x+dx,y+dy) in seen for dx,dy in((1,0),(-1,0),(0,1),(0,-1))) and e[1] not in ('fiscal',) : print(name,'unreachable',e[1]); ok=False
    for b in m.get('booms',[]):
        for t in b:
            if g[t[1]][t[0]] not in '.,' or t in exits or t in occ: print(name,'bad boom',t); ok=False
    print(name,'OK' if ok else 'FAIL', len(seen))
for k in M: check(k)
