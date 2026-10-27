// node render.js <pasta-html> <pasta-saida>: renderiza cada HTML da lista.txt em JPG
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{const [dir,out]=process.argv.slice(2);fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch();const p=await b.newPage();
for(const n of fs.readFileSync(path.join(dir,'lista.txt'),'utf8').split('\n').filter(Boolean)){
 await p.goto('file://'+path.resolve(dir,n+'.html'));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
 const el=await p.$('.s');await el.screenshot({path:path.join(out,n+'.jpg'),type:'jpeg',quality:92});}
await b.close();console.log('ok');})();
