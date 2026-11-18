import json,random,math,subprocess,cv2,sys
import numpy as np
from PIL import Image,ImageDraw,ImageFont
from ai_edge_litert.interpreter import Interpreter
FPS=24; W,H=1080,1920
WORDS={
'c1_v1':[(1.4,2.16,'Última'),(2.16,2.54,'chance!'),(3.0,3.24,'É'),(3.24,3.58,'pegar'),(3.58,3.94,'ou'),(3.94,4.46,'largar!'),(5.04,5.2,'A'),(5.2,5.36,'gente'),(5.36,5.5,'vai'),(5.5,5.92,'largar.')],
'c1b':[],
'c2':[(1.46,2.06,'A'),(2.06,2.22,'gente'),(2.22,2.64,'quase'),(2.64,3.14,'perdeu'),(3.14,3.44,'tudo!'),(4.14,4.7,'Quase.'),(5.08,5.3,'Vocês'),(5.3,5.54,'iam'),(5.54,5.82,'pular'),(5.82,5.94,'a'),(5.94,6.12,'parte'),(6.12,6.36,'mais'),(6.36,6.88,'importante:'),(7.32,7.46,'a'),(7.46,8.24,'REFORMA.')],
'c3':[(0.05,0.5,'Lance.'),(1.14,1.98,'Dívidas.'),(2.52,3.34,'Reforma.'),(3.84,4.18,'Tempo'),(4.18,4.32,'de'),(4.32,4.64,'obra.'),(5.66,6.5,'Sem'),(6.5,6.62,'a'),(6.62,7.06,'reforma'),(7.06,7.1,'na'),(7.1,7.52,'conta,'),(7.76,7.84,'não'),(7.84,8.2,'existe'),(8.2,8.52,'casa'),(8.52,9.04,'barata.')],
'c4':[(0.78,1.42,'E'),(1.42,1.6,'essa'),(1.6,1.84,'aqui?'),(3.94,4.34,'Essa'),(4.34,4.52,'eu'),(4.52,4.62,'não'),(4.62,5.28,'compraria.'),(5.72,6.04,'Às'),(6.04,6.32,'vezes,'),(6.64,6.74,'o'),(6.74,6.96,'melhor'),(6.96,7.5,'negócio'),(7.5,7.68,'é'),(7.68,7.92,'não'),(7.92,8.24,'fazer'),(8.24,8.8,'negócio.')],
'c5':[(0.98,1.46,'Eu'),(1.46,1.66,'vivo'),(1.66,1.84,'de'),(1.84,2.16,'leilão.'),(2.58,2.8,'Quem'),(2.8,2.94,'te'),(2.94,3.3,'esconde'),(3.3,3.4,'a'),(3.4,3.96,'reforma'),(3.96,4.2,'não'),(4.2,4.46,'quer'),(4.46,4.6,'o'),(4.6,4.72,'seu'),(4.72,5.26,'sucesso.'),(5.5,5.82,'Quer'),(5.82,5.96,'o'),(5.96,6.08,'seu'),(6.08,6.42,'dinheiro.')]}
segs=[('c1_v1',0.3,6.25),('c1b',1.2,7.9),('c2',0.7,8.7),('c3',0.0,9.4),('c4',0.3,9.2),('c5',0.3,7.5)]
CARD=4.4
ts=lambda t:f"0:00:{max(t,0):05.2f}" if t<60 else f"0:01:{t-60:05.2f}"
ev=[];off=0;offs={};punch={}
for n,a,b in segs:
    offs[n]=off
    ws=[x for x in WORDS[n] if a<=x[0]<b]; grp=[];cur=[]
    for w in ws:
        cur.append(w)
        if w[2][-1] in '.?!:' or len(cur)==3: grp.append(cur);cur=[]
    if cur: grp.append(cur)
    for g in grp:
        for i,w in enumerate(g):
            s=off+w[0]-a; e=off+(g[i+1][0] if i+1<len(g) else w[1]+0.35)-a
            ev.append([s,e,' '.join(('{\\c&H00D7FF&}'+x[2].upper()+'{\\c&HFFFFFF&}') if j==i else x[2].upper() for j,x in enumerate(g))])
    off+=b-a
T=off; ev.sort()
for x,y in zip(ev,ev[1:]):
    if x[1]>y[0]: x[1]=y[0]
