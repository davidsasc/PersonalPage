// ─── Severity enum ────────────────────────────────────────────────────────────

export enum Severity {
  CRITICAL = 'CRITICAL',
  ERROR    = 'ERROR',
  WARNING  = 'WARNING',
  INFO     = 'INFO',
  OK       = 'OK',
}

export const SEV_ORDER: Severity[] = [
  Severity.CRITICAL,
  Severity.ERROR,
  Severity.WARNING,
  Severity.INFO,
  Severity.OK,
]

/** Severities that can appear as cell highlights (excludes INFO and OK) */
export type HighlightSeverity = Severity.CRITICAL | Severity.ERROR | Severity.WARNING

// ─── Quick fix action enum ────────────────────────────────────────────────────

export enum QuickFixAction {
  RemoveEmptyRows    = 'removeEmptyRows',
  DeleteGhostColumns = 'deleteGhostColumns',
  ConvertDates       = 'convertDates',
  TrimWhitespace     = 'trimWhitespace',
  NormalizeCase      = 'normalizeCase',
}

// ─── Table kind enum ──────────────────────────────────────────────────────────

export enum TableKind {
  Nodes = 'nodes',
  Edges = 'edges',
}

// ─── Validation ───────────────────────────────────────────────────────────────

export interface DetailRow {
  location: string
  problem: string
  fix?: string
}

export interface Issue {
  severity: Severity
  section: string
  message: string
  detail?: string
  rows?: DetailRow[]
  suggestion?: string
  fixAction?: QuickFixAction
}

export interface ValidationResult {
  issues: Issue[]
  nodeFile: string
  edgeFile: string
  timestamp: string
  nodeCount: number
  edgeCount: number
}

// ─── CSV row shapes ───────────────────────────────────────────────────────────

export interface NodeRow {
  id: string
  name: string
  [key: string]: string
}

export interface EdgeRow {
  from: string
  to: string
  date: string
  [key: string]: string
}

// ─── Editor state ─────────────────────────────────────────────────────────────

export interface ChangeEntry {
  id: string
  timestamp: string
  description: string
  affectedRows: number
  kind: TableKind
  prevNodes: NodeRow[]
  prevEdges: EdgeRow[]
}

// ─── Merger ───────────────────────────────────────────────────────────────────

export interface MergeSetConfig {
  id: string
  label: string
  nodeFile: File | null
  edgeFile: File | null
}

export interface CrossConflict {
  nodeId: string
  column: string
  values: Record<string, string>
  resolution?: string
}

export interface DuplicateEdge {
  from: string
  to: string
  date: string
  count?: number
  resolution?: 'keepFirst' | 'keepAll' | 'delete'
}

export interface SemanticRename {
  setIndex: number
  setLabel: string
  originalId: string
  newId: string
  laterName: string
  earlierName: string
  edgesUpdated: number
}

export interface MergeResult {
  aborted: boolean
  setResults: { label: string; issues: Issue[] }[]
  remapLog: string[]
  semanticRenames: SemanticRename[]
  postRenameSetResults: { label: string; issues: Issue[] }[]
  crossConflicts: CrossConflict[]
  duplicateEdges: DuplicateEdge[]
  mergedNodeCsv: string
  mergedEdgeCsv: string
  timestamp: string
}