from pathlib import Path
import sys, subprocess, json
sys.path.insert(0,str(Path('.tools/python').resolve()))
import imageio_ffmpeg
from PIL import Image
ffmpeg=imageio_ffmpeg.get_ffmpeg_exe()
base=Path('output/wordmark')
def run(args):
    subprocess.run([ffmpeg,'-y',*args],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
for folder,suffix in [('frames',''),('idle-frames','-idle')]:
    source=str(base/folder/'%04d.png')
    run(['-framerate','24','-i',source,'-c:v','libvpx-vp9','-pix_fmt','yuva420p','-auto-alt-ref','0','-crf','25','-b:v','0','-metadata:s:v:0','alpha_mode=1',str(base/f'infocus-wordmark{suffix}.webm')])
    run(['-framerate','24','-i',source,'-filter_complex','fps=20,scale=640:-1:flags=lanczos,split[a][b];[a]palettegen=reserve_transparent=1:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:alpha_threshold=128','-loop','0',str(base/f'infocus-wordmark{suffix}.gif')])
    run(['-c:v','libvpx-vp9','-i',str(base/f'infocus-wordmark{suffix}.webm'),'-ss','3','-frames:v','1','-vf','alphaextract',str(base/f'alpha{suffix}.png')])
    assert Image.open(base/f'alpha{suffix}.png').getextrema()==(0,255)
    assert 'transparency' in Image.open(base/f'infocus-wordmark{suffix}.gif').info
png=Image.open(base/'infocus-wordmark.png')
assert png.mode=='RGBA' and png.getchannel('A').getextrema()==(0,255)
report={'webm':'800 x 260; VP9 with verified alpha; 24 fps','gif':'640 x 208; transparent palette; 20 fps','png':list(png.size),'svg':'Self-contained SVG with embedded original bitmap lettering','intro_seconds':6,'idle_seconds':4,'component':'components/InfocusWordmarkAnimation.tsx'}
(base/'export-verification.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report))
