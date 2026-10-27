from PIL import Image, ImageDraw, ImageFont, ImageFilter
import sys, os
F="/usr/share/fonts/opentype/inter/"
def font(n,s): return ImageFont.truetype(F+n,s)
GREEN=(23,54,26); GOLD=(242,193,78); WHITE=(255,255,255); SOFT=(220,232,216)
IMG='/tmp/claude-0/-home-user-binary-signals-app/22db71f1-876f-5391-b04e-e39a442b5454/images/'
LOGO=Image.open('/home/user/binary-signals-app/marketing/discoveryremodeling/marca/logo-discovery-branca.png').convert('RGBA')
OUT=sys.argv[1]; os.makedirs(OUT,exist_ok=True)
def bg(W,H,photo='1.jpg',blur=16,mix=0.72):
    s=Image.open(IMG+photo).convert('RGB'); r=max(W/s.width,H/s.height)
    s=s.resize((round(s.width*r),round(s.height*r)),Image.LANCZOS); x=(s.width-W)//2; y=(s.height-H)//2
    s=s.crop((x,y,x+W,y+H)).filter(ImageFilter.GaussianBlur(blur))
    return Image.blend(s,Image.new('RGB',(W,H),GREEN),mix).convert('RGBA')
def logo(im,w,xy):
    l=LOGO.resize((w,int(LOGO.height*w/LOGO.width)),Image.LANCZOS); im.alpha_composite(l,xy)
def wrap(d,text,f,maxw):
    words=text.split(); lines=[]; cur=''
    for w in words:
        t=(cur+' '+w).strip()
        if d.textlength(t,font=f)<=maxw: cur=t
        else: lines.append(cur); cur=w
    if cur: lines.append(cur)
    return lines
def ctext(d,W,y,t,f,fill=WHITE):
    tw=d.textlength(t,font=f); d.text(((W-tw)/2,y),t,font=f,fill=fill)
def block(d,W,y,text,f,fill=WHITE,maxw=900,lh=1.18):
    for para in text.split('\n'):
        for l in wrap(d,para,f,maxw):
            ctext(d,W,y,l,f,fill); y+=int(f.size*lh)
    return y
