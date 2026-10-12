import type { EvidenceSource } from "@/types";

export interface SupplierData {
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
      name: p.name,
      category: p.category,
      description: p.description,
      features: p.features,
      supportedEnvironments: p.supportedEnvironments,
      pricetiers: p.pricetiers,
      evidenceSources: p.evidenceSources,
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
      name: s.name,
      category: s.category,
      description: s.description,
      capabilities: s.capabilities,
      targetOrgSizes: s.targetOrgSizes,
      industriesSupported: s.industriesSupported,
      evidenceSources: s.evidenceSources,
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
      name: i.name,
      categories: i.categories,
      features: i.features,
      established: i.established,
      evidenceSources: i.evidenceSources,
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
