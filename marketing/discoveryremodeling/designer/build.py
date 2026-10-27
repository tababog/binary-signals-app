import json
rows=[("05","NOV","Livingston County","Nova York · presencial"),
("05","NOV","Poughkeepsie","Nova York · online"),
("12","NOV","Essex County","Nova York · presencial + online"),
("17","NOV","Orleans County","Nova York · online (13 a 17/11)"),
("18","NOV","Rochester","Nova York · presencial"),
("24","NOV","Lewis County","Nova York · online"),
("08","DEZ","Bucks County","Pensilvânia · online"),
("10","DEZ","Delaware County","Pensilvânia · upset sale")]
h="";y=370;step=104
for i,(d,m,c,s) in enumerate(rows):
    top=y+i*step
    h+=f'''<div class="abs" style="left:64px;top:{top}px;width:952px;height:90px;background:#fff;border-radius:18px;"></div>
  <div class="abs" style="left:64px;top:{top}px;width:150px;height:90px;background:var(--au);border-radius:18px 0 0 18px;"></div>
  <div class="abs disp" style="left:64px;top:{top+10}px;width:150px;color:var(--g);font-size:60px;text-align:center;">{d}</div>
  <div class="abs ws" style="left:64px;top:{top+60}px;width:150px;color:var(--g);font-weight:700;font-size:20px;letter-spacing:3px;text-align:center;">{m}</div>
  <div class="abs ws" style="left:240px;top:{top+12}px;color:var(--g);font-weight:700;font-size:34px;">{c}</div>
  <div class="abs ws" style="left:240px;top:{top+54}px;color:#5d6b60;font-size:24px;">{s}</div>
  '''
t=open('template.html').read().replace('{{ROWS}}',h)
for k,v in json.load(open('imgs.json')).items(): t=t.replace('{{'+k+'}}',v)
open('discovery-teste.html','w').write(t)
