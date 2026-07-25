"""Build hub/index.html from hub-template.html, data.json, and the assets folders.

Run from the hub directory:  python3 assemble.py
Then republish index.html to the existing artifact URL.
"""
import base64, json, os, re

HUB = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HUB)


def b64(path):
    return base64.b64encode(open(path, 'rb').read()).decode()


tpl = open(os.path.join(HUB, 'hub-template.html')).read()

tpl = tpl.replace('__FONT_ANTON__', b64(os.path.join(HUB, 'assets/fonts/anton-400.woff2')))
tpl = tpl.replace('__FONT_INTER__', b64(os.path.join(HUB, 'assets/fonts/inter-400.woff2')))
tpl = tpl.replace('__FONT_CAVEAT__', b64(os.path.join(HUB, 'assets/fonts/caveat-700.woff2')))

guide = open(os.path.join(REPO, 'docs/ryan-brand-guidelines.html')).read()
sig = re.search(r'aria-label="Ryan Tayler signature">(.*?)</svg>', guide, re.S).group(1).strip()
tpl = tpl.replace('__SIG_PATHS__', sig)

data = json.load(open(os.path.join(HUB, 'data.json')))
for sl in data['slides']:
    sl['src'] = 'data:image/webp;base64,' + b64(os.path.join(HUB, 'assets/web', sl.pop('file')))

payload = json.dumps(data, ensure_ascii=False).replace('</', '<\\/')
tpl = tpl.replace('__HUB_DATA__', payload)

out = os.path.join(HUB, 'index.html')
open(out, 'w').write(tpl)
print('wrote', out, len(tpl) // 1024, 'KB')
