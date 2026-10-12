// PlatformB - Demo Data (NOT factual Sophos data)
// All analytics, usage metrics and derived classifications are simulated

interface NamedItem {
  id: string;
  name: string;
  description?: string;
}

interface ContentItem {
  id: string;
  title: string;
  author: string;
  date: string;
  summary: string;
  type: string;
}

interface CompanyQuestion {
  id: string;
  question: string;
  answer: string;
  type: string;
}

interface Company {
  id: string;
  name: string;
  overview: string;
  products: NamedItem[];
  capabilities: NamedItem[];
  integrations: NamedItem[];
  environments: NamedItem[];
  geoCoverage: string[];
  targetSizes: string[];
  industries: NamedItem[];
  research: ContentItem[];
  articles: ContentItem[];
  videos: Array<{
    id: string;
    title: string;
    durationMinutes: number;
    date: string;
    summary: string;
  }>;
  documentation: Array<{
    id: string;
    title: string;
    url: string;
    description: string;
  }>;
  commonQuestions: CompanyQuestion[];
  unansweredQuestions: CompanyQuestion[];
}

interface SearchInterpretation {
  intent: string;
  keywordsExtracted: string[];
  assumptions: string[];
  clarifications: string[];
  suggestedRefinements: string[];
}

export const DEMO_LABEL = 'Demo data'

