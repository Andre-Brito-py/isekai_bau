# Gera src/arte_moca.js a partir da folha da moça da barca enviada pelo usuário (moca_folha.png)
import numpy as np, base64, json, os
from PIL import Image, ImageEnhance
os.chdir(os.path.dirname(os.path.abspath(__file__)))
from proc import recorte, reduz, recorta_alpha
def limpa(a):
    r,g,b=a[...,0].astype(int),a[...,1].astype(int),a[...,2].astype(int)
    rosa=(r>140)&(b>100)&(b>g+35)&(r>g+60)
    a=a.copy(); a[rosa,3]=0; return a
def retrato(x0):
    sq=recorte(x0+30,704,x0+214,966)
    rgb=ImageEnhance.Contrast(Image.fromarray(sq[...,:3])).enhance(1.15)
    small=np.array(rgb.resize((44,62),Image.LANCZOS)); m=np.array(Image.fromarray(sq[...,3]).resize((44,62),Image.BOX))>110
    q=np.array(Image.fromarray(small).quantize(colors=40,method=Image.MEDIANCUT).convert('RGB'))
    return limpa(np.dstack([q,m*255]).astype(np.uint8))
def enc(a):
    h,w=a.shape[:2]; pal=[]; idx={}; data=bytearray()
    for y in range(h):
        for x in range(w):
            p=a[y,x]
            if p[3]<128: data.append(0); continue
            c='%02x%02x%02x'%tuple(p[:3])
            if c not in idx: idx[c]=len(pal)+1; pal.append(c)
            data.append(idx[c])
    assert len(pal)<255
    return {'w':w,'h':h,'p':''.join(pal),'d':base64.b64encode(bytes(data)).decode()}
front=recorta_alpha(recorte(10,3,388,692)); side=recorta_alpha(recorte(418,3,753,692)); back=recorta_alpha(recorte(753,3,1068,693))
peek=recorta_alpha(recorte(1084,401,1305,557))
S={'frente':limpa(reduz(front,H=56)),'lado':limpa(reduz(side,H=56)),'costas':limpa(reduz(back,H=56)),
   'espia':limpa(reduz(peek,W=20)),'grande':limpa(reduz(front,H=120,cores=48))}
R=[retrato(x0) for x0 in (10,274,530,776,1049)]
out={'sp':{k:enc(v) for k,v in S.items()},'port':[enc(r) for r in R]}
js='// gerado por build/arteia_moca/gerar_moca.py a partir da folha enviada pelo usuário (não editar à mão)\nconst ARTE_MOCA = '+json.dumps(out,separators=(',',':'))+';\n'
open('../../src/arte_moca.js','w').write(js); print('ok',len(js)//1024,'KB')
pv=Image.new('RGBA',(5*48+80,128),(28,22,40,255))
for i,r in enumerate(R): pv.alpha_composite(Image.fromarray(r),(i*48+2,2))
pv.alpha_composite(Image.fromarray(S['grande']),(5*48+10,4)); pv.alpha_composite(Image.fromarray(S['espia']),(2,100)); pv.alpha_composite(Image.fromarray(S['frente']),(30,68))
pv.resize((pv.width*4,pv.height*4),Image.NEAREST).save('previa2.png')
