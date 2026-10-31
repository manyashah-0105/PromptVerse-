/* Page behaviour: category/prompt cards, popup, search, forms, Gmail link, mobile menu. */
(function () {
  'use strict';
  var PV = window.PV, CFG = window.PV_CONFIG, CATS = PV.CATEGORIES, PROMPTS = PV.PROMPTS || {}, icon = PV.icon, esc = PV.esc;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var params = new URLSearchParams(location.search);
  function catBySlug(s) { return CATS.filter(function (c) { return c.slug === s; })[0]; }

  /* ---------- mobile menu ---------- */
  var mbtn = $('#menu-btn'), nav = $('#nav');
  function closeMenu() { nav.classList.remove('open'); mbtn.setAttribute('aria-expanded', 'false'); mbtn.setAttribute('aria-label', 'Open menu'); }
  mbtn.addEventListener('click', function () {
    var open = !nav.classList.contains('open');
    nav.classList.toggle('open', open); mbtn.setAttribute('aria-expanded', String(open)); mbtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); mbtn.focus(); } });
  document.addEventListener('click', function (e) { if (nav.classList.contains('open') && !e.target.closest('.bar')) closeMenu(); });

  /* ---------- Home search -> Categories page ---------- */
  var sform = $('#search-form');
  if (sform) sform.addEventListener('submit', function (e) {
    e.preventDefault(); var q = $('#q').value.trim();
    location.href = 'categories.html' + (q ? '?q=' + encodeURIComponent(q) : '');
  });

  /* ---------- Categories page ---------- */
  function categoryCard(c, i) {
    return '<article class="card" style="animation-delay:' + Math.min(i, 8) * 40 + 'ms">' +
      '<div class="card-img"><img src="assets/images/categories/' + c.slug + '.svg" alt="' + esc(c.title) + ' prompt category illustration" width="350" height="210" loading="lazy"></div>' +
      '<div class="card-head"><span class="tile">' + icon(c.icon) + '</span><h3>' + esc(c.title) + '</h3></div><p>' + esc(c.desc) + '</p>' +
      '<div class="card-foot"><a class="btn-view" href="prompts.html?c=' + c.slug + '" aria-label="View prompt: ' + esc(c.title) + '">View prompt ' + icon('arrow') + '</a></div></article>';
  }
  var catGrid = $('#cat-grid');
  if (catGrid) {
    var q = (params.get('q') || '').trim().toLowerCase();
    var list = CATS.filter(function (c) {
      if (!q) return true;
      var hay = c.title + ' ' + c.desc + ' ' + (PROMPTS[c.slug] || []).map(function (p) { return p.title + ' ' + p.text; }).join(' ');
      return hay.toLowerCase().indexOf(q) !== -1;
    });
    catGrid.innerHTML = list.map(categoryCard).join('');
    var em = $('#empty'); if (em) { em.hidden = list.length > 0; }
    var note = $('#q-note'); if (note && q) { note.hidden = false; note.textContent = 'Showing results for “' + params.get('q') + '”'; }
  }

  /* ---------- Prompts page ---------- */
  var pGrid = $('#prompt-grid');
  var current = {};
  function promptCard(c, p, i) {
    return '<article class="card is-prompt" tabindex="0" role="button" data-p="' + i + '" aria-label="Open prompt: ' + esc(p.title) + '" style="animation-delay:' + Math.min(i, 8) * 40 + 'ms">' +
      '<div class="card-img"><img src="' + p.image + '" alt="' + esc(p.title) + ' preview" width="350" height="210" loading="lazy"></div>' +
      '<div class="card-head"><span class="tile">' + icon(c.icon) + '</span><h3>' + esc(p.title) + '</h3></div>' +
      '<div class="copy-row"><button class="copy-btn" type="button" data-copy="' + i + '" aria-label="Copy prompt: ' + esc(p.title) + '">' + icon('copy') + '</button></div>' +
      '<p class="clamp">' + esc(p.text) + '</p></article>';
  }
  if (pGrid) {
    var c = catBySlug(params.get('c')) || CATS[0];
    current.cat = c; current.list = PROMPTS[c.slug] || [];
    document.title = c.title + ' prompts – PromptVerse';
    $('#cat-title').textContent = c.title; $('#cat-desc').textContent = c.desc;
    if (!current.list.length) {
      pGrid.outerHTML = '<div class="no-prompts" role="status">' + icon('inbox') + 'No prompts yet<span>Prompts for ' + esc(c.title) + ' will appear here.</span></div>';
    } else {
      pGrid.innerHTML = current.list.map(function (p, i) { return promptCard(c, p, i); }).join('');
    }
  }

  /* ---------- Copy + popup ---------- */
  function copyText(text, btn) {
    var label = btn.innerHTML;
    var done = function (ok) {
      btn.innerHTML = icon(ok ? 'check' : 'copy') + (btn.querySelector('span') ? '<span>' + (ok ? 'Copied' : 'Press Ctrl+C') + '</span>' : '');
      setTimeout(function () { btn.innerHTML = label; }, 1600);
    };
    if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(text).then(function () { done(true); }, function () { fallback(); }); } else fallback();
    function fallback() {
      var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0;top:0';
      document.body.appendChild(ta); ta.select(); var ok = false; try { ok = document.execCommand('copy'); } catch (e) {} document.body.removeChild(ta); done(ok);
    }
  }
  var dlg = $('#prompt-dialog'), lastTrigger = null, openIdx = -1;
  function openPrompt(i, trigger) {
    var p = current.list[i]; if (!p) return;
    openIdx = i; lastTrigger = trigger;
    $('#pd-title').textContent = p.title; $('#pd-text').textContent = p.text;
    var img = $('#pd-img'); img.src = p.image; img.alt = p.title + ' preview';
    $('#pd-text').scrollTop = 0; dlg.showModal();
  }
  document.addEventListener('click', function (e) {
    var cp = e.target.closest('[data-copy]');
    if (cp) { e.stopPropagation(); copyText(current.list[+cp.dataset.copy].text, cp); return; }
    var card = e.target.closest('.card.is-prompt');
    if (card) { openPrompt(+card.dataset.p, card); return; }
    if (e.target === dlg) dlg.close();
  });
  document.addEventListener('keydown', function (e) {
    var card = e.target.closest && e.target.closest('.card.is-prompt');
    if (card && e.target === card && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openPrompt(+card.dataset.p, card); }
  });
  $('#pd-close').addEventListener('click', function () { dlg.close(); });
  $('#pd-copy').addEventListener('click', function () { if (openIdx > -1) copyText(current.list[openIdx].text, $('#pd-copy')); });
  dlg.addEventListener('close', function () { if (lastTrigger) lastTrigger.focus(); });

  /* ---------- Email: forms -> FormSubmit -> site owner's inbox ---------- */
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function fail(el, err, msg) { el.setAttribute('aria-invalid', 'true'); err.textContent = msg; }
  function pass(el, err) { el.removeAttribute('aria-invalid'); err.textContent = ''; }
  function sendMail(fields, btn, status, okMsg, done) {
    btn.setAttribute('aria-busy', 'true'); btn.disabled = true; status.className = 'status'; status.textContent = 'Sending…';
    fields._captcha = 'false'; fields._template = 'table';
    fetch(CFG.endpoint + CFG.email, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(fields) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok || j.success === 'false' || j.success === false) throw new Error(j.message || 'failed'); }); })
      .then(function () { status.textContent = okMsg; done(); })
      .catch(function () { status.className = 'status bad'; status.textContent = 'Could not send right now. Please check your connection and try again.'; })
      .then(function () { btn.removeAttribute('aria-busy'); btn.disabled = false; });
  }
  var review = $('#review-form');
  if (review) review.addEventListener('submit', function (e) {
    e.preventDefault();
    var em = review.email, msg = review.message, ok = true, st = $('.status', review);
    if (!emailRe.test(em.value.trim())) { fail(em, $('#review-email-err'), 'Enter a valid email address.'); ok = false; } else pass(em, $('#review-email-err'));
    if (msg.value.trim().length < 3) { fail(msg, $('#review-msg-err'), 'Please write a message or feedback.'); ok = false; } else pass(msg, $('#review-msg-err'));
    if (!ok) { (review.querySelector('[aria-invalid="true"]')).focus(); return; }
    if (review._honey && review._honey.value) return;
    sendMail({ _subject: 'PromptVerse – new review / feedback', email: em.value.trim(), message: msg.value.trim() }, $('button[type="submit"]', review), st, 'Message sent. Thank you!', function () { review.reset(); });
  });
  var sug = $('#suggest-form');
  if (sug) sug.addEventListener('submit', function (e) {
    e.preventDefault();
    var inp = sug.idea, err = $('#suggest-err'), st = $('#suggest-status');
    if (inp.value.trim().length < 3) { fail(inp, err, 'Share an idea first.'); inp.focus(); return; }
    pass(inp, err);
    sendMail({ _subject: 'PromptVerse – new prompt idea', message: inp.value.trim() }, $('button', sug), st, 'Idea sent. Thank you!', function () { sug.reset(); });
  });

  /* ---------- Contact email: Gmail on computers, mail app on phones ---------- */
  var mail = $('#contact-mail');
  if (mail) mail.addEventListener('click', function (e) {
    var mobile = /Android|iPhone|iPad|iPod|Mobi/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Mac/i.test(navigator.platform));
    if (mobile) return; /* keep the mailto: link, it opens the Gmail / mail app */
    e.preventDefault();
    var url = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(CFG.email) + '&su=' + encodeURIComponent('Hello PromptVerse');
    var w = window.open(url, '_blank', 'noopener'); if (!w) location.href = url;
  });
})();
