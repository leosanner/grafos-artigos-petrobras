import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

const GRAPH_PATH = path.join(ROOT_DIR, 'public', 'graph_data.json');
const EXTERNAL_ARTICLES_PATH = path.join(
  ROOT_DIR,
  'external_data',
  'articles_extended.json',
);
const TERMS_PATH = path.join(ROOT_DIR, 'external_data', 'terms_node.json');
const INSTITUTIONS_PATH = path.join(
  ROOT_DIR,
  'external_data',
  'instituition_information.json',
);
const RELATION_PAIRS_PATH = path.join(
  ROOT_DIR,
  'external_data',
  'article_relation_pairs.json',
);

const MANUAL_OVERRIDES = {
  'article-01': '42',
};

async function main() {
  const graph = await readJson(GRAPH_PATH);
  const externalArticles = await readJson(EXTERNAL_ARTICLES_PATH);
  const termEntries = await readJson(TERMS_PATH);
  const institutions = await readJson(INSTITUTIONS_PATH);

  validateGraph(graph);
  validateTermEntries(termEntries);

  const articleNodes = graph.nodes.filter((node) => node?.data?.type === 'article');
  const termMetadataIndex = buildTermMetadataIndex(termEntries);
  validateTermCoverage(graph, termMetadataIndex);
  const relationIndex = buildExternalTitleIndex(externalArticles);
  const relationPairs = articleNodes.map((node) =>
    resolveRelation(node.data, externalArticles, relationIndex),
  );
  const relationPairsByArticleId = new Map(
    relationPairs.map((pair) => [pair.graphArticleId, pair]),
  );

  const enrichedGraph = {
    ...graph,
    nodes: graph.nodes.map((node) => {
      if (node?.data?.type === 'term') {
        const metadata = termMetadataIndex.get(node.data.label);
        if (!metadata) {
          throw new Error(`Missing term metadata for "${node.data.label}"`);
        }

        return {
          ...node,
          data: {
            ...node.data,
            description: metadata.description,
            reference: metadata.reference,
          },
        };
      }

      if (node?.data?.type !== 'article') return node;

      const relation = relationPairsByArticleId.get(node.data.id);
      if (!relation) {
        throw new Error(`Missing relation pair for graph article "${node.data.id}"`);
      }

      const externalRow = externalArticles[relation.externalArticleKey];
      return {
        ...node,
        data: {
          ...node.data,
          externalArticleKey: relation.externalArticleKey,
          matchMethod: relation.matchMethod,
          externalMetadata: buildExternalMetadata(externalRow, institutions),
        },
      };
    }),
  };

  await writeJson(RELATION_PAIRS_PATH, relationPairs);
  await writeJson(GRAPH_PATH, enrichedGraph);

  const normalizedMatches = relationPairs.filter(
    (pair) => pair.matchMethod === 'normalized_title',
  ).length;
  const manualMatches = relationPairs.filter(
    (pair) => pair.matchMethod === 'manual_override',
  ).length;
  const uniqueExternalKeys = new Set(
    relationPairs.map((pair) => pair.externalArticleKey),
  );

  console.log(`Graph articles paired: ${relationPairs.length}`);
  console.log(`Normalized title matches: ${normalizedMatches}`);
  console.log(`Manual override matches: ${manualMatches}`);
  console.log(`Unique external rows used: ${uniqueExternalKeys.size}`);
  console.log(`Term metadata merged: ${termMetadataIndex.size}`);
  console.log(`Audit file written to: ${path.relative(ROOT_DIR, RELATION_PAIRS_PATH)}`);
  console.log(`Graph file updated: ${path.relative(ROOT_DIR, GRAPH_PATH)}`);
}

function validateGraph(graph) {
  if (!graph || !Array.isArray(graph.nodes) || !Array.isArray(graph.edges)) {
    throw new Error('public/graph_data.json does not match the expected shape');
  }
}

function buildExternalTitleIndex(externalArticles) {
  const index = new Map();

  for (const [externalKey, row] of Object.entries(externalArticles)) {
    const titles = buildTitleCandidates(row);
    for (const title of titles) {
      const normalized = normalizeText(title);
      if (!normalized) continue;
      if (!index.has(normalized)) index.set(normalized, []);
      index.get(normalized).push(externalKey);
    }
  }

  return index;
}

