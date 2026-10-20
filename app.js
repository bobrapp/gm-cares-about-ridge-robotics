(function () {
  'use strict';

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Active section highlighting ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.site-nav a[href^="#"]'));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id); });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Reveal on scroll (opacity only) ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Count-up for the feature stat ---------- */
  var counters = document.querySelectorAll('[data-count]');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function animate(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (reduced) { el.textContent = String(target); return; }
    var start = null, dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { animate(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = c.getAttribute('data-count'); });
  }

  /* ---------- Clipboard helper with fallback ---------- */
  function copyText(text, statusEl, okMsg) {
    function done(ok) {
      statusEl.textContent = ok ? okMsg : 'Copy blocked here. Select the text and copy it manually.';
      setTimeout(function () { statusEl.textContent = ''; }, 4000);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
    } else {
      try {
        var ta = document.createElement('textarea');
        ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        var ok = document.execCommand('copy');
        document.body.removeChild(ta); done(ok);
      } catch (e) { done(false); }
    }
  }

  /* ---------- Share link ---------- */
  var shareBtn = document.getElementById('share-btn');
  var shareStatus = document.getElementById('share-status');
  if (shareBtn) {
    shareBtn.addEventListener('click', function () {
      var url = window.location.href.split('#')[0];
      if (navigator.share) {
        navigator.share({ title: document.title, url: url }).catch(function () { copyText(url, shareStatus, 'Link copied.'); });
      } else {
        copyText(url, shareStatus, 'Link copied. Paste it anywhere.');
      }
    });
  }

  /* ---------- Pledge builder ---------- */
  var form = document.getElementById('pledge-form');
  var out = document.getElementById('pledge-out');
  var copyBtn = document.getElementById('copy-pledge');
  var pStatus = document.getElementById('pledge-status');
  if (form && out) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var helps = Array.prototype.map.call(form.querySelectorAll('input[name="help"]:checked'), function (i) { return i.value; });
      var name = (form.elements.name.value || '').trim();
      var contact = (form.elements.contact.value || '').trim();
      var note = (form.elements.note.value || '').trim();
      if (!helps.length) {
        pStatus.textContent = 'Pick at least one way to help.';
        return;
      }
      var list = helps.length === 1 ? helps[0] : helps.slice(0, -1).join(', ') + ' and ' + helps[helps.length - 1];
      var msg = 'Hi Coach Keegan and Coach Kessel,\n\n' +
        'I saw the GM Cares celebration page for Ridge Robotics and I\'d like to help this season. ' +
        'I can ' + list + '.\n\n' +
        (note ? note + '\n\n' : '') +
        'Reach me at ' + (contact || '[your phone or email]') + '.\n\n' +
        'Go Tigers,\n' + (name || '[your name]');
      out.textContent = msg;
      out.classList.add('is-visible');
      copyBtn.hidden = false;
      pStatus.textContent = 'Pledge ready. Copy it and send it to the school office at (509) 754-2882 or hand it to a coach.';
    });
    copyBtn.addEventListener('click', function () { copyText(out.textContent, pStatus, 'Pledge copied.'); });
  }

  /* ---------- Print the baker's sheet ---------- */
  var printBtn = document.getElementById('print-cake');
  if (printBtn) printBtn.addEventListener('click', function () { window.print(); });
})();
