// Animação das artes (injetado na página pelo gravar.js).
// Dá movimento a qualquer arte do gerar-artes-v2.py, sem mudar o layout:
// blocos de cor deslizam, títulos entram palavra por palavra, fotos com zoom lento,
// textos sobem com fade e o botão entra e fica pulsando.
window.animar = function () {
  const ease = 'cubic-bezier(.16,1,.3,1)';
  const s = document.querySelector('.s');
  let t = 150; // ms
  const step = (ms) => (t += ms);
  for (const el of [...s.children]) {
    const st = el.style, isImg = el.tagName === 'IMG';
    const logo = isImg && el.src.includes('/marca/');
    if (logo) {
      el.animate([{ opacity: 0, transform: 'scale(.85)' }, { opacity: 1, transform: 'none' }],
        { duration: 600, delay: t, easing: ease, fill: 'both' });
      continue;
    }
    if (isImg) {
      // envolve a foto numa moldura para o zoom não vazar
      const box = document.createElement('div');
      box.className = 'a';
      box.style.cssText = `left:${st.left};top:${st.top};width:${st.width};height:${st.height};border-radius:${st.borderRadius};overflow:hidden`;
      el.replaceWith(box); box.appendChild(el);
      el.style.cssText = `width:100%;height:100%;object-fit:cover;object-position:${st.objectPosition}`;
      const full = parseInt(st.height) > 1300;
      box.animate([{ clipPath: full ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0 round 28px)' }, { clipPath: 'inset(0 0 0 0 round 28px)' }],
        { duration: 900, delay: full ? 0 : t, easing: ease, fill: 'both' });
      el.animate([{ transform: 'scale(1.18)' }, { transform: 'scale(1.0)' }], { duration: 7000, delay: 0, easing: 'linear', fill: 'both' });
      step(full ? 0 : 250);
      continue;
    }
    const cls = el.className || '';
    if (cls.includes(' d') || cls === 'a d' || el.querySelector?.('.d')) {
      // títulos: palavra por palavra
      const alvos = cls.includes('d') ? [el] : [...el.children];
      for (const alvo of alvos) {
        if (alvo.classList.contains('d')) {
          const walk = (node) => {
            for (const n of [...node.childNodes]) {
              if (n.nodeType === 3) {
                const frag = document.createDocumentFragment();
                n.textContent.split(/(\s+)/).forEach((w) => {
                  if (!w.trim()) { frag.appendChild(document.createTextNode(w)); return; }
                  const o = document.createElement('span'); o.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.06em;margin-bottom:-.06em';
                  const i = document.createElement('span'); i.style.display = 'inline-block'; i.textContent = w;
                  o.appendChild(i); frag.appendChild(o);
                  i.animate([{ transform: 'translateY(105%)' }, { transform: 'none' }], { duration: 650, delay: step(70), easing: ease, fill: 'both' });
                });
                n.replaceWith(frag);
              } else if (n.nodeName !== 'BR') walk(n);
            }
          };
          walk(alvo); step(120);
        } else {
          alvo.animate([{ opacity: 0, transform: 'translateY(40px)' }, { opacity: 1, transform: 'none' }], { duration: 700, delay: step(200), easing: ease, fill: 'both' });
        }
      }
      continue;
    }
    if (cls.includes('pill')) {
      el.animate([{ opacity: 0, transform: 'translateY(80px) scale(.9)' }, { opacity: 1, transform: 'none' }], { duration: 700, delay: step(250), easing: ease, fill: 'both' });
      el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.045)' }, { transform: 'scale(1)' }], { duration: 1100, delay: t + 900, iterations: Infinity, easing: 'ease-in-out' });
      continue;
    }
    if (cls.includes('tag')) {
      el.animate([{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: 600, delay: step(120), easing: ease, fill: 'both' });
      continue;
    }
    if (cls.includes('w')) {
      el.animate([{ opacity: 0, transform: 'translateY(30px)' }, { opacity: 1, transform: 'none' }], { duration: 700, delay: step(150), easing: ease, fill: 'both' });
      continue;
    }
    // blocos de cor e cartões
    const big = parseInt(st.width) >= 1000;
    if (big) {
      el.animate([{ transform: 'scaleY(0)' }, { transform: 'none' }], { duration: 700, delay: 0, easing: ease, fill: 'both' });
      el.style.transformOrigin = 'top';
    } else {
      el.animate([{ opacity: 0, transform: 'translateX(-60px)' }, { opacity: 1, transform: 'none' }], { duration: 600, delay: step(90), easing: ease, fill: 'both' });
    }
  }
  // detalhe da marca: anel dourado girando devagar no canto (atrás do conteúdo)
  const fundo = getComputedStyle(s).backgroundColor;
  const anel = document.createElement('div');
  anel.className = 'a';
  anel.style.cssText = `right:-260px;bottom:-260px;width:620px;height:620px;border-radius:50%;border:34px solid #F2C14E;opacity:${fundo.includes('242, 193, 78') ? '.0' : '.22'};z-index:0;border-right-color:transparent`;
  s.insertBefore(anel, s.firstChild);
  anel.animate([{ transform: 'rotate(-40deg) scale(.6)', opacity: 0 }, { transform: 'rotate(0deg) scale(1)' }], { duration: 1200, delay: 200, easing: ease, fill: 'both' });
  anel.animate([{ rotate: '0deg' }, { rotate: '90deg' }], { duration: 7000, delay: 1400, easing: 'linear', fill: 'both' });
  for (const c of [...s.children]) if (c !== anel && !c.style.zIndex) c.style.zIndex = 1;
  // sublinhado dourado que cresce embaixo dos títulos em bloco
  s.querySelectorAll('.a > .d').forEach((d) => {
    const bar = document.createElement('div');
    bar.style.cssText = 'height:12px;width:180px;background:#F2C14E;margin-top:28px;transform-origin:left';
    if (getComputedStyle(s).backgroundColor.includes('242, 193, 78')) bar.style.background = '#17361A';
    d.after(bar);
    bar.animate([{ transform: 'scaleX(0)' }, { transform: 'none' }], { duration: 700, delay: t - 300, easing: ease, fill: 'both' });
  });
  return t;
};
