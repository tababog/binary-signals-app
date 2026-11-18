import numpy as np, cv2, math
from PIL import Image,ImageDraw,ImageFont
def tex(back=False,w=440,h=192):
    im=Image.new('RGBA',(w,h),(0,0,0,0)); d=ImageDraw.Draw(im)
    base=(104,150,98) if not back else (118,158,108)
    d.rounded_rectangle([0,0,w-1,h-1],16,fill=(206,214,176,255))            # borda creme
    d.rounded_rectangle([12,12,w-13,h-13],10,fill=base+(255,))
    d.rounded_rectangle([26,26,w-27,h-27],8,outline=(74,116,74,255),width=4)
    if not back:
        d.ellipse([w/2-56,h/2-56,w/2+56,h/2+56],fill=(186,208,160,255),outline=(66,104,66,255),width=5)
        d.text((w/2,h/2-2),'$',font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',88),fill=(56,96,60,255),anchor='mm')
        for x in (64,w-64): d.ellipse([x-22,h/2-22,x+22,h/2+22],outline=(74,116,74,255),width=4)
    else:
        d.rounded_rectangle([w/2-110,h/2-40,w/2+110,h/2+40],20,fill=(150,184,134,255),outline=(74,116,74,255),width=4)
    return np.array(im).astype(np.float32)
TF,TB=tex(),tex(True)
L=np.array([-0.35,-0.62,0.70]); L/=np.linalg.norm(L)
def sprite(curl,alpha):
    w,h=TF.shape[1],TF.shape[0]; R=w/curl; half=R*math.sin(curl/2)
    CW,CH=int(2*half)+40,h+int(R*(1-math.cos(curl/2)))+60
    out=np.zeros((CH,CW,4),np.float32); ca,sa=math.cos(alpha),math.sin(alpha)
    zmid=R*(1-math.cos(curl/4))
    for X in range(int(-half),int(half)):
        phi=math.asin(max(-1,min(1,X/R))); s=phi/curl+0.5; j=min(w-1,max(0,int(s*w)))
        n=np.array([-math.sin(phi),-math.cos(phi)*sa,math.cos(phi)*ca]); front=n[2]>=0
        if not front: n=-n
        colm=(TF if front else TB)[:,j,:].copy()
        sh=0.50+0.62*max(0.0,float(n@L))+0.10*max(0.0,float(n@L))**8
        colm[:,:3]=np.clip(colm[:,:3]*sh,0,255)
        hh=max(6,int(h*max(0.10,abs(ca))))
        colr=cv2.resize(colm[:,None,:],(1,hh),interpolation=cv2.INTER_AREA)[:,0,:]
        z=R*(1-math.cos(phi))-zmid; yc=CH/2+z*sa*0.85
        y0=int(yc-hh/2); x0=int(X+CW/2)
        if 0<=y0 and y0+hh<=CH and 0<=x0<CW: out[y0:y0+hh,x0,:]=colr
    out=cv2.GaussianBlur(out,(0,0),0.8)
    return cv2.resize(out,(CW//2,CH//2),interpolation=cv2.INTER_AREA)
CURLS=[0.7,1.3,1.9]; NA=20
S={c:[sprite(c,2*math.pi*k/NA) for k in range(NA)] for c in CURLS}
if __name__=='__main__':
    rows=[]
    for c in CURLS:
        tiles=[]
        for k in range(0,NA,2):
            a=S[c][k]; bg=np.full((220,280,3),(120,105,90),np.float32); h_,w_=a.shape[:2]
            y=(220-h_)//2; x=(280-w_)//2; al=a[...,3:4]/255
            bg[y:y+h_,x:x+w_]=bg[y:y+h_,x:x+w_]*(1-al)+a[...,:3]*al; tiles.append(bg)
        rows.append(np.hstack(tiles))
    cv2.imwrite('sprites.png',cv2.cvtColor(np.vstack(rows).astype(np.uint8),cv2.COLOR_RGB2BGR))
