# Privacy, PII, children's-data and accessibility review — v1.5 (2026-10-20)

Scope: https://gm-cares-about-ridge-robotics.pplx.app (mirror: ridge-robotics-gm-cares.pplx.app), pages `index.html` and `find-us.html`.

## Findings and fixes

| Area | Finding | Fix shipped in v1.5 |
|---|---|---|
| Third-party requests | Fonts loaded from api.fontshare.com / cdn.fontshare.com (visitor IPs and referrers reached a third party) | Fonts self-hosted in `assets/fonts/` (ITF Free Font License permits web embedding). Zero external requests at runtime. |
| Script injection / supply chain | No CSP; inline bootstrap script | `Content-Security-Policy` meta: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; form-action 'self' mailto:`. Inline script moved to `js-flag.js`. Referrer policy `strict-origin-when-cross-origin`. |
| Data collection | None by design (static files; pledge builder is client-side; mailto only) | Documented in a new "Privacy and protecting kids" section; pledge note now tells adults not to include any student's name or details. |
| Children's PII | Student first names (coach-supplied) and last year's first names (already published by Grant County Journal / district). No surnames, grades, ages, photos, schedules. Avatars are code-drawn robots assigned by list position. | Section explains the policy, the removal path (school office → next version, ledger-recorded), and a coach checklist (district media/directory permission on file; first names only; no photos; send from school email). |
| FERPA (34 CFR 99.37) | Site is not the school; directory-information disclosure rules bind the district. | Rely on coach-supplied first names with family permission; link district FERPA/PPRA notices. |
| WA SUPER Act (RCW 28A.604) | Binds "school service providers"; this volunteer page is not one. | Follow its limits anyway: no targeted ads, no sale/profiling, no collection. |
| COPPA | Not directed to children; collects no personal information; no consent mechanism triggered. | No child-submittable inputs; contact paths go to adults. |
| FIRST Youth Protection Program | Site must not create adult→student digital channels. | All contact routes to the school office; no student contact info anywhere. |
| Adults' PII | Coach's name/role (public, newsworthy); school office address/phone/email (public). Visitors' names only in the hero (consented). | School email assembled client-side (also prevents CDN HTML rewriting). |
| Accessibility (axe-core, WCAG 2.1 AA + best-practice) | 48 color-contrast failures: footnote markers (#9c968e), orange kickers (#c95d0d, 3.9:1), status text on cream | Footnotes now use #5f5a53 (≥6:1); kickers #9e4508 (5.5:1); status text darkened; dark/blue-section variants adjusted. Result: 0 violations on both pages at 1400 px and 375 px. |
| Accessibility (manual) | Skip link, landmarks, labelled controls, aria-live status, aria-expanded nav toggle, reduced-motion, keyboard focus ring, `details/summary`, print styles, alt text, `lang="es"` on Spanish source titles | Verified; no change needed beyond contrast. |

## Residual notes
- The HIBT ledger (`hibt.json`) records the prompts verbatim, including the first names supplied for the roster. This is intentional (provenance) and limited to first names.
- The page is public and indexable; that is the purpose. If the district prefers, add `<meta name="robots" content="noindex">` in a future version.
- Legal framing is informational, not legal advice; the district's records officer is the authority on directory-information status for any student.
