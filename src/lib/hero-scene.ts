// The home hero's wireframes, built at build time with three.js and served as plain line
// segments by /hero-scene.json: three.js and WebGL never reach the browser.
import {
  BoxGeometry,
  BufferGeometry,
  CircleGeometry,
  CubicBezierCurve3,
  CylinderGeometry,
  EdgesGeometry,
  ExtrudeGeometry,
  Group,
  Line,
  LineSegments,
  Path,
  Shape,
  SphereGeometry,
  TorusGeometry,
  Vector2,
  Vector3,
  type Object3D,
} from 'three';

// Low threshold angle keeps the hard edges, a higher one hides the facets of curved surfaces
const edges = (geometry: BufferGeometry, threshold = 1) =>
  new LineSegments(new EdgesGeometry(geometry, threshold));
const extrude = (shape: Shape, depth = 0.3) =>
  new ExtrudeGeometry(shape, { depth, bevelEnabled: false });
const polygon = (points: [number, number][]) =>
  new Shape(points.map(([x, y]) => new Vector2(x, y)));
const line = (points: Vector3[]) => new Line(new BufferGeometry().setFromPoints(points));

// </>
const code = new Group();
// Inner edges parallel to the outer ones, 0.28 apart like the slash, so the stroke
// keeps one thickness all the way to the tip
const chevron = polygon([
  [0.5, 1],
  [-0.6, 0],
  [0.5, -1],
  [0.688, -0.793],
  [-0.184, 0],
  [0.688, 0.793],
]);
// One outline, shared by both chevrons and the prompt's >
const chevronEdges = new EdgesGeometry(extrude(chevron), 1);
const left = new LineSegments(chevronEdges);
left.position.x = -1.5;
const right = new LineSegments(chevronEdges);
right.scale.x = -1;
right.position.x = 1.5;
const slash = edges(
  extrude(
    polygon([
      [-0.45, -1.1],
      [-0.15, -1.1],
      [0.45, 1.1],
      [0.15, 1.1],
    ]),
  ),
);
code.add(left, slash, right);

// { }: the brace's centreline, thickened into an outline along its normals
const path = new Path();
path.moveTo(0.5, 1.3);
path.quadraticCurveTo(0, 1.3, 0, 0.8);
path.lineTo(0, 0.3);
path.quadraticCurveTo(0, 0, -0.4, 0);
path.quadraticCurveTo(0, 0, 0, -0.3);
path.lineTo(0, -0.8);
path.quadraticCurveTo(0, -1.3, 0.5, -1.3);
const centre = path.getPoints(8);
const outer: Vector2[] = [];
const inner: Vector2[] = [];
centre.forEach((p, i) => {
  const dir = centre[Math.min(i + 1, centre.length - 1)]!.clone().sub(centre[Math.max(i - 1, 0)]!);
  const normal = new Vector2(-dir.y, dir.x).normalize().multiplyScalar(0.12);
  outer.push(p.clone().add(normal));
  inner.unshift(p.clone().sub(normal));
});
const brace = extrude(new Shape([...outer, ...inner]));
const braces = new Group();
const open = edges(brace, 20);
open.position.x = -0.9;
const close = edges(brace, 20);
close.scale.x = -1;
close.position.x = 0.9;
braces.add(open, close);

// Terminal window: title bar with three dots and a >_ prompt
const frame = new Shape();
frame.moveTo(-1.05, -0.8);
frame.lineTo(1.05, -0.8);
frame.quadraticCurveTo(1.2, -0.8, 1.2, -0.65);
frame.lineTo(1.2, 0.65);
frame.quadraticCurveTo(1.2, 0.8, 1.05, 0.8);
frame.lineTo(-1.05, 0.8);
frame.quadraticCurveTo(-1.2, 0.8, -1.2, 0.65);
frame.lineTo(-1.2, -0.65);
frame.quadraticCurveTo(-1.2, -0.8, -1.05, -0.8);
const terminal = new Group();
// Front face of the 0.15-deep body, nudged out so the details sit just in front of it
const front = 0.16;
terminal.add(
  edges(extrude(frame, 0.15), 20),
  line([new Vector3(-1.2, 0.5, front), new Vector3(1.2, 0.5, front)]),
);
const dot = new EdgesGeometry(new CircleGeometry(0.07, 8));
for (const x of [-0.95, -0.75, -0.55]) {
  const light = new LineSegments(dot);
  light.position.set(x, 0.65, front);
  terminal.add(light);
}
// The </> chevron mirrored and shrunk into the prompt's >
const prompt = new LineSegments(chevronEdges);
prompt.scale.set(-0.25, 0.25, 0.25);
prompt.position.set(-0.8, -0.05, front);
const cursor = edges(new BoxGeometry(0.3, 0.06, 0.05));
cursor.position.set(-0.5, -0.27, front + 0.025);
terminal.add(prompt, cursor);

