// The typing demo (a word typed in the wrong layout, then fixed) and the time-saved estimate. Without motion
// (prefers-reduced-motion) the demo shows the pairs at once.
(() => {
  const pairs = [
    ['ghbdtn', 'привет', { en: 'Russian typed on the English layout', ru: 'русское слово на английской раскладке' }],
    ['руддщ', 'hello', { en: 'English typed on the Russian layout', ru: 'английское слово на русской раскладке' }],
    ['пше згыр', 'git push', { en: 'a command in a terminal', ru: 'команда в терминале' }],
    ['отчёт для IT', 'отчёт для IT', { en: 'abbreviations typed on purpose stay', ru: 'сокращения, набранные намеренно, остаются' }],
  ];
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = ms => new Promise(r => setTimeout(r, ms));

  for (const demo of document.querySelectorAll('.demo')) {
    const lang = demo.dataset.lang === 'ru' ? 'ru' : 'en';
    const text = demo.querySelector('.demo-text');
    const note = demo.querySelector('.demo-note');

    if (still) {
      text.textContent = pairs.map(([a, b]) => a === b ? a : `${a} → ${b}`).join('\n');
      demo.querySelector('.demo-field').classList.add('still');
    } else {
      (async () => {
        for (let i = 0; ; i = (i + 1) % pairs.length) {
          const [typed, fixed, says] = pairs[i];
          text.classList.remove('fixed');
          note.textContent = says[lang];
          text.textContent = '';
          for (const c of typed) { text.textContent += c; await wait(110); }
          await wait(500);
          if (typed !== fixed) {
            for (let n = typed.length; n > 0; n--) { text.textContent = typed.slice(0, n - 1); await wait(30); }
            for (const c of fixed) { text.textContent += c; await wait(35); }
            text.classList.add('fixed');
          }
          await wait(1800);
        }
      })();
    }

    // Time saved: an estimate from the visitor's own numbers, not a measurement.
    const times = demo.querySelector('.saved-times'), secs = demo.querySelector('.saved-secs');
    const out = demo.querySelector('.saved-result');
    const show = () => {
      const perYear = Math.max(0, +times.value || 0) * Math.max(0, +secs.value || 0) * 250 / 3600;
      const h = perYear < 10 ? perYear.toFixed(1).replace('.', lang === 'ru' ? ',' : '.') : Math.round(perYear);
      out.textContent = lang === 'ru'
        ? `≈ ${h} ч в год (250 рабочих дней), которые OsmoSwitcher вернёт вам.`
        : `≈ ${h} hours a year (250 working days) that OsmoSwitcher gives back.`;
    };
    times.addEventListener('input', show);
    secs.addEventListener('input', show);
    show();
  }
})();

// The download bar: shown while neither the buttons up top nor the download section below are on screen.
(() => {
  const marks = document.querySelectorAll('.cta, .download');
  if (!('IntersectionObserver' in window) || !marks.length) return;
  const visible = new Set();
  let started = false;
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target);
    started = true;
    const show = started && visible.size === 0 && window.scrollY > 200;
    for (const dock of document.querySelectorAll('.dock')) {
      dock.classList.toggle('shown', show);
      dock.setAttribute('aria-hidden', String(!show));
      for (const link of dock.querySelectorAll('a')) link.tabIndex = show ? 0 : -1;
    }
  });
  marks.forEach(mark => observer.observe(mark));
})();
