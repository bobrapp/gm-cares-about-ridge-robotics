# End-to-end test report

Generated 2026-10-22T01:27:49.809Z · 182 passed · 0 failed · 182 checks

Scope: six pages (EN + ES), two offline single-file builds, desktop 1400px and mobile 375px, axe-core WCAG 2.1 A/AA + best-practice, functional flows (share, pledge build/copy/download/email, cake PDF and print, QR download, HIBT ledger verification), static link/anchor/footnote integrity, privacy guards (no third-party requests, no raw emails, no student surnames, CSP), external source reachability.

## All checks

| Status | Area | Test | Page | Detail |
|---|---|---|---|---|
| PASS | Links | Internal file links resolve | index.html |  |
| PASS | Links | Anchor targets exist | index.html |  |
| PASS | Sourcing | Footnotes present | index.html | 78 footnote groups, 3 single-source (attributed quotes) |
| PASS | Privacy | No raw email addresses in HTML (CDN rewrite guard) | index.html |  |
| PASS | Privacy | No student surnames | index.html |  |
| PASS | Security | Content-Security-Policy present | index.html |  |
| PASS | i18n | lang attribute correct | index.html |  |
| PASS | i18n | Language switch present | index.html |  |
| PASS | Links | Internal file links resolve | find-us.html |  |
| PASS | Links | Anchor targets exist | find-us.html |  |
| PASS | Sourcing | Footnotes present | find-us.html | 0 footnote groups, 0 single-source (attributed quotes) |
| PASS | Privacy | No raw email addresses in HTML (CDN rewrite guard) | find-us.html |  |
| PASS | Privacy | No student surnames | find-us.html |  |
| PASS | Security | Content-Security-Policy present | find-us.html |  |
| PASS | i18n | lang attribute correct | find-us.html |  |
| PASS | i18n | Language switch present | find-us.html |  |
| PASS | Links | Internal file links resolve | past-champions.html |  |
| PASS | Links | Anchor targets exist | past-champions.html |  |
| PASS | Sourcing | Footnotes present | past-champions.html | 108 footnote groups, 63 single-source (attributed quotes) |
| PASS | Privacy | No raw email addresses in HTML (CDN rewrite guard) | past-champions.html |  |
| PASS | Privacy | No student surnames | past-champions.html |  |
| PASS | Security | Content-Security-Policy present | past-champions.html |  |
| PASS | i18n | lang attribute correct | past-champions.html |  |
| PASS | i18n | Language switch present | past-champions.html |  |
| PASS | Links | Internal file links resolve | es/index.html |  |
| PASS | Links | Anchor targets exist | es/index.html |  |
| PASS | Sourcing | Footnotes present | es/index.html | 78 footnote groups, 3 single-source (attributed quotes) |
| PASS | Privacy | No raw email addresses in HTML (CDN rewrite guard) | es/index.html |  |
| PASS | Privacy | No student surnames | es/index.html |  |
| PASS | Security | Content-Security-Policy present | es/index.html |  |
| PASS | i18n | lang attribute correct | es/index.html |  |
| PASS | i18n | Language switch present | es/index.html |  |
| PASS | Links | Internal file links resolve | es/find-us.html |  |
| PASS | Links | Anchor targets exist | es/find-us.html |  |
| PASS | Sourcing | Footnotes present | es/find-us.html | 0 footnote groups, 0 single-source (attributed quotes) |
| PASS | Privacy | No raw email addresses in HTML (CDN rewrite guard) | es/find-us.html |  |
| PASS | Privacy | No student surnames | es/find-us.html |  |
| PASS | Security | Content-Security-Policy present | es/find-us.html |  |
| PASS | i18n | lang attribute correct | es/find-us.html |  |
| PASS | i18n | Language switch present | es/find-us.html |  |
| PASS | Links | Internal file links resolve | es/past-champions.html |  |
| PASS | Links | Anchor targets exist | es/past-champions.html |  |
| PASS | Sourcing | Footnotes present | es/past-champions.html | 108 footnote groups, 63 single-source (attributed quotes) |
| PASS | Privacy | No raw email addresses in HTML (CDN rewrite guard) | es/past-champions.html |  |
| PASS | Privacy | No student surnames | es/past-champions.html |  |
| PASS | Security | Content-Security-Policy present | es/past-champions.html |  |
| PASS | i18n | lang attribute correct | es/past-champions.html |  |
| PASS | i18n | Language switch present | es/past-champions.html |  |
| PASS | Load | HTTP 200 | index.html @desktop | 200 |
| PASS | Layout | No horizontal overflow | index.html @desktop | scrollWidth 1400 |
| PASS | Assets | Self-hosted fonts loaded | index.html @desktop |  |
| PASS | Privacy | Zero third-party requests | index.html @desktop |  |
| PASS | Assets | All images load | index.html @desktop | 4/4 |
| PASS | Accessibility | axe-core: 0 violations (WCAG 2.1 A/AA + best-practice) | index.html @desktop |  |
| PASS | Nav | Nav fits on one line | index.html @desktop | 1 rows |
| PASS | Console | No console/page errors | index.html @desktop |  |
| PASS | Load | HTTP 200 | index.html @mobile | 200 |
| PASS | Layout | No horizontal overflow | index.html @mobile | scrollWidth 375 |
| PASS | Assets | Self-hosted fonts loaded | index.html @mobile |  |
| PASS | Privacy | Zero third-party requests | index.html @mobile |  |
| PASS | Assets | All images load | index.html @mobile | 4/4 |
| PASS | Accessibility | axe-core: 0 violations (WCAG 2.1 A/AA + best-practice) | index.html @mobile |  |
| PASS | Nav | Mobile menu opens | index.html @mobile |  |
| PASS | Console | No console/page errors | index.html @mobile |  |
| PASS | Load | HTTP 200 | find-us.html @desktop | 200 |
| PASS | Layout | No horizontal overflow | find-us.html @desktop | scrollWidth 1400 |
| PASS | Assets | Self-hosted fonts loaded | find-us.html @desktop |  |
| PASS | Privacy | Zero third-party requests | find-us.html @desktop |  |
| PASS | Assets | All images load | find-us.html @desktop | 2/2 |
| PASS | Accessibility | axe-core: 0 violations (WCAG 2.1 A/AA + best-practice) | find-us.html @desktop |  |
| PASS | Nav | Nav fits on one line | find-us.html @desktop | 1 rows |
| PASS | Console | No console/page errors | find-us.html @desktop |  |
| PASS | Load | HTTP 200 | find-us.html @mobile | 200 |
| PASS | Layout | No horizontal overflow | find-us.html @mobile | scrollWidth 375 |
| PASS | Assets | Self-hosted fonts loaded | find-us.html @mobile |  |
| PASS | Privacy | Zero third-party requests | find-us.html @mobile |  |
| PASS | Assets | All images load | find-us.html @mobile | 2/2 |
| PASS | Accessibility | axe-core: 0 violations (WCAG 2.1 A/AA + best-practice) | find-us.html @mobile |  |
| PASS | Nav | Mobile menu opens | find-us.html @mobile |  |
| PASS | Console | No console/page errors | find-us.html @mobile |  |
| PASS | Load | HTTP 200 | past-champions.html @desktop | 200 |
| PASS | Layout | No horizontal overflow | past-champions.html @desktop | scrollWidth 1400 |
| PASS | Assets | Self-hosted fonts loaded | past-champions.html @desktop |  |
| PASS | Privacy | Zero third-party requests | past-champions.html @desktop |  |
| PASS | Assets | All images load | past-champions.html @desktop | 1/1 |
| PASS | Accessibility | axe-core: 0 violations (WCAG 2.1 A/AA + best-practice) | past-champions.html @desktop |  |
| PASS | Nav | Nav fits on one line | past-champions.html @desktop | 1 rows |
| PASS | Console | No console/page errors | past-champions.html @desktop |  |
| PASS | Load | HTTP 200 | past-champions.html @mobile | 200 |
| PASS | Layout | No horizontal overflow | past-champions.html @mobile | scrollWidth 375 |
| PASS | Assets | Self-hosted fonts loaded | past-champions.html @mobile |  |
| PASS | Privacy | Zero third-party requests | past-champions.html @mobile |  |
| PASS | Assets | All images load | past-champions.html @mobile | 1/1 |
| PASS | Accessibility | axe-core: 0 violations (WCAG 2.1 A/AA + best-practice) | past-champions.html @mobile |  |
| PASS | Nav | Mobile menu opens | past-champions.html @mobile |  |
| PASS | Console | No console/page errors | past-champions.html @mobile |  |
| PASS | Load | HTTP 200 | es/index.html @desktop | 200 |
| PASS | Layout | No horizontal overflow | es/index.html @desktop | scrollWidth 1400 |
| PASS | Assets | Self-hosted fonts loaded | es/index.html @desktop |  |
| PASS | Privacy | Zero third-party requests | es/index.html @desktop |  |
| PASS | Assets | All images load | es/index.html @desktop | 4/4 |
| PASS | Accessibility | axe-core: 0 violations (WCAG 2.1 A/AA + best-practice) | es/index.html @desktop |  |
| PASS | Nav | Nav fits on one line | es/index.html @desktop | 1 rows |
| PASS | Console | No console/page errors | es/index.html @desktop |  |
| PASS | Load | HTTP 200 | es/index.html @mobile | 200 |
| PASS | Layout | No horizontal overflow | es/index.html @mobile | scrollWidth 375 |
| PASS | Assets | Self-hosted fonts loaded | es/index.html @mobile |  |
| PASS | Privacy | Zero third-party requests | es/index.html @mobile |  |
| PASS | Assets | All images load | es/index.html @mobile | 4/4 |
| PASS | Accessibility | axe-core: 0 violations (WCAG 2.1 A/AA + best-practice) | es/index.html @mobile |  |
| PASS | Nav | Mobile menu opens | es/index.html @mobile |  |
| PASS | Console | No console/page errors | es/index.html @mobile |  |
| PASS | Load | HTTP 200 | es/find-us.html @desktop | 200 |
| PASS | Layout | No horizontal overflow | es/find-us.html @desktop | scrollWidth 1400 |
| PASS | Assets | Self-hosted fonts loaded | es/find-us.html @desktop |  |
| PASS | Privacy | Zero third-party requests | es/find-us.html @desktop |  |
| PASS | Assets | All images load | es/find-us.html @desktop | 2/2 |
| PASS | Accessibility | axe-core: 0 violations (WCAG 2.1 A/AA + best-practice) | es/find-us.html @desktop |  |
| PASS | Nav | Nav fits on one line | es/find-us.html @desktop | 1 rows |
| PASS | Console | No console/page errors | es/find-us.html @desktop |  |
| PASS | Load | HTTP 200 | es/find-us.html @mobile | 200 |
| PASS | Layout | No horizontal overflow | es/find-us.html @mobile | scrollWidth 375 |
| PASS | Assets | Self-hosted fonts loaded | es/find-us.html @mobile |  |
| PASS | Privacy | Zero third-party requests | es/find-us.html @mobile |  |
| PASS | Assets | All images load | es/find-us.html @mobile | 2/2 |
| PASS | Accessibility | axe-core: 0 violations (WCAG 2.1 A/AA + best-practice) | es/find-us.html @mobile |  |
| PASS | Nav | Mobile menu opens | es/find-us.html @mobile |  |
| PASS | Console | No console/page errors | es/find-us.html @mobile |  |
| PASS | Load | HTTP 200 | es/past-champions.html @desktop | 200 |
| PASS | Layout | No horizontal overflow | es/past-champions.html @desktop | scrollWidth 1400 |
| PASS | Assets | Self-hosted fonts loaded | es/past-champions.html @desktop |  |
| PASS | Privacy | Zero third-party requests | es/past-champions.html @desktop |  |
| PASS | Assets | All images load | es/past-champions.html @desktop | 1/1 |
| PASS | Accessibility | axe-core: 0 violations (WCAG 2.1 A/AA + best-practice) | es/past-champions.html @desktop |  |
| PASS | Nav | Nav fits on one line | es/past-champions.html @desktop | 1 rows |
| PASS | Console | No console/page errors | es/past-champions.html @desktop |  |
| PASS | Load | HTTP 200 | es/past-champions.html @mobile | 200 |
| PASS | Layout | No horizontal overflow | es/past-champions.html @mobile | scrollWidth 375 |
| PASS | Assets | Self-hosted fonts loaded | es/past-champions.html @mobile |  |
| PASS | Privacy | Zero third-party requests | es/past-champions.html @mobile |  |
| PASS | Assets | All images load | es/past-champions.html @mobile | 1/1 |
| PASS | Accessibility | axe-core: 0 violations (WCAG 2.1 A/AA + best-practice) | es/past-champions.html @mobile |  |
| PASS | Nav | Mobile menu opens | es/past-champions.html @mobile |  |
| PASS | Console | No console/page errors | es/past-champions.html @mobile |  |
| PASS | Flow | Share button copies link | index.html | Link copied. Paste it anywhere. |
| PASS | Flow | Pledge: empty submit shows guidance | index.html | Pick at least one way to help. |
| PASS | Flow | Pledge: note generated with name | index.html | Hi Coach Keegan, |
| PASS | Flow | Pledge: greeting addresses Coach Keegan only | index.html |  |
| PASS | Flow | Pledge: copy | index.html |  |
| PASS | Flow | Pledge: download .txt | index.html | Ridge-Robotics-pledge.txt |
| PASS | Flow | Pledge: email-the-school mailto to office | index.html |  |
| PASS | Privacy | School email assembled client-side only | index.html |  |
| PASS | Flow | Cake order PDF downloadable | index.html | 200 application/pdf |
| PASS | Flow | Print stylesheet renders (cake sheet) | index.html | 3167 KB |
| PASS | HIBT | Ledger loads and hashes verify locally | index.html | All 24 files match the ledger. Ledger chain intact (head 6305dcd392ee…). |
| PASS | HIBT | Ledger entries rendered | index.html |  |
| PASS | Console | No page errors during flows | index.html |  |
| PASS | Flow | Share button copies link | es/index.html | Enlace copiado. Pégalo donde quieras. |
| PASS | Flow | Pledge: empty submit shows guidance | es/index.html | Elige al menos una forma de ayudar. |
| PASS | Flow | Pledge: note generated with name | es/index.html | Hola, Coach Keegan: |
| PASS | Flow | Pledge: greeting addresses Coach Keegan only | es/index.html |  |
| PASS | i18n | Pledge note is in Spanish | es/index.html |  |
| PASS | Flow | Pledge: copy | es/index.html |  |
| PASS | Flow | Pledge: download .txt | es/index.html | Ridge-Robotics-compromiso.txt |
| PASS | Flow | Pledge: email-the-school mailto to office | es/index.html |  |
| PASS | Privacy | School email assembled client-side only | es/index.html |  |
| PASS | Flow | Cake order PDF downloadable | es/index.html | 200 application/pdf |
| PASS | Flow | Print stylesheet renders (cake sheet) | es/index.html | 3165 KB |
| PASS | HIBT | Ledger loads and hashes verify locally | es/index.html | Los 24 archivos coinciden con el registro. Cadena del registro íntegra (cabeza 6305dcd392ee…). |
| PASS | HIBT | Ledger entries rendered | es/index.html |  |
| PASS | Console | No page errors during flows | es/index.html |  |
| PASS | Flow | QR PNG download | find-us.html |  |
| PASS | Flow | Offline single-file download reachable | find-us.html | 200 2352535 |
| PASS | Flow | QR PNG download | es/find-us.html |  |
| PASS | Flow | Offline single-file download reachable | es/find-us.html | 200 2366470 |
| PASS | Content | 18 podium rows + 9 profiles + rural table | past-champions.html |  |
| PASS | Content | 18 podium rows + 9 profiles + rural table | es/past-champions.html |  |
| PASS | Offline | Single-file app opens from disk with all images, zero network requests | offline/ridge-robotics-gm-cares-offline.html | 5/5 images, 0 requests |
| PASS | Offline | Ledger shown inline, verify disabled with explanation | offline/ridge-robotics-gm-cares-offline.html |  |
| PASS | Offline | Single-file app opens from disk with all images, zero network requests | offline/ridge-robotics-gm-cares-sin-conexion.html | 5/5 images, 0 requests |
| PASS | Offline | Ledger shown inline, verify disabled with explanation | offline/ridge-robotics-gm-cares-sin-conexion.html |  |
| PASS | Sources | External source links reachable (114/117; 403/429 bot-walls counted as reachable) | all pages | https://gm-cares-about-ridge-robotics.pplx.app/es/index.html (404); https://gm-cares-about-ridge-robotics.pplx.app/es/find-us.html (404); https://gm-cares-about |
