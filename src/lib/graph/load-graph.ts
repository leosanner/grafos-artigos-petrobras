import type { GraphPayload } from './types';

export async function loadGraph(): Promise<GraphPayload> {
  const res = await fetch('/graph_data.json', { cache: 'force-cache' });
  if (!res.ok) {
    throw new Error(`Failed to load graph_data.json: ${res.status}`);
  }
  const payload = (await res.json()) as GraphPayload;
  if (!Array.isArray(payload?.nodes) || !Array.isArray(payload?.edges)) {
    throw new Error('graph_data.json does not match the expected shape');
  }
  return payload;
}
