# Custom image assets

All four new assets were generated with the built-in ImageGen tool for this redesign. No external paid stock or Spline subscription is required. Generated illustrations are conceptual, not photographs of client projects or offices. The original brand image was used as the logo reference.

| Asset | Purpose | Final project path |
| --- | --- | --- |
| Glass cloud | Hero and cloud capability | `public/images/cloud-hero.webp` |
| Application architecture | Integration section and Oracle pages | `public/images/integration.webp` |
| IF monogram (v1 archive) | Previous design; no live usage | `public/images/logo-3d.png`, `app/icon.png` |
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

The current live brand uses only the uploaded INFOCUS lettering through `components/InfocusWordmarkAnimation.tsx`. Seven clipped letters animate with GSAP, then settle into a subtle gold shimmer. The previous generated and native IF monograms are retained only as v1 references. The user's supplied purple INFOCUS wordmark was cropped to its lettering with a small glow margin and resized to `public/brand/infocus-wordmark.png`. See `LOGO-ANIMATION.md` for all native animation exports.

Oracle uses the existing `par-or (4).webp`, trimmed without redrawing to `public/brands/oracle.webp`. AWS, Azure, Google Cloud, Salesforce and OpenStack SVGs come from the [Devicon project](https://github.com/devicons/devicon), with individual download sources recorded in `public/brands/sources.json`. SAP uses its SVG silhouette from [Simple Icons](https://simpleicons.org/). Microsoft's four-colour mark is rendered as SVG geometry. These identify the platforms discussed; they do not assert partner certification.

Brand reference resources: [Oracle logos](https://www.oracle.com/legal/logos/), [AWS architecture icons](https://aws.amazon.com/architecture/icons/), [Microsoft Azure icons](https://learn.microsoft.com/en-us/azure/architecture/icons/).

Original photos, logos and icons are preserved in `images/` and `public/images/`. The revision reuses the original Oracle diagram, operations/team photos, office-location illustrations, industry icons and company network logos in their relevant sections. The generated cloud/architecture illustrations appear in the hero and transformation story in both light and dark modes. Theme changes do not change the content or imagery.

## Approved immersive cloud hero

The approved light-mode concept is preserved at `output/approved-hero-concept.png`. The live site uses native text and links; it does not use a screenshot of the mockup as its interface.

`public/images/hero-cloud-light.png` is the isolated central cloud generated with the built-in ImageGen tool from the approved concept. It is a 1536×1024 RGBA PNG with verified transparency. The final production-asset prompt is in `output/cloud-asset-prompt.txt`. The cloud, silver pedestal, energy paths, provider nodes and page typography are separate layers so they can respond to interaction.

The original dark glass cloud remains available for the transformation story and other relevant content. The new hero uses the same isolated cloud and platform identities in both colour modes. SVG energy and flash effects are clipped using the cloud's alpha mask; the effect does not flash the page background. AWS, Azure, Oracle and Google Cloud identities use the existing local vendor assets.

## Deepu assistant avatar

`public/images/deepu-avatar.png` is an original generated male business-assistant portrait in a navy suit, white shirt and blue tie. The built-in ImageGen tool created the 1254×1254 RGBA PNG with a transparent background. The selected asset is copied into the project; the original generation is preserved. The production prompt is saved at `output/deepu-avatar-prompt.txt`. This fictional avatar appears in the launcher, welcome and chat header.

The short popup chime is synthesized locally with Web Audio. There is no spoken greeting or use of speech synthesis, and no externally hosted audio file is needed.

## Services diagrams

The Services page uses the existing local Oracle, Azure, AWS and Google Cloud vendor marks. Its landing-zone, high-availability and recovery diagrams are native HTML/CSS/SVG illustrations; application, website, mobile, database and support diagrams are native illustrations too. No stock architecture screenshot or newly generated bitmap is required. Official architecture references are recorded in `lib/service-catalog.ts` under `serviceArchitectureSources`.

The Full-stack & enterprise applications card uses an original native SVG illustration in `components/EnterpriseApplicationVisual.tsx`, styled by `app/enterprise-artwork.css`. Desktop and mobile interfaces connect to APIs, workflows, a database and ERP/CRM/HCM tiles. This is an illustrative interface, not a customer screenshot, and uses no external image asset.

## Contact partnership image

`public/images/contact-partnership.png` is an original photorealistic image created with built-in ImageGen: two smiling business professionals shaking hands, one in a navy suit and one in a light-blue blazer. The 1536×1024 RGBA asset has a true transparent background; the production page preserves its alpha and softly feathers the bottom edge with CSS, with no photo frame or opaque rectangle. Both themes use the same image. The exact generation prompt is saved in `output/contact-partnership-prompt.txt`; the original remains under the session's generated_images directory as `exec-be43a5b4-8f59-4461-ad88-8499258eabea.png`.

## Globe geography: Natural Earth

The live globe's real coastlines, country boundaries and land mask come from [Natural Earth 1:50m Admin 0 countries](https://www.naturalearthdata.com/downloads/50m-cultural-vectors/50m-admin-0-countries-2/). Natural Earth's [official terms](https://www.naturalearthdata.com/about/terms-of-use/) place its raster and vector data in the public domain and permit modification and commercial use. The source uses Natural Earth's default de facto boundary representation.

The pinned source is the project's [maintainer repository GeoJSON at tag v5.1.2](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_50m_admin_0_countries.geojson), containing the Admin 0 country layer version 5.1.1. Source SHA-256: `3e458fc036ad0a66411f2c1e6cac49c5d7bfb81cb1123bc513b22511a2b7fdeb`.

`scripts/build-globe-map.mjs` processes the original polygon rings into `lib/globe-map-data.json`: 0.09-degree outline simplification, 0.01-degree coordinate quantization, and a land-only, approximately equal-spaced dot grid sampled against the original polygons and their holes. Small islands are retained. The 320,250-byte local data file contains 1,632 rings, 24,896 boundary vertices and 4,435 land points. The builder verifies land classification for Hyderabad, Singapore, Petaling Jaya and Newark, and ocean classification at two open-ocean locations. The original download is cached under `output/map-source/` for reproducibility; the runtime requires only the bundled processed file and makes no map CDN requests.

`lib/globe-map.ts` constructs four rendering layers from this local asset: a shaded navy sphere, a subtle triangulated mesh, cyan country/coastline segments and land dots. Long outline segments are subdivided along the sphere, shared borders are deduplicated where their endpoints match, and all geometries/materials are registered with the scene's disposal list. Coordinates use the same geographic frame as the existing office pins. Made with Natural Earth.
