export type NodeType = 'big_area' | 'term' | 'article' | 'application_area';

export type EdgeType =
  | 'big_area_to_term'
  | 'term_to_article'
  | 'article_to_application_area';

interface NodeBase {
  id: string;
  label: string;
  type: NodeType;
}

export interface BigAreaNode extends NodeBase {
  type: 'big_area';
}

export interface TermNode extends NodeBase {
  type: 'term';
  bigArea: string;
}

export interface ArticleNode extends NodeBase {
  type: 'article';
  shortTitle?: string;
  fullTitle?: string;
  originalTechnology?: string;
  application?: string;
  context?: string;
  applicationArea?: string;
  reference?: string;
  externalArticleKey?: string;
  matchMethod?: 'normalized_title' | 'manual_override';
  externalMetadata?: ArticleExternalMetadata;
}

export interface ArticleExternalOpenAccess {
  isOa?: boolean;
  status?: string;
  license?: string;
}

export interface ArticleExternalAuthor {
  name: string;
  orcid?: string;
  isCorresponding?: boolean;
}

export interface ArticleExternalInstitution {
  id?: string;
  name: string;
  country?: string;
  type?: string;
}

export interface ArticleExternalMetadata {
  doi?: string;
  publicationDate?: string;
  source?: string;
  sourceName?: string;
  language?: string;
  citationCount?: number;
  fwci?: number;
  openAccess?: ArticleExternalOpenAccess;
  authors?: ArticleExternalAuthor[];
  institutions?: ArticleExternalInstitution[];
  keywords?: string[];
}

export interface ApplicationAreaNode extends NodeBase {
  type: 'application_area';
}

export type GraphNode =
  | BigAreaNode
  | TermNode
  | ArticleNode
  | ApplicationAreaNode;

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
}

export interface GraphPayload {
  nodes: { data: GraphNode }[];
  edges: { data: GraphEdge }[];
}
