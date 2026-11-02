import asyncio, json, sys
from playwright.async_api import async_playwright
OUT='/tmp/claude-0/-home-claude/21d632bd-691d-5171-96af-6be176f77e4e/scratchpad/shots/'
SKILL=float(sys.argv[1]) if len(sys.argv)>1 else 0.6
SPECIES=sys.argv[2] if len(sys.argv)>2 else 'ferro'
EVO=1 if SPECIES=='arcano' else 0
AUTO = """
window.EVOIDX=__EVO__; window.AUTOP = {act:0, on:true, skill:%s, log:[]};
setInterval(()=>{ if(!AUTOP.on) return; release('a'); if(V.scene==='battle') AUTOP.minhp=Math.min(AUTOP.minhp??999, G.hp);
  const ov=!document.getElementById('ov').hidden;
  if(ov){ const i=document.querySelector('#ti'); if(i){ i.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter'})); } return; }
  const top=UI.top();
  if(top){ if(top.type==='dialog'){ press('a'); }
    else if(top.type==='list'){
      if(V.scene==='battle' && (top.o.title||'').startsWith('Feiti')){ const al=BT.en.filter(e=>e.alive); let best=0,bs=-1;
        G.spells.forEach((sp,i)=>{ if(spellCost(sp)>G.mp) return; let sc; if(sp.form==='veu') sc = G.hp<G.st.mhp*0.5 && sp.el==='seiva' ? 5 : 0; else { const w=al.map(e=>e.weak[sp.el]??1); sc = sp.form==='dardo'? Math.max(...w) : w.reduce((a,b)=>a+b,0)*0.6; } if(sc>bs){bs=sc;best=i;} }); top.idx=best; }
      press('a'); } else if(top.type==='evolve'){ if(!top.locked){ top.idx=EVOIDX; press('a'); } } else press('a'); return; }
  if(V.scene==='battle'){
    const m=BT.mode;
    if(m==='text') press('a');
    else if(m==='main'){
      if(G.hp < G.st.mhp*0.35 && (G.flask.n>0 || Object.values(G.items).some(v=>v>0))) BT.menuIdx=2;
      else BT.menuIdx = (G.spells.length && G.mp>=6 && AUTOP.act%%3!==2)?1:0; AUTOP.act++; press('a'); }
    else if(m==='target'){ const hi=BT.en.findIndex(e=>e.alive&&e.id==='hound'); if(hi>=0) BT.tgt=hi; press('a'); }
    else if(m==='timing' && Math.abs(BT.tm.x-120)<14) press('a');
    else if(m==='guard' && BT.ring.state===0){ if(BT.ring.dec===undefined) BT.ring.dec=Math.random()<AUTOP.skill; if(BT.ring.dec && BT.ring.r<=12 && BT.ring.r>=9) press('a'); }
  }
}, 16);
""" % SKILL
SEQ = """
window.RUNLOG=[]; window.DONE=false; const heal = () => { while (G.hp < G.st.mhp*0.6 && G.flask.n>0) drinkFlask(); }; const rest = () => { G.flask.n = G.flask.max; }; const top = () => { while (G.hp < G.st.mhp*0.85 && G.flask.n>0) drinkFlask(); };
(async()=>{
 const fight = async (map) => { for (let k=0;k<12;k++) { const e = WD.ents.find(e=>(e.kind==='enemy'||e.kind==='patrol')); if(!e || WD.id!==map) break; heal(); const hp0=G.hp; await runScript(()=>encounter(e)); RUNLOG.push([map,e.id,hp0+'/'+G.st.mhp,'->',G.hp,'frasco',G.flask.n,G.lv,G.species]); if(WD.id!==map) { RUNLOG.push(['LOST',e.id]); break; } } };
 const go = async (m,x,y) => { loadMap(m,x,y,'down'); await runScript(()=>onEnter(m)); };
 rest(); await go('galeria',12,16); await fight('galeria');
 G.runes.push('seiva','veu','geada'); G.spells.push({el:'geada',form:'dardo',mod:null,name:'Gelo'},{el:'seiva',form:'veu',mod:null,name:'Cura'});
 rest(); await go('poco',2,7); await fight('poco');
 rest(); top(); loadMap('antessala',7,9,'up'); AUTOP.minhp=999; const hpb=G.hp; await runScript(STORY.bossIntro); RUNLOG.push(['GOLEM',hpb,'min',AUTOP.minhp,G.lv,G.species,!!G.flags.bossDone]);
 DONE=true;
})();
"""
AUTO = AUTO.replace('__EVO__', '1' if SPECIES=='arcano' else '0')
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        pg = await b.new_page(viewport={'width':390,'height':844}, device_scale_factor=2)
        errs=[]
        pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
        pg.on('console', lambda m: errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file:///home/claude/rpg/Renasci-como-Bau-offline.html')
        await pg.wait_for_timeout(400)
        await pg.evaluate("V.titleTok=null; UI.stack.length=0; G=newState(); G.name='Ravi'; Object.assign(G.flags,{introDone:true,tutBattle:true,metOfelia:true,flaskTut:true,galeriaSeen:true,pocoSeen:true}); G.runes=['brasa','dardo']; G.spells=[{el:'brasa',form:'dardo',mod:null,name:'Chama'}]; G.items={pao:2}; applySave(G); V.fade=0;")
        if False: await pg.evaluate("V.titleTok=null; UI.stack.length=0; G=newState(); G.name='Ravi'; Object.assign(G.flags,{introDone:true,ch1done:true,bossDone:true,gateOpen:true,tutBattle:true,metOfelia:true}); G.species='%s'; G.lv=2; G.st=%s; G.hp=G.st.mhp; G.mp=G.st.mmp; G.runes=['brasa','dardo','seiva','veu','geada','onda','eco'%s]; G.spells=[{el:'brasa',form:'dardo',mod:null,name:'Chama'},{el:'geada',form:'dardo',mod:null,name:'Gelo'},{el:'seiva',form:'veu',mod:null,name:'Cura'}]; G.items={pao:3,tinta:2}; G.flask={n:4,max:4}; applySave(G); V.fade=0;" % (SPECIES, st, ",'foco'" if SPECIES=='arcano' else ''))
        await pg.evaluate(AUTO)
        await pg.evaluate(SEQ)
        shots={'mercado':0,'acampamento':0,'teatro':0,'ponte':0}
        for i in range(2400):
            d = await pg.evaluate("[DONE, WD.id, V.scene, RUNLOG.length]")
            if d[0]: break
            if d[2]=='world' and d[1] in shots and shots[d[1]]<1 and not await pg.evaluate("UI.stack.length"):
                await pg.wait_for_timeout(200); await pg.screenshot(path=OUT+f'c2_{d[1]}.png'); shots[d[1]]+=1
            if d[2]=='battle' and i%120==60: await pg.screenshot(path=OUT+f'c2_battle_{i}.png')
            await pg.wait_for_timeout(100)
        log = await pg.evaluate("RUNLOG")
        for l in log: print(l)
        print('final', await pg.evaluate("[G.species, G.lv, G.st, G.flags.ch2done, fmtTime(G.time)]"))
        print('\n'.join(errs[:10]))
        await b.close()
asyncio.run(main())
