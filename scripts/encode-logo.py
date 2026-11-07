from pathlib import Path
import sys, subprocess, json
sys.path.insert(0,str(Path('.tools/python').resolve()))
import imageio_ffmpeg
ffmpeg=imageio_ffmpeg.get_ffmpeg_exe()
base=Path('output/logo')
subprocess.run([ffmpeg,'-y','-framerate','24','-i',str(base/'frames/%04d.png'),'-c:v','libvpx-vp9','-pix_fmt','yuva420p','-auto-alt-ref','0','-crf','25','-b:v','0','-metadata:s:v:0','alpha_mode=1',str(base/'infocus-logo.webm')],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
subprocess.run([ffmpeg,'-y','-framerate','24','-i',str(base/'frames/%04d.png'),'-filter_complex','fps=20,scale=400:-1:flags=lanczos,split[a][b];[a]palettegen=reserve_transparent=1:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:alpha_threshold=128','-loop','0',str(base/'infocus-logo.gif')],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
# Verify that the VP9 decoder recovers a nonopaque alpha plane.
subprocess.run([ffmpeg,'-y','-c:v','libvpx-vp9','-i',str(base/'infocus-logo.webm'),'-ss','4','-frames:v','1','-vf','alphaextract',str(base/'webm-alpha.png')],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
from PIL import Image
assert Image.open(base/'webm-alpha.png').getextrema()==(0,255)
gif=Image.open(base/'infocus-logo.gif');assert 'transparency' in gif.info
png=Image.open(base/'infocus-logo.png');assert png.mode=='RGBA' and png.getchannel('A').getextrema()==(0,255)
report={'webm':'VP9 with verified alpha channel','gif':f'{gif.n_frames} frames; transparent palette','png':list(png.size),'svg':'Continuous editable path; transparent','duration_seconds':12,'frame_rate':24}
(base/'export-verification.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report))

subprocess.run([ffmpeg,'-y','-framerate','24','-start_number','86','-i',str(base/'frames/%04d.png'),'-frames:v','180','-c:v','libvpx-vp9','-pix_fmt','yuva420p','-auto-alt-ref','0','-crf','25','-b:v','0','-metadata:s:v:0','alpha_mode=1',str(base/'infocus-logo-idle.webm')],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
subprocess.run([ffmpeg,'-y','-framerate','24','-start_number','86','-i',str(base/'frames/%04d.png'),'-t','7.5','-filter_complex','fps=20,scale=400:-1:flags=lanczos,split[a][b];[a]palettegen=reserve_transparent=1:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:alpha_threshold=128','-loop','0',str(base/'infocus-logo-idle.gif')],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
print('Idle-only exports also created.')
