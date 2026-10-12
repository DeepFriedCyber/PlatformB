import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { createElement } from "react";
import type { Requirement } from "@/types";
import {
  classifySupplierMatch,
  evaluateRequirement,
  evaluateMultipleSuppliers,
  parseQueryToRequirements,
} from "@/lib/matchers/requirement-match";
import {
  DEFAULT_FRESHNESS_POLICY,
  aggregateContentGaps,
  assessEvidenceFreshness,
  buildClarificationsForSupplier,
} from "@/lib/matchers/evidence-freshness";
import type { Supplier } from "@/lib/suppliers/exports";
import SearchPage from "@/components/SearchPage";

const SUPPLIERS: Supplier[] = [
  {
    name: "Alpha Secure",
    data: {
      id: "alpha-secure",
      name: "Alpha Secure Suite",
      category: "Endpoint Security",
      description: "MDR and Microsoft 365 integration for SMEs.",
      features: ["Managed Detection and Response", "Microsoft 365 integration"],
      targetOrgSizes: ["SME", "Mid-Market"],
      established: true,
      evidenceSources: [{ type: "product_page", source: "Alpha Product", established: true }],
      capabilityClaims: [
        {
          id: "claim-alpha-mdr",
          supplierId: "alpha-secure",
          productOrServiceId: "alpha-suite",
          capabilityId: "MDR",
          statement: "Alpha provides MDR.",
          evidenceIds: ["ev-alpha-mdr-1", "ev-alpha-mdr-2"],
          contradictingEvidenceIds: [],
          provenanceStatus: "supported",
          demoData: true,
        },
        {
          id: "claim-alpha-m365",
          supplierId: "alpha-secure",
          productOrServiceId: "alpha-suite",
          capabilityId: "MICROSOFT-365",
          statement: "Alpha integrates with Microsoft 365.",
          evidenceIds: ["ev-alpha-m365-1"],
          contradictingEvidenceIds: [],
          provenanceStatus: "supported",
          demoData: true,
        },
        {
          id: "claim-alpha-edr",
          supplierId: "alpha-secure",
          productOrServiceId: "alpha-suite",
          capabilityId: "EDR",
          statement: "Alpha includes EDR.",
          evidenceIds: ["ev-alpha-broken-ref"],
          contradictingEvidenceIds: [],
          provenanceStatus: "unknown",
          demoData: true,
        },
      ],
      provenanceEvidence: [
        {
          id: "ev-alpha-mdr-1",
          supplierId: "alpha-secure",
          productOrServiceId: "alpha-suite",
          sourceTitle: "Alpha MDR Datasheet",
          sourceUrl: "https://alpha.example/mdr",
          sourceType: "product_page",
          publisher: "Alpha Secure",
          claimExcerpt: "Managed Detection and Response",
          observedAt: "2026-09-15",
          evidenceStatus: "supports_claim",
          origin: "supplier_published",
          independentlyVerified: false,
          demoData: true,
        },
        {
          id: "ev-alpha-mdr-2",
          supplierId: "alpha-secure",
          productOrServiceId: "alpha-suite",
          sourceTitle: "Independent MDR Report",
          sourceUrl: undefined,
          sourceType: "independent_test",
          publisher: "Synthetic Lab",
          claimExcerpt: "MDR controls observed",
          observedAt: "2026-04-01",
          evidenceStatus: "supports_claim",
          origin: "independent",
          independentlyVerified: true,
          demoData: true,
        },
        {
          id: "ev-alpha-m365-1",
          supplierId: "alpha-secure",
          productOrServiceId: "alpha-suite",
          sourceTitle: "M365 Compatibility",
          sourceUrl: "https://alpha.example/m365",
          sourceType: "tech_article",
          publisher: "Alpha Secure",
          claimExcerpt: "Integrates with Microsoft 365",
          evidenceStatus: "supports_claim",
          origin: "supplier_published",
          independentlyVerified: false,
          demoData: true,
        },
        {
          id: "ev-alpha-unrelated",
          supplierId: "alpha-secure",
          productOrServiceId: "alpha-suite",
          sourceTitle: "Network Firewall Update",
          sourceType: "announcement",
          publisher: "Alpha Secure",
          evidenceStatus: "insufficient",
          origin: "supplier_published",
          independentlyVerified: null,
          demoData: true,
        },
      ],
    },
  },
  {
    name: "Beta Guard",
    data: {
      id: "beta-guard",
      name: "Beta Guard",
      category: "Managed Security",
      description: "Beta marketing includes no verifiable MDR references.",
      features: ["Managed Detection and Response"],
      targetOrgSizes: ["Enterprise"],
      established: true,
      evidenceSources: [{ type: "product_page", source: "Beta Overview", established: true }],
      capabilityClaims: [
        {
          id: "claim-beta-mdr",
          supplierId: "beta-guard",
          productOrServiceId: "beta-main",
          capabilityId: "MDR",
          statement: "Beta provides MDR.",
          evidenceIds: ["ev-beta-unrelated"],
          contradictingEvidenceIds: [],
          provenanceStatus: "unknown",
          demoData: true,
        },
      ],
      provenanceEvidence: [
        {
          id: "ev-beta-unrelated",
          supplierId: "beta-guard",
          productOrServiceId: "beta-main",
          sourceTitle: "Brand Guidelines",
          sourceType: "announcement",
          publisher: "Beta Guard",
          evidenceStatus: "insufficient",
          origin: "supplier_published",
          independentlyVerified: null,
          demoData: true,
        },
      ],
    },
  },
  {
    name: "Gamma Contradict",
    data: {
      id: "gamma-contradict",
      name: "Gamma Contradict",
      category: "Security Service",
      description: "Synthetic provider for contradiction tests.",
      capabilities: ["Managed Detection and Response"],
      targetOrgSizes: ["SME"],
      established: false,
      evidenceSources: [{ type: "service_page", source: "Gamma Service Page", established: true }],
      capabilityClaims: [
        {
          id: "claim-gamma-m365",
          supplierId: "gamma-contradict",
          productOrServiceId: "gamma-service",
          capabilityId: "MICROSOFT-365",
          statement: "Gamma integrates with Microsoft 365.",
          evidenceIds: [],
          contradictingEvidenceIds: ["ev-gamma-m365-no"],
          provenanceStatus: "contradicted",
          demoData: true,
        },
        {
          id: "claim-gamma-mdr",
          supplierId: "gamma-contradict",
          productOrServiceId: "gamma-service",
          capabilityId: "MDR",
          statement: "Gamma provides MDR.",
          evidenceIds: ["ev-gamma-mdr-yes"],
          contradictingEvidenceIds: ["ev-gamma-mdr-no"],
          provenanceStatus: "unknown",
          demoData: true,
        },
      ],
      provenanceEvidence: [
        {
          id: "ev-gamma-m365-no",
          supplierId: "gamma-contradict",
          productOrServiceId: "gamma-service",
          sourceTitle: "Synthetic Compatibility Matrix",
          sourceType: "third_party_review",
          publisher: "PlatformB Demo Lab",
          claimExcerpt: "Microsoft 365 integration not available",
          evidenceStatus: "contradicts_claim",
          origin: "third_party",
          independentlyVerified: null,
          demoData: true,
        },
        {
          id: "ev-gamma-mdr-yes",
          supplierId: "gamma-contradict",
          productOrServiceId: "gamma-service",
          sourceTitle: "Gamma MDR Overview",
          sourceType: "service_page",
          publisher: "Gamma Contradict",
          claimExcerpt: "MDR service available",
          evidenceStatus: "supports_claim",
          origin: "supplier_published",
          independentlyVerified: false,
          demoData: true,
        },
        {
          id: "ev-gamma-mdr-no",
          supplierId: "gamma-contradict",
          productOrServiceId: "gamma-service",
          sourceTitle: "Legacy Product Notice",
          sourceType: "announcement",
          publisher: "Gamma Contradict",
          claimExcerpt: "Legacy tier does not include MDR",
          evidenceStatus: "contradicts_claim",
          origin: "supplier_published",
          independentlyVerified: null,
          demoData: true,
        },
      ],
    },
  },
  {
    name: "No Evidence Vendor",
    data: {
      id: "no-evidence",
      name: "No Evidence Vendor",
      category: "Security",
      description: "Claims capabilities without references.",
      features: ["Managed Detection and Response", "Microsoft 365 integration"],
      established: true,
      evidenceSources: [],
      capabilityClaims: [
        {
          id: "claim-noevidence-mdr",
          supplierId: "no-evidence",
          productOrServiceId: "no-main",
          capabilityId: "MDR",
          statement: "No-evidence vendor provides MDR.",
          evidenceIds: [],
          contradictingEvidenceIds: [],
          provenanceStatus: "stated",
          demoData: true,
        },
      ],
      provenanceEvidence: [],
    },
  },
  {
    name: "Wrong Supplier Evidence",
    data: {
      id: "wrong-supplier",
      name: "Wrong Supplier Evidence",
      category: "Security",
      description: "Uses foreign evidence ids.",
      features: [],
      evidenceSources: [{ type: "product_page", source: "Wrong Supplier Overview", established: true }],
      capabilityClaims: [
        {
          id: "claim-wrong-mdr",
          supplierId: "wrong-supplier",
          productOrServiceId: "wrong-main",
          capabilityId: "MDR",
          statement: "Wrong supplier claims MDR",
          evidenceIds: ["ev-foreign-supplier"],
          contradictingEvidenceIds: [],
          provenanceStatus: "unknown",
          demoData: true,
        },
      ],
      provenanceEvidence: [
        {
          id: "ev-foreign-supplier",
          supplierId: "another-supplier",
          productOrServiceId: "wrong-main",
          sourceTitle: "Foreign evidence",
          sourceType: "product_page",
          publisher: "Another supplier",
          evidenceStatus: "supports_claim",
          origin: "unknown",
          independentlyVerified: null,
          demoData: true,
        },
      ],
    },
  },
  {
    name: "Wrong Product Evidence",
    data: {
      id: "wrong-product",
      name: "Wrong Product Evidence",
      category: "Security",
      description: "Evidence belongs to another product id.",
      features: [],
      evidenceSources: [{ type: "product_page", source: "Wrong Product Overview", established: true }],
      capabilityClaims: [
        {
          id: "claim-wrong-product-mdr",
          supplierId: "wrong-product",
          productOrServiceId: "product-a",
          capabilityId: "MDR",
          statement: "MDR on product A",
          evidenceIds: ["ev-wrong-product-b"],
          contradictingEvidenceIds: [],
          provenanceStatus: "unknown",
          demoData: true,
        },
      ],
      provenanceEvidence: [
        {
          id: "ev-wrong-product-b",
          supplierId: "wrong-product",
          productOrServiceId: "product-b",
          sourceTitle: "Evidence for product B",
          sourceType: "product_page",
          publisher: "Wrong Product Evidence",
          evidenceStatus: "supports_claim",
          origin: "supplier_published",
          independentlyVerified: false,
          demoData: true,
        },
      ],
    },
  },
  {
    name: "Support Only",
    data: {
      id: "support-only",
      name: "Support Only",
      category: "Security",
      description: "Only supporting evidence.",
      evidenceSources: [{ type: "product_page", source: "Support only source", established: true }],
      capabilityClaims: [
        {
          id: "claim-support-only-mdr",
          supplierId: "support-only",
          capabilityId: "MDR",
          statement: "Support-only supplier provides MDR.",
          evidenceIds: ["ev-support-only"],
          contradictingEvidenceIds: [],
          provenanceStatus: "supported",
          demoData: true,
        },
      ],
      provenanceEvidence: [
        {
          id: "ev-support-only",
          supplierId: "support-only",
          sourceTitle: "Support-only evidence",
          sourceType: "product_page",
          publisher: "Support Only",
          evidenceStatus: "supports_claim",
          origin: "supplier_published",
          independentlyVerified: false,
          demoData: true,
        },
      ],
    },
  },
  {
    name: "Contradiction Only",
    data: {
      id: "contradiction-only",
      name: "Contradiction Only",
      category: "Security",
      description: "Only contradictory evidence.",
      evidenceSources: [{ type: "announcement", source: "Contradiction source", established: true }],
      capabilityClaims: [
        {
          id: "claim-contradiction-only-mdr",
          supplierId: "contradiction-only",
          capabilityId: "MDR",
          statement: "Contradiction-only supplier provides MDR.",
          evidenceIds: [],
          contradictingEvidenceIds: ["ev-contradiction-only"],
          provenanceStatus: "contradicted",
          demoData: true,
        },
      ],
      provenanceEvidence: [
        {
          id: "ev-contradiction-only",
          supplierId: "contradiction-only",
          sourceTitle: "Contradiction evidence",
          sourceType: "announcement",
          publisher: "Contradiction Only",
          evidenceStatus: "contradicts_claim",
          origin: "supplier_published",
          independentlyVerified: null,
          demoData: true,
        },
      ],
    },
  },
];

