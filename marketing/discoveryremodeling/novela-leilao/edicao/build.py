import json,subprocess
W=json.load(open('words_raw.json'))
W['a2']=[[2.84,3.56,'Quanto'],[3.56,3.92,'custa'],[3.92,4.24,'arrumar'],[4.24,4.4,'tudo'],[4.4,4.76,'isso?'],[7.04,7.76,'Vamos'],[7.76,8.06,'fazer'],[8.06,8.2,'a'],[8.2,8.48,'conta.']]
for k in W:
    W[k]=[[max(s,e-0.7) if e-s>0.9 else s,e,w] for s,e,w in W[k]]
W['c'][-1]=[5.82,6.6,'pintura.']
segs=[('a2',1.6,9.0),('b',1.2,8.4),('c',1.5,8.5),('d',0.9,9.7),('e',0.0,9.6)]
NUM={'b':{'Telhado':'8.000','elétrica':'4.000'},'c':{'Cozinha,':'6.000','banheiro,':'6.000','piso,':'3.000','pintura.':'5.000'}}
ts=lambda t:f"0:00:{max(t,0):05.2f}" if t<60 else f"0:01:{t-60:05.2f}"
ev=[];pops=[];off=0;lastword=0;local={}
for n,a,b in segs:
    ws=[x for x in W[n] if a<=x[0]<b]; grp=[];cur=[]
    for w in ws:
        cur.append(w)
        if w[2][-1] in '.?!,' and n in 'bc' or w[2][-1] in '.?!' or len(cur)==3: grp.append(cur);cur=[]
    if cur: grp.append(cur)
    for g in grp:
        for i,w in enumerate(g):
            s=off+w[0]-a; e=off+(g[i+1][0] if i+1<len(g) else w[1]+0.35)-a
            ev.append([s,e,' '.join(('{\\c&H00D7FF&}'+x[2].upper()+'{\\c&HFFFFFF&}') if j==i else x[2].upper() for j,x in enumerate(g))])
            lastword=max(lastword,off+w[1]-a)
            if n in NUM and w[2] in NUM[n]: pops.append((off+w[0]-a+0.15,NUM[n][w[2]],w[2].strip('.,').upper())); local.setdefault(n,[]).append(round(w[0]-a+0.15,2))
    off+=b-a
ev.sort()
for x,y in zip(ev,ev[1:]):
    if x[1]>y[0]: x[1]=y[0]
hdr=open('../nv1/b/s6.ass').read().split('[Events]')[0]
hdr=hdr.replace('[Events]','')+"Style: Num,Inter,150,&H0000D7FF,&H0000D7FF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,9,3,5,40,40,0,1\nStyle: NumL,Inter,56,&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,-1,0,0,0,100,100,2,0,1,5,2,5,40,40,0,1\n\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n"
L=[f"Dialogue: 0,{ts(s)},{ts(e)},Sub,,0,0,0,,{t}" for s,e,t in ev]
L+=[f"Dialogue: 1,{ts(0)},{ts(3.4)},Tag,,0,0,0,,A CASA DE 5 MIL DÓLARES · CAPÍTULO 3",f"Dialogue: 1,{ts(0.15)},{ts(3.4)},Top,,0,0,0,,{{\\fad(150,200)}}QUANTO CUSTA A REFORMA?"]
for i,(t,v,lab) in enumerate([]):
    end=min(t+1.55,(pops[i+1][0]-0.03) if i+1<len(pops) else 1e9)
    rot=(-5 if i%2==0 else 5)
    L.append(f"Dialogue: 3,{ts(t)},{ts(end)},NumL,,0,0,0,,{{\\pos(540,250)\\fad(80,120)}}{lab}")
    L.append(f"Dialogue: 3,{ts(t)},{ts(end)},Num,,0,0,0,,{{\\pos(540,380)\\frz{rot}\\fad(0,120)\\fscx40\\fscy40\\t(0,140,\\fscx118\\fscy118)\\t(140,240,\\fscx100\\fscy100)}}+ US$ {v}")
T=off; e0=lastword+0.25
L+=[f"Dialogue: 1,{ts(e0)},{ts(T)},End,,0,0,0,,{{\\an5\\pos(540,270)\\fad(200,0)}}VOCÊ CONTINUARIA\\NOU DESISTIRIA?",
    f"Dialogue: 1,{ts(e0+0.6)},{ts(T)},End,,0,0,0,,{{\\an5\\fs92\\c&H00D7FF&\\move(-400,440,540,440,0,320)}}COMENTE AÍ"]
c=T+0.1; ce=T+3.2
L+=[f"Dialogue: 2,{ts(c)},{ts(ce)},C1,,0,0,0,,{{\\fad(200,0)}}NO ÚLTIMO CAPÍTULO",
    f"Dialogue: 2,{ts(c+0.3)},{ts(ce)},C2,,0,0,0,,{{\\fad(200,0)\\fscx80\\fscy80\\t(0,250,\\fscx100\\fscy100)}}COMPRAR\\NOU {{\\c&H00D7FF&}}DESISTIR?",
    f"Dialogue: 2,{ts(c+0.9)},{ts(ce)},C3,,0,0,0,,{{\\fad(200,0)}}ME SEGUE PARA NÃO PERDER",
    f"Dialogue: 2,{ts(c+1.2)},{ts(ce)},C4,,0,0,0,,{{\\fad(200,0)}}@discoveryremodeling"]
open('s.ass','w').write(hdr+'\n'.join(L)+'\n')
json.dump({'segs':segs,'T':T,'pops':pops,'e0':e0,'local':local},open('plan.json','w'))
print('T',round(T,2),'pops',[(round(p[0],2),p[1],p[2]) for p in pops],'e0',round(e0,2))
