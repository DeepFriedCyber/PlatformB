// Sophos demo data - PlatformB MVP fixture

export interface Capability {
  id: string;
  name: string;
  description: string;
  verified: boolean;
  evidenceCount?: number;
  risks?: string[];
}

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  capabilities: Capability[];
  integrations?: string[];
  environments?: string[];
}

interface CompanyDetails {
  name: string;
  slug: string;
  verifiedStatus: 'Verified' | 'Not established';
  domain: string;
  location: string;
  employees: number;
  founded: number;
  industry: string;
  description: string;
  products: Product[];
}

export const SOPHOS_COMPANIES: Record<string, CompanyDetails> = {
  sophos: {
    name: 'Sophos',
    slug: 'sophos-security',
    verifiedStatus: 'Verified',
    domain: 'sophos.com',
    location: 'Cambridge, UK / US Headquarters',
    employees: 6000,
    founded: 1985,
    industry: 'Cybersecurity & AI',
    description: 'Sophos develops enterprise cybersecurity solutions including email protection, endpoint security, network firewalls, and managed detection and response (MDR). The company serves businesses globally across multiple industries.',
    products: [
      {
        id: 'sophos-central',
        name: 'Sophos Central',
        category: 'Management Platform',
        description: 'Unified console for managing Sophos security solutions including XG firewalls, endpoints, and email security from a single dashboard.',
        capabilities: [
          {
            id: 'central-management',
            name: 'Centralized Management',
            description: 'Manage all security deployments from one platform with real-time visibility.',
            verified: true,
            evidenceCount: 12,
          },
          {
            id: 'advanced-analytics',
            name: 'Advanced Analytics',
            description: 'AI-powered threat detection and response across the entire security stack.',
            verified: true,
            evidenceCount: 8,
            risks: ['Claims depend on Sophos XG firewall integration'],
          },
        ],
      },
      {
        id: 'sophos-xg',
        name: 'Sophos XG Firewalls',
        category: 'Network Security',
        description: 'Next-generation firewalls with integrated threat protection, intrusion prevention, and application control. Available on-premises and as a cloud service.',
        capabilities: [
          {
            id: 'threat-protection',
            name: 'Advanced Threat Protection',
            description: 'Multi-layered security including IPS, antivirus, anti-malware, web filtering, and sandboxing.',
            verified: true,
            evidenceCount: 15,
          },
          {
            id: 'app-control',
            name: 'Application Control',
            description: 'Granular control over applications and websites based on policies.',
            verified: true,
            evidenceCount: 7,
          },
          {
            id: 'user-identity-integration',
            name: 'User Identity Integration',
            description: 'Integrate with Active Directory, Azure AD, and SAML for single sign-on.',
            verified: true,
            evidenceCount: 5,
          },
        ],
      },
      {
        id: 'sophos-ecp',
        name: 'Sophos Email Security',
        category: 'Email Protection',
        description: 'Advanced email protection against phishing, ransomware, and business email compromise. Integrates with Microsoft Exchange and Google Workspace.',
        capabilities: [
          {
            id: 'phishing-protection',
            name: 'Phishing Protection',
            description: 'AI-powered detection of sophisticated email threats including zero-day attacks.',
            verified: true,
            evidenceCount: 18,
          },
          {
            id: 'ransomware-filtration',
            name: 'Ransomware Filtration',
            description: 'Block ransomware attachments and links before they reach users inbox.',
            verified: true,
            evidenceCount: 14,
            risks: ['Effectiveness depends on attachment inspection settings'],
          },
        ],
      },
    ],
  },
};

export const SOPHOS_COMMON_QUESTIONS = [
  {
    id: 'q1',
    question: 'What industries does Sophos serve?',
    answers: [
      'Sophos serves diverse industries including healthcare, financial services, government, education, retail, manufacturing, and professional services.',
    ],
  },
  {
    id: 'q2',
    question: 'Is Sophos SOC available as a managed service?',
    answers: [
      'Yes, Sophos offers Managed Detection and Response (MDR) services with dedicated security analysts providing 24/7 monitoring and incident response.',
    ],
  },
  {
    id: 'q3',
    question: 'Can I use Sophos products without XG firewalls?',
    answers: [
      'Yes, many Sophos solutions like Central, Email Security, and Endpoint can be deployed independently. However, advanced analytics features require XG integration.',
    ],
  },
];

export const SOPHOS_SEARCH_DATA = {
  interpretations: [
    {
      query: 'Sophos email security',
      intent: 'Company + Product Search',
      entities: [
        { name: 'company', value: 'sophos-security' },
        { name: 'product', value: 'email protection' },
      ],
      context: ['Enterprise email protection', 'Phishing defense', 'Exchange integration'],
    },
    {
      query: 'Sophos advanced analytics',
      intent: 'Capability Inquiry',
      entities: [
        { name: 'company', value: 'sophos-security' },
        { name: 'capability', value: 'advanced-analytics' },
      ],
      context: ['AI-powered threat detection', 'XG integration required', 'Multi-platform visibility'],
    },
  ],
  results: [
    { id: 'c1', title: 'Sophos Company Overview', snippet: 'Enterprise cybersecurity leader since 1985...', source: 'company-overview' as const, category: 'company' as const },
    { id: 'p1', title: 'Sophos Central Management Platform', snippet: 'Unified security management console...', source: 'product-sophos-central' as const, category: 'product' as const },
    { id: 'p2', title: 'Sophos XG Firewalls', snippet: 'Next-generation firewalls with threat protection...', source: 'product-sophos-xg' as const, category: 'product' as const },
    { id: 'p3', title: 'Sophos Email Security', snippet: 'Advanced email protection against phishing...', source: 'product-sophos-ecp' as const, category: 'product' as const },
    ] as Array<{
    id: string;
    title: string;
    snippet: string;
    source?: string;
    category?: string;
  }>
};
