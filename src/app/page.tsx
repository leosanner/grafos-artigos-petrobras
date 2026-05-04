import type { Metadata } from 'next';
import Link from 'next/link';

const products = [
  {
    id: '01',
    title: 'Explorador AIA',
    href: 'https://resultados-aia.vercel.app/',
    platform: 'Vercel',
    accent: 'from-emerald-500/18 via-emerald-500/6 to-transparent',
    description:
      'Visao geral de areas, termos e pesquisas em avaliacao de impacto ambiental.',
  },
  {
    id: '02',
    title: 'AIA Insight',
    href: 'https://rag-artigos-aia-petrobras.vercel.app/',
    platform: 'Vercel',
    accent: 'from-sky-500/18 via-sky-500/6 to-transparent',
    description:
      'Exploracao documental com RAG, governanca e rastreabilidade para consultas auditaveis.',
  },
  {
    id: '03',
    title: 'POC Classificador AIA',
    href: 'https://poc-classificador-aia.streamlit.app/',
    platform: 'Streamlit',
    accent: 'from-amber-400/18 via-amber-400/6 to-transparent',
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
    <main className="relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <section className="relative border-b border-[var(--border)]">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[1.35fr_0.9fr] lg:px-14 lg:py-20">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-3 rounded-full border border-[var(--border-strong)] bg-[var(--surface)]/80 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)] backdrop-blur">
              Plataforma do projeto
            </span>

            <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-[var(--foreground)] sm:text-5xl lg:text-7xl">
              Um ponto de entrada para o grafo e os produtos que nasceram da
              pesquisa.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted-strong)] sm:text-lg">
              Esta landing page organiza o ecossistema do projeto em uma unica
              superficie: exploracao visual das relacoes, consulta documental com
              RAG e prototipos experimentais publicados.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/graph"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[var(--brand-green)] px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[var(--brand-green-deep)]"
              >
                Abrir grafo interativo
                <span aria-hidden="true" className="text-base">
                  ↗
                </span>
              </Link>
              <a
                href={products[0].href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-[var(--border-strong)] bg-[var(--surface)]/75 px-6 py-3 text-sm font-semibold text-[var(--foreground)] backdrop-blur transition-colors hover:border-[var(--accent-soft)] hover:text-[var(--accent)]"
              >
                Ver produtos publicados
                <span aria-hidden="true" className="text-base">
                  ↗
                </span>
              </a>
            </div>
          </div>

          <aside className="relative overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface)]/88 p-6 shadow-[0_24px_80px_-36px_rgba(0,0,0,0.3)] backdrop-blur sm:p-8">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, var(--brand-yellow) 18%, var(--brand-green) 50%, transparent 100%)',
              }}
            />

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
                  Navegacao rapida
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
                  Quatro pontos de acesso
                </h2>
              </div>
              <span className="rounded-full border border-[var(--border-strong)] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
                03 apps + grafo
              </span>
            </div>

            <div className="mt-8 space-y-4">
              <QuickLink
                label="Grafo interativo"
                detail="Mapeamento relacional entre areas, termos, artigos e aplicacoes."
                href="/graph"
                internal
              />
              {products.map((product) => (
                <QuickLink
                  key={product.href}
                  label={product.title}
                  detail={product.platform}
                  href={product.href}
                />
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-6 py-12 sm:px-10 lg:px-14 lg:py-18">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
              Produtos desenvolvidos
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Experiencias publicadas para consulta, exploracao e prototipagem.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-[var(--muted-strong)]">
            Cada card leva direto para uma entrega do projeto em ambiente
            publicado, com foco em uso pratico e navegacao imediata.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {products.map((product) => (
            <a
              key={product.href}
              href={product.href}
              target="_blank"
              rel="noreferrer"
              className="group relative overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-7 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.4)] transition-transform duration-300 hover:-translate-y-1 hover:border-[var(--accent-soft)]"
            >
              <div
                aria-hidden="true"
                className={`absolute inset-0 bg-gradient-to-br ${product.accent} opacity-100 transition-opacity duration-300 group-hover:opacity-80`}
              />
              <div className="relative">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
                    [{product.id}]
                  </span>
                  <span className="rounded-full border border-[var(--border-strong)] bg-[var(--surface)]/80 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--muted)] backdrop-blur">
                    {product.platform}
                  </span>
                </div>

                <h3 className="mt-12 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                  {product.title}
                </h3>

                <p className="mt-4 min-h-24 text-sm leading-7 text-[var(--muted-strong)]">
                  {product.description}
                </p>

                <div className="mt-8 flex items-center justify-between gap-4 border-t border-[var(--border)] pt-5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
                    Abrir projeto
                  </span>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface)]/75 text-lg text-[var(--foreground)] transition-colors duration-300 group-hover:border-[var(--accent-soft)] group-hover:text-[var(--accent)]">
                    ↗
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-6 pb-14 sm:px-10 lg:px-14 lg:pb-20">
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="overflow-hidden rounded-[28px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_86%,var(--brand-green)_14%)] p-7 shadow-[0_24px_70px_-42px_rgba(0,0,0,0.36)] sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
              Ambiente local
            </p>
            <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-[-0.04em]">
              O grafo continua como a camada de leitura relacional do projeto.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted-strong)]">
              Para navegar entre grandes areas, termos, artigos e areas de
              aplicacao dentro desta base, o acesso interno permanece disponivel
              como experiencia de analise complementar aos produtos publicados.
            </p>
            <div className="mt-8">
              <Link
                href="/graph"
                className="inline-flex items-center gap-3 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent-soft)] hover:text-[var(--accent)]"
              >
                Entrar no grafo
                <span aria-hidden="true" className="text-base">
                  →
                </span>
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-7 shadow-[0_24px_70px_-42px_rgba(0,0,0,0.36)] sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
              Panorama
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <Metric value="03" label="Produtos externos" />
              <Metric value="01" label="Grafo interno" />
              <Metric value="02" label="Apps em Vercel" />
              <Metric value="01" label="App em Streamlit" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function QuickLink({
  label,
  detail,
  href,
  internal = false,
}: {
  label: string;
  detail: string;
  href: string;
  internal?: boolean;
}) {
  const className =
    'flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-4 transition-colors hover:border-[var(--accent-soft)] hover:bg-[color-mix(in_srgb,var(--surface-muted)_75%,var(--brand-yellow)_25%)]';

  const content = (
    <>
      <div>
        <p className="text-sm font-medium text-[var(--foreground)]">{label}</p>
        <p className="mt-1 text-sm text-[var(--muted)]">{detail}</p>
      </div>
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
        {internal ? 'Entrar' : 'Abrir'}
      </span>
    </>
  );

  if (internal) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {content}
    </a>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
      <p className="font-mono text-3xl leading-none text-[var(--foreground)]">{value}</p>
      <p className="mt-3 text-sm leading-6 text-[var(--muted-strong)]">{label}</p>
    </div>
  );
}
