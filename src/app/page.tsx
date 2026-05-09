import type { Metadata } from 'next';
import Link from 'next/link';

const products = [
  {
    id: '01',
    title: 'Explorador AIA',
    href: 'https://resultados-aia.vercel.app/',
    platform: 'Vercel',
    accent: 'var(--accent-green)',
    tagline: 'Visao geral relacional',
    description:
      'Visao geral de areas, termos e pesquisas em avaliacao de impacto ambiental.',
  },
  {
    id: '02',
    title: 'AIA Insight',
    href: 'https://rag-artigos-aia-petrobras.vercel.app/',
    platform: 'Vercel',
    accent: 'var(--accent-yellow)',
    tagline: 'Consulta documental RAG',
    description:
      'Exploracao documental com RAG, governanca e rastreabilidade para consultas auditaveis.',
  },
  {
    id: '03',
    title: 'POC Classificador AIA',
    href: 'https://poc-classificador-aia.streamlit.app/',
    platform: 'Streamlit',
    accent: 'var(--accent-red)',
    tagline: 'Prototipo experimental',
    description:
      'Prototipo publicado para experimentos de classificacao ligados ao contexto de AIA.',
  },
] as const;

export const metadata: Metadata = {
  title: 'Expositiva Petrobras | Produtos',
  description: 'Portal de entrada para o grafo e os produtos desenvolvidos no projeto AIA.',
};

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[var(--paper)] text-[var(--ink)]" style={{ fontFamily: 'var(--font-plex-sans), system-ui, sans-serif' }}>
      {/* TOP BAR */}
      <header className="border-b border-[var(--rule)]">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-6 py-4 sm:px-10 lg:px-14">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="grid h-7 w-7 place-items-center border border-[var(--rule)] bg-[var(--accent-green)] text-[10px] font-semibold text-white"
              style={{ fontFamily: 'var(--font-plex-mono), monospace' }}
            >
              ✦
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.26em] text-[var(--ink-soft)]">
              Expositiva <span className="text-[var(--ink)]">/ Petrobras</span>
            </span>
          </div>
          <div className="hidden items-center gap-6 sm:flex">
            <span className="font-mono text-[11px] uppercase tracking-[0.26em] text-[var(--ink-soft)]">
              Edicao 002 · 2026
            </span>
            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.26em] text-[var(--ink-soft)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-green)]" />
              AIA · Live
            </span>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="border-b border-[var(--rule)]">
        <div className="mx-auto grid w-full max-w-[1280px] gap-12 px-6 py-16 sm:px-10 lg:grid-cols-[1.4fr_0.85fr] lg:gap-16 lg:px-14 lg:py-24">
          <div>
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ink-soft)]">
              <span className="h-px w-10 bg-[var(--rule)]" />
              <span>§ 01 — Plataforma do projeto</span>
            </div>

            <h1
              className="mt-8 max-w-[18ch] text-[clamp(2.6rem,6vw,5.4rem)] font-normal leading-[1.02] tracking-[-0.02em] text-[var(--ink)]"
              style={{ fontFamily: 'var(--font-display), Georgia, serif', fontVariationSettings: '"opsz" 144, "SOFT" 30' }}
            >
              Um ponto de entrada para o{' '}
              <span className="relative whitespace-nowrap">
                <span className="italic" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80' }}>grafo</span>
                <span aria-hidden="true" className="absolute -bottom-1 left-0 right-0 h-[3px] bg-[var(--accent-green)]" />
              </span>{' '}
              e os produtos da pesquisa.
            </h1>

            <p className="mt-8 max-w-xl text-[15px] leading-8 text-[var(--ink-soft)]">
              Esta landing organiza o ecossistema do projeto em uma unica
              superficie: exploracao visual das relacoes, consulta documental
              com RAG e prototipos experimentais publicados.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/graph" className="cta cta-primary">
                <span className="inline-flex items-center gap-3">
                  <span aria-hidden="true" className="cta-led" />
                  Abrir grafo interativo
                </span>
                <span aria-hidden="true" className="cta-arrows">
                  <span>→</span>
                  <span>→</span>
                </span>
              </Link>

              <a
                href={products[0].href}
                target="_blank"
                rel="noreferrer"
                className="cta cta-secondary"
              >
                <span className="inline-flex items-center gap-3">
                  <span aria-hidden="true" className="cta-led" />
                  Ver produtos publicados
                </span>
                <span aria-hidden="true" className="cta-arrows">
                  <span>↗</span>
                  <span>↗</span>
                </span>
              </a>
            </div>

            {/* meta */}
            <dl className="mt-14 grid max-w-xl grid-cols-3 gap-x-8 border-t border-[var(--hairline)] pt-6">
              <MetaCell label="Aplicacoes" value="03" />
              <MetaCell label="Grafo" value="01" />
              <MetaCell label="Edicao" value="2026" />
            </dl>
          </div>

          {/* INDEX */}
          <aside className="lg:pt-2">
            <div className="border border-[var(--rule)] bg-[var(--paper)]">
              <div className="flex items-center justify-between border-b border-[var(--rule)] px-5 py-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ink-soft)]">
                  Indice
                </p>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--ink-soft)]">
                  04 acessos
                </p>
              </div>
              <ul>
                <IndexRow
                  index="00"
                  label="Grafo interativo"
                  detail="Mapa relacional · areas, termos, artigos"
                  href="/graph"
                  accent="var(--accent-green)"
                  internal
                />
                {products.map((p, i) => (
                  <IndexRow
                    key={p.href}
                    index={String(i + 1).padStart(2, '0')}
                    label={p.title}
                    detail={p.platform}
                    href={p.href}
                    accent={p.accent}
                  />
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="border-b border-[var(--rule)]">
        <div className="mx-auto w-full max-w-[1280px] px-6 py-16 sm:px-10 lg:px-14 lg:py-24">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ink-soft)]">
                <span className="h-px w-10 bg-[var(--rule)]" />
                <span>§ 02 — Produtos publicados</span>
              </div>
              <h2
                className="mt-6 max-w-[20ch] text-[clamp(1.9rem,3.6vw,2.9rem)] font-normal leading-[1.05] tracking-[-0.018em]"
                style={{ fontFamily: 'var(--font-display), Georgia, serif', fontVariationSettings: '"opsz" 96, "SOFT" 30' }}
              >
                Tres entregas em ambiente publicado.
              </h2>
            </div>
            <p className="max-w-md text-[14px] leading-7 text-[var(--ink-soft)]">
              Cada card leva direto para uma entrega do projeto, com foco em
              uso pratico e navegacao imediata.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {products.map((product) => (
              <a
                key={product.href}
                href={product.href}
                target="_blank"
                rel="noreferrer"
                className="group relative flex flex-col border border-[var(--rule)] bg-[var(--paper)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-hard-sm)]"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-[3px]"
                  style={{ background: product.accent }}
                />

                <div className="flex items-start justify-between border-b border-[var(--hairline)] px-6 pt-6 pb-5">
                  <span
                    className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ink-soft)]"
                  >
                    {product.id} · {product.tagline}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--ink-soft)]">
                    {product.platform}
                  </span>
                </div>

                <div className="flex flex-1 flex-col px-6 py-7">
                  <h3
                    className="text-[1.6rem] font-normal leading-[1.1] tracking-[-0.014em]"
                    style={{ fontFamily: 'var(--font-display), Georgia, serif', fontVariationSettings: '"opsz" 48, "SOFT" 30' }}
                  >
                    {product.title}
                  </h3>

                  <p className="mt-4 flex-1 text-[14px] leading-7 text-[var(--ink-soft)]">
                    {product.description}
                  </p>

                  <div className="mt-8 flex items-center justify-between border-t border-[var(--hairline)] pt-5">
                    <span className="font-mono text-[11px] uppercase tracking-[0.26em] text-[var(--ink-soft)]">
                      Abrir projeto
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-[16px] text-[var(--ink)] transition-transform duration-200 group-hover:translate-x-0.5"
                    >
                      ↗
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* GRAPH CALLOUT + PANORAMA */}
      <section className="border-b border-[var(--rule)]">
        <div className="mx-auto grid w-full max-w-[1280px] gap-6 px-6 py-16 sm:px-10 lg:grid-cols-[1.25fr_0.85fr] lg:px-14 lg:py-20">
          <div className="relative border border-[var(--rule)] bg-[var(--paper-strong)] p-8 sm:p-10">
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[3px] bg-[var(--accent-green)]"
            />

            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ink-soft)]">
              <span className="h-px w-10 bg-[var(--rule)]" />
              <span>§ 03 — Ambiente local</span>
            </div>

            <h2
              className="mt-6 max-w-2xl text-[clamp(1.7rem,3.2vw,2.5rem)] font-normal leading-[1.1] tracking-[-0.016em]"
              style={{ fontFamily: 'var(--font-display), Georgia, serif', fontVariationSettings: '"opsz" 96, "SOFT" 30' }}
            >
              O grafo segue como a camada de leitura relacional do projeto.
            </h2>
            <p className="mt-5 max-w-2xl text-[14px] leading-7 text-[var(--ink-soft)]">
              Para navegar entre grandes areas, termos, artigos e areas de
              aplicacao dentro desta base, o acesso interno permanece
              disponivel como experiencia de analise complementar aos
              produtos publicados.
            </p>
            <div className="mt-9">
              <Link href="/graph" className="cta cta-ghost">
                <span className="inline-flex items-center gap-3">
                  <span aria-hidden="true" className="cta-led" />
                  Entrar no grafo
                </span>
                <span aria-hidden="true" className="cta-arrows">
                  <span>→</span>
                  <span>→</span>
                </span>
              </Link>
            </div>
          </div>

          <div className="border border-[var(--rule)] bg-[var(--paper)]">
            <div className="flex items-center justify-between border-b border-[var(--rule)] px-5 py-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ink-soft)]">
                Panorama
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--ink-soft)]">
                Snapshot
              </p>
            </div>
            <div className="grid grid-cols-2">
              <Metric value="03" label="Produtos externos" />
              <Metric value="01" label="Grafo interno" left />
              <Metric value="02" label="Apps em Vercel" top />
              <Metric value="01" label="App em Streamlit" top left />
            </div>
          </div>
        </div>
      </section>

      {/* COLOPHON */}
      <footer>
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start justify-between gap-2 px-6 py-6 sm:flex-row sm:items-center sm:px-10 lg:px-14">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ink-soft)]">
            Expositiva Petrobras · AIA · 2026
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ink-soft)]">
            Next 16 · React 19 · Tailwind v4
          </p>
        </div>
      </footer>
    </main>
  );
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--ink-soft)]">
        {label}
      </dt>
      <dd
        className="mt-1.5 text-[1.6rem] font-normal leading-none tracking-[-0.01em]"
        style={{ fontFamily: 'var(--font-display), Georgia, serif', fontVariationSettings: '"opsz" 48, "SOFT" 30' }}
      >
        {value}
      </dd>
    </div>
  );
}

