# Regras de Renderização no Cytoscape.js

## Objetivo
Definir como o grafo deve ser desenhado visualmente na aplicação.

## Estratégia visual
O grafo deve ser tratado como um grafo tipado em 4 camadas:
1. `big_area`
2. `term`
3. `article`
4. `application_area`

A prioridade é legibilidade em apresentação, não densidade máxima de informação em tela.

## Layout recomendado
Usar layout hierárquico como padrão inicial.
Sugestão:
- `breadthfirst` para a visão inicial;
- direção preferencial da esquerda para a direita.

## Estilo por tipo de nó

### big_area
- tamanho maior;
- destaque visual forte;
- texto sempre visível.

### term
- tamanho intermediário;
- nó clicável principal da exploração;
- cor baseada na grande área ou categoria.

### article
- tamanho menor que `big_area`, porém maior que `application_area`;
- rótulo curto;
- detalhes completos apenas no painel lateral.

### application_area
- tamanho pequeno ou intermediário;
- função de fechamento da cadeia relacional.

## Arestas
- `big_area_to_term`: mais visível
- `term_to_article`: principal para navegação
- `article_to_application_area`: visível, mas menos dominante

## Zoom e pan
- permitir zoom manual;
- permitir pan livre;
- centralizar o grafo no carregamento inicial.

## Fit inicial
Na carga da página:
- rodar layout;
- chamar `fit()` com padding confortável.

## Filtros recomendados
A interface deve permitir:
- filtro por tipo de nó;
- filtro por grande área;
- busca textual por termo ou artigo;
- reset da visualização.