hdr=open('../nv1/b/s6.ass').read().split('[Events]')[0]+"Style: L1,Inter,66,&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,6,2,7,90,60,0,1\nStyle: Big,Inter,92,&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,7,2,5,60,60,0,1\n\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n"
L=[f"Dialogue: 0,{ts(s)},{ts(e)},Sub,,0,0,0,,{t}" for s,e,t in ev]
L+=[f"Dialogue: 1,{ts(0)},{ts(3.4)},Tag,,0,0,0,,A CASA DE 5 MIL DÓLARES · CAPÍTULO FINAL",f"Dialogue: 1,{ts(0.15)},{ts(3.4)},Top,,0,0,0,,{{\\fad(150,200)}}PEGAR OU LARGAR?"]
# lista do Ale no clipe 3
o3=offs['c3']; e3=o3+5.45
items=[(0.05,'1 · LANCE',False),(1.14,'2 · DÍVIDAS',False),(2.52,'3 · REFORMA',True),(3.84,'4 · TEMPO DE OBRA',False)]
punch['c3']=[t+0.05 for t,_,_ in items]
L.append(f"Dialogue: 2,{ts(o3)},{ts(e3)},Tag,,0,0,0,,{{\\an7\\pos(90,200)\\fad(150,150)}}A CONTA DE VERDADE")
for i,(t,txt,hl) in enumerate(items):
    c='\\c&H00D7FF&' if hl else ''; fs='\\fs82' if hl else ''
    L.append(f"Dialogue: 2,{ts(o3+t)},{ts(e3)},L1,,0,0,0,,{{\\pos(90,{280+i*96})\\fad(0,150){c}{fs}\\fscx60\\fscy60\\t(0,140,\\fscx112\\fscy112)\\t(140,230,\\fscx100\\fscy100)}}{txt}")
punch['c2']=[7.46-0.7]; punch['c4']=[4.62-0.3,8.24-0.3]; punch['c5']=[3.4-0.3,6.08-0.3]
c=T+0.15; ce=T+CARD
L+=[f"Dialogue: 2,{ts(c)},{ts(ce)},Big,,0,0,0,,{{\\pos(540,640)\\fad(250,0)}}O GURU GANHA\\NQUANDO VOCÊ {{\\c&H00D7FF&}}PAGA.",
    f"Dialogue: 2,{ts(c+1.1)},{ts(ce)},Big,,0,0,0,,{{\\pos(540,930)\\fad(250,0)\\fscx80\\fscy80\\t(0,220,\\fscx100\\fscy100)}}NÃO QUANDO\\N{{\\c&H00D7FF&}}DÁ CERTO.",
    f"Dialogue: 2,{ts(c+2.2)},{ts(ce)},C3,,0,0,0,,{{\\pos(540,1180)\\an5\\fad(200,0)}}CONCORDA? COMENTE AÍ",
    f"Dialogue: 2,{ts(c+2.6)},{ts(ce)},C4,,0,0,0,,{{\\pos(540,1290)\\an5\\fad(200,0)}}Me segue @discoveryremodeling"]
open('s.ass','w').write(hdr+'\n'.join(L)+'\n')
# partes com zoom
parts=[]
for i,(n,a,b) in enumerate(segs):
    D=b-a; o=f'm{i}.mp4'; z=f"1+0.07*t/{D}"
    for tp in punch.get(n,[]): z+=f"+0.06*exp(-(t-{tp})/0.13)*gte(t,{tp})"
    vf=f"fps=24,scale=w='2*trunc(1080*({z}))':h='2*trunc(1920*({z}))':eval=frame:flags=bicubic,crop=2160:3840,scale=1080:1920:flags=lanczos,setsar=1"
    subprocess.run(['ffmpeg','-v','error','-y','-ss',str(a),'-t',str(D),'-i',f'{n}.mp4','-vf',vf,'-c:v','libx264','-crf','16','-preset','fast','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-ar','48000','-ac','2',o],check=True); parts.append(o)
subprocess.run('ffmpeg -v error -y -sseof -0.08 -i m5.mp4 -frames:v 1 last.png',shell=True,check=True)
subprocess.run(f'ffmpeg -v error -y -loop 1 -t {CARD} -i last.png -sseof -1.6 -i m5.mp4 -filter_complex "[0:v]fps=24,gblur=sigma=18,eq=brightness=-0.42:saturation=0.5,setsar=1[v];[1:a]atempo=0.5,afade=t=out:st=1.4:d=1.8,apad=whole_dur={CARD}[a]" -map "[v]" -map "[a]" -t {CARD} -c:v libx264 -crf 16 -preset fast -pix_fmt yuv420p -c:a aac -b:a 192k -ar 48000 -ac 2 m6.mp4',shell=True,check=True)
open('l.txt','w').write(''.join(f"file '{p}'\n" for p in parts+['m6.mp4']))
subprocess.run('ffmpeg -v error -y -f concat -safe 0 -i l.txt -c copy cat.mp4',shell=True,check=True)
# cédulas com asinhas atrás do carro do guru (clipe 1B), por trás do casal
it=Interpreter(model_path='model/seg.tflite'); it.allocate_tensors(); ii=it.get_input_details()[0]; oo=it.get_output_details()[0]
def fgmask(rgb):
    x=cv2.resize(rgb,(256,256)).astype(np.float32)/255
    it.set_tensor(ii['index'],x[None]); it.invoke(); y=it.get_tensor(oo['index'])[0]
    e=np.exp(y-y.max(-1,keepdims=True)); p=1-(e/e.sum(-1,keepdims=True))[...,0]
    m=cv2.resize(p,(rgb.shape[1],rgb.shape[0]),interpolation=cv2.INTER_LINEAR)
    m=np.clip((m-0.25)/0.35,0,1); m=cv2.dilate(m,np.ones((7,7),np.uint8)); return cv2.GaussianBlur(m,(0,0),2.5)