function req(overrides: Partial<Requirement>): Requirement {
  return {
    id: "MDR",
    capability: "Managed Detection and Response",
    value: null,
    required: true,
    preferred: false,
    negated: false,
    originalText: "MDR",
    ...overrides,
  };
}

describe("Requirement matching engine provenance", () => {
  it("empty buyer query returns no requirements", () => {
    expect(parseQueryToRequirements("")).toEqual([]);
    expect(parseQueryToRequirements("   ")).toEqual([]);
  });

  it("single supported requirement", () => {
    const result = evaluateRequirement(req({}), [SUPPLIERS[0]]);
    expect(result?.status).toBe("supported");
    expect(result?.claimId).toBe("claim-alpha-mdr");
    expect(result?.evidenceRecord?.id).toBe("ev-alpha-mdr-1");
  });

  it("multiple supported requirements", () => {
    const requirements = parseQueryToRequirements("MDR with Microsoft 365 integration");
    const evaluations = evaluateMultipleSuppliers(requirements, [SUPPLIERS[0]]);
    expect(evaluations[0]?.evaluations["MDR"]?.status).toBe("supported");
    expect(evaluations[0]?.evaluations["MICROSOFT-365"]?.status).toBe("supported");
  });

  it("one supported and one unknown requirement", () => {
    const requirements = parseQueryToRequirements("MDR with quantum resistant incident recovery");
    const evaluations = evaluateMultipleSuppliers(requirements, [SUPPLIERS[0]]);
    expect(evaluations[0]?.evaluations["MDR"]?.status).toBe("supported");
    expect(Object.keys(evaluations[0]?.evaluations ?? {})).toContain("UNKNOWN-1");
    expect(evaluations[0]?.evaluations["UNKNOWN-1"]?.status).toBe("not_established");
    expect(evaluations[0]?.summary.isCompleteMatch).toBe(false);
  });

  it("explicit contradictory relationship", () => {
    const result = evaluateRequirement(req({ id: "MICROSOFT-365", capability: "Microsoft 365 integration" }), [SUPPLIERS[2]]);
    expect(result?.status).toBe("contradicted");
    expect(result?.evidenceRecord?.id).toBe("ev-gamma-m365-no");
  });

  it("missing evidence", () => {
    const result = evaluateRequirement(req({ id: "MDR" }), [SUPPLIERS[3]]);
    expect(result?.status).toBe("not_established");
  });

  it("unrelated evidence does not establish support", () => {
    const result = evaluateRequirement(req({ id: "MDR" }), [SUPPLIERS[1]]);
    expect(result?.status).toBe("not_established");
  });

  it("broken evidence id is not established", () => {
    const result = evaluateRequirement(req({ id: "EDR", capability: "Endpoint Detection and Response" }), [SUPPLIERS[0]]);
    expect(result?.status).toBe("not_established");
    expect(result?.evidenceRelationshipStatus).toBe("broken");
  });

  it("multiple evidence records for one claim", () => {
    const result = evaluateRequirement(req({ id: "MDR" }), [SUPPLIERS[0]]);
    expect(result?.status).toBe("supported");
    expect(result?.claimId).toBe("claim-alpha-mdr");
  });

  it("supplier-published evidence is distinguished from independent", () => {
    const result = evaluateRequirement(req({ id: "MDR" }), [SUPPLIERS[0]]);
    expect(result?.evidenceRecord?.origin).toBe("supplier_published");
    expect(result?.evidenceRecord?.independentlyVerified).toBe(false);
  });

  it("unknown provenance remains visible", () => {
    const result = evaluateRequirement(req({ id: "MDR" }), [SUPPLIERS[4]]);
    expect(result?.status).toBe("not_established");
  });

  it("claim belonging to another supplier is ignored", () => {
    const result = evaluateRequirement(req({ id: "MDR" }), [SUPPLIERS[4]]);
    expect(result?.status).toBe("not_established");
  });

  it("claim evidence belonging to another product/service is ignored", () => {
    const result = evaluateRequirement(req({ id: "MDR" }), [SUPPLIERS[5]]);
    expect(result?.status).toBe("not_established");
  });

  it("negated requirement with evidence establishing presence is contradicted", () => {
    const result = evaluateRequirement(req({ id: "MDR", negated: true, originalText: "without MDR" }), [SUPPLIERS[0]]);
    expect(result?.status).toBe("contradicted");
  });

  it("negated requirement with evidence establishing absence is supported", () => {
    const result = evaluateRequirement(req({ id: "MICROSOFT-365", capability: "Microsoft 365 integration", negated: true, originalText: "without microsoft 365" }), [SUPPLIERS[2]]);
    expect(result?.status).toBe("supported");
  });

  it("no false support from source titles or URLs alone", () => {
    const suppliersWithTitleOnly: Supplier[] = [
      {
        name: "TitleOnly",
        data: {
          id: "title-only",
          name: "TitleOnly",
          evidenceSources: [{ type: "product_page", source: "MDR title", established: true }],
          capabilityClaims: [],
          provenanceEvidence: [
            {
              id: "ev-title-only",
              supplierId: "title-only",
              sourceTitle: "MDR Microsoft 365 everything",
              sourceUrl: "https://example.com/mdr-m365",
              sourceType: "product_page",
              publisher: "Unknown",
              evidenceStatus: "supports_claim",
              origin: "unknown",
              independentlyVerified: null,
              demoData: true,
            },
          ],
        },
      },
    ];

    const result = evaluateRequirement(req({ id: "MDR" }), suppliersWithTitleOnly);
    expect(result?.status).toBe("not_established");
  });

  it("no global supplier verification shortcut", () => {
    const result = evaluateRequirement(req({ id: "MDR" }), [SUPPLIERS[1]]);
    expect(result?.status).toBe("not_established");
  });

  it("classification complete/potential/excluded preserved", () => {
    const complete = evaluateMultipleSuppliers(parseQueryToRequirements("MDR"), [SUPPLIERS[0]])[0];
    const potential = evaluateMultipleSuppliers(parseQueryToRequirements("MDR with UK data residency"), [SUPPLIERS[0]])[0];
    const excluded = evaluateMultipleSuppliers(parseQueryToRequirements("I don't want MDR"), [SUPPLIERS[0]])[0];

    expect(classifySupplierMatch(complete!)).toBe("complete");
    expect(classifySupplierMatch(potential!)).toBe("potential");
    expect(classifySupplierMatch(excluded!)).toBe("excluded");
  });

  it("unknown requirements preserved in mixed query and block complete match", () => {
    const requirements = parseQueryToRequirements("MDR with Microsoft 365 and quantum-resistant incident recovery");
    const ids = requirements.map((item) => item.id);
    expect(ids).toContain("MDR");
    expect(ids).toContain("MICROSOFT-365");
    expect(ids).toContain("UNKNOWN-1");

    const evaluations = evaluateMultipleSuppliers(requirements, [SUPPLIERS[0]]);
    expect(evaluations[0]?.summary.isCompleteMatch).toBe(false);
  });

  // Restored regression coverage from previous committed milestone
  it("negation is scoped: MDR required, Microsoft 365 excluded", () => {
    const requirements = parseQueryToRequirements("MDR without Microsoft 365 integration");
    const mdr = requirements.find((item) => item.id === "MDR");
    const m365 = requirements.find((item) => item.id === "MICROSOFT-365");

    expect(mdr?.negated).toBe(false);
    expect(m365?.negated).toBe(true);
  });

  it("required versus preferred criteria", () => {
    const requirements: Requirement[] = [
      req({ id: "MDR", required: true, preferred: false }),
      req({ id: "EDR", capability: "Endpoint Detection and Response", required: false, preferred: true }),
    ];
    const evaluations = evaluateMultipleSuppliers(requirements, [SUPPLIERS[0]]);

    expect(evaluations[0]?.summary.totalRequired).toBe(1);
    expect(evaluations[0]?.summary.isCompleteMatch).toBe(true);
  });

  it("UK distinction: buyer context does not imply mandatory supplier requirement", () => {
    const requirements = parseQueryToRequirements("We are a UK SME and need MDR");
    const ids = requirements.map((item) => item.id);
    expect(ids).toContain("CONTEXT-BUYER-LOCATION-UK");
    expect(ids).not.toContain("UK-SERVICE-COVERAGE");
    expect(ids).not.toContain("UK-SERVICE-TEAM");
  });

  it("UK distinction: explicit UK customer support creates supplier requirement", () => {
    const requirements = parseQueryToRequirements("MDR that supports UK customers");
    const ids = requirements.map((item) => item.id);
    expect(ids).toContain("UK-SERVICE-COVERAGE");
  });

  it("UK distinction: explicit UK service team creates supplier requirement", () => {
    const requirements = parseQueryToRequirements("MDR with a UK support team");
    const ids = requirements.map((item) => item.id);
    expect(ids).toContain("UK-SERVICE-TEAM");
  });

  it("UK distinction: explicit UK data residency creates supplier requirement", () => {
    const requirements = parseQueryToRequirements("MDR with UK data residency");
    const ids = requirements.map((item) => item.id);
    expect(ids).toContain("UK-DATA-RESIDENCY");
  });

  it("cross-supplier aggregation is disabled for single requirement evaluation", () => {
    const result = evaluateRequirement(req({ id: "MDR" }), [SUPPLIERS[0], SUPPLIERS[3]]);
    expect(result?.status).toBe("not_established");
    expect(result?.reason.toLowerCase()).toContain("cross-supplier");
  });

  // Conflict-specific regressions
  it("support only produces supported", () => {
    const result = evaluateRequirement(req({ id: "MDR" }), [SUPPLIERS[6]]);
    expect(result?.status).toBe("supported");
  });

  it("contradiction only produces contradicted", () => {
    const result = evaluateRequirement(req({ id: "MDR" }), [SUPPLIERS[7]]);
    expect(result?.status).toBe("contradicted");
  });

  it("support plus contradiction produces not_established", () => {
    const result = evaluateRequirement(req({ id: "MDR" }), [SUPPLIERS[2]]);
    expect(result?.status).toBe("not_established");
    expect(result?.reason).toBe("Conflicting linked evidence: both supporting and contradictory records found.");
  });

  it("conflict produces not_established for negated requirements", () => {
    const result = evaluateRequirement(req({ id: "MDR", negated: true, originalText: "without MDR" }), [SUPPLIERS[2]]);
    expect(result?.status).toBe("not_established");
    expect(result?.reason).toBe("Conflicting linked evidence: both supporting and contradictory records found.");
  });

  it("reordering evidence IDs does not change conflict result", () => {
    const reordered: Supplier = {
      ...SUPPLIERS[2],
      data: {
        ...SUPPLIERS[2]!.data,
        capabilityClaims: [
          {
            ...SUPPLIERS[2]!.data.capabilityClaims![1]!,
            evidenceIds: ["ev-gamma-mdr-yes"],
            contradictingEvidenceIds: ["ev-gamma-mdr-no"],
          },
        ],
      },
    };

    const result = evaluateRequirement(req({ id: "MDR" }), [reordered]);
    expect(result?.status).toBe("not_established");
  });

  it("broken or unrelated evidence does not create a false conflict", () => {
    const result = evaluateRequirement(req({ id: "EDR", capability: "Endpoint Detection and Response" }), [SUPPLIERS[0]]);
    expect(result?.status).toBe("not_established");
    expect(result?.reason).not.toBe("Conflicting linked evidence: both supporting and contradictory records found.");
  });

  it("conflict prevents complete-match classification", () => {
    const evaluations = evaluateMultipleSuppliers(parseQueryToRequirements("MDR"), [SUPPLIERS[2]]);
    expect(evaluations[0]?.summary.isCompleteMatch).toBe(false);
  });

  it("conflict does not create excluded classification", () => {
    const evaluations = evaluateMultipleSuppliers(parseQueryToRequirements("MDR"), [SUPPLIERS[2]]);
    expect(classifySupplierMatch(evaluations[0]!)).toBe("potential");
  });

  it("both conflicting evidence IDs remain available", () => {
    const result = evaluateRequirement(req({ id: "MDR" }), [SUPPLIERS[2]]);
    expect(result?.conflictingEvidenceIds).toEqual(["ev-gamma-mdr-yes", "ev-gamma-mdr-no"]);
  });

  it("evidence within review interval is current", () => {
    const assessment = assessEvidenceFreshness(
      {
        id: "ev-current",
        supplierId: "alpha-secure",
        sourceType: "product_page",
        evidenceStatus: "supports_claim",
        origin: "supplier_published",
        independentlyVerified: false,
        demoData: true,
        observedAt: "2026-09-15",
      },
      "2026-10-12"
    );
    expect(assessment.freshnessStatus).toBe("current");
  });

  it("evidence beyond review interval is review_needed", () => {
    const assessment = assessEvidenceFreshness(
      {
        id: "ev-old",
        supplierId: "alpha-secure",
        sourceType: "product_page",
        evidenceStatus: "supports_claim",
        origin: "supplier_published",
        independentlyVerified: false,
        demoData: true,
        observedAt: "2025-01-01",
      },
      "2026-10-12"
    );
    expect(assessment.freshnessStatus).toBe("review_needed");
  });

  it("missing date returns unknown freshness", () => {
    const assessment = assessEvidenceFreshness(
      {
        id: "ev-missing-date",
        supplierId: "alpha-secure",
        sourceType: "product_page",
        evidenceStatus: "supports_claim",
        origin: "supplier_published",
        independentlyVerified: false,
        demoData: true,
      },
      "2026-10-12"
    );
    expect(assessment.freshnessStatus).toBe("unknown");
  });

  it("invalid date returns unknown freshness", () => {
    const assessment = assessEvidenceFreshness(
      {
        id: "ev-invalid-date",
        supplierId: "alpha-secure",
        sourceType: "product_page",
        evidenceStatus: "supports_claim",
        origin: "supplier_published",
        independentlyVerified: false,
        demoData: true,
        observedAt: "not-a-date",
      },
      "2026-10-12"
    );
    expect(assessment.freshnessStatus).toBe("unknown");
  });

  it("future date returns unknown freshness", () => {
    const assessment = assessEvidenceFreshness(
      {
        id: "ev-future-date",
        supplierId: "alpha-secure",
        sourceType: "product_page",
        evidenceStatus: "supports_claim",
        origin: "supplier_published",
        independentlyVerified: false,
        demoData: true,
        observedAt: "2027-01-01",
      },
      "2026-10-12"
    );
    expect(assessment.freshnessStatus).toBe("unknown");
  });

  it("configurable review interval is respected", () => {
    const assessment = assessEvidenceFreshness(
      {
        id: "ev-custom-policy",
        supplierId: "alpha-secure",
        sourceType: "product_page",
        evidenceStatus: "supports_claim",
        origin: "supplier_published",
        independentlyVerified: false,
        demoData: true,
        observedAt: "2026-01-01",
      },
      "2026-10-12",
      { reviewIntervalDays: 400 }
    );
    expect(assessment.freshnessStatus).toBe("current");
  });

  it("supplier-published evidence remains unverified even when current", () => {
    const evaluations = evaluateMultipleSuppliers(parseQueryToRequirements("MDR"), [SUPPLIERS[0]], {
      evaluationDate: "2026-10-12",
      freshnessPolicy: DEFAULT_FRESHNESS_POLICY,
    });
    const evaluation = evaluations[0]?.evaluations["MDR"];
    expect(evaluation?.status).toBe("supported");
    expect(evaluation?.evidenceRecord?.origin).toBe("supplier_published");
    expect(evaluation?.evidenceRecord?.independentlyVerified).toBe(false);
  });

  it("freshness does not change evidence truth status", () => {
    const evaluations = evaluateMultipleSuppliers(parseQueryToRequirements("MDR"), [SUPPLIERS[0]], {
      evaluationDate: "2028-10-12",
    });
    expect(evaluations[0]?.evaluations["MDR"]?.status).toBe("supported");
    expect(evaluations[0]?.evaluations["MDR"]?.freshness?.freshnessStatus).toBe("review_needed");
  });

  it("conflicting evidence remains unresolved regardless of freshness", () => {
    const evaluations = evaluateMultipleSuppliers(parseQueryToRequirements("MDR"), [SUPPLIERS[2]], {
      evaluationDate: "2028-10-12",
    });
    expect(evaluations[0]?.evaluations["MDR"]?.status).toBe("not_established");
    expect(evaluations[0]?.evaluations["MDR"]?.reason).toContain("Conflicting linked evidence");
  });

  it("missing-evidence clarification is generated", () => {
    const requirements = parseQueryToRequirements("MDR");
    const evaluations = evaluateMultipleSuppliers(requirements, [SUPPLIERS[3]]);
    const clarifications = buildClarificationsForSupplier("no-evidence", "No Evidence Vendor", requirements, evaluations[0]!.evaluations);
    expect(clarifications.some((item) => item.reasonCode === "missing_evidence")).toBe(true);
  });

  it("conflicting-evidence clarification is generated", () => {
    const requirements = parseQueryToRequirements("MDR");
    const evaluations = evaluateMultipleSuppliers(requirements, [SUPPLIERS[2]]);
    const clarifications = buildClarificationsForSupplier("gamma-contradict", "Gamma Contradict", requirements, evaluations[0]!.evaluations);
    expect(clarifications.some((item) => item.reasonCode === "conflicting_evidence")).toBe(true);
  });

  it("freshness-review clarification is generated", () => {
    const requirements = parseQueryToRequirements("MDR");
    const evaluations = evaluateMultipleSuppliers(requirements, [SUPPLIERS[0]], { evaluationDate: "2028-10-12" });
    const clarifications = buildClarificationsForSupplier("alpha-secure", "Alpha Secure", requirements, evaluations[0]!.evaluations);
    expect(clarifications.some((item) => item.reasonCode === "freshness_review")).toBe(true);
  });

  it("unknown-provenance clarification is generated", () => {
    const supplierWithUnknownProvenance: Supplier = {
      name: "Unknown Provenance Co",
      data: {
        id: "unknown-prov",
        name: "Unknown Provenance Co",
        evidenceSources: [{ type: "product_page", source: "Unknown source", established: true }],
        capabilityClaims: [
          {
            id: "claim-unknown-prov-mdr",
            supplierId: "unknown-prov",
            capabilityId: "MDR",
            statement: "Unknown provenance MDR claim",
            evidenceIds: ["ev-unknown-prov"],
            contradictingEvidenceIds: [],
            provenanceStatus: "supported",
            demoData: true,
          },
        ],
        provenanceEvidence: [
          {
            id: "ev-unknown-prov",
            supplierId: "unknown-prov",
            sourceType: "product_page",
            sourceTitle: "Unknown-origin evidence",
            evidenceStatus: "supports_claim",
            origin: "unknown",
            independentlyVerified: null,
            demoData: true,
            observedAt: "2026-10-01",
          },
        ],
      },
    };

    const requirements = parseQueryToRequirements("MDR");
    const evaluations = evaluateMultipleSuppliers(requirements, [supplierWithUnknownProvenance]);
    const clarifications = buildClarificationsForSupplier("unknown-prov", "Unknown Provenance Co", requirements, evaluations[0]!.evaluations);
    expect(clarifications.some((item) => item.reasonCode === "unknown_provenance")).toBe(true);
  });

  it("clarification IDs are deterministic", () => {
    const requirements = parseQueryToRequirements("MDR");
    const evaluations = evaluateMultipleSuppliers(requirements, [SUPPLIERS[3]]);
    const runA = buildClarificationsForSupplier("no-evidence", "No Evidence Vendor", requirements, evaluations[0]!.evaluations);
    const runB = buildClarificationsForSupplier("no-evidence", "No Evidence Vendor", requirements, evaluations[0]!.evaluations);
    expect(runA[0]?.id).toBe(runB[0]?.id);
  });

  it("clarifications are open and contain no fabricated supplier responses", () => {
    const requirements = parseQueryToRequirements("MDR");
    const evaluations = evaluateMultipleSuppliers(requirements, [SUPPLIERS[3]]);
    const clarifications = buildClarificationsForSupplier("no-evidence", "No Evidence Vendor", requirements, evaluations[0]!.evaluations);
    expect(clarifications.every((item) => item.status === "open")).toBe(true);
  });

  it("repeated gap aggregation increments deterministically", () => {
    const clarifications = [
      {
        id: "clar-s1-mdr-missing_evidence",
        supplierId: "s1",
        requirementId: "MDR",
        relatedEvidenceIds: [],
        reasonCode: "missing_evidence" as const,
        question: "Q",
        priority: "high" as const,
        status: "open" as const,
      },
    ];
    const first = aggregateContentGaps(clarifications, "2026-10-12");
    const second = aggregateContentGaps(clarifications, "2026-10-13", first);
    expect(second[0]?.occurrenceCount).toBe(1);
    expect(second[0]?.lastObservedAt).toBe("2026-10-13");
  });

  it("separate suppliers generate separate gaps", () => {
    const clarifications = [
      {
        id: "clar-s1-mdr-missing_evidence",
        supplierId: "s1",
        requirementId: "MDR",
        relatedEvidenceIds: [],
        reasonCode: "missing_evidence" as const,
        question: "Q1",
        priority: "high" as const,
        status: "open" as const,
      },
      {
        id: "clar-s2-mdr-missing_evidence",
        supplierId: "s2",
        requirementId: "MDR",
        relatedEvidenceIds: [],
        reasonCode: "missing_evidence" as const,
        question: "Q2",
        priority: "high" as const,
        status: "open" as const,
      },
    ];
    const gaps = aggregateContentGaps(clarifications, "2026-10-12");
    expect(gaps).toHaveLength(2);
  });

  it("buyer-facing UI shows freshness and clarification labels", () => {
    render(createElement(SearchPage));

    const input = screen.getByPlaceholderText(/Use natural language to search/i);
    fireEvent.change(input, { target: { value: "Microsoft 365 integration" } });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    expect(screen.getByText(/Freshness:/i)).toBeDefined();
    expect(screen.getAllByText(/Supplier clarification needed/i).length).toBeGreaterThan(0);
  });

  it("duplicate requirement IDs do not distort summary counts", () => {
    const duplicatedRequirements: Requirement[] = [
      req({ id: "MDR" }),
      req({ id: "MDR", originalText: "duplicate mdr" }),
    ];

    const evaluations = evaluateMultipleSuppliers(duplicatedRequirements, [SUPPLIERS[0]]);
    expect(evaluations[0]?.summary.totalRequired).toBe(1);
  });

  it("UI renders provenance and demo labels", () => {
    render(createElement(SearchPage));

    const input = screen.getByPlaceholderText(/Use natural language to search/i);
    fireEvent.change(input, { target: { value: "Microsoft 365 integration" } });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    expect(screen.getAllByText("Demo data").length).toBeGreaterThan(0);
    expect(screen.getByText(/Requirement Outcomes/i)).toBeDefined();
    expect(screen.getByText(/Origin:/i)).toBeDefined();
    expect(screen.getByText(/Independent verification:/i)).toBeDefined();
    expect(screen.getByText(/Demo: Yes/i)).toBeDefined();
  });

  it("UI shows conflicting evidence clarification when conflict occurs", () => {
    render(createElement(SearchPage));

    const input = screen.getByPlaceholderText(/Use natural language to search/i);
    fireEvent.change(input, { target: { value: "MDR" } });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    expect(screen.getByText(/Not established — conflicting evidence requires clarification./i)).toBeDefined();
  });
});
