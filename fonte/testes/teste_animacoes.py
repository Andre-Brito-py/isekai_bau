import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome'); pg = await b.new_page(viewport={'width':480,'height':800}); errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file:///home/claude/rpg/Renasci-como-Bau-offline.html'); await pg.wait_for_timeout(1200)
        await pg.evaluate("V.titleTok=null; UI.stack.length=0; G=newState(); G.name='Ravi'; G.flags.introDone=true; G.flags.tutBattle=true; loadMap('teatro',5,10,'down'); V.scene='world'; V.fade=0")
        await pg.evaluate("void runScript(()=>battle(['soldier','rat','cleric'],{noFlee:true}))")
        for i in range(30):
            if await pg.evaluate("BT.mode")=='main': break
            await pg.evaluate("press('a')"); await pg.wait_for_timeout(50); await pg.evaluate("release('a')"); await pg.wait_for_timeout(100)
        r = await pg.evaluate("""(async()=>{ const bad=[]; const els=Object.keys(RUNES).filter(k=>RUNES[k].type==='el'), forms=Object.keys(RUNES).filter(k=>RUNES[k].type==='form'&&k!=='veu'), mods=[null,...Object.keys(RUNES).filter(k=>RUNES[k].type==='mod')];
          let n=0; const T=(p)=>Promise.race([p, new Promise((_,rj)=>setTimeout(()=>rj(new Error('timeout')),4000))]);
          for (const el of els) for (const fm of forms) { const md=mods[n++%mods.length]; try { await T(spellAnim({el,form:fm,mod:md}, BT.en.filter(e=>e.alive), 1)); } catch(e){ bad.push(el+'/'+fm+'/'+md+': '+e.message); } }
          for (const el of els) { try { await T(fxAura(el)); } catch(e){ bad.push('veu '+el+': '+e.message); } }
          for (const k of Object.keys(TECH_FX)) { try { await T(TECH_FX[k](BT.en[0])); } catch(e){ bad.push('tech '+k+': '+e.message); } }
          const missing = Object.keys(TECH).filter(k=>!TECH_FX[k]);
          return {bad, missing, n, techs:Object.keys(TECH_FX).length}; })()""")
        print(r); print(errs); await b.close()
asyncio.run(main())