function validateTermEntries(termEntries) {
  if (!Array.isArray(termEntries)) {
    throw new Error('external_data/terms_node.json must be an array');
  }

  for (const [index, entry] of termEntries.entries()) {
    const technology = cleanText(entry?.technology);
    const description = cleanText(entry?.description);
    const reference = cleanText(entry?.reference);

    if (!technology) {
      throw new Error(`Term entry at index ${index} is missing "technology"`);
    }
    if (!description) {
      throw new Error(`Term entry "${technology}" is missing "description"`);
    }
    if (!reference) {
      throw new Error(`Term entry "${technology}" is missing "reference"`);
    }
  }
}

function buildTermMetadataIndex(termEntries) {
  const index = new Map();

  for (const entry of termEntries) {
    const technology = cleanText(entry.technology);
    const description = cleanText(entry.description);
    const reference = cleanText(entry.reference);

    if (index.has(technology)) {
      throw new Error(`Duplicate technology in external_data/terms_node.json: "${technology}"`);
    }

    index.set(technology, {
      description,
      reference,
    });
  }

  return index;
}

function validateTermCoverage(graph, termMetadataIndex) {
  const graphTermLabels = graph.nodes
    .filter((node) => node?.data?.type === 'term')
    .map((node) => node.data.label);

  for (const label of graphTermLabels) {
    if (!termMetadataIndex.has(label)) {
      throw new Error(`Missing term metadata for graph term "${label}"`);
    }
  }

  for (const technology of termMetadataIndex.keys()) {
    if (!graphTermLabels.includes(technology)) {
      throw new Error(`Term metadata has no matching graph node: "${technology}"`);
    }
  }
}

function resolveRelation(articleNode, externalArticles, relationIndex) {
  const graphTitle = cleanText(articleNode.fullTitle);
  if (!graphTitle) {
    throw new Error(`Article "${articleNode.id}" is missing "fullTitle"`);
  }

  const manualKey = MANUAL_OVERRIDES[articleNode.id];
  if (manualKey) {
    const externalRow = externalArticles[manualKey];
    if (!externalRow) {
      throw new Error(
        `Manual override for "${articleNode.id}" points to missing external row "${manualKey}"`,
      );
    }

    return {
      graphArticleId: articleNode.id,
      graphTitle,
      externalArticleKey: manualKey,
      externalTitle: pickPrimaryExternalTitle(externalRow),
      matchMethod: 'manual_override',
    };
  }

  const matches = relationIndex.get(normalizeText(graphTitle)) ?? [];
  if (matches.length === 0) {
    throw new Error(`No external match found for "${articleNode.id}" (${graphTitle})`);
  }

  const uniqueMatches = [...new Set(matches)];
  if (uniqueMatches.length > 1) {
    throw new Error(
      `Ambiguous external match for "${articleNode.id}" (${graphTitle}): ${uniqueMatches.join(', ')}`,
    );
  }

  const externalKey = uniqueMatches[0];
  return {
    graphArticleId: articleNode.id,
    graphTitle,
    externalArticleKey: externalKey,
    externalTitle: pickPrimaryExternalTitle(externalArticles[externalKey]),
    matchMethod: 'normalized_title',
  };
}

function buildExternalMetadata(row, institutionsById) {
  const metadata = compactObject({
    doi: cleanDoi(row.doi_x) ?? cleanDoi(row.doi_y),
    publicationDate: cleanText(row.publication_date) ?? cleanText(row.publish_date),
    source: cleanText(row.source) ?? cleanText(row.external_tools),
    sourceName: cleanText(row['primary_location.source.display_name']),
    language: cleanText(row.language),
    citationCount: asNumber(row.cited_by_count),
    fwci: asNumber(row.fwci),
    openAccess: buildOpenAccess(row),
    authors: buildAuthors(row),
    institutions: buildInstitutions(row, institutionsById),
    keywords: buildKeywords(row),
  });

  return metadata;
}

function buildOpenAccess(row) {
  const openAccess = compactObject({
    isOa: asBoolean(row['open_access.is_oa']),
    status: cleanText(row['open_access.oa_status']),
    license: cleanText(row['best_oa_location.license']),
  });

  return hasContent(openAccess) ? openAccess : undefined;
}

function buildAuthors(row) {
  const authors = [];
  const names = ensureStringArray(row['authorships.author.display_name']);
  const orcids = ensureStringArray(row['authorships.author.orcid']);
  const corresponding = Array.isArray(row['authorships.is_corresponding'])
    ? row['authorships.is_corresponding']
    : [];

  const authorCount = Math.max(names.length, orcids.length, corresponding.length);

  for (let index = 0; index < authorCount; index += 1) {
    mergeAuthor(authors, {
      name: cleanText(names[index]),
      orcid: cleanOrcid(orcids[index]),
      isCorresponding: asBoolean(corresponding[index]),
    });
  }

  if (authors.length === 0 && Array.isArray(row.authors)) {
    for (const author of row.authors) {
      mergeAuthor(authors, {
        name: cleanText(author?.name),
      });
    }
  }

  return authors.length > 0 ? authors : undefined;
}

