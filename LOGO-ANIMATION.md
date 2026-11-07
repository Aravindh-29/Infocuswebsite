# Infocus native logo animation

The symbol uses the written construction instructions and the original IF logo geometry. The supplied attachments contained the purple INFOCUS wordmark and website screenshots, rather than a separate directional sketch. A static geometry preview was shown before animation implementation.

The continuous path starts at the top-right, moves left along the upper bar, down the central stem, around the bottom loop (left, up, right), and finishes at the middle bar's right endpoint. Rounded corners and caps, a blue/cyan/violet gradient, bevel highlights and a transparent drop shadow provide depth. There is no enclosing frame.

## Component

`components/InfocusLogoAnimation.tsx` accepts `mode="intro" | "idle"`, `loop`, `className`, and an accessible `label`. The website uses this native SVG component in its navigation, footer and light homepage. The purple wordmark comes from the uploaded image, cropped and resized without redrawing its lettering.

```tsx
import {useRef} from 'react';
import InfocusLogoAnimation, {InfocusLogoHandle} from './InfocusLogoAnimation';

const logo = useRef<InfocusLogoHandle>(null);
// Render inside your component:
<InfocusLogoAnimation ref={logo} mode="intro" loop />
// Controls:
logo.current?.play();
logo.current?.pause();
logo.current?.restart();
logo.current?.setLoop(false);
```

Give the component a sized wrapper and include `.infocus-logo-animation { display: block; width: 100%; height: auto; overflow: visible; }` in your stylesheet. Install `gsap` and keep the `@/lib/logo` import mapped to the supplied geometry file.

`seek(seconds)` is also available for deterministic preview and export. `/logo-preview/` provides all controls in a working preview page.

Intro construction lasts 2.6 seconds. The sphere enters from above, accelerates into its landing, squashes, rebounds with a small side-to-side wobble and settles. The idle segment cycles Orange → Yellow → Cyan → Blue → Violet → Magenta → Orange and pulses gently. A warm specular sweep adds a gold-like glint to the finished stroke. When looping the native component, the completed line remains stationary and only the idle segment repeats.

GSAP contexts and timelines are cleaned up on unmount. A live `prefers-reduced-motion` media query shows the complete stationary symbol and disables animation. SVG definition IDs are unique per component instance.

## Deliverables

- `output/logo/infocus-logo.webm` — 512 × 538, 24 fps, 12-second VP9 animation with a verified alpha channel.
- `output/logo/infocus-logo.gif` — 400 × 420, 20 fps, transparent palette, 240 frames. GIF has binary transparency, so WebM or the native component provides smoother edges.
- `output/logo/infocus-logo.png` — 2400 × 2520 RGBA still, transparent.
- `output/logo/infocus-logo-idle.webm` and `infocus-logo-idle.gif` � idle-only colour/pulse loops with stationary geometry.
- `output/logo/infocus-logo.svg` — static editable vector, transparent.
- `components/InfocusLogoAnimation.tsx` and `lib/logo.ts` — reusable implementation and shared geometry.
- `output/logo/export-verification.json` — export checks.

The exported 12-second files contain one complete intro and colour cycle. Repeating that exported clip repeats its intro; the native component provides the requested intro-once/idle-repeat behaviour. Use native rendering on the website.

## Recreate exports

1. Run `npm run build` and start the static preview.
2. Run `node scripts/export-logo.cjs` (defaults to `http://127.0.0.1:4174`; set `TEST_URL` to override).
3. Run `python -m pip install --target .tools/python imageio-ffmpeg` if the encoder is missing. Pillow is also required for the alpha checks.
4. Run `python scripts/encode-logo.py`.

The exporter seeks the actual React component and captures transparent frames. It does not approximate the motion with a second drawing implementation.
