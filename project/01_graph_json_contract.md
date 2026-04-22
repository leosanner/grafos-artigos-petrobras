# Contrato do JSON do Grafo

## Objetivo
Definir a estrutura canônica do arquivo `cytoscape_aia_graph.json` consumido pela aplicação.

## Estrutura raiz

```json
{
  "nodes": [],
  "edges": []
}
```

## Estrutura de nós

Cada item de `nodes` deve seguir o formato:

```json
{
  "data": {
    "id": "string",
    "label": "string",
    "type": "big_area | term | article | application_area"
  }
}
```

## Tipos de nó

### big_area
Representa a grande área temática principal.

Campos esperados:
- `id`
- `label`
- `type`

### term
Representa o termo principal específico associado aos artigos.

Campos esperados:
- `id`
- `label`
- `type`
- `bigArea`
- `description`
- `reference`

### article
Representa um artigo individual.

Campos esperados:
- `id`
- `label`
- `type`
- `shortTitle`
- `fullTitle`
- `originalTechnology`
- `application`
- `context`
- `applicationArea`
- `reference`

### application_area
Representa a área de aplicação/AIA.

Campos esperados:
- `id`
- `label`
- `type`

## Estrutura de arestas

Cada item de `edges` deve seguir o formato:

```json
{
  "data": {
    "id": "string",
    "source": "string",
    "target": "string",
    "type": "big_area_to_term | term_to_article | article_to_application_area"
  }
}
```

## Regras obrigatórias
- `id` deve ser único globalmente.
- `label` deve ser amigável para exibição.
- `type` deve ser usado para estilização e lógica de interação.
- Um artigo pode se ligar a múltiplos termos.
- Um termo pode se ligar a múltiplos artigos.
- Uma área de aplicação pode se ligar a múltiplos artigos.

## Regras de evolução
Ao adicionar novos dados:
- manter os mesmos tipos de nó;
- manter os mesmos tipos de aresta;
- preferir acrescentar metadados em `data` em vez de alterar a forma raiz do arquivo.