/** Sophos demonstration company profile */
export const sophosCompany: Company = {
  id: 'sophos',
  name: 'Sophos Limited',
  overview: `Sophos is a British multinational cybersecurity technology company founded in 1985. 
Sophos provides security, endpoint management, and data protection software for businesses of all sizes.`,
  products: [
    { id: 'xperion-one', name: 'Xperion ONE', description: 'Unified threat management platform' },
    { id: 'central-office', name: 'Central Office', description: 'Endpoint management console' },
    { id: 'email-security', name: 'Email Security', description: 'Email threat protection' },
    { id: 'mobile-security', name: 'Mobile Security', description: 'Mobile device protection' },
    { id: 'siem', name: 'SIEM', description: 'Security information and event management' },
  ],
  capabilities: [
    { id: 'edp', name: 'Endpoint Detection and Response (EDR)' },
    { id: 'cloud-security', name: 'Cloud Security' },
    { id: 'email-security', name: 'Email Threat Protection' },
    { id: 'threat-intelligence', name: 'Threat Intelligence' },
  ],
  integrations: [
    { id: 'm365', name: 'Microsoft 365', description: 'Full Microsoft 365 integration including Defender for Office 365' },
    { id: 'aws', name: 'AWS', description: 'Amazon Web Services security' },
    { id: 'gcp', name: 'GCP', description: 'Google Cloud Platform security' },
    { id: 'azure', name: 'Azure', description: 'Microsoft Azure integration' },
  ],
  environments: [
    { id: 'on-premises', name: 'On-premises' },
    { id: 'cloud', name: 'Cloud' },
    { id: 'hybrid', name: 'Hybrid' },
    { id: 'microsoft-365', name: 'Microsoft 365' },
    { id: 'linux', name: 'Linux' },
    { id: 'macos', name: 'macOS' },
    { id: 'windows', name: 'Windows' },
  ],
  geoCoverage: ['UK', 'EU', 'North America', 'APAC'],
  targetSizes: ['SME (10-250 employees)', 'Mid-market (250-2,500 employees)', 'Enterprise (2,500+ employees)'],
  industries: [
    { id: 'finance', name: 'Financial Services' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'retail', name: 'Retail' },
    { id: 'manufacturing', name: 'Manufacturing' },
  ],
  research: [
    { id: 'ciso-report-2026', title: '2026 CISO Report', author: 'Sophos Institute', date: '2026-01-15', summary: 'Annual report on cybersecurity priorities, threats and skills gaps facing CISOs globally.', type: 'report' },
    { id: 'ai-security-whitepaper', title: 'AI Security 2026: The Complete Picture', author: 'Sophos Research', date: '2026-02-10', summary: 'Comprehensive analysis of AI-powered security, including LLM protections and generative AI safeguards.', type: 'whitepaper' },
    { id: 'ransomware-report', title: 'Ransomware Report 2026', author: 'Sophos Research', date: '2026-01-05', summary: 'Analysis of global ransomware trends, attacker tactics and prevention strategies.', type: 'report' },
    { id: 'm365-integration-guide', title: 'Microsoft 365 Integration Guide', author: 'Sophos', date: '2026-01-20', summary: 'Technical guide for integrating with Microsoft 365 including Defender for Office 365 coexistence.', type: 'guide' },
    { id: 'zero-trust-guide', title: 'Zero Trust Architecture Guide', author: 'Sophos Institute', date: '2026-02-20', summary: 'Best practices for implementing zero trust security architectures in modern enterprises.', type: 'guide' },
  ],
  articles: [
    { id: 'llm-protections', title: 'Protecting LLMs from Adversarial Attacks', author: 'Sophos Research Team', date: '2026-02-15', summary: 'Technical article on adversarial machine learning and protections for language models.', type: 'technical' },
    { id: 'microsoft-defender-coexistence', title: 'Using Sophos with Microsoft Defender: What You Need to Know', author: 'Sophos Solutions Team', date: '2026-01-25', summary: 'Explains how Sophos and Microsoft Defender can be used together for enhanced security.', type: 'solution' },
  ],
  videos: [
    { id: 'ciso-interview', title: 'CISO Panel: 2026 Security Priorities', durationMinutes: 45, date: '2026-01-30', summary: 'Panel discussion with CISOs on top security priorities for 2026.' },
    { id: 'demo-xperion', title: 'Xperion ONE Demo', durationMinutes: 12, date: '2026-01-10', summary: 'Product demonstration of the unified threat management platform.' },
  ],
  documentation: [
    { id: 'api-reference', title: 'API Reference', url: '#', description: 'Complete API documentation with code examples' },
    { id: 'integration-guides', title: 'Integration Guides', url: '#', description: 'Step-by-step integration guides for all platforms' },
    { id: 'deployment-guilde', title: 'Deployment Guide', url: '#', description: 'Installation and deployment best practices' },
  ],
  commonQuestions: [
    { id: 'm365-defender', question: 'How does Sophos integrate with Microsoft Defender for Office 365?', answer: `Sophos integrates with Microsoft Defender for Office 365 to provide additional protection layers. 
The integration includes:

1. **Email Security**: Sophos Email Security complements MDE by adding AI-driven threat detection
2. **Endpoint Protection**: Xperion ONE can work alongside Defender ATP (now part of Microsoft 365 Defender)
3. **Cloud Workload**: Cloud workload protection for Azure and AWS environments

This coexistence model is fully supported and documented.`, type: 'answered' },
    { id: 'sme-pricing', question: 'What is the pricing for SME customers?', answer: `Sophos offers tiered licensing based on user count and feature set. 
For customers with 10-250 employees, we provide bundled solutions that include email security, endpoint protection and cloud security in one platform.
Please contact our sales team for a quote tailored to your organisation.`, type: 'answered' },
    { id: 'compliance', question: 'Does Sophos meet GDPR compliance requirements?', answer: `Yes, Sophos maintains full GDPR compliance across all products and services. 
We process data according to European data protection standards and maintain appropriate certifications (ISO 27001, SOC 2 Type II).
Our data processing agreements are available upon request.`, type: 'answered' },
    { id: 'threat-feed', question: 'What is the scope of the threat intelligence feed?', answer: `Sophos maintains a global threat intelligence network with coverage across malware families, APT groups and threat actors worldwide. 
The Sophos Threat Intelligence Feed covers over 100 countries and monitors emerging threats in real-time.`, type: 'answered' },
    { id: 'disaster-recovery', question: 'What disaster recovery capabilities are available?', answer: `Sophos Central Office includes built-in backup and disaster recovery features, supporting immutable backups that protect against ransomware.
We support various storage backends and offer point-in-time recovery for individual files or full system restoration.`, type: 'answered' },
    { id: 'unanswered-network-optim', question: 'How does Sophos optimize network bandwidth usage?', answer: `We are researching this topic. Sophos does publish information on deep packet inspection capabilities in our technical documentation, but specific optimization techniques and bandwidth reduction metrics have not been established from public sources.`, type: 'unanswered' },
  ],
  unansweredQuestions: [
    { id: 'network-optim', question: 'How does Sophos optimize network bandwidth usage?', answer: `We are researching this topic. Sophos does publish information on deep packet inspection capabilities in our technical documentation, but specific optimization techniques and bandwidth reduction metrics have not been established from public sources.`, type: 'unanswered' },
  ],
}

