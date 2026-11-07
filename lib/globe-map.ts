import globeMap from "./globe-map-data.json";

type Disposable = { dispose: () => void };
type Coordinate = [number, number, number];

// Same geographic frame as Scene's office markers: Greenwich is +X,
// north is +Y, and eastward longitude turns toward -Z.
function coordinate(
  longitude: number,
  latitude: number,
  radius = 1,
): Coordinate {
  const lon = (longitude * Math.PI) / 180;
  const lat = (latitude * Math.PI) / 180;
  const parallel = Math.cos(lat) * radius;
  return [
    parallel * Math.cos(lon),
    Math.sin(lat) * radius,
    -parallel * Math.sin(lon),
  ];
}

/** Adds the bundled Natural Earth basemap; the caller owns rotation and pins. */
export function addGlobeMap(
  THREE: typeof import("three"),
  group: import("three").Group,
  resources: Disposable[],
): void {
  const map = new THREE.Group();
  map.name = "natural-earth-globe-map";
  map.userData.source = globeMap.provenance.name;
  group.add(map);

  const sphereGeometry = new THREE.SphereGeometry(2, 64, 40);
  const sphereMaterial = new THREE.ShaderMaterial({
    uniforms: {
      deepColor: { value: new THREE.Color(0x050e1d) },
      bodyColor: { value: new THREE.Color(0x15354e) },
      edgeColor: { value: new THREE.Color(0x167496) },
    },
    vertexShader: `
      varying vec3 surfaceNormal;
      varying vec3 towardViewer;
      void main() {
        vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
        surfaceNormal = normalize(normalMatrix * normal);
        towardViewer = -viewPosition.xyz;
        gl_Position = projectionMatrix * viewPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 deepColor;
      uniform vec3 bodyColor;
      uniform vec3 edgeColor;
      varying vec3 surfaceNormal;
      varying vec3 towardViewer;
      void main() {
        vec3 normal = normalize(surfaceNormal);
        float facing = clamp(dot(normal, normalize(towardViewer)), 0.0, 1.0);
        float illumination = max(0.0, dot(normal, normalize(vec3(-0.45, 0.65, 1.0))));
        float edge = pow(1.0 - facing, 3.2);
        vec3 color = mix(deepColor, bodyColor, 0.2 + illumination * 0.52);
        color = mix(color, edgeColor, edge * 0.48);
        gl_FragColor = vec4(color, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
    depthWrite: true,
  });
  resources.push(sphereGeometry, sphereMaterial);
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.name = "globe-navy-surface";
  sphere.renderOrder = -2;
  map.add(sphere);

  const triangulation = new THREE.IcosahedronGeometry(2.008, 4);
  const wireGeometry = new THREE.WireframeGeometry(triangulation);
  const triangleEdges = wireGeometry.getAttribute("position");
  const curvedEdges: number[] = [];
  for (let index = 0; index < triangleEdges.count; index += 2) {
    const start = new THREE.Vector3()
      .fromBufferAttribute(triangleEdges, index)
      .normalize();
    const end = new THREE.Vector3()
      .fromBufferAttribute(triangleEdges, index + 1)
      .normalize();
    const angle = Math.acos(Math.max(-1, Math.min(1, start.dot(end))));
    const segments = Math.max(1, Math.ceil(angle / (Math.PI / 180)));
    const append = (fraction: number) => {
      const x = start.x + (end.x - start.x) * fraction;
      const y = start.y + (end.y - start.y) * fraction;
      const z = start.z + (end.z - start.z) * fraction;
      const scale = 2.008 / Math.hypot(x, y, z);
      curvedEdges.push(x * scale, y * scale, z * scale);
    };
    for (let segment = 0; segment < segments; segment++) {
      append(segment / segments);
      append((segment + 1) / segments);
    }
  }
  // Straight icosahedron chords cut through the opaque globe. Short projected
  // segments keep the complete triangular grid above its surface instead.
  wireGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(curvedEdges, 3),
  );
  const wireMaterial = new THREE.LineBasicMaterial({
    color: 0x397d9f,
    transparent: true,
    opacity: 0.16,
    depthTest: true,
    depthWrite: false,
  });
  resources.push(triangulation, wireGeometry, wireMaterial);
  const wire = new THREE.LineSegments(wireGeometry, wireMaterial);
  wire.name = "globe-triangulated-grid";
  map.add(wire);

  const boundaryPositions: number[] = [];
  const usedEdges = new Set<string>();
  for (const ring of globeMap.lines) {
    for (let index = 2; index < ring.length; index += 2) {
      const firstKey = `${ring[index - 2]},${ring[index - 1]}`;
      const secondKey = `${ring[index]},${ring[index + 1]}`;
      const edgeKey =
        firstKey < secondKey
          ? `${firstKey}|${secondKey}`
          : `${secondKey}|${firstKey}`;
      if (firstKey === secondKey || usedEdges.has(edgeKey)) continue;
      usedEdges.add(edgeKey);
      const start = coordinate(
        ring[index - 2] / globeMap.scale,
        ring[index - 1] / globeMap.scale,
      );
      const end = coordinate(
        ring[index] / globeMap.scale,
        ring[index + 1] / globeMap.scale,
      );
      const dot = start[0] * end[0] + start[1] * end[1] + start[2] * end[2];
      const angle = Math.acos(Math.max(-1, Math.min(1, dot)));
      if (angle < 0.000001) continue;
      // Subdivide long political borders so their chords never sink into the sphere.
      const segments = Math.max(1, Math.ceil(angle / (Math.PI / 120)));
      const append = (fraction: number) => {
        const x = start[0] + (end[0] - start[0]) * fraction;
        const y = start[1] + (end[1] - start[1]) * fraction;
        const z = start[2] + (end[2] - start[2]) * fraction;
        const scale = 2.022 / Math.hypot(x, y, z);
        boundaryPositions.push(x * scale, y * scale, z * scale);
      };
      for (let segment = 0; segment < segments; segment++) {
        append(segment / segments);
        append((segment + 1) / segments);
      }
    }
  }
  const boundaryGeometry = new THREE.BufferGeometry();
  boundaryGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(boundaryPositions, 3),
  );
  const boundaryMaterial = new THREE.LineBasicMaterial({
    color: 0x67ddfa,
    transparent: true,
    opacity: 0.88,
    blending: THREE.AdditiveBlending,
    depthTest: true,
    depthWrite: false,
    toneMapped: false,
  });
  resources.push(boundaryGeometry, boundaryMaterial);
  const boundaries = new THREE.LineSegments(boundaryGeometry, boundaryMaterial);
  boundaries.name = "globe-country-coastlines";
  boundaries.renderOrder = 1;
  map.add(boundaries);

  const landPositions: number[] = [];
  for (let index = 0; index < globeMap.dots.length; index += 2) {
    landPositions.push(
      ...coordinate(
        globeMap.dots[index] / globeMap.scale,
        globeMap.dots[index + 1] / globeMap.scale,
        2.017,
      ),
    );
  }
  const landGeometry = new THREE.BufferGeometry();
  landGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(landPositions, 3),
  );
  const landMaterial = new THREE.PointsMaterial({
    color: 0x509dbb,
    size: 0.017,
    transparent: true,
    opacity: 0.62,
    depthTest: true,
    depthWrite: false,
    sizeAttenuation: true,
  });
  resources.push(landGeometry, landMaterial);
  const land = new THREE.Points(landGeometry, landMaterial);
  land.name = "globe-land-dots";
  map.add(land);
}
