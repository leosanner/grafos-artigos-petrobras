'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import type { GraphPayload } from '@/lib/graph/types';
import { loadGraph } from '@/lib/graph/load-graph';
import type { GraphFilter } from '@/lib/graph/graph-lookups';
import SidePanel from './side-panel';
import GraphToolbar from './graph-toolbar';

const GraphCanvas = dynamic(() => import('./graph-canvas'), { ssr: false });

const DEFAULT_FILTER: GraphFilter = {
  types: new Set(['big_area', 'term', 'article', 'application_area']),
  bigAreaId: 'all',
};

export default function GraphClient() {
  const [payload, setPayload] = useState<GraphPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<GraphFilter>(DEFAULT_FILTER);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchToken, setSearchToken] = useState({ query: '', seq: 0 });

  useEffect(() => {
    let cancelled = false;
    loadGraph()
      .then((p) => {
        if (!cancelled) setPayload(p);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center p-6 text-sm text-[var(--node-application-area)]">
        Erro ao carregar grafo: {error}
      </div>
    );
  }

  if (!payload) {
    return (
      <div className="flex h-full w-full items-center justify-center text-sm text-[var(--muted)]">
        Carregando grafo…
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      <GraphToolbar
        payload={payload}
        filter={filter}
        onFilterChange={setFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={(q) => setSearchToken((prev) => ({ query: q, seq: prev.seq + 1 }))}
      />
      <div className="relative min-h-0 flex-1">
        <GraphCanvas
          payload={payload}
          filter={filter}
          searchToken={searchToken}
          onSelect={setSelectedId}
        />
        {selectedId && (
          <div className="absolute right-4 top-4 bottom-4 z-20 w-80 rounded-lg shadow-xl">
            <SidePanel
              payload={payload}
              selectedId={selectedId}
              onClose={() => setSelectedId(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
