// ================= ESPAÇOS DE JOGO E HERANÇA PARA A TEMPORADA 3 (pedido do usuário) =================
// 3 espaços de save. O espaço 1 é o save antigo (nada se perde). Na tela inicial você escolhe o espaço; o Marco e o
// salvamento automático gravam no espaço em uso. No menu, "Espaços de jogo" copia o último save deste espaço para outro
// (sem "salvar em qualquer lugar": copia o que já está gravado) ou apaga um espaço.
// HERANÇA T2 -> T3: ao terminar a temporada, todo save grava 'renasci_heranca2' (localStorage) e o menu ganha
// "Herança (T3)" com o código RCB-H2... para levar a outro aparelho. A T3 lê os dois (H2 carrega a H1 dentro).
function infoSlot(n) {
  const sv = load2(n);
  if (!sv || !sv.flags || !(sv.flags.cap1Corvos || sv.flags.cap1Boss)) return null;
  let c = 2; for (let i = 3; i <= 10; i++) if (sv.flags['c' + i + 'Init']) c = i;
  const t = Math.floor((sv.time || 0) / 60), h = Math.floor(t / 60), m = t % 60;
  return { nome: sv.name || '?', cap: sv.flags.c10Fim ? 'FIM' : sv.flags.cap1Boss ? 'Cap. ' + c : 'Cap. 1', tempo: h + 'h' + String(m).padStart(2, '0') };
}
function itensSlots() { return [1, 2, 3].map(n => { const I = infoSlot(n); return I ? { label: `Espaço ${n}: ${I.nome}`, right: `${I.cap} ${I.tempo}`, col: n === SLOT2 ? '#ffd060' : undefined, d: `${I.nome} · ${I.cap} · tempo de jogo ${I.tempo}${n === SLOT2 ? ' · (o último usado)' : ''}` } : { label: `Espaço ${n}: (vazio)`, col: '#8a8099', d: 'Um espaço livre para um jogo novo.' }; }); }
async function escolherEspaco() {
  while (true) {
    const its = itensSlots();
    const i = await list({ x: 20, y: 40, w: 200, title: 'Espaços de jogo', items: its, desc: j => its[j].d, descY: 120, cancel: false, idx: SLOT2 - 1 });
    const n = i + 1, I = infoSlot(n);
    if (!I) { usarSlot(n); return 'novo'; }
    const c = await choose(`* Espaço ${n}: ${I.nome}, ${I.cap}.`, ['Continuar', 'Começar um jogo novo aqui', 'Voltar']);
    if (c === 0) { usarSlot(n); return 'continuar'; }
    if (c === 1) { const ok = await choose('* O jogo deste espaço será APAGADO quando você salvar. Tem certeza?', ['Não', 'Sim, começar de novo']); if (ok === 1) { usarSlot(n); return 'novo'; } }
  }
}
MENU_EXTRA.push({ k: 'espacos', nm: () => 'Espaços de jogo', col: '#c8d4dc', vis: () => true, right: () => 'nº ' + SLOT2,
  desc: () => 'Três espaços de save. Copie o último save deste espaço para outro (um "backup"), ou apague um espaço.',
  run: async () => {
    while (true) {
      const its = itensSlots();
      const i = await list({ x: 20, y: 40, w: 200, title: 'Espaços de jogo (em uso: ' + SLOT2 + ')', items: its, desc: j => its[j].d, descY: 120 });
      if (i < 0) return;
      const n = i + 1;
      if (n === SLOT2) { await say('* Este é o espaço em uso. Ele salva sozinho no Marco e no salvamento automático.'); continue; }
      const I = infoSlot(n);
      const c = await choose(`* Espaço ${n}${I ? ': ' + I.nome + ', ' + I.cap : ' (vazio)'}.`, ['Copiar o último save daqui para lá', ...(I ? ['Apagar esse espaço'] : []), 'Voltar']);
      if (c === 0) {
        if (I && (await choose('* Isso substitui o jogo do espaço ' + n + '. Tem certeza?', ['Não', 'Sim'])) !== 1) continue;
        try { const s = localStorage.getItem(chaveSlot(SLOT2)); if (s) localStorage.setItem(chaveSlot(n), s); } catch (e) { }
        sfx('save'); await say('* Copiado para o espaço ' + n + '. Você continua jogando no espaço ' + SLOT2 + '.');
      } else if (I && c === 1) {
        if ((await choose('* Apagar o espaço ' + n + ' de vez?', ['Não', 'Sim, apagar'])) !== 1) continue;
        try { localStorage.removeItem(chaveSlot(n)); } catch (e) { } sfx('cancel'); await say('* Espaço ' + n + ' apagado.');
      }
    }
  } });
