import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-slate-900 dark:text-slate-100">
      <h1 className="text-2xl font-semibold">Expositiva Petrobras</h1>
      <Link
        href="/graph"
        className="rounded border border-slate-400 px-4 py-2 text-sm hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
      >
        Abrir grafo →
      </Link>
    </main>
  );
}
