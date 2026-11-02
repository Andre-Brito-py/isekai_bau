import json
src='/home/claude/rpg/src/'
head=open(src+'head.html').read()
font=open('/home/claude/rpg/build/font.json').read()
js=''.join(open(src+f).read()+'\n' for f in ['sprites.js','audio.js','data.js','main.js'])
html=head+'\n<script>\nconst FONT='+font+';\n'+js+'</script>\n'
open('/home/claude/rpg/renasci-como-bau.html','w').write(html)
# standalone version with doctype for offline use
full='<!doctype html>\n<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">\n<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}html,body{margin:0}[hidden]{display:none!important}</style>\n</head><body>\n'+html+'</body></html>\n'
open('/home/claude/rpg/Renasci-como-Bau-offline.html','w').write(full)
print(len(html))
