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

  /* ---------- Share link (one or more buttons) ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[id^="share-btn"]'), function (shareBtn) {
    var shareStatus = document.getElementById(shareBtn.id.replace('share-btn', 'share-status'));
    shareBtn.addEventListener('click', function () {
      var url = 'https://gm-cares-about-ridge-robotics.pplx.app';
      if (navigator.share) {
        navigator.share({ title: document.title, url: url }).catch(function () { copyText(url, shareStatus, 'Link copied.'); });
      } else {
        copyText(url, shareStatus, 'Link copied. Paste it anywhere.');
      }
    });
  });

  /* ---------- Pledge builder ---------- */
  var form = document.getElementById('pledge-form');
  var out = document.getElementById('pledge-out');
  var copyBtn = document.getElementById('copy-pledge');
  var pStatus = document.getElementById('pledge-status');
  var dlBtn = document.getElementById('download-pledge');
  var emailBtn = document.getElementById('email-pledge');
  var SCHOOL_EMAIL = ['ridgeinfo', 'ephrataschools.org'].join('@'); // Columbia Ridge office
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
      var msg = 'Hi Coach Keegan,\n\n' +
        'I saw the GM Cares celebration page for Ridge Robotics and I\'d like to help this season. ' +
        'I can ' + list + '.\n\n' +
        (note ? note + '\n\n' : '') +
        'Reach me at ' + (contact || '[your phone or email]') + '.\n\n' +
        'Go Tigers,\n' + (name || '[your name]');
      out.textContent = msg;
      out.classList.add('is-visible');
      copyBtn.hidden = false; dlBtn.hidden = false; emailBtn.hidden = false;
      emailBtn.href = 'mailto:' + SCHOOL_EMAIL + '?subject=' + encodeURIComponent('Ridge Robotics: I\'d like to help') + '&body=' + encodeURIComponent(msg);
      pStatus.textContent = 'Pledge ready. Copy it and send it to the school office at (509) 754-2882 or hand it to a coach.';
    });
    copyBtn.addEventListener('click', function () { copyText(out.textContent, pStatus, 'Pledge copied.'); });
    dlBtn.addEventListener('click', function () {
      var blob = new Blob([out.textContent], { type: 'text/plain;charset=utf-8' });
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'Ridge-Robotics-pledge.txt';
      document.body.appendChild(a); a.click(); document.body.removeChild(a); setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
      pStatus.textContent = 'Pledge downloaded.';
    });
  }

  /* ---------- Print the baker's sheet ---------- */
  var printBtn = document.getElementById('print-cake');
  if (printBtn) printBtn.addEventListener('click', function () { window.print(); });
  var printQr = document.getElementById('print-qr');
  if (printQr) printQr.addEventListener('click', function () { window.print(); });

  /* ---------- v1.1: HIBT ledger + in-browser verification ---------- */
  var ledgerEl = document.getElementById('ledger');
  var changelogEl = document.getElementById('changelog');
  var hashList = document.getElementById('hash-list');
  var verifyBtn = document.getElementById('verify-btn');
  var verifyStatus = document.getElementById('verify-status');
  var verBadge = document.getElementById('ver-badge');
  var HIBT = null;

  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }

  function renderHibt(data) {
    HIBT = data;
    if (verBadge) verBadge.textContent = 'v' + data.version + ' · ' + data.built_from_commit;
    if (changelogEl) {
      changelogEl.innerHTML = '';
      data.changelog.slice().reverse().forEach(function (c) {
        var li = el('li');
        var b = el('strong', null, 'v' + c.version + ' · ' + c.date + ' · ');
        li.appendChild(b); li.appendChild(document.createTextNode(c.summary));
        changelogEl.appendChild(li);
      });
    }
    if (ledgerEl) {
      ledgerEl.innerHTML = '';
      data.entries.forEach(function (e) {
        var li = el('li');
        var meta = el('div', 'meta');
        meta.appendChild(el('span', null, '#' + e.seq + ' · v' + e.version));
        meta.appendChild(el('span', null, e.timestamp));
        meta.appendChild(el('span', null, e.person));
        meta.appendChild(el('span', null, e.model));
        li.appendChild(meta);
        li.appendChild(el('p', 'result', e.result));
        var det = document.createElement('details');
        var sum = el('summary', null, 'Show full prompt');
        det.appendChild(sum); det.appendChild(el('p', 'prompt', e.prompt));
        li.appendChild(det);
        li.appendChild(el('div', 'chain', 'chain ' + e.chain));
        ledgerEl.appendChild(li);
      });
    }
    if (hashList) {
      hashList.innerHTML = '';
      data.files.forEach(function (f) {
        var li = el('li'); li.setAttribute('data-path', f.path);
        var w = el('div', 'hash-item'); w.appendChild(el('strong', null, f.path)); w.appendChild(el('span', null, f.sha256)); li.appendChild(w);
        hashList.appendChild(li);
      });
    }
  }

  function hex(buf) { return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join(''); }
  function canonical(o) {
    if (Array.isArray(o)) return '[' + o.map(canonical).join(',') + ']';
    if (o && typeof o === 'object') return '{' + Object.keys(o).sort().map(function (k) { return JSON.stringify(k) + ':' + canonical(o[k]); }).join(',') + '}';
    return JSON.stringify(o);
  }
  async function sha256Text(t) { return hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t))); }

  async function verify() {
    if (!HIBT || !window.crypto || !crypto.subtle) { verifyStatus.textContent = 'Verification needs a secure (https) page.'; return; }
    verifyStatus.textContent = 'Hashing files…';
    var ok = 0, bad = 0;
    for (var i = 0; i < HIBT.files.length; i++) {
      var f = HIBT.files[i];
      var li = hashList.querySelector('[data-path="' + f.path + '"]');
      try {
        var r = await fetch('./' + f.path, { cache: 'no-store' });
        var buf = await r.arrayBuffer();
        var h = hex(await crypto.subtle.digest('SHA-256', buf));
        if (h === f.sha256) { ok++; li.classList.add('ok'); li.classList.remove('bad'); }
        else { bad++; li.classList.add('bad'); li.classList.remove('ok'); }
      } catch (e) { bad++; if (li) li.classList.add('bad'); }
    }
    // chain check
    var prev = '0'.repeat(64), chainOk = true;
    for (var j = 0; j < HIBT.entries.length; j++) {
      var e = Object.assign({}, HIBT.entries[j]); var recorded = e.chain; delete e.chain;
      var c = await sha256Text(prev + canonical(e));
      if (c !== recorded) { chainOk = false; break; }
      prev = c;
    }
    if (chainOk && prev !== HIBT.head) chainOk = false;
    verifyStatus.textContent = (bad === 0 ? 'All ' + ok + ' files match the ledger. ' : bad + ' file(s) differ from the ledger. ') + (chainOk ? 'Ledger chain intact (head ' + HIBT.head.slice(0, 12) + '…).' : 'Ledger chain does NOT verify.');
  }

  var inlineLedger = document.getElementById('hibt-data');
  var OFFLINE = !!inlineLedger;
  if (ledgerEl) {
    if (OFFLINE) {
      try { renderHibt(JSON.parse(inlineLedger.textContent)); } catch (e) { if (verifyStatus) verifyStatus.textContent = 'Ledger could not be read.'; }
      if (verifyBtn) { verifyBtn.disabled = true; verifyBtn.textContent = 'Verify on the hosted site'; }
      if (verifyStatus) verifyStatus.textContent = 'This is the offline single-file copy; hashes below are the recorded values. Open the hosted site to re-verify them live.';
    } else {
      fetch('./hibt.json', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(renderHibt).catch(function () {
        if (verifyStatus) verifyStatus.textContent = 'Ledger file not found.';
      });
      if (verifyBtn) verifyBtn.addEventListener('click', verify);
    }
  }

  /* ---------- assemble email addresses client-side (keeps CDN email-obfuscation out of the served HTML) ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('.email[data-user][data-domain]'), function (sp) {
    var addr = sp.getAttribute('data-user') + '@' + sp.getAttribute('data-domain');
    var a = document.createElement('a'); a.href = 'mailto:' + addr; a.textContent = addr; sp.textContent = ''; sp.appendChild(a);
  });
})();
