# Stories da semana 3 (09 a 15/11) no mesmo padrão das artes v2 (Montserrat). Reaproveita os modelos de gerar-artes-v2.py.
import os, re
BASE = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(BASE, 'gerar-artes-v2.py')).read()
head = src[:src.index('pages = []')]
defs = src[src.index('# ---------------- STORIES'):src.index("# Ordem da semana alterna")]
ns = {'__file__': os.path.join(BASE, 'gerar-artes-v2.py')}
exec(head + '\npages = []\n' + defs, ns)
st_cheia, st_verde, st_ouro, st_numero, st_lista = (ns[k] for k in ('st_cheia', 'st_verde', 'st_ouro', 'st_numero', 'st_lista'))
P = []
P.append(st_ouro('s3-seg-08', 'ENQUETE', 'Reforma nos EUA é cara?', 'Responda este story: SIM ou NÃO. Ao meio-dia a gente mostra um custo real da nossa obra.', 'Responda SIM ou NÃO', 'e veja a resposta ao meio-dia', 'casa-953-frente.jpg', '30% 40%'))
P.append(st_verde('s3-seg-14', 'OBRIGADO!', 'Valeu por ontem na live 🙌', 'Perdeu? Hoje às 19h saem no feed as 3 perguntas que mais apareceram.', 'Ative as notificações', None, 'elkland-ale-quintal.jpg', '50% 40%'))
P.append(st_cheia('s3-ter-08', 'BASTIDOR DA OBRA', 'Drywall novo entrando na casa de Elmira', 'Ao meio-dia: quanto custou a casa inteira.', 'Fique de olho', 'casa-953-frente.jpg', '25% 45%', 'ao meio-dia no feed'))
P.append(st_numero('s3-ter-14', 'QUIZ', '?', 'Quanto custa isolar?', 'Paredes e teto de um quartinho, material e mão de obra. Mande seu palpite em dólares.', 'Responda com seu palpite', 'parede-studs.jpg', '50% 45%', 'A resposta sai quinta ao meio-dia'))
P.append(st_ouro('s3-qua-14', 'CAIXINHA', 'Qual é a sua maior dúvida sobre leilão?', 'Mande aqui que eu respondo nos próximos stories.', 'Responda este story', None, 'deck-obra.jpg', '50% 50%'))
P.append(st_cheia('s3-qui-08', 'BASTIDOR DA OBRA', 'Paredes abertas, prontas para o isolamento', 'Ao meio-dia: o custo real.', 'Fique de olho', 'parede-ampla.jpg', '50% 35%', 'ao meio-dia no feed'))
P.append(st_verde('s3-qui-14', 'PERGUNTA FREQUENTE', '"Preciso abrir LLC para comprar?"', 'Depende do seu objetivo. Na conversa grátis a gente explica as opções; a decisão final é com o seu contador.', 'Responda ASSESSORIA', 'e eu te explico como funciona', 'elkland-lateral.jpg'))
P.append(st_ouro('s3-sex-08', 'ENQUETE', 'Cozinha nova: quanto você chuta?', 'A) US$ 2 mil · B) US$ 4 mil · C) US$ 8 mil. Responda com a letra.', 'Responda A, B ou C', 'a resposta sai sábado', 'cozinha-antes.jpg', '50% 50%'))
P.append(st_lista('s3-sab-08', 'PARA SALVAR · PRÓXIMOS LEILÕES', 'Leilões até dezembro', ['Schuylkill, PA · 19/11', 'Bucks, PA · 08/12 (inscr. até 14/11)', 'Delaware, PA · 10/12 (inscr. 16-17/11)'], 'Salve e compartilhe', 'Datas de 27/10: confirme no site do condado'))
P.append(st_verde('s3-sab-14', 'CAIXINHA', 'Pergunte o que quiser sobre a obra', 'Custo, prazo, equipe… eu respondo aqui nos stories.', 'Responda este story', None, 'deck-obra.jpg'))
P.append(st_lista('s3-dom-14', 'RESUMO DA SEMANA', 'Quanto custou até agora', ['Drywall (hallway): US$ 1.400', 'Isolamento: US$ 600', 'Gabinetes: US$ 3.600'], 'Hoje às 19h: a reforma inteira', 'Valores reais deste caso. Cada obra é diferente.', 'casa-953-frente.jpg'))
open(os.path.join(BASE, 'html', 'lista-semana3.txt'), 'w').write('\n'.join(P))
print(len(P), 'stories')
