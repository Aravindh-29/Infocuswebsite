from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
import json
root=Path.cwd()
with ZipFile(root/'output/infocus-renewed-static.zip','w',ZIP_DEFLATED,compresslevel=6) as archive:
    for file in (root/'out').rglob('*'):
        if file.is_file(): archive.write(file,file.relative_to(root/'out'))
with ZipFile(root/'output/infocus-wordmark-kit.zip','w',ZIP_DEFLATED,compresslevel=6) as archive:
    for file in (root/'output/wordmark').iterdir():
        if file.is_file() and not file.name.startswith('alpha'): archive.write(file,'exports/'+file.name)
    for name in ['components/InfocusWordmarkAnimation.tsx','public/brand/infocus-wordmark.png','public/brand/infocus-wordmark.svg','LOGO-ANIMATION.md']:
        archive.write(root/name,name)
for name in ['infocus-renewed-static.zip','infocus-wordmark-kit.zip']:
    with ZipFile(root/'output'/name) as archive: assert archive.testzip() is None
    print(name,round((root/'output'/name).stat().st_size/1024/1024,2),'MB')
