#!/usr/bin/env python3
"""Build hibt.json: a chained How-I-Built-This ledger with SHA-256 hashes of shipped files.
Run from the repo root: python3 ../ridge-robotics-gm-cares-build/gen_hibt.py
"""
import hashlib, json, os, subprocess, datetime, sys

SITE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
LEDGER_SRC = os.path.join(os.path.dirname(__file__), 'ledger.json')

def sha256_file(p):
    h = hashlib.sha256()
    with open(p, 'rb') as f:
        for chunk in iter(lambda: f.read(1 << 16), b''):
            h.update(chunk)
    return h.hexdigest()

def canonical(o):
    return json.dumps(o, sort_keys=True, separators=(',', ':'), ensure_ascii=False)

def main():
    with open(LEDGER_SRC) as f:
        src = json.load(f)
    files = []
    for root, dirs, names in os.walk(SITE):
        dirs[:] = [d for d in dirs if not d.startswith('.') and d != 'build']
        for n in sorted(names):
            if n in ('hibt.json', 'README.md', 'LICENSE') or n.startswith('.'):
                continue
            p = os.path.join(root, n)
            rel = os.path.relpath(p, SITE).replace(os.sep, '/')
            files.append({'path': rel, 'sha256': sha256_file(p), 'bytes': os.path.getsize(p)})
    files.sort(key=lambda x: x['path'])
    try:
        commit = subprocess.check_output(['git', 'rev-parse', '--short', 'HEAD'], cwd=SITE, text=True).strip()
    except Exception:
        commit = 'uncommitted'
    prev = '0' * 64
    entries = []
    for e in src['entries']:
        body = dict(e)
        body['prev'] = prev
        chain = hashlib.sha256((prev + canonical(body)).encode('utf-8')).hexdigest()
        body['chain'] = chain
        entries.append(body)
        prev = chain
    out = {
        'standard': 'HIBT-AIGovOps ledger, v1',
        'project': src['project'],
        'version': src['version'],
        'generated_at': datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds'),
        'built_from_commit': commit,
        'hash_algorithm': 'SHA-256',
        'chain_rule': 'chain = sha256(prev + canonical_json(entry_without_chain))',
        'files': files,
        'changelog': src['changelog'],
        'entries': entries,
        'head': prev,
    }
    with open(os.path.join(SITE, 'hibt.json'), 'w') as f:
        json.dump(out, f, indent=2, ensure_ascii=False)
    print('hibt.json written:', len(files), 'files,', len(entries), 'entries, head', prev[:16], 'commit', commit)

if __name__ == '__main__':
    main()