function IndexRow({
  index,
  label,
  detail,
  href,
  accent,
  internal = false,
}: {
  index: string;
  label: string;
  detail: string;
  href: string;
  accent: string;
  internal?: boolean;
}) {
  const className =
    'group relative flex items-center justify-between gap-4 border-b border-[var(--hairline)] px-5 py-4 transition-colors last:border-b-0 hover:bg-[var(--paper-strong)]';

  const content = (
    <>
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 transition-transform duration-200 group-hover:scale-y-100"
        style={{ background: accent }}
      />
      <div className="flex min-w-0 items-center gap-4">
        <span className="font-mono text-[11px] tabular-nums text-[var(--ink-soft)]">
          {index}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[14px] font-medium text-[var(--ink)]">
            {label}
          </p>
          <p className="mt-0.5 truncate font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--ink-soft)]">
            {detail}
          </p>
        </div>
      </div>
      <span
        aria-hidden="true"
        className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--ink-soft)] transition-colors group-hover:text-[var(--ink)]"
      >
        {internal ? 'Entrar →' : 'Abrir ↗'}
      </span>
    </>
  );

  if (internal) {
    return (
      <li>
        <Link href={href} className={className}>
          {content}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {content}
      </a>
    </li>
  );
}

function Metric({
  value,
  label,
  top = false,
  left = false,
}: {
  value: string;
  label: string;
  top?: boolean;
  left?: boolean;
}) {
  return (
    <div
      className={[
        'p-5',
        top ? 'border-t border-[var(--hairline)]' : '',
        left ? 'border-l border-[var(--hairline)]' : '',
      ].join(' ')}
    >
      <p
        className="text-[2.4rem] font-normal leading-none tracking-[-0.02em]"
        style={{ fontFamily: 'var(--font-display), Georgia, serif', fontVariationSettings: '"opsz" 72, "SOFT" 30' }}
      >
        {value}
      </p>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--ink-soft)]">
        {label}
      </p>
    </div>
  );
}
