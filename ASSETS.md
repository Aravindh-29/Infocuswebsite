# Custom image assets

All four new assets were generated with the built-in ImageGen tool for this redesign. No external paid stock or Spline subscription is required. Generated illustrations are conceptual, not photographs of client projects or offices. The original brand image was used as the logo reference.

| Asset | Purpose | Final project path |
| --- | --- | --- |
| Glass cloud | Hero and cloud capability | `public/images/cloud-hero.webp` |
| Application architecture | Integration section and Oracle pages | `public/images/integration.webp` |
| IF monogram | Navigation, footer and favicon | `public/images/logo-3d.png`, `app/icon.png` |
| Industry worlds | Ten unique industry illustrations in one sprite atlas | `public/images/industry-worlds.webp` |

The image outputs were converted to optimized WebP for website delivery; the transparent logo was cropped to its visible bounds and resized for navigation. The industry atlas is displayed using CSS background positions without duplicating the ten images. Existing company assets and WOFF2 fonts were retained from the supplied project. Confirm company usage rights before publication.

## Final generation prompts

### Hero

Use case: stylized-concept. Create a premium enterprise technology website hero background illustration for INFOCUS. Wide landscape cinematic 3D composition. Deep near-black midnight navy background #060b18. On the RIGHT two-thirds: a breathtaking sculptural cloud made of frosted translucent icy glass, luminous electric blue edges and cyan internal light, suspended over a dark circular layered orbital platform, with fine elliptical orbital rings and several small chrome and cobalt glass cubes connected with delicate glowing lines. Tiny sparse particles. Beautiful physically based raytraced product rendering, extremely refined, crisp architectural detail, sophisticated Azure-like material quality. LEFT third must be almost entirely empty dark navy for HTML headline. Bottom softly fades into navy. No text, no labels, no watermarks. Avoid purple fog and busy circuitry. Wide 16:9 aspect ratio.

### Integration

Use case: stylized-concept. A premium website editorial 3D illustration explaining enterprise application integration. Landscape 3:2. An exploded architectural arrangement of three frosted glass square platforms suspended in space with luminous electric blue and cyan edges, tiny modular chrome and cobalt server blocks on platforms, delicate white-blue lines connecting blocks to a luminous spherical data core. Dark near-black navy #070d1b backdrop, sophisticated physically based product rendering, exquisite precision, restrained cinematic studio lighting. Central composition with generous dark margins. No text, letters, logos or watermark. Matches an enterprise cloud technology visual identity.

### Logo

Reference: the supplied `images/logo-ifcs.webp`. Transparent output requested.

Use case: logo-brand. Reference image is existing INFOCUS Consulting Services logo. Create ONLY a refreshed 3D icon mark, NO wordmark and NO text. Preserve the original abstract connected lowercase i and f geometry: red circular dot on upper left, blue squared-off lower left stem, tall blue vertical stem in middle, blue horizontal top arm extending right and blue horizontal middle crossbar. It should remain recognizably the same abstract IF monogram. Give the mark softly bevelled extruded 3D depth, cobalt blue body, subtle icy cyan lit edges, glossy red spherical dot. Premium modern dimensional app icon material like Microsoft Azure or Teams but original Infocus geometry. Front facing slight three-quarter perspective. Isolated centered mark, actual transparent background. No enclosing square, no additional shapes, no text or watermark.

### Industry atlas

Use case: stylized-concept. Create a production sprite sheet of TEN premium enterprise industry 3D illustrations, arranged in a STRICT GRID: FIVE equal width columns, TWO equal height rows. Overall landscape 5:2 aspect ratio. All ten cells square, equal size, cleanly separated by empty margins, no lines. Each has identical solid deep navy #071121 background. Each cell contains one centered isometric miniature architectural vignette made from matte silver, translucent ice-blue glass and luminous cobalt, realistic soft studio lighting and premium product render quality. Top row left to right: 1) financial bank headquarters with classical columns and modern towers; 2) modern hospital with a medical plus; 3) university building with books; 4) oil refinery plant with pipelines; 5) manufacturing factory with robot arm. Bottom row left to right: 6) agricultural field terraces and glass greenhouse; 7) telecommunications antenna tower with orbital signal rings; 8) contemporary retail storefront with shopping bag; 9) futuristic car in automotive assembly; 10) media film camera and broadcasting studio. Every object fits completely inside its own square with 15 percent empty margin. Consistent isometric camera and scale across all ten. Exquisite smooth three-dimensional modelling, crisp geometry, subtle shadows, calm luxurious technology aesthetic. Absolutely no words, letters, captions, text or watermark.


## Revision: native logo, original imagery and vendor identities

The live brand mark is now an SVG/GSAP drawing animation from `components/InfocusLogoAnimation.tsx`, with shared path geometry in `lib/logo.ts`. It replaces the generated logo in the website. The user's supplied purple INFOCUS wordmark was cropped to its lettering with a small glow margin and resized to `public/brand/infocus-wordmark.png`. See `LOGO-ANIMATION.md` for all native animation exports.

Oracle uses the existing `par-or (4).webp`, trimmed without redrawing to `public/brands/oracle.webp`. AWS, Azure, Google Cloud, Salesforce and OpenStack SVGs come from the [Devicon project](https://github.com/devicons/devicon), with individual download sources recorded in `public/brands/sources.json`. SAP uses its SVG silhouette from [Simple Icons](https://simpleicons.org/). Microsoft's four-colour mark is rendered as SVG geometry. These identify the platforms discussed; they do not assert partner certification.

Brand reference resources: [Oracle logos](https://www.oracle.com/legal/logos/), [AWS architecture icons](https://aws.amazon.com/architecture/icons/), [Microsoft Azure icons](https://learn.microsoft.com/en-us/azure/architecture/icons/).

Original photos, logos and icons are preserved in `images/` and `public/images/`. The revision reuses the original Oracle diagram, operations/team photos, office-location illustrations, industry icons and company network logos in their relevant sections. The generated cloud/architecture illustrations remain in the optional night hero and transformation story.
