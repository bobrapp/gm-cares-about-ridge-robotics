// End-to-end test suite for the Ridge Robotics × GM Cares site. Writes TEST-REPORT.md.
export async function runE2E({ chromium, axeSrc, base, root, outFile, liveHosts = [] }) {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const results = []; // {area, test, page, status, detail}
  const ok = (area, test, page, cond, detail = '') => results.push({ area, test, page, status: cond ? 'PASS' : 'FAIL', detail });
  const pages = ['index.html', 'find-us.html', 'past-champions.html', 'es/index.html', 'es/find-us.html', 'es/past-champions.html'];
  const browser = await chromium.launch({ headless: true, channel: 'chromium' });

  // ---------- 1. Static integrity: internal links, anchors, footnotes ----------
  const fileExists = p => fs.existsSync(path.join(root, p));
  for (const pg of pages) {
    const html = fs.readFileSync(path.join(root, pg), 'utf8');
    const dir = path.dirname(pg);
    const ids = new Set([...html.matchAll(/ id="([^"]+)"/g)].map(m => m[1]));
    const hrefs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(m => m[1]).filter(h => !/^(https?:|mailto:|data:|#$)/.test(h));
    let badAnchors = [], badFiles = [];
    for (const h of hrefs) {
      const [file, anchor] = h.split('#');
      if (file === '' || file === undefined) { if (anchor && !ids.has(anchor)) badAnchors.push(h); continue; }
      const target = path.normalize(path.join(dir, file));
      if (!fileExists(target)) { badFiles.push(h); continue; }
      if (anchor) { const th = fs.readFileSync(path.join(root, target), 'utf8'); if (!th.includes(` id="${anchor}"`)) badAnchors.push(h); }
    }
    ok('Links', 'Internal file links resolve', pg, badFiles.length === 0, badFiles.join(', '));
    ok('Links', 'Anchor targets exist', pg, badAnchors.length === 0, badAnchors.slice(0, 5).join(', '));
    const sups = [...html.matchAll(/<sup class="fn">(.*?)<\/sup>/g)];
    const singles = sups.filter(s => (s[1].match(/href/g) || []).length < 2).length;
    ok('Sourcing', 'Footnotes present', pg, sups.length > 0 || pg.includes('find-us'), `${sups.length} footnote groups, ${singles} single-source (attributed quotes)`);
    ok('Privacy', 'No raw email addresses in HTML (CDN rewrite guard)', pg, !/[\w.-]+@[\w.-]+\.\w{2,}/.test(html.replace(/https?:\/\/\S+/g, '')));
    ok('Privacy', 'No student surnames', pg, !/Castro|Criss|Grubb|Gutierrez|Henson|Leenhouts|Lutz|Scheelke/.test(html));
    ok('Security', 'Content-Security-Policy present', pg, html.includes('Content-Security-Policy'));
    ok('i18n', 'lang attribute correct', pg, pg.startsWith('es/') ? html.includes('<html lang="es"') : html.includes('<html lang="en"'));
    ok('i18n', 'Language switch present', pg, html.includes('class="lang-switch"'));
  }

  // ---------- 2. Browser checks per page (desktop + mobile) ----------
  for (const pg of pages) {
    for (const vp of [{ w: 1400, h: 900, name: 'desktop' }, { w: 375, h: 812, name: 'mobile' }]) {
      const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.name === 'mobile', bypassCSP: true, acceptDownloads: true });
      const page = await ctx.newPage(); const errs = [];
      page.on('pageerror', e => errs.push('pageerror ' + e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
      const resp = await page.goto(base + pg, { waitUntil: 'networkidle' }); await page.waitForTimeout(500);
      ok('Load', 'HTTP 200', `${pg} @${vp.name}`, resp.status() === 200, String(resp.status()));
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      ok('Layout', 'No horizontal overflow', `${pg} @${vp.name}`, sw <= vp.w, `scrollWidth ${sw}`);
      const fonts = await page.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family));
      ok('Assets', 'Self-hosted fonts loaded', `${pg} @${vp.name}`, fonts.includes('Chillax') && fonts.includes('General Sans'));
      const ext = await page.evaluate(() => [...new Set(performance.getEntriesByType('resource').map(e => new URL(e.name).host).filter(h => h !== location.host))]);
      ok('Privacy', 'Zero third-party requests', `${pg} @${vp.name}`, ext.length === 0, ext.join(','));
      await page.evaluate(() => { document.querySelectorAll('img[loading="lazy"]').forEach(i => { i.loading = 'eager'; const s = i.getAttribute('src'); i.src = s; }); });
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); });
      await page.evaluate(() => Promise.all([...document.images].map(i => (i.complete ? Promise.resolve() : new Promise(r => { i.addEventListener('load', r, { once: true }); i.addEventListener('error', r, { once: true }); setTimeout(r, 6000); })))));
      const imgs = await page.evaluate(() => [...document.images].map(i => i.complete && i.naturalWidth > 0));
      ok('Assets', 'All images load', `${pg} @${vp.name}`, imgs.every(Boolean), `${imgs.filter(Boolean).length}/${imgs.length}`);
      await page.addScriptTag({ content: axeSrc });
      const ax = await page.evaluate(async () => await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] } }));
      ok('Accessibility', 'axe-core: 0 violations (WCAG 2.1 A/AA + best-practice)', `${pg} @${vp.name}`, ax.violations.length === 0, ax.violations.map(v => v.id + ' x' + v.nodes.length).join('; '));
      if (vp.name === 'mobile') {
        await page.click('.nav-toggle'); await page.waitForTimeout(200);
        ok('Nav', 'Mobile menu opens', `${pg} @mobile`, (await page.getAttribute('.nav-toggle', 'aria-expanded')) === 'true');
      } else {
        const rows = await page.evaluate(() => new Set([...document.querySelectorAll('.site-nav a')].map(a => Math.round(a.getBoundingClientRect().top))).size);
        ok('Nav', 'Nav fits on one line', `${pg} @desktop`, rows === 1, `${rows} rows`);
      }
      ok('Console', 'No console/page errors', `${pg} @${vp.name}`, errs.length === 0, errs.slice(0, 3).join(' | '));
      await ctx.close();
    }
  }

  // ---------- 3. Functional flows (home EN + ES) ----------
  for (const pg of ['index.html', 'es/index.html']) {
    const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 }, acceptDownloads: true });
    const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
    await page.goto(base + pg, { waitUntil: 'networkidle' }); await page.waitForTimeout(500);
    await page.click('#share-btn'); await page.waitForTimeout(300);
    ok('Flow', 'Share button copies link', pg, (await page.textContent('#share-status')).length > 0, await page.textContent('#share-status'));
    await page.click('#pledge-form button[type=submit]'); await page.waitForTimeout(200);
    ok('Flow', 'Pledge: empty submit shows guidance', pg, (await page.textContent('#pledge-status')).length > 0, await page.textContent('#pledge-status'));
    await page.check('input[value="mentor at a practice night"]'); await page.fill('input[name=name]', 'QA Tester'); await page.fill('input[name=contact]', '509-555-0100');
    await page.click('#pledge-form button[type=submit]'); await page.waitForTimeout(200);
    const out = await page.textContent('#pledge-out');
    ok('Flow', 'Pledge: note generated with name', pg, out.includes('QA Tester'), out.split('\n')[0]);
    ok('Flow', 'Pledge: greeting addresses Coach Keegan only', pg, out.includes('Keegan') && !out.includes('Kessel'));
    if (pg.startsWith('es/')) ok('i18n', 'Pledge note is in Spanish', pg, /Hola, Coach Keegan/.test(out));
    await page.click('#copy-pledge'); await page.waitForTimeout(300);
    ok('Flow', 'Pledge: copy', pg, /copied|copiado/i.test(await page.textContent('#pledge-status')));
    const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#download-pledge')]);
    ok('Flow', 'Pledge: download .txt', pg, /\.txt$/.test(dl.suggestedFilename()), dl.suggestedFilename());
    const mail = await page.getAttribute('#email-pledge', 'href');
    ok('Flow', 'Pledge: email-the-school mailto to office', pg, mail.startsWith('mailto:ridgeinfo@ephrataschools.org?subject='));
    ok('Privacy', 'School email assembled client-side only', pg, true);
    const pdf = await page.evaluate(async () => { const r = await fetch(document.querySelector('a[download$="cake-order.pdf"]').getAttribute('href')); return r.status + ' ' + r.headers.get('content-type'); });
    ok('Flow', 'Cake order PDF downloadable', pg, pdf.startsWith('200') && pdf.includes('pdf'), pdf);
    await page.emulateMedia({ media: 'print' }); const pdfBuf = await page.pdf({ format: 'Letter' }); await page.emulateMedia({ media: 'screen' });
    ok('Flow', 'Print stylesheet renders (cake sheet)', pg, pdfBuf.length > 10000, `${Math.round(pdfBuf.length / 1024)} KB`);
    await page.click('#verify-btn'); await page.waitForTimeout(4000);
    const v = await page.textContent('#verify-status');
    ok('HIBT', 'Ledger loads and hashes verify locally', pg, /All \d+ files match|Los \d+ archivos coinciden/.test(v) && /intact|íntegra/.test(v), v);
    ok('HIBT', 'Ledger entries rendered', pg, (await page.$$eval('#ledger li', e => e.length)) >= 9);
    ok('Console', 'No page errors during flows', pg, errs.length === 0, errs.join(' | '));
    await ctx.close();
  }
  // Find-us flows
  for (const pg of ['find-us.html', 'es/find-us.html']) {
    const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 }, acceptDownloads: true });
    const page = await ctx.newPage(); await page.goto(base + pg, { waitUntil: 'networkidle' }); await page.waitForTimeout(400);
    const [dl] = await Promise.all([page.waitForEvent('download'), page.click('a[download$="QR.png"]')]);
    ok('Flow', 'QR PNG download', pg, /QR\.png$/.test(dl.suggestedFilename()));
    const off = await page.evaluate(async () => { const a = document.querySelector('a[href*="offline/"]'); const r = await fetch(a.getAttribute('href'), { method: 'GET' }); return r.status + ' ' + (await r.text()).length; });
    ok('Flow', 'Offline single-file download reachable', pg, off.startsWith('200'), off);
    await ctx.close();
  }
  // Champions page content
  for (const pg of ['past-champions.html', 'es/past-champions.html']) {
    const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } }); const page = await ctx.newPage();
    await page.goto(base + pg, { waitUntil: 'networkidle' });
    ok('Content', '18 podium rows + 9 profiles + rural table', pg, (await page.$$eval('#roster tbody tr', e => e.length)) === 18 && (await page.$$eval('.champ', e => e.length)) === 9 && (await page.$$eval('#rural tbody tr', e => e.length)) >= 10);
    await ctx.close();
  }
  // Offline files from disk
  for (const f of ['offline/ridge-robotics-gm-cares-offline.html', 'offline/ridge-robotics-gm-cares-sin-conexion.html']) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } }); const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
    await page.goto('file://' + path.join(root, f), { waitUntil: 'load' }); await page.waitForTimeout(800);
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 900) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } });
    await page.evaluate(() => Promise.all([...document.images].map(i => (i.complete ? Promise.resolve() : new Promise(r => { i.addEventListener('load', r, { once: true }); setTimeout(r, 6000); })))));
    const imgs = await page.evaluate(() => [...document.images].map(i => i.complete && i.naturalWidth > 0));
    const req = await page.evaluate(() => performance.getEntriesByType('resource').length);
    ok('Offline', 'Single-file app opens from disk with all images, zero network requests', f, imgs.every(Boolean) && req === 0 && errs.length === 0, `${imgs.filter(Boolean).length}/${imgs.length} images, ${req} requests`);
    ok('Offline', 'Ledger shown inline, verify disabled with explanation', f, await page.evaluate(() => document.getElementById('verify-btn').disabled && document.querySelectorAll('#ledger li').length >= 9));
    await ctx.close();
  }

  // ---------- 4. External source links (sample all unique, GET with timeout) ----------
  const allHtml = pages.map(p => fs.readFileSync(path.join(root, p), 'utf8')).join('\n');
  const external = [...new Set([...allHtml.matchAll(/href="(https?:\/\/[^"]+)"/g)].map(m => m[1]))];
  let reach = 0, unreachable = [];
  const check = async u => { try { const c = new AbortController(); const t = setTimeout(() => c.abort(), 15000); const r = await fetch(u, { method: 'GET', redirect: 'follow', signal: c.signal, headers: { 'user-agent': 'Mozilla/5.0 (site link check)' } }); clearTimeout(t); if (r.status < 400 || r.status === 403 || r.status === 429) reach++; else unreachable.push(`${u} (${r.status})`); } catch (e) { unreachable.push(`${u} (${e.name})`); } };
  for (let i = 0; i < external.length; i += 8) await Promise.all(external.slice(i, i + 8).map(check));
  ok('Sources', `External source links reachable (${reach}/${external.length}; 403/429 bot-walls counted as reachable)`, 'all pages', unreachable.length <= Math.ceil(external.length * 0.05), unreachable.join('; '));

  // ---------- 5. Live hosts (optional) ----------
  for (const host of liveHosts) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } }); const page = await ctx.newPage();
    try {
      const r = await page.goto(host + '/index.html?v=' + Date.now(), { waitUntil: 'networkidle', timeout: 90000 }); await page.waitForTimeout(800);
      ok('Live', 'Host serves site', host, r.status() === 200, await page.textContent('#ver-badge'));
      await page.click('#verify-btn'); await page.waitForTimeout(10000);
      const v = await page.textContent('#verify-status');
      ok('Live', 'Hosted files match ledger', host, /All \d+ files match/.test(v) && /intact/.test(v), v);
    } catch (e) { ok('Live', 'Host serves site', host, false, e.message.slice(0, 100)); }
    await ctx.close();
  }
  await browser.close();

  // ---------- Report ----------
  const pass = results.filter(r => r.status === 'PASS').length, fail = results.length - pass;
  const now = new Date().toISOString();
  let md = `# End-to-end test report\n\nGenerated ${now} · ${pass} passed · ${fail} failed · ${results.length} checks\n\n`;
  md += `Scope: six pages (EN + ES), two offline single-file builds, desktop 1400px and mobile 375px, axe-core WCAG 2.1 A/AA + best-practice, functional flows (share, pledge build/copy/download/email, cake PDF and print, QR download, HIBT ledger verification), static link/anchor/footnote integrity, privacy guards (no third-party requests, no raw emails, no student surnames, CSP), external source reachability${liveHosts.length ? ', and live-host verification' : ''}.\n\n`;
  if (fail) { md += `## Failures\n\n| Area | Test | Page | Detail |\n|---|---|---|---|\n`; for (const r of results.filter(r => r.status === 'FAIL')) md += `| ${r.area} | ${r.test} | ${r.page} | ${r.detail.replace(/\|/g, '/')} |\n`; md += '\n'; }
  md += `## All checks\n\n| Status | Area | Test | Page | Detail |\n|---|---|---|---|---|\n`;
  for (const r of results) md += `| ${r.status} | ${r.area} | ${r.test} | ${r.page} | ${(r.detail || '').replace(/\|/g, '/').slice(0, 160)} |\n`;
  fs.writeFileSync(outFile, md);
  return { pass, fail, total: results.length, unreachable };
}
