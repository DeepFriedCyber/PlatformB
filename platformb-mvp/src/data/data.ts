export interface Provider {
  id: string;
  name: string;
  verified: boolean;
}

export interface CompanyData {
  slug: string;
  name: string;
  location?: string;
  domain?: string;
  employeesRange?: string;
  foundingYear?: number;
  sector?: string;
  riskScore?: number;
  provider?: Provider;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface Capability {
  id: string;
  name: string;
  description: string;
  verified: boolean;
  evidenceCount?: number;
  risks?: string[];
}

export interface CompanyDetails {
  name: string;
  verifiedStatus: 'Verified' | 'Not established';
  description: string;
  domain?: string;
  location?: string;
  employees?: number;
  founded?: number;
  industry?: string;
  riskScore?: number;
  provider?: Provider;
  products?: Array<{
    id: string;
    name: string;
    category: string;
    description: string;
    capabilities: Capability[];
  }>;
}

export interface SearchResult {
  id: string;
  slug?: string;
  title: string;
  snippet: string;
  source?: 'company-overview' | 'product-sophos-central' | 'product-sophos-xg' | 'product-sophos-ecp';
  category?: 'company' | 'product';
  verifiedStatus?: 'Verified' | 'Not established';
}

export const PROVIDERS: Provider[] = [
  { id: 'p1', name: 'Thomson Reuters', verified: true },
  { id: 'p2', name: 'Crunchbase Pro', verified: true },
  { id: 'p3', name: 'Dun & Bradstreet', verified: false },
];

export const COMPANIES: CompanyData[] = [
  {
    slug: 'sophos-security',
    name: 'Sophos',
    location: 'Cambridge, UK / US Headquarters',
    domain: 'sophos.com',
    employeesRange: '5001+',
    foundingYear: 1985,
    sector: 'Cybersecurity & AI',
    riskScore: 1.2,
    provider: PROVIDERS[0],
  },
  {
    slug: '2b3c4d5e',
    name: 'Globex Industries',
    location: 'London, UK',
    domain: 'globex.example.com',
    employeesRange: '1001-5000',
    foundingYear: 1998,
    sector: 'Manufacturing',
    riskScore: 4.1,
    provider: PROVIDERS[0],
  },
  {
    slug: '3c4d5e6f',
    name: 'Stark Industries',
    location: 'New York, NY',
    domain: 'stark.example.com',
    employeesRange: '201-500',
    foundingYear: 2012,
    sector: 'Defense',
    riskScore: 3.8,
    provider: PROVIDERS[1],
  },
  {
    slug: '4d5e6f7a',
    name: 'Wayne Enterprises',
    location: 'Gotham City',
    domain: 'wayne.example.com',
    employeesRange: '5000+',
    foundingYear: 1939,
    sector: 'Conglomerate',
    riskScore: 1.9,
    provider: PROVIDERS[2],
  },
  {
    slug: '5e6f7a8b',
    name: 'Cyberdyne Systems',
    location: 'Seattle, WA',
    domain: 'cyberdyne.example.com',
    employeesRange: '101-200',
    foundingYear: 1984,
    sector: 'AI Research',
    riskScore: 5.2,
    provider: PROVIDERS[0],
  },
];

export const COMPANY_DETAILS: Record<string, CompanyDetails> = {
  'sophos-security': {
    name: 'Sophos',
    verifiedStatus: 'Verified',
    description: 'Sophos develops enterprise cybersecurity solutions including email protection, endpoint security, network firewalls, and managed detection and response (MDR). The company serves businesses globally across multiple industries.',
    domain: 'sophos.com',
    location: 'Cambridge, UK / US Headquarters',
    employees: 6000,
    founded: 1985,
    industry: 'Cybersecurity & AI',
    riskScore: 1.2,
    provider: PROVIDERS[0],
    products: [
      {
        id: 'sophos-central',
        name: 'Sophos Central',
        category: 'Management Platform',
        description: 'Unified console for managing Sophos security solutions including XG firewalls, endpoints, and email security from a single dashboard.',
        capabilities: [
          { id: 'central-management', name: 'Centralized Management', description: 'Manage all security deployments from one platform with real-time visibility.', verified: true, evidenceCount: 12 },
          { id: 'advanced-analytics', name: 'Advanced Analytics', description: 'AI-powered threat detection and response across the entire security stack.', verified: true, evidenceCount: 8, risks: ['Claims depend on Sophos XG firewall integration'] },
        ],
      },
      {
        id: 'sophos-xg',
        name: 'Sophos XG Firewalls',
        category: 'Network Security',
        description: 'Next-generation firewalls with integrated threat protection, intrusion prevention, and application control. Available on-premises and as a cloud service.',
        capabilities: [
          { id: 'threat-protection', name: 'Advanced Threat Protection', description: 'Multi-layered security including IPS, antivirus, anti-malware, web filtering, and sandboxing.', verified: true, evidenceCount: 15 },
          { id: 'app-control', name: 'Application Control', description: 'Granular control over applications and websites based on policies.', verified: true, evidenceCount: 7 },
          { id: 'user-identity-integration', name: 'User Identity Integration', description: 'Integrate with Active Directory, Azure AD, and SAML for single sign-on.', verified: true, evidenceCount: 5 },
        ],
      },
      {
        id: 'sophos-ecp',
        name: 'Sophos Email Security',
        category: 'Email Protection',
        description: 'Advanced email protection against phishing, ransomware, and business email compromise. Integrates with Microsoft Exchange and Google Workspace.',
        capabilities: [
          { id: 'phishing-protection', name: 'Phishing Protection', description: 'AI-powered detection of sophisticated email threats including zero-day attacks.', verified: true, evidenceCount: 18 },
          { id: 'ransomware-filtration', name: 'Ransomware Filtration', description: 'Block ransomware attachments and links before they reach users inbox.', verified: true, evidenceCount: 14, risks: ['Effectiveness depends on attachment inspection settings'] },
        ],
      },
    ],
  },
  '2b3c4d5e': {
    name: 'Globex Industries',
    verifiedStatus: 'Verified',
    description: 'Globex Industries manufactures industrial automation equipment and robotics systems. Based in London with operations across Europe, the company is a member of major industry associations.',
    domain: 'globex.example.com',
    location: 'London, UK',
    employees: 3200,
    founded: 1998,
    industry: 'Industrial Automation',
    riskScore: 4.1,
    provider: PROVIDERS[0],
  },
  '3c4d5e6f': {
    name: 'Stark Industries',
    verifiedStatus: 'Not established',
    description: 'Demo data for Stark Industries - company information provided by third-party sources. Please verify through official channels before making business decisions.',
    domain: 'stark.example.com',
    location: 'New York, NY',
    employees: 350,
    founded: 2012,
    industry: 'Defense Technology',
    riskScore: 3.8,
    provider: PROVIDERS[1],
  },
  '4d5e6f7a': {
    name: 'Wayne Enterprises',
    verifiedStatus: 'Not established',
    description: 'Demo data for Wayne Enterprises - historical company information derived from public records. Verification status: Not established by primary sources.',
    domain: 'wayne.example.com',
    location: 'Gotham City',
    employees: 8500,
    founded: 1939,
    industry: 'Diversified Conglomerate',
    riskScore: 1.9,
    provider: PROVIDERS[2],
  },
  '5e6f7a8b': {
    name: 'Cyberdyne Systems',
    verifiedStatus: 'Verified',
    description: 'Cyberdyne Systems develops advanced AI and neural network technologies. The company has received multiple research grants and maintains partnerships with leading universities.',
    domain: 'cyberdyne.example.com',
    location: 'Seattle, WA',
    employees: 180,
    founded: 1984,
    industry: 'Artificial Intelligence',
    riskScore: 5.2,
    provider: PROVIDERS[0],
  },
};

export const SEARCH_RESULTS: SearchResult[] = [
  { id: 'c1', title: 'Sophos Company Overview', snippet: 'Enterprise cybersecurity leader since 1985...', source: 'company-overview' as const, category: 'company' as const, verifiedStatus: 'Verified' },
  { id: 'p1', title: 'Sophos Central Management Platform', snippet: 'Unified security management console...', source: 'product-sophos-central' as const, category: 'product' as const, verifiedStatus: 'Verified' },
  { id: 'p2', title: 'Sophos XG Firewalls', snippet: 'Next-generation firewalls with threat protection...', source: 'product-sophos-xg' as const, category: 'product' as const, verifiedStatus: 'Verified' },
  { id: 'p3', title: 'Sophos Email Security', snippet: 'Advanced email protection against phishing...', source: 'product-sophos-ecp' as const, category: 'product' as const, verifiedStatus: 'Verified' },
];

export interface SearchInterpretation {
  query: string;
  intent: string;
  entities: Array<{ name: string; value: string }>;
  context: string[];
}

export const SEARCH_INTERPRETATIONS: Record<string, SearchInterpretation> = {
  'sophos email security': {
    query: 'Sophos email security',
    intent: 'Company + Product Search',
    entities: [
      { name: 'company', value: 'sophos-security' },
      { name: 'product', value: 'email protection' },
    ],
    context: ['Enterprise email protection', 'Phishing defense', 'Exchange integration'],
  },
  'sophos advanced analytics': {
    query: 'Sophos advanced analytics',
    intent: 'Capability Inquiry',
    entities: [
      { name: 'company', value: 'sophos-security' },
      { name: 'capability', value: 'advanced-analytics' },
    ],
    context: ['AI-powered threat detection', 'XG integration required', 'Multi-platform visibility'],
  },
};
