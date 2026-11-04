from PIL import Image
import numpy as np
from scipy import ndimage
src=np.array(Image.open('lume.png').convert('RGB')).astype(float)
r,g,b=src[...,0],src[...,1],src[...,2]
fg=~((r>232)&(g>232)&(b>232))
BX=[(16,13,284,335),(306,20,553,336),(579,13,805,333),(834,25,1038,333),(1071,42,1249,346),(12,372,258,685),(269,372,532,681),(544,372,787,681),(785,461,1241,1124),(23,754,217,1070),(257,748,473,1070),(504,748,737,1070)]
F=8.0
for i,(x0,y0,x1,y1) in enumerate(BX):
    m=fg[y0:y1,x0:x1]; lab,n=ndimage.label(ndimage.binary_dilation(m,iterations=2)); s=ndimage.sum(m,lab,range(1,n+1)); big=np.argmax(s)+1
    keep=(lab==big)&m
    ys,xs=np.where(keep); ya,yb,xa,xb=ys.min(),ys.max()+1,xs.min(),xs.max()+1
    rgb=src[y0+ya:y0+yb,x0+xa:x0+xb]; mk=keep[ya:yb,xa:xb].astype(float)
    f=F*(2 if i==8 else 1)
    W=round((xb-xa)/f); H=round((yb-ya)/f)
    A=np.array(Image.fromarray(mk*255).resize((W,H),Image.BOX)).astype(float)/255
    C=np.stack([np.array(Image.fromarray(rgb[...,c]*mk).resize((W,H),Image.BOX)) for c in range(3)],-1)/np.maximum(A[...,None],1e-3)
    al=A>0.45
    Q=np.array(Image.fromarray(np.clip(C,0,255).astype(np.uint8)).quantize(colors=20,method=Image.Quantize.MEDIANCUT).convert('RGB')).astype(int)
    rgba=np.zeros((H,W,4),np.uint8); rgba[...,:3]=Q; rgba[...,3]=al*255
    edge=al&~ndimage.binary_erosion(al)
    pass
    Image.fromarray(rgba,'RGBA').save(f'lume_{i}.png'); print(i,W,H)
