import json
DL=lambda i:f"https://drive.usercontent.google.com/download?id={i}&export=download&confirm=t"
VW=lambda i:f"https://drive.google.com/file/d/{i}/view"
GH=lambda p:"https://raw.githubusercontent.com/tababog/binary-signals-app/claude/beautiful-hamilton-br5zyn/marketing/discoveryremodeling/"+p
FV="https://drive.google.com/drive/folders/1Zh2fVnfulNWJDsVt3Dpmmc9vntwqk-Kg"
CTA="\n\n📞 Conversa grátis de 20 minutos pra entender o seu objetivo. Estamos com só 2 vagas abertas na assessoria.\n👉 Comente ASSESSORIA ou chame no WhatsApp (link na bio).\n\nValores estimados. Resultados passados não garantem resultados futuros. Todo investimento envolve risco.\n#leilaodeimoveis #taxdeed #imoveisnoseua #brasileirosnoseua #casasnoseua #investirnoseua"
CARROSSEL_ELK=[DL("1N-fUc3fEeMobbLp9T1JekiRCZqdcG9oL"),DL("1RV5m14N__hfTJe7R4An9aq8LjgdejDK1"),DL("1Vhwk9r_Fh1aTl4EhYGZe4QGJQ0voZSmb"),DL("1k6_AoJ_9hOoxFVSP8V4LGshPN1ZAqPFv"),DL("1pig4H8o94FVPEvXqUubhECUGFJXEl0_Q"),DL("1wuczZajIQ6Dii0ETxOc9jQ5IYjwj3Olx"),DL("19OsogV7V5oIMXsxP_hDn0kFm7ucWBT0B"),DL("1Q3_7YhPAqD2TZ8LbhkzuAIqmvsSuu65V"),DL("12H6Hx8gv_HhAPsHFDIAkZPhpUFxQKAZx")]
def cap(t): return t+CTA
# kind: reel, story, foto, carrossel ; file: (label, download, view) or None
D=[
("seg","Segunda","02/11",[
 ("06:00","story","Diário da casa · dia 7",("diario-dia7-video.mp4",DL("1uImb9OXa5vqjHUtG4MdnlLebXelCDlaB"),VW("1uImb9OXa5vqjHUtG4MdnlLebXelCDlaB")),None,None),
 ("06:00","story","Essa semana é sobre você comprar sua casa nos EUA",("story-seg-08.mp4",GH("semana-vendas/animados/story-seg-08.mp4"),None),None,None),
 ("10:00","reel","Você NÃO precisa morar nos EUA (Reel do Ale)",("reel-segunda-assessoria-v4.mp4",DL("1YZvTmQR3lsLr6gPblBLnRNDt3UBLiWmL"),VW("1YZvTmQR3lsLr6gPblBLnRNDt3UBLiWmL")),cap("Você NÃO precisa morar nos Estados Unidos pra comprar casa em leilão aqui 🇺🇸🏠 A gente visita, analisa e acompanha tudo por você.\n\nVocê sabia disso? Conta aqui 👇"),None),
 ("12:00","story","Você já pensou em comprar uma casa nos EUA?",("story-seg-14.mp4",GH("semana-vendas/animados/story-seg-14.mp4"),None),None,None),
 ("17:00","foto","Calendário de leilões (para salvar)",("post-calendario-leiloes.jpg",GH("semana-vendas/post-calendario-leiloes.jpg"),None),cap("📌 SALVE este post: leilões de casas em Nova York e na Pensilvânia em novembro e dezembro. Mande pra quem quer investir nos EUA! Datas conferidas nos sites oficiais em 27/10; confira sempre no site do condado antes de se inscrever.\n\nQual condado você quer acompanhar? 👇"),None)]),
("ter","Terça","03/11",[
 ("06:00","story","Prévia da Casa 1 (hoje às 12h no feed)",("previa-casa-1.mp4",GH("semana-vendas/aprovados/previa-casa-1.mp4"),None),None,None),
 ("10:00","reel","Casa 1: a melhor casa do leilão",("casa-1-nova-york-v4.mp4",DL("1prJvsOE59L7AP60qvUpgeINkmL8b7hdL"),VW("1prJvsOE59L7AP60qvUpgeINkmL8b7hdL")),cap("Essa foi a melhor casa que a gente viu nesse leilão 👀 Olha o estado dela por dentro e por fora.\n\nVocê compraria essa casa? Sim ou não 👇"),None),
 ("12:00","story","Quiz: quanto vai valer a casa de Elmira depois da reforma?",("story-ter-14.mp4",GH("semana-vendas/animados-musica/story-ter-14.mp4"),None),None,None),
 ("17:00","reel","Série da casa · ep. 7: os vizinhos",("erie-ep7.mp4",DL("1-Oe6zVawhGe3OOfh-rsmbMj0_CqC6_IQ"),VW("1-Oe6zVawhGe3OOfh-rsmbMj0_CqC6_IQ")),cap("Na noite em que abrimos a casa, os vizinhos vieram ver o barulho 👀\nGente que mora na rua há mais de 30 anos: todo mundo se conhece.\nE dessa conversa saíram dois contatos para trabalhar na obra.\n\nVocê conhece seus vizinhos? 👇"),None)]),
("qua","Quarta","04/11",[
 ("06:00","story","Como é a avaliação da casa (destaque)",("story-destaque-avaliacao.mp4",GH("semana-vendas/animados-musica/story-destaque-avaliacao.mp4"),None),None,None),
 ("10:00","reel","Casa 2: casa de 2 famílias",("casa-2-nova-york-v4.mp4",GH("semana-vendas/aprovados/casa-2-nova-york-v4.mp4"),None),cap("Casa de 2 famílias numa avenida principal: compraria? 🤔 Olha o tour por dentro.\n\nVocê moraria ou alugaria? 👇"),None),
 ("12:00","story","\"Preciso morar nos EUA pra comprar?\"",("story-qua-14.mp4",GH("semana-vendas/animados-musica/story-qua-14.mp4"),None),None,None)]),
("qui","Quinta","05/11",[
 ("06:00","story","2 vagas abertas na assessoria",("story-qui-08.mp4",GH("semana-vendas/animados-musica/story-qui-08.mp4"),None),None,None),
 ("10:00","carrossel","Do leilão à venda: Elkland, PA",("Pasta Reels Semana Vendas (elkland-carrossel-NN-v2.jpg)",None,FV),cap("Do leilão à venda: a transformação da casa de Elkland, PA, cômodo por cômodo 🔨➡️🏡 Arraste pro lado.\n\nQual foi a maior transformação? 👇"),"9 imagens elkland-carrossel-01-v2 a 09-v2 (pasta Reels Semana Vendas), nesta ordem."),
 ("10:00","story","Convite da live de domingo",("story-live-convite.mp4",GH("semana-vendas/animados-musica/story-live-convite.mp4"),None),None,None),
 ("12:00","story","\"É seguro comprar casa em leilão?\"",("story-qui-14.mp4",GH("semana-vendas/animados-musica/story-qui-14.mp4"),None),None,None),
 ("17:00","reel","Série da casa · ep. 8: vida nova",("erie-ep8-v2.mp4",DL("19nwVHK311JTjvTrvGemISar1DBxmLnnz"),VW("19nwVHK311JTjvTrvGemISar1DBxmLnnz")),cap("Depois da limpeza, começa a parte boa 🔨\nA casa está vazia e pronta pra reforma.\nO objetivo é um só: trazer vida nova pra ela, pra outra família ser feliz aqui.\n\nO que você mudaria primeiro nessa casa? 👇"),None)]),
("sex","Sexta","06/11",[
 ("06:00","story","Prévia da Casa 3 (hoje às 19h no feed)",("previa-casa-3.mp4",GH("semana-vendas/aprovados/previa-casa-3.mp4"),None),None,None),
 ("10:00","reel","VENDEMOS! 35 dias no mercado",("casa-5-vendemos-v4.mp4",GH("semana-vendas/aprovados/casa-5-vendemos-v4.mp4"),None),cap("VENDEMOS! 🎉 Compramos, reformamos e vendemos: 100% do processo concluído, 35 dias no mercado. Compra US$ 48.000 · Reforma US$ 38.000 · Venda US$ 135.000 (valores reais deste caso).\n\nQual parte você achou mais difícil: comprar, reformar ou vender? 👇"),None),
 ("10:00","story","Convite da live de domingo",("story-live-convite.mp4",GH("semana-vendas/animados-musica/story-live-convite.mp4"),None),None,None),
 ("12:00","story","Como é a conversa grátis de 20 min",("story-sex-14.mp4",GH("semana-vendas/animados-musica/story-sex-14.mp4"),None),None,None),
 ("17:00","reel","Casa 3: essa a gente NÃO compraria",("casa-3-nova-york-v4.mp4",DL("1X4oqKzn_tgNH7_ufs0aZLExOji_GW4UD"),VW("1X4oqKzn_tgNH7_ufs0aZLExOji_GW4UD")),cap("Essa a gente NÃO compraria, e você precisa saber por quê 👇\n\nVocê teria comprado? 👇"),None)]),
("sab","Sábado","07/11",[
 ("06:00","story","Bucks County, PA · leilão de 8/12",("story-sab-08.mp4",GH("semana-vendas/animados-musica/story-sab-08.mp4"),None),None,None),
 ("08:00","reel","Casa 4: você compraria por US$ 8.000?",("casa-4-nova-york-v5.mp4",DL("1BhTkNhiE7T87KrdetjsJX6yzmEqQjfkN"),VW("1BhTkNhiE7T87KrdetjsJX6yzmEqQjfkN")),cap("Lance de US$ 8.000 num casarão em Nova York 😳 Valor de mercado estimado na região: ~US$ 180.000. Mas precisa de muita reforma, e no leilão de Tax Deed tem de tudo: do lixo ao luxo.\n\nVocê compraria? Responde aí: SIM ou NÃO 👇"),None),
 ("10:00","story","Convite da live de domingo",("story-live-convite.mp4",GH("semana-vendas/animados-musica/story-live-convite.mp4"),None),None,None),
 ("12:00","story","Caixinha: qual é a sua maior dúvida?",("story-sab-14.mp4",GH("semana-vendas/animados-musica/story-sab-14.mp4"),None),None,None),
 ("17:00","reel","Elkland: do leilão à casa pronta",("elkland-reel-v4.mp4",GH("semana-vendas/aprovados/elkland-reel-v4.mp4"),None),cap("Essa casa foi a leilão… olha como ela ficou depois da reforma 🏡✨\n\nVocê imaginava esse resultado? 👇"),None)]),
("dom","Domingo","08/11",[
 ("06:00","story","Últimos dias: 2 vagas este mês",("story-dom-08.mp4",GH("semana-vendas/animados-musica/story-dom-08.mp4"),None),None,None),
 ("10:00","story","É hoje: live às 18h (seu horário)",("story-live-hoje.mp4",GH("semana-vendas/animados-musica/story-live-hoje.mp4"),None),None,None),
 ("12:00","story","Hoje: como funciona a assessoria",("story-dom-14.mp4",GH("semana-vendas/animados-musica/story-dom-14.mp4"),None),None,None),
 ("17:00","reel","Como funciona a nossa assessoria",("reel-como-funciona.mp4",GH("semana-vendas/animados/reel-como-funciona.mp4"),None),cap("Como funciona a nossa assessoria, em 5 passos: da conversa grátis até a chave na mão, sem você precisar morar nos EUA 🇧🇷🇺🇸 Últimas vagas deste mês.\n\nQual é a sua maior dúvida? Pergunta aqui 👇"),None),
 ("17:00","story","É hoje: live daqui a 1 hora",("story-live-hoje.mp4",GH("semana-vendas/animados-musica/story-live-hoje.mp4"),None),None,None),
 ("18:00","live","LIVE de dúvidas (você entra ao vivo)",None,None,"Não se agenda: abra o Instagram e toque em + → Live. Roteiro: live-domingo-08-11.md no repositório.")]),
]
data=[{"id":d,"name":n,"date":dt,"items":[{"t":t,"k":k,"title":ti,"file":f,"cap":c,"note":no} for (t,k,ti,f,c,no) in items]} for d,n,dt,items in D]
tpl=open('tpl.html').read().replace('/*DATA*/',json.dumps(data,ensure_ascii=False))
open('pacote-meta.html','w').write(tpl)
print(sum(len(x['items']) for x in data))
