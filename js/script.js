/* Builds the page from CONFIG (js/config.js). Plain JS, no libraries. */
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));
const C = CONFIG, P = C.photos;

['nm0', 'nm', 'nm2', 'big'].forEach((i) => ($(i).textContent = C.name));
$('tag').textContent = C.tagline; $('bio').textContent = C.bio; $('em').textContent = C.email;
$('yr').textContent = new Date().getFullYear(); document.title = C.name + ' | Model Portfolio';
$('hero').src = $('ab').src = C.hero;

$('gal').innerHTML = P.map((p, i) => `<img loading="lazy" data-i="${i}" src="${esc(p)}" alt="Photo ${i + 1}">`).join('');
$('cg').innerHTML = C.categories.map((c, i) => `<div class="cat rv"><img loading="lazy" src="${esc(P[i % P.length])}" alt=""><span>${esc(c)}</span></div>`).join('');
$('st').innerHTML = C.stats.map((s) => `<div class="stat"><b data-v="${s[1]}" data-x="${esc(s[2])}">0</b><small>${esc(s[0])}</small></div>`).join('');
$('so').innerHTML = Object.entries(C.socials).filter((e) => e[1]).map((e) => `<a href="${esc(e[1])}" target="_blank" rel="noreferrer">${e[0]}</a>`).join('');

// Scroll-in animations + number count-up
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return; e.target.classList.add('on'); io.unobserve(e.target);
  e.target.querySelectorAll('[data-v]').forEach((b) => { const t = +b.dataset.v, t0 = performance.now();
    (function f(n) { const k = Math.min(1, (n - t0) / 1600); b.textContent = Math.round(t * k) + b.dataset.x; k < 1 && requestAnimationFrame(f); })(t0); });
}), { threshold: 0.15 });
document.querySelectorAll('.rv,#st').forEach((e) => io.observe(e));

// Lightbox (click photo; click left/right half or use arrow keys to browse)
const lb = $('lb'); let li = 0;
const show = (i) => { li = (i + P.length) % P.length; $('lbi').src = P[li]; lb.classList.add('on'); };
$('gal').onclick = (e) => e.target.dataset.i && show(+e.target.dataset.i);
lb.onclick = (e) => e.target === $('lbi') ? show(li + (e.clientX > innerWidth / 2 ? 1 : -1)) : lb.classList.remove('on');
addEventListener('keydown', (e) => { if (!lb.classList.contains('on')) return;
  if (e.key === 'Escape') lb.classList.remove('on'); if (e.key === 'ArrowRight') show(li + 1); if (e.key === 'ArrowLeft') show(li - 1); });

// Tilt on work cards (mouse only)
$('cg').onmousemove = (e) => { const c = e.target.closest('.cat'); if (!c) return; const r = c.getBoundingClientRect();
  c.style.transform = `perspective(800px) rotateY(${((e.clientX - r.left) / r.width - .5) * 14}deg) rotateX(${-((e.clientY - r.top) / r.height - .5) * 14}deg)`; };
$('cg').onmouseout = (e) => { const c = e.target.closest('.cat'); if (c) c.style.transform = ''; };