function mergeAuthor(target, candidate) {
  if (!candidate.name && !candidate.orcid) return;

  const existing = target.find((author) => {
    if (candidate.orcid && author.orcid) return candidate.orcid === author.orcid;
    return normalizeText(candidate.name) === normalizeText(author.name);
  });

  if (existing) {
    if (!existing.name && candidate.name) existing.name = candidate.name;
    if (!existing.orcid && candidate.orcid) existing.orcid = candidate.orcid;
    if (candidate.isCorresponding) existing.isCorresponding = true;
    return;
  }

  target.push(
    compactObject({
      name: candidate.name ?? candidate.orcid,
      orcid: candidate.orcid,
      isCorresponding: candidate.isCorresponding ? true : undefined,
    }),
  );
}

function buildInstitutions(row, institutionsById) {
  const institutions = [];
  const ids = ensureStringArray(row['authorships.institutions.id']);
  const names = ensureStringArray(row['authorships.institutions.display_name']);
  const institutionCount = Math.max(ids.length, names.length);

  for (let index = 0; index < institutionCount; index += 1) {
    const institutionId = cleanText(ids[index]);
    const resolved = institutionId ? institutionsById[institutionId] : undefined;

    mergeInstitution(institutions, {
      id: institutionId,
      name: cleanText(resolved?.display_name) ?? cleanText(names[index]),
      country: cleanText(resolved?.country_code),
      type: cleanText(resolved?.type),
    });
  }

  if (institutions.length === 0 && Array.isArray(row.affiliation)) {
    for (const affiliation of row.affiliation) {
      mergeInstitution(institutions, {
        name: cleanText(affiliation?.name),
        country: cleanText(affiliation?.country),
      });
    }
  }

  return institutions.length > 0 ? institutions : undefined;
}

function mergeInstitution(target, candidate) {
  if (!candidate.id && !candidate.name) return;

  const existing = target.find((institution) => {
    if (candidate.id && institution.id) return candidate.id === institution.id;
    return normalizeText(candidate.name) === normalizeText(institution.name);
  });

  if (existing) {
    if (!existing.name && candidate.name) existing.name = candidate.name;
    if (!existing.country && candidate.country) existing.country = candidate.country;
    if (!existing.type && candidate.type) existing.type = candidate.type;
    if (!existing.id && candidate.id) existing.id = candidate.id;
    return;
  }

  target.push(
    compactObject({
      id: candidate.id,
      name: candidate.name ?? candidate.id,
      country: candidate.country,
      type: candidate.type,
    }),
  );
}

function buildKeywords(row) {
  const rawKeywords =
    ensureStringArray(row.json_keywords).length > 0
      ? ensureStringArray(row.json_keywords)
      : ensureStringArray(row.keywords);

  const keywords = [];
  for (const keyword of rawKeywords) {
    const cleaned = cleanText(keyword);
    if (!cleaned) continue;
    if (keywords.some((item) => normalizeText(item) === normalizeText(cleaned))) continue;
    keywords.push(cleaned);
  }

  return keywords.length > 0 ? keywords : undefined;
}

function buildTitleCandidates(row) {
  return [
    row.title,
    row.display_name,
    row['Scopus Title'],
    row['OpenAlex Title'],
  ].filter(Boolean);
}

function pickPrimaryExternalTitle(row) {
  return (
    cleanText(row.title) ??
    cleanText(row.display_name) ??
    cleanText(row['Scopus Title']) ??
    cleanText(row['OpenAlex Title']) ??
    'Untitled external article'
  );
}

function compactObject(value) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => hasContent(entry)),
  );
}

function hasContent(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
}

function ensureStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => cleanText(entry))
    .filter((entry) => entry !== null);
}

function cleanText(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function cleanDoi(value) {
  const doi = cleanText(value);
  if (!doi) return null;

  return doi
    .replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, '')
    .replace(/^doi:\s*/i, '')
    .trim();
}

function cleanOrcid(value) {
  const orcid = cleanText(value);
  if (!orcid) return null;

  return orcid.replace(/^https?:\/\/orcid\.org\//i, '').trim();
}

function asNumber(value) {
  if (value === null || value === undefined || value === '') return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function asBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
  }
  return undefined;
}

function normalizeText(value) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

async function readJson(filePath) {
  const content = await readFile(filePath, 'utf8');
  return JSON.parse(content);
}

async function writeJson(filePath, value) {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
