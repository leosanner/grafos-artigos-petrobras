import type { Core } from 'cytoscape';
import type { NodeType } from './types';

interface Size {
  width: number;
  height: number;
}

interface BlobBounds {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

const BLOB_BOUNDS: Record<NodeType, BlobBounds> = {
  big_area: { cx: 0.08, cy: 0.5, rx: 0.06, ry: 0.4 },
  term: { cx: 0.36, cy: 0.5, rx: 0.16, ry: 0.46 },
  article: { cx: 0.68, cy: 0.5, rx: 0.12, ry: 0.46 },
  application_area: { cx: 0.93, cy: 0.5, rx: 0.05, ry: 0.42 },
};

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function applyFuzzyBlobLayout(cy: Core, size: Size): void {
  const rand = mulberry32(1337);
  cy.batch(() => {
    cy.nodes().forEach((node) => {
      const type = (node.data('type') as NodeType) ?? 'term';
      const b = BLOB_BOUNDS[type] ?? BLOB_BOUNDS.term;
      const theta = rand() * Math.PI * 2;
      const r = Math.sqrt(rand());
      node.position({
        x: (b.cx + Math.cos(theta) * r * b.rx) * size.width,
        y: (b.cy + Math.sin(theta) * r * b.ry) * size.height,
      });
    });
  });
  cy.fit(undefined, 40);
}
