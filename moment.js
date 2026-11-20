// Graduation "moment": a viewfinder-style video that plays only while visible.
(() => {
  document.querySelectorAll('.moment').forEach(m => {
    const v = m.querySelector('.moment-vid'), bar = m.querySelector('.moment-bar span'),
      tc = m.querySelector('.moment-time'), snd = m.querySelector('.moment-sound'),
      stage = m.querySelector('.moment-stage');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    v.muted = true;
    new IntersectionObserver(([e]) => {
      m.classList.toggle('live', e.isIntersecting);
      if (e.isIntersecting && !reduce) v.play().catch(() => {}); else v.pause();
    }, { threshold: 0.35 }).observe(m);
    if (reduce) m.classList.add('paused');
    v.addEventListener('timeupdate', () => {
      const t = v.currentTime || 0;
      bar.style.width = (t / (v.duration || 1) * 100) + '%';
      const f = Math.floor((t % 1) * 30);
      tc.textContent = '00:0' + Math.floor(t) + ':' + String(f).padStart(2, '0');
    });
    snd.addEventListener('click', () => {
      v.muted = !v.muted;
      if (!v.muted) { v.currentTime = 0; v.play().catch(() => {}); }
      snd.setAttribute('aria-pressed', String(!v.muted));
      snd.setAttribute('aria-label', v.muted ? 'Turn sound on' : 'Turn sound off');
      m.classList.toggle('sound', !v.muted);
    });
    stage.addEventListener('click', e => {
      if (e.target.closest('.moment-sound')) return;
      if (v.paused) { v.play().catch(() => {}); m.classList.remove('paused'); } else { v.pause(); m.classList.add('paused'); }
    });
    if (!reduce && matchMedia('(pointer:fine)').matches) {
      stage.addEventListener('pointermove', e => {
        const r = stage.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        stage.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
        stage.style.setProperty('--gx', (x + .5) * 100 + '%'); stage.style.setProperty('--gy', (y + .5) * 100 + '%');
      });
      stage.addEventListener('pointerleave', () => stage.style.transform = '');
    }
  });
})();
