import type { EvidenceSource, Requirement, RequirementEvaluation, SupplierEvaluation } from "@/types";

export interface SupplierRecord {
  name: string;
  data: {
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
  "a", "an", "the", "and", "or", "for", "to", "with", "without", "in", "on", "of", "we", "our", "is", "are", "be", "that", "this", "using", "use", "want", "dont", "don't", "do", "not", "need", "needs", "must", "should", "could", "would", "provider", "providers", "solution", "solutions", "service", "services", "team", "based"
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

  const text = meaningful.join(" ");
  return [buildUnknownRequirement("UNKNOWN-1", text, true)];
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
      requirements.push(buildRequirement(REQUIREMENT_RULES.find((rule) => rule.id === "CONTEXT-BUYER-LOCATION-UK")!, trimmed, false, false));
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

function getEstablishedEvidenceForRequirement(supplier: SupplierRecord, matched: boolean): EvidenceSource | undefined {
  if (!matched) {
    return undefined;
  }
  return supplier.data.evidenceSources.find((source) => source.established);
}

function requirementKeywords(requirementId: string): string[] {
  if (requirementId === "MDR") {
    return ["mdr", "managed detection", "detection and response"];
  }
  if (requirementId === "EDR") {
    return ["edr", "endpoint detection", "endpoint response"];
  }
  if (requirementId === "MICROSOFT-365") {
    return ["microsoft 365", "m365", "office 365", "defender"];
  }
  if (requirementId === "UK-SERVICE-COVERAGE") {
    return ["uk", "united kingdom", "uk customer", "uk coverage"];
  }
  if (requirementId === "UK-SERVICE-TEAM") {
    return ["uk support", "uk service team", "united kingdom support"];
  }
  if (requirementId === "UK-DATA-RESIDENCY") {
    return ["uk data residency", "data in uk", "hosted in uk", "uk region"];
  }
  if (requirementId === "SME-SUITABILITY") {
    return ["sme", "small business", "small businesses"];
  }
  return [];
}

function evidenceMentionsRequirement(source: EvidenceSource, requirementId: string): boolean {
  const evidenceText = normalizePhrase([source.source, source.title ?? "", source.url ?? "", source.type].join(" "));
  const keywords = requirementKeywords(requirementId);
  if (!keywords.length) {
    return false;
  }
  return keywords.some((keyword) => evidenceText.includes(normalizePhrase(keyword)));
}

function selectRequirementSpecificEvidence(supplier: SupplierRecord, requirementId: string): EvidenceSource | undefined {
  return supplier.data.evidenceSources.find((source) => source.established && evidenceMentionsRequirement(source, requirementId));
}

function joinSupplierText(supplier: SupplierRecord): string {
  const fields = [
    supplier.name,
    supplier.data.name ?? "",
    supplier.data.category ?? "",
    supplier.data.description ?? "",
    ...(supplier.data.features ?? []),
    ...(supplier.data.capabilities ?? []),
    ...(supplier.data.categories ?? []),
    ...(supplier.data.supportedEnvironments ?? []),
    ...(supplier.data.targetOrgSizes ?? []),
    ...(supplier.data.pricetiers ?? []),
  ];
  return ` ${normalizePhrase(fields.join(" "))} `;
}

function hasPositiveSignal(requirementId: string, text: string): boolean {
  if (requirementId === "MDR") {
    return text.includes(" mdr ") || text.includes(" managed detection and response ");
  }
  if (requirementId === "EDR") {
    return text.includes(" edr ") || text.includes(" endpoint detection and response ");
  }
  if (requirementId === "MICROSOFT-365") {
    return text.includes(" microsoft 365 ") || text.includes(" m365 ") || text.includes(" office 365 ") || text.includes(" microsoft defender ");
  }
  if (requirementId === "UK-SERVICE-COVERAGE") {
    return text.includes(" serve uk customers ") || text.includes(" support uk customers ") || text.includes(" uk customer coverage ") || text.includes(" united kingdom ");
  }
  if (requirementId === "UK-SERVICE-TEAM") {
    return text.includes(" uk support team ") || text.includes(" uk service team ") || text.includes(" uk based service team ") || text.includes(" uk-based service team ");
  }
  if (requirementId === "UK-DATA-RESIDENCY") {
    return text.includes(" uk data residency ") || text.includes(" data residency in uk ") || text.includes(" hosted in uk ") || text.includes(" data in uk ");
  }
  if (requirementId === "SME-SUITABILITY") {
    return text.includes(" sme ") || text.includes(" small business ") || text.includes(" small businesses ");
  }

  return false;
}

function hasExplicitNegativeSignal(requirementId: string, text: string): boolean {
  if (requirementId === "MDR") {
    return text.includes(" no mdr ") || text.includes(" without mdr ") || text.includes(" not mdr ");
  }
  if (requirementId === "MICROSOFT-365") {
    return text.includes(" no microsoft 365 ") || text.includes(" without microsoft 365 ") || text.includes(" no m365 ");
  }
  if (requirementId === "EDR") {
    return text.includes(" no edr ") || text.includes(" without edr ");
  }
  if (requirementId === "UK-DATA-RESIDENCY") {
    return text.includes(" no uk data residency ") || text.includes(" data outside uk ");
  }

  return false;
}

function evaluateKnownRequirement(requirement: Requirement, supplier: SupplierRecord): RequirementEvaluation {
  if (requirement.id === "CONTEXT-BUYER-LOCATION-UK") {
    return {
      status: "not_established",
      reason: "Buyer-location context is not a supplier capability requirement.",
      capabilityMatched: false,
    };
  }

  const text = joinSupplierText(supplier);
  const matched = hasPositiveSignal(requirement.id, text);
  const contradictedBySupplier = hasExplicitNegativeSignal(requirement.id, text);

  const supportEvidence = matched ? selectRequirementSpecificEvidence(supplier, requirement.id) : undefined;
  const contradictionEvidence = contradictedBySupplier ? selectRequirementSpecificEvidence(supplier, requirement.id) : undefined;

  if (requirement.negated) {
    if (matched && supportEvidence) {
      return {
        status: "contradicted",
        evidenceSource: supportEvidence,
        reason: `Contradicted by ${supportEvidence.source}: supplier evidence indicates ${requirement.capability}.`,
        capabilityMatched: true,
      };
    }

    return {
      status: "not_established",
      reason: "Insufficient requirement-specific evidence to establish exclusion.",
      capabilityMatched: false,
    };
  }

  if (matched && supportEvidence) {
    return {
      status: "supported",
      evidenceSource: supportEvidence,
      reason: `Supported by ${supportEvidence.source} for ${requirement.capability}.`,
      capabilityMatched: true,
    };
  }

  if (contradictedBySupplier && contradictionEvidence) {
    return {
      status: "contradicted",
      evidenceSource: contradictionEvidence,
      reason: `Contradicted by ${contradictionEvidence.source}: supplier evidence indicates absence of ${requirement.capability}.`,
      capabilityMatched: false,
    };
  }

  return {
    status: "not_established",
    reason: "Requirement-specific evidence is missing or insufficient.",
    capabilityMatched: matched,
  };
}

function evaluateSupplierRequirement(requirement: Requirement, supplier: SupplierRecord): RequirementEvaluation {
  const knownRule = REQUIREMENT_RULES.find((rule) => rule.id === requirement.id);

  if (!knownRule || requirement.id.startsWith("UNKNOWN")) {
    return {
      status: "not_established",
      reason: `Unknown requirement preserved: ${requirement.originalText ?? requirement.value ?? requirement.capability}`,
      capabilityMatched: false,
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
