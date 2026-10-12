// PlatformB MVP - Static Fixture Data for Sophos Case Study
// All analytics/numbers/search counts are labeled as Demo data
// DO NOT treat as factual Sophos or PlatformB data

import { interpretQuery } from '@/lib/query-interpreter';

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
  published: string; // ISO date
  url: string;
  topics: string[];
}

export interface EvidenceSource {
  type: 'product_page' | 'third_party_review' | 'independent_test' | 'service_page' | 
         'case_study' | 'announcement' | 'tech_article';
  source: string;
  url?: string;
  rating?: number | string; // For Gartner/NSS Labs ratings
  established: boolean;
  title?: string; // For case studies
  date?: string; // For announcements
}

export interface CompanyQuestion {
  question: string;
  answer: string;
  evidenceSources: EvidenceSource[];
}

// Sophos company profile - verified information
export const SOPHOS_COMPANY = {
  name: 'Sophos',
  fullLegalName: 'Sophos Limited',
  description: 'Global cybersecurity leader providing endpoint protection, network security, email security and managed detection and response (MDR) for businesses of all sizes.',
  foundedYear: 1985,
  headquarters: 'Farnham, United Kingdom',
  website: 'https://www.sophos.com',
  verified: true,
  verifiedBy: ['Sophos Corporate Registry'],
  industries: [
    'Cybersecurity',
    'Enterprise Security',
    'Endpoint Protection',
    'Email Security',
    'MDR'
  ],
  targetOrgSizes: ['SME', 'Mid-Market', 'Enterprise'],
  geographicCoverage: ['Global'],
};

// Products - Endpoint security suite
export const SOPHOS_PRODUCTS: Product[] = [
  {
    name: 'Sophos Intercept X',
    category: 'Endpoint Security',
    description: 'AI-driven endpoint protection with ransomware self-defense, exploit blocking and zero-day attack prevention for Windows, macOS and Linux.',
    features: [
      'Ransomware self-defense',
      'Exploit prevention',
      'Zero-day attack blocking',
      'Memory scanning',
      'Active Protection (behavioral analysis)',
    ],
    supportedEnvironments: ['Windows', 'macOS', 'Linux'],
    pricetiers: ['SME', 'Mid-Market'],
    evidenceSources: [
      { type: 'product_page', source: 'Sophos Product Page', url: 'https://www.sophos.com/en-us/product/Sophos-Intercept-X', established: true },
      { 
        type: 'third_party_review', 
        source: 'Gartner Peer Insights', 
        rating: 4.5, 
        established: true 
      },
    ],
  },
  {
    name: 'Sophos Firewall (XG)',
    category: 'Network Security',
    description: 'Next-gen firewall with application control, intrusion prevention, SSL inspection and cloud security.',
    features: [
      'Application control',
      'Intrusion prevention (IPS)',
      'SSL decryption',
      'Cloud security integration',
      'Advanced threat protection',
    ],
    supportedEnvironments: ['On-premises', 'Cloud'],
    pricetiers: ['SME', 'Mid-Market', 'Enterprise'],
    evidenceSources: [
      { type: 'product_page', source: 'Sophos Product Page', url: 'https://www.sophos.com/en-us/product/Sophos-XG-Firewall', established: true },
      { 
        type: 'independent_test', 
        source: 'NSS Labs', 
        rating: 'High', 
        established: true 
      },
    ],
  },
  {
    name: 'Sophos Email Security',
    category: 'Email Security',
    description: 'Advanced email protection with spam filtering, anti-malware, data loss prevention and phishing detection.',
    features: [
      'Spam filtering (99.5%+ reduction)',
      'Anti-malware',
      'Phishing detection',
      'Data loss prevention (DLP)',
      'Attachment sandboxing',
    ],
    supportedEnvironments: ['On-premises', 'Cloud'],
    pricetiers: ['SME', 'Mid-Market', 'Enterprise'],
    evidenceSources: [
      { type: 'product_page', source: 'Sophos Product Page', url: 'https://www.sophos.com/en-us/product/Sophos-Email-Security', established: true },
    ],
  },
];

// Services - Managed security services offering
export const SOPHOS_SERVICES: Service[] = [
  {
    name: 'Sophos MDR (Managed Detection and Response)',
    category: 'Managed Security Services',
    description: '24/7 security monitoring, threat hunting, incident response and continuous protection from the Sophos security operations team.',
    capabilities: [
      '24/7 monitoring',
      'Threat hunting',
      'Incident response',
      'Vulnerability management',
      'Security awareness training',
    ],
    targetOrgSizes: ['SME', 'Mid-Market', 'Enterprise'],
    industriesSupported: ['All'],
    evidenceSources: [
      { type: 'service_page', source: 'Sophos Services Page', url: 'https://www.sophos.com/en-us/services/mdr', established: true },
      { 
        type: 'case_study', 
        source: 'Sophos Case Studies',
        title: 'Bank reduces incidents by 80% with MDR', 
        established: true 
      },
    ],
  },
];

