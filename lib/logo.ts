export const LOGO_PATH =
  "M 334 88 H 162 Q 148 88 148 102 V 326 Q 148 340 134 340 H 62 Q 48 340 48 326 V 212 Q 48 198 62 198 H 280";
export function logoSvgMarkup(id = "infocus") {
  return `<defs>
<linearGradient id="${id}-stroke" x1="280" y1="70" x2="50" y2="350" gradientUnits="userSpaceOnUse"><stop stop-color="#1887ee"/><stop offset=".3" stop-color="#22c8e5"/><stop offset=".62" stop-color="#3465ee"/><stop offset=".83" stop-color="#8455e5"/><stop offset="1" stop-color="#c045c7"/></linearGradient>
<linearGradient id="${id}-edge" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d9fbff" stop-opacity=".9"/><stop offset=".5" stop-color="#b4ebff" stop-opacity=".12"/><stop offset="1" stop-color="#f8d5ff" stop-opacity=".65"/></linearGradient>
<radialGradient id="${id}-orb" cx="30%" cy="22%" r="80%"><stop stop-color="#fff6c9"/><stop offset=".22" stop-color="#ffd06e"/><stop data-sphere-color="true" offset=".52" stop-color="#f18b18"/><stop offset="1" stop-color="#6f230a"/></radialGradient>
<radialGradient id="${id}-gloss"><stop stop-color="white" stop-opacity=".95"/><stop offset="1" stop-color="white" stop-opacity="0"/></radialGradient>
<linearGradient id="${id}-shine"><stop stop-color="#fff" stop-opacity="0"/><stop offset=".4" stop-color="#ffe8a1" stop-opacity="0"/><stop offset=".5" stop-color="#fff2bd" stop-opacity=".95"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<filter id="${id}-shadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="2" dy="6" stdDeviation="3" flood-color="#123776" flood-opacity=".28"/></filter>
<mask id="${id}-mask"><path d="${LOGO_PATH}" fill="none" stroke="white" stroke-width="27" stroke-linecap="round" stroke-linejoin="round"/></mask></defs>
<g filter="url(#${id}-shadow)"><path data-draw="true" d="${LOGO_PATH}" fill="none" stroke="#233fa3" stroke-width="30" stroke-linecap="round" stroke-linejoin="round" transform="translate(1 4)"/><path data-draw="true" d="${LOGO_PATH}" fill="none" stroke="url(#${id}-stroke)" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/><path data-draw="true" d="${LOGO_PATH}" fill="none" stroke="url(#${id}-edge)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" transform="translate(-4 -5)"/></g>
<g mask="url(#${id}-mask)"><rect data-shine="true" x="-180" y="55" width="120" height="315" fill="url(#${id}-shine)" transform="skewX(-18)" opacity="0"/></g>
<g data-sphere="true" style="transform-origin:64px 110px"><circle cx="64" cy="110" r="30" fill="url(#${id}-orb)" filter="url(#${id}-shadow)"/><ellipse cx="54" cy="96" rx="15" ry="10" fill="url(#${id}-gloss)" transform="rotate(-30 54 96)"/><path d="M43 114 A22 22 0 0 0 72 132" fill="none" stroke="#ffc86a" stroke-width="1.5" opacity=".6"/></g>`;
}
export function staticLogoSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 420" width="1600" height="1680" role="img" aria-label="Infocus continuous IF monogram">${logoSvgMarkup("infocus-static")}</svg>`;
}
