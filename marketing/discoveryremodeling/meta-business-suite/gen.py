import json
DL=lambda i:f"https://drive.usercontent.google.com/download?id={i}&export=download&confirm=t"
VW=lambda i:f"https://drive.google.com/file/d/{i}/view"
GH=lambda p:"https://raw.githubusercontent.com/tababog/binary-signals-app/claude/beautiful-hamilton-br5zyn/marketing/discoveryremodeling/"+p
FV="https://drive.google.com/drive/folders/1Zh2fVnfulNWJDsVt3Dpmmc9vntwqk-Kg"
CTA="\n\n📞 Conversa grátis de 20 minutos pra entender o seu objetivo. Estamos com só 2 vagas abertas na assessoria.\n👉 Comente ASSESSORIA ou chame no WhatsApp (link na bio).\n\nValores estimados. Resultados passados não garantem resultados futuros. Todo investimento envolve risco.\n#leilaodeimoveis #taxdeed #imoveisnoseua #brasileirosnoseua #casasnoseua #investirnoseua"
def cap(t): return t+CTA
# kind: reel, story, foto, carrossel ; file: (label, download, view) or None
D=[
("seg","Segunda","02/11",[
 ("06:00","story","Diário da casa · dia 7",("diario-dia7-video.mp4",DL("1uImb9OXa5vqjHUtG4MdnlLebXelCDlaB"),VW("1uImb9OXa5vqjHUtG4MdnlLebXelCDlaB")),None,None),
 ("06:00","story","Essa semana é sobre você comprar sua casa nos EUA",("story-seg-08.mp4",GH("semana-vendas/animados/story-seg-08.mp4"),None),None,None),
 ("10:00","reel","Você NÃO precisa morar nos EUA (Reel do Ale)",None,cap("Você NÃO precisa morar nos Estados Unidos pra comprar casa em leilão aqui 🇺🇸🏠 A gente visita, analisa e acompanha tudo por você.\n\nVocê sabia disso? Conta aqui 👇"),"Você grava este vídeo. Sem ele, pule este post."),
 ("12:00","story","Você já pensou em comprar uma casa nos EUA?",("story-seg-14.mp4",GH("semana-vendas/animados/story-seg-14.mp4"),None),None,None),
 ("17:00","foto","Calendário de leilões (para salvar)",("post-calendario-leiloes.jpg",GH("semana-vendas/post-calendario-leiloes.jpg"),None),cap("📌 SALVE este post: leilões de casas em Nova York e na Pensilvânia em novembro e dezembro. Mande pra quem quer investir nos EUA! Datas conferidas nos sites oficiais em 27/10; confira sempre no site do condado antes de se inscrever.\n\nQual condado você quer acompanhar? 👇"),None)]),
("ter","Terça","03/11",[
 ("10:00","reel","Casa 1: a melhor casa do leilão",("casa-1-nova-york-v3.mp4",DL("16cI2dSqPUcFBcT8o3ADDcQvqjiTEVNoU"),VW("16cI2dSqPUcFBcT8o3ADDcQvqjiTEVNoU")),cap("Essa foi a melhor casa que a gente viu nesse leilão 👀 Olha o estado dela por dentro e por fora.\n\nVocê compraria essa casa? Sim ou não 👇"),None),
 ("12:00","story","Quiz: quanto vale essa casa?",("story-ter-14.mp4",GH("semana-vendas/animados/story-ter-14.mp4"),None),None,None),
 ("17:00","reel","Série da casa · ep. 7: os vizinhos",("erie-ep7.mp4",DL("1-Oe6zVawhGe3OOfh-rsmbMj0_CqC6_IQ"),VW("1-Oe6zVawhGe3OOfh-rsmbMj0_CqC6_IQ")),cap("Na noite em que abrimos a casa, os vizinhos vieram ver o barulho 👀\nGente que mora na rua há mais de 30 anos: todo mundo se conhece.\nE dessa conversa saíram dois contatos para trabalhar na obra.\n\nVocê conhece seus vizinhos? 👇"),None)]),
("qua","Quarta","04/11",[
 ("06:00","story","Como é a avaliação da casa (destaque)",("story-destaque-avaliacao.mp4",GH("semana-vendas/animados/story-destaque-avaliacao.mp4"),None),None,None),
 ("10:00","reel","Casa 2: casa de 2 famílias",("casa-2-nova-york-v3.mp4",DL("1DYh5euPHrVxI3jnyKJxurfpZqdsZ_GZJ"),VW("1DYh5euPHrVxI3jnyKJxurfpZqdsZ_GZJ")),cap("Casa de 2 famílias numa avenida principal: compraria? 🤔 Olha o tour por dentro.\n\nVocê moraria ou alugaria? 👇"),None),
 ("12:00","story","\"Preciso morar nos EUA pra comprar?\"",("story-qua-14.mp4",GH("semana-vendas/animados/story-qua-14.mp4"),None),None,None)]),
("qui","Quinta","05/11",[
 ("06:00","story","2 vagas abertas na assessoria",("story-qui-08.mp4",GH("semana-vendas/animados/story-qui-08.mp4"),None),None,None),
 ("10:00","carrossel","Do leilão à venda: Elkland, PA",("Pasta Reels Semana Vendas (elkland-carrossel-NN-v2.jpg)",None,FV),cap("Do leilão à venda: a transformação da casa de Elkland, PA, cômodo por cômodo 🔨➡️🏡 Arraste pro lado.\n\nQual foi a maior transformação? 👇"),"A versão nova do carrossel ainda não chegou do notebook. Agende quando as imagens -v2 estiverem na pasta."),
 ("10:00","story","Convite da live de domingo",("story-live-convite.mp4",GH("semana-vendas/animados/story-live-convite.mp4"),None),None,None),
 ("12:00","story","\"É seguro comprar casa em leilão?\"",("story-qui-14.mp4",GH("semana-vendas/animados/story-qui-14.mp4"),None),None,None),
 ("17:00","reel","Série da casa · ep. 8: vida nova",("erie-ep8.mp4",DL("1-NJLfJBUCoIrRGrk2ISKlT_Rahitx-Fy"),VW("1-NJLfJBUCoIrRGrk2ISKlT_Rahitx-Fy")),cap("Depois da limpeza, começa a parte boa 🔨\nA casa está vazia e pronta pra reforma.\nO objetivo é um só: trazer vida nova pra ela, pra outra família ser feliz aqui.\n\nO que você mudaria primeiro nessa casa? 👇"),None)]),
("sex","Sexta","06/11",[
 ("10:00","reel","VENDEMOS! 35 dias no mercado",("casa-5-vendemos-v3.mp4",DL("1On_mECZdD7Q2S3YrXOGSfivbDdeKC8id"),VW("1On_mECZdD7Q2S3YrXOGSfivbDdeKC8id")),cap("VENDEMOS! 🎉 Compramos, reformamos e vendemos: 100% do processo concluído, 35 dias no mercado. Compra US$ 48.000 · Reforma US$ 38.000 · Venda US$ 135.000 (valores reais deste caso).\n\nQual parte você achou mais difícil: comprar, reformar ou vender? 👇"),None),
 ("10:00","story","Convite da live de domingo",("story-live-convite.mp4",GH("semana-vendas/animados/story-live-convite.mp4"),None),None,None),
 ("12:00","story","Como é a conversa grátis de 20 min",("story-sex-14.mp4",GH("semana-vendas/animados/story-sex-14.mp4"),None),None,None),
 ("17:00","reel","Casa 3: essa a gente NÃO compraria",("casa-3-nova-york-v3.mp4",DL("11O6adIVGIHa403RD-HBpnNvjnR8dl0Rh"),VW("11O6adIVGIHa403RD-HBpnNvjnR8dl0Rh")),cap("Essa a gente NÃO compraria, e você precisa saber por quê 👇\n\nVocê teria comprado? 👇"),None)]),
("sab","Sábado","07/11",[
 ("06:00","story","Bucks County, PA · leilão de 8/12",("story-sab-08.mp4",GH("semana-vendas/animados/story-sab-08.mp4"),None),None,None),
 ("08:00","reel","Casa 4: a importância da visita",("casa-4-nova-york-v3.mp4",DL("1a-sp5IS9tznvK_WWDp-X-2EEqkAszvhc"),VW("1a-sp5IS9tznvK_WWDp-X-2EEqkAszvhc")),cap("No Google ela parecia bonita… olha o que a gente encontrou na visita 😳 Por isso a visita presencial é obrigatória.\n\nVocê entraria nesse leilão? 👇"),None),
 ("10:00","story","Convite da live de domingo",("story-live-convite.mp4",GH("semana-vendas/animados/story-live-convite.mp4"),None),None,None),
 ("12:00","story","Caixinha: qual é a sua maior dúvida?",("story-sab-14.mp4",GH("semana-vendas/animados/story-sab-14.mp4"),None),None,None),
 ("17:00","reel","Elkland: do leilão à casa pronta",("elkland-reel-v3.mp4",DL("16X_5_rW37vj6BCLa_Sq10cBx0SDNq97h"),VW("16X_5_rW37vj6BCLa_Sq10cBx0SDNq97h")),cap("Essa casa foi a leilão… olha como ela ficou depois da reforma 🏡✨\n\nVocê imaginava esse resultado? 👇"),None)]),
("dom","Domingo","08/11",[
 ("06:00","story","Últimos dias: 2 vagas este mês",("story-dom-08.mp4",GH("semana-vendas/animados/story-dom-08.mp4"),None),None,None),
 ("10:00","story","É hoje: live às 18h (seu horário)",("story-live-hoje.mp4",GH("semana-vendas/animados/story-live-hoje.mp4"),None),None,None),
 ("12:00","story","Hoje: como funciona a assessoria",("story-dom-14.mp4",GH("semana-vendas/animados/story-dom-14.mp4"),None),None,None),
 ("17:00","reel","Como funciona a nossa assessoria",("reel-como-funciona.mp4",GH("semana-vendas/animados/reel-como-funciona.mp4"),None),cap("Como funciona a nossa assessoria, em 5 passos: da conversa grátis até a chave na mão, sem você precisar morar nos EUA 🇧🇷🇺🇸 Últimas vagas deste mês.\n\nQual é a sua maior dúvida? Pergunta aqui 👇"),None),
 ("17:00","story","É hoje: live daqui a 1 hora",("story-live-hoje.mp4",GH("semana-vendas/animados/story-live-hoje.mp4"),None),None,None),
 ("18:00","live","LIVE de dúvidas (você entra ao vivo)",None,None,"Não se agenda: abra o Instagram e toque em + → Live. Roteiro: live-domingo-08-11.md no repositório.")]),
]
data=[{"id":d,"name":n,"date":dt,"items":[{"t":t,"k":k,"title":ti,"file":f,"cap":c,"note":no} for (t,k,ti,f,c,no) in items]} for d,n,dt,items in D]
tpl=open('tpl.html').read().replace('/*DATA*/',json.dumps(data,ensure_ascii=False))
open('pacote-meta.html','w').write(tpl)
print(sum(len(x['items']) for x in data))
