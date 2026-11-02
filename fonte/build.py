import json
src='/home/claude/rpg/src/'
head=open(src+'head.html').read()
font=open('/home/claude/rpg/build/font.json').read()
js=''.join(open(src+f).read()+'\n' for f in ['sprites.js','audio.js','data.js','main.js','data2.js'])
html=head+'\n<script>\nconst FONT='+font+';\n'+js+'boot();\n</script>\n'
open('/home/claude/rpg/renasci-como-bau.html','w').write(html)
# standalone version with doctype for offline use
full='<!doctype html>\n<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">\n<style>:root{box-sizing:border-box;height:100%;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}*,*::before,*::after{box-sizing:inherit}html,body{margin:0}body{height:100%}[hidden]{display:none!important}</style>\n</head><body>\n'+html+'</body></html>\n'
open('/home/claude/rpg/Renasci-como-Bau-offline.html','w').write(full)
print(len(html))

# PWA
pw='/home/claude/rpg/pwa/'
h=full.replace('</head>','<link rel="manifest" href="manifest.webmanifest"><link rel="icon" href="icon-192.png"><link rel="apple-touch-icon" href="apple-touch-icon.png"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes">\n</head>',1)
h=h.replace('</body>',"<script>if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost'))navigator.serviceWorker.register('sw.js');</script>\n</body>",1)
open(pw+'index.html','w').write(h)
import re
sw=open(pw+'sw.js').read(); m=re.search(r"bau-v(\d+)",sw); sw=sw.replace(m.group(0),'bau-v'+str(int(m.group(1))+1)); open(pw+'sw.js','w').write(sw)
