'use client';

import { useMemo } from 'react';
import type {
  ArticleExternalOpenAccess,
  ArticleNode,
  GraphNode,
  GraphPayload,
  TermNode,
} from '@/lib/graph/types';

interface Props {
  payload: GraphPayload;
  selectedId: string | null;
  onClose: () => void;
}

export default function SidePanel({ payload, selectedId, onClose }: Props) {
  const node = useMemo(() => {
    if (!selectedId) return null;
    return payload.nodes.find((n) => n.data.id === selectedId)?.data ?? null;
  }, [payload, selectedId]);

  if (!node) return null;

  return (
    <aside className="relative flex h-full w-full flex-col overflow-hidden rounded-lg border-2 border-[color-mix(in_srgb,var(--foreground)_22%,var(--border-strong))] bg-[color-mix(in_srgb,var(--surface)_76%,black)] font-sans text-[var(--foreground)] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)] backdrop-blur-md">
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar detalhes"
        className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-strong)] text-[var(--muted)] transition-colors hover:border-[var(--accent-soft)] hover:text-[var(--accent)]"
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

      <div className="flex flex-col gap-5 overflow-y-auto px-7 py-6 pr-12">
        <header className="flex flex-col gap-3">
          <h2 className="text-[22px] font-medium leading-snug tracking-tight text-[var(--foreground)]">
            {node.type === 'article' && node.fullTitle ? node.fullTitle : node.label}
          </h2>
        </header>

        <HeaderDivider />

        <NodeDetails node={node} payload={payload} />
      </div>
    </aside>
  );
}

function HeaderDivider() {
  return (
    <span
      aria-hidden="true"
      className="h-px w-full"
      style={{
        background:
          'linear-gradient(90deg, rgba(255,255,255,0.22) 0%, var(--border-strong) 38%, var(--border) 74%, transparent 100%)',
      }}
    />
  );
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
      <div className="flex flex-col gap-6">
        <Field label="Grande área">{node.bigArea}</Field>
        {node.description && <Field label="Descrição">{node.description}</Field>}
        {node.reference && (
          <Field label="Referência">
            <TermReference reference={node.reference} />
          </Field>
        )}
        <div className="flex flex-col gap-3">
          <SectionLabel suffix={articleNodes.length.toString().padStart(2, '0')}>
            artigos
          </SectionLabel>
          <ul className="flex flex-col divide-y divide-[var(--border)] border-l border-[var(--border)] pl-3">
            {articleNodes.map((a, i) => (
              <li
                key={a.id}
                className="flex items-baseline gap-3 py-2 text-[15px] leading-snug text-[var(--muted-strong)]"
              >
                <span className="w-7 shrink-0 font-mono text-[10px] tracking-[0.1em] text-[var(--subtle)]">
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
    return <ArticleDetails node={node} />;
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

function TermReference({ reference }: { reference: TermNode['reference'] }) {
  if (!reference) return null;

  if (isExternalUrl(reference)) {
    return (
      <a
        href={reference}
        target="_blank"
        rel="noreferrer"
        className="break-all transition-colors hover:text-[var(--accent)]"
      >
        {reference}
      </a>
    );
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-3">
      <span>{reference}</span>
      <span className="rounded-full border border-[var(--border-strong)] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
        provisoria
      </span>
    </span>
  );
}

function ArticleDetails({ node }: { node: ArticleNode }) {
  const metadata = node.externalMetadata;
  const sourceValue = [metadata?.sourceName, metadata?.source].filter(Boolean).join(' · ');
  const openAccessValue = formatOpenAccess(metadata?.openAccess);
  const hasMetadata = Boolean(
    metadata?.doi ||
      metadata?.publicationDate ||
      sourceValue ||
      metadata?.citationCount !== undefined ||
      metadata?.fwci !== undefined ||
      openAccessValue,
  );

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
      <div className="flex flex-col gap-5">
        {node.originalTechnology && <Field label="Tecnologia">{node.originalTechnology}</Field>}
        {node.application && <Field label="Aplicação">{node.application}</Field>}
        {node.context && <Field label="Contexto">{node.context}</Field>}
        {node.applicationArea && <Field label="Área de aplicação">{node.applicationArea}</Field>}
        {node.reference && <Field label="Referência">{node.reference}</Field>}
      </div>

      {hasMetadata && (
        <div className="flex flex-col gap-5 border-t border-[var(--border)] pt-5 lg:border-t-0 lg:border-l lg:border-[var(--border)] lg:pl-8 lg:pt-0">
          <SectionLabel prominent>metadados</SectionLabel>
          {metadata?.doi && (
            <Field label="DOI">
              <a
                href={`https://doi.org/${metadata.doi}`}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-[var(--accent)]"
              >
                {metadata.doi}
              </a>
            </Field>
          )}
          {metadata?.publicationDate && (
            <Field label="Data">{formatDate(metadata.publicationDate)}</Field>
          )}
          {sourceValue && <Field label="Fonte">{sourceValue}</Field>}
          {metadata?.citationCount !== undefined && (
            <Field label="Citações">{formatNumber(metadata.citationCount)}</Field>
          )}
          {metadata?.fwci !== undefined && (
            <Field label="FWCI">{formatDecimal(metadata.fwci)}</Field>
          )}
          {openAccessValue && <Field label="Open access">{openAccessValue}</Field>}
        </div>
      )}
    </div>
  );
}

function Counter({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
        {label}
      </span>
      <span className="font-mono text-2xl leading-none text-[var(--foreground)] tabular-nums">
        {value.toString().padStart(2, '0')}
      </span>
    </div>
  );
}

function SectionLabel({
  children,
  suffix,
  prominent = false,
}: {
  children: React.ReactNode;
  suffix?: string;
  prominent?: boolean;
}) {
  return (
    <div
      className={
        prominent
          ? 'inline-flex items-center gap-2 self-start rounded-[2px] border border-[var(--foreground)] bg-[var(--surface)] px-3 py-2 shadow-[3px_3px_0_0_var(--border-strong)]'
          : 'flex items-center gap-2'
      }
    >
      <span
        className={
          prominent
            ? 'font-mono text-[12px] font-semibold uppercase tracking-[0.22em] text-[var(--foreground)]'
            : 'font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]'
        }
      >
        {children}
      </span>
      {suffix && (
        <span
          className={
            prominent
              ? 'font-mono text-[11px] tracking-[0.08em] text-[var(--muted-strong)]'
              : 'font-mono text-[11px] tracking-[0.1em] text-[var(--subtle)]'
          }
        >
          · {suffix}
        </span>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
        {label}
      </span>
      <div className="text-[17px] leading-[1.55] text-[var(--foreground)]">{children}</div>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(date);
}

function isExternalUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('pt-BR').format(value);
}

function formatDecimal(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatOpenAccess(openAccess?: ArticleExternalOpenAccess) {
  if (!openAccess) return '';

  const parts: string[] = [];
  if (typeof openAccess.isOa === 'boolean') {
    parts.push(openAccess.isOa ? 'Disponível' : 'Fechado');
  }
  if (openAccess.status) parts.push(openAccess.status);
  if (openAccess.license) parts.push(openAccess.license);

  return parts.join(' · ');
}
