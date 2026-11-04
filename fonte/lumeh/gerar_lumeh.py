# gera src/arte_lumeh.js: a Lume em forma humana (corpo 42px e retrato 32x32), arte original
import sys, json
sys.path.insert(0, '/home/claude/rpg/build/lumeh'); sys.path.insert(0, '/home/claude/rpg/build/arteia')
from px import body, portrait
from ext import enc, same
B = same([body(), body(sway=1, flick=1), body(), body(blink=True)])
Pt = [portrait(), portrait(talk=True), portrait(blink=True)]
out = {'body': [enc(x) for x in B], 'port': [enc(x) for x in Pt]}
open('/home/claude/rpg/src/arte_lumeh.js', 'w').write('// gerado por build/lumeh/gerar_lumeh.py (Lume humana, arte original; não editar à mão)\nconst ARTE_LUMEH = ' + json.dumps(out, separators=(',', ':')) + ';\n')
print('ok', [(x.shape) for x in B])
