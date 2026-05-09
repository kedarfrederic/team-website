/**
 * Team Brain — geometry helpers for the data adapter.
 *
 * Fibonacci-lattice sphere placement and deterministic PRNG.
 */

// Fibonacci lattice (same algorithm as graph_data.js)
export function fibSphere(
  n: number,
  radius: number,
  offset = 0,
): Array<[number, number, number]> {
  if (n <= 0) return [];
  if (n === 1) return [[0, 0, 0]];
  const pts: Array<[number, number, number]> = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * (i + offset);
    pts.push([
      Math.cos(theta) * r * radius,
      y * radius,
      Math.sin(theta) * r * radius,
    ]);
  }
  return pts;
}

// Deterministic seeded PRNG (mulberry32)
export function mulberry32(seed: number): () => number {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
