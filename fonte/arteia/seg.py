import sys, numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
def seg(fn, dil=3, minarea=600):
    src=np.array(Image.open(fn).convert('RGB')).astype(int); r,g,b=src[...,0],src[...,1],src[...,2]
    mag=(r>140)&(b>140)&(g<110)&(np.abs(r-b)<90)
    fg=~mag; fg=ndimage.binary_opening(fg,iterations=1)
    lab,n=ndimage.label(ndimage.binary_dilation(fg,iterations=dil))
    objs=ndimage.find_objects(lab); bx=[]
    for i,s in enumerate(objs):
        a=(fg[s]&(lab[s]==i+1)).sum()
        if a>=minarea: bx.append((s[1].start,s[0].start,s[1].stop,s[0].stop))
    return src,bx
if __name__=='__main__':
    fn=sys.argv[1]; dil=int(sys.argv[2]) if len(sys.argv)>2 else 3
    src,bx=seg(fn,dil)
    rows={}
    for b in bx: rows.setdefault(round(((b[1]+b[3])/2)/40),[]).append(b)
    im=Image.open(fn).convert('RGB'); d=ImageDraw.Draw(im); k=0
    for key in sorted(rows):
        for b in sorted(rows[key]):
            d.rectangle(b,outline=(0,255,0)); d.text((b[0]+2,b[1]+2),str(k),fill=(255,255,0)); print(k,b); k+=1
    im.save('seg_'+fn)
