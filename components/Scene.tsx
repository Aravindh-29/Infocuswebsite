"use client";
import { useRef, useEffect, useState } from "react";
import { offices } from "@/lib/content";
export default function Scene({
  variant = "globe",
  active = 0,
}: {
  variant?: "globe" | "network";
  active?: number;
}) {
  const host = useRef<HTMLDivElement>(null),
    selected = useRef(active);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    selected.current = active;
  }, [active]);
  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let dispose = () => {},
      gone = false;
    const observer = new IntersectionObserver(
      async (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        try {
          const T = await import("three");
          if (gone) return;
          const reduced = matchMedia(
            "(prefers-reduced-motion: reduce)",
          ).matches;
          const scene = new T.Scene();
          const renderer = new T.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "low-power",
          });
          renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
          container.appendChild(renderer.domElement);
          const camera = new T.PerspectiveCamera(38, 1, 0.1, 100);
          camera.position.set(0, 0, 7.6);
          const group = new T.Group();
          scene.add(group);
          const resources: { dispose: () => void }[] = [];
          function mat(color: number, opacity = 1) {
            const m = new T.MeshBasicMaterial({
              color,
              transparent: opacity < 1,
              opacity,
            });
            resources.push(m);
            return m;
          }
          function mesh(
            g:
              | InstanceType<typeof T.SphereGeometry>
              | InstanceType<typeof T.BoxGeometry>
              | InstanceType<typeof T.TorusGeometry>,
            m: InstanceType<typeof T.Material>,
          ) {
            resources.push(g);
            const o = new T.Mesh(g, m);
            group.add(o);
            return o;
          }
          function location(lat: number, lon: number, r = 2) {
            const a = ((90 - lat) * Math.PI) / 180,
              b = ((lon + 180) * Math.PI) / 180;
            return new T.Vector3(
              -r * Math.sin(a) * Math.cos(b),
              r * Math.cos(a),
              r * Math.sin(a) * Math.sin(b),
            );
          }
          const markers: InstanceType<typeof T.Mesh>[] = [];
          if (variant === "globe") {
            const sphere = mesh(new T.SphereGeometry(2, 40, 28), mat(0x07182e));
            const wire = new T.WireframeGeometry(
              new T.SphereGeometry(2.01, 32, 20),
            );
            resources.push(wire);
            const wm = new T.LineBasicMaterial({
              color: 0x184e80,
              transparent: true,
              opacity: 0.24,
            });
            resources.push(wm);
            group.add(new T.LineSegments(wire, wm));
            const continents = [
              [
                [-168, 70],
                [-130, 72],
                [-55, 50],
                [-82, 10],
                [-110, 25],
                [-130, 50],
              ],
              [
                [-80, 12],
                [-48, -3],
                [-35, -15],
                [-70, -56],
              ],
              [
                [-18, 35],
                [10, 38],
                [52, 12],
                [32, -35],
                [16, -35],
                [-10, 5],
              ],
              [
                [-10, 36],
                [-10, 60],
                [35, 72],
                [90, 75],
                [180, 62],
                [145, 35],
                [108, 5],
                [75, 8],
                [45, 35],
              ],
              [
                [112, -10],
                [154, -10],
                [150, -38],
                [115, -35],
              ],
              [
                [-52, 60],
                [-20, 82],
                [-55, 82],
                [-70, 65],
              ],
            ];
            function inside(x: number, y: number, p: number[][]) {
              let c = false;
              for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
                if (
                  p[i][1] > y !== p[j][1] > y &&
                  x <
                    ((p[j][0] - p[i][0]) * (y - p[i][1])) /
                      (p[j][1] - p[i][1]) +
                      p[i][0]
                )
                  c = !c;
              }
              return c;
            }
            const dots: number[] = [];
            for (let lat = -60; lat < 82; lat += 2.6)
              for (let lon = -180; lon < 180; lon += 2.6) {
                if (continents.some((p) => inside(lon, lat, p)))
                  dots.push(...location(lat, lon, 2.025).toArray());
              }
            const dg = new T.BufferGeometry();
            dg.setAttribute("position", new T.Float32BufferAttribute(dots, 3));
            const dm = new T.PointsMaterial({
              color: 0x4b9bd6,
              size: 0.025,
              transparent: true,
              opacity: 0.8,
            });
            resources.push(dg, dm);
            group.add(new T.Points(dg, dm));
            offices.forEach((office, i) => {
              const point = mesh(
                new T.SphereGeometry(0.055, 12, 12),
                mat(i === active ? 0xffffff : 0x53d9ff),
              );
              point.position.copy(location(office.lat, office.lon, 2.06));
              markers.push(point);
              if (i) {
                const a = location(offices[0].lat, offices[0].lon, 2.08),
                  b = point.position.clone(),
                  mid = a.clone().add(b).normalize().multiplyScalar(2.9);
                const curve = new T.QuadraticBezierCurve3(a, mid, b);
                const g = new T.BufferGeometry().setFromPoints(
                  curve.getPoints(60),
                );
                const m = new T.LineBasicMaterial({
                  color: 0x2ca6ff,
                  transparent: true,
                  opacity: 0.6,
                });
                resources.push(g, m);
                group.add(new T.Line(g, m));
              }
            });
            sphere.renderOrder = -1;
            group.rotation.z = 0.08;
          } else {
            for (let i = 0; i < 14; i++) {
              const a = (i / 14) * Math.PI * 2,
                r = 1.4 + (i % 3) * 0.3;
              const o = mesh(
                new T.BoxGeometry(0.13, 0.13, 0.13),
                mat(i % 2 ? 0x38c9ff : 0x6186ff, 0.85),
              );
              o.position.set(
                Math.cos(a) * r,
                Math.sin(a) * r * 0.6,
                ((i % 4) - 0.5) * 0.3,
              );
            }
            for (let i = 0; i < 3; i++) {
              const ring = mesh(
                new T.TorusGeometry(1.6 + i * 0.28, 0.008, 6, 96),
                mat(0x3f9fff, 0.35),
              );
              ring.rotation.x = 1.1 + i * 0.12;
              ring.rotation.y = i * 0.2;
            }
            group.position.x = 0.2;
          }
          let pointerX = 0,
            pointerY = 0;
          const move = (e: PointerEvent) => {
            const b = container.getBoundingClientRect();
            pointerX = (e.clientX - b.left) / b.width - 0.5;
            pointerY = (e.clientY - b.top) / b.height - 0.5;
          };
          container.addEventListener("pointermove", move);
          const resize = new ResizeObserver(() => {
            const { width, height } = container.getBoundingClientRect();
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
          });
          resize.observe(container);
          let frame = 0,
            t = 0,
            lastFrame = 0,
            visible = true;
          const visibility = new IntersectionObserver((e) => {
            visible = e[0].isIntersecting;
          });
          visibility.observe(container);
          function draw(now = 0) {
            if (gone) return;
            frame = requestAnimationFrame(draw);
            if (!visible || document.hidden || now - lastFrame < 33) return;
            lastFrame = now;
            t += 0.01;
            if (variant === "globe") {
              const target =
                (-offices[selected.current].lon * Math.PI) / 180 - Math.PI / 2;
              group.rotation.y +=
                (target + pointerX * 0.3 - group.rotation.y) * 0.025;
              group.rotation.x +=
                (-0.12 + pointerY * 0.15 - group.rotation.x) * 0.03;
              markers.forEach((m, i) => {
                m.scale.setScalar(
                  i === selected.current
                    ? reduced
                      ? 1.6
                      : 1.5 + Math.sin(t * 8) * 0.3
                    : 1,
                );
              });
            } else if (!reduced) {
              group.rotation.y = pointerX * 0.3 + t * 0.12;
              group.rotation.x = pointerY * 0.15;
              group.position.y = Math.sin(t) * 0.06;
            }
            renderer.render(scene, camera);
          }
          draw();
          dispose = () => {
            cancelAnimationFrame(frame);
            resize.disconnect();
            visibility.disconnect();
            container.removeEventListener("pointermove", move);
            resources.forEach((r) => r.dispose());
            renderer.dispose();
            renderer.domElement.remove();
          };
        } catch {
          setFailed(true);
        }
      },
      { rootMargin: "150px" },
    );
    observer.observe(container);
    return () => {
      gone = true;
      observer.disconnect();
      dispose();
    };
  }, [variant]);
  return (
    <div
      ref={host}
      className={"webgl " + variant}
      aria-label={
        variant === "globe"
          ? "Interactive globe showing Infocus office locations"
          : "Animated connected technology network"
      }
      role="img"
    >
      {failed && (
        <div className="scene-fallback">
          ◎
          <span>
            {variant === "globe"
              ? "Connected across four countries"
              : "Connected technology. Shared possibilities."}
          </span>
        </div>
      )}
    </div>
  );
}
