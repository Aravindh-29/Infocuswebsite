"use client";
import { useRef, useEffect, useState, useId } from "react";
import { offices } from "@/lib/content";
export default function Scene({
  variant = "globe",
  active = 0,
  autoRotate = true,
}: {
  variant?: "globe" | "network";
  active?: number;
  autoRotate?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null),
    selected = useRef(active),
    automatic = useRef(autoRotate);
  const [failed, setFailed] = useState(false);
  const instructionsId = useId();
  useEffect(() => {
    selected.current = active;
  }, [active]);
  useEffect(() => {
    automatic.current = autoRotate;
  }, [autoRotate]);
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
          const globeMap =
            variant === "globe" ? await import("@/lib/globe-map") : null;
          if (gone) return;
          const motionPreference = matchMedia(
            "(prefers-reduced-motion: reduce)",
          );
          let reduced = motionPreference.matches;
          const motionChanged = () => {
            reduced = motionPreference.matches;
          };
          const scene = new T.Scene();
          const renderer = new T.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "low-power",
          });
          const resources: { dispose: () => void }[] = [];
          const cleanups: (() => void)[] = [
            () => {
              renderer.dispose();
              renderer.domElement.remove();
            },
          ];
          // Register cleanup before setup: a failed map/shader must also release
          // the partial scene before the accessible fallback is shown.
          dispose = () => {
            for (const cleanup of cleanups.splice(0).reverse()) {
              try {
                cleanup();
              } catch {
                /* Continue releasing remaining resources. */
              }
            }
            for (const resource of resources.splice(0)) {
              try {
                resource.dispose();
              } catch {
                /* Dispose every remaining resource. */
              }
            }
          };
          renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
          container.appendChild(renderer.domElement);
          const camera = new T.PerspectiveCamera(38, 1, 0.1, 100);
          camera.position.set(0, 0, 7.6);
          const group = new T.Group();
          scene.add(group);
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
          const markers: InstanceType<typeof T.Sprite>[] = [];
          const pinTextures: InstanceType<typeof T.CanvasTexture>[] = [];
          const markerWorld = new T.Vector3();
          const markerView = new T.Vector3();
          if (variant === "globe") {
            // Shared red/green textures keep each office state crisp and glossy.
            // The sprite's lower tip, rather than its centre, marks the location.
            function createPinTexture(highlighted: boolean) {
              const pinCanvas = document.createElement("canvas");
              pinCanvas.width = 256;
              pinCanvas.height = 320;
              const ink = pinCanvas.getContext("2d");
              if (!ink)
                throw new Error("Unable to create office marker texture");
              ink.scale(2, 2);
              const pinShape = new Path2D(
                "M64 150C58 138 24 91 19 67C12 37 32 10 61 9C89 7 114 29 111 57C109 82 79 128 64 150Z",
              );
              const body = ink.createLinearGradient(31, 15, 95, 145);
              body.addColorStop(0, highlighted ? "#78f0aa" : "#ff545b");
              body.addColorStop(0.32, highlighted ? "#28cb73" : "#f12634");
              body.addColorStop(0.7, highlighted ? "#0c9d4d" : "#df1023");
              body.addColorStop(1, highlighted ? "#066d38" : "#a90c20");
              ink.shadowColor = highlighted ? "#053e2238" : "#470b2238";
              ink.shadowBlur = 5;
              ink.shadowOffsetY = 2;
              ink.fillStyle = body;
              ink.fill(pinShape);
              ink.shadowColor = "transparent";
              ink.lineWidth = 1.2;
              ink.strokeStyle = highlighted ? "#087d43" : "#bc1728";
              ink.stroke(pinShape);
              ink.beginPath();
              ink.moveTo(27, 43);
              ink.bezierCurveTo(32, 22, 54, 13, 75, 18);
              ink.bezierCurveTo(88, 21, 98, 29, 102, 40);
              ink.strokeStyle = "#ffffff70";
              ink.lineWidth = 3.5;
              ink.lineCap = "round";
              ink.stroke();
              const inset = ink.createRadialGradient(57, 43, 3, 64, 51, 21);
              inset.addColorStop(0, "#ffffff");
              inset.addColorStop(0.8, "#fffdfd");
              inset.addColorStop(1, highlighted ? "#e4f9e8" : "#f9e3e5");
              ink.beginPath();
              ink.arc(64, 51, 20.5, 0, Math.PI * 2);
              ink.fillStyle = inset;
              ink.fill();
              ink.strokeStyle = highlighted ? "#087d43" : "#be132b";
              ink.lineWidth = 1.1;
              ink.stroke();
              const pinTexture = new T.CanvasTexture(pinCanvas);
              pinTexture.colorSpace = T.SRGBColorSpace;
              resources.push(pinTexture);
              return pinTexture;
            }
            pinTextures.push(createPinTexture(false), createPinTexture(true));
            globeMap!.addGlobeMap(T, group, resources);
            offices.forEach((office, i) => {
              const pinMaterial = new T.SpriteMaterial({
                map: pinTextures[i === selected.current ? 1 : 0],
                transparent: true,
                opacity: i === selected.current ? 1 : 0.94,
                alphaTest: 0.03,
                depthTest: true,
                depthWrite: false,
                toneMapped: false,
              });
              resources.push(pinMaterial);
              const point = new T.Sprite(pinMaterial);
              point.name = `${office.city} office pin`;
              point.center.set(0.5, 0.0625);
              point.scale.set(0.17, 0.2125, 1);
              point.renderOrder = i === selected.current ? 3 : 2;
              point.position.copy(location(office.lat, office.lon, 2.06));
              group.add(point);
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
            pointerY = 0,
            lastSelected = selected.current,
            yawTarget =
              (-offices[selected.current].lon * Math.PI) / 180 - Math.PI / 2,
            pitchTarget = -0.12;
          const autoSpeed = (Math.PI * 2) / 120;
          let autoVelocity = 0,
            resumeAt = 0,
            wasAutomatic = automatic.current;
          const holdRotation = (milliseconds = 2500) => {
            resumeAt = Math.max(resumeAt, performance.now() + milliseconds);
            autoVelocity = 0;
          };
          let drag: {
            id: number;
            x: number;
            y: number;
            width: number;
            height: number;
            touch: boolean;
            engaged: boolean;
          } | null = null;
          const clampPitch = (angle: number) =>
            Math.max(-Math.PI * 0.45, Math.min(Math.PI * 0.45, angle));
          const focusOffice = () => {
            holdRotation(5000);
            const angle =
              (-offices[selected.current].lon * Math.PI) / 180 - Math.PI / 2;
            // Choose the nearest equivalent orientation after any number of turns.
            yawTarget =
              group.rotation.y +
              Math.atan2(
                Math.sin(angle - group.rotation.y),
                Math.cos(angle - group.rotation.y),
              );
            pitchTarget = -0.12;
          };
          if (variant === "globe") {
            group.rotation.y = yawTarget;
            group.rotation.x = pitchTarget;
            container.dataset.dragging = "false";
          }
          const finishDrag = (event?: PointerEvent) => {
            // Touch starts with implicit capture on the canvas. Transferring it
            // to this host must not end the drag when the canvas loses capture.
            if (
              event?.type === "lostpointercapture" &&
              event.target !== container
            )
              return;
            if (!drag || (event && event.pointerId !== drag.id)) return;
            const id = drag.id;
            drag = null;
            holdRotation();
            container.dataset.dragging = "false";
            if (container.hasPointerCapture(id))
              container.releasePointerCapture(id);
          };
          const startDrag = (event: PointerEvent) => {
            if (
              variant !== "globe" ||
              !event.isPrimary ||
              event.button !== 0 ||
              drag
            )
              return;
            const box = container.getBoundingClientRect();
            if (!box.width || !box.height) return;
            drag = {
              id: event.pointerId,
              x: event.clientX,
              y: event.clientY,
              width: box.width,
              height: box.height,
              touch: event.pointerType === "touch",
              engaged: event.pointerType !== "touch",
            };
            yawTarget = group.rotation.y;
            pitchTarget = group.rotation.x;
            holdRotation();
            if (drag.engaged) {
              container.dataset.dragging = "true";
              container.setPointerCapture(event.pointerId);
              container.focus({ preventScroll: true });
            }
            // Leave touch scrolling available; horizontal touch movement rotates.
            if (event.pointerType !== "touch") event.preventDefault();
          };
          const move = (e: PointerEvent) => {
            if (variant === "globe") {
              if (!drag || e.pointerId !== drag.id) return;
              if (drag.touch && !drag.engaged) {
                const dx = e.clientX - drag.x,
                  dy = e.clientY - drag.y;
                if (Math.max(Math.abs(dx), Math.abs(dy)) < 6) return;
                if (Math.abs(dy) > Math.abs(dx)) {
                  drag = null;
                  return;
                }
                drag.engaged = true;
                container.dataset.dragging = "true";
                container.setPointerCapture(e.pointerId);
                container.focus({ preventScroll: true });
              }
              // Deliberately unbounded: repeated swipes can turn through 360° and beyond.
              yawTarget += ((e.clientX - drag.x) / drag.width) * Math.PI * 2;
              pitchTarget = clampPitch(
                pitchTarget + ((e.clientY - drag.y) / drag.height) * Math.PI,
              );
              drag.x = e.clientX;
              drag.y = e.clientY;
              holdRotation();
              return;
            }
            const b = container.getBoundingClientRect();
            pointerX = (e.clientX - b.left) / b.width - 0.5;
            pointerY = (e.clientY - b.top) / b.height - 0.5;
          };
          const key = (event: KeyboardEvent) => {
            if (
              variant !== "globe" ||
              event.altKey ||
              event.ctrlKey ||
              event.metaKey
            )
              return;
            const step = Math.PI / 12;
            if (event.key === "ArrowLeft") yawTarget -= step;
            else if (event.key === "ArrowRight") yawTarget += step;
            else if (event.key === "ArrowUp")
              pitchTarget = clampPitch(pitchTarget - step);
            else if (event.key === "ArrowDown")
              pitchTarget = clampPitch(pitchTarget + step);
            else if (event.key === "Home") focusOffice();
            else return;
            holdRotation();
            event.preventDefault();
          };
          const wheel = (event: WheelEvent) => {
            // A focused globe owns the wheel; ordinary page scrolling and
            // browser pinch/Control-wheel zoom remain available otherwise.
            if (
              variant !== "globe" ||
              document.activeElement !== container ||
              event.ctrlKey ||
              event.metaKey ||
              drag
            )
              return;
            const unit =
              event.deltaMode === 1
                ? 16
                : event.deltaMode === 2
                  ? container.clientHeight
                  : 1;
            const delta =
              Math.abs(event.deltaX) > Math.abs(event.deltaY)
                ? event.deltaX
                : event.deltaY;
            yawTarget += delta * unit * 0.003;
            holdRotation();
            event.preventDefault();
          };
          const blur = () => finishDrag();
          cleanups.push(() => {
            finishDrag();
            container.removeEventListener("pointermove", move);
            container.removeEventListener("pointerdown", startDrag);
            container.removeEventListener("pointerup", finishDrag);
            container.removeEventListener("pointercancel", finishDrag);
            container.removeEventListener("lostpointercapture", finishDrag);
            container.removeEventListener("keydown", key);
            container.removeEventListener("wheel", wheel);
            window.removeEventListener("blur", blur);
          });
          container.addEventListener("pointermove", move);
          if (variant === "globe") {
            container.addEventListener("pointerdown", startDrag);
            container.addEventListener("pointerup", finishDrag);
            container.addEventListener("pointercancel", finishDrag);
            container.addEventListener("lostpointercapture", finishDrag);
            container.addEventListener("keydown", key);
            container.addEventListener("wheel", wheel, { passive: false });
            window.addEventListener("blur", blur);
          }
          const resize = new ResizeObserver(() => {
            const { width, height } = container.getBoundingClientRect();
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
          });
          cleanups.push(() => resize.disconnect());
          resize.observe(container);
          let frame = 0,
            t = 0,
            lastFrame = 0,
            visible = true;
          const visibility = new IntersectionObserver((e) => {
            visible = e[0].isIntersecting;
          });
          cleanups.push(() => {
            cancelAnimationFrame(frame);
            visibility.disconnect();
            motionPreference.removeEventListener("change", motionChanged);
          });
          visibility.observe(container);
          const draw = (now = 0): void => {
            if (gone) return;
            frame = requestAnimationFrame(draw);
            if (!visible || document.hidden || now - lastFrame < 33) return;
            const elapsed = Math.min((now - lastFrame) / 1000 || 1 / 30, 0.1);
            lastFrame = now;
            t += 0.01;
            if (variant === "globe") {
              if (wasAutomatic !== automatic.current) {
                wasAutomatic = automatic.current;
                yawTarget = group.rotation.y;
                autoVelocity = 0;
                resumeAt = automatic.current ? 0 : Infinity;
              }
              if (lastSelected !== selected.current) {
                lastSelected = selected.current;
                finishDrag();
                focusOffice();
                markers.forEach((marker, i) => {
                  marker.material.map =
                    pinTextures[i === selected.current ? 1 : 0];
                  marker.material.opacity = i === selected.current ? 1 : 0.94;
                  marker.renderOrder = i === selected.current ? 3 : 2;
                });
              }
              const rotating =
                automatic.current && !reduced && !drag && now >= resumeAt;
              autoVelocity = rotating
                ? autoVelocity +
                  (autoSpeed - autoVelocity) * (1 - Math.exp(-elapsed * 2))
                : 0;
              yawTarget += autoVelocity * elapsed;
              container.dataset.autorotating = String(rotating);
              const follow = reduced
                ? 1
                : 1 - Math.exp(-(drag ? 24 : 12) * elapsed);
              group.rotation.y += (yawTarget - group.rotation.y) * follow;
              group.rotation.x += (pitchTarget - group.rotation.x) * follow;
              container.dataset.yaw = group.rotation.y.toFixed(5);
              container.dataset.pitch = group.rotation.x.toFixed(5);
              group.updateMatrixWorld(true);
              markers.forEach((m, i) => {
                const emphasis =
                  i === selected.current
                    ? reduced
                      ? 1.3
                      : 1.3 + Math.sin(t * 5) * 0.025
                    : 1;
                m.scale.set(0.17 * emphasis, 0.2125 * emphasis, 1);
                markerWorld.copy(m.position).applyMatrix4(group.matrixWorld);
                markerView.copy(camera.position).sub(markerWorld);
                // Do not let a camera-facing pin float through the far side.
                // Depth testing also trims pins naturally at the globe's limb.
                m.visible = markerWorld.dot(markerView) > 0;
              });
            } else if (!reduced) {
              group.rotation.y = pointerX * 0.3 + t * 0.12;
              group.rotation.x = pointerY * 0.15;
              group.position.y = Math.sin(t) * 0.06;
            }
            renderer.render(scene, camera);
            container.dataset.ready = "true";
          };
          motionPreference.addEventListener("change", motionChanged);
          draw();
        } catch {
          dispose();
          if (!gone) setFailed(true);
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
      role={variant === "globe" && !failed ? "group" : "img"}
      tabIndex={variant === "globe" && !failed ? 0 : undefined}
      aria-describedby={
        variant === "globe" && !failed ? instructionsId : undefined
      }
      data-ready="false"
      data-dragging="false"
      data-autorotating="false"
      title={
        variant === "globe"
          ? "Drag to rotate. Click the globe, then scroll to turn."
          : undefined
      }
    >
      {variant === "globe" && !failed && (
        <span className="globe-instructions" id={instructionsId}>
          Drag left or right to rotate the globe a full 360 degrees. Drag up or
          down to tilt. Focus or click the globe to rotate with the mouse wheel.
          You can also use the arrow keys. Press Home to return to the selected
          office. Automatic rotation pauses while you interact.
        </span>
      )}
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
