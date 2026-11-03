import asyncio, json, sys
from playwright.async_api import async_playwright
OUT='/tmp/claude-0/-home-claude/21d632bd-691d-5171-96af-6be176f77e4e/scratchpad/shots/'
SKILL=float(sys.argv[1]) if len(sys.argv)>1 else 0.6
SPECIES=sys.argv[2] if len(sys.argv)>2 else 'ferro'
AUTO = """
window.AUTOP = {act:0, on:true, skill:%s, log:[]};
setInterval(()=>{ if(!AUTOP.on) return; release('a'); release('b'); ['up','down','left','right'].forEach(release); if(V.scene==='battle') AUTOP.minhp=Math.min(AUTOP.minhp??999, G.hp);
  const ov=!document.getElementById('ov').hidden;
  if(ov){ const i=document.querySelector('#ti'); if(i){ i.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter'})); } return; }
  const top=UI.top();
  if(top && top.type==='list' && top.o.items && top.o.items[top.idx] && top.o.items[top.idx].disabled){ const k=top.o.items.findIndex(it=>!it.disabled); if(k>=0) top.idx=k; else { press('b'); return; } }
  if(top){ if(top.type==='tune'){ if(top.phase==='play'){ top.cd=(top.cd||0)+1; if(top.cd>=8){ top.cd=0; press(top.keys[top.i]); } } return; } if(top.type==='dialog'){ press('a'); }
    else if(top.type==='list'){
      if(V.scene==='battle' && (top.o.title||'').startsWith('Morder')){ const ok=top.o.items.map((it,i)=>!it.disabled&&i>0?i:-1).filter(i=>i>=0); top.idx = ok.length && !AUTOP.notech && Math.random()<0.5 ? pickOne(ok) : 0; AUTOP.notech=false; }
      if(V.scene==='battle' && (top.o.title||'').startsWith('Feiti')){ const al=BT.en.filter(e=>e.alive); let best=0,bs=-1;
        G.spells.forEach((sp,i)=>{ if(spellCost(sp)>G.mp) return; let sc; if(sp.form==='veu') sc = G.hp<G.st.mhp*0.5 && sp.el==='seiva' ? 5 : 0; else { const w=al.map(e=>e.weak[sp.el]??1); sc = sp.form==='dardo'? Math.max(...w) : w.reduce((a,b)=>a+b,0)*0.6; } if(sc>bs){bs=sc;best=i;} }); if(AUTOP.wantEl){ const wi=G.spells.findIndex(sp=>sp.el===AUTOP.wantEl&&(spellCost(sp)<=G.mp||BT.freeSpell)); if(wi>=0) best=wi; AUTOP.wantEl=null; } top.idx=best; }
      press('a'); } else if(top.type==='evolve'){ if(!top.locked){ top.idx=window.EVOIDX||0; press('a'); } } else press('a'); return; }
  if(V.scene==='battle'){
    const m=BT.mode;
    if(m==='text') press('a');
    else if(m==='main'){
      const fk=BT.en.find(e=>e.alive&&e.ticket); if(fk && Math.random()<AUTOP.skill+0.2){ if(fk.ticket==='bite'){ BT.menuIdx=0; AUTOP.notech=true; } else { BT.menuIdx=1; AUTOP.wantEl=fk.ticket; } AUTOP.act++; press('a'); return; }
      const pr=BT.en.find(e=>e.alive&&e.proph); if(pr && Math.random()<AUTOP.skill+0.2){ const avoid={bite:0,spell:1,item:2}[pr.proph]; const opts=[0,1].filter(i=>i!==avoid && (i!==1 || (G.spells.length && G.mp>=8))); BT.menuIdx = opts.length ? pickOne(opts) : 0; if(pr.proph==='tech') AUTOP.notech=true; AUTOP.act++; press('a'); return; }
      if(G.hp < G.st.mhp*0.35 && (G.flask.n>0 || Object.values(G.items).some(v=>v>0))) BT.menuIdx=2;
      else BT.menuIdx = (G.spells.length && G.mp>=6 && AUTOP.act%%3!==2)?1:0; AUTOP.act++; press('a'); }
    else if(m==='target'){ const hi=BT.en.findIndex(e=>e.alive&&e.id==='hound'); if(hi>=0) BT.tgt=hi; press('a'); }
    else if(m==='timing' && Math.abs(BT.tm.x-120)<14) press('a');
    else if(m==='dodge' && BT.dg.state===0){ const g=BT.dg, p=g.t/g.T; if(g.dec===undefined) g.dec=Math.random()<AUTOP.skill+0.1; if(g.dec && p>0.8) press(g.dir); else if(!g.dec && p>0.58 && Math.random()<0.5) press(g.dir==='up'?'down':'up'); }
    else if(m==='seq' && BT.sq.state===0){ const q=BT.sq; q.cd=(q.cd||0)+1; if(q.cd>=12){ q.cd=0; const k=q.keys[q.i]; press(Math.random()<AUTOP.skill+(q.hide?0.15:0.25) ? k : (k==='up'?'down':'up')); } }
    else if(m==='mash' && BT.ms.state===0){ if(Math.random()<AUTOP.skill*0.33) press('a'); }
    else if(m==='guard' && BT.ring.state===0){ if(BT.ring.dec===undefined) BT.ring.dec=Math.random()<AUTOP.skill; if(BT.ring.dec && BT.ring.r<=12 && BT.ring.r>=9) press('a'); }
  }
}, 16);
""" % SKILL
SEQ = """
window.RUNLOG=[]; window.DONE=false; const heal = () => { while (G.hp < G.st.mhp*0.6 && G.flask.n>0) drinkFlask(); }; const rest = () => { G.flask.n = G.flask.max; }; const top = () => { while (G.hp < G.st.mhp*0.85 && G.flask.n>0) drinkFlask(); };
void (async()=>{
 const fight = async (map) => { for (let k=0;k<14;k++) { const e = WD.ents.find(e=>(e.kind==='enemy'||e.kind==='patrol')); if(!e || WD.id!==map) break; heal(); const hp0=G.hp; await runScript(()=>encounter(e)); RUNLOG.push([map,e.id,hp0+'/'+G.st.mhp,'->',G.hp,'frasco',G.flask.n,G.lv,G.species,'calm',G.flags.calmed||0]); if (G.hp<=0) break; } };
 const go = async (m,x,y) => { loadMap(m,x,y,'down'); await runScript(()=>onEnter(m)); };
 const boss = async (label, m, x, y, fn) => { rest(); top(); loadMap(m,x,y,'up'); AUTOP.minhp=999; const h=G.hp; await runScript(fn); RUNLOG.push([label,h+'/'+G.st.mhp,'min',AUTOP.minhp,G.lv,G.species,G.flags.ozorioDone||false,G.flags.maestroDone||false,G.flags.p32Done||false]); };
 const S = (f) => runScript(f);
 await S(()=>STORY.ch6start());
 rest(); await go('feira',26,8); await S(()=>STORY.cida6()); await fight('feira');
 if (window.LOST) { await boss('TACHO','feira',3,14,async()=>{ await battle(['tacho'],{boss:true,music:'boss6',noFlee:true}); Object.assign(G.flags,{soul_ozorio:'perdido',ozorioDone:true,ozorioPerdido:true}); refreshEnts(); await STORY.papagaio6(); }); }
 else { G.flags.d_fe1=true; await S(()=>STORY.caderno6({})); await S(()=>STORY.ozorio6()); }
 G.spells.push({el:'canto',form:'onda',mod:null,name:'Coro'},{el:'canto',form:'dardo',mod:null,name:'Nota'}); giveItem('pastel',2);
 rest(); await go('escola',12,17); await fight('escola');
 G.flags.cham1=G.flags.cham2=G.flags.cham3=true; await S(()=>STORY.duda6());
 if (!window.LOST) { G.flags.d_es1=true; await S(()=>STORY.diario6()); await S(()=>STORY.neide6()); } else await S(()=>STORY.sino6());
 rest(); await go('coreto',2,9); await fight('coreto'); await S(()=>STORY.marlene6());
 await boss('MAESTRO','coreto',13,6,()=>STORY.maestro6());
 await S(()=>STORY.valdir6());
 G.flags.finalOpen=true; if (G.flags.soul_neide!=='lembrou') G.flags.soul_neide='perdido';
 rest(); await go('pontofinal',10,2); await fight('pontofinal');
 await boss('P32','pontofinal',11,12,()=>STORY.p32());
 DONE=true;
})();
"""
PRINTED=[0]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        pg = await b.new_page(viewport={'width':390,'height':844}, device_scale_factor=2)
        errs=[]
        pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
        pg.on('console', lambda m: errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file:///home/claude/rpg/Renasci-como-Bau-offline.html')
        await pg.wait_for_timeout(400)
        prof = {'ferro': ("bastiao","{mhp:438,mmp:94,atk:102,def:98,mag:45}"), 'arcano': ("biblioteca","{mhp:303,mmp:228,atk:47,def:62,mag:118}")}[SPECIES]
        await pg.evaluate("V.titleTok=null; UI.stack.length=0; G=newState(); G.name='Ravi'; Object.assign(G.flags,{introDone:true,ch1done:true,ch2done:true,ch3open:true,ch3done:true,ch4open:true,ch4done:true,ch5open:true,ch5done:true,jorgeDone:true,marenDone:true,musgoDone:true,cidaDone:true,bossDone:true,gateOpen:true,tutBattle:true,metOfelia:true,lumeJoined:true,canDisguise:true,flaskTut:true,tut_dodge:1,tut_seq:1,tut_mash:1,tut_swallow:1,tut_memo:1,mem_pastel:true,ofeliaAway:true}); G.species='%s'; G.lv=16; G.st=%s; G.hp=G.st.mhp; G.mp=G.st.mmp; G.runes=['brasa','dardo','seiva','veu','geada','onda','eco','faisca','corrente','selo','vento','sombra','sal','ancora','polvora','mina','bandeira']; G.spells=[{el:'polvora',form:'onda',mod:null,name:'Bomba'},{el:'faisca',form:'ancora',mod:null,name:'Ancora'},{el:'brasa',form:'dardo',mod:null,name:'Chama'},{el:'faisca',form:'dardo',mod:null,name:'Raio'},{el:'faisca',form:'corrente',mod:null,name:'Corrente'},{el:'seiva',form:'veu',mod:null,name:'Cura'},{el:'vento',form:'onda',mod:null,name:'Ventania'},{el:'sal',form:'dardo',mod:null,name:'Sal'}]; G.items={quentinha:2,biscoito:2,cidreira:2}; G.flask={n:8,max:8}; applySave(G); V.fade=0;" % (prof[0], prof[1]))
        await pg.evaluate("window.LOST=%s" % ("true" if len(sys.argv)>3 else "false"))
        await pg.evaluate("window.EVOIDX=%d" % (0 if SPECIES=='ferro' else 0))
        await pg.evaluate(AUTO)
        await pg.evaluate(SEQ)
        shots={}
        for i in range(16000):
            d = await pg.evaluate("[DONE, WD.id, V.scene, RUNLOG.length]")
            if d[3] > PRINTED[0]:
                for l in (await pg.evaluate("RUNLOG"))[PRINTED[0]:]: print(l, flush=True)
                PRINTED[0] = d[3]
            if i % 600 == 599: print('...', await pg.evaluate("[WD.id, V.scene, BT.mode, UI.top()?.type||'', G.hp, BT.en.map(e=>e.name+':'+e.hp).join(',')]"), flush=True)
            if d[0]: break
            if d[2]=='world' and d[1] in shots and shots[d[1]]<1 and not await pg.evaluate("UI.stack.length"):
                await pg.wait_for_timeout(200); await pg.screenshot(path=OUT+f'c6_{d[1]}.png'); shots[d[1]]+=1
            if d[2]=='battle' and i%120==60: await pg.screenshot(path=OUT+f'c6_battle_{i}.png')
            await pg.wait_for_timeout(100)
        print('final', await pg.evaluate("[G.species, G.lv, G.st, G.flags.ch6done, (G.tech||[]).join(','), fmtTime(G.time)]"), flush=True)
        print('\n'.join(errs[:10]))
        await b.close()
asyncio.run(main())
