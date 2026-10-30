/* SECURITY: anti-framing, escaping and input cleaning helpers (do not remove) */
try { if (window.top !== window.self) window.top.location = window.self.location; } catch (e) { document.documentElement.hidden = true; }
const esc = v => String(v ?? '').replace(/[&<>"'`]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'&#96;'}[c]));
const clean = (v, n = 300) => String(v ?? '').replace(/[\u0000-\u001f\u007f<>{}]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);
const okPhone = v => /^\+?[\d\s-]{8,16}$/.test(v);
/* bot guard: honeypot field, too-fast submit, and an 8 second cooldown */
function guard(form, out) {
  const f = new FormData(form); let last = 0; try { last = +sessionStorage.getItem('nk-last') || 0; } catch (e) {}
  if (f.get('website')) return false;
  if (performance.now() < 2500 || Date.now() - last < 8000) { out.textContent = 'Please wait a few seconds and try again.'; return false; }
  try { sessionStorage.setItem('nk-last', Date.now()); } catch (e) {}
  return true;
}
/* Nasim Aapa Kapadwala: shared script for all pages. Edit CONFIG only. */
const CONFIG = {
  whatsapp: '91XXXXXXXXXX',          // country code + number, no + or spaces
  hours: '10:30 am to 9:30 pm',      // placeholder: put your real timings
  google: 'https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID', // REPLACE: your Google review link
  rating: {score: '4.8', count: '200+'},  // REPLACE with your real Google rating and review count
  reviews: [ // REPLACE these samples with real Google reviews (copy name, area, text)
    {n:'Sana', a:'Juhapura', t:'The lehenga was ready a week before my nikah and the fitting was perfect.'},
    {n:'Rukhsar', a:'Dariyapur', t:'Three generations of our family have bought wedding clothes here.'},
    {n:'Aliya', a:'Bhadra', t:'I brought an Instagram photo and they matched the zari work almost exactly.'}],
  products: [ // n=name, f=fabric, c=category, o=occasion, i=image (replace with your photos)
    {n:'Maroon Zari Bridal Lehenga',f:'Banarasi silk',c:'bridal',o:'Nikah',i:'images/p1.jpg'},
    {n:'Emerald Sharara Set',f:'Georgette',c:'party',o:'Mehndi',i:'images/p2.jpg'},
    {n:'Ivory Nikah Gown',f:'Organza',c:'bridal',o:'Nikah',i:'images/p3.jpg'},
    {n:'Block Print Cotton Suit',f:'Cotton',c:'casual',o:'Everyday',i:'images/p4.jpg'},
    {n:'Mehndi Green Lehenga',f:'Velvet',c:'party',o:'Mehndi',i:'images/p5.jpg'},
    {n:'Chikankari Unstitched',f:'Cotton lawn',c:'materials',o:'Everyday',i:'images/p6.jpg'},
    {n:'Gold Tissue Dupatta',f:'Tissue',c:'materials',o:'Walima',i:'images/p7.jpg'},
    {n:'Walima Peach Gown',f:'Crepe',c:'bridal',o:'Walima',i:'images/p8.jpg'},
    {n:'Everyday Kurti Set',f:'Rayon',c:'casual',o:'Everyday',i:'images/p9.jpg'},
    {n:'Sangeet Pink Lehenga',f:'Organza',c:'party',o:'Sangeet',i:'images/p10.jpg'},
    {n:'Embroidered Suit Piece',f:'Georgette',c:'materials',o:'Sangeet',i:'images/p11.jpg'},
    {n:'Pastel Readymade Suit',f:'Chanderi',c:'casual',o:'Everyday',i:'images/p12.jpg'}],
  branches: [
    {n:'Dariyapur',main:1,tel:'+91XXXXXXXXXX',a:'1st Floor, Aamena Residency, A, Sultan Mohalla, nr. Chandan Talavdi, nr. Lokhand Wala Hospital, Old City, Dariyapur, Ahmedabad, Gujarat 380001'},
    {n:'Juhapura',tel:'+91XXXXXXXXXX',a:'1st Floor, Bank of Baroda, Classic Heights, nr. Madina Masjid Road, Royal Nawab Society, Juhapura, Ahmedabad, Gujarat 380055'},
    {n:'Bhadra',tel:'+91XXXXXXXXXX',a:'Ground Floor, Business Centre, Relief Rd, opp. Vishal Complex, Old City, Bhadra, Ahmedabad, Gujarat 380001'}]
};
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const wa = t => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(t)}`;
const fine = matchMedia('(hover:hover) and (pointer:fine)').matches, calm = matchMedia('(prefers-reduced-motion:reduce)').matches;
document.documentElement.classList.add('js');
/* theme: saved choice, otherwise light */
let theme = 'light'; try { theme = localStorage.getItem('nk-theme') || 'light'; } catch (e) {}
document.documentElement.dataset.theme = theme;

/* shared layout */
const pages = [['Home','index.html'],['Collection','collection.html'],['Gallery','gallery.html'],['About','about.html'],['Contact','contact.html']];
const here = location.pathname.split('/').pop() || 'index.html';
const first = !sessionStorage.getItem('nk');
const letters = t => [...t].map((c, i) => `<span style="--i:${i}">${c === ' ' ? '&nbsp;' : esc(c)}</span>`).join('');
document.body.insertAdjacentHTML('afterbegin', `
 ${first ? `<div class="loader" id="loader" aria-hidden="true"><svg viewBox="0 0 200 200" width="140" height="140"><circle cx="100" cy="100" r="92"/><circle cx="100" cy="100" r="82"/><text x="100" y="118" text-anchor="middle">NK</text></svg></div>` : ''}
 <div class="prog" id="prog"></div><div class="curtain" id="curtain"></div><div class="cur" id="cur"></div>
 <a class="skip" href="#main">Skip to content</a>
 <header class="nb" id="header"><span class="nb-bg" aria-hidden="true"></span>
  <a href="index.html" class="nb-brand" aria-label="Nasim Aapa Kapadwala, home">
   <span class="logo"><span class="gems" aria-hidden="true"></span><i class="mono" aria-hidden="true">NK</i><img src="images/logo.png" alt="" width="64" height="64"><span class="shine" aria-hidden="true"></span></span>
   <b class="nm"><span class="nm1" aria-hidden="true">${letters('Nasim Aapa')}</span><small>Kapadwala</small></b>
  </a>
  <nav class="nb-links" id="nav" aria-label="Main"><span class="nb-ind" aria-hidden="true"></span>${pages.map(([t,h]) => `<a href="${h}" ${h === here ? 'class="cur-page" aria-current="page"' : ''}>${t}</a>`).join('')}</nav>
  <div class="nb-end"><a class="wishlink" href="wishlist.html" aria-label="Saved pieces"><svg viewBox="0 0 24 24"><path d="M12 21s-8-5.200-8-11a4.500 4.500 0 0 1 8-2.800A4.500 4.500 0 0 1 20 10c0 5.800-8 11-8 11Z"/></svg><span id="wc" hidden></span></a>
   <button class="theme" id="theme" aria-label="Switch to dark mode"><svg class="moon" viewBox="0 0 24 24"><path d="M20 14.500A8 8 0 0 1 9.500 4 8 8 0 1 0 20 14.500Z"/></svg><svg class="sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.900 4.900l1.400 1.400M17.700 17.700l1.400 1.400M4.900 19.100l1.400-1.400M17.700 6.300l1.400-1.400"/></svg></button>
   <a class="btn btn--gold btn--sm nb-book" href="book.html">Book a Visit</a>
   <button class="burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="menu"><i></i><i></i></button></div>
 </header>
 <div class="menu" id="menu" inert><div class="menu__in">
  <nav class="menu__links" aria-label="Mobile menu">${[...pages, ['Book a Visit', 'book.html'], ['Saved pieces', 'wishlist.html']].map(([t, h], i) => `<a href="${h}" style="--i:${i}" ${h === here ? 'aria-current="page"' : ''}>${t}</a>`).join('')}</nav>
  <div class="menu__foot"><a class="btn btn--gold" href="${wa('Hello Nasim Aapa Kapadwala')}" target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a><p>Dariyapur, Juhapura and Bhadra, Ahmedabad<br>Women's ethnic and bridal wear, since 1980</p></div>
 </div></div>`);
document.body.insertAdjacentHTML('beforeend', `
 <footer class="footer"><div class="wrap fg"><div><p class="script">Nasim Aapa Kapadwala</p><p style="opacity:.7;max-width:34ch">Women's ethnic and bridal wear in Ahmedabad, since 1980.</p></div>
 <div><h4>Explore</h4>${pages.map(([t,h]) => `<a href="${h}">${t}</a>`).join('')}<a href="book.html">Book a Visit</a><a href="wishlist.html">Saved pieces</a></div>
 <div><h4>Branches</h4>${CONFIG.branches.map(b => `<a href="contact.html">${esc(b.n)}${b.main ? ' (Main)' : ''}</a>`).join('')}</div>
 <div><h4>Follow</h4><a href="#" target="_blank" rel="noopener noreferrer">Instagram</a><a href="#" target="_blank" rel="noopener noreferrer">Facebook</a><a href="#" target="_blank" rel="noopener noreferrer">YouTube</a></div></div>
 <p class="copy">© 2026 Nasim Aapa Kapadwala. Since 1980.</p></footer>
 <a class="fab" href="${wa('Hello Nasim Aapa Kapadwala')}" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"><svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.200 14.200c-.2.600-1.300 1.200-1.800 1.200-.5.100-1 .2-3.300-.7-2.800-1.200-4.600-4-4.700-4.200-.1-.2-1.100-1.500-1.100-2.800 0-1.400.7-2 .9-2.300.3-.3.600-.3.800-.3h.6c.2 0 .4 0 .6.500l.8 2c.1.200.1.400 0 .5l-.4.600-.3.300c-.1.200-.3.300-.1.600.2.300.8 1.300 1.700 2.100 1.200 1 2.100 1.300 2.400 1.500.3.100.4.100.6-.1l.8-1c.2-.3.400-.2.700-.1l1.900.9c.3.100.5.200.5.300.1.200.1.800-.1 1.400Z"/></svg></a>
 <button class="top" id="topb" aria-label="Back to top">↑</button>
 <div class="lb" id="lb" hidden role="dialog" aria-modal="true" aria-label="Image viewer"><button class="x" aria-label="Close">×</button><button class="p" aria-label="Previous">‹</button><img id="lbi" alt=""><button class="n" aria-label="Next">›</button><p id="lbc"></p></div>`);

/* start: loader, then ready (triggers headline animation) */
if (first) { sessionStorage.setItem('nk', 1); setTimeout(() => { $('#loader').classList.add('off'); document.body.classList.add('ready'); }, 1600); }
else requestAnimationFrame(() => document.body.classList.add('ready'));

/* page transitions */
const curtain = $('#curtain');
$$('a[href$=".html"]').forEach(a => a.addEventListener('click', e => {
  if (e.metaKey || e.ctrlKey || a.target || calm) return; e.preventDefault();
  curtain.classList.add('on'); setTimeout(() => location.href = a.href, 450);
}));
addEventListener('pageshow', () => curtain.classList.remove('on'));

/* header, progress, back to top, parallax: one rAF scroll loop */
const header = $('#header'), prog = $('#prog'), topb = $('#topb'), pars = $$('[data-par]'); let lastY = 0, tick = false;
function onScroll() {
  const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
  header.classList.toggle('solid', y > 60); header.classList.toggle('hide', y > lastY && y > 500 && !$('#menu').classList.contains('open'));
  $('.bar')?.classList.toggle('low', !(y > lastY && y > 500));
  prog.style.transform = `scaleX(${h > 0 ? y / h : 0})`; topb.classList.toggle('on', y > 800);
  if (!calm) pars.forEach(el => { const r = el.parentElement.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) el.style.transform = `translateY(${(r.top - innerHeight / 2) * -.08}px) scale(1.12)`; });
  lastY = y; tick = false;
}
addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, {passive: true}); onScroll();
topb.onclick = () => scrollTo({top: 0, behavior: 'smooth'});

/* theme toggle */
const tbtn = $('#theme');
const applyTheme = t => { document.documentElement.dataset.theme = t; tbtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'); tbtn.setAttribute('aria-pressed', t === 'dark'); };
applyTheme(theme);
tbtn.onclick = () => { theme = theme === 'dark' ? 'light' : 'dark'; applyTheme(theme); try { localStorage.setItem('nk-theme', theme); } catch (e) {} };

/* navbar: full-screen menu, sliding hover pill, cursor glow, logo fallback */
$('main')?.setAttribute('id', 'main');
const burger = $('#burger'), menu = $('#menu'), links = $('#nav'), ind = $('.nb-ind', links), activeEl = $('a.cur-page', links);
const setNav = o => {
  menu.classList.toggle('open', o); burger.setAttribute('aria-expanded', o); burger.setAttribute('aria-label', o ? 'Close menu' : 'Open menu');
  o ? menu.removeAttribute('inert') : menu.setAttribute('inert', ''); header.classList.toggle('menu-on', o); document.body.style.overflow = o ? 'hidden' : '';
  if (o) $('a', menu).focus({preventScroll: true});
};
burger.onclick = () => setNav(!menu.classList.contains('open'));
$$('a', menu).forEach(a => a.addEventListener('click', () => setNav(false)));
addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) { setNav(false); burger.focus(); } });
const place = el => { if (!el) { ind.style.opacity = 0; return; } ind.style.width = el.offsetWidth + 'px'; ind.style.transform = `translateX(${el.offsetLeft}px)`; ind.style.opacity = 1; };
addEventListener('resize', () => { if (innerWidth > 1080 && menu.classList.contains('open')) setNav(false); place(activeEl); });
$$('a', links).forEach(a => { a.addEventListener('mouseenter', () => place(a)); a.addEventListener('focus', () => place(a)); });
links.addEventListener('mouseleave', () => place(activeEl)); links.addEventListener('focusout', () => place(activeEl));
ind.style.transition = 'none'; place(activeEl); requestAnimationFrame(() => requestAnimationFrame(() => ind.style.transition = ''));
document.fonts && document.fonts.ready.then(() => place(activeEl));
header.addEventListener('pointermove', e => header.style.setProperty('--mx', (e.clientX - header.getBoundingClientRect().left) + 'px'));
const logoImg = $('.logo img'); logoImg.addEventListener('error', () => logoImg.remove());
/* royal logo: tilts toward the cursor with a moving highlight, springs back, presses on tap */
const brand = $('.nb-brand'), lg = $('.logo'), sv = (k, v) => lg.style.setProperty(k, v), cl = v => Math.max(-1, Math.min(1, v));
if (fine && !calm) {
  brand.addEventListener('pointermove', e => { const r = lg.getBoundingClientRect(), dx = (e.clientX - r.left - r.width / 2) / r.width, dy = (e.clientY - r.top - r.height / 2) / r.height;
    sv('--ry', (cl(dx) * 18).toFixed(1) + 'deg'); sv('--rx', (-cl(dy) * 18).toFixed(1) + 'deg'); sv('--lx', (50 + dx * 70).toFixed(0) + '%'); sv('--ly', (50 + dy * 70).toFixed(0) + '%'); });
  brand.addEventListener('pointerenter', () => sv('--sc', 1.08));
  brand.addEventListener('pointerleave', () => { sv('--rx', '0deg'); sv('--ry', '0deg'); sv('--sc', 1); });
}
brand.addEventListener('pointerdown', () => sv('--sc', .92));
['pointerup', 'pointercancel'].forEach(t => brand.addEventListener(t, () => sv('--sc', fine ? 1.08 : 1)));

/* desktop only: cursor ring + magnetic buttons */
if (fine && !calm) {
  const c = $('#cur'); let x = 0, y = 0, tx = 0, ty = 0;
  addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; c.style.opacity = 1; });
  (function f() { x += (tx - x) * .18; y += (ty - y) * .18; c.style.transform = `translate(${x}px,${y}px)`; requestAnimationFrame(f); })();
  document.addEventListener('mouseover', e => c.classList.toggle('big', !!e.target.closest('a,button,.tile,.pcard__img')));
  document.addEventListener('mousemove', e => {
    const b = e.target.closest('.btn'); $$('.btn').forEach(k => { if (k !== b) k.style.translate = ''; });
    if (b) { const r = b.getBoundingClientRect(); b.style.translate = `${(e.clientX - r.left - r.width / 2) * .2}px ${(e.clientY - r.top - r.height / 2) * .3}px`; }
  });
}

/* reveal + counters */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; const el = e.target; io.unobserve(el);
  el.style.transitionDelay = Math.min($$('.rv', el.parentElement).indexOf(el) * 80, 400) + 'ms'; el.classList.add('in');
  const n = $('b[data-n]', el);
  if (n) { const end = +n.dataset.n, s = n.dataset.s || '', t0 = performance.now();
    (function f(t) { const k = Math.min((t - t0) / 1600, 1); n.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))).toLocaleString('en-IN') + (k === 1 ? s : ''); if (k < 1) requestAnimationFrame(f); })(t0); }
}), {threshold: .12});
const watch = () => $$('.rv:not(.in),.clip:not(.in)').forEach(el => io.observe(el));
$$('.title,.sub,.cat,.steps li,.val,.stats>div,.field,.bcard,.btn.rv').forEach(el => el.classList.add('rv')); watch();

/* shared product card, wishlist, tilt */
let wish = []; try { wish = JSON.parse(localStorage.getItem('nkw') || '[]'); } catch (e) {}
wish = Array.isArray(wish) ? wish.filter(n => CONFIG.products.some(p => p.n === n)) : [];
const updWish = () => { const c = $('#wc'); c.textContent = wish.length; c.hidden = !wish.length; }; updWish();
const saveWish = () => { try { localStorage.setItem('nkw', JSON.stringify(wish)); } catch (e) {} };
const card = (p, i, d = 0) => `<article class="pcard in" style="--d:${d}ms" data-i="${i}">
 <button class="heart ${wish.includes(p.n) ? 'on' : ''}" aria-label="Save ${esc(p.n)}" aria-pressed="${wish.includes(p.n)}"><svg viewBox="0 0 24 24"><path d="M12 21s-8-5.200-8-11a4.500 4.500 0 0 1 8-2.800A4.500 4.500 0 0 1 20 10c0 5.800-8 11-8 11Z"/></svg></button>
 <div class="pcard__img" data-view><img src="${esc(p.i)}" alt="${esc(p.n)}" loading="lazy"></div>
 <div class="pcard__b"><h3>${esc(p.n)}</h3><p>${esc(p.f)} · ${esc(p.o)}. Price on request</p><a class="btn btn--gold" target="_blank" rel="noopener noreferrer" href="${wa('Hello, I would like to enquire about: ' + p.n)}">Enquire on WhatsApp</a></div></article>`;
function wire(root) {
  $$('.heart', root).forEach(h => h.onclick = () => { const n = CONFIG.products[h.closest('.pcard').dataset.i].n; wish = wish.includes(n) ? wish.filter(x => x !== n) : [...wish, n]; saveWish(); updWish(); document.dispatchEvent(new Event('wishchange')); h.classList.toggle('on', wish.includes(n)); h.setAttribute('aria-pressed', wish.includes(n)); });
  $$('[data-view]', root).forEach(v => v.onclick = () => openQV(+v.closest('.pcard').dataset.i));
  if (fine && !calm) $$('.pcard', root).forEach(c => { c.onmousemove = e => { const r = c.getBoundingClientRect(); c.style.transform = `perspective(900px) rotateY(${((e.clientX - r.left) / r.width - .5) * 6}deg) rotateX(${(.5 - (e.clientY - r.top) / r.height) * 6}deg)`; }; c.onmouseleave = () => c.style.transform = ''; });
}

/* quick view modal (created on demand) */
function openQV(i) {
  const p = CONFIG.products[i]; let q = $('#qv');
  if (!q) { document.body.insertAdjacentHTML('beforeend', '<div class="qv" id="qv" hidden role="dialog" aria-modal="true"></div>'); q = $('#qv'); q.onclick = e => { if (e.target === q || e.target.closest('.qv__x')) { q.hidden = true; document.body.style.overflow = ''; } }; }
  q.innerHTML = `<div class="qv__box"><button class="qv__x" aria-label="Close">×</button><div class="qv__img"><img src="${esc(p.i)}" alt="${esc(p.n)}"></div><div class="qv__t"><p class="script">${esc(p.o)}</p><h3>${esc(p.n)}</h3><dl><dt>Fabric</dt><dd>${esc(p.f)}</dd><dt>Category</dt><dd style="text-transform:capitalize">${esc(p.c)}</dd><dt>Price</dt><dd>On request</dd><dt>Stitching</dt><dd>Available in your size</dd></dl>
  <a class="btn btn--gold" target="_blank" rel="noopener noreferrer" href="${wa('Hello, I would like to enquire about: ' + p.n)}">Enquire on WhatsApp</a></div></div>`;
  q.hidden = false; document.body.style.overflow = 'hidden'; $('.qv__x', q).focus();
}
addEventListener('keydown', e => { if (e.key === 'Escape') { const q = $('#qv'); if (q && !q.hidden) { q.hidden = true; document.body.style.overflow = ''; } } });

/* lightbox */
const lb = $('#lb'); let ll = [], li = 0, lx = 0;
const lshow = i => { li = (i + ll.length) % ll.length; const p = CONFIG.products[ll[li]]; $('#lbi').src = p.i; $('#lbi').alt = p.n; $('#lbc').textContent = p.n; };
const lclose = () => { lb.hidden = true; document.body.style.overflow = ''; };
function openLB(list, i) { ll = list; lshow(i); lb.hidden = false; document.body.style.overflow = 'hidden'; $('.x', lb).focus(); }
$('.x', lb).onclick = lclose; $('.p', lb).onclick = () => lshow(li - 1); $('.n', lb).onclick = () => lshow(li + 1); lb.onclick = e => { if (e.target === lb) lclose(); };
addEventListener('keydown', e => { if (lb.hidden) return; if (e.key === 'Escape') lclose(); if (e.key === 'ArrowRight') lshow(li + 1); if (e.key === 'ArrowLeft') lshow(li - 1); });
lb.addEventListener('touchstart', e => lx = e.touches[0].clientX, {passive: true});
lb.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - lx; if (Math.abs(d) > 50) lshow(li + (d < 0 ? 1 : -1)); });

/* HOME: campaign hero (auto-advancing progress bars, thumbs, swipe, sparkles) */
const cam = $('#cam');
if (cam) {
  const sl = $$('.cam__slide', cam), bars = $$('.cam__bar', cam), thumbs = $$('.cam__thumb', cam), num = $('#camnum'), DUR = 7000;
  let cur = 0, el = 0, last = performance.now(), hold = calm;
  const go = i => {
    cur = (i + sl.length) % sl.length; el = 0;
    sl.forEach((s, k) => { s.classList.toggle('on', k === cur); s.setAttribute('aria-hidden', k !== cur); });
    thumbs.forEach((t, k) => t.classList.toggle('on', k === cur));
    bars.forEach((b, k) => { b.firstElementChild.style.transform = `scaleX(${k < cur ? 1 : 0})`; b.setAttribute('aria-current', k === cur); });
    num.textContent = String(cur + 1).padStart(2, '0'); num.classList.remove('tick'); void num.offsetWidth; num.classList.add('tick');
  };
  bars.forEach((b, i) => b.onclick = () => go(i)); thumbs.forEach((t, i) => t.onclick = () => go(i));
  (function loop(t) { const dt = Math.min(t - last, 100); last = t;
    if (!hold && !document.hidden) { el += dt; bars[cur].firstElementChild.style.transform = `scaleX(${Math.min(el / DUR, 1)})`; if (el >= DUR) go(cur + 1); }
    requestAnimationFrame(loop); })(last);
  cam.addEventListener('pointerenter', () => hold = true); cam.addEventListener('pointerleave', () => hold = calm);
  addEventListener('keydown', e => { if (scrollY < innerHeight / 2 && lb.hidden && !menu.classList.contains('open')) { if (e.key === 'ArrowRight') go(cur + 1); if (e.key === 'ArrowLeft') go(cur - 1); } });
  let sx = 0; cam.addEventListener('touchstart', e => sx = e.touches[0].clientX, {passive: true});
  cam.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 50) go(cur + (d < 0 ? 1 : -1)); });
  if (!calm) { const sp = $('.cam__sp', cam); for (let i = 0; i < 16; i++) { const s = document.createElement('span'); [['--x', (Math.random() * 100).toFixed(1) + '%'], ['--s', (4 + Math.random() * 8).toFixed(1) + 'px'], ['--d', (7 + Math.random() * 7).toFixed(1) + 's'], ['--dl', (-Math.random() * 12).toFixed(1) + 's'], ['--dx', (Math.random() * 80 - 40).toFixed(0) + 'px']].forEach(([k, v]) => s.style.setProperty(k, v)); sp.append(s); } }
  go(0);
}
const rail = $('#rail');
if (rail) { rail.innerHTML = CONFIG.products.slice(0, 7).map((p, i) => card(p, i, i * 90)).join(''); wire(rail); }
const qs = $$('.quote');
if (qs.length) { let qi = 0; setInterval(() => { qs[qi].classList.remove('on'); qi = (qi + 1) % qs.length; qs[qi].classList.add('on'); }, 6000); }

/* COLLECTION: search, category, occasion, fabric, sort */
const pg = $('#pgrid');
if (pg) {
  const P = CONFIG.products, S = {q: '', c: ['bridal', 'party', 'casual', 'materials'].includes(new URLSearchParams(location.search).get('cat')) ? new URLSearchParams(location.search).get('cat') : 'all', o: '', f: '', s: ''};
  const uniq = k => [...new Set(P.map(p => p[k]))].sort();
  $('#fo').innerHTML = '<option value="">All occasions</option>' + uniq('o').map(v => `<option>${esc(v)}</option>`).join('');
  $('#ff').innerHTML = '<option value="">All fabrics</option>' + uniq('f').map(v => `<option>${esc(v)}</option>`).join('');
  function render() {
    let L = P.map((p, i) => ({p, i})).filter(({p}) => (S.c === 'all' || p.c === S.c) && (!S.o || p.o === S.o) && (!S.f || p.f === S.f) && (p.n + p.f + p.o).toLowerCase().includes(S.q));
    if (S.s === 'az') L.sort((a, b) => a.p.n.localeCompare(b.p.n));
    $('#cnt').textContent = `${L.length} piece${L.length === 1 ? '' : 's'}`;
    pg.innerHTML = L.length ? L.map(({p, i}, k) => card(p, i, k * 60)).join('') : '<div class="empty" style="grid-column:1/-1"><h3>Nothing matches yet</h3><p class="sub" style="margin:8px auto 24px">Clear a filter, or tell us what you want and we will find or stitch it.</p><a class="btn btn--ink" target="_blank" rel="noopener noreferrer" href="' + wa('Hello, I am looking for a specific outfit.') + '">Ask on WhatsApp</a></div>';
    wire(pg); $$('.chip').forEach(c => c.classList.toggle('on', c.dataset.c === S.c));
  }
  $$('.chip').forEach(c => c.onclick = () => { S.c = c.dataset.c; render(); });
  $('#fq').oninput = e => { S.q = e.target.value.toLowerCase().trim(); render(); };
  $('#fo').onchange = e => { S.o = e.target.value; render(); }; $('#ff').onchange = e => { S.f = e.target.value; render(); }; $('#fs').onchange = e => { S.s = e.target.value; render(); };
  render();
}

/* GALLERY */
const mas = $('#mas');
if (mas) {
  mas.innerHTML = CONFIG.products.map((p, i) => `<button class="tile rv" data-n="${esc(p.n)}" data-c="${esc(p.c)}" data-i="${i}" aria-label="View ${esc(p.n)}"><img src="${esc(p.i)}" alt="${esc(p.n)}" loading="lazy"></button>`).join(''); watch();
  mas.onclick = e => { const t = e.target.closest('.tile'); if (t) openLB($$('.tile:not(.off)', mas).map(x => +x.dataset.i), $$('.tile:not(.off)', mas).indexOf(t)); };
  $$('.chip').forEach(c => c.onclick = () => { $$('.chip').forEach(k => k.classList.toggle('on', k === c)); $$('.tile', mas).forEach(t => { t.classList.toggle('off', c.dataset.c !== 'all' && t.dataset.c !== c.dataset.c); }); });
}

/* CONTACT: branches + map, form to WhatsApp */
const bc = $('#bcards');
if (bc) {
  bc.innerHTML = CONFIG.branches.map(b => `<div class="bcard"><h3>${esc(b.n)}${b.main ? '<em>Main Branch</em>' : ''}</h3><p>${esc(b.a)}<br>Open daily, ${esc(CONFIG.hours)}</p><div class="act"><a target="_blank" rel="noopener noreferrer" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Nasim Aapa Kapadwala ' + b.a)}">Directions</a><a href="tel:${esc(b.tel)}">Call</a><a target="_blank" rel="noopener noreferrer" href="${wa('Hello, I plan to visit your ' + b.n + ' branch.')}">WhatsApp</a></div></div>`).join(''); watch();
  const pick = i => { $$('.bcard').forEach((c, k) => c.classList.toggle('on', k === i)); $('#map').src = 'https://maps.google.com/maps?q=' + encodeURIComponent('Nasim Aapa Kapadwala ' + CONFIG.branches[i].a) + '&output=embed'; };
  $$('.bcard').forEach((c, i) => c.onclick = e => { if (!e.target.closest('a')) pick(i); }); pick(0);
  $('#fbr').innerHTML = CONFIG.branches.map(b => `<option>${esc(b.n)}</option>`).join('');
  $('#cform').onsubmit = e => { e.preventDefault(); const st = $('#ok'); st.textContent = ''; if (!guard(e.target, st)) return;
    const f = new FormData(e.target), name = clean(f.get('name'), 60), phone = clean(f.get('phone'), 20);
    if (name.length < 2) { st.textContent = 'Please enter your name.'; return; }
    if (!okPhone(phone)) { st.textContent = 'Please enter a valid phone number.'; return; }
    window.open(wa(`Hello, I am ${name} (${phone}). I would like to visit the ${clean(f.get('branch'), 30)} branch. Occasion: ${clean(f.get('occ'), 20)}. ${clean(f.get('msg'), 400)}`), '_blank', 'noopener');
    st.textContent = 'Thank you. WhatsApp has opened with your message, just press send.'; };
}

