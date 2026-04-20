import type { StylesheetJson } from 'cytoscape';

export const graphStylesheet: StylesheetJson = [
  {
    selector: 'node',
    style: {
      label: 'data(label)',
      'text-valign': 'center',
      'text-halign': 'center',
      color: '#f8fafc',
      'font-size': 9,
      'text-outline-color': '#0a0a0a',
      'text-outline-width': 3,
      'border-width': 0,
    },
  },
  {
    selector: 'node[type = "big_area"]',
    style: {
      'background-color': '#16a34a',
      width: 60,
      height: 60,
      'font-size': 13,
      'font-weight': 'bold',
    },
  },
  {
    selector: 'node[type = "term"]',
    style: {
      'background-color': '#eab308',
      width: 28,
      height: 28,
      'font-size': 9,
    },
  },
  {
    selector: 'node[type = "article"]',
    style: {
      'background-color': '#2563eb',
      width: 18,
      height: 18,
      'font-size': 8,
    },
  },
  {
    selector: 'node[type = "application_area"]',
    style: {
      'background-color': '#dc2626',
      width: 22,
      height: 22,
      'font-size': 9,
    },
  },
  {
    selector: 'edge',
    style: {
      'curve-style': 'bezier',
      'target-arrow-shape': 'none',
      'line-opacity': 0.35,
      width: 0.9,
    },
  },
  {
    selector: 'edge[type = "big_area_to_term"]',
    style: {
      'line-color': '#eab308',
    },
  },
  {
    selector: 'edge[type = "term_to_article"]',
    style: {
      'line-color': '#3b82f6',
    },
  },
  {
    selector: 'edge[type = "article_to_application_area"]',
    style: {
      'line-color': '#ef4444',
    },
  },
  {
    selector: '.faded',
    style: {
      opacity: 0.15,
      'text-opacity': 0.15,
    },
  },
  {
    selector: 'node.highlighted',
    style: {
      'border-width': 2,
      'border-color': '#facc15',
    },
  },
  {
    selector: 'node.selected',
    style: {
      'border-width': 4,
      'border-color': '#facc15',
    },
  },
  {
    selector: 'edge.highlighted',
    style: {
      width: 2,
      'line-color': '#facc15',
      'line-opacity': 0.9,
    },
  },
  {
    selector: '.hidden',
    style: {
      display: 'none',
    },
  },
];
