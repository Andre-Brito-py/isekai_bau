# agente de conectividade: para cada mapa, parte de todos os pontos de chegada e tenta alcançar todas as saídas,
# usando as próprias regras de passagem do jogo (passable/solidTile/entidades). Dois perfis de progresso.
import asyncio, json, sys
from playwright.async_api import async_playwright
JS = r"""
(profile) => {
  const P = {
    cap4: {introDone:1,lumeJoined:1,ch1done:1,bossDone:1,gateOpen:1,octoDone:1,bridaDone:1,ch2done:1,ch3open:1,ch3done:1,knightDone:0,ch4open:1},
  };
  const res = [];
  const all = profile === 'tudo';
  const savedR = Math.random;
  for (const [id, m] of Object.entries(MAPS)) {
    G = newState(); G.name = 'Teste'; G.species = 'bastiao';
    if (all) G.flags = new Proxy({}, { get: (t, k) => (k in t ? t[k] : (typeof k === 'string' ? true : undefined)), set: (t, k, v) => { t[k] = v; return true; } });
    else { Object.assign(G.flags, P[profile]);
      // selos e portas que um jogador no Cap. 4 já abriu (Caps. 1 a 3)
      for (const k of ['despertar','galeria','biblioteca','poco','antessala','patamar','mercado','acampamento','teatro','ponte','escadaria3','muralhas','patio','jaula','scriptorium']) for (const e of (MAPS[k].ents || [])) { if (e.kind === 'seal' && e.flag) G.flags[e.flag] = 1; if (e.kind === 'door' && e.flag) G.flags[e.flag] = 1; } }
    try { loadMap(id, 1, 1, 'down'); } catch (e) { res.push({ id, erro: String(e) }); continue; }
    const W = m.rows[0].length, H = m.rows.length;
    const arr = [];
    for (const [k2, m2] of Object.entries(MAPS)) for (const ex of (m2.exits || [])) if (ex.to === id) arr.push({ x: ex.tx, y: ex.ty, from: k2 });
    const open = (x, y) => { if (x < 0 || y < 0 || x >= W || y >= H) return false;
      if (typeof tideHigh === 'function' && 'ab'.includes(tileAt(x, y))) return !WD.ents.some(e => e.x === x && e.y === y && e.kind !== 'enemy' && e.kind !== 'seal');
      return passable(x, y, false); };
    const seen = new Set(), q = [];
    const bad = [];
    for (const a of arr) { if (!open(a.x, a.y)) bad.push(`chegada de ${a.from} em ${a.x},${a.y} cai em '${tileAt(a.x, a.y)}' bloqueado`); const k = a.x + ',' + a.y; if (!seen.has(k)) { seen.add(k); q.push([a.x, a.y]); } }
    while (q.length) { const [x, y] = q.shift(); for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) { const nx = x + dx, ny = y + dy, k = nx + ',' + ny; if (seen.has(k) || !open(nx, ny)) continue; seen.add(k); q.push([nx, ny]); } }
    const exits = (m.exits || []).filter(e => !e.cond || G.flags[e.cond]);
    for (const e of exits) if (!seen.has(e.x + ',' + e.y)) bad.push(`saída ${e.x},${e.y} -> ${e.to} inalcançável (tile '${tileAt(e.x, e.y)}')`);
    res.push({ id, chegadas: arr.length, saidas: exits.length, bad });
  }
  return res;
}
"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome'); pg = await b.new_page()
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file:///home/claude/rpg/Renasci-como-Bau-offline.html'); await pg.wait_for_timeout(700)
        await pg.evaluate("V.titleTok=null; UI.stack.length=0; V.scene='world'")
        for prof in ['cap4', 'tudo']:
            r = await pg.evaluate(JS, prof)
            print('=== perfil', prof)
            for m in r:
                if m.get('erro') or m['bad']: print(' ', m['id'], m.get('erro', ''), *m['bad'], sep='\n    ')
            print('  mapas verificados:', len(r), ' com problema:', sum(1 for m in r if m.get('erro') or m['bad']))
        print('erros js', errs[:3]); await b.close()
asyncio.run(main())
