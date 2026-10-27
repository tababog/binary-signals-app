# Artes da semana de vendas no padrão do Designer (aprovado em 27/10).
# Gera um HTML por arte em designer/html/ e renderiza em JPG com render.js.
# Famílias de layout (nunca a mesma duas vezes seguidas):
#   capa   – foto nítida em cima + bloco verde com título grande
#   numero – fundo creme, número gigante + foto com cantos arredondados
#   cheia  – foto inteira com degradê escuro embaixo e título por cima
#   ouro   – fundo dourado, texto verde (frases e perguntas)
#   verde  – fundo verde sólido, pergunta gigante, sem foto
#   lista  – fundo creme, faixa verde no topo e itens em cartões
import os, subprocess, sys
BASE = os.path.dirname(os.path.abspath(__file__))
HTML = os.path.join(BASE, 'html'); os.makedirs(HTML, exist_ok=True)
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(BASE, '..', 'semana-vendas')
FOTO = 'file://' + os.path.join(BASE, 'fotos') + '/'
MARCA = 'file://' + os.path.join(BASE, '..', 'marca') + '/'
G, G2, AU, CR, TX, CINZA = '#17361A', '#29721D', '#F2C14E', '#F5F1E6', '#14231A', '#5d6b60'

HEAD = f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Alumni+Sans:wght@900&family=Work+Sans:wght@400;700&display=swap">
<style>*{{margin:0;padding:0;box-sizing:border-box}}
.s{{position:relative;overflow:hidden}}.a{{position:absolute}}
.d{{font-family:"Alumni Sans",sans-serif;font-weight:900;text-transform:uppercase;line-height:.88}}
.w{{font-family:"Work Sans",sans-serif}}.b{{font-weight:700}}
.tag{{font-family:"Work Sans",sans-serif;font-weight:700;letter-spacing:5px;font-size:30px}}
.pill{{font-family:"Work Sans",sans-serif;font-weight:700;text-align:center;border-radius:999px}}
</style></head><body>'''

def logo(cor='branca', x=None, y=60, w=130, W=1080):
    x = W - w - 56 if x is None else x
    return f'<img class="a" src="{MARCA}logo-discovery-{cor}.png" style="left:{x}px;top:{y}px;width:{w}px">'

def foto(nome, x, y, w, h, r=0, pos='50% 50%'):
    return f'<img class="a" src="{FOTO}{nome}" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;object-fit:cover;object-position:{pos};border-radius:{r}px">'

def page(nome, W, H, bg, body):
    with open(os.path.join(HTML, nome + '.html'), 'w') as f:
        f.write(HEAD + f'<div class="s" style="width:{W}px;height:{H}px;background:{bg}">{body}</div></body></html>')
    return nome

def cta(texto, y, W=1080, bg=G, fg=AU, sub=None, subcor=TX, fs=44):
    h = f'<div class="a pill" style="left:72px;top:{y}px;width:{W-144}px;background:{bg};color:{fg};font-size:{fs}px;padding:30px 0">{texto}</div>'
    if sub: h += f'<div class="a w" style="left:72px;top:{y+130}px;width:{W-144}px;text-align:center;color:{subcor};font-size:32px">{sub}</div>'
    return h

pages = []

# ---------------- CARROSSEL "Como funciona" (1080x1350) ----------------
W, H = 1080, 1350
pages.append(page('carrossel-como-funciona-01', W, H, G,
    foto('casa-frente.jpg', 0, 0, 1080, 860, pos='50% 40%') + logo() +
    f'<div class="a tag" style="left:64px;top:800px;background:{AU};color:{G};padding:16px 28px">ASSESSORIA DISCOVERY</div>'
    f'<div class="a d" style="left:64px;top:900px;width:960px;color:#fff;font-size:150px">Como funciona<br>em <span style="color:{AU}">5 passos</span></div>'
    f'<div class="a w" style="left:64px;top:1190px;width:700px;color:#cfe3cf;font-size:32px;line-height:1.3">Do leilão à chave na mão, sem você precisar morar nos EUA.</div>'
    f'<div class="a w b" style="left:860px;top:1230px;color:{AU};font-size:30px">Arraste →</div>'))
steps = [("Conversa grátis de 20 minutos", "A gente entende o seu objetivo, o seu orçamento e se a assessoria faz sentido pra você.", 'casa-frente.jpg', '50% 45%'),
         ("Seleção dos leilões", "Filtramos os leilões e as casas com potencial nos estados onde atuamos: CT, PA, OH e NY.", 'andar-de-cima-antes.jpg', '50% 50%'),
         ("Visita e análise", "Visitamos a casa pessoalmente, pesquisamos dívidas e documentos e calculamos o custo da reforma.", 'cozinha-antes.jpg', '50% 40%'),
         ("Dia do leilão", "Definimos juntos o lance máximo e acompanhamos o leilão com você, do Brasil ou daqui.", 'quarto-antes.jpg', '50% 50%'),
         ("Depois do leilão", "Escritura, limpeza, reforma e venda ou aluguel. A gente acompanha cada etapa.", 'corredor-reformado.jpg', '50% 60%')]
for i, (t, desc, f, pos) in enumerate(steps, 1):
    dots = ''.join(f'<div class="a" style="left:{64+k*44}px;top:1262px;width:{30 if k==i-1 else 14}px;height:14px;border-radius:7px;background:{G if k==i-1 else "#c9c3b2"}"></div>' for k in range(5))
    pages.append(page(f'carrossel-como-funciona-0{i+1}', W, H, CR,
        f'<div class="a tag" style="left:64px;top:70px;color:{G2}">COMO FUNCIONA · PASSO {i} DE 5</div>' + logo('colorida', y=40, w=120) +
        f'<div class="a d" style="left:52px;top:150px;color:{AU};font-size:420px;line-height:.8">{i}</div>'
        f'<div class="a d" style="left:330px;top:190px;width:690px;color:{G};font-size:118px">{t}</div>'
        + foto(f, 64, 540, 952, 500, 28, pos) +
        f'<div class="a w" style="left:64px;top:1080px;width:952px;color:{TX};font-size:38px;line-height:1.35">{desc}</div>' + dots))
pages.append(page('carrossel-como-funciona-07', W, H, G,
    logo(y=56) +
    f'<div class="a tag" style="left:64px;top:90px;color:{G};background:{AU};padding:16px 28px">SÓ 2 VAGAS ESTE MÊS</div>'
    f'<div class="a d" style="left:64px;top:220px;width:952px;color:#fff;font-size:160px">Quer comprar sua casa em leilão nos EUA <span style="color:{AU}">com a gente?</span></div>'
    f'<div class="a w" style="left:64px;top:820px;width:900px;color:#cfe3cf;font-size:40px;line-height:1.35">O primeiro passo é uma conversa grátis de 20 minutos.</div>'
    + cta('Comente ASSESSORIA', 980, bg=AU, fg=G, fs=52, sub='ou chame no WhatsApp: link na bio', subcor='#cfe3cf') +
    f'<div class="a w" style="left:64px;top:1270px;color:#9fb79f;font-size:24px">Todo investimento envolve risco.</div>'))

# ---------------- FRASES (1080x1350): 3 layouts diferentes ----------------
pages.append(page('frase-01', W, H, AU,
    f'<div class="a d" style="left:56px;top:90px;color:{G};font-size:300px;line-height:.7">“</div>'
    f'<div class="a d" style="left:64px;top:330px;width:952px;color:{G};font-size:150px">Quem espera o momento perfeito vê os outros comprando a casa.</div>'
    f'<div class="a" style="left:64px;top:1140px;width:120px;height:8px;background:{G}"></div>'
    f'<div class="a w b" style="left:64px;top:1170px;color:{G};font-size:34px">Alessandro · Discovery</div>' + logo('colorida', y=1150, w=130)))
pages.append(page('frase-02', W, H, G,
    foto('casa-frente.jpg', 0, 0, 1080, 1350, pos='50% 35%') +
    '<div class="a" style="left:0;top:0;width:1080px;height:1350px;background:linear-gradient(180deg,rgba(0,0,0,0) 25%,rgba(10,30,14,.92) 68%)"></div>' + logo() +
    f'<div class="a d" style="left:64px;top:700px;width:952px;color:#fff;font-size:120px">Casa barata não é oportunidade.<br><span style="color:{AU}">Oportunidade é casa bem analisada.</span></div>'
    f'<div class="a w b" style="left:64px;top:1240px;color:#cfe3cf;font-size:32px">Alessandro · Discovery</div>'))
pages.append(page('frase-03', W, H, CR,
    foto('corredor-reformado.jpg', 580, 0, 500, 1350, pos='50% 50%') + logo('colorida', x=64, y=70, w=140) +
    f'<div class="a d" style="left:64px;top:330px;width:480px;color:{G};font-size:118px">Você não precisa estar nos EUA.</div>'
    f'<div class="a d" style="left:64px;top:770px;width:480px;color:{G2};font-size:84px">Precisa de alguém que esteja lá por você.</div>'
    f'<div class="a w b" style="left:64px;top:1240px;color:{TX};font-size:30px">Alessandro · Discovery</div>'))

# ---------------- STORIES (1080x1920) ----------------
W, H = 1080, 1920
def veu(cor):
    return f'<div class="a" style="left:0;top:0;width:1080px;height:1920px;background:{cor}"></div>'
def st_verde(nome, tag, titulo, corpo, c, sub=None, bg='casa-frente.jpg', pos='50% 50%'):
    return page(nome, W, H, G, foto(bg, 0, 0, W, H, pos=pos) +
        veu('linear-gradient(180deg,rgba(23,54,26,.35) 0%,rgba(23,54,26,.78) 40%,rgba(23,54,26,.94) 100%)') + logo(y=230, W=W) +
        f'<div class="a tag" style="left:72px;top:250px;color:{AU}">{tag}</div>'
        f'<div class="a" style="left:72px;top:440px;width:936px"><div class="d" style="color:#fff;font-size:160px">{titulo}</div>'
        f'<div class="w" style="margin-top:60px;color:#cfe3cf;font-size:44px;line-height:1.35">{corpo}</div></div>'
        + cta(c, 1440, bg=AU, fg=G, sub=sub, subcor='#cfe3cf'))
def st_ouro(nome, tag, titulo, corpo, c, sub=None, bg='elkland-fundos.jpg', pos='50% 50%'):
    return page(nome, W, H, AU, foto(bg, 0, 0, W, 1000, pos=pos) +
        '<div class="a" style="left:0;top:560px;width:1080px;height:1360px;background:linear-gradient(180deg,rgba(242,193,78,0) 0%,#F2C14E 30%)"></div>' + logo(y=230, W=W) +
        f'<div class="a tag" style="left:72px;top:250px;color:#fff;background:{G};padding:12px 22px">{tag}</div>'
        f'<div class="a" style="left:72px;bottom:560px;width:936px"><div class="d" style="color:{G};font-size:140px">{titulo}</div>'
        f'<div class="w" style="margin-top:40px;color:{TX};font-size:42px;line-height:1.35">{corpo}</div></div>'
        + cta(c, 1440, sub=sub))
def st_cheia(nome, tag, titulo, corpo, c, f, pos, sub=None):
    return page(nome, W, H, G, foto(f, 0, 0, W, H, pos=pos) +
        '<div class="a" style="left:0;top:0;width:1080px;height:1920px;background:linear-gradient(180deg,rgba(0,0,0,.25) 0%,rgba(0,0,0,0) 22%,rgba(10,30,14,.94) 55%)"></div>' + logo(y=230, W=W) +
        f'<div class="a tag" style="left:72px;top:250px;color:#fff;background:rgba(23,54,26,.85);padding:12px 22px">{tag}</div>'
        f'<div class="a" style="left:72px;bottom:540px;width:936px"><div class="d" style="color:#fff;font-size:140px">{titulo}</div>'
        f'<div class="w" style="margin-top:40px;color:#e2ecdf;font-size:42px;line-height:1.35">{corpo}</div></div>'
        + cta(c, 1440, bg=AU, fg=G, sub=sub, subcor='#e2ecdf'))
def st_numero(nome, tag, num, palavra, corpo, c, f, pos, sub=None):
    return page(nome, W, H, CR, logo('colorida', x=72, y=220, w=150, W=W) +
        f'<div class="a tag" style="left:72px;top:420px;color:{G2}">{tag}</div>'
        f'<div class="a d" style="left:60px;top:450px;color:{G};font-size:520px;line-height:.9">{num}</div>'
        f'<div class="a d" style="left:420px;top:540px;width:600px;color:{G};font-size:150px">{palavra}</div>'
        + foto(f, 72, 960, 936, 420, 28, pos) +
        f'<div class="a w" style="left:72px;top:1405px;width:936px;color:{TX};font-size:38px;line-height:1.3">{corpo}</div>'
        + cta(c, 1540, sub=sub))
def st_lista(nome, tag, titulo, itens, c, sub=None, bg='deck-pronto.jpg'):
    cards = ''.join(f'<div class="a" style="left:72px;top:{760+i*190}px;width:936px;height:160px;background:#fff;border-radius:24px"></div>'
                    f'<div class="a d" style="left:72px;top:{772+i*190}px;width:150px;text-align:center;color:{AU};font-size:140px">{i+1}</div>'
                    f'<div class="a w b" style="left:230px;top:{815+i*190}px;width:740px;color:{G};font-size:42px">{t}</div>' for i, t in enumerate(itens))
    return page(nome, W, H, CR, foto(bg, 0, 0, 1080, 700, pos='50% 50%') +
        f'<div class="a" style="left:0;top:0;width:1080px;height:700px;background:rgba(23,54,26,.72)"></div>' + logo(y=230, W=W) +
        f'<div class="a tag" style="left:72px;top:250px;color:{AU}">{tag}</div>'
        f'<div class="a d" style="left:72px;top:380px;width:936px;color:#fff;font-size:130px">{titulo}</div>' + cards + cta(c, 1440, sub=sub))

# Ordem da semana alterna os layouts: seg8 cheia, seg14 verde, ter14 numero, qua14 ouro, qui8 numero(2 vagas),
# qui14 verde, sex14 lista, sab8 cheia, sab14 ouro, dom8 numero, dom14 verde
pages.append(st_cheia('story-seg-08', 'SEMANA ESPECIAL', 'Essa semana é sobre você comprar sua casa nos EUA',
    'Todo dia: casas reais, lances reais e como a gente te ajuda.', 'Ao meio-dia: vídeo novo', 'casa-frente.jpg', '50% 40%', 'com o Alessandro'))
pages.append(st_verde('story-seg-14', 'PERGUNTA RÁPIDA', 'Você já pensou em comprar uma casa nos EUA?',
    'Me conta: pra morar, alugar ou revender?', 'Responda este story', 'A gente responde todo mundo', 'elkland-lateral.jpg'))
pages.append(st_numero('story-ter-14', 'QUIZ', '?', 'Quanto vale essa casa?', 'Quanto você acha que vale uma casa reformada aqui? Responda com seu palpite em dólares.',
    'Responda com seu palpite', 'corredor-reformado.jpg', '50% 60%', 'No vídeo de amanhã tem o número real'))
pages.append(st_ouro('story-qua-14', 'PERGUNTA FREQUENTE', '“Preciso morar nos EUA pra comprar?”',
    'Não. Muitos dos nossos clientes moram no Brasil. A gente visita, analisa e acompanha tudo por você.', 'Responda ASSESSORIA', 'e eu te explico como funciona', 'elkland-ale-quintal.jpg', '50% 45%'))
pages.append(st_numero('story-qui-08', 'ASSESSORIA · NOVEMBRO', '2', 'vagas<br><span style="color:#29721D">abertas</span>',
    'Atendemos poucas famílias por vez pra visitar e analisar cada casa com cuidado.', 'Responda VAGA', 'deck-pronto.jpg', '50% 55%', 'e eu te chamo pra uma conversa grátis'))
pages.append(st_verde('story-qui-14', 'PERGUNTA FREQUENTE', '“É seguro comprar casa em leilão?”',
    'Todo investimento tem risco. O nosso trabalho é reduzir esse risco: visita presencial, pesquisa de dívidas e lance máximo calculado antes.', 'Responda ASSESSORIA', None, 'casa-igreja-antes.jpg'))
pages.append(st_lista('story-sex-14', 'COMO É A CONVERSA', 'A conversa grátis de 20 minutos',
    ['Você conta o seu objetivo', 'A gente explica o processo', 'Você decide, sem compromisso'], 'Responda CONVERSA', 'que eu te mando os horários'))
pages.append(st_cheia('story-sab-08', 'UM DOS ÚLTIMOS LEILÕES DO ANO', 'Bucks County, PA · 8 de dezembro',
    'Leilão online. A inscrição do licitante é presencial e fecha em 14/11.', 'Responda LEILÃO', 'elkland-fundos.jpg', '50% 50%', 'que eu te explico como participar'))
pages.append(st_ouro('story-sab-14', 'CAIXINHA', 'Qual é a sua maior dúvida sobre leilão de casas nos EUA?',
    'Mande aqui que eu respondo nos próximos stories.', 'Responda este story', None, 'casa-igreja-lateral.jpg', '50% 40%'))
pages.append(st_numero('story-dom-08', 'ÚLTIMOS DIAS', '2', 'vagas<br><span style="color:#29721D">este mês</span>',
    'Ainda tem vaga na assessoria. A conversa é grátis e sem compromisso.', 'Chame no WhatsApp', 'deck-estrutura.jpg', '50% 50%', 'link na bio · +1 (475) 349-9986'))
pages.append(st_verde('story-dom-14', 'HOJE ÀS 19H', 'Como funciona a nossa assessoria, passo a passo',
    'No feed, às 19h. Fica de olho.', 'Ative as notificações', None, 'deck-obra.jpg'))
pages.append(page('story-destaque-avaliacao', W, H, CR, foto('deck-pronto.jpg', 0, 0, 1080, 760) +
    f'<div class="a" style="left:0;top:0;width:1080px;height:760px;background:rgba(23,54,26,.74)"></div>' + logo(y=230, W=W) +
    f'<div class="a tag" style="left:72px;top:250px;color:{AU}">DEPOIMENTOS DE CLIENTES</div>'
    f'<div class="a d" style="left:72px;top:390px;width:936px;color:#fff;font-size:140px">Como é comprar casa em leilão com a gente?</div>'
    f'<div class="a w" style="left:72px;top:830px;width:936px;color:{TX};font-size:44px;line-height:1.35">Quem já fez a assessoria conta tudo no destaque:</div>'
    f'<div class="a" style="left:390px;top:990px;width:300px;height:300px;border-radius:50%;background:{G};border:10px solid {AU}"></div>'
    f'<div class="a d" style="left:390px;top:1085px;width:300px;text-align:center;color:{AU};font-family:\'Work Sans\';font-size:76px;letter-spacing:4px">★★★</div>'
    f'<div class="a d" style="left:72px;top:1320px;width:936px;text-align:center;color:{G};font-size:80px">Avaliação</div>'
    + cta('Veja no destaque AVALIAÇÃO', 1440, sub='Toque em @discoveryremodeling no topo')))

def cena(nome, f, pos, topo, titulo, corpo, passo=None):
    barra = ''
    if passo:
        barra = ''.join(f'<div class="a" style="left:{72+k*160}px;top:250px;width:146px;height:10px;border-radius:5px;background:{AU if k < passo else "rgba(255,255,255,.35)"}"></div>' for k in range(5))
        barra += f'<div class="a d" style="left:60px;top:300px;color:{AU};font-size:420px;line-height:.85">{passo}</div>'
    return page(nome, W, H, G, foto(f, 0, 0, W, H, pos=pos) +
        veu('linear-gradient(180deg,rgba(10,30,14,.55) 0%,rgba(10,30,14,.1) 30%,rgba(10,30,14,.92) 62%)') + logo(y=230, W=W) + barra +
        (f'<div class="a tag" style="left:72px;top:{300 if not passo else 760}px;color:{G};background:{AU};padding:12px 22px">{topo}</div>' if topo else '') +
        f'<div class="a" style="left:72px;bottom:460px;width:936px"><div class="d" style="color:#fff;font-size:150px">{titulo}</div>'
        f'<div class="w" style="margin-top:40px;color:#e2ecdf;font-size:44px;line-height:1.35">{corpo}</div></div>')
reel = [cena('reel-cf-0', 'casa-frente.jpg', '50% 40%', 'ASSESSORIA DISCOVERY', 'Como funciona em <span style="color:#F2C14E">5 passos</span>', 'Do leilão à chave na mão, sem você precisar morar nos EUA.')]
fotos_passos = [('elkland-ale-quintal.jpg', '50% 45%'), ('casa-igreja-lateral.jpg', '50% 40%'), ('casa-igreja-antes.jpg', '50% 50%'), ('elkland-fundos.jpg', '50% 50%'), ('deck-pronto.jpg', '50% 50%')]
for i, ((t, desc, *_), (f, pos)) in enumerate(zip(steps, fotos_passos), 1):
    reel.append(cena(f'reel-cf-{i}', f, pos, None, t, desc, passo=i))
reel.append(page('reel-cf-6', W, H, G, foto('deck-estrutura.jpg', 0, 0, W, H) +
    veu('linear-gradient(180deg,rgba(23,54,26,.6) 0%,rgba(23,54,26,.9) 45%,rgba(23,54,26,.96) 100%)') + logo(y=230, W=W) +
    f'<div class="a tag" style="left:72px;top:250px;color:{G};background:{AU};padding:12px 22px">SÓ 2 VAGAS ESTE MÊS</div>'
    f'<div class="a" style="left:72px;top:420px;width:936px"><div class="d" style="color:#fff;font-size:150px">Quer comprar sua casa em leilão nos EUA <span style="color:{AU}">com a gente?</span></div>'
    f'<div class="w" style="margin-top:50px;color:#e2ecdf;font-size:44px;line-height:1.35">O primeiro passo é uma conversa grátis de 20 minutos.</div></div>'
    + cta('Comente ASSESSORIA', 1400, bg=AU, fg=G, fs=52, sub='ou chame no WhatsApp: link na bio', subcor='#e2ecdf')))
open(os.path.join(HTML, 'reel.txt'), 'w').write('\n'.join(reel))

# ---------------- POST PARA SALVAR: calendário de leilões (1080x1350) ----------------
W, H = 1080, 1350
leiloes = [("05","NOV","Livingston County","Nova York · presencial"), ("05","NOV","Poughkeepsie","Nova York · online"),
           ("12","NOV","Essex County","Nova York · presencial + online"), ("17","NOV","Orleans County","Nova York · online (13 a 17/11)"),
           ("18","NOV","Rochester","Nova York · presencial"), ("24","NOV","Lewis County","Nova York · online"),
           ("08","DEZ","Bucks County","Pensilvânia · online"), ("10","DEZ","Delaware County","Pensilvânia · upset sale")]
linhas = ''
for i, (d, m, c, sub) in enumerate(leiloes):
    y = 380 + i * 102
    linhas += (f'<div class="a" style="left:64px;top:{y}px;width:952px;height:88px;background:#fff;border-radius:18px"></div>'
               f'<div class="a" style="left:64px;top:{y}px;width:150px;height:88px;background:{AU};border-radius:18px 0 0 18px"></div>'
               f'<div class="a d" style="left:64px;top:{y+8}px;width:150px;text-align:center;color:{G};font-size:58px">{d}</div>'
               f'<div class="a w b" style="left:64px;top:{y+58}px;width:150px;text-align:center;color:{G};font-size:19px;letter-spacing:3px">{m}</div>'
               f'<div class="a w b" style="left:240px;top:{y+12}px;color:{G};font-size:33px">{c}</div>'
               f'<div class="a w" style="left:240px;top:{y+52}px;color:{CINZA};font-size:23px">{sub}</div>')
pages.append(page('post-calendario-leiloes', W, H, CR, foto('elkland-fundos.jpg', 0, 0, 1080, 340, pos='50% 60%') +
    f'<div class="a" style="left:0;top:0;width:1080px;height:340px;background:rgba(23,54,26,.8)"></div>' + logo(y=44, w=120) +
    f'<div class="a tag" style="left:64px;top:56px;color:{AU}">SALVE ESTE POST 📌</div>'
    f'<div class="a d" style="left:64px;top:115px;width:880px;color:#fff;font-size:116px">Leilões de casas<br>nos EUA · Nov/Dez</div>' + linhas +
    f'<div class="a w b" style="left:64px;top:1214px;color:{G};font-size:30px">Mande pra quem quer investir nos EUA 🇧🇷🇺🇸</div>'
    f'<div class="a w" style="left:64px;top:1262px;width:952px;color:{CINZA};font-size:19px;line-height:1.35">Datas conferidas nos sites oficiais em 27/10/2026 e sujeitas a mudança. Confira no site do condado antes de se inscrever. Não é recomendação de investimento.</div>'))

# ---------------- DIÁRIO DA CASA (stories da semana 27/10 a 02/11, casa de Elmira) ----------------
W, H = 1080, 1920
diario = [("Compramos uma casa em leilão. Hoje é o 1º dia lá dentro", "Ao meio-dia: o que aconteceu na porta 🔑", 'casa-frente.jpg', '50% 40%'),
          ("Primeira visita de dia… e debaixo de chuva", "Ao meio-dia: o tour pela casa 🏠", 'casa-frente.jpg', '80% 50%'),
          ("Lá dentro: o que deixaram pra trás?", "Ao meio-dia: o que encontramos 👀", 'quarto-antes.jpg', '50% 50%'),
          ("Dia de limpeza: tudo que ficou tem que sair", "Às 19h: o antes e depois da limpeza", 'cozinha-antes.jpg', '50% 40%'),
          ("E a garagem? Lotada até o teto", "Às 10h: pra onde vai todo esse entulho 🚛", 'casa-frente.jpg', '95% 60%'),
          ("Mais uma carga pro descarte", "Às 19h: quem somos e como ajudamos você", 'andar-de-cima-antes.jpg', '50% 50%'),
          ("Casa vazia e limpa. Agora começa a reforma", "Siga pra acompanhar a obra ✨", 'casa-frente.jpg', '30% 45%')]
dl = []
for i, (ctx, cham, f, pos) in enumerate(diario, 1):
    barra = ''.join(f'<div class="a" style="left:{72+k*112}px;top:350px;width:100px;height:10px;border-radius:5px;background:{AU if k < i else "rgba(255,255,255,.35)"}"></div>' for k in range(7))
    dl.append(page(f'diario-dia{i}', W, H, G, foto(f, 0, 0, W, H, pos=pos) +
        veu('linear-gradient(180deg,rgba(10,30,14,.55) 0%,rgba(10,30,14,.05) 30%,rgba(10,30,14,.93) 62%)') + logo(y=230, W=W) +
        f'<div class="a tag" style="left:72px;top:255px;color:{G};background:{AU};padding:12px 22px">DIÁRIO DA CASA · DIA {i}/7</div>' + barra +
        f'<div class="a" style="left:72px;bottom:560px;width:936px"><div class="d" style="color:#fff;font-size:150px">{ctx}</div></div>'
        + cta(cham, 1440, bg=AU, fg=G, fs=40)))
open(os.path.join(HTML, 'diario.txt'), 'w').write('\n'.join(dl))

open(os.path.join(HTML, 'lista.txt'), 'w').write('\n'.join(pages))
print(len(pages), 'artes')
