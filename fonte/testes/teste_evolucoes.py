import asyncio, json
from playwright.async_api import async_playwright
JS = r"""
(async()=>{
 const out={}; const o=bSay; window.bSay=async (t,op)=>{LOGM.push(t); return o(t,{...op,auto:1});};
 // simula o jogador: A no momento certo do anel, seta certa no desvio/sequência, A repetido no agarrão
 window.BOTQ = setInterval(()=>{ const m=BT.mode;
   if(m==='guard' && BT.ring.state===0 && BT.ring.r<=10.5 && BT.ring.r>=9){ press('a'); setTimeout(()=>release('a'),20);} 
   if(m==='dodge' && BT.dg.state===0 && BT.dg.t/BT.dg.T>0.82){ press(BT.dg.dir); setTimeout(()=>release(BT.dg.dir),20);} 
   if(m==='seq' && BT.sq.state===0 && BT.sq.t>BT.sq.prev+4 && FRAME%4===0){ const k=BT.sq.keys[BT.sq.i]; if(k){press(k); setTimeout(()=>release(k),20);} }
   if(m==='mash' && FRAME%2===0){ press('a'); setTimeout(()=>release('a'),15);} 
   if(m==='timing' && Math.abs(BT.tm.x-120)<4){ press('a'); setTimeout(()=>release('a'),20);} 
 },8);
 for (const sp of SPECS){
   const res=out[sp]={errors:[],log:[]};
   try{
     G.species=sp; G.st={mhp:300,mmp:80,atk:30,def:12,mag:20}; G.hp=300; G.mp=80; BT.ps={}; BT.buff={atkM:1,atkT:0,defM:1,defT:0};
     for(const k of ['dark','stance','guildShield','bulwark','frenzy','orbit','star','reflect','freeSpell','magT','starHeal','copy','saltCrust']) BT[k]=0;
     BT.en.forEach(e=>{e.hp=e.mhp=999; e.alive=true; e.dot=null;});
     window.LOGM=[];
     for (const mv of [{k:'ring',p:1},{k:'dodge',p:1},{k:'seq',n:3,p:0.5},{k:'mash',p:1,need:8}]) { const h0=BT.en[0].hp; await runMove(BT.en[0],mv); res.log.push(mv.k+': '+LOGM.at(-1)+' | inimigo -'+(h0-BT.en[0].hp)); console.log(sp+' '+res.log.at(-1)); }
     LOGM=[]; const h0=BT.en[0].hp, p0=G.hp; G.hp=200; console.log(sp+' bite start'); await doBite(BT.en[0]); res.log.push('bite: '+LOGM.join(' / ')+' | dot='+JSON.stringify(BT.en[0].dot)+' hp '+G.hp);
     for (const k of (LINE_TECH[sp]||[])) { LOGM=[]; try { BT.en.forEach(e=>{e.hp=Math.min(e.hp,e.mhp);}); BT.en[1].hp=Math.round(BT.en[1].mhp*0.2); console.log(sp+' tech start '+k); await TECH[k].use(BT.en[1]); res.log.push('tech '+k+': '+LOGM.join(' / ')); console.log(sp+' '+res.log.at(-1)); } catch(err){ res.errors.push(k+': '+err.message); } }
     LOGM=[]; G.mp=80; 
   }catch(err){res.errors.push(err.message+' '+err.stack.split('\n')[1]);}
 }
 clearInterval(BOTQ); window.OUT=out;
})()
"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome'); pg = await b.new_page(viewport={'width':480,'height':800}); errs=[]; pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: print('LOG', m.text[:300], flush=True))
        await pg.goto('file:///home/claude/rpg/Renasci-como-Bau-offline.html'); await pg.wait_for_timeout(1200)
        await pg.evaluate("V.titleTok=null; UI.stack.length=0; G=newState(); G.name='Ravi'; G.flags.introDone=true; G.flags.tutBattle=true; for(const k of ['dodge','seq','mash','memo','swallow']) G.flags['tut_'+k]=1; loadMap('teatro',5,10,'down'); V.scene='world'; V.fade=0")
        await pg.evaluate("void runScript(()=>battle(['rat','rat'],{noFlee:true}))")
        for i in range(60):
            if await pg.evaluate("BT.mode")=='main': break
            await pg.evaluate("press('a')"); await pg.wait_for_timeout(50); await pg.evaluate("release('a')"); await pg.wait_for_timeout(100)
        await pg.evaluate("BT.mode='busy'; window.SPECS=Object.keys(SPECIES);")
        await pg.evaluate("void "+JS)
        for i in range(2400):
            if await pg.evaluate("!!window.OUT"): break
            if i%50==0: print('mode', await pg.evaluate("[BT.mode, JSON.stringify(BT.sq||{}).slice(0,120)]"), flush=True)
            await pg.wait_for_timeout(200)
        out = await pg.evaluate("window.OUT")
        print(json.dumps(out, ensure_ascii=False, indent=1)); print('pageerrors', errs); await b.close()
asyncio.run(main())
