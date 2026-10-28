import { mat4, vec3 } from 'gl-matrix';
import type { SceneItem } from '../lib/hero-scene';

// Decorative wireframe dev objects drifting behind the home hero: poses the prebuilt line
// segments, projects them through a perspective camera and strokes them on a 2D canvas.
export function start(canvas: HTMLCanvasElement, scene: SceneItem[]) {
  const ctx = canvas.getContext('2d')!;
  const items = scene.map((item, i) => ({
    ...item,
    phase: i * 1.7,
    // drag*: extra rotation from the user dragging the object, eased back to 0 on release
    dragX: 0,
    dragY: 0,
    position: vec3.create(),
    model: mat4.create(),
  }));
  type Item = (typeof items)[number];

  // Frame-rate independent easing
  const damp = (x: number, y: number, lambda: number, dt: number) =>
    x + (y - x) * (1 - Math.exp(-lambda * dt));
  // The same angle within ±π, so a release eases back the short way, not unwinding every turn
  const wrap = (a: number) => a - 2 * Math.PI * Math.round(a / (2 * Math.PI));

  // Camera: 45° vertical field of view from z = 12, always looking at the origin
  const FOV = Math.PI / 4;
  const camera = vec3.fromValues(0, 0, 12);
  const ORIGIN = vec3.create(),
    UP = vec3.fromValues(0, 1, 0);
  // Half the visible height at z = 0; the width follows the aspect ratio
  const halfH = camera[2] * Math.tan(FOV / 2);
  const REST_TILT = 0.3; // every object rests tilted towards the viewer
  const dpr = Math.min(devicePixelRatio, 2);
  // projection goes all the way to canvas pixels: perspective, then the viewport
  const projection = mat4.create(),
    view = mat4.create(),
    viewProjection = mat4.create(),
    transform = mat4.create();
  const point = vec3.create();
  let width = 0,
    height = 0,
    focal = 0; // pixels per unit at distance 1

  let color = '';
  const setColor = () =>
    (color = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim());
  setColor();

  function layout() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // resizing reset it
    focal = height / 2 / Math.tan(FOV / 2);
    // Normalised device coordinates (-1..1, y up) to pixels (0..size, y down)
    mat4.fromTranslation(projection, [width / 2, height / 2, 0]);
    mat4.scale(projection, projection, [width / 2, -height / 2, 1]);
    mat4.multiply(
      projection,
      projection,
      mat4.perspective(transform, FOV, width / height, 0.1, 100),
    );
  }

  const project = (matrix: mat4, x: number, y: number, z: number) =>
    vec3.transformMat4(point, vec3.set(point, x, y, z), matrix);

  // Steam: three wisps rising from the coffee, in world space so they always rise straight
  // up whatever the mug's tilt, fading out as it turns over
  const STEAM_POINTS = 20,
    SURFACE = 0.35; // the coffee's level in the mug
  const WISPS = [
    { x: -0.3, z: 0.15, offset: 0 },
    { x: 0, z: -0.25, offset: 2.1 },
    { x: 0.3, z: 0.1, offset: 4.2 },
  ];
  const from = vec3.create();

  // Each wisp widens and curls as it rises, bent by a slow shared draught; alpha fades in
  // and out along it and breathes, each segment taking the mean of its two ends
  function steam(item: Item, t: number) {
    const size = item.scale;
    const upright = Math.max(0, Math.cos(REST_TILT + item.dragX));
    for (const { x, z, offset } of WISPS) {
      vec3.transformMat4(from, vec3.set(from, x * size, SURFACE * size, z * size), item.model);
      const breath = 0.7 + 0.3 * Math.sin(t * 0.7 + offset);
      let lastX = 0,
        lastY = 0,
        lastAlpha = 0;
      for (let k = 0; k < STEAM_POINTS; k++) {
        const u = k / (STEAM_POINTS - 1);
        const spread = (0.03 + 0.14 * u) * size;
        const drift = 0.08 * u * u * size;
        const p = project(
          viewProjection,
          from[0] + spread * Math.sin(u * 6 - t * 2 + offset) + drift * Math.cos(t * 0.3),
          from[1] + u * 1.6 * size,
          from[2] + spread * Math.cos(u * 5 - t * 1.7 + offset * 1.3) + drift * Math.sin(t * 0.3),
        );
        const alpha = Math.sin(Math.PI * u ** 0.7) * breath * upright;
        if (k) {
          ctx.globalAlpha = (alpha + lastAlpha) / 2;
          ctx.beginPath();
          ctx.moveTo(lastX, lastY);
          ctx.lineTo(p[0], p[1]);
          ctx.stroke();
        }
        lastX = p[0];
        lastY = p[1];
        lastAlpha = alpha;
      }
    }
    ctx.globalAlpha = 1;
  }

  // Motion from the timestamp, not per-frame steps, so 144 Hz screens don't move faster.
  // Rocking rather than spinning, so no object shows its back or turns edge-on unless dragged.
  function draw(t: number) {
    mat4.multiply(viewProjection, projection, mat4.lookAt(view, camera, ORIGIN, UP));
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1 / dpr; // one device pixel
    for (const item of items) {
      vec3.set(
        item.position,
        (item.fx * halfH * width) / height,
        item.fy * halfH + Math.sin(t * 0.6 + item.phase) * 0.15,
        item.z,
      );
      mat4.fromTranslation(item.model, item.position);
      mat4.rotateX(item.model, item.model, REST_TILT + item.dragX);
      mat4.rotateY(item.model, item.model, Math.sin(t * 0.4 + item.phase) * 0.5 + item.dragY);
      mat4.multiply(transform, viewProjection, item.model);
      const points = item.points;
      ctx.beginPath();
      for (let i = 0; i < points.length; i += 6) {
        const a = project(transform, points[i]!, points[i + 1]!, points[i + 2]!);
        ctx.moveTo(a[0], a[1]);
        const b = project(transform, points[i + 3]!, points[i + 4]!, points[i + 5]!);
        ctx.lineTo(b[0], b[1]);
      }
      ctx.stroke();
      if (item.steam) steam(item, t);
    }
  }

  // Reduced motion draws no frames of its own: one still frame, redrawn when it changes
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const redraw = () => still && draw(4);
  new ResizeObserver(() => (layout(), redraw())).observe(canvas);
  new MutationObserver(() => (setColor(), redraw())).observe(document.documentElement, {
    attributeFilter: ['data-theme'],
  });

  if (!still) {
    // Subtle parallax: the camera eases towards the pointer
    const target = { x: 0, y: 0 };
    addEventListener('pointermove', (e) => {
      target.x = (e.clientX / innerWidth - 0.5) * 1.2;
      target.y = -(e.clientY / innerHeight - 0.5) * 0.8;
    });

    // Drag an object to turn it, any way and as far as you like. The canvas ignores the
    // pointer so the text stays selectable; the hero listens instead and hit-tests each
    // object's enclosing circle on screen.
    const hero = canvas.parentElement!;
    const pick = (e: PointerEvent) => {
      if ((e.target as Element).closest('a, button')) return undefined;
      const r = canvas.getBoundingClientRect();
      return items.find((item) => {
        const radius = (item.radius * focal) / vec3.distance(camera, item.position);
        const p = vec3.transformMat4(point, item.position, viewProjection);
        return Math.hypot(e.clientX - r.left - p[0], e.clientY - r.top - p[1]) < radius;
      });
    };
    let drag: { item: Item; x: number; y: number } | undefined;
    hero.addEventListener('pointerdown', (e) => {
      const item = pick(e);
      if (!item) return;
      e.preventDefault(); // no text selection while dragging
      drag = { item, x: e.clientX, y: e.clientY };
      hero.setPointerCapture(e.pointerId);
      hero.style.cursor = 'grabbing';
    });
    hero.addEventListener('pointermove', (e) => {
      if (!drag) return void (hero.style.cursor = pick(e) ? 'grab' : '');
      drag.item.dragY += (e.clientX - drag.x) * 0.01;
      drag.item.dragX += (e.clientY - drag.y) * 0.01;
      drag.x = e.clientX;
      drag.y = e.clientY;
    });
    const release = () => {
      if (drag) {
        drag.item.dragX = wrap(drag.item.dragX);
        drag.item.dragY = wrap(drag.item.dragY);
      }
      drag = undefined;
      hero.style.cursor = '';
    };
    hero.addEventListener('pointerup', release);
    hero.addEventListener('pointercancel', release);

    let last = 0,
      running = false;
    const loop = (time: number) => {
      if (!running) return;
      requestAnimationFrame(loop);
      // Capped so the first frame after a pause doesn't jump
      const dt = Math.min(time - last, 100);
      last = time;
      camera[0] = damp(camera[0], target.x, 1 / 400, dt);
      camera[1] = damp(camera[1], target.y, 1 / 400, dt);
      for (const item of items) {
        if (item === drag?.item) continue;
        item.dragX = damp(item.dragX, 0, 1 / 800, dt);
        item.dragY = damp(item.dragY, 0, 1 / 800, dt);
      }
      draw(time / 1000);
    };
    // Paused while the hero is scrolled away
    new IntersectionObserver(([entry]) => {
      if (entry!.isIntersecting === running) return;
      running = entry!.isIntersecting;
      if (running) {
        last = performance.now();
        requestAnimationFrame(loop);
      }
    }).observe(canvas);
  }
  canvas.classList.add('ready');
}
