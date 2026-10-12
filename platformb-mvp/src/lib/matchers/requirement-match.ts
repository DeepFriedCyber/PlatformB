import type {
  EvidenceSource,
  ProvenanceEvidenceRecord,
  Requirement,
  RequirementEvaluation,
  SupplierCapabilityClaim,
  SupplierEvaluation,
} from "@/types";

export interface SupplierRecord {
  name: string;
  data: {
    id?: string;
    name?: string;
    category?: string;
    description?: string;
    features?: string[];
    capabilities?: string[];
    categories?: string[];
    supportedEnvironments?: string[];
    targetOrgSizes?: string[];
    pricetiers?: string[];
    established?: boolean;
    evidenceSources: EvidenceSource[];
    capabilityClaims?: SupplierCapabilityClaim[];
    provenanceEvidence?: ProvenanceEvidenceRecord[];
    demoData?: boolean;
  };
}

export type SupplierMatchClass = "complete" | "potential" | "excluded";

interface RequirementRule {
  id: string;
  capability: string;
  value: string | null;
  phrases: string[];
  requiredByDefault: boolean;
}

const REQUIREMENT_RULES: RequirementRule[] = [
  {
    id: "MDR",
    capability: "Managed Detection and Response",
    value: null,
    phrases: ["mdr", "managed detection and response"],
    requiredByDefault: true,
  },
  {
    id: "EDR",
    capability: "Endpoint Detection and Response",
    value: null,
    phrases: ["edr", "endpoint detection and response"],
    requiredByDefault: false,
  },
  {
    id: "MICROSOFT-365",
    capability: "Microsoft 365 integration",
    value: "microsoft 365",
    phrases: ["microsoft 365", "m365", "office 365", "microsoft defender"],
    requiredByDefault: true,
  },
  {
    id: "UK-SERVICE-COVERAGE",
    capability: "Service coverage for UK customers",
    value: "uk",
    phrases: ["serve uk customers", "supports uk customers", "support uk customers", "for uk customers", "uk customer coverage"],
    requiredByDefault: true,
  },
  {
    id: "UK-SERVICE-TEAM",
    capability: "UK-based service team",
    value: "uk",
    phrases: ["uk based service team", "uk-based service team", "uk support team", "uk service team"],
    requiredByDefault: true,
  },
  {
    id: "UK-DATA-RESIDENCY",
    capability: "UK data residency",
    value: "uk",
    phrases: ["uk data residency", "data residency in uk", "hosted in uk", "data in uk"],
    requiredByDefault: true,
  },
  {
    id: "SME-SUITABILITY",
    capability: "SME suitability",
    value: "sme",
    phrases: ["sme", "small business", "small businesses", "small and medium"],
    requiredByDefault: true,
  },
  {
    id: "CONTEXT-BUYER-LOCATION-UK",
    capability: "Buyer location context (UK)",
    value: "uk",
    phrases: ["uk business", "uk sme", "based in uk", "we are in uk", "our uk team"],
    requiredByDefault: false,
  },
];

const REQUIRED_MARKERS = [" must ", " required", " requirement", " need ", " needs ", " have to "];
const PREFERRED_MARKERS = [" prefer", " preferred", " ideally", " nice to have", " optional", " if possible"];

const STOPWORDS = new Set<string>([
  "a", "an", "the", "and", "or", "for", "to", "with", "without", "in", "on", "of", "we", "our", "is", "are", "be", "that", "this", "using", "use", "want", "dont", "don't", "do", "not", "need", "needs", "must", "should", "could", "would", "provider", "providers", "solution", "solutions", "service", "services", "team", "based",
]);

function normalizeText(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9\s'-]+/g, " ").replace(/\s+/g, " ").trim();
}