/* REVIEWS (home) */
const rv = $('#revs');
if (rv) {
  $('#rate').innerHTML = `<b>${esc(CONFIG.rating.score)}</b><div><div class="stars" aria-label="${esc(CONFIG.rating.score)} out of 5">★★★★★</div><p>${esc(CONFIG.rating.count)} Google reviews</p></div><a class="btn btn--line" target="_blank" rel="noopener noreferrer" href="${esc(CONFIG.google)}">Write a review</a>`;
  rv.innerHTML = CONFIG.reviews.map(r => `<figure class="rev rv"><div class="stars" aria-hidden="true">★★★★★</div><p>${esc(r.t)}</p><cite>${esc(r.n)}, ${esc(r.a)}</cite></figure>`).join(''); watch();
}

/* WISHLIST page */
const wl = $('#wl');
if (wl) {
  const draw = () => {
    const L = CONFIG.products.map((p, i) => ({p, i})).filter(({p}) => wish.includes(p.n));
    $('#wcnt').textContent = `${L.length} saved piece${L.length === 1 ? '' : 's'}`;
    $('#wact').hidden = !L.length;
    wl.innerHTML = L.length ? L.map(({p, i}, k) => card(p, i, k * 60)).join('') : '<div class="empty" style="grid-column:1/-1"><h3>Nothing saved yet</h3><p class="sub" style="margin:8px auto 24px">Tap the heart on any piece in the collection and it will wait for you here.</p><a class="btn btn--ink" href="collection.html">Browse the collection</a></div>';
    wire(wl);
    $('#wsend').href = wa('Hello, I would like to enquire about these pieces:\n' + L.map(({p}, k) => `${k + 1}. ${p.n} (${p.f})`).join('\n'));
  };
  document.addEventListener('wishchange', () => setTimeout(draw, 350));
  $('#wclear').onclick = () => { wish = []; saveWish(); updWish(); draw(); };
  draw();
}

