# Capas dos Reels da semana 3 (1080x1920). O texto fica no centro (y 240-1680), porque o perfil mostra só esse recorte 3:4.
# Logo pequena no canto (não é anúncio); título grande de 3 a 6 palavras com a palavra-chave em dourado.
import os
BASE = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(BASE, 'gerar-artes-v2.py')).read()
ns = {'__file__': os.path.join(BASE, 'gerar-artes-v2.py')}
exec(src[:src.index('pages = []')], ns)
page, foto, logo, G, AU = ns['page'], ns['foto'], ns['logo'], ns['G'], ns['AU']
W, H = 1080, 1920

def capa(nome, tag, titulo, f=None, pos='50% 50%', sub=None, emoji=None):
    if f:
        fundo = foto(f, 0, 0, W, H, pos=pos) + \
            '<div class="a" style="left:0;top:0;width:1080px;height:1920px;background:linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0) 38%,rgba(10,30,14,.88) 62%,rgba(10,30,14,.96) 100%)"></div>'
    else:
        fundo = f'<div class="a" style="left:0;top:0;width:1080px;height:1920px;background:radial-gradient(circle at 50% 35%,#29721D 0%,{G} 70%)"></div>'
        if emoji:
            fundo += f'<div class="a" style="left:0;top:380px;width:1080px;text-align:center;font-size:380px">{emoji}</div>'
    corpo = fundo + logo(y=280, w=110, W=W) + \
        f'<div class="a tag" style="left:80px;top:300px;color:{G};background:{AU};padding:12px 22px">{tag}</div>' + \
        f'<div class="a" style="left:80px;top:1040px;width:920px"><div class="d" style="color:#fff;font-size:215px">{titulo}</div>' + \
        (f'<div class="w b" style="margin-top:36px;color:{AU};font-size:48px">{sub}</div>' if sub else '') + '</div>'
    return page(nome, W, H, G, corpo)

D = lambda t: f'<span style="color:{AU}">{t}</span>'
C = []
C.append(capa('capa-s3-seg-12', 'QUANTO PESA?', f'Quanto pesa esse {D("lixo?")}', 'lixo-pilha.jpg', '40% 50%', 'Chuta aí 👇'))
C.append(capa('capa-s3-seg-19', 'CORTES DA LIVE', f'As 3 perguntas {D("mais feitas")}', 'ale-dicas.jpg', '78% 40%', 'Leilão de casas nos EUA'))
C.append(capa('capa-s3-ter-12', 'RESPOSTA', f'{D("2 toneladas")} de lixo', 'lixo-trailer.jpg', '50% 50%', 'E quanto paguei pra jogar fora'))
C.append(capa('capa-s3-ter-19', 'ACHADO NA CASA', f'Quanto vale esse {D("trompete?")}', None, emoji='🎺', sub='Achamos na casa do leilão'))
C.append(capa('capa-s3-qua-12', 'QUANTO CUSTA?', f'Isolar as paredes: {D("quanto?")}', 'parede-studs.jpg', '50% 45%', 'Valor real da nossa obra'))
C.append(capa('capa-s3-qua-19', 'SÉRIE DA CASA · EP. 9', f'A obra começou {D("de verdade")}', 'parede-ampla.jpg', '50% 40%'))
C.append(capa('capa-s3-qui-12', 'RESPOSTA', f'Isolamento: {D("US$&nbsp;600")}', 'parede-studs.jpg', '50% 45%', 'Material e mão de obra'))
C.append(capa('capa-s3-qui-19', 'NOTÍCIA DA SEMANA', f'Casas nos EUA: {D("o que mudou")}', 'ale-dicas-close.jpg', '80% 35%', 'Em 30 segundos'))
C.append(capa('capa-s3-sex-12', 'QUANTO CUSTA?', f'Telhado novo: {D("quanto?")}', 'telhado-obra.jpg', '42% 50%', 'A, B ou C? 👇'))
C.append(capa('capa-s3-sex-19', 'LEILÃO', f'3 terrenos a {D("US$&nbsp;50")}', None, emoji='📍', sub='Você teria coragem?'))
C.append(capa('capa-s3-sab-10', 'RESPOSTA + 3 DICAS', f'Telhado: {D("US$&nbsp;6.000")}', 'ale-dicas.jpg', '78% 40%', 'Como orçar uma reforma'))
C.append(capa('capa-s3-sab-19', 'A LIÇÃO', f'US$&nbsp;50 pode sair {D("caro")}', None, emoji='⚠️', sub='O que olhar antes do lance'))
C.append(capa('capa-s3-dom-12', 'PATRIMÔNIO', f'Por que ter casa {D("em dólar")}', 'elkland-ale-quintal.jpg', '50% 40%'))
C.append(capa('capa-s3-dom-19', 'QUANTO CUSTA?', f'A reforma {D("inteira")}: quanto?', 'casa-953-frente.jpg', '30% 45%', 'Chuta aí 👇'))
open(os.path.join(BASE, 'html', 'lista.txt'), 'w').write('\n'.join(C))
print(len(C), 'capas')
