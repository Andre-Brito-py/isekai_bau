import numpy as np
from PIL import Image
from scipy import ndimage
SRC=np.array(Image.open('moca_folha.png').convert('RGB')).astype(int)
def recorte(x0,y0,x1,y1):
    a=SRC[y0:y1,x0:x1]; r,g,b=a[...,0],a[...,1],a[...,2]
    bg=(r>170)&(b>170)&(g<110)
    # franja rosada perto do fundo
    near=ndimage.binary_dilation(bg,iterations=2)
    pink=(r>140)&(b>110)&(g<r*0.62)&(b>g*1.3)
    al=~bg & ~(near&pink)
    al=ndimage.binary_opening(al,iterations=1)|(al&~ndimage.binary_erosion(al,iterations=1)&False)
    rgba=np.dstack([a.clip(0,255),al*255]).astype(np.uint8)
    return rgba
def reduz(rgba,H=None,W=None,cores=28,contorno=True):
    h,w=rgba.shape[:2]
    if H: W=max(1,round(w*H/h))
    else: H=max(1,round(h*W/w))
    a=rgba.astype(float)/255; pm=a[...,:3]*a[...,3:4]
    im=Image.fromarray((np.dstack([pm,a[...,3]])*255).astype(np.uint8),'RGBA')
    sm=np.array(im.resize((W,H),Image.BOX)).astype(float)/255
    al=sm[...,3]; rgb=np.where(al[...,None]>0.01,sm[...,:3]/np.maximum(al[...,None],1e-6),0)
    mask=al>0.45
    rgb8=(rgb.clip(0,1)*255).astype(np.uint8)
    q=Image.fromarray(rgb8).quantize(colors=cores,method=Image.MEDIANCUT).convert('RGB')
    out=np.dstack([np.array(q),mask*255]).astype(np.uint8)
    if contorno:
        ring=ndimage.binary_dilation(mask)&~mask
        out[ring]=[46,22,18,255]
    return out
def recorta_alpha(a):
    ys,xs=np.where(a[...,3]>0); return a[ys.min():ys.max()+1,xs.min():xs.max()+1]
