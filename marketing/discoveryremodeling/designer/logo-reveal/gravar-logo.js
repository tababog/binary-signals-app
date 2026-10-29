// node gravar-logo.js <saida.mp4> [segundos]: grava o discovery-logo-reveal.html em 1080x1920, 30 fps
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const {execFileSync}=require('child_process');
(async()=>{const [out,secs='6']=process.argv.slice(2);const N=Math.round(parseFloat(secs)*30);
const tmp=fs.mkdtempSync('/tmp/claude-0/frames-');
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+path.join(__dirname,'discovery-logo-reveal.html'));await p.evaluate(()=>document.fonts.ready);
await p.addStyleTag({content:`html,body{margin:0;padding:0!important;background:#fff}.controls,.hint{display:none}
.stage{width:1080px!important;height:1920px;box-shadow:none}.logo{width:620px!important}
.name{font-size:120px!important;margin-top:24px}.sub{font-size:36px!important}.handle{font-size:34px!important;bottom:22%}`});
await p.evaluate(()=>document.getAnimations().forEach(a=>a.pause()));
const el=await p.$('#stage');
for(let f=0;f<N;f++){await p.evaluate(ms=>document.getAnimations().forEach(a=>a.currentTime=ms),f*1000/30);
 await el.screenshot({path:`${tmp}/${String(f).padStart(4,'0')}.jpg`,type:'jpeg',quality:92});}
await b.close();
execFileSync('ffmpeg',['-y','-loglevel','error','-framerate','30','-i',`${tmp}/%04d.jpg`,'-f','lavfi','-t',secs,'-i','anullsrc=r=44100:cl=stereo','-shortest','-c:v','libx264','-pix_fmt','yuv420p','-crf','18','-c:a','aac','-movflags','+faststart',out]);
fs.rmSync(tmp,{recursive:true});console.log('ok',out);})();
