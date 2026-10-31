/* Reusable components: icon sprite, header, idea card, CTA band, footer, prompt popup. */
(function () {
  'use strict';
  window.PV = window.PV || {};
  var ICONS = {
    search:'<circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/>',
    send:'<path d="M21 3 10 14M21 3l-6.5 18a.55.55 0 0 1-1 0L10 14l-7-3.5a.55.55 0 0 1 0-1L21 3z"/>',
    arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
    trend:'<path d="M3 17l6-6 4 4 8-8M14 7h7v7"/>',
    edit:'<path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3zM13.5 6.5l3 3"/>',
    user:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>',
    cube:'<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM12 12l8-4.5M12 12v9M12 12L4 7.5"/>',
    speaker:'<path d="M3 10v4h4l5 4V6L7 10H3zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',
    image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="1.5"/><path d="M21 15l-5-5L5 21"/>',
    cap:'<path d="M2 9l10-5 10 5-10 5L2 9zM6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5M22 9v6"/>',
    globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    crown:'<path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5L3 8z"/>',
    mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    bolt:'<path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>',
    shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM12 9v6M9 12h6"/>',
    coin:'<circle cx="12" cy="12" r="9"/><path d="M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5-1.5 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1 2-2.5 2c-1 0-2-.5-2.5-1.5M12 6v2M12 16v2"/>',
    dash:'<rect x="4" y="4" width="6" height="6" rx=".6"/><rect x="14" y="4" width="6" height="6" rx=".6"/><rect x="4" y="14" width="6" height="6" rx=".6"/><rect x="14" y="14" width="6" height="6" rx=".6"/>',
    bulb:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
    menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
    close:'<path d="M6 6l12 12M18 6L6 18"/>',
    copy:'<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>',
    check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    inbox:'<path d="M3 13l3-8h12l3 8v6H3v-6zM3 13h5l1 3h6l1-3h5"/>'
  };
  document.body.insertAdjacentHTML('afterbegin',
    '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">' +
    Object.keys(ICONS).map(function (k) { return '<symbol id="i-' + k + '" viewBox="0 0 24 24">' + ICONS[k] + '</symbol>'; }).join('') + '</svg>');
  var icon = PV.icon = function (n, c) { return '<svg class="icon ' + (c || '') + '" aria-hidden="true" focusable="false"><use href="#i-' + n + '"/></svg>'; };
  PV.esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };

  /* One header on every page: same items, same size, same line. */
  var NAV = [{ t: 'Home', href: 'index.html', page: 'home' }, { t: 'Categories', href: 'categories.html', page: 'categories' }, { t: 'About us', href: 'about.html', page: 'about' }];
  function header() {
    var page = document.body.dataset.page || 'home';
    var cur = page === 'prompts' ? 'categories' : page;
    var items = NAV.map(function (i) { return '<a class="pill" href="' + i.href + '"' + (i.page === cur ? ' aria-current="page"' : '') + '>' + i.t + '</a>'; }).join('');
    return '<div class="wrap bar"><a class="logo" href="index.html" aria-label="PromptVerse home">' + icon('send') + '<span>PromptVerse</span></a>' +
      '<button class="menu-btn" type="button" id="menu-btn" aria-expanded="false" aria-controls="nav" aria-label="Open menu">' + icon('menu') + '</button>' +
      '<nav class="nav" id="nav" aria-label="Main">' + items + '</nav></div>';
  }
  function idea() {
    return icon('bulb', 'icon-lg') + '<h3>Need an Idea ?</h3><p>Use the search bar or browse through Categories to find the perfect prompts for your needs</p>' +
      '<a href="categories.html" aria-label="Browse categories">' + icon('arrow') + '</a>';
  }
  function cta() {
    var tools = [['chatgpt', 'ChatGpt', 'https://chatgpt.com/'], ['gemini', 'Gemini', 'https://gemini.google.com/'], ['canva', 'Canva', 'https://www.canva.com/'], ['midjourney', 'MidJourney', 'https://www.midjourney.com/']].map(function (t) {
      return '<li><a href="' + t[2] + '" target="_blank" rel="noopener noreferrer" aria-label="Open ' + t[1] + ' (opens in a new tab)"><img src="assets/images/tools/' + t[0] + '.svg" width="50" height="50" alt="" loading="lazy"><span>' + t[1] + '</span></a></li>';
    }).join('');
    return '<div class="wrap"><div class="cta-inner"><div class="cta-main">' + icon('send') +
      '<div><h2>Ready to Create ?</h2><p>Pick a prompt , copy it and use it in your favorite AI tool.</p></div></div>' +
      '<ul class="tools" aria-label="Open your AI tool">' + tools + '</ul></div></div>';
  }
  function footer() {
    return '<div class="rule"></div><div class="wrap"><div class="footer-row"><div class="brand"><b>Prompt Verse</b><span>Your AI Prompt Library</span></div>' +
      '<div class="mid">Explore.Code Create</div><div class="by">Manya Shah</div></div></div>';
  }
  var mounts = {
    header: function (el) { el.classList.add('site-header'); el.innerHTML = header(); },
    idea: function (el) { el.classList.add('idea'); el.innerHTML = idea(); },
    cta: function (el) { el.classList.add('cta'); el.innerHTML = cta(); },
    footer: function (el) { el.classList.add('site-footer'); el.innerHTML = footer(); }
  };
  document.querySelectorAll('[data-component]').forEach(function (el) { var m = mounts[el.dataset.component]; if (m) m(el); });

  document.body.insertAdjacentHTML('beforeend',
    '<dialog class="pdlg" id="prompt-dialog" aria-labelledby="pd-title"><div class="pdlg-img"><img id="pd-img" alt="" width="380" height="475"></div>' +
    '<div class="pdlg-body"><div class="pdlg-top"><h2 id="pd-title"></h2>' +
    '<button class="copy-btn" type="button" id="pd-copy" aria-label="Copy full prompt">' + icon('copy') + '<span>Copy</span></button>' +
    '<button class="pdlg-close" type="button" id="pd-close" aria-label="Close">' + icon('close') + '</button></div>' +
    '<div class="pdlg-text" id="pd-text" tabindex="0"></div></div></dialog>');
})();
