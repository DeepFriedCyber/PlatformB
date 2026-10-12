/// <reference types="react" />

import { SOPHOS_COMPANY, SOPHOS_PRODUCTS, SOPHOS_SERVICES, SOPHOS_INTEGRATIONS } from "@/data";
import { EvidenceCount } from "@/components/EvidenceCount";

interface CompanyPageProps {
  name: string;
  companyData?: object & { evidenceGaps?: string[] };
}

// Re-export the demo data for use in route pages
export const SophosDemoData = SOPHOS_COMPANY as unknown as object;

export default function CompanyPage({ 
  name, 
  companyData 
}: CompanyPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">{name} Company Profile</h1>
            <EvidenceCount count={5} />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Company Overview */}
        <section className="border border-gray-200 rounded-xl p-6 mb-6 bg-indigo-50">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Overview</h2>
          <p className="text-gray-700">{SOPHOS_COMPANY.description}</p>
          <div className="mt-4 flex gap-4 text-sm text-gray-600">
            <span className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Sophos Corporate Registry</span>
            <span>Founded: {SOPHOS_COMPANY.foundedYear}</span>
          </div>
        </section>

        {/* Products */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Products</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SOPHOS_PRODUCTS.map((product, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors bg-white">
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                <div className="mt-2 flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-800">
                    {product.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Services</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {SOPHOS_SERVICES.map((service, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors bg-white">
                <h3 className="font-semibold text-gray-900">{service.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Integrations */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Integrations</h2>
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <p className="text-sm text-gray-600">{SOPHOS_INTEGRATIONS.length} integrations available</p>
          </div>
        </section>

        {/* Not established note */}
        <section className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">Not established</h3>
          <p className="text-xs text-yellow-700">
            This is demo data for the MVP. Complete product details, service listings and integration information are not yet verified on-platform.
          </p>
        </section>
      </main>
    </div>
  );
}