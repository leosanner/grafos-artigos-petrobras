'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { GraphPayload, NodeType } from '@/lib/graph/types';
import type { GraphFilter } from '@/lib/graph/graph-lookups';
import ThemeToggle from '@/components/theme-toggle';

const NODE_TYPES: { type: NodeType; label: string; cssVar: string }[] = [
  { type: 'big_area', label: 'Grande área', cssVar: 'var(--node-big-area)' },
  { type: 'term', label: 'Termo', cssVar: 'var(--node-term)' },
  { type: 'article', label: 'Artigo', cssVar: 'var(--node-article)' },
  { type: 'application_area', label: 'Área AIA', cssVar: 'var(--node-application-area)' },
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

  const handleBigAreaChange = (nextId: string) => {
    onFilterChange({ ...filter, bigAreaId: nextId });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearchSubmit(searchQuery);
  };

  return (
    <div className="relative flex flex-wrap items-center gap-6 border-b border-[var(--border)] bg-[var(--surface)] px-6 py-3 font-mono text-[var(--foreground)]">

      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <div className="group relative flex items-center">
          <svg
            width="13"
            height="13"
            viewBox="0 0 14 14"
            aria-hidden="true"
            className="absolute left-0 text-[var(--muted)] transition-colors group-focus-within:text-[var(--accent)]"
          >
            <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.2" fill="none" />
            <path d="M9 9 L13 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="buscar nó"
            className="w-56 border-b border-[var(--border-strong)] bg-transparent py-1.5 pl-5 pr-2 text-[13px] text-[var(--foreground)] placeholder:text-[var(--subtle)] outline-none transition-colors focus:border-[var(--accent)]"
          />
        </div>
        <button
          type="submit"
          className="text-[10px] uppercase tracking-[0.22em] text-[var(--muted)] transition-colors hover:text-[var(--accent-hover)]"
        >
          ↵ Exec
        </button>
      </form>

      <Divider />

      <FilterGroup
        activeCount={filter.types.size}
        totalCount={NODE_TYPES.length}
      >
        <div className="flex items-stretch overflow-hidden rounded-[3px] border border-[var(--border-strong)] bg-[var(--surface-muted)]">
          {NODE_TYPES.map(({ type, label, cssVar }, i) => {
            const active = filter.types.has(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleTypeToggle(type)}
                aria-pressed={active}
                className={`group relative flex items-center gap-2 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] transition-colors ${
                  i > 0 ? 'border-l border-[var(--border-strong)]' : ''
                } ${
                  active
                    ? 'bg-[var(--surface)] text-[var(--foreground)]'
                    : 'text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--muted-strong)]'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="flex h-2 w-2 shrink-0 items-center justify-center"
                >
                  <span
                    className="h-2 w-2 transition-all"
                    style={{
                      backgroundColor: active ? cssVar : 'transparent',
                      border: active ? 'none' : `1px solid ${cssVar}`,
                      boxShadow: active ? `0 0 6px ${cssVar}55` : 'none',
                      opacity: active ? 1 : 0.7,
                    }}
                  />
                </span>
                <span className="tabular-nums">{label}</span>
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0 h-[2px] origin-center transition-transform ${
                    active ? 'scale-x-100' : 'scale-x-0'
                  }`}
                  style={{ backgroundColor: cssVar }}
                />
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <Divider />

      <AreaSelector
        value={filter.bigAreaId}
        options={bigAreas.map((n) => ({ id: n.data.id, label: n.data.label }))}
        onChange={handleBigAreaChange}
      />

      <div className="ml-auto flex items-center gap-3">
        <span className="hidden items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[var(--muted)] sm:inline-flex">
          <span
            aria-hidden="true"
            className="inline-flex items-center gap-[2px]"
          >
            <span className="h-2 w-[3px] rounded-[1px] bg-[var(--brand-green)]" />
            <span className="h-2 w-[3px] rounded-[1px] bg-[var(--brand-yellow)]" />
            <span className="h-2 w-[3px] rounded-[1px] bg-[var(--brand-blue)]" />
          </span>
          <span>
            petrobras <span className="text-[var(--subtle)]">·</span> aia
          </span>
        </span>
        <ThemeToggle />
      </div>
    </div>
  );
}

function Divider() {
  return <span className="h-6 w-px bg-[var(--border-strong)]" aria-hidden="true" />;
}

function SectionLabel({
  index,
  children,
  suffix,
}: {
  index: string;
  children: React.ReactNode;
  suffix?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-start leading-none">
      <span className="font-mono text-[9px] tabular-nums tracking-[0.2em] text-[var(--subtle)]">
        {index}
      </span>
      <span className="mt-1 flex items-baseline gap-1.5 text-[10px] uppercase tracking-[0.24em] text-[var(--muted-strong)]">
        <span>{children}</span>
        {suffix && (
          <span className="font-mono text-[9px] tabular-nums tracking-[0.15em] text-[var(--subtle)]">
            {suffix}
          </span>
        )}
      </span>
    </div>
  );
}

function FilterGroup({
  activeCount,
  totalCount,
  children,
}: {
  activeCount: number;
  totalCount: number;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <SectionLabel
        index="01"
        suffix={`${activeCount.toString().padStart(2, '0')}/${totalCount
          .toString()
          .padStart(2, '0')}`}
      >
        camadas
      </SectionLabel>
      {children}
    </div>
  );
}

function AreaSelector({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { id: string; label: string }[];
  onChange: (nextId: string) => void;
}) {
  const isAll = value === 'all';
  const items = [{ id: 'all', label: 'todas as áreas' }, ...options];
  const selectedIndex = Math.max(
    items.findIndex((o) => o.id === value),
    0,
  );
  const selectedLabel = items[selectedIndex].label;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    setActiveIndex(selectedIndex);
  }, [open, selectedIndex]);

  useEffect(() => {
    if (!open) return;
    const onDocDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLLIElement>(
      `[data-index="${activeIndex}"]`,
    );
    el?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex]);

  const commit = (i: number) => {
    onChange(items[i].id);
    setOpen(false);
  };

  const handleTriggerKey = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(true);
    }
  };

  const handleListKey = (e: ReactKeyboardEvent<HTMLUListElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % items.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + items.length) % items.length);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(items.length - 1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      commit(activeIndex);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <SectionLabel
        index="02"
        suffix={options.length.toString().padStart(2, '0')}
      >
        escopo
      </SectionLabel>
      <div ref={rootRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          onKeyDown={handleTriggerKey}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          className={`group relative flex h-[30px] min-w-[13rem] items-center gap-2 overflow-hidden rounded-[3px] border bg-[var(--surface-muted)] pl-3 pr-2.5 text-left transition-colors ${
            open
              ? 'border-[var(--accent)]'
              : 'border-[var(--border-strong)] hover:border-[var(--accent-soft)]'
          }`}
        >
          <span
            aria-hidden="true"
            className="flex h-2 w-2 shrink-0 items-center justify-center"
          >
            <span
              className="h-2 w-2 transition-all"
              style={{
                backgroundColor: isAll ? 'transparent' : 'var(--accent)',
                border: isAll ? '1px solid var(--muted)' : 'none',
                boxShadow: isAll ? 'none' : '0 0 6px var(--accent-soft)',
                opacity: isAll ? 0.7 : 1,
              }}
            />
          </span>
          <span
            className="block min-w-0 flex-1 truncate text-[10px] uppercase tracking-[0.18em] text-[var(--foreground)]"
            title={selectedLabel}
          >
            {selectedLabel}
          </span>
          <span
            aria-hidden="true"
            className="ml-1 font-mono text-[9px] tabular-nums tracking-[0.1em] text-[var(--subtle)]"
          >
            {isAll ? options.length.toString().padStart(2, '0') : '01'}
          </span>
          <span aria-hidden="true" className="h-4 w-px bg-[var(--border-strong)]" />
          <svg
            width="9"
            height="9"
            viewBox="0 0 10 10"
            aria-hidden="true"
            className={`text-[var(--muted)] transition-transform duration-200 ${
              open ? 'rotate-180' : ''
            }`}
          >
            <path
              d="M2 4 L5 7 L8 4"
              stroke="currentColor"
              fill="none"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            aria-hidden="true"
            className={`absolute inset-x-0 bottom-0 h-[2px] origin-center bg-[var(--accent)] transition-transform ${
              isAll ? 'scale-x-0' : 'scale-x-100'
            }`}
          />
        </button>

        {open && (
          <div
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-50"
            style={{ minWidth: '17rem' }}
          >
            <div className="relative rounded-[3px] border border-[var(--border-strong)] bg-[var(--surface)] shadow-[0_14px_40px_-18px_rgba(0,0,0,0.35)]">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-[var(--accent)]"
              />
              <div className="flex items-baseline justify-between border-b border-[var(--border)] px-3 py-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[var(--subtle)]">
                  selecione escopo
                </span>
                <span className="font-mono text-[9px] tabular-nums tracking-[0.1em] text-[var(--subtle)]">
                  {items.length.toString().padStart(2, '0')}
                </span>
              </div>
              <ul
                ref={listRef}
                id={listId}
                role="listbox"
                aria-activedescendant={`${listId}-${activeIndex}`}
                tabIndex={-1}
                onKeyDown={handleListKey}
                autoFocus
                className="max-h-72 overflow-y-auto py-1 outline-none"
              >
                {items.map((o, i) => {
                  const isSelected = o.id === value;
                  const isActive = i === activeIndex;
                  const indexLabel = i === 0 ? '—' : i.toString().padStart(2, '0');
                  return (
                    <li
                      key={o.id}
                      id={`${listId}-${i}`}
                      data-index={i}
                      role="option"
                      aria-selected={isSelected}
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => commit(i)}
                      className={`group/opt relative flex cursor-pointer items-center gap-3 px-3 py-1.5 transition-colors ${
                        isActive
                          ? 'bg-[var(--surface-muted)] text-[var(--foreground)]'
                          : 'text-[var(--muted-strong)]'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`absolute inset-y-1 left-0 w-[2px] transition-opacity ${
                          isSelected ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{ background: 'var(--accent)' }}
                      />
                      <span className="w-6 shrink-0 font-mono text-[9px] tabular-nums tracking-[0.15em] text-[var(--subtle)]">
                        {indexLabel}
                      </span>
                      <span
                        aria-hidden="true"
                        className="flex h-2 w-2 shrink-0 items-center justify-center"
                      >
                        <span
                          className="h-2 w-2 transition-all"
                          style={{
                            backgroundColor:
                              isSelected && i !== 0
                                ? 'var(--accent)'
                                : 'transparent',
                            border:
                              isSelected && i !== 0
                                ? 'none'
                                : `1px solid ${
                                    isActive ? 'var(--muted-strong)' : 'var(--border-strong)'
                                  }`,
                            opacity: isSelected && i !== 0 ? 1 : isActive ? 0.9 : 0.6,
                          }}
                        />
                      </span>
                      <span className="flex-1 truncate text-[11px] tracking-[0.04em]">
                        {o.label}
                      </span>
                      {isSelected && (
                        <svg
                          width="9"
                          height="9"
                          viewBox="0 0 10 10"
                          aria-hidden="true"
                          className="shrink-0 text-[var(--accent)]"
                        >
                          <path
                            d="M2 5.5 L4.2 7.8 L8 3"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
