# INFOCUS wordmark motion identity

The current brand is the uploaded INFOCUS lettering only. The IF monogram is no longer used in the website, header, footer or favicon. The earlier monogram design and exports remain part of the saved v1 history; files in output/logo are the previous version.

## Native component

Use components/InfocusWordmarkAnimation.tsx with React, TypeScript and GSAP. It clips the actual uploaded image into seven letters instead of substituting a font. Each letter falls, bounces and briefly wobbles into its original position. The settled wordmark receives a travelling gold highlight and two subtle twinkles.

The introductory fall plays once. With loop enabled, only the shimmer/twinkle repeats. Idle mode starts with all letters in position. Night mode adjusts the lettering colour for contrast; its geometry and motion remain the same.

```tsx
import {useRef} from "react";
import InfocusWordmarkAnimation, {InfocusWordmarkHandle} from "./InfocusWordmarkAnimation";

const logo = useRef<InfocusWordmarkHandle>(null);
<InfocusWordmarkAnimation ref={logo} mode="intro" loop />

logo.current?.play();
logo.current?.pause();
logo.current?.restart();
logo.current?.setLoop(false);
logo.current?.seek(3); // deterministic preview/export; pauses both timelines
```

Keep public/brand/infocus-wordmark.png at the component's image URL. The SVG viewBox is 590 × 152. Size the component with CSS; use display:block, width:100%, height:auto and overflow:visible. The optional className prop supports different placements.

The component uses unique SVG IDs, cleans up GSAP media contexts on unmount and responds to live changes in prefers-reduced-motion. Reduced motion renders the complete stationary wordmark. The website uses the native component rather than a GIF.

## Preview and exports

The /logo-preview/ page has play, pause, restart, looping and intro/idle controls.

Current exports are in output/wordmark:
- infocus-wordmark.webm: transparent VP9, 800 × 260, 24 fps, six-second intro clip.
- infocus-wordmark.gif: transparent palette, 640 × 208, 20 fps, six-second intro clip.
- infocus-wordmark-idle.webm and .gif: four-second idle shimmer/twinkle clips.
- infocus-wordmark.png: transparent 2360 × 608 rendered still.
- infocus-wordmark.svg: self-contained SVG embedding the original bitmap lettering. This preserves the uploaded artwork; it is not a newly traced vector font.
- export-verification.json: alpha-channel and format verification.

GIF has binary transparency; native SVG or WebM produces smoother edges. Repeating an exported intro clip repeats the letter fall, while the website plays the intro once and loops only the idle effect.

Run npm run build, start the static preview, then run node scripts/export-logo.cjs followed by python scripts/encode-logo.py. The exporter captures the actual native component at deterministic timeline positions. TEST_URL defaults to http://127.0.0.1:4174. Encoding requires Pillow and imageio-ffmpeg (the local tool installation is in .tools/python).