def pill(d,W,y,t,f,bg_=GOLD,fg=GREEN,pad=30,h=None):
    tw=d.textlength(t,font=f); h=h or int(f.size*1.7)
    d.rounded_rectangle([(W-tw)/2-pad,y,(W+tw)/2+pad,y+h],radius=h//2,fill=bg_)
    d.text(((W-tw)/2,y+(h-f.size*1.2)/2),t,font=f,fill=fg); return y+h
def save(im,name): im.convert('RGB').save(f'{OUT}/{name}.jpg',quality=92)

# ---------- CARROSSEL "Como funciona" 1080x1350 ----------
W,H=1080,1350
steps=[("Conversa grátis\nde 20 minutos","A gente entende o seu objetivo, o seu orçamento e se a assessoria faz sentido pra você."),
("Seleção dos leilões","Filtramos os leilões e as casas com potencial nos estados onde atuamos: CT, PA, OH e NY."),
("Visita e análise","Visitamos a casa pessoalmente, pesquisamos dívidas e documentos e calculamos o custo da reforma."),
("Dia do leilão","Definimos juntos o lance máximo e acompanhamos o leilão com você, do Brasil ou daqui."),
("Depois do leilão","Escritura, limpeza, reforma e venda ou aluguel. A gente acompanha cada etapa.")]
im=bg(W,H,'1.jpg',8,0.55); d=ImageDraw.Draw(im); logo(im,150,((W-150)//2,90)); d=ImageDraw.Draw(im)
pill(d,W,330,"ASSESSORIA DISCOVERY",font("Inter-Black.otf",34))
y=block(d,W,440,"Como funciona a nossa assessoria",font("Inter-Black.otf",96),maxw=920)
y=block(d,W,y+30,"Pra brasileiros que querem comprar casa em leilão nos EUA, morando no Brasil ou aqui.",font("Inter-SemiBold.otf",42),SOFT,maxw=860)
pill(d,W,1180,"5 passos  →",font("Inter-Black.otf",44))
save(im,'carrossel-como-funciona-01')
for i,(t,desc) in enumerate(steps,1):
    im=bg(W,H,'15.jpg' if i%2 else '1.jpg',20,0.85); d=ImageDraw.Draw(im)
    d.text((80,80),"COMO FUNCIONA",font=font("Inter-Black.otf",30),fill=GOLD); d.text((80,120),f"Passo {i} de 5",font=font("Inter-SemiBold.otf",30),fill=SOFT)
    logo(im,110,(W-110-60,70)); d=ImageDraw.Draw(im)
    cx,cy,R=W//2,440,130; d.ellipse([cx-R,cy-R,cx+R,cy+R],fill=GOLD)
    nf=font("Inter-Black.otf",170); ctext(d,W,cy-112,str(i),nf,GREEN)
    y=block(d,W,640,t,font("Inter-Black.otf",80),maxw=900)
    block(d,W,y+40,desc,font("Inter-SemiBold.otf",46),SOFT,maxw=880,lh=1.3)
    for k in range(5):
        x=W/2-4*26+k*52; d.ellipse([x-10,1230,x+10,1250],fill=GOLD if k==i-1 else (90,120,92))
    save(im,f'carrossel-como-funciona-0{i+1}')
im=bg(W,H,'15.jpg',8,0.6); d=ImageDraw.Draw(im); logo(im,150,((W-150)//2,90)); d=ImageDraw.Draw(im)
pill(d,W,330,"SÓ 2 VAGAS ESTE MÊS",font("Inter-Black.otf",44))
y=block(d,W,470,"Quer comprar sua casa em leilão nos EUA com a gente?",font("Inter-Black.otf",80),maxw=920)
y=block(d,W,y+30,"O primeiro passo é uma conversa grátis de 20 minutos.",font("Inter-SemiBold.otf",44),SOFT,maxw=860)
pill(d,W,1010,"Comente ASSESSORIA",font("Inter-Black.otf",56),h=110)
ctext(d,W,1160,"ou chame no WhatsApp: link na bio",font("Inter-SemiBold.otf",38),SOFT)
ctext(d,W,1270,"Todo investimento envolve risco.",font("Inter-SemiBold.otf",26),(180,200,176))
save(im,'carrossel-como-funciona-07')

# ---------- FRASES 1080x1350 ----------
frases=[("Quem espera o momento perfeito vê os outros comprando a casa.","1.jpg"),
("Casa barata não é oportunidade. Oportunidade é casa bem analisada.","1.jpg"),
("Você não precisa estar nos EUA. Precisa de alguém que esteja lá por você.","15.jpg")]
for i,(t,p) in enumerate(frases,1):
    im=bg(W,H,p,6,0.62); d=ImageDraw.Draw(im)
    d.text((80,250),"“",font=font("Inter-Black.otf",220),fill=GOLD)
    y=470
    for l in wrap(d,t,font("Inter-Black.otf",84),900): d.text((90,y),l,font=font("Inter-Black.otf",84),fill=WHITE); y+=100
    d.rectangle([90,y+40,250,y+48],fill=GOLD)
    d.text((90,y+75),"Alessandro · Discovery",font=font("Inter-Bold.otf",40),fill=SOFT)
    logo(im,120,(W-120-70,H-160)); save(im,f'frase-0{i}')

# ---------- STORIES 1080x1920 ----------
W,H=1080,1920
def story(name,tag,title,body,cta,cta2=None,photo='1.jpg'):
    im=bg(W,H,photo,18,0.74); d=ImageDraw.Draw(im); logo(im,140,((W-140)//2,230)); d=ImageDraw.Draw(im)
    pill(d,W,430,tag,font("Inter-Black.otf",34))
    y=block(d,W,560,title,font("Inter-Black.otf",84),maxw=920)
    if body: block(d,W,y+40,body,font("Inter-SemiBold.otf",46),SOFT,maxw=880,lh=1.3)
    if cta: pill(d,W,1360,cta,font("Inter-Black.otf",50),h=120)
    if cta2: ctext(d,W,1510,cta2,font("Inter-SemiBold.otf",38),SOFT)
    save(im,name)
story('story-seg-14','PERGUNTA RÁPIDA','Você já pensou em comprar uma casa nos EUA?','Me conta: pra morar, alugar ou revender?','Responda este story 👇'.replace(' 👇',''),'A gente responde todo mundo')
story('story-ter-14','QUIZ','Quanto você acha que vale uma casa reformada aqui?','Responda com o seu palpite em dólares. No vídeo de amanhã tem o número real.','Responda com seu palpite',None,'15.jpg')
story('story-qua-14','PERGUNTA FREQUENTE','“Preciso morar nos EUA pra comprar?”','Não. Muitos dos nossos clientes moram no Brasil. A gente visita, analisa e acompanha tudo por você.','Responda ASSESSORIA','e eu te explico como funciona')
story('story-qui-08','ASSESSORIA DISCOVERY','Abrimos só 2 vagas na assessoria este mês','Atendemos poucas famílias por vez pra visitar e analisar cada casa com cuidado.','Responda VAGA','e eu te chamo pra uma conversa grátis')
story('story-qui-14','PERGUNTA FREQUENTE','“É seguro comprar casa em leilão?”','Todo investimento tem risco. O nosso trabalho é reduzir esse risco: visita presencial, pesquisa de dívidas e lance máximo calculado antes.','Responda ASSESSORIA',None,'15.jpg')
story('story-sex-14','COMO É A CONVERSA','A conversa grátis de 20 minutos','1. Você conta o seu objetivo\n2. A gente explica o processo\n3. Você decide, sem compromisso','Responda CONVERSA','que eu te mando os horários')
story('story-sab-08','UM DOS ÚLTIMOS LEILÕES DO ANO','Bucks County, PA · 8 de dezembro','Leilão online, um dos últimos do ano. A inscrição do licitante é presencial e fecha em 14/11.','Responda LEILÃO','que eu te explico como participar',)
story('story-sab-14','CAIXINHA','Qual é a sua maior dúvida sobre leilão de casas nos EUA?','Mande aqui que eu respondo nos próximos stories.','Responda este story',None,'15.jpg')
story('story-dom-08','ÚLTIMOS DIAS','Ainda tem vaga na assessoria','Só 2 vagas este mês. A conversa é grátis e sem compromisso.','Chame no WhatsApp','link na bio · +1 (475) 349-9986')
story('story-dom-14','HOJE ÀS 19H','Como funciona a nossa assessoria, passo a passo','No feed, às 19h. Fica de olho 👀'.replace(' 👀',''),'Ative as notificações',None,'15.jpg')
story('story-seg-08','SEMANA ESPECIAL','Essa semana é sobre VOCÊ comprar a sua casa nos EUA','Todo dia: casas reais, lances reais e como a gente te ajuda.','Ao meio-dia: vídeo novo','com o Alessandro')
print('ok')
