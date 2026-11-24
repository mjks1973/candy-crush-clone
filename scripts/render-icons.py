"""Render the PNG app icons from public/icons/icon.svg (needs Python Playwright + Chrome).
Usage: python3 scripts/render-icons.py"""
import asyncio, base64, pathlib
from playwright.async_api import async_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent / 'public' / 'icons'
src = (ROOT / 'icon.svg').read_text()
# Maskable variant: keep the full-bleed background, shrink the artwork into the 80% safe zone.
BG = '<rect width="1024" height="1024" fill="url(#bg)"/>'
mask = src.replace(BG, BG + '\n  <g transform="translate(512 512) scale(.8) translate(-512 -512)">', 1).replace('</svg>', '</g>\n</svg>')
(ROOT / 'icon-maskable.svg').write_text(mask)
JOBS = [('icon.svg', 'icon-192.png', 192), ('icon.svg', 'icon-512.png', 512), ('icon-maskable.svg', 'icon-maskable-512.png', 512),
        ('icon-maskable.svg', 'icon-maskable-192.png', 192), ('icon.svg', 'apple-touch-icon.png', 180), ('icon.svg', 'favicon-32.png', 32)]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        for svg, out, n in JOBS:
            pg = await b.new_page(viewport={'width': n, 'height': n})
            await pg.set_content(f'<style>html,body{{margin:0}}</style><img src="data:image/svg+xml;base64,{base64.b64encode((ROOT / svg).read_bytes()).decode()}" width="{n}" height="{n}" style="display:block">')
            await pg.wait_for_timeout(200)
            await pg.screenshot(path=str(ROOT / out), omit_background=False)
            await pg.close()
            print('wrote', out)
        await b.close()
asyncio.run(main())
