import type { EvidenceSource, ProvenanceEvidenceRecord, SupplierCapabilityClaim } from "@/types";
import { getDemoProvenanceForSupplier, toStableId } from "@/lib/suppliers/provenance-demo";

export interface SupplierData {
  id?: string;
  name: string;
  category?: string;
  description?: string;
  features?: string[];
  capabilities?: string[];
  categories?: string[];
  supportedEnvironments?: string[];
  targetOrgSizes?: string[];
  industriesSupported?: string[];
  pricetiers?: string[];
  established?: boolean;
  evidenceSources: EvidenceSource[];
  capabilityClaims?: SupplierCapabilityClaim[];
  provenanceEvidence?: ProvenanceEvidenceRecord[];
  demoData?: boolean;
}

export interface Supplier {
  name: string;
  data: SupplierData;
}

/**
 * Export products with names and data for requirement matching.
 */
export function exportProducts(
  products: Array<{
    name: string;
    category: string;
    description: string;
    features: string[];
    supportedEnvironments: string[];
    pricetiers: string[];
    evidenceSources: EvidenceSource[];
  }>
): Supplier[] {
  return products.map(p => ({
    name: p.name,
    data: {
      id: toStableId(`product-${p.name}`),
      name: p.name,
      category: p.category,
      description: p.description,
      features: p.features,
      supportedEnvironments: p.supportedEnvironments,
      pricetiers: p.pricetiers,
      evidenceSources: p.evidenceSources,
      ...getDemoProvenanceForSupplier(toStableId(`product-${p.name}`), p.name),
      demoData: true,
    },
  }));
}

/**
 * Export services with names and data for requirement matching.
 */
export function exportServices(
  services: Array<{
    name: string;
    category: string;
    description: string;
    capabilities: string[];
    targetOrgSizes: string[];
    industriesSupported: string[];
    evidenceSources: EvidenceSource[];
  }>
): Supplier[] {
  return services.map(s => ({
    name: s.name,
    data: {
      id: toStableId(`service-${s.name}`),
      name: s.name,
      category: s.category,
      description: s.description,
      capabilities: s.capabilities,
      targetOrgSizes: s.targetOrgSizes,
      industriesSupported: s.industriesSupported,
      evidenceSources: s.evidenceSources,
      ...getDemoProvenanceForSupplier(toStableId(`service-${s.name}`), s.name),
      demoData: true,
    },
  }));
}

/**
 * Export integrations with names and data for requirement matching.
 */
export function exportIntegrations(
  integrations: Array<{
    name: string;
    categories: string[];
    features: string[];
    established: boolean;
    evidenceSources: EvidenceSource[];
  }>
): Supplier[] {
  return integrations.map(i => ({
    name: i.name,
    data: {
      id: toStableId(`integration-${i.name}`),
      name: i.name,
      categories: i.categories,
      features: i.features,
      established: i.established,
      evidenceSources: i.evidenceSources,
      ...getDemoProvenanceForSupplier(toStableId(`integration-${i.name}`), i.name),
      demoData: true,
    },
  }));
}

/**
 * Get all suppliers combined for evaluation.
 */
export function getAllSuppliers(
  products: Array<{
    name: string;
    category: string;
    description: string;
    features: string[];
    supportedEnvironments: string[];
    pricetiers: string[];
    evidenceSources: EvidenceSource[];
  }>,
  services: Array<{
    name: string;
    category: string;
    description: string;
    capabilities: string[];
    targetOrgSizes: string[];
    industriesSupported: string[];
    evidenceSources: EvidenceSource[];
  }>,
  integrations: Array<{
    name: string;
    categories: string[];
    features: string[];
    established: boolean;
    evidenceSources: EvidenceSource[];
  }>
): Supplier[] {
  return [
    ...exportProducts(products),
    ...exportServices(services),
    ...exportIntegrations(integrations),
  ];
}

/**
 * Get all supplier names for reference.
 */
export function getAllSupplierNames(
  products: Array<{ name: string }>,
  services: Array<{ name: string }>
): string[] {
  return [
    ...products.map(p => p.name),
    ...services.map(s => s.name),
  ];
}
