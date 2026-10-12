import type { ProvenanceEvidenceRecord, SupplierCapabilityClaim } from "@/types";

export function toStableId(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface SupplierProvenance {
  capabilityClaims: SupplierCapabilityClaim[];
  provenanceEvidence: ProvenanceEvidenceRecord[];
}

const DEMO_PROVENANCE: Record<string, SupplierProvenance> = {
  [toStableId("service-Sophos MDR (Managed Detection and Response)")]: {
    capabilityClaims: [
      {
        id: "claim-sophos-mdr-availability",
        supplierId: toStableId("service-Sophos MDR (Managed Detection and Response)"),
        productOrServiceId: "sophos-mdr-service",
        capabilityId: "MDR",
        statement: "Service provides managed detection and response coverage.",
        evidenceIds: ["ev-sophos-mdr-service-page", "ev-sophos-mdr-case-study"],
        contradictingEvidenceIds: ["ev-sophos-mdr-legacy-contradiction"],
        provenanceStatus: "supported",
        demoData: true,
      },
      {
        id: "claim-sophos-m365-integration",
        supplierId: toStableId("service-Sophos MDR (Managed Detection and Response)"),
        productOrServiceId: "sophos-mdr-service",
        capabilityId: "MICROSOFT-365",
        statement: "Service integrates with Microsoft 365.",
        evidenceIds: [],
        contradictingEvidenceIds: ["ev-sophos-m365-not-supported-demo"],
        provenanceStatus: "contradicted",
        demoData: true,
      },
      {
        id: "claim-sophos-uk-service-team",
        supplierId: toStableId("service-Sophos MDR (Managed Detection and Response)"),
        productOrServiceId: "sophos-mdr-service",
        capabilityId: "UK-SERVICE-TEAM",
        statement: "Service includes UK-based support team.",
        evidenceIds: ["ev-sophos-generic-blog"],
        contradictingEvidenceIds: [],
        provenanceStatus: "unknown",
        demoData: true,
      },
      {
        id: "claim-sophos-uk-data-residency",
        supplierId: toStableId("service-Sophos MDR (Managed Detection and Response)"),
        productOrServiceId: "sophos-mdr-service",
        capabilityId: "UK-DATA-RESIDENCY",
        statement: "Service supports UK data residency.",
        evidenceIds: ["ev-sophos-broken-reference"],
        contradictingEvidenceIds: [],
        provenanceStatus: "unknown",
        demoData: true,
      },
    ],
    provenanceEvidence: [
      {
        id: "ev-sophos-mdr-service-page",
        supplierId: toStableId("service-Sophos MDR (Managed Detection and Response)"),
        productOrServiceId: "sophos-mdr-service",
        sourceTitle: "MDR Services Overview",
        sourceUrl: "https://www.sophos.com/en-us/services/mdr",
        sourceType: "service_page",
        publisher: "Sophos",
        claimExcerpt: "Managed Detection and Response service with continuous monitoring.",
        observedAt: undefined,
        evidenceStatus: "supports_claim",
        origin: "supplier_published",
        independentlyVerified: false,
        demoData: true,
      },
      {
        id: "ev-sophos-mdr-case-study",
        supplierId: toStableId("service-Sophos MDR (Managed Detection and Response)"),
        productOrServiceId: "sophos-mdr-service",
        sourceTitle: "Bank reduces incidents by 80% with MDR",
        sourceUrl: undefined,
        sourceType: "case_study",
        publisher: "Sophos Case Studies",
        claimExcerpt: "MDR deployment reduced incidents in this synthetic example.",
        observedAt: undefined,
        evidenceStatus: "supports_claim",
        origin: "supplier_published",
        independentlyVerified: null,
        demoData: true,
      },
      {
        id: "ev-sophos-mdr-legacy-contradiction",
        supplierId: toStableId("service-Sophos MDR (Managed Detection and Response)"),
        productOrServiceId: "sophos-mdr-service",
        sourceTitle: "Synthetic legacy tier limitation",
        sourceUrl: undefined,
        sourceType: "announcement",
        publisher: "PlatformB demo fixture",
        claimExcerpt: "Legacy service tier excludes MDR capabilities in this synthetic scenario.",
        observedAt: undefined,
        evidenceStatus: "contradicts_claim",
        origin: "third_party",
        independentlyVerified: null,
        demoData: true,
      },
      {
        id: "ev-sophos-m365-not-supported-demo",
        supplierId: toStableId("service-Sophos MDR (Managed Detection and Response)"),
        productOrServiceId: "sophos-mdr-service",
        sourceTitle: "Synthetic compatibility matrix",
        sourceUrl: undefined,
        sourceType: "announcement",
        publisher: "PlatformB demo fixture",
        claimExcerpt: "Microsoft 365 integration is listed as not available in this synthetic demo case.",
        observedAt: undefined,
        evidenceStatus: "contradicts_claim",
        origin: "third_party",
        independentlyVerified: null,
        demoData: true,
      },
      {
        id: "ev-sophos-generic-blog",
        supplierId: toStableId("service-Sophos MDR (Managed Detection and Response)"),
        productOrServiceId: "sophos-mdr-service",
        sourceTitle: "General company update",
        sourceUrl: undefined,
        sourceType: "announcement",
        publisher: "Sophos Blog",
        claimExcerpt: undefined,
        observedAt: "2023-06",
        evidenceStatus: "insufficient",
        origin: "supplier_published",
        independentlyVerified: null,
        demoData: true,
      },
      {
        id: "ev-sophos-unknown-origin",
        supplierId: toStableId("service-Sophos MDR (Managed Detection and Response)"),
        productOrServiceId: "sophos-mdr-service",
        sourceTitle: undefined,
        sourceUrl: undefined,
        sourceType: "unknown",
        publisher: undefined,
        claimExcerpt: undefined,
        observedAt: undefined,
        evidenceStatus: "unknown",
        origin: "unknown",
        independentlyVerified: null,
        demoData: true,
      },
    ],
  },
};

export function getDemoProvenanceForSupplier(supplierId: string, _name: string): SupplierProvenance {
  const match = DEMO_PROVENANCE[supplierId];
  if (match) {
    return {
      capabilityClaims: match.capabilityClaims,
      provenanceEvidence: match.provenanceEvidence,
    };
  }

  return {
    capabilityClaims: [],
    provenanceEvidence: [],
  };
}
