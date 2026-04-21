'use client';

import { useCallback, useEffect, useRef } from 'react';
import cytoscape, { type Core } from 'cytoscape';
import type { GraphPayload } from '@/lib/graph/types';
import { buildGraphStylesheet } from '@/lib/graph/cytoscape-style';
import { applyFuzzyBlobLayout } from '@/lib/graph/cytoscape-layout';
import { clearHighlight, highlightNeighborhood } from '@/lib/graph/highlight';
import {
  findFirstMatch,
  getVisibleIds,
  type GraphFilter,
} from '@/lib/graph/graph-lookups';

interface Props {
  payload: GraphPayload;
  filter: GraphFilter;
  searchToken: { query: string; seq: number };
  onSelect: (nodeId: string | null) => void;
  onResetFilter: () => void;
}

export default function GraphCanvas({
  payload,
  filter,
  searchToken,
  onSelect,
  onResetFilter,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const cy = cytoscape({
      container,
      elements: [...payload.nodes, ...payload.edges],
      style: buildGraphStylesheet(),
      wheelSensitivity: 0.2,
    });

    const runLayout = () => {
      const { clientWidth, clientHeight } = container;
      if (clientWidth === 0 || clientHeight === 0) return;
      applyFuzzyBlobLayout(cy, {
        width: clientWidth,
        height: clientHeight,
      });
    };
    runLayout();

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    let lastW = container.clientWidth;
    let lastH = container.clientHeight;
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (Math.abs(width - lastW) < 40 && Math.abs(height - lastH) < 40) return;
      lastW = width;
      lastH = height;
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(runLayout, 150);
    });
    resizeObserver.observe(container);

    cy.on('tap', 'node', (event) => {
      highlightNeighborhood(cy, event.target);
      onSelectRef.current(event.target.id());
    });

    cy.on('tap', (event) => {
      if (event.target === cy) {
        clearHighlight(cy);
        onSelectRef.current(null);
      }
    });

    cyRef.current = cy;

    return () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeObserver.disconnect();
      cy.destroy();
      cyRef.current = null;
    };
  }, [payload]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const cy = cyRef.current;
      if (!cy) return;
      cy.style(buildGraphStylesheet()).update();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    const visible = getVisibleIds(payload, filter);
    cy.batch(() => {
      cy.nodes().forEach((n) => {
        if (visible.has(n.id())) n.removeClass('hidden');
        else n.addClass('hidden');
      });
      cy.edges().forEach((e) => {
        if (visible.has(e.source().id()) && visible.has(e.target().id())) {
          e.removeClass('hidden');
        } else {
          e.addClass('hidden');
        }
      });
    });
  }, [filter, payload]);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy || !searchToken.query.trim()) return;
    const match = findFirstMatch(payload, searchToken.query);
    if (!match) return;
    const node = cy.getElementById(match.id);
    if (node.empty() || node.hasClass('hidden')) return;
    highlightNeighborhood(cy, node);
    cy.animate(
      { center: { eles: node }, zoom: 1.4 },
      { duration: 400 },
    );
    onSelectRef.current(match.id);
  }, [searchToken, payload]);

  const handleReset = useCallback(() => {
    const cy = cyRef.current;
    if (!cy) return;
    clearHighlight(cy);
    cy.fit(undefined, 30);
    onSelectRef.current(null);
    onResetFilter();
  }, [onResetFilter]);

  return (
    <div
      className="relative h-full w-full"
      style={{ background: 'var(--graph-bg)' }}
    >
      <div ref={containerRef} className="h-full w-full" />
      <button
        type="button"
        onClick={handleReset}
        className="group absolute left-4 top-4 flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--muted)] backdrop-blur transition-colors hover:border-[var(--accent-soft)] hover:text-[var(--accent)]"
      >
        <svg width="11" height="11" viewBox="0 0 14 14" aria-hidden="true">
          <path
            d="M12 7 A5 5 0 1 1 7 2"
            stroke="currentColor"
            strokeWidth="1.3"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M12 2 L12 5 L9 5"
            stroke="currentColor"
            strokeWidth="1.3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        reset
      </button>
    </div>
  );
}
