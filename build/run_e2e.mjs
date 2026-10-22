import { runE2E } from './e2e.mjs';
import { chromium } from 'playwright';
import fs from 'node:fs';
const axeSrc = fs.readFileSync('/tmp/node_modules/axe-core/axe.min.js','utf8');
const live = process.argv.includes('--live') ? ['https://gm-cares-about-ridge-robotics.pplx.app','https://ridge-robotics-gm-cares.pplx.app','https://bobrapp.github.io/gm-cares-about-ridge-robotics'] : [];
const res = await runE2E({ chromium, axeSrc, base: 'http://127.0.0.1:8765/', root: '/home/user/workspace/ridge-robotics-gm-cares', outFile: '/home/user/workspace/ridge-robotics-gm-cares/TEST-REPORT.md', liveHosts: live });
console.log(JSON.stringify(res));
