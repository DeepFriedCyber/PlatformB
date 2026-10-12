import type { Capability } from './sophos-data';

export interface SearchProvider {
  id: string;
  name: string;
  description?: string;
  verified?: boolean;
}

export interface SearchResult {
  id: string;
  title: string;
  name?: string;
  slug?: string;
  domain?: string;
  description?: string;
  verifiedStatus?: 'Verified' | 'Not established';
  url?: string;
  founded?: number;
  employees?: number;
  capabilities?: Capability[];
  services?: string[];
  integrations?: string[];
  contentLibrary?: { name: string; description?: string }[];
  commonQuestions?: { id: string; question: string; answers: string[] }[];
  unansweredQuestions?: { id: string; question: string }[];
  evidenceCount?: number;
}

export interface SearchInterpretation {
  query: string;
  intent: string;
  entities: SearchResult[];
  demoData?: boolean;
}

export interface SearchContext {
  query: string;
  interpretation: SearchInterpretation;
  providers: SearchProvider[];
}
