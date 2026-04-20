import type { Core, NodeSingular } from 'cytoscape';

export function highlightNeighborhood(cy: Core, node: NodeSingular) {
  const neighborhood = node.closedNeighborhood();
  cy.elements().addClass('faded');
  neighborhood.removeClass('faded');
  neighborhood.edges().addClass('highlighted');
  neighborhood.nodes().not(node).addClass('highlighted');
  node.addClass('selected');
}

export function clearHighlight(cy: Core) {
  cy.elements().removeClass('faded highlighted selected');
}