// Integrations - Third-party platform integrations
export const SOPHOS_INTEGRATIONS: Integration[] = [
  {
    name: 'Microsoft 365',
    categories: ['Endpoint Management', 'Email Security'],
    features: ['Single sign-on', 'Centralized management', 'Deep integration with Defender'],
    established: true,
    evidenceSources: [
      { type: 'announcement', source: 'Sophos Blog', date: '2023-06', established: true },
    ],
  },
  {
    name: 'VMware Workspace ONE',
    categories: ['Endpoint Management'],
    features: ['Mobile device management', 'App protection'],
    established: true,
    evidenceSources: [
      { type: 'product_page', source: 'Sophos Integrations Page', url: 'https://www.sophos.com/en-us/integrations/vmware-workspace-one', established: true },
    ],
  },
  {
    name: 'Citrix Workspace',
    categories: ['Endpoint Management'],
    features: ['Secure app delivery', 'DLP for Citrix'],
    established: true,
    evidenceSources: [
      { type: 'product_page', source: 'Sophos Integrations Page', url: 'https://www.sophos.com/en-us/integrations/citrix', established: true },
    ],
  },
];

// Reports, articles and videos - Content library
export const SOPHOS_CONTENT: ReportArticle[] = [
  {
    title: '2026 CISO Report',
    type: 'report',
    summary: 'Annual survey of 1,000+ CISOs on cyber threats, priorities and MDR adoption. Key findings: 73% see ransomware as top threat, AI-driven attacks increasing.',
    published: '2026-01-15T00:00:00Z',
    url: 'https://www.sophos.com/en-us/resources/2026-ciso-report',
    topics: ['cyber threats', 'MDR', 'CISO priorities', 'ransomware'],
  },
  {
    title: 'Sophos AI Security 2026',
    type: 'report',
    summary: 'Analysis of AI-driven cybersecurity, including generative AI attacks and defense strategies. Covers adversarial ML, prompt injection attacks and AI security posture assessment.',
    published: '2026-03-01T00:00:00Z',
    url: 'https://www.sophos.com/en-us/resources/ai-security-2026',
    topics: ['AI security', 'generative AI threats', 'adversarial ML'],
  },
  {
    title: 'Microsoft 365 + Sophos Integration Guide',
    type: 'documentation',
    summary: 'Comprehensive guide to deploying and managing Sophos products with Microsoft 365 and Defender. Includes architecture diagrams, configuration steps and best practices.',
    published: '2026-02-01T00:00:00Z',
    url: 'https://www.sophos.com/en-us/resources/microsoft-365-integration',
    topics: ['Microsoft 365', 'integration', 'architecture'],
  },
];

// Common questions - Q&A with evidence-backed answers
export const SOPHOS_COMMON_QUESTIONS: CompanyQuestion[] = [
  {
    question: 'Does Sophos work with Microsoft Defender?',
    answer: 'Yes. Sophos and Microsoft Defender can coexist. Our integration allows both to work together without conflicts, providing layered security coverage.',
    evidenceSources: [
      { 
        type: 'tech_article', 
        title: 'Microsoft 365 + Sophos Integration Guide', 
        source: 'Sophos Resource Center', 
        url: 'https://www.sophos.com/en-us/resources/microsoft-365-integration', 
        established: true 
      },
    ],
  },
  {
    question: 'What does MDR include?',
    answer: 'Sophos MDR includes 24/7 security monitoring, threat hunting, incident response, vulnerability management and regular reporting. The Sophos security operations team handles alerts and incidents.',
    evidenceSources: [
      { type: 'service_page', source: 'Sophos Services Page', url: 'https://www.sophos.com/en-us/services/mdr', established: true },
    ],
  },
  {
    question: 'Is Sophos suitable for small businesses?',
    answer: 'Yes. Sophos products are designed for businesses of all sizes, from SMEs to large enterprises. Our solutions scale with your needs and offer flexible deployment options.',
    evidenceSources: [
      { type: 'product_page', source: 'Sophos About Page', url: 'https://www.sophos.com/en-us/company/about', established: true },
    ],
  },
];

// Unanswered questions - Information gaps identified from search analysis
export const SOPHOS_UNANSWERED_QUESTIONS = [
  'What specific SOC levels does MDR provide?',
  'How long is the contract minimum for MDR?',
  'Does Sophos offer breach response as a service?',
];

