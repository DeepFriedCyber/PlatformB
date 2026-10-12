"use client";

import { useState } from "react";
import Link from "next/link";
import { SOPHOS_COMPANY, SOPHOS_PRODUCTS, SOPHOS_SERVICES, SOPHOS_INTEGRATIONS, SOPHOS_COMMON_QUESTIONS } from "@/data";
import { interpretQuery } from "@/lib/query-interpreter";
import type { Requirement, SupplierEvaluation } from "@/types";
import type { SupplierMatchClass } from "@/lib/matchers/requirement-match";
import { parseQueryToRequirements, evaluateMultipleSuppliers, classifySupplierMatch } from "@/lib/matchers/requirement-match";
import { getAllSuppliers } from "@/lib/suppliers/exports";

// Shared hash function for consistent color mapping across all card components
function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function Button({ 
  children, 
  onClick, 
  variant = "primary",
  size = "md",
  className
}: { 
  children: React.ReactNode; 
  onClick?: () => void;
  variant?: "primary" | "secondary" | "accent" | "success";
  size?: "sm" | "md";
  className?: string;
}) {
  const baseClasses = "font-medium rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";
   
  const variants = {
    primary: variant === "primary"
      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500"
      : "bg-gray-200 text-gray-700 hover:bg-gray-300",
    secondary: variant === "secondary"
      ? "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300"
      : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500",
    accent: variant === "accent"
      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400"
      : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500",
    success: variant === "success"
      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-400 hover:to-emerald-400"
      : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500",
  };
   
  const sizes = {
    sm: size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-base",
    md: size === "md" ? "px-4 py-2 text-base" : "px-3 py-1.5 text-sm",
  };
   
  return (
    <button onClick={onClick} className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className || ""}`}>
      {children}
    </button>
  );
}

interface SearchResultCardProps {
  product: typeof SOPHOS_PRODUCTS[0];
  matchClass?: SupplierMatchClass;
}

function SearchResultCard({ product, matchClass }: SearchResultCardProps) {
  const categoryInitial = product.category.split(' ')[0];
  
  // Get a color based on the category for visual variety
  const getCategoryColor = (category: string) => {
    const colors = ['from-indigo-500 to-purple-600', 'from-emerald-500 to-teal-600', 'from-rose-500 to-pink-600', 'from-amber-500 to-orange-600', 'from-blue-500 to-cyan-600'];
    const index = Math.abs(hashString(category)) % colors.length;
    return colors[index];
  };
  
  // Simple hash function for consistent color mapping
  function hashString(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  return (
    <div className="border border-gray-200 rounded-xl p-6 hover:border-indigo-300/50 hover:shadow-lg transition-all duration-200 bg-white">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{product.name}</h3>
          <div className="flex items-center mt-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getCategoryColor(product.category)} text-white`}>
              {categoryInitial} Security
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs ml-2 bg-blue-50 text-blue-700">
              Demo data
            </span>
            {matchClass && (
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ml-2 ${
                matchClass === "complete"
                  ? "bg-emerald-50 text-emerald-700"
                  : matchClass === "excluded"
                    ? "bg-rose-50 text-rose-700"
                    : "bg-amber-50 text-amber-700"
              }`}>
                {matchClass === "complete" ? "Complete match" : matchClass === "excluded" ? "Excluded match" : "Potential match"}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-5 line-clamp-3">{product.description}</p>
      
      <div className="mt-4 flex flex-wrap gap-2 mb-4">
        {product.features.slice(0, 3).map((feature, i) => (
          <span key={i} className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium 
                  bg-gray-50 text-gray-600 border border-gray-200">
            {feature}
          </span>
        ))}
      </div>
      
      {product.evidenceSources.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 font-medium mb-2">Evidence sources:</p>
          <div className="space-y-1">
            {product.evidenceSources.map((source, i) => (
              <div key={i} className="text-xs text-gray-600 flex items-center">
                <span className={`font-medium ${source.established ? 'text-emerald-600' : 'text-gray-400'}`}>
                  {source.type === 'product_page' && source.url 
                    ? `Product page (${source.source})`
                    : source.title || source.source}
                </span>
                {source.established && (
                  <span className="ml-2 flex items-center">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-1"></span>
                    Demo evidence established
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-5">
        <Button 
          variant="accent" 
          size="sm"
          onClick={() => {}}
          className="w-full"
        >
          View Details
        </Button>
      </div>
    </div>
  );
}

interface ServiceCardProps {
  service: typeof SOPHOS_SERVICES[0];
  matchClass?: SupplierMatchClass;
}

function ServiceCard({ service, matchClass }: ServiceCardProps) {
  const categoryInitial = service.category.split(' ')[0];
  
  // Get a color based on the category for visual variety (shared hashString defined at SearchPage top level)
  const getCategoryColor = (category: string) => {
    const colors = ['from-emerald-500 to-teal-600', 'from-indigo-500 to-purple-600', 'from-rose-500 to-pink-600', 'from-amber-500 to-orange-600', 'from-blue-500 to-cyan-600'];
    const index = Math.abs(hashString(category)) % colors.length;
    return colors[index];
  };

  return (
    <div className="border border-gray-200 rounded-xl p-6 hover:border-indigo-300/50 hover:shadow-lg transition-all duration-200 bg-white">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{service.name}</h3>
          <div className="flex items-center mt-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getCategoryColor(service.category)} text-white`}>
              {categoryInitial} Services
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs ml-2 bg-blue-50 text-blue-700">
              Demo data
            </span>
            {matchClass && (
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ml-2 ${
                matchClass === "complete"
                  ? "bg-emerald-50 text-emerald-700"
                  : matchClass === "excluded"
                    ? "bg-rose-50 text-rose-700"
                    : "bg-amber-50 text-amber-700"
              }`}>
                {matchClass === "complete" ? "Complete match" : matchClass === "excluded" ? "Excluded match" : "Potential match"}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-5 line-clamp-3">{service.description}</p>
      
      <div className="mt-4 flex flex-wrap gap-2 mb-4">
        {service.capabilities.slice(0, 3).map((cap, i) => (
          <span key={i} className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium 
                  bg-gray-50 text-gray-600 border border-gray-200">
            {cap}
          </span>
        ))}
      </div>
      
      <div className="mt-5">
        <Button 
          variant="accent" 
          size="sm"
          onClick={() => {}}
          className="w-full"
        >
          View Details
        </Button>
      </div>
    </div>
  );
}

interface IntegrationCardProps {
  integration: typeof SOPHOS_INTEGRATIONS[0];
  matchClass?: SupplierMatchClass;
}

function IntegrationCard({ integration, matchClass }: IntegrationCardProps) {
  // Get a color based on the integration name for visual variety
  const getCategoryColor = (name: string) => {
    const colors = ['from-blue-500 to-indigo-600', 'from-purple-500 to-pink-600', 'from-green-500 to-emerald-600', 'from-yellow-500 to-amber-600', 'from-red-500 to-rose-600'];
    const index = Math.abs(hashString(name)) % colors.length;
    return colors[index];
  };
  
  return (
    <div className="border border-gray-200 rounded-xl p-6 hover:border-indigo-300/50 hover:shadow-lg transition-all duration-200 bg-white">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{integration.name}</h3>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs ml-2 bg-blue-50 text-blue-700">
            Demo data
          </span>
          {matchClass && (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ml-2 ${
              matchClass === "complete"
                ? "bg-emerald-50 text-emerald-700"
                : matchClass === "excluded"
                  ? "bg-rose-50 text-rose-700"
                  : "bg-amber-50 text-amber-700"
            }`}>
              {matchClass === "complete" ? "Complete match" : matchClass === "excluded" ? "Excluded match" : "Potential match"}
            </span>
          )}
        </div>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2 mb-4">
        {integration.categories.map((cat, i) => (
          <span key={i} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
                  bg-gray-50 text-gray-600 border border-gray-200">
            {cat}
          </span>
        ))}
      </div>
      
      <ul className="mt-4 space-y-2 text-sm text-gray-600">
        {integration.features.map((feat, i) => (
          <li key={i} className="flex items-center">
            <span className={`w-2.5 h-2.5 rounded-full ${getCategoryColor(integration.name)}`}></span>
            <span className="ml-2">{feat}</span>
          </li>
        ))}
      </ul>
      
      <div className="mt-5">
        <Button 
          variant="accent" 
          size="sm"
          onClick={() => {}}
          className="w-full"
        >
          View Details
        </Button>
      </div>
    </div>
  );
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [interpretation, setInterpretation] = useState<string[] | null>(null);
  const [searchResults, setSearchResults] = useState<typeof SOPHOS_PRODUCTS>(SOPHOS_PRODUCTS.slice());
  const [services, setServices] = useState<typeof SOPHOS_SERVICES>(SOPHOS_SERVICES.slice());
  const [integrations, setIntegrations] = useState<typeof SOPHOS_INTEGRATIONS>(SOPHOS_INTEGRATIONS.slice());
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [requirementEvaluations, setRequirementEvaluations] = useState<SupplierEvaluation[] | null>(null);

  const evaluationBySupplierName = new Map<string, SupplierEvaluation>();
  if (requirementEvaluations) {
    requirementEvaluations.forEach((evaluation) => {
      evaluationBySupplierName.set(evaluation.supplierName, evaluation);
    });
  }

  const getMatchClassFor = (name: string): SupplierMatchClass | undefined => {
    const evaluation = evaluationBySupplierName.get(name);
    if (!evaluation) {
      return undefined;
    }
    return classifySupplierMatch(evaluation);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    const interpreted = interpretQuery(searchQuery.split(/\s+/));
    setInterpretation(interpreted);

    const extractedRequirements = parseQueryToRequirements(searchQuery);
    setRequirements(extractedRequirements);

    const suppliers = getAllSuppliers(SOPHOS_PRODUCTS, SOPHOS_SERVICES, SOPHOS_INTEGRATIONS);
    const supplierEvaluations = extractedRequirements.length > 0
      ? evaluateMultipleSuppliers(extractedRequirements, suppliers)
      : null;
    setRequirementEvaluations(supplierEvaluations);

    const evaluationByName = new Map<string, SupplierEvaluation>();
    if (supplierEvaluations) {
      supplierEvaluations.forEach((evaluation) => {
        evaluationByName.set(evaluation.supplierName, evaluation);
      });
    }
    
    const lowerQuery = searchQuery.toLowerCase();
    
    const filteredProducts = SOPHOS_PRODUCTS.filter(product => {
      return product.description.toLowerCase().includes(lowerQuery) ||
             product.features.some(f => f.toLowerCase().includes(lowerQuery));
    });

    const hasTermFallback = ['mdr', 'firewall', 'email', 'microsoft', 'endpoint'].some(term => lowerQuery.includes(term));
    const productBaseline = filteredProducts.length === 0 && !hasTermFallback ? SOPHOS_PRODUCTS : filteredProducts;

    const rankByRequirementEvaluation = <T extends { name: string }>(items: T[]): T[] => {
      if (!supplierEvaluations || extractedRequirements.length === 0) {
        return items;
      }

      const complete: T[] = [];
      const potential: T[] = [];
      const excluded: T[] = [];
      const unrated: T[] = [];

      items.forEach((item) => {
        const evaluation = evaluationByName.get(item.name);
        if (!evaluation) {
          unrated.push(item);
          return;
        }

        const classification = classifySupplierMatch(evaluation);
        if (classification === "complete") {
          complete.push(item);
        } else if (classification === "potential") {
          potential.push(item);
        } else {
          excluded.push(item);
        }
      });

      return [...complete, ...potential, ...excluded, ...unrated];
    };

    setSearchResults(rankByRequirementEvaluation(productBaseline));
    setServices(rankByRequirementEvaluation(SOPHOS_SERVICES));

    const hasMicrosoft = searchQuery.split(' ').some(w => w.toLowerCase().includes('microsoft'));
    const microsoftIntegrations = SOPHOS_INTEGRATIONS.filter(i =>
      (hasMicrosoft && i.name.toLowerCase().includes('microsoft')) ||
      i.categories.some(c => c.toLowerCase().includes(lowerQuery))
    );
    const integrationBaseline = microsoftIntegrations.length > 0 ? microsoftIntegrations : SOPHOS_INTEGRATIONS;
    setIntegrations(rankByRequirementEvaluation(integrationBaseline));
    
    setSearchQuery('');
  };

  const handleClear = () => {
    setSearchQuery('');
    setInterpretation(null);
    setRequirements([]);
    setRequirementEvaluations(null);
    setSearchResults([]);
    setServices([]);
    setIntegrations([]);
  };

  const toggleSave = (productId: string) => {
    setSavedIds(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="border border-indigo-200/50 rounded-xl p-6 bg-gradient-to-b from-indigo-50 via-indigo-100 to-indigo-50/5">
        <div className="flex gap-3 items-center">
          <input
            type="text"
            placeholder='Use natural language to search. Example: "Which MDR providers should we consider for a UK SME using Microsoft 365?"'
            className="flex-1 border-none outline-none text-base bg-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button onClick={handleSearch} variant="accent" className="px-6 py-2">
            Search
          </Button>
        </div>
      </div>

      {/* Query Interpretation - Demo data */}
      {interpretation && (
        <div className="bg-gradient-to-b from-indigo-50 via-indigo-100 to-indigo-50/5 border border-indigo-200/50 rounded-xl p-6">
          <h3 className="font-semibold text-indigo-900 mb-3 flex items-center gap-3">
            <span>🔍 Query Interpretation</span>
            <span className="text-xs bg-indigo-100 px-2.5 py-0.5 rounded-full text-indigo-800 font-medium">Demo data</span>
          </h3>
          <ul className="list-disc list-inside text-indigo-800 space-y-2">
            {interpretation.map((note, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="text-indigo-600 flex-shrink-0">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {requirementEvaluations && requirements.length > 0 && (
        <div className="bg-gradient-to-b from-indigo-50 via-indigo-100 to-indigo-50/5 border border-indigo-200/50 rounded-xl p-6">
          <h3 className="font-semibold text-indigo-900 mb-3 flex items-center gap-3">
            <span>Requirement Outcomes</span>
            <span className="text-xs bg-indigo-100 px-2.5 py-0.5 rounded-full text-indigo-800 font-medium">Demo data</span>
          </h3>

          <div className="mb-4 text-sm text-indigo-800">
            {requirements.map((req) => (
              <div key={req.id} className="mb-1">
                <span className="font-medium">{req.capability}</span>
                <span className="ml-2 text-indigo-700">{req.required ? "required" : "preferred"}</span>
                {req.negated && <span className="ml-2 text-rose-700">negated</span>}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {requirementEvaluations.every((evaluation) => !evaluation.summary.isCompleteMatch) && (
              <p className="text-xs text-indigo-800 bg-indigo-100/80 border border-indigo-200 rounded p-2">
                Ranking limitation: requirement-specific demo evidence is incomplete for some capabilities. Potential matches remain visible and are not treated as contradictions.
              </p>
            )}
            {requirementEvaluations.map((supplierEvaluation) => (
              <div key={supplierEvaluation.supplierName} className="rounded-lg border border-indigo-200 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-gray-900">{supplierEvaluation.supplierName}</p>
                  <p className="text-xs text-gray-600">
                    Class: {classifySupplierMatch(supplierEvaluation)} | Complete match: {supplierEvaluation.summary.isCompleteMatch ? "Yes" : "No"} | Completion: {supplierEvaluation.summary.completionRate}%
                  </p>
                </div>

                <ul className="mt-3 space-y-2 text-sm">
                  {requirements.map((req) => {
                    const evaluation = supplierEvaluation.evaluations[req.id];
                    if (!evaluation) {
                      return (
                        <li key={`${supplierEvaluation.supplierName}-${req.id}`} className="text-gray-700">
                          {req.capability}: not_established
                        </li>
                      );
                    }

                    const statusClassName = evaluation.status === "supported"
                      ? "text-emerald-700"
                      : evaluation.status === "contradicted"
                        ? "text-rose-700"
                        : "text-amber-700";

                    return (
                      <li key={`${supplierEvaluation.supplierName}-${req.id}`} className="text-gray-700">
                        <span className="font-medium">{req.capability}:</span>
                        <span className={`ml-2 font-semibold ${statusClassName}`}>{evaluation.status}</span>
                        <span className="ml-2">{evaluation.status === "not_established" ? "Not established — no applicable supporting evidence available." : evaluation.reason}</span>
                        {evaluation.reason === "Conflicting linked evidence: both supporting and contradictory records found." && (
                          <span className="ml-2 text-amber-700">Not established — conflicting evidence requires clarification.</span>
                        )}
                        {evaluation.conflictingEvidenceIds && evaluation.conflictingEvidenceIds.length > 0 && (
                          <span className="ml-2 text-gray-500">Conflicting evidence IDs: {evaluation.conflictingEvidenceIds.join(", ")}</span>
                        )}
                        {evaluation.claimId && (
                          <span className="ml-2 text-gray-500">Claim: {evaluation.claimId}</span>
                        )}
                        {evaluation.claimStatement && (
                          <span className="ml-2 text-gray-500">Statement: {evaluation.claimStatement}</span>
                        )}
                        {evaluation.evidenceSource && (
                          <span className="ml-2 text-gray-500">Source: {evaluation.evidenceSource.title || evaluation.evidenceSource.source}</span>
                        )}
                        {evaluation.evidenceRecord && (
                          <span className="ml-2 text-gray-500">
                            Publisher: {evaluation.evidenceRecord.publisher || "Unknown"} | Origin: {evaluation.evidenceRecord.origin} | Independent verification: {evaluation.evidenceRecord.independentlyVerified === null ? "Unknown" : evaluation.evidenceRecord.independentlyVerified ? "Yes" : "No"} | Demo: {evaluation.evidenceRecord.demoData ? "Yes" : "No"}
                          </span>
                        )}
                        {evaluation.evidenceRecord?.sourceUrl && (
                          <span className="ml-2 text-gray-500">URL: {evaluation.evidenceRecord.sourceUrl}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {(searchResults.length > 0 || services.length > 0 || integrations.length > 0) && (
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-indigo-900 mb-4 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Search Results
          </h2>
          
           {/* Products */}
           {searchResults.length > 0 && (
             <section>
               <h3 className="text-xl font-semibold text-indigo-800 mb-4 flex items-center gap-3">
                 <span className="w-2.5 h-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></span>
                 Products & Services
               </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {searchResults.map((product) => (
                  <SearchResultCard key={product.name} product={product} matchClass={getMatchClassFor(product.name)} />
                ))}
              </div>
            </section>
          )}

           {/* Services */}
           {services.length > 0 && (
             <section>
               <h3 className="text-xl font-semibold text-indigo-800 mb-4 flex items-center gap-3">
                 <span className="w-2.5 h-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"></span>
                 Managed Services
               </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {services.map((service) => (
                  <ServiceCard key={service.name} service={service} matchClass={getMatchClassFor(service.name)} />
                ))}
              </div>
            </section>
          )}

           {/* Integrations */}
           {integrations.length > 0 && (
             <section>
               <h3 className="text-xl font-semibold text-indigo-800 mb-4 flex items-center gap-3">
                 <span className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></span>
                 Integrations
               </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {integrations.map((integration) => (
                  <IntegrationCard key={integration.name} integration={integration} matchClass={getMatchClassFor(integration.name)} />
                ))}
              </div>
            </section>
          )}

           {/* Common Questions - Demo data */}
           <section className="border-t border-indigo-200/50 pt-6">
             <h3 className="text-xl font-semibold text-indigo-800 mb-4 flex items-center gap-3">
               <span className="w-2.5 h-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></span>
               Common Questions
             </h3>
            {SOPHOS_COMMON_QUESTIONS.slice(0, 2).map((q, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 mb-3">
                <p className="font-medium text-gray-900">{q.question}</p>
                <p className="text-sm text-gray-600 mt-1">{q.answer}</p>
              </div>
            ))}
          </section>
        </div>
      )}

       {/* Empty state */}
       {!interpretation && searchResults.length === 0 && services.length === 0 && integrations.length === 0 && (
         <div className="border border-indigo-200/50 rounded-xl p-10 text-center bg-gradient-to-b from-indigo-50 via-indigo-100 to-indigo-50/5">
           <h3 className="text-2xl font-bold text-indigo-900 mb-3 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
             Ready to Search
           </h3>
           <p className="text-lg text-indigo-600 mb-5">
             Enter a natural language query above to find companies, products, or services.
           </p>
           <p className="text-sm text-indigo-400">
             Demo data: This prototype demonstrates search interpretation and result display.
           </p>
         </div>
       )}

       {/* Clear button */}
       {(interpretation || searchResults.length > 0) && (
         <div className="flex justify-end mt-6">
           <Button variant="secondary" onClick={handleClear} className="px-5 py-2">
             Clear Results
           </Button>
         </div>
       )}
    </div>
  );
}
