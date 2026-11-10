// guaitaCaptura · proves de coherència dels fitxers del repositori · SPDX-License-Identifier: AGPL-3.0-only
// ús: node tests/test_pages.js
const fs=require('fs'),path=require('path'),assert=require('assert');
const R=path.join(__dirname,'..');let ok=0,ko=0;const t=(n,f)=>{try{f();ok++;}catch(e){ko++;console.log('FAIL',n,'—',e.message);}};
const rd=p=>fs.readFileSync(path.join(R,p),'utf8');
const AGPL=`<!--\n  Guaita Apps - Suite d'eines autònomes per a arquitectura, BIM i documentació.\n  Copyright (c) 2026 Jordi Subirós\n  GNU Affero General Public License v3.0\n  See LICENSE file for details\n-->`;
const DISC={CAT:"Guaita Apps es distribueix «tal com és», sense cap garantia. Les eines estan pensades desde la recerca i com a suport tècnic i educatiu; la verificació dels resultats i la responsabilitat derivada del seu ús recauen únicament sobre l'usuari final.",
 ENG:"Guaita Apps is distributed “as is”, without any warranty. The tools are designed from research and as technical and educational support; verification of the results and the responsibility arising from their use rest solely with the end user."};
const HELP={CAT:'HLP guaitaCaptura-ajuda.html',ENG:'HLP guaitaCaptura-help_EN.html'};
for(const L of ['CAT','ENG']){const d='pages'+L;
  const h=rd(`${d}/${HELP[L]}`);
  t(`${L} ajuda: capçalera AGPL a dalt de tot`,()=>assert.ok(h.startsWith(AGPL+'\n<!DOCTYPE html>')));
  t(`${L} ajuda: signatura`,()=>assert.ok(h.includes('SBS BIM Consulting 2026')));
  t(`${L} ajuda: disclaimer`,()=>assert.ok(h.includes(DISC[L])));
  t(`${L} ajuda: marca de 4 quadrats (hero i peu) i colors`,()=>{assert.strictEqual((h.match(/<span class="cells"><span><\/span><span><\/span><span><\/span><span><\/span><\/span>/g)||[]).length,2);const c=['#C6FF00','#FF2ECC','#00E5FF','#FFE500'].map(x=>h.indexOf(x));assert.ok(c.every(i=>i>0)&&c[0]<c[1]&&c[1]<c[2]&&c[2]<c[3]);});
  t(`${L} ajuda: enllaços de l'índex apunten a seccions`,()=>{const toc=[...h.matchAll(/<nav class="toc">(.*?)<\/nav>/gs)][0][1];const hrefs=[...toc.matchAll(/href="#([^"]+)"/g)].map(m=>m[1]);assert.ok(hrefs.length>=10);for(const id of hrefs)assert.ok(h.includes(`<section id="${id}"`),'falta #'+id);});
  t(`${L} ajuda: sense CDN`,()=>assert.ok(!/(src|href)="https?:\/\/(?!github\.com)/.test(h)));
  const a=rd(`${d}/guaitaCaptura.html`);
  t(`${L} app: capçalera AGPL-3.0-only`,()=>{assert.ok(a.includes('SPDX-License-Identifier: AGPL-3.0-only'));assert.ok(a.includes('SBS BiM Consulting, Jordi Subirós'));});
  t(`${L} app: sense CDN`,()=>assert.ok(!/(src|href)="https?:\/\//.test(a)));
  t(`${L} app: lang`,()=>assert.ok(a.includes(`<html lang="${L==='CAT'?'ca':'en'}">`)));
  t(`${L} app: enllaç al manual existeix`,()=>{const m=a.match(/const HELP_URL=LANG==='en'\?'([^']+)':'([^']+)'/);assert.ok(fs.existsSync(path.join(R,d,decodeURIComponent(m[L==='ENG'?1:2]))));});
  t(`${L} app: enllaç a l'altra versió existeix`,()=>assert.ok(fs.existsSync(path.join(R,d,'..',L==='CAT'?'pagesENG':'pagesCAT','guaitaCaptura.html'))));
  const m=JSON.parse(rd(`${d}/manifest.webmanifest`));
  t(`${L} manifest`,()=>{assert.strictEqual(m.display,'standalone');assert.strictEqual(m.lang,L==='CAT'?'ca':'en');for(const i of m.icons)assert.ok(fs.existsSync(path.join(R,d,i.src)));assert.ok(fs.existsSync(path.join(R,d,m.start_url)));});
  const sw=rd(`${d}/sw.js`);
  t(`${L} sw: cau cadascuna amb el seu prefix i desa l'ajuda`,()=>{assert.ok(sw.includes(`guaita-captura-${L==='CAT'?'ca':'en'}-`));assert.ok(sw.includes(HELP[L]));});
  t(`${L} versió coherent 0.1.2`,()=>{assert.ok(a.includes("const VERSION='0.1.2'"));assert.ok(h.includes('0.1.2'));});
}
t('app ENG sense restes òbvies de català a la interfície',()=>{const a=rd('pagesENG/guaitaCaptura.html').replace(/@font-face\{[^}]*\}/g,'');for(const w of ['Cancel·la','Elimina','Importar','Imprimeix','Col·lecció','Porta-retalls del sistema','Desa com a còpia','Anotar'])assert.ok(!a.includes(w),w);});
t('LICENSE és AGPL v3',()=>assert.ok(/GNU AFFERO GENERAL PUBLIC LICENSE\s+Version 3/.test(rd('LICENSE'))));
t('NOTICE i CLA existeixen',()=>{assert.ok(rd('NOTICE.md').includes('AGPL-3.0-only'));assert.ok(rd('CLA.md').includes('guaitaCaptura'));});
t('landing enllaça pàgines existents',()=>{const i=rd('index.html');for(const m of i.matchAll(/href="((?:pages)[^"#]+)"/g))assert.ok(fs.existsSync(path.join(R,decodeURIComponent(m[1]))),m[1]);assert.ok(i.startsWith('<!--'));});
console.log(`${ok} OK, ${ko} FAIL`);process.exit(ko?1:0);
