// One language at a time: elements marked data-only="en" or "ru" show only in theirs. The language comes from
// ?lang=, then a link into the Russian half (#ru, #rub, #…-ru), then the choice made here before, then the
// browser's first language. Loaded in <head>, so the page never shows both. Without scripts it's English.
(() => {
  const root = document.documentElement;
  let saved = null;
  try { saved = localStorage.getItem('lang'); } catch {}
  const asked = new URLSearchParams(location.search).get('lang');
  const hash = location.hash.slice(1);
  const browser = String((navigator.languages && navigator.languages[0]) || navigator.language || '').slice(0, 2).toLowerCase();
  const first = asked === 'ru' || asked === 'en' ? asked
    : hash === 'ru' || hash === 'rub' || hash.endsWith('-ru') ? 'ru'
    : saved === 'ru' || saved === 'en' ? saved
    : ['ru', 'uk', 'be', 'kk'].includes(browser) ? 'ru' : 'en';

  const title = document.querySelector('title');
  const titles = { en: title && title.textContent, ru: title && (title.dataset.ru || title.textContent) };

  function apply(lang) {
    root.classList.toggle('l-ru', lang === 'ru');
    root.classList.toggle('l-en', lang !== 'ru');
    root.lang = lang;
    if (title) title.textContent = titles[lang];
    for (const button of document.querySelectorAll('[data-set-lang]'))
      button.setAttribute('aria-pressed', String(button.dataset.setLang === lang));
  }

  apply(first);
  document.addEventListener('DOMContentLoaded', () => {
    apply(root.lang);
    for (const button of document.querySelectorAll('[data-set-lang]')) {
      button.addEventListener('click', () => {
        const lang = button.dataset.setLang;
        if (lang === root.lang) return;
        apply(lang);
        try { localStorage.setItem('lang', lang); } catch {}
        history.replaceState(null, '', location.pathname);
        window.scrollTo(0, 0);
      });
    }
  });
})();
