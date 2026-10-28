import { describe, expect, it } from 'vitest';
import { scene } from './hero-scene';

// The geometry is only ever looked at in the browser: a three.js upgrade that changed how it
// builds edges could silently empty an object, so check every one still has real segments.
describe('hero scene', () => {
  it('builds every object as whole segments with a hit radius', () => {
    expect(scene).toHaveLength(5);
    for (const { points, radius } of scene) {
      expect(points.length).toBeGreaterThan(0);
      expect(points.length % 6).toBe(0);
      expect(points.every(Number.isFinite)).toBe(true);
      expect(radius).toBeGreaterThan(0);
    }
  });

  it('gives the steam to the mug alone', () => {
    expect(scene.filter((item) => item.steam)).toHaveLength(1);
  });
});
