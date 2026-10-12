import type {
  ContentGap,
  EvidenceFreshnessAssessment,
  EvidenceFreshnessPolicy,
  ProvenanceEvidenceRecord,
  Requirement,
  RequirementEvaluation,
  SupplierClarification,
} from "@/types";

export const DEFAULT_FRESHNESS_POLICY: EvidenceFreshnessPolicy = {
  reviewIntervalDays: 180,
};

const DAY_MS = 24 * 60 * 60 * 1000;

function parseIsoDate(dateText?: string): Date | null {
  if (!dateText) {
    return null;
  }
  const parsed = new Date(dateText);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function assessEvidenceFreshness(
  evidence: ProvenanceEvidenceRecord,
  evaluationDateIso: string,
  policy: EvidenceFreshnessPolicy = DEFAULT_FRESHNESS_POLICY
): EvidenceFreshnessAssessment {
  const evaluationDate = parseIsoDate(evaluationDateIso);
  const observed = parseIsoDate(evidence.observedAt);
  const published = parseIsoDate(evidence.publishedAt);
  const checked = parseIsoDate(evidence.lastCheckedAt);

  if (!evaluationDate) {
    return {
      evidenceId: evidence.id,
      observedAt: evidence.observedAt,
      publishedAt: evidence.publishedAt,
      lastCheckedAt: evidence.lastCheckedAt,
      freshnessStatus: "unknown",
      freshnessReason: "Evaluation date is invalid.",
    };
  }

  const reference = checked ?? observed ?? published;
  if (!reference) {
    return {
      evidenceId: evidence.id,
      observedAt: evidence.observedAt,
      publishedAt: evidence.publishedAt,
      lastCheckedAt: evidence.lastCheckedAt,
      freshnessStatus: "unknown",
      freshnessReason: "No usable observed, published, or last-checked date is available.",
    };
  }

  if (reference.getTime() > evaluationDate.getTime()) {
    return {
      evidenceId: evidence.id,
      observedAt: evidence.observedAt,
      publishedAt: evidence.publishedAt,
      lastCheckedAt: evidence.lastCheckedAt,
      freshnessStatus: "unknown",
      freshnessReason: "Evidence date is in the future relative to evaluation date.",
    };
  }

  const ageDays = Math.floor((evaluationDate.getTime() - reference.getTime()) / DAY_MS);
  const dueDate = new Date(reference.getTime() + policy.reviewIntervalDays * DAY_MS);

  if (ageDays > policy.reviewIntervalDays) {
    return {
      evidenceId: evidence.id,
      observedAt: evidence.observedAt,
      publishedAt: evidence.publishedAt,
      lastCheckedAt: evidence.lastCheckedAt,
      freshnessStatus: "review_needed",
      freshnessReason: `Evidence is ${ageDays} days old and exceeds review interval of ${policy.reviewIntervalDays} days.`,
      reviewDueAt: toIsoDate(dueDate),
    };
  }

  return {
    evidenceId: evidence.id,
    observedAt: evidence.observedAt,
    publishedAt: evidence.publishedAt,
    lastCheckedAt: evidence.lastCheckedAt,
    freshnessStatus: "current",
    freshnessReason: `Evidence is within the ${policy.reviewIntervalDays}-day review interval.`,
    reviewDueAt: toIsoDate(dueDate),
  };
}

function clarificationPriority(reasonCode: SupplierClarification["reasonCode"]): SupplierClarification["priority"] {
  if (reasonCode === "conflicting_evidence" || reasonCode === "missing_evidence") {
    return "high";
  }
  if (reasonCode === "freshness_review" || reasonCode === "unknown_provenance") {
    return "medium";
  }
  return "low";
}

function shouldGenerateFreshnessReview(
  requirement: Requirement,
  evaluation: RequirementEvaluation
): boolean {
  if (!requirement.required) {
    return false;
  }
  if (!evaluation.freshness) {
    return false;
  }
  if (evaluation.freshness.freshnessStatus !== "review_needed") {
    return false;
  }
  if (evaluation.status === "not_established" && !evaluation.claimId) {
    return false;
  }
  return true;
}

function buildClarificationQuestion(
  reasonCode: SupplierClarification["reasonCode"],
  requirement: Requirement,
  supplierName: string
): string {
  if (reasonCode === "missing_evidence") {
    return `Can ${supplierName} provide documentation confirming whether it supports ${requirement.capability}?`;
  }
  if (reasonCode === "conflicting_evidence") {
    return `Available evidence for ${requirement.capability} appears inconsistent. Can ${supplierName} confirm current functionality and provide updated supporting documentation?`;
  }
  if (reasonCode === "freshness_review") {
    return `The available documentation for ${requirement.capability} is due for review. Can ${supplierName} confirm it remains accurate and share the latest supporting source?`;
  }
  if (reasonCode === "unknown_provenance") {
    return `The provenance for evidence related to ${requirement.capability} is unclear. Can ${supplierName} share a source with clear origin and publication details?`;
  }
  return `Can ${supplierName} clarify whether ${requirement.capability} is currently supported and provide relevant evidence?`;
}

function toClarificationId(supplierId: string, requirementId: string, reasonCode: SupplierClarification["reasonCode"]): string {
  return `clar-${supplierId}-${requirementId}-${reasonCode}`.toLowerCase().replace(/[^a-z0-9-]+/g, "-");
}

export function buildClarificationsForSupplier(
  supplierId: string,
  supplierName: string,
  requirements: Requirement[],
  evaluations: Record<string, RequirementEvaluation>
): SupplierClarification[] {
  const clarifications: SupplierClarification[] = [];

  requirements.forEach((requirement) => {
    const evaluation = evaluations[requirement.id];
    if (!evaluation || !requirement.required) {
      return;
    }

    let reasonCode: SupplierClarification["reasonCode"] | null = null;

    if (evaluation.conflictingEvidenceIds && evaluation.conflictingEvidenceIds.length > 0) {
      reasonCode = "conflicting_evidence";
    } else if (evaluation.status === "not_established") {
      reasonCode = evaluation.evidenceRelationshipStatus === "absent" ? "missing_evidence" : "unestablished_requirement";
    } else if (shouldGenerateFreshnessReview(requirement, evaluation)) {
      reasonCode = "freshness_review";
    } else if (evaluation.evidenceRecord?.origin === "unknown") {
      reasonCode = "unknown_provenance";
    }

    if (!reasonCode) {
      return;
    }

    clarifications.push({
      id: toClarificationId(supplierId, requirement.id, reasonCode),
      supplierId,
      requirementId: requirement.id,
      claimId: evaluation.claimId,
      relatedEvidenceIds: evaluation.conflictingEvidenceIds ?? (evaluation.evidenceRecord ? [evaluation.evidenceRecord.id] : []),
      reasonCode,
      question: buildClarificationQuestion(reasonCode, requirement, supplierName),
      priority: clarificationPriority(reasonCode),
      status: "open",
    });
  });

  return clarifications;
}

export function aggregateContentGaps(
  clarifications: SupplierClarification[],
  observedAtIso: string,
  previous: ContentGap[] = []
): ContentGap[] {
  const byKey = new Map<string, ContentGap>();

  previous.forEach((gap) => {
    byKey.set(`${gap.supplierId}|${gap.requirementId}|${gap.reasonCode}`, { ...gap });
  });

  clarifications.forEach((clarification) => {
    const key = `${clarification.supplierId}|${clarification.requirementId}|${clarification.reasonCode}`;
    const existing = byKey.get(key);

    if (!existing) {
      byKey.set(key, {
        id: `gap-${clarification.supplierId}-${clarification.requirementId}-${clarification.reasonCode}`,
        supplierId: clarification.supplierId,
        requirementId: clarification.requirementId,
        reasonCode: clarification.reasonCode,
        relatedClarificationIds: [clarification.id],
        relatedEvidenceIds: [...clarification.relatedEvidenceIds],
        firstObservedAt: observedAtIso,
        lastObservedAt: observedAtIso,
        occurrenceCount: 1,
        status: "open",
      });
      return;
    }

    const clarificationIds = new Set(existing.relatedClarificationIds);
    const evidenceIds = new Set(existing.relatedEvidenceIds);

    const alreadySeenClarification = clarificationIds.has(clarification.id);
    clarificationIds.add(clarification.id);
    clarification.relatedEvidenceIds.forEach((id) => evidenceIds.add(id));

    existing.relatedClarificationIds = Array.from(clarificationIds);
    existing.relatedEvidenceIds = Array.from(evidenceIds);
    existing.lastObservedAt = observedAtIso;
    if (!alreadySeenClarification) {
      existing.occurrenceCount += 1;
    }
  });

  return Array.from(byKey.values());
}
