/**
 * Demo Data - PlatformB MVP Prototype
 * 
 * IMPORTANT: All analytics, usage stats, and discovery metrics shown in this dataset
 * are simulated demo data only. They do not represent actual Sophos or PlatformB data.
 * The distinction between Verified, Not established, and Demo/derived information
 * is preserved throughout the application.
 */

export interface Company {
  id: string;
  name: string;
  verified: boolean;
  establishmentDate?: string;
  employees?: number;
  revenue?: string;
  description?: string;
  website?: string;
}

// Demo data - Sophos Ltd (main dataset for MVP demonstration)
export const sophosCompany: Company = {
  id: 'sophos-ltd',
  name: 'Sophos Ltd',
  verified: true,
  establishmentDate: '1985-04-26',
  employees: 3500,
  revenue: '£1.7 billion (FY2024)',
  description: 'Sophos Limited is a British multinational cybersecurity and digital transformation technology company founded in 1985 by Rob Griffiths.',
  website: 'https://www.sophos.com',
};

// Demo data - Search results for various queries
export const searchResults = {
  // Query: "Sophos"
  sophos: [
    { id: 'sophos-ltd', name: 'Sophos Ltd', verified: true, snippet: 'British multinational cybersecurity company founded in 1985' },
    { id: 'sophos-inc', name: 'Sophos Inc.', verified: false, snippet: 'US subsidiary of Sophos Ltd, established 2012. Not established as independent entity.' },
  ],
  
  // Query: "Rob Griffiths"
  robbertGriffiths: [
    { id: 'robbert-griffiths', name: 'Robbert Griffiths', verified: true, snippet: 'Founder and CEO of Sophos since 1985' },
    { id: 'rob-griffiths-sophos-inc', name: 'Rob Griffiths (Sophos Inc.)', verified: false, snippet: 'US President. Not established as separate entity from founder.' },
  ],
  
  // Query: "Sophos antivirus"
  sophosAntivirus: [
    { id: 'sophos-endpoint-protection', name: 'Sophos Endpoint Protection', verified: true, snippet: 'Sophos AI-powered endpoint security solution' },
    { id: 'sophos-network-firewall', name: 'Sophos Network Security', verified: true, snippet: 'Sophos network firewall and threat intelligence platform' },
  ],
  
  // Query: "Sophos stock"
  sophosStock: [
    { id: 'sophos-stock-london', name: 'LSE: SOF', verified: true, snippet: 'Trading as Sophos Ltd on London Stock Exchange. Not established for US listings.' },
  ],
  
  // Query: "Sophos location"
  sophosLocation: [
    { id: 'sophos-headquarters', name: 'Sophos Headquarters', verified: true, snippet: 'Cavendish House, St John\'s Innovation Centre, Cambridge, CB4 0GS, UK' },
    { id: 'sophos-offices', name: 'Global Offices', verified: false, snippet: 'Not established complete list. Operating from multiple international locations.' },
  ],
};

// Demo data - Saved companies for console view
export const savedCompanies = [
  sophosCompany,
];

// Demo data - Discovery provider results
export const discoveryProviders = [
  {
    name: 'Sophos Ltd',
    verificationStatus: 'verified',
    verifiedBy: 'Corporate Registry (UK)',
    dataQuality: 'high',
  },
];
