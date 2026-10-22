# GM Cares about Ridge Robotics

Celebration and support site for the **GM Cares visit to Ridge Robotics** — the FIRST LEGO League team at Columbia Ridge Elementary, Ephrata, Washington — on **October 22, 2026**.

- **Live site:** https://gm-cares-about-ridge-robotics.pplx.app (mirror: https://ridge-robotics-gm-cares.pplx.app)
- **Cake order sheet:** [`assets/cake-order-sheet.pdf`](assets/cake-order-sheet.pdf) (printable from the site's Cake section as well)
- **Build ledger (HIBT-AIGovOps):** [`hibt.json`](hibt.json) — every prompt, model, result and a SHA-256 of every shipped file, chained; re-verify in the browser from the site's HIBT section.

## What's inside

| Path | Purpose |
|---|---|
| `index.html`, `style.css`, `base.css`, `app.js` | Static single-page site (no build step, no backend) |
| `assets/` | Generated renderings (cake, hero robot, BIOGLOW ecosystem), cake order PDF |
| `hibt.json` | Generated ledger; do not edit by hand |
| `build/ledger.json` | Source of truth for the prompt ledger and changelog |
| `build/gen_hibt.py` | Hashes shipped files and writes `hibt.json` |

## Run locally

```bash
python3 -m http.server 8765
# open http://localhost:8765/
```

## Release a new version

1. Edit the site files and bump the version badge in `index.html`.
2. Add an entry and changelog line to `build/ledger.json`.
3. Commit the content, then `python3 build/gen_hibt.py` and commit `hibt.json`.
4. Deploy. The HIBT section's **Re-verify hashes** button should show every file green.

## Spanish edition, offline copies, tests

- Spanish: `es/index.html`, `es/find-us.html`, `es/past-champions.html` (EN/ES switch in every header).
- Offline single-file builds: `offline/ridge-robotics-gm-cares-offline.html` (EN) and `offline/ridge-robotics-gm-cares-sin-conexion.html` (ES); `offline/teacher-package.zip` bundles both plus the cake PDF, QR and review. Rebuild with `python3 build/build_single.py` and `python3 build/build_single.py --es`.
- End-to-end suite: `node build/run_e2e.mjs [--live]` (needs Playwright + axe-core; serve the folder on http://127.0.0.1:8765 first). Latest results: [`TEST-REPORT.md`](TEST-REPORT.md).

## Sourcing rule

Every factual claim on the page carries at least two footnotes; direct quotes are attributed to the publication that recorded them; conflicts between sources are noted in the Sources section.

## Credits

Built by Bob Rapp (Principal AI Architect, General Motors; GM Cares volunteer) with an AI assistant, in gratitude to the AIGovOps Foundation and its co-founders Bob Rapp and Ken Johnston for their work making AI safer.

FIRST and FIRST LEGO League are trademarks of FIRST; LEGO is a trademark of the LEGO Group; General Motors marks belong to GM. This is a volunteer page, not an official publication of any of them.
