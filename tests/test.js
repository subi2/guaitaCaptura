// guaitaCaptura · proves jsdom · ús: npm i jsdom && node tests/test.js
// SPDX-License-Identifier: AGPL-3.0-only
const {JSDOM}=require('jsdom');const fs=require('fs');const assert=require('assert');
const html=fs.readFileSync(require('path').join(__dirname,'../'+(process.env.PAGES||'pagesCAT')+'/guaitaCaptura.html'),'utf8');
let pass=0,fail=0;const t=async(n,f)=>{try{await f();pass++;}catch(e){fail++;console.log('FAIL',n,e.message);}};
(async()=>{
 const errs=[];
 const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'https://localhost/pagesCAT/guaitaCaptura.html',
   beforeParse(w){w.TextEncoder=TextEncoder;w.TextDecoder=TextDecoder;w.HTMLDialogElement&&(w.HTMLDialogElement.prototype.showModal=function(){this.open=true;});w.HTMLDialogElement&&(w.HTMLDialogElement.prototype.close=function(){this.open=false;this.onclose&&this.onclose();});
     w.URL.createObjectURL=()=>'blob:x';w.URL.revokeObjectURL=()=>{};w.addEventListener('error',e=>errs.push(e.message));}});
 const w=dom.window;await new Promise(r=>setTimeout(r,600));const G=w.GC;
 await t('arrencada sense errors',()=>assert.deepStrictEqual(errs,[]));
 await t('menús construïts (6)',()=>assert.strictEqual(w.document.querySelectorAll('.menu').length,6));
 await t('avís no RC visible',()=>{assert.ok(w.document.querySelector('#prebar').textContent.match(/NO ÉS RC|NOT AN RC/));assert.ok(w.document.querySelector('.pre').textContent.match(/no RC|not RC/));});
 await t('diàleg de limitacions en primer ús',()=>{assert.ok(w.document.querySelector('#dlg').open);assert.ok(w.document.querySelector('#dlgH').textContent.match(/Limitacions|Limitations/));});
 await t('memòria de reserva (sense IndexedDB a jsdom)',()=>assert.ok(w.document.querySelector('#status').textContent.match(/només en memòria|memory only/)));
 await t('obrir cada menú i submenús',()=>{for(const b of w.document.querySelectorAll('.menu-btn')){b.click();const l=b.parentNode.querySelector('.menu-list');assert.ok(l&&l.querySelectorAll('.mi').length>0,b.textContent);}w.document.body.click();});
 const d=new Date(2026,10,9,19,56,7);
 await t('makeName plantilla',()=>assert.strictEqual(G.makeName('{origen}_{data}_{hora}_{n}',{date:d,n:7,origen:'captura'}),'captura_2026-11-09_195607_007'));
 await t('makeName fitxes buides',()=>assert.strictEqual(G.makeName('{col}_{origen}_{n}',{date:d,n:1,origen:'retall'}),'retall_001'));
 await t('makeName fitxa desconeguda',()=>assert.strictEqual(G.makeName('a_{xx}',{date:d}),'a_{xx}'));
 await t('sanitizeName',()=>{assert.strictEqual(G.sanitizeName('a/b:c*?'),'a-b-c-');assert.strictEqual(G.sanitizeName('  '),'captura');});
 await t('crc32',()=>assert.strictEqual(G.crc32(new TextEncoder().encode('123456789')),0xCBF43926));
 await t('zip anada i tornada',async()=>{const e=[{name:'guaitaCaptura.json',data:new TextEncoder().encode('{"a":1}')},{name:'imatges/plànol à.png',data:new Uint8Array([1,2,3,250])}];
   const z=G.zipBuild(e);const r=await G.zipRead(z);assert.strictEqual(r.length,2);assert.strictEqual(r[1].name,'imatges/plànol à.png');assert.deepStrictEqual([...r[1].data],[1,2,3,250]);});
 await t('zip llegible per unzip',()=>{const z=G.zipBuild([{name:'x.txt',data:new TextEncoder().encode('hola')}]);fs.writeFileSync('/tmp/t.zip',Buffer.from(z));require('child_process').execSync('python3 -c "import zipfile;z=zipfile.ZipFile(\'/tmp/t.zip\');assert z.testzip() is None;assert z.read(\'x.txt\')==b\'hola\'"');});
 await t('zip invàlid',async()=>{await assert.rejects(()=>G.zipRead(new Uint8Array(40)),/no és un fitxer .zip|not a valid .zip/i);});
 await t('pdfStr escapa i Latin-1',()=>{assert.strictEqual(G.pdfStr('a(b)\\'),'a\\(b\\)\\\\');assert.strictEqual(G.pdfStr('àç€'),'àç?');});
 await t('layout 4 per pàgina, 9 elements',()=>{const L=G.computeLayout(9,{per:4,caption:'name'});assert.strictEqual(L.pages.length,3);assert.strictEqual(L.pages[2].cells.length,1);const c=L.pages[0].cells[3];assert.ok(c.x+c.w<=L.P.w-27&&c.y+c.h<=L.P.h-27);});
 await t('layout horitzontal gira 1x2',()=>{const L=G.computeLayout(2,{per:2,landscape:true,caption:'none'});assert.strictEqual(L.cols,2);assert.strictEqual(L.rows,1);});
 await t('fitBox contain',()=>{const f=G.fitBox(200,100,{x:0,y:0,w:100,h:100});assert.deepStrictEqual([f.x,f.y,f.w,f.h],[0,25,100,50]);});
 await t('scaleDims',()=>{assert.deepStrictEqual({...G.scaleDims(3840,2160,'1920px')},{w:1920,h:1080});assert.deepStrictEqual({...G.scaleDims(800,600,'1920px')},{w:800,h:600});assert.deepStrictEqual({...G.scaleDims(101,51,'0.5')},{w:51,h:26});});
 await t('uniqueFile',()=>{const u=new Set();assert.strictEqual(G.uniqueFile('a','png',u),'a.png');assert.strictEqual(G.uniqueFile('A','png',u),'A (2).png');});
 await t('clipText',()=>assert.ok(G.clipText('x'.repeat(200),50,8).endsWith('…')));
 await t('parseTags',()=>assert.deepStrictEqual([...G.parseTags(' #a, b ,a,, ')],['a','b']));
 await t('PDF estructura i xref',()=>{const jpg=fs.readFileSync(''+require('path').join(__dirname,'fixture.jpg')+'');const pdf=G.buildPdf([{w:595.28,h:841.89,ops:[{t:'img',i:0,x:28,y:28,w:200,h:100},{t:'rect',x:28,y:28,w:200,h:100},{t:'txt',x:28,y:140,s:8,str:'Plànol (planta) baixa'}]}],[{bytes:new Uint8Array(jpg),w:64,h:32}]);
   fs.writeFileSync('/tmp/t.pdf',Buffer.from(pdf));const s=Buffer.from(pdf).toString('latin1');assert.ok(s.startsWith('%PDF-1.4'));const sx=+s.match(/startxref\n(\d+)/)[1];assert.strictEqual(s.slice(sx,sx+4),'xref');
   const offs=[...s.matchAll(/(\d{10}) 00000 n/g)].map(m=>+m[1]);offs.forEach((o,i)=>assert.ok(s.slice(o).startsWith(`${i+1} 0 obj`),'obj '+(i+1)));});
 await t('filtres de vista',()=>{const S=G.S;S.shots=[{id:'1',kind:'image',name:'planta',notes:'',tags:['rev'],source:'captura',star:true,collection:'A'},{id:'2',kind:'text',name:'nota',text:'hola món',notes:'',tags:[],source:'porta-retalls',star:false,collection:''}];
   const v=f=>{Object.assign(S.filter,{view:'all',col:'',tag:'',q:''},f);return G.visible().map(s=>s.id).join();};
   assert.strictEqual(v({}),'1,2');assert.strictEqual(v({view:'star'}),'1');assert.strictEqual(v({view:'clip'}),'2');assert.strictEqual(v({view:'text'}),'2');assert.strictEqual(v({view:'col',col:'A'}),'1');assert.strictEqual(v({tag:'rev'}),'1');assert.strictEqual(v({q:'món'}),'2');assert.strictEqual(v({view:'nocol'}),'2');});
 console.log(`${pass} OK, ${fail} FAIL`);process.exit(fail?1:0);
})();
