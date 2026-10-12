// PlatformB Query Interpreter - Static Demo Data for MVP
// Extracts entities and provides interpretation notes from search queries
// All analytics/interpretations are labeled as Demo data

export interface QueryInterpretation {
  entities: string[];
  notes: string[];
}

/**
 * Interpret a search query and extract important entities
 * 
 * In production, this would call an NLP service or use embeddings to understand
 * the query intent. For MVP with static data, we simulate interpretation by
 * extracting known cybersecurity terms and concepts from the query.
 * 
 * @param queryTerms - Space-separated query terms
 * @returns Array of interpretation notes for display to user
 */
export function interpretQuery(queryTerms: string[]): string[] {
  const notes: string[] = [];
  
  // Convert to lowercase for matching
  const lowerTerms = queryTerms.map(t => t.toLowerCase());
  
  // Extract entities based on known cybersecurity domain knowledge
  const entities = new Set<string>();
  
  // Industry/product terms
  if (lowerTerms.includes('mdr')) {
    entities.add('MDR');
  }
  if (lowerTerms.includes('managed security') || lowerTerms.includes('security services')) {
    entities.add('Managed Security Services');
  }
  if (lowerTerms.includes('endpoint protection') || lowerTerms.includes('endpoint security')) {
    entities.add('Endpoint Protection');
  }
  if (lowerTerms.includes('firewall')) {
    entities.add('Firewall');
  }
  if (lowerTerms.includes('email security') || lowerTerms.includes('mail security')) {
    entities.add('Email Security');
  }
  if (lowerTerms.includes('ransomware')) {
    entities.add('Ransomware Protection');
  }
  if (lowerTerms.includes('network security')) {
    entities.add('Network Security');
  }
  if (lowerTerms.includes('cloud security')) {
    entities.add('Cloud Security');
  }
  
  // Geographic terms
  if (lowerTerms.some(t => t.includes('uk') || t === 'united kingdom')) {
    entities.add('UK');
  }
  if (lowerTerms.some(t => t.includes('europe'))) {
    entities.add('Europe');
  }
  
  // Organization size terms
  if (lowerTerms.includes('sme') || lowerTerms.includes('small business') || lowerTerms.includes('startup')) {
    entities.add('SME/Small Business');
  }
  if (lowerTerms.includes('enterprise') || lowerTerms.includes('large company')) {
    entities.add('Enterprise');
  }
  
  // Technology stack terms
  if (lowerTerms.includes('microsoft 365') || lowerTerms.includes('m365') || lowerTerms.includes('defender')) {
    entities.add('Microsoft 365');
    if (lowerTerms.includes('defender')) {
      entities.add('Microsoft Defender');
    }
  }
  if (lowerTerms.includes('aws') || lowerTerms.includes('azure') || lowerTerms.includes('gcp')) {
    entities.add('Cloud Platform');
  }
  
  // Use case terms
  if (lowerTerms.some(t => t.includes('coexist') || t.includes('existing'))) {
    entities.add('Existing tool coexistence');
  }
  if (lowerTerms.some(t => t.includes('replace')) || lowerTerms.some(t => t.includes('alternative'))) {
    entities.add('Tool replacement');
  }
  
  // Intent terms
  if (lowerTerms.some(t => t.includes('compare') || t.includes('which'))) {
    entities.add('Comparison intent');
  }
  if (lowerTerms.some(t => t.includes('recommendation')) || lowerTerms.some(t => t.includes('should'))) {
    entities.add('Recommendation request');
  }
  
  // Convert entity set to array
  const entityArray = Array.from(entities);
  
  // Generate interpretation notes
  for (const entity of entityArray) {
    notes.push(`Interpretation: ${entity} identified from query`);
  }
  
  // Add context note if entities found
  if (notes.length > 0) {
    notes.unshift('Query successfully interpreted');
  } else {
    // Default note for generic queries or when no specific terms matched
    notes.push(
      'Demo data: Query interpreted as-is. In production, semantic understanding would ' +
      'extract topics and entities using NLP embeddings.'
    );
  }
  
  return notes;
}

/**
 * Demo data flag for clarity in UI
 */
export function isDemoData(): boolean {
  return true;
}