// Coffee mug: a tapered open cylinder with a handle; its steam is drawn live in the browser
const mug = new Group();
mug.add(edges(new CylinderGeometry(0.7, 0.6, 1.5, 12, 1, true)));
const handle = edges(new TorusGeometry(0.4, 0.08, 4, 10, Math.PI));
handle.rotation.z = -Math.PI / 2;
handle.position.x = 0.68;
mug.add(handle);

// Git graph: main with a feature branch and a hotfix forking off and merging back.
// Drawn left to right, then turned upright so history reads bottom to top like `git log`.
const git = new Group();
git.rotation.z = Math.PI / 2;
// Commits as low-poly globes: UV-sphere quads are planar, so the edges are only the
// meridians and parallels
const node = new EdgesGeometry(new SphereGeometry(0.2, 6, 4));
const commit = (x: number, y: number) => {
  const c = new LineSegments(node);
  c.position.set(x, y, 0);
  git.add(c);
};
const curve = (ax: number, ay: number, bx: number, by: number) =>
  git.add(
    line(
      new CubicBezierCurve3(
        new Vector3(ax, ay, 0),
        new Vector3((ax + bx) / 2, ay, 0),
        new Vector3((ax + bx) / 2, by, 0),
        new Vector3(bx, by, 0),
      ).getPoints(12),
    ),
  );
for (let i = -3; i <= 3; i++) commit(i * 0.8, 0);
curve(-2.4, 0, 2.4, 0);
// feature: forks after the 2nd commit, three commits, merges into the 6th
for (const x of [-0.8, 0, 0.8]) commit(x, 0.9);
curve(-1.6, 0, -0.8, 0.9);
curve(-0.8, 0.9, 0.8, 0.9);
curve(0.8, 0.9, 1.6, 0);
// hotfix: one commit, merged into the next one on main
commit(0, -0.9);
curve(-0.8, 0, 0, -0.9);
curve(0, -0.9, 0.8, 0);

// Every line as flat segment pairs [x1, y1, z1, x2, y2, z2, ...] in the object's own space,
// its pose and scale baked in, plus the radius that encloses it (the drag hit area)
function segments(object: Object3D, scale: number) {
  object.scale.setScalar(scale);
  object.updateMatrixWorld(true);
  const points: number[] = [];
  let radius = 0;
  const vertex = new Vector3();
  object.traverse((child) => {
    if (!(child instanceof Line)) return; // LineSegments is a Line too
    const position = (child.geometry as BufferGeometry).getAttribute('position');
    const add = (i: number) => {
      vertex.fromBufferAttribute(position, i).applyMatrix4(child.matrixWorld);
      radius = Math.max(radius, vertex.length());
      // 3 decimals: well under a pixel at any size the hero is drawn
      points.push(...vertex.toArray().map((v) => Math.round(v * 1000) / 1000));
    };
    // Segments come in pairs, a polyline joins each point to the next
    const step = child instanceof LineSegments ? 2 : 1;
    for (let i = 0; i + 1 < position.count; i += step) {
      add(i);
      add(i + 1);
    }
  });
  return { points, radius: Math.round(radius * 100) / 100 };
}

// fx: fraction of the half width, fy: of the half height. Mostly the edges and the
// right side, away from the title.
export const scene = [
  { object: code, fx: 0.82, fy: 0.62, z: -1, scale: 0.55 },
  { object: terminal, fx: 0.86, fy: -0.6, z: 0, scale: 0.7 },
  { object: git, fx: 0.3, fy: -0.72, z: -3, scale: 0.6 },
  { object: mug, fx: -0.93, fy: 0.75, z: -2, scale: 0.7, steam: true },
  { object: braces, fx: -0.88, fy: -0.6, z: -1, scale: 0.6 },
].map(({ object, ...item }) => ({ ...item, ...segments(object, item.scale) }));

export type SceneItem = (typeof scene)[number];
