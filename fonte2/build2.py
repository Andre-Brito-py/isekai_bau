import json, re, collections
src='/home/claude/rpg2/src/'
head=open(src+'head.html').read()
font=open('/home/claude/rpg/build/font.json').read()
harte=open('/home/claude/rpg2/build/heranca_arte.json').read()
files=['core.js','audio.js','tracks2.js','art2.js','battle2.js','fx2.js','cap1.js','arte_mundo.js','world2.js','arte_cap2.js','grupo2.js','mapas2.js','inimigos2.js','cap2.js','anim2.js','tempo2.js','economia2.js','taverna2.js','atencao2.js','arte_rosto.js','forma2.js','hld2.js','mapas3.js','arte_cap3.js','inimigos3.js','grimorio3.js','cap3.js','fx3.js','status3.js','arte_cap3b.js','inimigos3b.js','evolucao3.js','cap3b.js','mapas4.js','arte_cap4.js','inimigos4.js','cap4.js','fx4.js','anda.js','nivel.js','igreja2.js','tecnicas_nv.js']
js=''.join(open(src+f).read()+'\n' for f in files)
dups=[k for k,v in collections.Counter(re.findall(r'(?m)^(?:async )?function (\w+)', js)).items() if v>1]
if dups: raise SystemExit('ERRO: funções duplicadas: '+', '.join(dups))
html=head+'\n<script>\nconst FONT='+font+';\nconst HARTE='+harte+';\n'+js+'boot2();\n</script>\n'
open('/home/claude/rpg2/out/renasci2.html','w').write(html)
full='<!doctype html>\n<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">\n<style>:root{box-sizing:border-box;height:100%;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}*,*::before,*::after{box-sizing:inherit}html,body{margin:0}body{height:100%}[hidden]{display:none!important}</style>\n</head><body>\n'+html+'</body></html>\n'
open('/home/claude/rpg2/out/index.html','w').write(full)
print(len(html))

# PWA da Temporada 2 (pasta /t2/ do site, com manifesto, ícones e service worker próprios)
import re as _re, shutil
pw='/home/claude/rpg2/pwa/'
# sem manifesto próprio: a T2 abre de dentro do app da T1 (menu "Temporada 2"); um manifesto aqui fazia o Chrome confundir os dois
h=full.replace('</head>','<link rel="icon" href="icon-192.png"><meta name="theme-color" content="#0b0912">\n</head>',1)
h=h.replace('</body>',"<script>if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost'))navigator.serviceWorker.register('sw.js',{scope:'./',updateViaCache:'none'}).then(r=>r.update()).catch(()=>{});</script>\n</body>",1)
open(pw+'index.html','w').write(h)
sw=open(pw+'sw.js').read(); m=_re.search(r"bau2-v(\d+)",sw); sw=sw.replace(m.group(0),'bau2-v'+str(int(m.group(1))+1)); open(pw+'sw.js','w').write(sw)
