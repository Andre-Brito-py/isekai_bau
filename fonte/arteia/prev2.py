import json, base64, numpy as np
from PIL import Image
s=open('/home/claude/rpg/src/arte_ia2.js').read(); D=json.loads(s[s.index('{'):s.rindex('}')+1])
def dec(e):
    b=base64.b64decode(e['d']); P=[tuple(int(e['p'][i:i+2],16) for i in (j,j+2,j+4)) for j in range(0,len(e['p']),6)]
    a=np.zeros((e['h'],e['w'],4),np.uint8)
    for i,k in enumerate(b):
        if k: y,x=divmod(i,e['w']); a[y,x,:3]=P[k-1]; a[y,x,3]=255
    return Image.fromarray(a)
Z=3; tiles=[]
for k,v in D['sp'].items(): tiles.append(dec(v[0]))
for k,v in D['chest'].items(): tiles += [dec(x) for x in v['map']] + [dec(v['bat'][0])]
for k,v in D['human'].items(): tiles += [dec(v['body'][0]), dec(v['big'][0]), dec(v['big'][1]), dec(v['port'][2])]
cols=20; cw=56; rows=(len(tiles)+cols-1)//cols
o=Image.new('RGBA',(cols*cw*Z,rows*cw*Z),(46,40,58,255))
for i,t in enumerate(tiles):
    t=t.resize((t.width*Z,t.height*Z),Image.NEAREST); o.alpha_composite(t,((i%cols)*cw*Z+4,(i//cols)*cw*Z+(cw*Z-t.height)-4))
o.save('prev2.png'); print(o.size, len(tiles))
