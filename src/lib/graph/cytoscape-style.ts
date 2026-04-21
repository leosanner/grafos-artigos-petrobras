import type { StylesheetJson } from 'cytoscape';

function readVar(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

export function buildGraphStylesheet(): StylesheetJson {
  const nodeText = readVar('--graph-node-text', '#f8fafc');
  const nodeTextOutline = readVar('--graph-node-text-outline', '#0a0a0a');
  const edgeOpacity = Number(readVar('--graph-edge-opacity', '0.35')) || 0.35;
  const highlight = readVar('--graph-highlight', '#facc15');

  const bigArea = readVar('--node-big-area', '#16a34a');
  const term = readVar('--node-term', '#eab308');
  const article = readVar('--node-article', '#2563eb');
  const applicationArea = readVar('--node-application-area', '#dc2626');

  const edgeBigToTerm = readVar('--edge-big-area-to-term', '#eab308');
  const edgeTermToArticle = readVar('--edge-term-to-article', '#3b82f6');
  const edgeArticleToApp = readVar('--edge-article-to-application-area', '#ef4444');

  return [
    {
      selector: 'node',
      style: {
        label: 'data(label)',
        'text-valign': 'center',
        'text-halign': 'center',
        color: nodeText,
        'font-size': 9,
        'text-outline-color': nodeTextOutline,
        'text-outline-width': 3,
        'border-width': 0,
      },
    },
    {
      selector: 'node[type = "big_area"]',
      style: {
        'background-color': bigArea,
        width: 60,
        height: 60,
        'font-size': 13,
        'font-weight': 'bold',
      },
    },
    {
      selector: 'node[type = "term"]',
      style: {
        'background-color': term,
        width: 28,
        height: 28,
        'font-size': 9,
      },
    },
    {
      selector: 'node[type = "article"]',
      style: {
        'background-color': article,
        width: 18,
        height: 18,
        'font-size': 8,
      },
    },
    {
      selector: 'node[type = "application_area"]',
      style: {
        'background-color': applicationArea,
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
        'line-opacity': edgeOpacity,
        width: 0.9,
      },
    },
    {
      selector: 'edge[type = "big_area_to_term"]',
      style: {
        'line-color': edgeBigToTerm,
      },
    },
    {
      selector: 'edge[type = "term_to_article"]',
      style: {
        'line-color': edgeTermToArticle,
      },
    },
    {
      selector: 'edge[type = "article_to_application_area"]',
      style: {
        'line-color': edgeArticleToApp,
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
        'border-color': highlight,
      },
    },
    {
      selector: 'node.selected',
      style: {
        'border-width': 4,
        'border-color': highlight,
      },
    },
    {
      selector: 'edge.highlighted',
      style: {
        width: 2,
        'line-color': highlight,
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
}
