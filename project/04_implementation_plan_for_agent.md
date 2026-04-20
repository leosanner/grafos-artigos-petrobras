# Plano de Implementação para o Agente

## Objetivo
Guiar a implementação da visualização do grafo em uma aplicação web com Next.js e TypeScript usando Cytoscape.js.

## Stack prevista
- Next.js
- TypeScript
- Cytoscape.js
- JSON local como fonte inicial de dados

## Objetivo funcional
Construir uma página que:
- carregue o JSON do grafo;
- renderize os nós e arestas;
- permita clique, busca, destaque e reset;
- apresente metadados em um painel lateral.

## Estrutura sugerida de arquivos

### `data/cytoscape_aia_graph.json`
Fonte principal de dados.

### `lib/graph/types.ts`
Tipos TypeScript para nós, arestas e payload do grafo.

### `lib/graph/load-graph.ts`
Função utilitária para carregar e validar o JSON.

### `lib/graph/cytoscape-style.ts`
Definição dos estilos do Cytoscape.js.

### `lib/graph/cytoscape-layout.ts`
Configuração do layout inicial e layouts auxiliares.

### `components/graph/GraphCanvas.tsx`
Componente principal do Cytoscape.

### `components/graph/SidePanel.tsx`
Painel lateral com metadados do nó selecionado.

### `components/graph/GraphToolbar.tsx`
Busca, filtros e botão de reset.

### `app/.../page.tsx`
Página final que compõe toolbar, canvas e painel.

## Fases de implementação

### Fase 1 — Base estrutural
- criar tipos TypeScript;
- carregar JSON;
- renderizar grafo básico;
- validar nós e arestas.

### Fase 2 — Estilo e layout
- aplicar estilo por tipo;
- configurar layout inicial;
- garantir fit e zoom adequados.

### Fase 3 — Interação
- clique em nó;
- destaque de vizinhança;
- fade nos demais;
- reset.

### Fase 4 — Painel lateral
- exibir metadados;
- adaptar conteúdo conforme tipo do nó.

### Fase 5 — Busca e filtros
- busca textual;
- filtro por tipo;
- filtro por grande área;
- reset global.

## Critérios de aceite
A implementação será considerada pronta quando:
- o JSON carregar corretamente;
- o grafo renderizar sem erro;
- os 4 tipos de nó estiverem visualmente distintos;
- o clique destacar conexões corretamente;
- o painel lateral exibir metadados úteis;
- a busca localizar termos e artigos;
- o reset restaurar o estado inicial.
