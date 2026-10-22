#!/usr/bin/env python3
"""Build a single self-contained HTML file of the whole app (index + Find-us page),
with CSS, fonts, images, PDF, QR and the HIBT ledger inlined as data URIs.
Output: offline/ridge-robotics-gm-cares-offline.html  (open from a USB stick, email, or a file share)
"""
import base64, json, mimetypes, os, re, sys
LANG = 'es' if '--es' in sys.argv else 'en'
PFX = 'es/' if LANG == 'es' else ''
UP = '../' if LANG == 'es' else './'

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUT_DIR = os.path.join(ROOT, 'offline')
OUT = os.path.join(OUT_DIR, 'ridge-robotics-gm-cares-sin-conexion.html' if LANG == 'es' else 'ridge-robotics-gm-cares-offline.html')
mimetypes.add_type('image/webp', '.webp'); mimetypes.add_type('font/woff2', '.woff2'); mimetypes.add_type('image/svg+xml', '.svg')

def read(rel, mode='r'):
    with open(os.path.join(ROOT, rel), mode, encoding=None if 'b' in mode else 'utf-8') as f:
        return f.read()

def data_uri(rel):
    mime = mimetypes.guess_type(rel)[0] or 'application/octet-stream'
    return 'data:%s;base64,%s' % (mime, base64.b64encode(read(rel, 'rb')).decode('ascii'))

def inline_css(css):
    return re.sub(r"url\('\./(assets/[^']+)'\)", lambda m: "url('%s')" % data_uri(m.group(1)), css)

def main():
    html = read(PFX + 'index.html')
    findus = read(PFX + 'find-us.html')
    if LANG == 'es':
        html = html.replace('"../', '"./').replace(' data-base="../"', ''); findus = findus.replace('"../', '"./')

    # --- merge the Find-us page as a section at the end of <main> ---
    sec = re.search(r'<main id="main">\s*(<section class="findus" id="top">.*?</section>)\s*</main>', findus, re.S).group(1)
    sec = sec.replace('class="findus" id="top"', 'class="findus section" id="find-us"')
    sec = sec.replace('<h1 class="findus__title">', '<h2 class="findus__title">').replace('</h1>', '</h2>')
    sec = sec.replace('id="share-btn"', 'id="share-btn-2"').replace('id="share-status"', 'id="share-status-2"')
    sec = re.sub(r'href="\./index\.html#', 'href="#', sec)
    champs = read(PFX + 'past-champions.html')
    if LANG == 'es':
        champs = champs.replace('"../', '"./')
    csec = re.search(r'<main id="main">\s*(.*?)\s*</main>', champs, re.S).group(1)
    csec = csec.replace('<section class="hero hero--compact" id="top">', '<section class="hero hero--compact" id="past-champions">')
    csec = csec.replace('<h1 class="hero__title">', '<h2 class="hero__title">').replace('</h1>', '</h2>')
    csec = re.sub(r'href="\./index\.html#', 'href="#', csec)
    html = html.replace('</main>', csec + '\n' + sec + '\n</main>')
    html = html.replace('href="./find-us.html"', 'href="#find-us"').replace('href="./past-champions.html"', 'href="#past-champions"')
    html = re.sub(r'<a class="lang-switch"[^>]*>[^<]*</a>\s*', '', html)
    html = html.replace('href="./index.html#', 'href="#')

    # --- CSS: inline the three stylesheets (fonts become data URIs) ---
    css = '\n'.join(inline_css(read(f)) for f in ('fonts.css', 'base.css', 'style.css'))
    css += '\n.page-home .findus { min-height: 0; }\n'
    html = re.sub(r'  <link rel="stylesheet" href="\./fonts\.css" />\n', '', html)
    html = re.sub(r'  <link rel="stylesheet" href="\./base\.css" />\n  <link rel="stylesheet" href="\./style\.css" />\n',
                  '  <style>\n' + css + '\n  </style>\n', html)

    # --- CSP: single file needs inline script/style and data: fonts ---
    html = re.sub(r'<meta http-equiv="Content-Security-Policy" content="[^"]*" />',
                  '<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; script-src \'unsafe-inline\'; style-src \'unsafe-inline\'; img-src data:; font-src data:; form-action mailto:; base-uri \'none\'" />', html)

    # --- scripts ---
    html = html.replace('<script src="./js-flag.js"></script>', '<script>document.documentElement.classList.add(\'js\')</script>')
    ledger = read('hibt.json')
    html = html.replace('<script src="./app.js" defer></script>',
                        '<script type="application/json" id="hibt-data">' + ledger.replace('</', '<\\/') + '</script>\n<script>\n' + read('app.js') + '\n</script>')

    # --- images, downloads ---
    html = re.sub(r'(src|href)="\./(assets/[^"]+)"', lambda m: '%s="%s"' % (m.group(1), data_uri(m.group(2))), html)
    html = html.replace('content="./assets/hero-robot.webp"', 'content=""')

    # --- offline banner + title ---
    banner = ('Copia sin conexión de <a href="https://gm-cares-about-ridge-robotics.pplx.app/es/">gm-cares-about-ridge-robotics.pplx.app/es</a>. Todo funciona sin internet, excepto la verificación de hashes en vivo y los enlaces a las fuentes.' if LANG == 'es' else 'Offline copy of <a href="https://gm-cares-about-ridge-robotics.pplx.app">gm-cares-about-ridge-robotics.pplx.app</a>. Everything works without internet except live hash verification and the source links.')
    html = html.replace('<body class="page-home">', '<body class="page-home page-offline">\n<p class="offline-banner">' + banner + '</p>')
    html = html.replace('<style>\n', '<style>\n.offline-banner{margin:0;padding:8px 16px;background:#194390;color:#fff;font-size:14px;text-align:center}.offline-banner a{color:#fff}\n', 1)

    os.makedirs(OUT_DIR, exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write(html)
    print('wrote', os.path.relpath(OUT, ROOT), round(os.path.getsize(OUT) / 1024), 'KB')

if __name__ == '__main__':
    main()