// Evidence gaps - What information could be added to improve discoverability
export const SOPHOS_EVIDENCE_GAPS = [
  'Third-party comparison benchmarks against CrowdStrike or SentinelOne',
  'Detailed performance metrics under specific workload scenarios',
];

// Search interpretation demo data - Simulated query understanding
export function getQueryInterpretation(queryTerms: string[]): string[] {
  const notes: string[] = [];
  
  // Extract entities from query for demo data interpretation
  const entities = new Set<string>();
  ['MDR', 'Microsoft 365', 'Defender', 'UK', 'SME', 'Enterprise', 
   'ransomware', 'firewall', 'email security'].forEach(term => {
    if (queryTerms.some(t => t.toLowerCase().includes(term.toLowerCase()))) {
      entities.add(term);
    }
  });
  
  for (const entity of entities) {
    notes.push(`Interpretation: ${entity} identified from query`);
  }
  
  // Default demo data interpretation note
  if (notes.length === 0) {
    notes.unshift('Demo data: Query interpreted as-is. In production, semantic understanding would extract topics and entities.');
  }
  
  return notes;
}

// Evidence status labels for display
export const EVIDENCE_STATUS_LABELS = {
  verified: 'Verified',
  partial: 'Partially Verified',
  unverified: 'Not established',
  notFound: 'Not found',
};

// Provider console demo data - Analytics and metrics (Demo data only)
export const PROVIDER_CONSOLE_DATA = {
  overview: {
    companyName: 'Sophos Limited',
    totalProducts: SOPHOS_PRODUCTS.length,
    totalServices: SOPHOS_SERVICES.length,
    totalIntegrations: SOPHOS_INTEGRATIONS.length,
    contentItems: SOPHOS_CONTENT.length,
    unansweredQuestions: SOPHOS_UNANSWERED_QUESTIONS.length,
    evidenceGapsCount: SOPHOS_EVIDENCE_GAPS.length,
  },
  
  // Information gaps for better discoverability - Demo data array
  evidenceGaps: SOPHOS_EVIDENCE_GAPS, // Array of strings
  
  // Simulated search analytics - Demo data only
  searchAnalytics: {
    totalQueriesLeadingToCompany: '12,847',
    avgPositionInResults: 2.3,
    queriesShowingUnansweredQuestions: 45,
    queriesMentioningProducts: ['Intercept X', 'Firewall', 'Email Security', 'MDR'],
    queriesMentioningServices: ['MDR', 'managed security', 'incident response'],
  },
  
  // Content discoverability - Which content is hard to find
  hardToDiscoverContent: [
    { title: 'Microsoft 365 + Sophos Integration Guide', reason: 'Technical topic, limited keyword matches' },
    { title: 'Sophos AI Security 2026 report', reason: 'Published March 2026, recent but not yet indexed heavily' },
  ],
  
  // Capability coverage - What's well evidenced vs unclear
  capabilityCoverage: [
    { capability: 'Ransomware protection', status: 'well_evidenced', sources: 3 },
    { capability: 'Email security', status: 'well_evidenced', sources: 2 },
    { capability: 'Network firewalling', status: 'well_evidenced', sources: 2 },
    { capability: 'Cloud workload protection', status: 'needs_more_evidence', sources: 1 },
    { capability: 'Threat hunting services', status: 'needs_more_evidence', sources: 1 },
  ],
  
  // Common questions users ask - Q&A performance
  questionAnalytics: [
    { 
      question: 'Does Sophos work with Microsoft Defender?', 
      foundInCompanyPage: true, 
      avgPosition: 2.0,
      evidenceQuality: 'high' 
    },
    { 
      question: 'What does MDR include?', 
      foundInCompanyPage: true, 
      avgPosition: 1.8,
      evidenceQuality: 'high' 
    },
    { 
      question: 'Is Sophos suitable for small businesses?', 
      foundInCompanyPage: true, 
      avgPosition: 2.5,
      evidenceQuality: 'medium' 
    },
    { 
      question: 'What SOC levels does MDR provide?', 
      foundInCompanyPage: false, // Unanswered question
      avgPosition: null,
      evidenceQuality: null 
    },
  ],
  
  // Search terms that bring up this company (demo data)
  topSearchTerms: [
    'MDR provider',
    'endpoint protection UK',
    'ransomware prevention',
    'Microsoft Defender alternative',
    'business firewall SME',
    'email security solution',
    'cybersecurity MDR',
    'Sophos Intercept X',
  ],
};

// Demo data flag for clarity
export function isDemoData(): boolean {
  return true; // Always demo data for MVP
}