/** List of all companies in the demo dataset */
export const companies: Company[] = [
  sophosCompany,
]

/** Search interpretation model - what elements to extract from queries */
export const searchInterpretations = {
  keywords: [
    'MDR', 'Managed Detection and Response',
    'UK', 'United Kingdom', 'British',
    'SME', 'small business', 'enterprise',
    'Microsoft 365', 'M365', 'Office 365',
    'Defender', 'Microsoft Defender', 'Defender for Office 365',
    'cybersecurity', 'security', 'threat protection',
    'AI', 'artificial intelligence',
    'cloud security',
    'email security',
    'endpoint protection',
  ],
  entities: ['company', 'product', 'capability', 'service'],
}

/** Demo analytics - explicitly labelled as simulated */
export const demoAnalytics = {
  totalUsers: 1250,
  monthlySessions: 45000,
  avgSearchDuration: '3.2 minutes',
  companiesSaved: 180,
  reportsDownloaded: 3200,
  searchesPerMonth: 89000,
  topCategories: ['cybersecurity', 'AI security', 'cloud platforms'],
}

/** Search result interpretation (static demo responses) */
export const searchInterpretationsMap: Record<string, SearchInterpretation> = {
  default: {
    intent: 'Broad company discovery',
    keywordsExtracted: ['cybersecurity', 'platform'],
    assumptions: [],
    clarifications: [],
    suggestedRefinements: [
      'Specify a capability or product you need',
      'Mention your organisation size',
      'Include geographic requirements',
      'Reference current technology stack',
    ],
  },
  mdr: {
    intent: 'Managed Detection and Response provider search',
    keywordsExtracted: ['MDR', 'managed detection'],
    assumptions: [],
    clarifications: [
      'Are you looking for MDR as a standalone service or integrated with existing tools?',
    ],
    suggestedRefinements: [
      'Specify preferred security vendor (Microsoft, CrowdStrike, etc.)',
      'Indicate organisation size and budget range',
    ],
  },
  m365: {
    intent: 'Security solutions for Microsoft 365 environment',
    keywordsExtracted: ['Microsoft 365', 'M365'],
    assumptions: [],
    clarifications: [
      'Are you looking for native M365 Defender features or third-party integrations?',
    ],
    suggestedRefinements: [
      'Specify your current Microsoft Defender usage level',
      'Indicate which workload needs protection (email, files, identity)',
    ],
  },
  uk: {
    intent: 'UK-based cybersecurity company search',
    keywordsExtracted: ['UK', 'United Kingdom'],
    assumptions: [],
    clarifications: [
      'Do you require GDPR-compliant data processing?',
    ],
    suggestedRefinements: [
      'Specify required certifications (ISO 27001, SOC 2)',
      'Indicate if UK-based support is required',
    ],
  },
}

/** Evidence strength levels */
export enum EvidenceStrength {
  Verified = 'verified',
  Established = 'established',
  Derived = 'derived',
  NotEstablished = 'not_established',
}

/** Comparison view state */
export interface ComparisonState {
  selectedCompanies: Company[]
  comparedFeatures: string[]
}
