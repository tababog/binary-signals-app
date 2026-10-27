// node gravar.js <html> <saida.mp4> [segundos]: grava a arte animada em vídeo 30 fps
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const {execFileSync}=require('child_process');
(async()=>{const [html,out,secs='7']=process.argv.slice(2);const N=Math.round(parseFloat(secs)*30);
const tmp=fs.mkdtempSync('/tmp/claude-0/frames-');
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+path.resolve(html));await p.evaluate(()=>document.fonts.ready);
await p.addScriptTag({path:path.join(__dirname,'anim.js')});
await p.evaluate(()=>{animar();document.getAnimations().forEach(a=>a.pause());});
const el=await p.$('.s');
for(let f=0;f<N;f++){await p.evaluate(ms=>document.getAnimations().forEach(a=>a.currentTime=ms),f*1000/30);
 await el.screenshot({path:`${tmp}/${String(f).padStart(4,'0')}.jpg`,type:'jpeg',quality:90});}
await b.close();
execFileSync('ffmpeg',['-y','-loglevel','error','-framerate','30','-i',`${tmp}/%04d.jpg`,'-f','lavfi','-t',secs,'-i','anullsrc=r=44100:cl=stereo','-shortest','-c:v','libx264','-pix_fmt','yuv420p','-crf','18','-c:a','aac','-movflags','+faststart',out]);
fs.rmSync(tmp,{recursive:true});console.log('ok',out);})();
