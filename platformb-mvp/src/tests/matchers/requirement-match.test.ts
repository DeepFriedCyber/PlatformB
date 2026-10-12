import { describe, it, expect } from "vitest";
import type { Requirement } from "@/types";
import {
  classifySupplierMatch,
  evaluateRequirement,
  evaluateMultipleSuppliers,
  parseQueryToRequirements,
} from "@/lib/matchers/requirement-match";
import type { Supplier } from "@/lib/suppliers/exports";

const EVIDENCE_MDR = {
  type: "product_page" as const,
  source: "MDR Product Page",
  title: "Managed Detection and Response Overview",
  established: true,
};

const EVIDENCE_M365 = {
  type: "tech_article" as const,
  source: "Microsoft 365 Integration Guide",
  title: "Microsoft 365 Integration",
  established: true,
};

const EVIDENCE_UK_TEAM = {
  type: "service_page" as const,
  source: "UK Service Team Page",
  title: "UK Service Team",
  established: true,
};

const EVIDENCE_UK_DATA = {
  type: "announcement" as const,
  source: "UK Data Residency Controls",
  title: "Data Residency in UK",
  established: true,
};

const EVIDENCE_GENERIC = {
  type: "product_page" as const,
  source: "General Product Overview",
  title: "General security platform",
  established: true,
};

const SUPPLIERS: Supplier[] = [
  {
    name: "Alpha Secure",
    data: {
      name: "Alpha Secure Suite",
      category: "Endpoint Security",
      description: "Managed detection and response with Microsoft 365 integration for SME customers.",
      features: ["Managed Detection and Response", "Microsoft 365 integration"],
      targetOrgSizes: ["SME", "Mid-Market"],
      evidenceSources: [EVIDENCE_MDR, EVIDENCE_M365],
    },
  },
  {
    name: "Beta Guard",
    data: {
      name: "Beta Guard Service",
      category: "Managed Security Services",
      description: "Managed SOC for enterprises.",
      capabilities: ["Threat Hunting"],
      targetOrgSizes: ["Enterprise"],
      evidenceSources: [EVIDENCE_GENERIC],
    },
  },
  {
    name: "UK Team Ops",
    data: {
      name: "UK Team Ops",
      category: "Managed Security Services",
      description: "MDR from a UK support team with UK data residency options.",
      capabilities: ["Managed Detection and Response", "UK support team", "Data residency in UK"],
      targetOrgSizes: ["SME", "Enterprise"],
      evidenceSources: [EVIDENCE_MDR, EVIDENCE_UK_TEAM, EVIDENCE_UK_DATA],
    },
  },
  {
    name: "No Evidence Vendor",
    data: {
      name: "No Evidence Vendor",
      category: "Security",
      description: "Claims multiple capabilities without references.",
      features: ["Managed Detection and Response", "Microsoft 365 integration"],
      evidenceSources: [],
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

describe("Requirement matching engine", () => {
  it("single supported requirement", () => {
    const result = evaluateRequirement(req({}), [SUPPLIERS[0]]);
    expect(result?.status).toBe("supported");
    expect(result?.evidenceSource?.source).toBe("MDR Product Page");
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

  it("explicitly contradicted requirements", () => {
    const requirement = req({ id: "MDR", negated: true, originalText: "I don't want MDR" });
    const result = evaluateRequirement(requirement, [SUPPLIERS[0]]);
    expect(result?.status).toBe("contradicted");
  });

  it("missing evidence remains not_established", () => {
    const requirement = req({ id: "MDR" });
    const result = evaluateRequirement(requirement, [SUPPLIERS[3]]);
    expect(result?.status).toBe("not_established");
  });

  it("unknown buyer terminology is preserved", () => {
    const requirements = parseQueryToRequirements("quantum posture harmonization");
    expect(requirements).toHaveLength(1);
    expect(requirements[0]?.id).toBe("UNKNOWN-1");
    expect(requirements[0]?.required).toBe(true);
  });

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

  it("empty buyer query", () => {
    expect(parseQueryToRequirements("")).toEqual([]);
    expect(parseQueryToRequirements("   ")).toEqual([]);
  });

  it("multi-criteria MDR + Microsoft 365 + UK + SME query", () => {
    const requirements = parseQueryToRequirements("MDR with Microsoft 365 integration for a UK SME");
    const ids = requirements.map((item) => item.id);

    expect(ids).toContain("MDR");
    expect(ids).toContain("MICROSOFT-365");
    expect(ids).toContain("SME-SUITABILITY");
    expect(ids).toContain("CONTEXT-BUYER-LOCATION-UK");
    expect(ids).not.toContain("UK-SERVICE-TEAM");

    const evaluations = evaluateMultipleSuppliers(requirements, SUPPLIERS);
    const alpha = evaluations.find((entry) => entry.supplierName === "Alpha Secure");

    expect(alpha).toBeDefined();
    expect(alpha?.summary.isCompleteMatch).toBe(false);
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

  it("requirement-specific evidence is enforced", () => {
    const requirements = parseQueryToRequirements("MDR with Microsoft 365 integration");
    const evaluations = evaluateMultipleSuppliers(requirements, [SUPPLIERS[2]]);

    const m365 = evaluations[0]?.evaluations["MICROSOFT-365"];
    expect(m365?.status).toBe("not_established");
  });

  it("cross-supplier aggregation is disabled for single requirement evaluation", () => {
    const result = evaluateRequirement(req({ id: "MDR" }), [SUPPLIERS[0], SUPPLIERS[3]]);
    expect(result?.status).toBe("not_established");
    expect(result?.reason.toLowerCase()).toContain("cross-supplier");
  });

  it("duplicate requirement IDs do not distort summary counts", () => {
    const duplicatedRequirements: Requirement[] = [
      req({ id: "MDR" }),
      req({ id: "MDR", originalText: "duplicate mdr" }),
    ];

    const evaluations = evaluateMultipleSuppliers(duplicatedRequirements, [SUPPLIERS[0]]);
    expect(evaluations[0]?.summary.totalRequired).toBe(1);
  });

  it("classification returns complete, potential, excluded", () => {
    const completeEvaluations = evaluateMultipleSuppliers(parseQueryToRequirements("MDR"), [SUPPLIERS[0]]);
    expect(classifySupplierMatch(completeEvaluations[0]!)).toBe("complete");

    const potentialEvaluations = evaluateMultipleSuppliers(parseQueryToRequirements("MDR with UK data residency"), [SUPPLIERS[0]]);
    expect(classifySupplierMatch(potentialEvaluations[0]!)).toBe("potential");

    const excludedEvaluations = evaluateMultipleSuppliers(parseQueryToRequirements("I don't want MDR"), [SUPPLIERS[0]]);
    expect(classifySupplierMatch(excludedEvaluations[0]!)).toBe("excluded");
  });
});
