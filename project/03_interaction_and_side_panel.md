# Comportamento de Interação e Painel Lateral

## Objetivo
Definir a lógica de interação do grafo e o conteúdo do painel lateral.

## Comportamento principal
Ao clicar em um nó:
- destacar o nó clicado;
- destacar sua vizinhança imediata;
- reduzir opacidade dos demais elementos;
- preencher o painel lateral com metadados relevantes.

## Comportamento por tipo de nó

### Clique em big_area
Mostrar:
- nome da grande área;
- quantidade de termos associados;
- quantidade de artigos relacionados.

### Clique em term
Mostrar:
- nome do termo;
- grande área;
- artigos associados.

### Clique em article
Mostrar:
- título curto;
- título completo;
- termo original;
- aplicação;
- contexto;
- área de aplicação;
- referência.

### Clique em application_area
Mostrar:
- nome da área;
- quantidade de artigos associados.

## Estado visual recomendado
Usar classes de estado:
- `selected`
- `highlighted`
- `faded`

## Reset
A interface deve ter botão de reset que:
- remove classes visuais;
- reexibe todos os nós com opacidade normal;
- limpa ou redefine o painel lateral.

## Busca
A busca deve:
- localizar por `label`, `shortTitle` ou `fullTitle`;
- centralizar no nó encontrado;
- aplicar o mesmo comportamento de seleção.

## Regra de UX
O usuário deve conseguir:
- clicar em qualquer nó;
- entender com quem ele se conecta;
- ver metadados sem poluir o grafo visualmente.
