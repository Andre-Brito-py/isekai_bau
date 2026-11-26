# Gera src/arte_rita2.js a partir das 3 folhas da Rita enviadas pelo usuário (mapa, batalha, retratos)
import numpy as np, base64, json, os
from PIL import Image
from scipy import ndimage
os.chdir(os.path.dirname(os.path.abspath(__file__)))
def mascara(a):
    r,g,b=a[...,0].astype(int),a[...,1].astype(int),a[...,2].astype(int)
    bg=(r>150)&(b>150)&(g<120)&(r-g>70)&(b-g>70)
    m=~bg
    m=ndimage.binary_opening(m,iterations=1)
    # tira franja rosada
    near=ndimage.binary_dilation(~m,iterations=2)
    rosa=(r>140)&(b>100)&(b>g+40)&(r>g+50)
    m&=~(near&rosa)
    return m
def celulas(path, cols, rows):
    im=np.array(Image.open(path).convert('RGB')); H,W=im.shape[:2]; m=mascara(im)
    d=ndimage.binary_dilation(m,iterations=3)
    for r in range(1,rows): yy=int(r*H/rows); d[yy-1:yy+2]=False   # separa as linhas da folha
    lab,n=ndimage.label(d)
    objs=ndimage.find_objects(lab)
    cw,ch=W/cols,H/rows; cel={}
    for i,s in enumerate(objs):
        y0,y1,x0,x1=s[0].start,s[0].stop,s[1].start,s[1].stop
        if (y1-y0)*(x1-x0)<400: continue
        cx,cy=(x0+x1)/2,(y0+y1)/2
        # o corpo decide a célula: centro de massa da metade de cima
        ys,xs=np.where((lab[s]==i+1)&m[s])
        top=ys<np.percentile(ys,40); hx=xs[top].mean()+x0; hy=ys.mean()+y0
        c,r=int(hx//cw),int(hy//ch)
        cel.setdefault((r,c),[]).append((s,i+1))
    out={}
    for (r,c),L in cel.items():
        y0=min(s[0].start for s,_ in L); y1=max(s[0].stop for s,_ in L); x0=min(s[1].start for s,_ in L); x1=max(s[1].stop for s,_ in L)
        sub=im[y0:y1,x0:x1]; mm=np.zeros(sub.shape[:2],bool)
        for s,k in L: mm|=(lab[y0:y1,x0:x1]==k)&m[y0:y1,x0:x1]
        out[(r,c)]=np.dstack([sub,mm*255]).astype(np.uint8)
    return out
def reduz(rgba,H,cores=36,flip=False,contorno=True):
    h,w=rgba.shape[:2]; W=max(1,round(w*H/h))
    a=rgba.astype(float)/255; pm=a[...,:3]*a[...,3:4]
    im=Image.fromarray((np.dstack([pm,a[...,3]])*255).astype(np.uint8),'RGBA')
    sm=np.array(im.resize((W,H),Image.BOX)).astype(float)/255
    al=sm[...,3]; rgb=np.where(al[...,None]>0.01,sm[...,:3]/np.maximum(al[...,None],1e-6),0)
    mask=al>0.42
    q=np.array(Image.fromarray((rgb.clip(0,1)*255).astype(np.uint8)).quantize(colors=cores,method=Image.MEDIANCUT).convert('RGB'))
    out=np.dstack([q,mask*255]).astype(np.uint8)
    r,g,b=out[...,0].astype(int),out[...,1].astype(int),out[...,2].astype(int)
    out[(r>120)&(b>90)&(b>g+30)&(r>g+40)&(b>r*0.55),3]=0

    if contorno:
        mk2=out[...,3]>0; ring=ndimage.binary_dilation(mk2)&~mk2; out[ring]=[42,16,20,255]
    if flip: out=out[:,::-1].copy()
    return out
def ancora(a):
    al=a[...,3]>0; ys,xs=np.where(al); top=ys<ys.min()+(ys.max()-ys.min())*0.28
    return int(round(xs[top].mean()))
def enc(a):
    h,w=a.shape[:2]; pal=[]; idx={}; data=bytearray()
    for y in range(h):
        for x in range(w):
            p=a[y,x]
            if p[3]<128: data.append(0); continue
            c='%02x%02x%02x'%tuple(p[:3])
            if c not in idx: idx[c]=len(pal)+1; pal.append(c)
            data.append(idx[c])
    assert len(pal)<255,len(pal)
    return {'w':w,'h':h,'p':''.join(pal),'d':base64.b64encode(bytes(data)).decode()}
M=celulas('rita_mapa.jpg',4,4); B=celulas('rita_batalha.jpg',4,5)
print('mapa',sorted(M.keys())); print('batalha',sorted(B.keys()))
HM=50; HB=52
mapa={'down':[reduz(M[(0,c)],HM) for c in range(4)], 'up':[reduz(M[(1,c)],HM) for c in range(4)], 'right':[reduz(M[(2,c)],HM) for c in (1,2,3)]}
bat={}
nomes={'idle':[(0,0),(0,1),(0,2),(0,3)],'pronta':[(1,0)],'recua':[(1,1)],'estoca':[(1,2)],'segue':[(1,3)],'guarda':[(2,0)],'varre':[(2,1)],'corre':[(2,2),(2,3)],'dor':[(3,0),(3,1)],'caida':[(3,2),(3,3)],'vitoria':[(4,2),(4,3)]}
for k,L in nomes.items():
    bat[k]=[]
    for rc in L:
        f=reduz(B[rc],HB,flip=True); bat[k].append(f)
# retratos: cabeça e ombros, quadrado
R=np.array(Image.open('rita_retratos.jpg').convert('RGB')); m=mascara(R); H,W=R.shape[:2]
ports=[]
for i in range(3):
    x0=int(i*W/3); x1=int((i+1)*W/3); sub=R[:,x0:x1]; mm=m[:,x0:x1]; ys,xs=np.where(mm)
    y0=ys.min(); cx=int(xs.mean()); s=int((ys.max()-y0)*0.98)
    a0=max(0,cx-s//2); crop=np.dstack([sub,mm*255]).astype(np.uint8)[y0:y0+s,a0:a0+s]
    ports.append(reduz(crop,48,cores=48,contorno=False))
js={'mapa':{k:[enc(f) for f in v] for k,v in mapa.items()},'bat':{k:[dict(enc(f),ax=ancora(f)) for f in v] for k,v in bat.items()},'port':[enc(p) for p in ports]}
open('../../src/arte_rita2.js','w').write('// gerado por build/arteia_rita/gerar_rita.py a partir das folhas da Rita enviadas pelo usuário\nconst ARTE_RITA2 = '+json.dumps(js,separators=(',',':'))+';\n')
# prévia
pv=Image.new('RGBA',(560,250),(40,32,52,255)); x=4
for k in ['down','up','right']:
    for f in mapa[k]: pv.alpha_composite(Image.fromarray(f),(x,4)); x+=f.shape[1]+3
x=4
for k,L in bat.items():
    for f in L:
        if x+f.shape[1]>556: x=4
        pv.alpha_composite(Image.fromarray(f),(x,70 if k in ('idle','pronta','recua','estoca','segue','guarda') else 130)); x+=f.shape[1]+3
x=4
for p in ports: pv.alpha_composite(Image.fromarray(p),(x,192)); x+=52
pv.resize((pv.width*3,pv.height*3),Image.NEAREST).save('previa.png')
from PIL import ImageDraw
pv2=Image.new('RGBA',(900,200),(40,32,52,255)); d=ImageDraw.Draw(pv2); x=4; y=14
for k,L in bat.items():
    for j,f in enumerate(L):
        if x+f.shape[1]>896: x=4; y+=90
        pv2.alpha_composite(Image.fromarray(f),(x,y)); d.text((x,y-12),k+str(j),fill=(255,255,255,255)); x+=f.shape[1]+8
pv2.resize((pv2.width*2,pv2.height*2),Image.NEAREST).save('previa_bat.png')
print(os.path.getsize('../../src/arte_rita2.js')//1024,'KB')
