'use client';

import { useMemo } from 'react';
import type { GraphNode, GraphPayload } from '@/lib/graph/types';

interface Props {
  payload: GraphPayload;
  selectedId: string | null;
  onClose: () => void;
}

const TYPE_META: Record<GraphNode['type'], { color: string; label: string }> = {
  big_area: { color: '#16a34a', label: 'grande área' },
  term: { color: '#eab308', label: 'termo' },
  article: { color: '#2563eb', label: 'artigo' },
  application_area: { color: '#dc2626', label: 'área AIA' },
};

export default function SidePanel({ payload, selectedId, onClose }: Props) {
  const node = useMemo(() => {
    if (!selectedId) return null;
    return payload.nodes.find((n) => n.data.id === selectedId)?.data ?? null;
  }, [payload, selectedId]);

  if (!node) return null;

  const meta = TYPE_META[node.type];

  return (
    <aside className="relative flex h-full w-full flex-col overflow-hidden rounded-lg border border-white/10 bg-[#0a0a0b]/92 font-sans text-neutral-200 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md">
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[2px]"
        style={{
          background: `linear-gradient(180deg, ${meta.color} 0%, ${meta.color}20 55%, transparent 100%)`,
        }}
      />

      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar detalhes"
        className="absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 text-neutral-500 transition-colors hover:border-amber-400/40 hover:text-amber-400"
      >
        <svg width="9" height="9" viewBox="0 0 14 14" aria-hidden="true">
          <path
            d="M2 2 L12 12 M12 2 L2 12"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div className="flex flex-col gap-4 overflow-y-auto px-6 py-5 pr-10">
        <header className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: meta.color,
                boxShadow: `0 0 8px ${meta.color}`,
              }}
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-500">
              {meta.label}
            </span>
            <span className="ml-auto font-mono text-[10px] tracking-[0.1em] text-neutral-700">
              /{node.id.slice(0, 8)}
            </span>
          </div>
          <h2 className="text-[17px] font-medium leading-snug tracking-tight text-neutral-50">
            {node.label}
          </h2>
        </header>

        <Divider />

        <NodeDetails node={node} payload={payload} />
      </div>
    </aside>
  );
}

function Divider() {
  return <span className="h-px w-full bg-white/[0.06]" aria-hidden="true" />;
}

function NodeDetails({ node, payload }: { node: GraphNode; payload: GraphPayload }) {
  if (node.type === 'big_area') {
    const termIds = payload.edges
      .filter((e) => e.data.type === 'big_area_to_term' && e.data.source === node.id)
      .map((e) => e.data.target);
    const articleIds = new Set(
      payload.edges
        .filter(
          (e) => e.data.type === 'term_to_article' && termIds.includes(e.data.source),
        )
        .map((e) => e.data.target),
    );
    return (
      <div className="flex gap-6">
        <Counter label="Termos" value={termIds.length} />
        <Counter label="Artigos" value={articleIds.size} />
      </div>
    );
  }

  if (node.type === 'term') {
    const articleNodes = payload.edges
      .filter((e) => e.data.type === 'term_to_article' && e.data.source === node.id)
      .map((e) => payload.nodes.find((n) => n.data.id === e.data.target)?.data)
      .filter((n): n is GraphNode => Boolean(n));
    return (
      <div className="flex flex-col gap-5">
        <Field label="Grande área">{node.bigArea}</Field>
        <div className="flex flex-col gap-2">
          <SectionLabel suffix={articleNodes.length.toString().padStart(2, '0')}>
            artigos
          </SectionLabel>
          <ul className="flex flex-col divide-y divide-white/[0.05] border-l border-white/[0.06] pl-3">
            {articleNodes.map((a, i) => (
              <li
                key={a.id}
                className="flex items-baseline gap-2 py-1.5 text-[13px] leading-snug text-neutral-300"
              >
                <span className="w-6 shrink-0 font-mono text-[9px] tracking-[0.1em] text-neutral-700">
                  {(i + 1).toString().padStart(2, '0')}
                </span>
                <span>{a.type === 'article' && a.shortTitle ? a.shortTitle : a.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (node.type === 'article') {
    return (
      <div className="flex flex-col gap-4">
        {node.shortTitle && <Field label="Título curto">{node.shortTitle}</Field>}
        {node.fullTitle && <Field label="Título completo">{node.fullTitle}</Field>}
        {node.originalTechnology && (
          <Field label="Tecnologia">{node.originalTechnology}</Field>
        )}
        {node.application && <Field label="Aplicação">{node.application}</Field>}
        {node.context && <Field label="Contexto">{node.context}</Field>}
        {node.applicationArea && (
          <Field label="Área de aplicação">{node.applicationArea}</Field>
        )}
        {node.reference && <Field label="Referência">{node.reference}</Field>}
      </div>
    );
  }

  const articleCount = payload.edges.filter(
    (e) => e.data.type === 'article_to_application_area' && e.data.target === node.id,
  ).length;
  return (
    <div className="flex gap-6">
      <Counter label="Artigos" value={articleCount} />
    </div>
  );
}

function Counter({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500">
        {label}
      </span>
      <span className="font-mono text-2xl leading-none text-neutral-50 tabular-nums">
        {value.toString().padStart(2, '0')}
      </span>
    </div>
  );
}

function SectionLabel({
  children,
  suffix,
}: {
  children: React.ReactNode;
  suffix?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-500">
        {children}
      </span>
      {suffix && (
        <span className="font-mono text-[10px] tracking-[0.1em] text-neutral-700">
          · {suffix}
        </span>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-500">
        {label}
      </span>
      <span className="text-[13px] leading-snug text-neutral-100">{children}</span>
    </div>
  );
}
