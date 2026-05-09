// Graph data + geometry helpers
// Entity taxonomy follows the screenshot's legend but recolors to Team's palette.
// No rainbow — lime is the accent (observations), ember for high-signal nodes
// (campaigns/decisions), everything else neutral greys.

const CATEGORIES = {
  contact:       { label: 'contact',       count: 48,    color: '#B8B6AE', size: 0.55 },
  task:          { label: 'task',          count: 151,   color: '#7A7770', size: 0.40 },
  tactic:        { label: 'tactic',        count: 57,    color: '#FAFAF7', size: 0.60 },
  campaign:      { label: 'campaign',      count: 4,     color: '#E83E18', size: 1.20 }, // ember — hero
  observations:  { label: 'observations',  count: 10077, color: '#C0EC5F', size: 0.35 }, // lime — most numerous, smallest
  decisions:     { label: 'decisions',     count: 131,   color: '#F4833E', size: 0.85 }, // ember-400
  workflows:     { label: 'workflows',     count: 17,    color: '#CAEC73', size: 0.95 }, // lime-300
  conversations: { label: 'conversations', count: 82,    color: '#8A8A94', size: 0.50 },
};

// Deterministic pseudo-random so the graph is stable across reloads.
function mulberry32(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// Build ~420 nodes distributed on/inside a sphere. The screenshot has
// a shell of small dots and larger hubs deeper in — we replicate that:
//   - 6 hero hubs (campaigns/decisions) at small radius
//   - mid-layer of workflows, tactics, contacts, conversations
//   - outer shell of tasks + observations (the tiny dots)
function buildGraph() {
  const rand = mulberry32(7);
  const nodes = [];
  let id = 0;

  // Distribute points on a sphere (fibonacci lattice) so the outer shell
  // reads as a clean sphere, not a cloud.
  function fibSphere(n, radius, offset = 0) {
    const pts = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * (i + offset);
      pts.push([Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius]);
    }
    return pts;
  }

  // Hero hubs — campaigns (big violet/ember in screenshot; we use ember here)
  const hubs = [
    ...fibSphere(4, 90, 0).map(p => ({ cat: 'campaign', p })),
    ...fibSphere(5, 120, 0.5).map(p => ({ cat: 'decisions', p, big: true })),
  ];
  hubs.forEach(h => {
    nodes.push({
      id: id++, cat: h.cat,
      x: h.p[0] + (rand() - 0.5) * 20,
      y: h.p[1] + (rand() - 0.5) * 20,
      z: h.p[2] + (rand() - 0.5) * 20,
      r: CATEGORIES[h.cat].size * (h.big ? 1 : 1.15),
      hub: true,
    });
  });

  // Mid-layer
  const midConfig = [
    { cat: 'workflows',     count: 17,  radius: 160 },
    { cat: 'tactic',        count: 57,  radius: 180 },
    { cat: 'contact',       count: 48,  radius: 200 },
    { cat: 'conversations', count: 82,  radius: 210 },
    { cat: 'decisions',     count: 26,  radius: 150 },
  ];
  midConfig.forEach((cfg, idx) => {
    const pts = fibSphere(cfg.count, cfg.radius, idx * 0.37);
    pts.forEach(p => {
      nodes.push({
        id: id++, cat: cfg.cat,
        x: p[0] + (rand() - 0.5) * 18,
        y: p[1] + (rand() - 0.5) * 18,
        z: p[2] + (rand() - 0.5) * 18,
        r: CATEGORIES[cfg.cat].size,
        hub: false,
      });
    });
  });

  // Outer shell — tasks + a sampling of observations (screenshot shows
  // mostly the outer dots, implying observations are sampled in here).
  const outerConfig = [
    { cat: 'task',         count: 90,  radius: 270 },
    { cat: 'observations', count: 180, radius: 290 },
    { cat: 'observations', count: 60,  radius: 310 },
  ];
  outerConfig.forEach((cfg, idx) => {
    const pts = fibSphere(cfg.count, cfg.radius, idx * 0.19 + 0.1);
    pts.forEach(p => {
      nodes.push({
        id: id++, cat: cfg.cat,
        x: p[0] + (rand() - 0.5) * 12,
        y: p[1] + (rand() - 0.5) * 12,
        z: p[2] + (rand() - 0.5) * 12,
        r: CATEGORIES[cfg.cat].size,
        hub: false,
      });
    });
  });

  // Edges: hubs connect densely to a subset of everything; mid nodes
  // connect to their nearest hub + 1-2 peers; outer nodes to 1 nearest mid.
  const edges = [];
  const hubIds = nodes.filter(n => n.hub).map(n => n.id);

  function dist(a, b) {
    const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  // Hub <-> hub (every pair)
  for (let i = 0; i < hubIds.length; i++) {
    for (let j = i + 1; j < hubIds.length; j++) {
      edges.push({ a: hubIds[i], b: hubIds[j], strong: true });
    }
  }

  // Each non-hub node → 1 nearest hub + (sometimes) a peer
  nodes.forEach(n => {
    if (n.hub) return;
    let best = null, bestD = Infinity;
    hubIds.forEach(hid => {
      const d = dist(n, nodes[hid]);
      if (d < bestD) { bestD = d; best = hid; }
    });
    if (best != null) edges.push({ a: n.id, b: best, strong: false });

    if (rand() < 0.22) {
      // peer connect to a similar-radius random neighbor
      const peer = nodes[Math.floor(rand() * nodes.length)];
      if (peer.id !== n.id) edges.push({ a: n.id, b: peer.id, strong: false });
    }
  });

  return { nodes, edges };
}

window.CATEGORIES = CATEGORIES;
window.buildGraph = buildGraph;
