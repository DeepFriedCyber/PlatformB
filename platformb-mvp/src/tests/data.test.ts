import { describe, it, expect } from 'vitest';
import { SOPHOS_COMPANIES } from '../data/sophos-data';

describe('Sophos Demo Data', () => {
  const sophos = SOPHOS_COMPANIES['sophos'];

  it('should have the correct number of demo companies', () => {
    expect(Object.keys(SOPHOS_COMPANIES).length).toBe(1);
  });

  it('should have verified status set correctly', () => {
    expect(sophos?.verifiedStatus).toBe('Verified');
  });

  it('should have products array with items', () => {
    const products = sophos?.products;
    expect(products).toBeDefined();
    if (Array.isArray(products)) {
      expect(products.length).toBeGreaterThan(0);
    }
  });

  it('should have capability verified flag', () => {
    let hasVerifiedCap = false;
    const products = sophos?.products || [];
    products.forEach((product: any) => {
      if (Array.isArray(product.capabilities)) {
        product.capabilities.forEach((cap: any) => {
          if (typeof cap.verified === 'boolean') {
            hasVerifiedCap = true;
          }
        });
      }
    });
    expect(hasVerifiedCap).toBe(true);
  });

  it('should handle evidence counts for verified capabilities', () => {
    let hasEvidenceCount = false;
    const products = sophos?.products || [];
    products.forEach((product: any) => {
      if (Array.isArray(product.capabilities)) {
        product.capabilities.forEach((cap: any) => {
          if (cap.evidenceCount !== undefined) {
            expect(typeof cap.evidenceCount).toBe('number');
            hasEvidenceCount = true;
          }
        });
      }
    });
    expect(hasEvidenceCount).toBe(true);
  });

  it('should have demo products', () => {
    let hasDemoProduct = false;
    const products = sophos?.products || [];
    products.forEach((product: any) => {
      if (product.name === 'Sophos Central') {
        hasDemoProduct = true;
      }
    });
    expect(hasDemoProduct).toBe(true);
  });

  it('should mention MDR in the demo company profile', () => {
    expect(sophos.description.toLowerCase()).toContain(
      'managed detection and response'
    );
  });

  it('should maintain demo data labeling', () => {
    expect(sophos?.verifiedStatus).toBe('Verified');
  });

  it('should have founded year', () => {
    expect(typeof sophos?.founded).toBe('number');
    expect(sophos?.founded).toBe(1985);
  });

  it('should handle employees count', () => {
    expect(typeof sophos?.employees).toBe('number');
    expect(sophos?.employees).toBe(6000);
  });

  it('should handle capability descriptions', () => {
    let hasDescriptions = false;
    const products = sophos?.products || [];
    products.forEach((product: any) => {
      if (Array.isArray(product.capabilities)) {
        product.capabilities.forEach((cap: any) => {
          if (cap.verified && cap.description) {
            expect(cap.description.length).toBeGreaterThan(0);
            hasDescriptions = true;
          }
        });
      }
    });
    expect(hasDescriptions).toBe(true);
  });
});
