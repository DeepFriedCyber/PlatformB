import { describe, it, expect } from 'vitest';

describe('MVP Components', () => {
  it('SearchPage should be defined and exported', async () => {
    const SearchPageModule = await import('../components/SearchPage');
    expect(SearchPageModule).toBeDefined();
    expect(typeof SearchPageModule).toBe('object');
  });

  it('CompanyPage should be defined and exported', async () => {
    const CompanyPageModule = await import('../components/CompanyPage');
    expect(CompanyPageModule).toBeDefined();
    expect(typeof CompanyPageModule).toBe('object');
  });

  it('CompanyConsole should be defined and exported', async () => {
    const CompanyConsoleModule = await import('../components/CompanyConsole');
    expect(CompanyConsoleModule).toBeDefined();
    expect(typeof CompanyConsoleModule).toBe('object');
  });

  it('SearchResultCard component should be defined', async () => {
    const SearchResultCardModule = await import('../components/SearchResultCard');
    expect(SearchResultCardModule).toBeDefined();
  });

  it('SearchProviderList component should be defined', async () => {
    const SearchProviderListModule = await import('../components/SearchProviderList');
    expect(SearchProviderListModule).toBeDefined();
  });

  it('Layout component should be defined', async () => {
    const LayoutModule = await import('../components/Layout');
    expect(LayoutModule).toBeDefined();
  });

  it('Navbar component should be defined', async () => {
    const NavbarModule = await import('../components/Navbar');
    expect(NavbarModule).toBeDefined();
  });

  it('Navigation component should be defined', async () => {
    const NavigationModule = await import('../components/Navigation');
    expect(NavigationModule).toBeDefined();
  });

  it('EvidenceCount component should be defined', async () => {
    const EvidenceCountModule = await import('../components/EvidenceCount');
    expect(EvidenceCountModule).toBeDefined();
  });

  it('DemoBadge component should be defined', async () => {
    const DemoBadgeModule = await import('../components/DemoBadge');
    expect(DemoBadgeModule).toBeDefined();
  });

  it('SearchQueryInput component should be defined', async () => {
    const SearchQueryInputModule = await import('../components/SearchQueryInput');
    expect(SearchQueryInputModule).toBeDefined();
  });
});
