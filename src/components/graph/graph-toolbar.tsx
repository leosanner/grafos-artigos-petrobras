'use client';

import type { ChangeEvent, FormEvent } from 'react';
import type { GraphPayload, NodeType } from '@/lib/graph/types';
import type { GraphFilter } from '@/lib/graph/graph-lookups';
import ThemeToggle from '@/components/theme-toggle';

const NODE_TYPES: { type: NodeType; label: string; color: string }[] = [
  { type: 'big_area', label: 'Grande área', color: '#16a34a' },
  { type: 'term', label: 'Termo', color: '#eab308' },
  { type: 'article', label: 'Artigo', color: '#2563eb' },
  { type: 'application_area', label: 'Área AIA', color: '#dc2626' },
];

interface Props {
  payload: GraphPayload;
  filter: GraphFilter;
  onFilterChange: (filter: GraphFilter) => void;
  searchQuery: string;
  onSearchSubmit: (query: string) => void;
  onSearchChange: (query: string) => void;
}

export default function GraphToolbar({
  payload,
  filter,
  onFilterChange,
  searchQuery,
  onSearchSubmit,
  onSearchChange,
}: Props) {
  const bigAreas = payload.nodes.filter((n) => n.data.type === 'big_area');

  const handleTypeToggle = (type: NodeType) => {
    const next = new Set(filter.types);
    if (next.has(type)) next.delete(type);
    else next.add(type);
    onFilterChange({ ...filter, types: next });
  };

  const handleBigAreaChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filter, bigAreaId: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearchSubmit(searchQuery);
  };

  return (
    <div className="relative flex flex-wrap items-center gap-6 border-b border-white/[0.06] bg-[#0a0a0b] px-6 py-3 font-mono text-neutral-100">
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.08) 80%, transparent)',
        }}
      />

      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <div className="group relative flex items-center">
          <svg
            width="13"
            height="13"
            viewBox="0 0 14 14"
            aria-hidden="true"
            className="absolute left-0 text-neutral-500 transition-colors group-focus-within:text-amber-400"
          >
            <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.2" fill="none" />
            <path d="M9 9 L13 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="buscar nó"
            className="w-56 border-b border-white/10 bg-transparent py-1.5 pl-5 pr-2 text-[13px] text-neutral-100 placeholder:text-neutral-600 outline-none transition-colors focus:border-amber-400"
          />
        </div>
        <button
          type="submit"
          className="text-[10px] uppercase tracking-[0.22em] text-neutral-500 transition-colors hover:text-amber-400"
        >
          ↵ Exec
        </button>
      </form>

      <Divider />

      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.22em] text-neutral-600">
          filtro
        </span>
        <div className="flex items-center gap-1.5">
          {NODE_TYPES.map(({ type, label, color }) => {
            const active = filter.types.has(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleTypeToggle(type)}
                aria-pressed={active}
                className={`group flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] transition-all ${
                  active
                    ? 'border-white/15 bg-white/[0.04] text-neutral-100'
                    : 'border-white/[0.06] text-neutral-500 hover:border-white/10 hover:text-neutral-300'
                }`}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full transition-all"
                  style={{
                    backgroundColor: active ? color : 'transparent',
                    boxShadow: active ? `0 0 8px ${color}` : 'none',
                    border: active ? 'none' : `1px solid ${color}70`,
                  }}
                />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <Divider />

      <label className="flex items-center gap-3">
        <span className="text-[10px] uppercase tracking-[0.22em] text-neutral-600">
          área
        </span>
        <div className="relative">
          <select
            value={filter.bigAreaId}
            onChange={handleBigAreaChange}
            className="cursor-pointer appearance-none border-b border-white/10 bg-transparent py-1 pl-0 pr-5 text-[12px] text-neutral-100 outline-none transition-colors focus:border-amber-400"
          >
            <option value="all" className="bg-[#0a0a0b] text-neutral-100">
              todas
            </option>
            {bigAreas.map((n) => (
              <option
                key={n.data.id}
                value={n.data.id}
                className="bg-[#0a0a0b] text-neutral-100"
              >
                {n.data.label}
              </option>
            ))}
          </select>
          <svg
            width="8"
            height="8"
            viewBox="0 0 10 10"
            aria-hidden="true"
            className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-neutral-500"
          >
            <path d="M2 4 L5 7 L8 4" stroke="currentColor" fill="none" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </label>

      <div className="ml-auto flex items-center gap-3">
        <span className="hidden text-[10px] uppercase tracking-[0.22em] text-neutral-700 sm:inline">
          petrobras · aia
        </span>
        <ThemeToggle />
      </div>
    </div>
  );
}

function Divider() {
  return <span className="h-5 w-px bg-white/[0.06]" aria-hidden="true" />;
}