function normalizePhrase(input: string): string {
  return normalizeText(input).replace(/'/g, "");
}

function toWords(input: string): string[] {
  if (!input) {
    return [];
  }
  return normalizePhrase(input).split(" ").filter(Boolean);
}

function containsAny(text: string, markers: string[]): boolean {
  return markers.some((marker) => text.includes(marker));
}

function findPhraseWordRanges(words: string[], phraseWords: string[]): Array<{ start: number; end: number }> {
  if (!words.length || !phraseWords.length) {
    return [];
  }

  const ranges: Array<{ start: number; end: number }> = [];
  for (let start = 0; start <= words.length - phraseWords.length; start += 1) {
    let matches = true;
    for (let offset = 0; offset < phraseWords.length; offset += 1) {
      if (words[start + offset] !== phraseWords[offset]) {
        matches = false;
        break;
      }
    }
    if (matches) {
      ranges.push({ start, end: start + phraseWords.length - 1 });
    }
  }

  return ranges;
}

function isRangeNegated(words: string[], start: number): boolean {
  const windowStart = Math.max(0, start - 4);
  const leftContext = words.slice(windowStart, start).join(" ");

  if (leftContext.includes("without")) {
    return true;
  }
  if (leftContext.includes("exclude") || leftContext.includes("excluding")) {
    return true;
  }
  if (leftContext.includes("do not want") || leftContext.includes("dont want") || leftContext.includes("don't want")) {
    return true;
  }
  if (leftContext.endsWith("not") || leftContext.endsWith("no")) {
    return true;
  }

  return false;
}

function buildRequirement(rule: RequirementRule, query: string, negated: boolean, requiredOverride?: boolean): Requirement {
  const normalizedQuery = ` ${normalizePhrase(query)} `;
  const required = requiredOverride ?? (containsAny(normalizedQuery, REQUIRED_MARKERS) || rule.requiredByDefault);
  const preferred = !required && containsAny(normalizedQuery, PREFERRED_MARKERS);

  return {
    id: rule.id,
    capability: rule.capability,
    value: rule.value,
    required,
    preferred,
    negated,
    originalText: query.trim(),
  };
}

function buildUnknownRequirement(id: string, text: string, required = true): Requirement {
  return {
    id,
    capability: "Unknown buyer requirement",
    value: text,
    required,
    preferred: !required,
    negated: false,
    originalText: text,
  };
}

function collectResidualUnknownRequirement(query: string, consumedRanges: Array<{ start: number; end: number }>): Requirement[] {
  const words = toWords(query);
  if (!words.length) {
    return [];
  }

  const consumedIndices = new Set<number>();
  for (const range of consumedRanges) {
    for (let index = range.start; index <= range.end; index += 1) {
      consumedIndices.add(index);
    }
  }

  const leftovers = words.filter((word, index) => !consumedIndices.has(index));
  const meaningful = leftovers.filter((word) => !STOPWORDS.has(word) && /[a-z]/.test(word));

  if (meaningful.length < 2) {
    return [];
  }

  return [buildUnknownRequirement("UNKNOWN-1", meaningful.join(" "), true)];
}

export function parseQueryToRequirements(query: string): Requirement[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const words = toWords(trimmed);
  const requirements: Requirement[] = [];
  const consumedRanges: Array<{ start: number; end: number }> = [];

  let hasExplicitUKSupplierRequirement = false;

  for (const rule of REQUIREMENT_RULES) {
    const phraseMatches: Array<{ start: number; end: number; negated: boolean }> = [];

    for (const phrase of rule.phrases) {
      const phraseWords = toWords(phrase);
      const ranges = findPhraseWordRanges(words, phraseWords);
      for (const range of ranges) {
        phraseMatches.push({ start: range.start, end: range.end, negated: isRangeNegated(words, range.start) });
      }
    }

    if (!phraseMatches.length) {
      continue;
    }

    const hasNegated = phraseMatches.some((match) => match.negated);
    const hasAffirmative = phraseMatches.some((match) => !match.negated);

    if (hasNegated && hasAffirmative) {
      requirements.push(buildUnknownRequirement(`UNKNOWN-NEGATION-${rule.id}`, `Ambiguous negation scope for ${rule.capability}`, true));
      continue;
    }

    for (const match of phraseMatches) {
      consumedRanges.push({ start: match.start, end: match.end });
    }

    if (rule.id.startsWith("UK-SERVICE") || rule.id === "UK-DATA-RESIDENCY") {
      hasExplicitUKSupplierRequirement = true;
    }

    const requiredOverride = rule.id === "CONTEXT-BUYER-LOCATION-UK" ? false : undefined;
    requirements.push(buildRequirement(rule, trimmed, hasNegated, requiredOverride));
  }

  const normalizedQuery = normalizePhrase(trimmed);
  const hasUkToken = words.includes("uk") || normalizedQuery.includes("united kingdom");
  const hasSmeToken = words.includes("sme") || normalizedQuery.includes("small business") || normalizedQuery.includes("small businesses");

  if (hasUkToken && hasSmeToken && !hasExplicitUKSupplierRequirement) {
    const hasContext = requirements.some((requirement) => requirement.id === "CONTEXT-BUYER-LOCATION-UK");
    if (!hasContext) {
      const contextRule = REQUIREMENT_RULES.find((rule) => rule.id === "CONTEXT-BUYER-LOCATION-UK");
      if (contextRule) {
        requirements.push(buildRequirement(contextRule, trimmed, false, false));
      }
    }
  }

  const deduped = new Map<string, Requirement>();
  for (const requirement of requirements) {
    if (!deduped.has(requirement.id)) {
      deduped.set(requirement.id, requirement);
    }
  }

  const residualUnknown = collectResidualUnknownRequirement(trimmed, consumedRanges);
  for (const requirement of residualUnknown) {
    if (!deduped.has(requirement.id)) {
      deduped.set(requirement.id, requirement);
    }
  }

  if (deduped.size === 0) {
    deduped.set("UNKNOWN-1", buildUnknownRequirement("UNKNOWN-1", normalizePhrase(trimmed), true));
  }

  return Array.from(deduped.values());
}

function toEvidenceSource(record: ProvenanceEvidenceRecord): EvidenceSource {
  return {
    type: record.sourceType === "unknown" ? "announcement" : record.sourceType,
    source: record.publisher || record.sourceTitle || "Unknown source",
    title: record.sourceTitle,
    url: record.sourceUrl,
    established: record.evidenceStatus === "supports_claim" || record.evidenceStatus === "contradicts_claim",
    date: record.observedAt,
  };
}

function findClaimForRequirement(requirement: Requirement, supplier: SupplierRecord): SupplierCapabilityClaim | undefined {
  const claims = supplier.data.capabilityClaims ?? [];
  const supplierId = supplier.data.id;

  return claims.find((claim) => {
    if (supplierId && claim.supplierId !== supplierId) {
      return false;
    }
    return claim.capabilityId === requirement.id;
  });
}

function evidenceMapForSupplier(supplier: SupplierRecord): Map<string, ProvenanceEvidenceRecord> {
  const map = new Map<string, ProvenanceEvidenceRecord>();
  for (const record of supplier.data.provenanceEvidence ?? []) {
    if (record.supplierId !== (supplier.data.id ?? record.supplierId)) {
      continue;
    }
    map.set(record.id, record);
  }
  return map;
}

function selectEvidenceByStatus(
  claim: SupplierCapabilityClaim,
  evidenceMap: Map<string, ProvenanceEvidenceRecord>,
  status: "supports_claim" | "contradicts_claim"
): { record?: ProvenanceEvidenceRecord; broken: boolean } {
  const ids = status === "supports_claim" ? claim.evidenceIds : claim.contradictingEvidenceIds;
  let broken = false;

  for (const id of ids) {
    const record = evidenceMap.get(id);
    if (!record) {
      broken = true;
      continue;
    }
    if (claim.productOrServiceId && record.productOrServiceId && claim.productOrServiceId !== record.productOrServiceId) {
      broken = true;
      continue;
    }
    if (record.evidenceStatus === status) {
      return { record, broken };
    }
  }

  return { broken };
}

function evaluateKnownRequirement(requirement: Requirement, supplier: SupplierRecord): RequirementEvaluation {
  if (requirement.id === "CONTEXT-BUYER-LOCATION-UK") {
    return {
      status: "not_established",
      reason: "Buyer-location context is not a supplier capability requirement.",
      capabilityMatched: false,
      evidenceRelationshipStatus: "absent",
    };
  }

  const claim = findClaimForRequirement(requirement, supplier);
  if (!claim) {
    return {
      status: "not_established",
      reason: "Not established — no applicable supporting evidence available.",
      capabilityMatched: false,
      evidenceRelationshipStatus: "absent",
    };
  }

  const evidenceMap = evidenceMapForSupplier(supplier);
  const support = selectEvidenceByStatus(claim, evidenceMap, "supports_claim");
  const contradiction = selectEvidenceByStatus(claim, evidenceMap, "contradicts_claim");

  const relationshipStatus: "linked" | "broken" | "absent" =
    support.record || contradiction.record
      ? "linked"
      : support.broken || contradiction.broken
        ? "broken"
        : "absent";

  const conflictingEvidenceIds = support.record && contradiction.record
    ? [support.record.id, contradiction.record.id]
    : undefined;

  if (support.record && contradiction.record) {
    return {
      status: "not_established",
      claimId: claim.id,
      claimStatement: claim.statement,
      evidenceRelationshipStatus: "linked",
      conflictingEvidenceIds,
      reason: "Conflicting linked evidence: both supporting and contradictory records found.",
      capabilityMatched: true,
    };
  }

  if (requirement.negated) {
    if (contradiction.record) {
      return {
        status: "supported",
        evidenceRecord: contradiction.record,
        evidenceSource: toEvidenceSource(contradiction.record),
        conflictingEvidenceIds,
        claimId: claim.id,
        claimStatement: claim.statement,
        evidenceRelationshipStatus: relationshipStatus,
        reason: `Supported by contradiction evidence: ${contradiction.record.sourceTitle ?? contradiction.record.id}.`,
        capabilityMatched: true,
      };
    }

    if (support.record) {
      return {
        status: "contradicted",
        evidenceRecord: support.record,
        evidenceSource: toEvidenceSource(support.record),
        conflictingEvidenceIds,
        claimId: claim.id,
        claimStatement: claim.statement,
        evidenceRelationshipStatus: relationshipStatus,
        reason: `Contradicted by evidence that capability exists: ${support.record.sourceTitle ?? support.record.id}.`,
        capabilityMatched: true,
      };
    }

    return {
      status: "not_established",
      conflictingEvidenceIds,
      claimId: claim.id,
      claimStatement: claim.statement,
      evidenceRelationshipStatus: relationshipStatus,
      reason: "Not established — no applicable supporting evidence available.",
      capabilityMatched: false,
    };
  }

  if (support.record) {
    return {
      status: "supported",
      evidenceRecord: support.record,
      evidenceSource: toEvidenceSource(support.record),
      conflictingEvidenceIds,
      claimId: claim.id,
      claimStatement: claim.statement,
      evidenceRelationshipStatus: relationshipStatus,
      reason: `Supported by linked evidence: ${support.record.sourceTitle ?? support.record.id}.`,
      capabilityMatched: true,
    };
  }

  if (contradiction.record) {
    return {
      status: "contradicted",
      evidenceRecord: contradiction.record,
      evidenceSource: toEvidenceSource(contradiction.record),
      conflictingEvidenceIds,
      claimId: claim.id,
      claimStatement: claim.statement,
      evidenceRelationshipStatus: relationshipStatus,
      reason: `Contradicted by linked evidence: ${contradiction.record.sourceTitle ?? contradiction.record.id}.`,
      capabilityMatched: true,
    };
  }

  return {
    status: "not_established",
    conflictingEvidenceIds,
    claimId: claim.id,
    claimStatement: claim.statement,
    evidenceRelationshipStatus: relationshipStatus,
    reason: "Not established — no applicable supporting evidence available.",
    capabilityMatched: false,
  };
}

function evaluateSupplierRequirement(requirement: Requirement, supplier: SupplierRecord): RequirementEvaluation {
  const knownRule = REQUIREMENT_RULES.find((rule) => rule.id === requirement.id);

  if (!knownRule || requirement.id.startsWith("UNKNOWN")) {
    return {
      status: "not_established",
      reason: `Unknown requirement preserved: ${requirement.originalText ?? requirement.value ?? requirement.capability}`,
      capabilityMatched: false,
      evidenceRelationshipStatus: "absent",
    };
  }

  return evaluateKnownRequirement(requirement, supplier);
}

function dedupeRequirementsById(requirements: Requirement[]): Requirement[] {
  const map = new Map<string, Requirement>();
  for (const requirement of requirements) {
    if (!map.has(requirement.id)) {
      map.set(requirement.id, requirement);
    }
  }
  return Array.from(map.values());
}

function requirementsFromInput(input: Requirement[] | string[]): Requirement[] {
  if (!Array.isArray(input) || input.length === 0) {
    return [];
  }

  if (typeof input[0] !== "string") {
    return dedupeRequirementsById(input as Requirement[]);
  }

  const requirements: Requirement[] = [];
  for (const item of input as string[]) {
    const rule = REQUIREMENT_RULES.find((candidate) => candidate.id === item);
    if (rule) {
      requirements.push({
        id: rule.id,
        capability: rule.capability,
        value: rule.value,
        required: rule.requiredByDefault,
        preferred: !rule.requiredByDefault,
        negated: false,
        originalText: item,
      });
      continue;
    }

    requirements.push(buildUnknownRequirement(item, item, true));
  }

  return dedupeRequirementsById(requirements);
}

function computeSummary(requirements: Requirement[], evaluations: Record<string, RequirementEvaluation>): SupplierEvaluation["summary"] {
  const requiredRequirements = requirements.filter((requirement) => requirement.required);

  const totalRequired = requiredRequirements.length;
  const requiredSupported = requiredRequirements.filter((requirement) => evaluations[requirement.id]?.status === "supported").length;
  const requiredNotEstablished = requiredRequirements.filter((requirement) => evaluations[requirement.id]?.status === "not_established").length;
  const requiredContradicted = requiredRequirements.filter((requirement) => evaluations[requirement.id]?.status === "contradicted").length;

  const completionRate = totalRequired === 0 ? 100 : Math.round((requiredSupported / totalRequired) * 100);
  const isCompleteMatch = totalRequired > 0 && requiredNotEstablished === 0 && requiredContradicted === 0;

  return {
    totalRequired,
    requiredSupported,
    requiredNotEstablished,
    requiredContradicted,
    completionRate,
    isCompleteMatch,
  };
}

export function classifySupplierMatch(result: SupplierEvaluation): SupplierMatchClass {
  if (result.summary.requiredContradicted > 0) {
    return "excluded";
  }
  if (result.summary.isCompleteMatch) {
    return "complete";
  }
  return "potential";
}

export function evaluateRequirement(requirement: Requirement, suppliers: SupplierRecord[]): RequirementEvaluation | null {
  if (!suppliers.length) {
    return null;
  }

  if (suppliers.length > 1) {
    return {
      status: "not_established",
      reason: "Use per-supplier evaluation; cross-supplier aggregation is intentionally disabled.",
      capabilityMatched: false,
      evidenceRelationshipStatus: "absent",
    };
  }

  return evaluateSupplierRequirement(requirement, suppliers[0]!);
}

export function evaluateMultipleSuppliers(input: Requirement[] | string[], suppliers: SupplierRecord[]): SupplierEvaluation[] {
  const requirements = requirementsFromInput(input);

  return suppliers.map((supplier) => {
    const evaluations: Record<string, RequirementEvaluation> = {};

    for (const requirement of requirements) {
      evaluations[requirement.id] = evaluateSupplierRequirement(requirement, supplier);
    }

    return {
      supplierName: supplier.name,
      evaluations,
      summary: computeSummary(requirements, evaluations),
    };
  });
}

export function interpretAndEvaluate(queryTerms: string[], suppliers: SupplierRecord[]): { interpretations: string[]; evaluations: SupplierEvaluation[] | null } {
  const query = queryTerms.join(" ").trim();
  const requirements = parseQueryToRequirements(query);

  const interpretations = requirements.length === 0
    ? ["No requirements extracted from query."]
    : requirements.map((requirement) => {
        const requirementType = requirement.required ? "required" : "preferred";
        const negated = requirement.negated ? " (negated)" : "";
        return `Requirement extracted: ${requirement.capability} [${requirementType}]${negated}`;
      });

  return {
    interpretations,
    evaluations: requirements.length > 0 ? evaluateMultipleSuppliers(requirements, suppliers) : null,
  };
}

export function getKnownRequirementIds(): string[] {
  return REQUIREMENT_RULES.map((rule) => rule.id);
}
