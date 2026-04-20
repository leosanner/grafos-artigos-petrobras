import type { GraphPayload, NodeType } from './types';

export interface GraphFilter {
  types: Set<NodeType>;
  bigAreaId: string | 'all';
}

export function getVisibleIds(
  payload: GraphPayload,
  { types, bigAreaId }: GraphFilter,
): Set<string> {
  const visible = new Set<string>();

  const termIds = new Set<string>();
  const articleIds = new Set<string>();
  const appAreaIds = new Set<string>();

  if (bigAreaId !== 'all') {
    for (const e of payload.edges) {
      if (e.data.type === 'big_area_to_term' && e.data.source === bigAreaId) {
        termIds.add(e.data.target);
      }
    }
    for (const e of payload.edges) {
      if (e.data.type === 'term_to_article' && termIds.has(e.data.source)) {
        articleIds.add(e.data.target);
      }
    }
    for (const e of payload.edges) {
      if (
        e.data.type === 'article_to_application_area' &&
        articleIds.has(e.data.source)
      ) {
        appAreaIds.add(e.data.target);
      }
    }
  }

  for (const { data } of payload.nodes) {
    if (!types.has(data.type)) continue;
    if (bigAreaId === 'all') {
      visible.add(data.id);
      continue;
    }
    if (data.id === bigAreaId) visible.add(data.id);
    else if (termIds.has(data.id)) visible.add(data.id);
    else if (articleIds.has(data.id)) visible.add(data.id);
    else if (appAreaIds.has(data.id)) visible.add(data.id);
  }

  return visible;
}

export function findFirstMatch(payload: GraphPayload, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  for (const { data } of payload.nodes) {
    const haystack: string[] = [data.label];
    if (data.type === 'article') {
      if (data.shortTitle) haystack.push(data.shortTitle);
      if (data.fullTitle) haystack.push(data.fullTitle);
    }
    if (haystack.some((s) => s.toLowerCase().includes(q))) return data;
  }
  return null;
}
