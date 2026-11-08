# Maakt het crème achtergrondpatroon en de icoontjes voor de landingspagina,
# met dezelfde lijn-motieven als de Instagram-achtergronden (04_social/achtergronden).
import sys, io, re
sys.path.insert(0, sys.argv[1])
from _script_illustraties import chamomile, sprig, berries, ginger, steam
import cairosvg
from PIL import Image
OUT = sys.argv[2]
STYLE = lambda col, w: f'<style>g,path,circle,ellipse{{fill:none;stroke:{col};stroke-width:{w};stroke-linecap:round;stroke-linejoin:round}} .f{{fill:{col};stroke:none}}</style>'
MOT = {
 'kamille': lambda: chamomile(0, 0, 90, 0),
 'citroengras': lambda: sprig(-130, 0, 1, 0),
 'bosvruchten': lambda: berries(0, 0, 1, 0),
 'gember': lambda: ginger(-100, -60, 1.4, 0),
 'stoom': lambda: steam(0, 60, 1),
}
def bbox(body, w=4):
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="-600 -600 1200 1200">{STYLE("#000", w)}{body}</svg>'
    im = Image.open(io.BytesIO(cairosvg.svg2png(bytestring=svg.encode()))).getchannel('A')
    x0, y0, x1, y1 = im.getbbox()
    return x0-600, y0-600, x1-600, y1-600
# 1) icoontjes als <symbol> (stroke = currentColor)
syms = ''
for k, f in MOT.items():
    x0, y0, x1, y1 = bbox(f(), 12)
    p = 8
    syms += f'<symbol id="i-{k}" viewBox="{x0-p} {y0-p} {x1-x0+2*p} {y1-y0+2*p}">{f()}</symbol>\n'
open(OUT + '/icons.svg', 'w').write('<svg xmlns="http://www.w3.org/2000/svg">'
  '<style>symbol *{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round}symbol .f{fill:currentColor;stroke:none}</style>\n' + syms + '</svg>')
# 2) naadloos patroon-tegeltje
T = 720
PL = [  # motief, x, y, schaal, rotatie
 ('citroengras', 120, 120, .55, -25), ('gember', 470, 90, .5, 15), ('stoom', 640, 300, .55, 0),
 ('bosvruchten', 330, 330, .5, 20), ('kamille', 120, 470, .5, 0), ('stoom', 220, 640, .45, 0),
 ('kamille', 600, 560, .38, 20), ('gember', 420, 600, .38, -30),
]
def place(k, x, y, s, r):
    return f'<g transform="translate({x},{y}) rotate({r}) scale({s})">{MOT[k]()}</g>'
def tile(col, sw):
    body = ''
    # elk motief ook 1 tegel verschoven tekenen, zodat randen naadloos doorlopen
    for k, x, y, s, r in PL:
        for dx in (-T, 0, T):
            for dy in (-T, 0, T):
                body += place(k, x+dx, y+dy, s, r)
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{T}" height="{T}" viewBox="0 0 {T} {T}">{STYLE(col, sw)}{body}</svg>'
svg = tile(sys.argv[3] if len(sys.argv) > 3 else '#E0D4C1', 6)
svg = re.sub(r'(\d+\.\d)\d+', r'\1', svg)
open(OUT + '/patroon.svg', 'w').write(svg)
cairosvg.svg2png(bytestring=tile('#B9A98F', 6).encode(), write_to=OUT + '/_check_tegel.png')