// ---------- herança da Temporada 2 ----------
function heranca2() {
  const Gm = typeof grim === 'function' ? grim() : {}, bau = (typeof grupoAtual === 'function' ? grupoAtual() : []).find(m => m.id === 'bau');
  const lemb = typeof lembSt === 'function' ? Object.keys(lembSt()).filter(k => lembSt()[k] === 'dev').length : 0;
  return { v: 2, name: G.name, t1: G.her || null, species: G.species, evo3: G.evo3 || null, evo7: G.evo7 || null, evoLume: G.evoLume || null,
    nomeMoca: G.nomeMoca || null, poder: G.poder || 1, lv: bau ? bau.lv : null, tempo: G.time || 0, dia: G.dia || 0,
    escolhas: { apagar: G.flags.c10Escolha || null, beijo: !!G.flags.c10Beijo, cancao: !!G.flags.c10Cancao, lumeHeart: G.flags.lumeHeart2 || 0, ritaViuRosto: !!G.flags.ritaViuRosto, vila: !!G.flags.vilaSemente },
    magia: { elems: Gm.elems || [], forms: Gm.forms || [], mods: Gm.mods || [], fus: Object.keys(Gm.fus || {}).filter(k => Gm.fus[k]) },
    pilares: Object.keys((G.flags && G.flags.pil) || {}), lembrancas: lemb, cobres: G.cobres || 0,
    flags: G.flags };
}
function codigoHeranca2() { return 'RCB-H2.' + btoa(unescape(encodeURIComponent(JSON.stringify(heranca2())))); }
{ const _svH = save2; save2 = function () { _svH(); if (G.flags && G.flags.c10Fim) { try { localStorage.setItem('renasci_heranca2', JSON.stringify(heranca2())); } catch (e) { } } }; }
function mostrarCodigo(titulo, txt0, code) {
  return new Promise(res => {
    OVB.innerHTML = `<h2>${titulo}</h2><p>${txt0}</p><textarea id="ci" readonly></textarea><div class="row"><button class="ok" id="cok">Copiar</button><button id="cx">Fechar</button></div>`;
    OV.hidden = false; const ta = OVB.querySelector('#ci'); ta.value = code;
    const done = () => { OV.hidden = true; for (const k in KEYS) KEYS[k] = false; res(); };
    OVB.querySelector('#cok').onclick = async () => { ta.select(); let ok = false; try { await navigator.clipboard.writeText(code); ok = true; } catch (e) { try { ok = document.execCommand('copy'); } catch (e2) { } } OVB.querySelector('#cok').textContent = ok ? 'Copiado!' : 'Selecione e copie'; };
    OVB.querySelector('#cx').onclick = done;
  });
}
MENU_EXTRA.push({ k: 'heranca3', nm: () => 'Herança (T3)', col: '#ffd890', vis: () => !!(G.flags && G.flags.c10Fim),
  desc: () => 'Tudo o que este jogo leva para a Temporada 3. Neste aparelho ela já fica guardada sozinha; o código serve para outro aparelho.',
  run: async () => {
    save2();
    await mostrarCodigo('Herança da Temporada 2', 'A Temporada 3 lê sozinha neste aparelho. Em outro aparelho, cole este código na tela inicial da Temporada 3.', codigoHeranca2());
  } });
