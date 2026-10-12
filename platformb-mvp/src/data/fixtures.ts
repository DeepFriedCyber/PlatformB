export const sophosCompanies: Company[] = [
  {
    id: 'c001',
    name: 'Sophos PLC',
    ticker: 'SOF',
    sector: 'Technology',
    marketCap: '5.8B',
    verified: true,
    description: 'Sophos PLC is a British multinational cybersecurity software company headquartered in Cambridge, England.',
    headquarters: 'Cambridge, UK',
    founded: 1985,
    employees: '3,000+',
    website: 'https://www.sophos.com',
    products: [
      { name: 'Sophos Intercept X', type: 'Endpoint Protection' },
      { name: 'Sophos XG Firewalls', type: 'Network Security' },
      { name: 'Sophos Central', type: 'Management Platform' },
      { name: 'Sophos Email Security', type: 'Email Protection' }
    ],
    keyMetrics: [
      { label: 'Q3 Revenue', value: '£56.2M', change: '+12%', note: 'Demo data' },
      { label: 'Active Subscriptions', value: '480K', change: '+8%', note: 'Demo data' },
      { label: 'Security Threats Blocked', value: '99.7%', change: '+0.3%', note: 'Demo data' }
    ],
    recentNews: [
      { title: 'Sophos Announces Q3 2024 Results', date: '2024-10-05', source: 'Company Press Release', verified: true },
      { title: 'New AI-Powered Threat Detection Launched', date: '2024-09-28', source: 'TechCrunch', verified: false }
    ],
    analystRatings: [
      { firm: 'Morgan Stanley', rating: 'Overweight', priceTarget: '£1,650' },
      { firm: 'Goldman Sachs', rating: 'Buy', priceTarget: '£1,580' }
    ],
    relatedCompanies: ['Palo Alto Networks', 'CrowdStrike', 'SentinelOne'],
    stockData: {
      currentPrice: 1.42,
      change: '+2.3%',
      peRatio: '45.2',
      dividendYield: '0.8%'
    },
    risks: [
      'Ransomware attacks targeting cybersecurity vendors',
      'Data privacy regulation changes in EU and US markets'
    ],
    tags: ['Cybersecurity', 'Enterprise Software', 'UK Tech', 'Cloud Security']
  },
  {
    id: 'c002',
    name: 'Palo Alto Networks',
    ticker: 'PANW',
    sector: 'Technology',
    marketCap: '98.5B',
    verified: true,
    description: 'Palo Alto Networks Inc. provides cybersecurity solutions worldwide.',
    headquarters: 'Santa Clara, CA',
    founded: 2005,
    employees: '15,000+',
    website: 'https://www.paloaltonetworks.com',
    products: [
      { name: 'Prisma Access', type: 'Cloud Security' },
      { name: 'Cortex XDR', type: 'Extended Detection & Response' }
    ],
    keyMetrics: [
      { label: 'Q3 Revenue', value: '$1.9B', change: '+5%', note: 'Demo data' },
      { label: 'Customer Count', value: '24,000+', change: '+3%', note: 'Demo data' }
    ],
    recentNews: [
      { title: 'Palo Alto Networks Unveils AI Security Platform', date: '2024-10-03', source: 'Reuters', verified: false }
    ],
    analystRatings: [
      { firm: 'JP Morgan', rating: 'Overweight', priceTarget: '$650' },
      { firm: 'Wedbush', rating: 'Outperform', priceTarget: '$720' }
    ],
    relatedCompanies: ['Sophos PLC', 'CrowdStrike'],
    stockData: {
      currentPrice: 318.45,
      change: '-1.2%',
      peRatio: '52.8',
      dividendYield: '-'
    },
    risks: [
      'Intense competition in cybersecurity market',
      'Potential regulatory scrutiny on data practices'
    ],
    tags: ['Cybersecurity', 'Cloud Security', 'Enterprise']
  },
  {
    id: 'c003',
    name: 'CrowdStrike Holdings',
    ticker: 'CRWD',
    sector: 'Technology',
    marketCap: '62.1B',
    verified: true,
    description: 'CrowdStrike Holdings, Inc. provides cloud-delivered protection against cyber threats.',
    headquarters: 'Austin, TX',
    founded: 2011,
    employees: '8,000+',
    website: 'https://www.crowdstrike.com',
    products: [
      { name: 'CrowdStrike Falcon', type: 'Endpoint Protection' },
      { name: 'Falcon Overwatch', type: 'Threat Hunting' }
    ],
    keyMetrics: [
      { label: 'Q3 Revenue', value: '$1.05B', change: '+18%', note: 'Demo data' },
      { label: 'ARR Growth', value: '24%', change: 'N/A', note: 'Demo data' }
    ],
    recentNews: [
      { title: 'CrowdStrike Expands AI Platform Capabilities', date: '2024-10-01', source: 'ZDNet', verified: true }
    ],
    analystRatings: [
      { firm: 'Bank of America', rating: 'Buy', priceTarget: '$380' },
      { firm: 'Morgan Stanley', rating: 'Overweight', priceTarget: '$425' }
    ],
    relatedCompanies: ['Sophos PLC', 'Palo Alto Networks'],
    stockData: {
      currentPrice: 295.32,
      change: '+1.8%',
      peRatio: '78.5',
      dividendYield: '-'
    },
    risks: [
      'Market saturation in enterprise security segment',
      'Dependency on single major customer'
    ],
    tags: ['Endpoint Security', 'Cloud Native', 'AI/ML']
  }
];

export type Company = {
  id: string;
  name: string;
  ticker: string;
  sector: string;
  marketCap: string;
  verified: boolean;
  description: string;
  headquarters: string;
  founded: number;
  employees: string;
  website: string;
  products: { name: string; type: string }[];
  keyMetrics: { label: string; value: string; change: string; note?: string }[];
  recentNews: { title: string; date: string; source: string; verified: boolean }[];
  analystRatings: { firm: string; rating: string; priceTarget: string }[];
  relatedCompanies: string[];
  stockData: { currentPrice: number; change: string; peRatio: string; dividendYield: string };
  risks: string[];
  tags: string[];
};
