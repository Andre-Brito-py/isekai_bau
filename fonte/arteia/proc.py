from PIL import Image
import numpy as np, json, sys
from scipy import ndimage
F=float(sys.argv[1]) if len(sys.argv)>1 else 6.4
src=np.array(Image.open('elenco.png').convert('RGB')).astype(float)
r,g,b=src[...,0],src[...,1],src[...,2]
mag=(r>140)&(b>140)&(g<110)&(np.abs(r-b)<90)
fg=~mag
lab,n=ndimage.label(ndimage.binary_opening(fg,iterations=1))
coms=ndimage.center_of_mass(fg,lab,range(1,n+1)); sizes=ndimage.sum(fg,lab,range(1,n+1))
BOX={'jorge':(20,15,205,340),'tiago':(212,15,395,340),'marlene':(395,15,610,340),'neide':(615,15,770,340),'ozorio':(775,15,960,340),'duda':(960,15,1160,340),'valdir':(1155,15,1510,340),
 'rita':(5,340,218,700),'brida':(218,340,392,700),'maren':(392,340,592,700),'ofelia':(592,340,746,700),'clara':(746,340,884,700),'pip':(884,390,982,700),'nina':(982,390,1082,700),'tolo':(1082,390,1186,700),'anselmo':(1186,340,1348,700),'escriba':(1348,340,1535,700),
 'lume':(220,700,480,1010),'musgo':(480,690,820,1010),'cida':(825,730,1040,1000),'bento':(1055,760,1310,1000)}
out={}
for k,(x0,y0,x1,y1) in BOX.items():
    keep=np.zeros_like(fg)
    for i,(cy,cx) in enumerate(coms):
        if sizes[i]<25: continue
        if x0<=cx<x1 and y0<=cy<y1: keep|=(lab==i+1)
    if k=='lume':  # tira as notas musicais soltas
        sub=keep.copy(); l2,n2=ndimage.label(sub); s2=ndimage.sum(sub,l2,range(1,n2+1)); big=np.argmax(s2)+1; keep=(l2==big)|ndimage.binary_dilation(l2==big,iterations=6)&keep
    ys,xs=np.where(keep); ya,yb,xa,xb=ys.min(),ys.max()+1,xs.min(),xs.max()+1
    rgb=src[ya:yb,xa:xb]; m=keep[ya:yb,xa:xb].astype(float)
    W=max(1,round((xb-xa)/F)); H=max(1,round((yb-ya)/F))
    # média ponderada pela máscara (sem o magenta das bordas)
    rgbm=rgb*m[...,None]
    A=np.array(Image.fromarray(m*255).resize((W,H),Image.BOX)).astype(float)/255
    C=np.stack([np.array(Image.fromarray(rgbm[...,c]).resize((W,H),Image.BOX)) for c in range(3)],-1)
    C=C/np.maximum(A[...,None],1e-3)
    alpha=A>0.45
    # paleta reduzida por personagem
    img=Image.fromarray(np.clip(C,0,255).astype(np.uint8))
    q=img.quantize(colors=18,method=Image.Quantize.MEDIANCUT).convert('RGB')
    Q=np.array(q).astype(int)
    # contorno: pixel opaco na borda vira o tom mais escuro do vizinho (contorno colorido)
    rgba=np.zeros((H,W,4),np.uint8); rgba[...,:3]=Q; rgba[...,3]=alpha*255
    edge=alpha & ~ndimage.binary_erosion(alpha)
    lum=Q.sum(-1)
    for y,x in zip(*np.where(edge)):
        c=Q[y,x]; rgba[y,x,:3]=np.clip(c*0.45+np.array([20,10,40])*0.55,0,255)
    Image.fromarray(rgba,'RGBA').save(f'sp_{k}.png'); out[k]=(W,H)
print(out)