/* BOOKING page */
const bf = $('#bform');
if (bf) {
  const d = $('#bdate'), t = new Date(); t.setMinutes(t.getMinutes() - t.getTimezoneOffset()); d.min = t.toISOString().slice(0, 10);
  $('#bbr').innerHTML = CONFIG.branches.map(b => `<option>${esc(b.n)}${b.main ? ' (Main)' : ''}</option>`).join('');
  $('#binfo').innerHTML = CONFIG.branches.map(b => `<div class="bcard" style="cursor:default"><h3>${esc(b.n)}${b.main ? '<em>Main Branch</em>' : ''}</h3><p style="margin-bottom:0">${esc(b.a)}<br>Open daily, ${esc(CONFIG.hours)}</p></div>`).join('');
  bf.onsubmit = e => { e.preventDefault(); const st = $('#bok'); st.textContent = ''; if (!guard(bf, st)) return;
    const f = new FormData(bf), name = clean(f.get('name'), 60), phone = clean(f.get('phone'), 20), dv = String(f.get('date')), mx = new Date(); mx.setFullYear(mx.getFullYear() + 1);
    if (name.length < 2) { st.textContent = 'Please enter your name.'; return; }
    if (!okPhone(phone)) { st.textContent = 'Please enter a valid phone number.'; return; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dv) || dv < d.min || dv > mx.toISOString().slice(0, 10)) { st.textContent = 'Please choose a date within the next year.'; return; }
    const saved = wish.length ? `\nPieces I saved: ${wish.join(', ')}.` : '', dt = new Date(dv + 'T00:00').toLocaleDateString('en-IN', {weekday: 'long', day: 'numeric', month: 'long'});
    window.open(wa(`Hello, I am ${name} (${phone}). I would like to book a visit.\nBranch: ${clean(f.get('branch'), 30)}\nFor: ${clean(f.get('purpose'), 60)}\nDate: ${dt}, ${clean(f.get('time'), 12)}\nPeople coming: ${clean(f.get('guests'), 12)}${saved}\n${clean(f.get('notes'), 400)}`), '_blank', 'noopener');
    st.textContent = 'WhatsApp has opened with your booking request. Press send and we will confirm the slot.'; };
}
