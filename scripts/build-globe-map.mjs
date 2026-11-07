// Natural Earth is public domain. See ASSETS.md for primary sources/provenance.
// Re-run with `node scripts/build-globe-map.mjs [optional-local-geojson]`.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceUrl =
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_50m_admin_0_countries.geojson";
const sourcePath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(root, "output", "map-source", "ne_50m_admin_0_countries.geojson");
let bytes;
try {
  bytes = await fs.readFile(sourcePath);
} catch {
  if (process.argv[2]) throw new Error(`Source file not found: ${sourcePath}`);
  const response = await fetch(sourceUrl);
  if (!response.ok)
    throw new Error(`Natural Earth download failed: ${response.status}`);
  bytes = Buffer.from(await response.arrayBuffer());
  await fs.mkdir(path.dirname(sourcePath), { recursive: true });
  await fs.writeFile(sourcePath, bytes);
}
const source = JSON.parse(bytes.toString("utf8"));
const tolerance = 0.09;
const polygons = source.features.flatMap((feature) =>
  feature.geometry.type === "Polygon"
    ? [feature.geometry.coordinates]
    : feature.geometry.coordinates,
);

function sqSegmentDistance(point, start, end) {
  let x = start[0],
    y = start[1],
    dx = end[0] - x,
    dy = end[1] - y;
  if (dx || dy) {
    const t = ((point[0] - x) * dx + (point[1] - y) * dy) / (dx * dx + dy * dy);
    if (t >= 1) {
      x = end[0];
      y = end[1];
    } else if (t > 0) {
      x += dx * t;
      y += dy * t;
    }
  }
  return (point[0] - x) ** 2 + (point[1] - y) ** 2;
}
function simplify(points) {
  if (points.length <= 2) return points;
  const keep = new Set([0, points.length - 1]);
  const pending = [[0, points.length - 1]];
  while (pending.length) {
    const [start, end] = pending.pop();
    let farthest = -1,
      distance = tolerance ** 2;
    for (let i = start + 1; i < end; i++) {
      const candidate = sqSegmentDistance(
        points[i],
        points[start],
        points[end],
      );
      if (candidate > distance) {
        farthest = i;
        distance = candidate;
      }
    }
    if (farthest !== -1) {
      keep.add(farthest);
      pending.push([start, farthest], [farthest, end]);
    }
  }
  return [...keep].sort((a, b) => a - b).map((index) => points[index]);
}
function compactRing(ring) {
  // Unwrap only for simplification; restore signed longitudes for globe storage.
  const unwrapped = ring.map((point) => [...point]);
  for (let i = 1; i < unwrapped.length; i++) {
    while (unwrapped[i][0] - unwrapped[i - 1][0] > 180) unwrapped[i][0] -= 360;
    while (unwrapped[i][0] - unwrapped[i - 1][0] < -180) unwrapped[i][0] += 360;
  }
  const half = Math.floor((unwrapped.length - 1) / 2);
  let reduced = [
    ...simplify(unwrapped.slice(0, half + 1)).slice(0, -1),
    ...simplify(unwrapped.slice(half)),
  ];
  // Keep small islands, including Singapore, even when their footprint is tiny.
  if (reduced.length < 4) reduced = unwrapped;
  return reduced.flatMap(([lon, lat]) => [
    Math.round((((((lon + 180) % 360) + 360) % 360) - 180) * 100),
    Math.round(lat * 100),
  ]);
}
function insideRing(lon, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i],
      b = ring[j];
    if (
      a[1] > lat !== b[1] > lat &&
      lon < ((b[0] - a[0]) * (lat - a[1])) / (b[1] - a[1]) + a[0]
    )
      inside = !inside;
  }
  return inside;
}
const bounded = polygons.map((rings) => {
  let west = 180,
    east = -180,
    south = 90,
    north = -90;
  for (const [x, y] of rings[0]) {
    west = Math.min(west, x);
    east = Math.max(east, x);
    south = Math.min(south, y);
    north = Math.max(north, y);
  }
  return { rings, west, east, south, north };
});
function onLand(lon, lat) {
  return bounded.some(
    (polygon) =>
      lon >= polygon.west &&
      lon <= polygon.east &&
      lat >= polygon.south &&
      lat <= polygon.north &&
      insideRing(lon, lat, polygon.rings[0]) &&
      !polygon.rings.slice(1).some((ring) => insideRing(lon, lat, ring)),
  );
}
const dots = [];
for (let row = 0, lat = -88.8; lat <= 85.5; row++, lat += 1.65) {
  const step = 1.65 / Math.max(0.15, Math.cos((lat * Math.PI) / 180));
  for (let lon = -180 + ((row % 2) * step) / 2; lon < 180; lon += step) {
    if (onLand(lon, lat))
      dots.push(Math.round(lon * 100), Math.round(lat * 100));
  }
}
const lines = polygons
  .flatMap((rings) => rings.map(compactRing))
  .filter((line) => line.length >= 8);
const data = {
  scale: 100,
  lines,
  dots,
  provenance: {
    name: "Natural Earth 1:50m Admin 0 countries",
    release: "5.1.2 repository tag / countries 5.1.1",
    source: sourceUrl,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    countries: source.features.length,
    simplificationDegrees: tolerance,
    dotSpacingDegrees: 1.65,
  },
};
const target = path.join(root, "lib", "globe-map-data.json");
await fs.writeFile(target, JSON.stringify(data));
const checks = [
  { name: "Hyderabad", lon: 78.48, lat: 17.38, land: true },
  { name: "Singapore", lon: 103.85, lat: 1.3, land: true },
  { name: "Petaling Jaya", lon: 101.64, lat: 3.1, land: true },
  { name: "Newark", lon: -75.75, lat: 39.68, land: true },
  { name: "Pacific", lon: -140, lat: 0, land: false },
  { name: "Indian Ocean", lon: 80, lat: -20, land: false },
].map((check) => ({ ...check, actual: onLand(check.lon, check.lat) }));
if (checks.some((check) => check.actual !== check.land))
  throw new Error(`Land-mask verification failed: ${JSON.stringify(checks)}`);
console.log(
  JSON.stringify(
    {
      target,
      bytes: (await fs.stat(target)).size,
      rings: lines.length,
      boundaryVertices: lines.reduce((sum, line) => sum + line.length / 2, 0),
      landDots: dots.length / 2,
      checks,
      provenance: data.provenance,
    },
    null,
    2,
  ),
);
