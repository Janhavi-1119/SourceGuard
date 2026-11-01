export interface Source {
  id: string;
  type: 'url' | 'text';
  content: string;
  title?: string;
  domain?: string;
  publishedDate?: string;
  reliability?: 'high' | 'medium' | 'low';
}

export interface Claim {
  id: string;
  text: string;
  sourceSupport: ClaimSourceSupport[];
}

export interface ClaimSourceSupport {
  sourceId: string;
  sourceName: string;
  status: 'supports' | 'contradicts' | 'partial' | 'no-info';
  evidence?: string;
}

export interface Conflict {
  id: string;
  claim: string;
  sourceA: { name: string; statement: string; date?: string };
  sourceB: { name: string; statement: string; date?: string };
  severity: 'high' | 'medium' | 'low';
}

export interface FreshnessItem {
  sourceId: string;
  sourceName: string;
  publishedDate: string;
  isOutdated: boolean;
  note: string;
}

export interface MissingInfo {
  id: string;
  description: string;
  suggestedAction: string;
}

export type VerificationStatus = 'supported' | 'partially-supported' | 'conflicting' | 'insufficient';

export interface AnalysisResult {
  id: string;
  question: string;
  date: string;
  status: VerificationStatus;
  sources: Source[];
  summary: string;
  claims: Claim[];
  conflicts: Conflict[];
  freshness: FreshnessItem[];
  missingInfo: MissingInfo[];
  conclusion: string;
}

export interface SavedReport {
  id: string;
  title: string;
  question: string;
  dateCreated: string;
  sourceCount: number;
  status: VerificationStatus;
  result: AnalysisResult;
}

export interface AnalysisOptions {
  detectConflicts: boolean;
  checkFreshness: boolean;
  identifyMissing: boolean;
  compareReliability: boolean;
}

export interface DashboardStats {
  totalAnalyses: number;
  sourcesAnalyzed: number;
  conflictsDetected: number;
  reportsGenerated: number;
}
