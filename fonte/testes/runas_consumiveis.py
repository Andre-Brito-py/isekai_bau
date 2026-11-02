# v1.6: runas consumíveis — teste funcional
import asyncio, json
from playwright.async_api import async_playwright
OUT='/tmp/claude-0/-home-claude/21d632bd-691d-5171-96af-6be176f77e4e/scratchpad/shots/'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        pg = await b.new_page(viewport={'width':480,'height':800})
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file:///home/claude/rpg/Renasci-como-Bau-offline.html'); await pg.wait_for_timeout(1200)
        async def key(k, n=1):
            for _ in range(n):
                await pg.evaluate(f"press('{k}')"); await pg.wait_for_timeout(60); await pg.evaluate(f"release('{k}')"); await pg.wait_for_timeout(90)
        async def shot(name): await pg.locator('#screen').screenshot(path=OUT+name+'.png')
        async def clear():
            for _ in range(40):
                t = await pg.evaluate("UI.top() ? UI.top().type : null")
                if t != 'dialog': return
                await key('a'); await pg.wait_for_timeout(250)
        await pg.evaluate("V.titleTok=null; UI.stack.length=0; G=newState(); G.name='Ravi'; G.flags.introDone=true; loadMap('poco',2,7,'down'); V.scene='world'; V.fade=0")
        await pg.wait_for_timeout(300)
        await pg.evaluate("window._d=false; void runScript(async()=>{ await giveRune('brasa'); await giveRune('dardo'); await giveRune('brasa',false,1); window._d=true; })")
        for _ in range(30):
            await clear()
            if await pg.evaluate("_d"): break
        print('apos giveRune', await pg.evaluate("JSON.stringify(G.rq)"))
        # criar feitiço
        await pg.evaluate("window._d=false; void runScript(async()=>{ await craft(); window._d=true; })"); await pg.wait_for_timeout(300)
        await clear()  # tutoriais
        await shot('craft_el'); await key('a'); await pg.wait_for_timeout(200); await key('a'); await pg.wait_for_timeout(200); await key('a'); await pg.wait_for_timeout(300)
        await shot('craft_prev'); await key('a'); await pg.wait_for_timeout(400)
        await pg.evaluate("const i=document.querySelector('#ti'); if(i) i.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter'}))"); await pg.wait_for_timeout(300)
        for _ in range(10):
            await clear()
            if await pg.evaluate("_d"): break
        print('apos criar', await pg.evaluate("JSON.stringify({rq:G.rq, sp:G.spells.map(s=>s.name)})"))
        # sem runas de forma: tentar criar de novo duas vezes
        await pg.evaluate("window._d=false; void runScript(async()=>{ await craft(); window._d=true; })"); await pg.wait_for_timeout(300)
        await key('a',3); await pg.wait_for_timeout(300); await key('a'); await pg.wait_for_timeout(400)
        await pg.evaluate("const i=document.querySelector('#ti'); if(i) i.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter'}))"); await pg.wait_for_timeout(300)
        for _ in range(10):
            await clear()
            if await pg.evaluate("_d"): break
        await pg.evaluate("window._d=false; void runScript(async()=>{ await craft(); window._d=true; })"); await pg.wait_for_timeout(300)
        await shot('craft_sem_runas')
        for _ in range(10):
            await clear()
            if await pg.evaluate("_d"): break
        print('sem runas', await pg.evaluate("JSON.stringify({rq:G.rq, n:G.spells.length})"))
        # menu de runas
        await pg.evaluate("addRune('geada',3); addRune('onda',2); addRune('eco',1); addRune('seiva',1); window._d=false; void runScript(async()=>{ await runesMenu(); window._d=true; })"); await pg.wait_for_timeout(300)
        await shot('menu_runas'); await key('b'); await pg.wait_for_timeout(200)
        # fusão: elevar 3 comuns -> 1 incomum (veu desconhecida -> só onda)
        await pg.evaluate("window._d=false; void runScript(async()=>{ await fuseMenu(); window._d=true; })"); await pg.wait_for_timeout(300)
        await clear(); await key('down'); await shot('fuse_menu'); await key('a'); await pg.wait_for_timeout(250)
        await shot('fuse_rar'); await key('a'); await pg.wait_for_timeout(250)
        await shot('fuse_ing'); await key('a'); await key('a'); await key('a'); await pg.wait_for_timeout(250)
        await shot('fuse_out'); await key('a'); await pg.wait_for_timeout(300); await shot('fuse_done'); await clear()
        await key('b'); await pg.wait_for_timeout(300)
        print('apos fusao', await pg.evaluate("JSON.stringify({rq:G.rq, d:_d})"))
        # drops por área
        res = await pg.evaluate("""(()=>{ const out={}; G.runes=Object.keys(RUNES); for(const m of ['galeria','poco','teatro','patio','scriptorium']){ WD.id=m; const c={}; let n=0; for(let i=0;i<4000;i++){ G.rq={}; BT.en=[{d:{}}]; const r=runeDrops(); r.forEach(id=>{c[rar(id)]=(c[rar(id)]||0)+1}); n+=r.length; } const cb={}; for(let i=0;i<1000;i++){ BT.en=[{d:{boss:true}}]; runeDrops().forEach(id=>{cb[rar(id)]=(cb[rar(id)]||0)+1}); } out[m]={taxa:(n/4000).toFixed(2), normal:c, chefe:cb}; } return JSON.stringify(out); })()""")
        print('drops', res)
        # migração de save antigo
        r = await pg.evaluate("""(()=>{ const d=JSON.parse(JSON.stringify(newState())); delete d.rq; d.runes=['brasa','dardo','seiva','veu','geada']; d.map='biblioteca'; d.x=8; d.y=6; applySave(d); return JSON.stringify({rq:G.rq, gone:Object.keys(G.gone)}); })()""")
        print('migracao', r)
        await pg.wait_for_timeout(400); await shot('biblioteca_migrada')
        print('erros', errs)
        await b.close()
asyncio.run(main())
