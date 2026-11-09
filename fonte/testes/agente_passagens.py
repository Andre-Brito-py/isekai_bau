# agente que JOGA: anda de verdade com as setas, passando pelas passagens pedidas, e confere o mapa em que chegou.
import asyncio, json, sys
from playwright.async_api import async_playwright
ROTA = json.loads(sys.argv[1]); FLAGS = sys.argv[2]; START = sys.argv[3].split(':'); TAG = sys.argv[4]
PATH_JS = r"""(target) => {
  // busca em largura no estado (x, y, maré): andar, ou tocar um sino vizinho para trocar a maré
  const W = WD.map.rows[0].length, H = WD.map.rows.length, hasTide = typeof tideHigh === 'function';
  const goals = target[0] === '@' ? (() => { const [gx, gy] = target.slice(1).split(',').map(Number); return [[0,1],[0,-1],[1,0],[-1,0]].map(([a, c]) => ({ x: gx + a, y: gy + c })); })() : WD.map.exits.filter(e => e.to === target && (!e.cond || G.flags[e.cond]));
  if (!goals.length) return { err: 'sem saída para ' + target + ' em ' + WD.id };
  const t0 = G.flags.tide;
  const openT = (x, y, t) => { G.flags.tide = t; const r = x >= 0 && y >= 0 && x < W && y < H && passable(x, y, false); G.flags.tide = t0; return r; };
  const bells = WD.ents.filter(e => e.talk === 'bell');
  const T0 = hasTide ? (tideHigh() ? 'high' : 'low') : 'x';
  const k = (x, y, t) => x + ',' + y + ',' + t, prev = new Map(); prev.set(k(WD.x, WD.y, T0), null);
  const q = [[WD.x, WD.y, T0]]; let end = null;
  while (q.length) { const [x, y, t] = q.shift(); if (goals.some(g => g.x === x && g.y === y)) { end = [x, y, t]; break; }
    for (const [dx, dy, d] of [[0,-1,'up'],[0,1,'down'],[-1,0,'left'],[1,0,'right']]) {
      const nx = x + dx, ny = y + dy; if (!prev.has(k(nx, ny, t)) && openT(nx, ny, t)) { prev.set(k(nx, ny, t), [x, y, t, d]); q.push([nx, ny, t]); }
      if (hasTide && bells.some(b => b.x === nx && b.y === ny)) { const t2 = t === 'high' ? 'low' : 'high'; if (!prev.has(k(x, y, t2))) { prev.set(k(x, y, t2), [x, y, t, 'sino:' + d]); q.push([x, y, t2]); } } } }
  if (!end) return { err: 'sem caminho de ' + WD.id + ' ' + WD.x + ',' + WD.y + ' até ' + target };
  const dirs = []; let c = end; while (prev.get(k(c[0], c[1], c[2]))) { const p = prev.get(k(c[0], c[1], c[2])); dirs.unshift(p[3]); c = [p[0], p[1], p[2]]; }
  return { dirs };
}"""
KEY = {'up': 'ArrowUp', 'down': 'ArrowDown', 'left': 'ArrowLeft', 'right': 'ArrowRight'}
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome'); pg = await b.new_page()
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file:///home/claude/rpg/Renasci-como-Bau-offline.html'); await pg.wait_for_timeout(700)
        await pg.evaluate(f"V.titleTok=null; UI.stack.length=0; G=newState(); G.name='Agente'; G.species='bastiao'; Object.assign(G.flags,{FLAGS}); applySave(G); V.fade=0; loadMap('{START[0]}',{START[1]},{START[2]},'up'); V.scene='world'")
        ok = True
        for alvo in ROTA:
            await pg.evaluate("WD.ents = WD.ents.filter(e => e.kind !== 'enemy')")  # o teste é sobre a passagem, não sobre as lutas
            r = await pg.evaluate(PATH_JS, alvo)
            if 'err' in r: print('  FALHOU:', r['err']); ok = False; break
            antes = await pg.evaluate("WD.id")
            for d in r['dirs']:
                for _ in range(200):  # espera ficar livre (diálogos: aperta A)
                    st = await pg.evaluate("[WD.moving, UI.stack.length, V.scene, !!V.tw || V.busy > 0]")
                    if st[2] == 'battle': await pg.evaluate("BT.on=false; V.scene='world'; UI.stack.length=0")
                    if st[1]: await pg.keyboard.press('z'); await pg.wait_for_timeout(80); continue
                    if st[0] <= 0 and not st[3]: break
                    await pg.wait_for_timeout(30)
                if d.startswith('sino:'):
                    dd = d[5:]; maré = await pg.evaluate("G.flags.tide")
                    await pg.keyboard.down(KEY[dd]); await pg.wait_for_timeout(45); await pg.keyboard.up(KEY[dd]); await pg.wait_for_timeout(150)
                    for _ in range(60):
                        st = await pg.evaluate("[UI.stack.length, G.flags.tide]")
                        if st[1] != maré and not st[0]: break
                        await pg.keyboard.press('z'); await pg.wait_for_timeout(160)
                    print('    toca o sino: maré', maré or 'high', '->', await pg.evaluate("G.flags.tide")); continue
                pos = await pg.evaluate("[WD.id, WD.x, WD.y]")
                for tent in range(4):
                    await pg.keyboard.down(KEY[d]); await pg.wait_for_timeout(50); await pg.keyboard.up(KEY[d])
                    moved = False
                    for _ in range(25):
                        await pg.wait_for_timeout(25)
                        if await pg.evaluate("[WD.id, WD.x, WD.y]") != pos: moved = True; break
                    if moved: break
                if not moved: print('    não andou para', d, 'em', pos)
            for _ in range(80):
                st = await pg.evaluate("[WD.id, UI.stack.length]")
                if st[1]: await pg.keyboard.press('z')
                if (st[0] == alvo or alvo[0] == '@') and not st[1]: break
                await pg.wait_for_timeout(100)
            agora = await pg.evaluate("[WD.id, WD.x, WD.y, WD.map.name]")
            passou = agora[0] == alvo or (alvo[0] == '@' and abs(agora[1] - int(alvo[1:].split(',')[0])) + abs(agora[2] - int(alvo[1:].split(',')[1])) == 1)
            print(f"  {antes} -> {alvo}: {'OK' if passou else 'FALHOU'} (chegou em {agora[3]} {agora[1]},{agora[2]}, {len(r['dirs'])} passos)")
            await pg.locator('#screen').screenshot(path=f'shots/ag_{TAG}_{alvo}.png')
            if not passou: ok = False; break
        print('RESULTADO', TAG, 'OK' if ok and not errs else 'FALHOU', errs[:2]); await b.close()
asyncio.run(main())
