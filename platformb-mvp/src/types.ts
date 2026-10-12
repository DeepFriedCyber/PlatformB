// PlatformB MVP Types - Cybersecurity Discovery & Company Information
// All analytics/numbers/search counts are Demo data only

export interface Product {
  name: string;
  category: string;
  description: string;
  features: string[];
  supportedEnvironments: string[];
  pricetiers: Array<'SME' | 'Mid-Market' | 'Enterprise'>;
  evidenceSources: EvidenceSource[];
}

export interface Service {
  name: string;
  category: string;
  description: string;
  capabilities: string[];
  targetOrgSizes: Array<'SME' | 'Mid-Market' | 'Enterprise'>;
  industriesSupported: string[];
  evidenceSources: EvidenceSource[];
}

export interface Integration {
  name: string;
  categories: string[];
  features: string[];
  established: boolean;
  evidenceSources: EvidenceSource[];
}

export interface ReportArticle {
  title: string;
  type: 'report' | 'article' | 'documentation';
  summary: string;
  published: string;
  url: string;
  topics: string[];
}

export interface EvidenceSource {
  type: 
    | 'product_page' 
    | 'third_party_review' 
    | 'independent_test' 
    | 'service_page' 
    | 'case_study' 
    | 'announcement' 
    | 'tech_article';
  source: string;
  url?: string;
  rating?: number | string;
  established: boolean;
  title?: string;
  date?: string;
}

export interface CompanyQuestion {
  question: string;
  answer: string;
  evidenceSources: EvidenceSource[];
}

export interface SearchInterpretation {
  entities: string[];
  notes: string[];
}

export interface CapabilityStatus {
  capability: string;
  status: 'well_evidenced' | 'needs_more_evidence';
  sources: number;
}

export interface SearchAnalyticsDemo {
  totalQueriesLeadingToCompany: string;
  avgPositionInResults: number;
  queriesShowingUnansweredQuestions: number;
  queriesMentioningProducts: string[];
  queriesMentioningServices: string[];
}

export interface ContentDiscoverabilityItem {
  title: string;
  reason: string;
}

export interface CompanyQuestionPerformance {
  question: string;
  foundInCompanyPage: boolean;
  avgPosition: number | null;
  evidenceQuality: 'high' | 'medium' | 'low' | null;
}

// Requirement matching engine interfaces
export type RequirementStatus = 'supported' | 'contradicted' | 'not_established';

export interface Requirement {
  id: string;
  capability: string;
  value: string | null;
  required: boolean;
  preferred?: boolean;
  negated?: boolean;
  originalText?: string;
}

export interface RequirementEvaluation {
  status: RequirementStatus;
  evidenceSource?: EvidenceSource;
  evidenceRecord?: ProvenanceEvidenceRecord;
  conflictingEvidenceIds?: string[];
  claimId?: string;
  claimStatement?: string;
  evidenceRelationshipStatus?: 'linked' | 'broken' | 'absent';
  reason: string;
  capabilityMatched?: boolean;
}

export interface SupplierEvaluation {
  supplierName: string;
  evaluations: Record<string, RequirementEvaluation>;
  summary: {
    totalRequired: number;
    requiredSupported: number;
    requiredNotEstablished: number;
    requiredContradicted: number;
    completionRate: number;
    isCompleteMatch: boolean;
  };
}

export type EvidenceOrigin = 'supplier_published' | 'third_party' | 'independent' | 'unknown';

export type ClaimEvidenceStatus = 'supports_claim' | 'contradicts_claim' | 'insufficient' | 'unknown';

export interface ProvenanceEvidenceRecord {
  id: string;
  supplierId: string;
  productOrServiceId?: string;
  sourceTitle?: string;
  sourceUrl?: string;
  sourceType: EvidenceSource['type'] | 'unknown';
  publisher?: string;
  claimExcerpt?: string;
  observedAt?: string;
  evidenceStatus: ClaimEvidenceStatus;
  origin: EvidenceOrigin;
  independentlyVerified: boolean | null;
  demoData: boolean;
}

export type ClaimProvenanceStatus = 'stated' | 'supported' | 'contradicted' | 'unknown';

export interface SupplierCapabilityClaim {
  id: string;
  supplierId: string;
  productOrServiceId?: string;
  capabilityId: string;
  statement: string;
  evidenceIds: string[];
  contradictingEvidenceIds: string[];
  provenanceStatus: ClaimProvenanceStatus;
  demoData: boolean;
}
