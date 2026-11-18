import json,subprocess
W=json.load(open('tr.json'))['words']
segs=[(0.0,5.3,True),(9.4,12.4,False),(15.5,18.6,'AH, INTERESSANTE...'),(27.8,31.5,True),(45.7,49.4,True),(232.1,236.5,True)]
ts=lambda t:f"0:00:{max(t,0):05.2f}"
ev=[];off=0;parts=[]
for i,(a,b,sub) in enumerate(segs):
    o=f'p{i}.mp4'
    subprocess.run(['ffmpeg','-v','error','-y','-ss',str(a),'-t',str(b-a),'-i','orig.mp4','-filter_complex',
      "[0:v]fps=30,split=2[x][y];[x]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=28:5,eq=brightness=-0.35:saturation=0.7[bg];[y]crop=480:600:0:0,scale=1080:1350:flags=lanczos,unsharp=5:5:0.6[fg];[bg][fg]overlay=0:150,setsar=1[v]",
      '-map','[v]','-map','0:a','-c:v','libx264','-crf','16','-preset','fast','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-ar','48000','-ac','2',o],check=True); parts.append(o)
    if sub is True:
        ws=[x for x in W if a<=x[0]<b]; grp=[];cur=[]
        for w in ws:
            cur.append(w)
            if w[2][-1] in '.?!' or len(cur)==3: grp.append(cur);cur=[]
        if cur: grp.append(cur)
        for g in grp:
            for k,w in enumerate(g):
                s=off+w[0]-a; e=off+(g[k+1][0] if k+1<len(g) else w[1]+0.35)-a
                ev.append([s,min(e,off+b-a),' '.join(('{\\c&H00D7FF&}'+x[2].upper()+'{\\c&HFFFFFF&}') if j==k else x[2].upper() for j,x in enumerate(g))])
    elif sub:
        ev.append([off+0.2,off+b-a-0.2,sub])
    off+=b-a
T=off; ev.sort()
for x,y in zip(ev,ev[1:]):
    if x[1]>y[0]: x[1]=y[0]
CARD=3.0
hdr="""[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Sub,Inter,74,&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,6,2,8,60,60,1560,1
Style: Top,Inter,72,&H00000000,&H00000000,&H0000D7FF,&H0000D7FF,-1,0,0,0,100,100,0,0,3,18,0,8,50,50,330,1
Style: Big,Inter,88,&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,7,2,5,60,60,0,1
Style: Box,Inter,62,&H00000000,&H00000000,&H0000D7FF,&H0000D7FF,-1,0,0,0,100,100,0,0,3,18,0,5,60,60,0,1
Style: Sm,Inter,50,&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,4,1,5,60,60,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
L=[f"Dialogue: 0,{ts(s)},{ts(e)},Sub,,0,0,0,,{t}" for s,e,t in ev]
L.append(f"Dialogue: 1,{ts(0)},{ts(5.2)},Top,,0,0,0,,{{\\fad(0,200)}}VOCÊ ENTRARIA\\NNUMA CASA ASSIM?")
c=T+0.1; ce=T+CARD
L+=[f"Dialogue: 2,{ts(c)},{ts(ce)},Big,,0,0,0,,{{\\pos(540,700)\\fad(200,0)}}VOCÊ ENTRARIA\\NNUMA CASA {{\\c&H00D7FF&}}ASSIM?",
    f"Dialogue: 2,{ts(c+0.6)},{ts(ce)},Box,,0,0,0,,{{\\pos(540,960)\\fad(200,0)}}COMENTE SIM OU NÃO",
    f"Dialogue: 2,{ts(c+1.0)},{ts(ce)},Sm,,0,0,0,,{{\\pos(540,1080)\\fad(200,0)}}Me segue @discoveryremodeling"]
open('s.ass','w').write(hdr+'\n'.join(L)+'\n')
subprocess.run('ffmpeg -v error -y -sseof -0.06 -i p5.mp4 -frames:v 1 last.png',shell=True,check=True)
subprocess.run(f'ffmpeg -v error -y -loop 1 -t {CARD} -i last.png -f lavfi -t {CARD} -i anullsrc=r=48000:cl=stereo -vf "fps=30,gblur=sigma=16,eq=brightness=-0.4:saturation=0.5,setsar=1" -c:v libx264 -crf 16 -preset fast -pix_fmt yuv420p -c:a aac -b:a 192k -shortest pc.mp4',shell=True,check=True)
open('l.txt','w').write(''.join(f"file '{p}'\n" for p in parts+['pc.mp4']))
subprocess.run('ffmpeg -v error -y -f concat -safe 0 -i l.txt -c copy cat.mp4',shell=True,check=True)
subprocess.run('ffmpeg -v error -y -i cat.mp4 -vf "ass=s.ass" -af "loudnorm=I=-14:TP=-1.5:LRA=11" -c:v libx264 -profile:v high -level 4.1 -pix_fmt yuv420p -crf 18 -preset medium -c:a aac -b:a 192k -ar 48000 -movflags +faststart out.mp4',shell=True,check=True)
print('T',round(T,2))