import sprites; SP=sprites.S
def wing(dark=False):
    S=3; im=Image.new('RGBA',(150*S,150*S),(0,0,0,0)); d=ImageDraw.Draw(im)
    c=(236,236,228,255) if not dark else (196,198,190,255); o=(120,124,118,255)
    for (cx,cy,rx,ry) in [(52,62,26,52),(74,72,24,46),(94,86,20,36)]: d.ellipse([(cx-rx)*S,(cy-ry)*S,(cx+rx)*S,(cy+ry)*S],fill=c,outline=o,width=2*S)
    d.ellipse([52*S,92*S,104*S,140*S],fill=c,outline=o,width=2*S); d.ellipse([58*S,98*S,98*S,134*S],fill=c)
    return im.resize((150,150),Image.LANCZOS)
WF,WB=wing(),wing(True); BASE=Image.fromarray(np.clip(SP[0.7][1],0,255).astype(np.uint8))
def flyer(t,ph,fq):
    a=38*math.sin(2*math.pi*fq*t+ph); cv=Image.new('RGBA',(380,330),(0,0,0,0)); bx,by=(380-BASE.width)//2,190
    cv.alpha_composite(WB.rotate(-18+a*0.9,center=(78,136),resample=Image.BICUBIC),(bx+BASE.width//2-78-22,by+18-136)); cv.alpha_composite(BASE,(bx,by))
    cv.alpha_composite(WF.rotate(-30-a,center=(78,136),resample=Image.BICUBIC),(bx+BASE.width//2-78+18,by+26-136)); return cv
random.seed(5); tcar=offs['c1b']+(5.6-1.2)
fl=[dict(t0=tcar+random.uniform(0,1.1),y=random.uniform(520,1000),v=random.uniform(620,900),amp=random.uniform(18,40),bf=random.uniform(1.3,2.4),ph=random.uniform(0,6.28),fq=random.uniform(5,7),sc=random.uniform(0.55,0.95)) for _ in range(13)]
t1=tcar-0.1; t2=offs['c2']
rd=subprocess.Popen(['ffmpeg','-v','error','-i','cat.mp4','-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE)
wr=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','pipe:0','-i','cat.mp4','-filter_complex','[0:v]ass=s.ass[v];[1:a]loudnorm=I=-14:TP=-1.5:LRA=11[a]','-map','[v]','-map','[a]','-c:v','libx264','-profile:v','high','-level','4.1','-pix_fmt','yuv420p','-crf','18','-preset','medium','-c:a','aac','-b:a','192k','-ar','48000','-movflags','+faststart','out.mp4'],stdin=subprocess.PIPE)
tint=np.array([1.0,0.95,0.84],np.float32); i=0
while True:
    raw=rd.stdout.read(W*H*3)
    if len(raw)<W*H*3: break
    t=i/FPS; i+=1; fr=np.frombuffer(raw,np.uint8).reshape(H,W,3); out=fr
    if t1<=t<t2:
        lay=Image.new('RGBA',(W,H),(0,0,0,0)); any_=False
        for p in fl:
            dt=t-p['t0']
            if dt<0: continue
            k=min(1,dt/2.4); x=-200+p['v']*dt; y=p['y']+p['amp']*math.sin(2*math.pi*p['bf']*dt+p['ph'])-(p['y']-820)*0.35*k
            sc=p['sc']*(1-0.45*k)
            if x>W+200: continue
            b=flyer(dt,p['ph'],p['fq']); b=b.resize((max(8,int(b.width*sc)),max(8,int(b.height*sc))),Image.BILINEAR)
            px,py=int(x-b.width/2),int(y-b.height/2)
            if px>=0 and py>=0 and px<W and py<H: lay.alpha_composite(b,(px,py)); any_=True
            elif -b.width<px<W and 0<=py<H and px<0: lay.alpha_composite(b.crop((-px,0,b.width,b.height)),(0,py)); any_=True
        if any_:
            la=cv2.GaussianBlur(np.array(lay).astype(np.float32),(0,0),1.0); a=(la[...,3]/255*(1-fgmask(fr)))[...,None]
            out=np.clip(fr.astype(np.float32)*(1-a)+la[...,:3]*tint*a,0,255).astype(np.uint8)
    wr.stdin.write(out.tobytes())
wr.stdin.close(); wr.wait(); print('T',round(T,2),'frames',i,'offs',{k:round(v,2) for k,v in offs.items()})
