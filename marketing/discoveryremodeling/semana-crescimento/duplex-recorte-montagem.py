import json,subprocess
W=json.load(open('tr.json'))['words']
SEG=[(0.0,5.2),(10.9,12.7),(18.2,19.95),(20.0,23.6),(27.8,31.5),(33.2,37.7),(45.7,49.4),(231.7,236.6)]
# zoom expr per segment (t = time in segment)
Z=["1+0.07*t/5.2","1.05-0.05*t/1.8","1+0.05*t/1.75","1.02+0.03*t/3.6+0.10*exp(-t/0.14)","1+0.05*t/3.7","1.05-0.05*t/4.5","1+0.05*t/3.7","1+0.06*t/4.9"]
SUB=[True,None,None,(22.2,23.6),True,True,True,True]
def run(c): subprocess.run(c,shell=True,check=True)
ts=lambda t:"%d:%02d:%05.2f"%(0,int(t//60),t%60)
ev=[];off=0;starts=[]
for i,(a,b) in enumerate(SEG):
    d=b-a;starts.append(off)
    z=Z[i]
    fc=(f"[0:v]scale=w='2*trunc(540*({z}))':h=-2:eval=frame:flags=bicubic,crop=1080:1368,eq=contrast=1.06:saturation=1.12,split=2[x][y];"
        f"[x]scale=270:480:force_original_aspect_ratio=increase,crop=270:480,boxblur=10:3,eq=brightness=-0.32:saturation=0.7,scale=1080:1920[bg];"
        f"[bg][y]overlay=0:180,setsar=1[v];"
        f"[1:a]afade=t=in:d=0.04,afade=t=out:st={d-0.05}:d=0.05,aresample=48000[a0]")
    amap='[a0]'
    extra=''
    if i==3:
        fc+=f";aevalsrc='0.9*sin(2*PI*(70-40*t)*t)*exp(-t*7)':d=0.7:s=48000,aformat=channel_layouts=stereo[th];[a0][th]amix=inputs=2:duration=first:normalize=0[a1]";amap='[a1]'
    run(f"ffmpeg -v error -y -i v{i}.mp4 -ss {a} -t {d} -i orig.mp4 -filter_complex \"{fc}\" -map '[v]' -map '{amap}' -r 30 -t {d} -c:v libx264 -crf 14 -preset fast -pix_fmt yuv420p -c:a aac -b:a 192k -ar 48000 -ac 2 q{i}.mp4")
    s=SUB[i]
    if s:
        lo,hi=(a,b) if s is True else s
        ws=[x for x in W if lo<=x[0]<hi]; grp=[];cur=[]
        for w in ws:
            cur.append(w)
            if w[2][-1] in '.?!,' and len(cur)>=2 or w[2][-1] in '.?!' or len(cur)==3: grp.append(cur);cur=[]
        if cur: grp.append(cur)
        for g in grp:
            for k,w in enumerate(g):
                st=off+w[0]-a; e=off+(g[k+1][0] if k+1<len(g) else w[1]+0.4)-a
                ev.append([st,min(e,off+d),' '.join(('{\\c&H00D7FF&}'+x[2].upper()+'{\\c&HFFFFFF&}') if j==k else x[2].upper() for j,x in enumerate(g))])
    off+=d
T=off;ev.sort()
for x,y in zip(ev,ev[1:]):
    if x[1]>y[0]:x[1]=y[0]
END=1.5
hdr="""[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Sub,Inter,76,&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,7,2,2,60,60,450,1
Style: Nar,Inter,70,&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,7,2,2,60,60,450,1
Style: Top,Inter,74,&H00000000,&H00000000,&H0000D7FF,&H0000D7FF,-1,0,0,0,100,100,0,0,3,18,0,8,50,50,345,1
Style: Box,Inter,60,&H00000000,&H00000000,&H0000D7FF,&H0000D7FF,-1,0,0,0,100,100,0,0,3,16,0,8,60,60,520,1
Style: Big,Inter,84,&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,7,2,8,60,60,330,1
Style: Sm,Inter,54,&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,5,1,5,60,60,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
Y='{\\c&H00D7FF&}';Wt='{\\c&HFFFFFF&}'
L=[f"Dialogue: 0,{ts(s)},{ts(e)},Sub,,0,0,0,,{t}" for s,e,t in ev]
L.append(f"Dialogue: 1,{ts(0)},{ts(5.1)},Top,,0,0,0,,{{\\fad(0,150)}}VOCÊ ENTRARIA\\NNUMA CASA ASSIM?")
pop='{\\fad(80,80)\\fscx85\\fscy85\\t(0,120,\\fscx100\\fscy100)}'
L.append(f"Dialogue: 1,{ts(starts[1]+0.05)},{ts(starts[2])},Nar,,0,0,0,,{pop}ELA VEIO {Y}TODA ARRUMADA")
L.append(f"Dialogue: 1,{ts(starts[2])},{ts(starts[3])},Nar,,0,0,0,,{pop}PARA VER UMA\\N{Y}CASA DE LEILÃO")
L.append(f"Dialogue: 1,{ts(starts[3]+0.05)},{ts(starts[3]+2.1)},Nar,,0,0,0,,{pop}E POR DENTRO\\NERA {Y}ASSIM")
c=starts[7]
L.append(f"Dialogue: 2,{ts(c+0.1)},{ts(T+END)},Big,,0,0,0,,{{\\fad(150,0)}}E VOCÊ, {Y}ENTRARIA?")
L.append(f"Dialogue: 2,{ts(c+0.7)},{ts(T+END)},Box,,0,0,0,,{{\\fad(150,0)}}COMENTE SIM OU NÃO")
L.append(f"Dialogue: 2,{ts(T+0.1)},{ts(T+END)},Sm,,0,0,0,,{{\\pos(540,1380)\\fad(150,0)}}Me segue {Y}@discoveryremodeling")
open('s2.ass','w').write(hdr+'\n'.join(L)+'\n')
run('ffmpeg -v error -y -sseof -0.05 -i q7.mp4 -frames:v 1 last2.png')
run(f'ffmpeg -v error -y -loop 1 -t {END} -i last2.png -f lavfi -t {END} -i anullsrc=r=48000:cl=stereo -vf "fps=30,eq=brightness=-0.12,setsar=1" -c:v libx264 -crf 14 -preset fast -pix_fmt yuv420p -c:a aac -b:a 192k -shortest qe.mp4')
open('l2.txt','w').write(''.join(f"file 'q{i}.mp4'\n" for i in range(8))+"file 'qe.mp4'\n")
run('ffmpeg -v error -y -f concat -safe 0 -i l2.txt -c copy cat2.mp4')
run('ffmpeg -v error -y -i cat2.mp4 -vf "ass=s2.ass" -af "loudnorm=I=-14:TP=-1.5:LRA=11" -c:v libx264 -profile:v high -level 4.1 -pix_fmt yuv420p -crf 17 -preset medium -c:a aac -b:a 192k -ar 48000 -movflags +faststart out2.mp4')
print('T',T+END,starts)
