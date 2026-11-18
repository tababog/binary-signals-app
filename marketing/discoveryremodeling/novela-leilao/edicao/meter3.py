import json,random,math,subprocess,cv2
import numpy as np
from PIL import Image,ImageDraw,ImageFont
from ai_edge_litert.interpreter import Interpreter
it=Interpreter(model_path='model/seg.tflite'); it.allocate_tensors(); ii=it.get_input_details()[0]; oo=it.get_output_details()[0]
def fgmask(rgb):
    x=cv2.resize(rgb,(256,256)).astype(np.float32)/255
    it.set_tensor(ii['index'],x[None]); it.invoke(); y=it.get_tensor(oo['index'])[0]
    e=np.exp(y-y.max(-1,keepdims=True)); p=1-(e/e.sum(-1,keepdims=True))[...,0]
    m=cv2.resize(p,(rgb.shape[1],rgb.shape[0]),interpolation=cv2.INTER_LINEAR)
    m=np.clip((m-0.25)/0.35,0,1); m=cv2.dilate(m,np.ones((7,7),np.uint8)); return cv2.GaussianBlur(m,(0,0),2.5)
P=json.load(open('plan.json')); FPS=24; W,H=1080,1920; DUR=P['T']+3.2
pops=[p[0] for p in P['pops']]; n=len(pops)
offs=[0]
for _,a,b in P['segs']: offs.append(offs[-1]+b-a)
T_IN=pops[0]-0.55; T_OUT=offs[4]-0.15
fp=subprocess.run(['fc-match','-f','%{file}','Inter:bold'],capture_output=True,text=True).stdout
font=lambda s:ImageFont.truetype(fp,s)
def bill(w=190,h=84):
    S=3; im=Image.new('RGBA',(w*S,h*S),(0,0,0,0)); d=ImageDraw.Draw(im)
    d.rounded_rectangle([0,0,w*S-1,h*S-1],9*S,fill=(98,142,96,255),outline=(48,82,52,255),width=3*S)
    d.rounded_rectangle([9*S,9*S,w*S-9*S,h*S-9*S],5*S,fill=(122,164,116,255),outline=(70,108,72,255),width=2*S)
    d.ellipse([w*S/2-25*S,h*S/2-25*S,w*S/2+25*S,h*S/2+25*S],fill=(176,202,160,255),outline=(60,96,62,255),width=2*S)
    d.text((w*S/2,h*S/2-S),'$',font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',38*S),fill=(52,88,56,255),anchor='mm')
    im=im.resize((w,h),Image.LANCZOS); a=np.array(im).astype(np.float32)
    g=np.linspace(1.18,0.78,h)[:,None,None]; a[...,:3]=np.clip(a[...,:3]*g,0,255)   # luz de cima, sombra embaixo
    return Image.fromarray(a.astype(np.uint8))
import sprites; SP=sprites.S; CUR=sprites.CURLS; NA=sprites.NA; random.seed(21)
BX,BY,BW,BH=150,250,780,64
def level(t):
    lv=1.0
    for i,tp in enumerate(pops):
        if t>=tp:
            k=min(1,(t-tp)/0.35); k=1-(1-k)**3; lv=1-(i+k)/n
    return max(0,lv)
def col(lv):
    g=(60,190,90); y=(255,205,40); r=(225,50,45)
    a,b,k=(y,g,(lv-0.5)/0.5) if lv>0.5 else (r,y,lv/0.5)
    return tuple(int(a[i]+(b[i]-a[i])*k) for i in range(3))+(255,)
parts=[]
for i,tp in enumerate(pops):
    x0=BX+BW*(1-(i+0.5)/n)
    for k in range(15):
        depth=random.uniform(0,1)
        parts.append(dict(t0=tp+random.uniform(0,0.4),x=x0+random.uniform(-70,70),y=BY+BH/2,vx=random.uniform(-330,330),vy=random.uniform(-260,60),a0=random.uniform(0,360),w=random.uniform(-200,200),fl=random.uniform(4,8),ph=random.uniform(0,6.28),sc=0.62+0.5*depth,dp=depth,sw=random.uniform(20,60),sf=random.uniform(2,4),cu=random.choice(CUR)))
parts.sort(key=lambda p:p['dp'])
G=1150.0
t_first=pops[0]-0.1; t_last=pops[-1]+3.2
rd=subprocess.Popen(['ffmpeg','-v','error','-i','cat.mp4','-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE)
wr=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','pipe:0','-i','cat.mp4','-i','sfx.wav','-filter_complex','[0:v]ass=s.ass[v];[1:a][2:a]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]','-map','[v]','-map','[a]','-c:v','libx264','-profile:v','high','-level','4.1','-pix_fmt','yuv420p','-crf','18','-preset','medium','-c:a','aac','-b:a','192k','-ar','48000','-movflags','+faststart','out.mp4'],stdin=subprocess.PIPE)
fl=font(40); fb=font(58); i=0
tint=np.array([1.0,0.94,0.80],np.float32)
while True:
    raw=rd.stdout.read(W*H*3)
    if len(raw)<W*H*3: break
    t=i/FPS; i+=1
    fr=np.frombuffer(raw,np.uint8).reshape(H,W,3)
    out=fr
    if t_first<=t<=t_last:
        lay=Image.new('RGBA',(W,H),(0,0,0,0)); any_=False
        for p in parts:
            dt=t-p['t0']
            if dt<0 or dt>3.2: continue
            x=p['x']+p['vx']*dt*math.exp(-dt*0.8)+p['sw']*math.sin(p['sf']*dt+p['ph']); y=p['y']+p['vy']*dt+0.5*G*dt*dt
            if y>H+120: continue
            spr=SP[p['cu']][int(((p['fl']*0.75*dt+p['ph'])%(2*math.pi))/(2*math.pi)*NA)%NA]
            ba=spr.copy(); ba[...,:3]*=(0.78+0.22*p['dp'])
            b=Image.fromarray(np.clip(ba,0,255).astype(np.uint8))
            sc=p['sc']*0.92; b=b.resize((max(8,int(b.width*sc)),max(6,int(b.height*sc))),Image.BILINEAR).rotate(p['a0']+p['w']*0.6*dt,expand=True,resample=Image.BICUBIC)
            px,py=int(x-b.width/2),int(y-b.height/2)
            if -b.width<px<W and -b.height<py<H: lay.alpha_composite(b,(max(px,-b.width+1),py)) if px>=0 and py>=0 else lay.alpha_composite(b.crop((max(0,-px),max(0,-py),b.width,b.height)),(max(px,0),max(py,0))); any_=True
        if any_:
            la=np.array(lay).astype(np.float32); la=cv2.GaussianBlur(la,(0,0),1.0)
            # sombra suave das cédulas na parede
            sh=cv2.GaussianBlur(np.roll(la[...,3],(14,10),(0,1)),(0,0),7)/255*0.28
            fg=fgmask(fr); bgw=(1-fg)
            f=fr.astype(np.float32)*(1-(sh*bgw)[...,None])
            a=(la[...,3]/255*bgw)[...,None]
            out=np.clip(f*(1-a)+la[...,:3]*tint*a,0,255).astype(np.uint8)
    if T_IN<=t<T_OUT:
        ain=min(1,(t-T_IN)/0.25); aout=min(1,(T_OUT-t)/0.25); al=min(ain,aout)
        ui=Image.new('RGBA',(W,H),(0,0,0,0)); d=ImageDraw.Draw(ui); lv=level(t); empty=lv<=0.001; sh_=0
        for tp in pops:
            if 0<=t-tp<0.3: sh_=int(9*math.sin((t-tp)*60)*(1-(t-tp)/0.3))
        if empty: sh_=int(5*math.sin(t*38))
        x=BX+sh_; y=BY-int((1-ain)*60)
        d.text((W/2+sh_,y-52),'DINHEIRO DO CASAL',font=fl,fill=(255,255,255,255),anchor='mm',stroke_width=5,stroke_fill=(0,0,0,255))
        d.rounded_rectangle([x-8,y-8,x+BW+8,y+BH+8],40,fill=(0,0,0,235)); d.rounded_rectangle([x,y,x+BW,y+BH],32,fill=(60,60,60,255))
        if lv>0.02: d.rounded_rectangle([x,y,x+max(64,int(BW*lv)),y+BH],32,fill=col(lv))
        if empty:
            pz=0.5+0.5*math.sin(t*9); d.text((W/2+sh_,y+BH/2),'ACABOU!',font=fb,fill=(255,int(60+60*pz),int(50+40*pz),255),anchor='mm',stroke_width=5,stroke_fill=(0,0,0,255))
        u=np.array(ui).astype(np.float32); a=(u[...,3:4]/255)*al
        out=np.clip(out.astype(np.float32)*(1-a)+u[...,:3]*a,0,255).astype(np.uint8)
    wr.stdin.write(out.tobytes())
wr.stdin.close(); wr.wait(); print('frames',i)
