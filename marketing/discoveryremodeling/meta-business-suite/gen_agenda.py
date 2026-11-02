# Gera ../agenda-publicacao-semana-vendas.md a partir do pacote (gen.py): horário de Brasília, doc do painel, URL e legenda.
import re, json
src = open('gen.py').read()
ns = {}
exec(src.split('tpl=open')[0], ns)
D = ns['D']
PANEL = {  # (dia, hora CT, tipo, índice de ocorrência) -> doc do painel
}
def brt(t):  # CT -> Brasília (+2h)
    h, m = map(int, t.split(':')); return f"{h+2:02d}:{m:02d}"
def doc(day, t, k, title):
    h = int(t.split(':')[0]) + 2
    if 'live' in title.lower() or 'É hoje' in title: return f'v-{day}-live{h}'
    slot = {8: 's8', 14: 's14', 12: 'f12', 19: 'f19', 10: 'f10'}.get(h, f'x{h}')
    if k == 'story' and h == 12: slot = 'live12'
    return f'v-{day}-{slot}'
out = ["# Agenda de PUBLICAÇÃO da semana de vendas (02 a 08/11) – horário de BRASÍLIA",
       "", "Gerada de meta-business-suite/gen.py (mesmos arquivos e legendas do pacote). A rotina publica pelo Windsor (conta 17841475103023266) SÓ os itens cujo documento no painel (coleção \"status\") está \"pronto\" ou \"agendado\". Itens de live (doc v-*-live*) estão aprovados pelo Alessandro.",
       "Story: create_story (video_url ou image_url). Reel: create_video_post (video_url, caption, share_to_feed true). Foto: create_image_post (image_url, caption). Carrossel: create_carousel_post.",
       "Depois de publicar, marque o doc do painel como \"publicado\". Se create_video_post der timeout, NÃO repita: confira com get_data.", ""]
for day, name, date, items in D:
    out.append(f"## {name} {date}")
    for t, k, title, f, capt, note in items:
        if k == 'live': out.append(f"- **{brt(t)}** · LIVE (o Alessandro entra ao vivo; não publicar)"); continue
        url = (f[1] if f else None) or '(sem arquivo: não publicar)'
        if k == 'carrossel': url = 'image_urls, nesta ordem: ' + ' , '.join(ns['CARROSSEL_ELK'])
        out.append(f"- **{brt(t)}** · {k} · {title} · doc `{doc(day, t, k, title)}`")
        out.append(f"  - url: {url}")
        if capt: out.append("  - legenda:\n\n```\n" + capt + "\n```")
    out.append("")
open('../agenda-publicacao-semana-vendas.md', 'w').write('\n'.join(out))
print('ok')
