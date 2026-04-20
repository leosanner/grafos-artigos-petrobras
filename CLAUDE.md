# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start dev server on http://localhost:3000
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — ESLint (flat config, `eslint.config.mjs`)
- `npx tsc --noEmit` — type-check only (no `typecheck` script defined)

There is no test runner configured.

## Next.js version warning

This repo uses **Next.js 16** with React 19 and the React Compiler (`babel-plugin-react-compiler`). APIs, conventions, and file structure differ from older versions you may have seen in training data. Before writing non-trivial Next-specific code, consult `node_modules/next/dist/docs/` for the exact version installed — do not assume Next 13/14 behavior.

## Architecture

This is a graph-visualization project combining two graph libraries that serve different purposes:

- **React Flow** (`@xyflow/react`, v12) — node-based editors, interactive diagrams with draggable nodes. Package was renamed from `reactflow` to `@xyflow/react`; import is named (`import { ReactFlow } from '@xyflow/react'`) and styles come from `@xyflow/react/dist/style.css`.
- **Cytoscape.js** (`cytoscape`) — graph-theory layouts and analysis (force-directed, etc.). Imperative API: mount into a DOM ref in `useEffect`, call `cy.destroy()` on cleanup to avoid leaks.

Both libraries require the DOM, so any component that uses them **must be a Client Component** (`'use client'`). Next 16 forbids `next/dynamic` with `ssr: false` inside Server Components — the `dynamic(() => …, { ssr: false })` call itself must live in a Client Component. Pattern used here: server page (`src/app/page.tsx`) imports from `src/components/graphs.tsx` (a `'use client'` wrapper) which is where the dynamic imports of `flow-graph.tsx` / `cytoscape-graph.tsx` happen.

Directory layout (`src/` is the import root, aliased as `@/*`):
- `src/app/` — App Router routes, layouts, and global CSS (`globals.css` loads Tailwind v4 via `@tailwindcss/postcss`).
- `src/components/` — `graphs.tsx` (client wrapper with dynamic imports) and the actual graph components (`flow-graph.tsx`, `cytoscape-graph.tsx`).

Tailwind is v4 (PostCSS-based); there is no `tailwind.config.*` — configuration lives in CSS via `@theme` directives if needed.
