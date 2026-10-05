/* Ralph Garcia — Portfolio interactions */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } }
  };

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  const themeBtn = $('#themeToggle');
  function applyTheme(t) {
    root.dataset.theme = t;
    themeBtn.innerHTML = t === 'dark' ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
    $('meta[name="theme-color"]').setAttribute('content', t === 'dark' ? '#0b0f1a' : '#f6f8fc');
  }
  applyTheme(store.get('theme') || 'dark');
  function toggleTheme() {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    store.set('theme', next);
    if (document.startViewTransition && !reduceMotion) document.startViewTransition(() => applyTheme(next));
    else applyTheme(next);
  }
  themeBtn.addEventListener('click', toggleTheme);

  /* ---------- Loader ---------- */
  document.body.classList.add('loading');
  // Don't wait for every image/CDN asset: reveal once the hero photo is in (or after 2.5s at most)
  let started = false;
  function begin() {
    if (started) return; started = true;
    $('#loader').classList.add('done');
    document.body.classList.remove('loading');
    document.body.classList.add('ready');
    startTyping();
    startTerminal();
  }
  const heroImg = $('.portrait-img');
  const minDelay = new Promise(r => setTimeout(r, reduceMotion ? 0 : 800));
  const imgReady = heroImg.complete ? Promise.resolve() : new Promise(r => { heroImg.addEventListener('load', r); heroImg.addEventListener('error', r); });
  Promise.all([minDelay, imgReady]).then(begin);
  setTimeout(begin, 2500);

  /* ---------- Typed roles ---------- */
  const roles = ['Data Scientist', 'Full-Stack Developer', 'Data QA Analyst', 'Systems Builder', 'ML Researcher'];
  function startTyping() {
    const el = $('#typed');
    if (reduceMotion) { el.textContent = roles[0]; return; }
    let r = 0, i = 0, deleting = false;
    (function tick() {
      const word = roles[r];
      i += deleting ? -1 : 1;
      el.textContent = word.slice(0, i);
      let delay = deleting ? 45 : 85;
      if (!deleting && i === word.length) { deleting = true; delay = 1800; }
      else if (deleting && i === 0) { deleting = false; r = (r + 1) % roles.length; delay = 350; }
      setTimeout(tick, delay);
    })();
  }

  /* ---------- Terminal ---------- */
  const termLines = [
    ['c', '# ralph.py'],
    ['', '<k>class</k> <v>Ralph</v>:'],
    ['', '  role   = <s>"Data Scientist & Developer"</s>'],
    ['', '  degree = <s>"BS Data Science, Cum Laude"</s>'],
    ['', '  stack  = [<s>"Python"</s>, <s>"SQL"</s>, <s>"Next.js"</s>]'],
    ['', '  builds = [<s>"Knowledge Hub"</s>, <s>"KPI System"</s>,'],
    ['', '            <s>"FMA School SIS"</s>]'],
    ['', ''],
    ['', '  <k>def</k> <v>status</v>(self):'],
    ['', '    <k>return</k> <s>"open to opportunities ✓"</s>']
  ];
  function startTerminal() {
    const code = $('#terminalCode');
    const html = termLines.map(([cls, l]) => {
      const t = l.replace(/<(\w)>/g, '<span class="$1">').replace(/<\/\w>/g, '</span>');
      return cls ? `<span class="${cls}">${t}</span>` : t;
    });
    if (reduceMotion) { code.innerHTML = html.join('\n'); return; }
    // Type character by character while preserving markup
    const full = html.join('\n');
    let pos = 0;
    (function type() {
      if (pos >= full.length) return;
      if (full[pos] === '<') pos = full.indexOf('>', pos) + 1;
      else pos++;
      code.innerHTML = full.slice(0, pos);
      setTimeout(type, full[pos - 1] === '\n' ? 120 : 18);
    })();
  }

  /* ---------- Marquee: duplicate for a seamless loop ---------- */
  const track = $('.marquee-track');
  track.innerHTML += track.innerHTML;

  /* ---------- Network background ---------- */
  const canvas = $('#networkCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [], mouse = { x: -9999, y: -9999 };
  function sizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.width = innerWidth * dpr; H = canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + 'px'; canvas.style.height = innerHeight + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.scale(dpr, dpr);
    const count = Math.min(90, Math.floor(innerWidth * innerHeight / 16000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * innerWidth, y: Math.random() * innerHeight,
      vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 1.6 + .6
    }));
  }
  function accentRGB() { return getComputedStyle(root).getPropertyValue('--accent-rgb').trim() || '34,211,238'; }
  let rgb = accentRGB();
  new MutationObserver(() => { rgb = accentRGB(); }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  function drawNetwork() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    const LINK = 130;
    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > innerWidth) n.vx *= -1;
      if (n.y < 0 || n.y > innerHeight) n.vy *= -1;
      const dx = n.x - mouse.x, dy = n.y - mouse.y, d = Math.hypot(dx, dy);
      if (d < 140) { n.x += dx / d * 1.2; n.y += dy / d * 1.2; }
    }
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK) {
          ctx.strokeStyle = `rgba(${rgb},${(1 - d / LINK) * .35})`;
          ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
      if (md < 200) {
        ctx.strokeStyle = `rgba(${rgb},${(1 - md / 200) * .5})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
      ctx.fillStyle = `rgba(${rgb},.8)`;
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
    }
    requestAnimationFrame(drawNetwork);
  }
  sizeCanvas();
  if (!reduceMotion) drawNetwork(); else canvas.style.display = 'none';
  let resizeT;
  addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(sizeCanvas, 150); });

  /* ---------- Cursor glow ---------- */
  const glow = $('#cursorGlow');
  let gx = 0, gy = 0, tx = 0, ty = 0;
  addEventListener('pointermove', e => {
    mouse.x = e.clientX; mouse.y = e.clientY; tx = e.clientX; ty = e.clientY;
    if (finePointer) glow.style.opacity = 1;
  });
  document.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; glow.style.opacity = 0; });
  (function follow() {
    gx += (tx - gx) * .12; gy += (ty - gy) * .12;
    glow.style.transform = `translate(${gx - 260}px, ${gy - 260}px)`;
    requestAnimationFrame(follow);
  })();

  /* ---------- Scroll: progress, nav, timeline ---------- */
  const nav = $('#nav'), progress = $('#scrollProgress'), fill = $('#timelineFill'), timeline = $('.timeline');
  let lastY = scrollY;
  function onScroll() {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    nav.classList.toggle('scrolled', y > 20);
    nav.classList.toggle('hidden', y > lastY && y > 400 && !$('#navLinks').classList.contains('open'));
    lastY = y;
    const r = timeline.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * .6 - r.top) / r.height));
    fill.style.transform = `scaleY(${p})`;
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Active nav link + indicator ---------- */
  const links = $$('.nav-links a'), indicator = $('#navIndicator');
  function moveIndicator(a) {
    if (!a) { indicator.style.opacity = 0; return; }
    indicator.style.opacity = 1;
    indicator.style.left = a.offsetLeft + 12 + 'px';
    indicator.style.width = a.offsetWidth - 24 + 'px';
  }
  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const a = links.find(l => l.getAttribute('href') === '#' + en.target.id);
      links.forEach(l => l.classList.toggle('active', l === a));
      moveIndicator(a);
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => sectionObs.observe(s));

  /* ---------- Mobile menu ---------- */
  const menuBtn = $('#menuBtn'), navLinks = $('#navLinks');
  menuBtn.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuBtn.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });
  links.forEach(l => l.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }));

  /* ---------- Reveal on scroll (staggered) ---------- */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add('in');
      revealObs.unobserve(el);
      // hand transform control back to hover/tilt once the entrance finishes
      setTimeout(() => el.classList.add('settled'), 1100 + parseFloat(getComputedStyle(el).getPropertyValue('--d') || 0) * 1000);
    });
  }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  // stagger siblings inside the same parent
  const groups = new Map();
  $$('.reveal').forEach(el => {
    const list = groups.get(el.parentElement) || [];
    list.push(el); groups.set(el.parentElement, list);
  });
  groups.forEach(list => list.forEach((el, i) => el.style.setProperty('--d', `${Math.min(i, 6) * 0.08}s`)));
  $$('.reveal').forEach(el => revealObs.observe(el));

  /* ---------- Count-up stats ---------- */
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target, to = +el.dataset.to, start = performance.now(), dur = 1400;
      (function step(now) {
        const t = Math.min(1, (now - start) / dur), e = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(to * e);
        if (t < 1) requestAnimationFrame(step);
      })(start);
      countObs.unobserve(el);
    });
  }, { threshold: .6 });
  $$('.count').forEach(el => countObs.observe(el));

  /* ---------- 3D tilt + spotlight ---------- */
  if (finePointer && !reduceMotion) {
    $$('.tilt').forEach(el => {
      const max = 7;
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--mx', `${px * 100}%`);
        el.style.setProperty('--my', `${py * 100}%`);
        el.style.transform = `perspective(900px) rotateX(${(.5 - py) * max}deg) rotateY(${(px - .5) * max}deg) translateY(-4px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });

    /* hero parallax: layers drift by their data-depth */
    const layers = $$('#heroVisual [data-depth]');
    let px = 0, py = 0, cx = 0, cy = 0;
    addEventListener('pointermove', e => { px = e.clientX / innerWidth - .5; py = e.clientY / innerHeight - .5; });
    (function para() {
      cx += (px - cx) * .06; cy += (py - cy) * .06;
      if (scrollY < innerHeight) layers.forEach(l => {
        const d = +l.dataset.depth;
        l.style.translate = `${cx * d * -18}px ${cy * d * -18}px`;
      });
      requestAnimationFrame(para);
    })();

    /* magnetic buttons */
    $$('.magnetic').forEach(btn => {
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .35}px)`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
    });
  }

  /* ---------- Filters ---------- */
  function setupFilter(barSel, itemSel) {
    const bar = $(barSel);
    bar.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      $$('button', bar).forEach(x => x.classList.toggle('active', x === b));
      const f = b.dataset.filter;
      $$(itemSel).forEach(item => {
        const show = f === 'all' || item.dataset.cat.split(' ').includes(f);
        item.classList.toggle('hide', !show);
        if (show) { item.classList.add('in'); item.classList.remove('pop'); void item.offsetWidth; item.classList.add('pop'); }
      });
    });
  }
  setupFilter('#projectFilters', '#projectsGrid .p-card');
  setupFilter('#researchFilters', '#researchList .r-item');

  /* ---------- Toast + copy email ---------- */
  const toast = $('#toast'); let toastT;
  function showToast(msg) {
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove('show'), 2200);
  }
  const EMAIL = 'rlawrencegarcia03@gmail.com';
  async function copyEmail() {
    try { await navigator.clipboard.writeText(EMAIL); showToast('📋 Email copied to clipboard'); }
    catch { location.href = 'mailto:' + EMAIL; }
  }
  $('#copyEmail').addEventListener('click', copyEmail);

  /* ---------- Data-rain effect ---------- */
  const fx = $('#fxCanvas'), fctx = fx.getContext('2d');
  let fxRunning = false;
  function dataRain() {
    if (fxRunning || reduceMotion) return;
    fxRunning = true; fx.style.display = 'block';
    fx.width = innerWidth; fx.height = innerHeight;
    const size = 16, cols = Math.ceil(innerWidth / size), drops = Array(cols).fill(0).map(() => Math.random() * -50);
    const chars = '01SELECTFROMWHEREpythonμσΣ∂λ{}[]<>=+'.split('');
    const end = performance.now() + 4200;
    (function frame(now) {
      fctx.fillStyle = 'rgba(11,15,26,0.12)'; fctx.fillRect(0, 0, fx.width, fx.height);
      fctx.font = `${size}px JetBrains Mono, monospace`;
      drops.forEach((y, i) => {
        fctx.fillStyle = Math.random() > .96 ? '#ffffff' : `rgb(${rgb})`;
        fctx.fillText(chars[Math.random() * chars.length | 0], i * size, y * size);
        drops[i] = y * size > fx.height && Math.random() > .97 ? 0 : y + 1;
      });
      if (now < end) requestAnimationFrame(frame);
      else { fx.style.transition = 'opacity .8s'; fx.style.opacity = 0; setTimeout(() => { fx.style.display = 'none'; fx.style.opacity = 1; fxRunning = false; }, 800); }
    })(performance.now());
  }

  /* ---------- Command palette ---------- */
  const palette = $('#palette'), pInput = $('#paletteInput'), pList = $('#paletteList');
  const go = id => () => $(id).scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  const commands = [
    { g: 'Navigate', icon: 'fa-house', label: 'Home', run: go('#home') },
    { g: 'Navigate', icon: 'fa-user', label: 'About', run: go('#about') },
    { g: 'Navigate', icon: 'fa-briefcase', label: 'Experience', run: go('#experience') },
    { g: 'Navigate', icon: 'fa-code', label: 'Skills', run: go('#skills') },
    { g: 'Navigate', icon: 'fa-layer-group', label: 'Projects', run: go('#projects') },
    { g: 'Navigate', icon: 'fa-flask', label: 'Research', run: go('#research') },
    { g: 'Navigate', icon: 'fa-trophy', label: 'Honors & Certifications', run: go('#honors') },
    { g: 'Navigate', icon: 'fa-paper-plane', label: 'Contact', run: go('#contact') },
    { g: 'Actions', icon: 'fa-circle-half-stroke', label: 'Toggle light / dark theme', hint: 'theme', run: toggleTheme },
    { g: 'Actions', icon: 'fa-copy', label: 'Copy email address', hint: 'email', run: copyEmail },
    { g: 'Actions', icon: 'fa-file-arrow-down', label: 'Download CV', hint: 'pdf', run: () => { const a = document.createElement('a'); a.href = 'RESUME.pdf'; a.download = 'RalphGarcia_CV.pdf'; a.click(); } },
    { g: 'Actions', icon: 'fa-wand-magic-sparkles', label: 'Make it rain data', hint: 'fx', run: dataRain },
    { g: 'Links', icon: 'fa-linkedin-in', brand: true, label: 'Open LinkedIn', run: () => open('https://www.linkedin.com/in/ralph-garcia-b57814401', '_blank') },
    { g: 'Links', icon: 'fa-github', brand: true, label: 'Open GitHub', run: () => open('https://github.com/garciaralphlawrence-svg', '_blank') }
  ];
  let filtered = commands, sel = 0;
  function renderPalette() {
    const q = pInput.value.trim().toLowerCase();
    filtered = commands.filter(c => (c.label + ' ' + (c.hint || '') + ' ' + c.g).toLowerCase().includes(q));
    sel = Math.min(sel, Math.max(0, filtered.length - 1));
    if (!filtered.length) { pList.innerHTML = '<li class="palette-empty">No results. Try "theme" or "projects".</li>'; return; }
    let html = '', group = '';
    filtered.forEach((c, i) => {
      if (c.g !== group) { group = c.g; html += `<li class="palette-group">${group}</li>`; }
      html += `<li class="palette-item${i === sel ? ' sel' : ''}" data-i="${i}"><i class="${c.brand ? 'fa-brands' : 'fa-solid'} ${c.icon}"></i>${c.label}${c.hint ? `<small>${c.hint}</small>` : ''}</li>`;
    });
    pList.innerHTML = html;
    const s = $('.palette-item.sel', pList); if (s) s.scrollIntoView({ block: 'nearest' });
  }
  function openPalette() {
    palette.classList.add('open'); palette.setAttribute('aria-hidden', 'false');
    pInput.value = ''; sel = 0; renderPalette(); setTimeout(() => pInput.focus(), 50);
  }
  function closePalette() { palette.classList.remove('open'); palette.setAttribute('aria-hidden', 'true'); }
  function runSel(i) { const c = filtered[i]; if (!c) return; closePalette(); setTimeout(c.run, 150); }
  $('#openPalette').addEventListener('click', openPalette);
  palette.addEventListener('click', e => {
    if (e.target === palette) return closePalette();
    const it = e.target.closest('.palette-item'); if (it) runSel(+it.dataset.i);
  });
  pList.addEventListener('pointermove', e => {
    const it = e.target.closest('.palette-item');
    if (it && +it.dataset.i !== sel) { sel = +it.dataset.i; $$('.palette-item', pList).forEach(x => x.classList.toggle('sel', +x.dataset.i === sel)); }
  });
  pInput.addEventListener('input', () => { sel = 0; renderPalette(); });
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); palette.classList.contains('open') ? closePalette() : openPalette(); return; }
    if (!palette.classList.contains('open')) return;
    if (e.key === 'Escape') closePalette();
    else if (e.key === 'ArrowDown') { e.preventDefault(); sel = (sel + 1) % filtered.length; renderPalette(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = (sel - 1 + filtered.length) % filtered.length; renderPalette(); }
    else if (e.key === 'Enter') { e.preventDefault(); runSel(sel); }
  });
})();
