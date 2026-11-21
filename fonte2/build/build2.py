import json, re, collections
src='/home/claude/rpg2/src/'
head=open(src+'head.html').read()
font=open('/home/claude/rpg/build/font.json').read()
harte=open('/home/claude/rpg2/build/heranca_arte.json').read()
files=['core.js','audio.js','tracks2.js','art2.js','battle2.js','cap1.js']
js=''.join(open(src+f).read()+'\n' for f in files)
dups=[k for k,v in collections.Counter(re.findall(r'(?m)^(?:async )?function (\w+)', js)).items() if v>1]
if dups: raise SystemExit('ERRO: funções duplicadas: '+', '.join(dups))
html=head+'\n<script>\nconst FONT='+font+';\nconst HARTE='+harte+';\n'+js+'boot2();\n</script>\n'
open('/home/claude/rpg2/out/renasci2.html','w').write(html)
full='<!doctype html>\n<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">\n<style>:root{box-sizing:border-box;height:100%;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}*,*::before,*::after{box-sizing:inherit}html,body{margin:0}body{height:100%}[hidden]{display:none!important}</style>\n</head><body>\n'+html+'</body></html>\n'
open('/home/claude/rpg2/out/index.html','w').write(full)
print(len(html))
