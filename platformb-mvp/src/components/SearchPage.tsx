"use client";

import { useState } from "react";
import Link from "next/link";
import { SOPHOS_COMPANY, SOPHOS_PRODUCTS, SOPHOS_SERVICES, SOPHOS_INTEGRATIONS, SOPHOS_COMMON_QUESTIONS } from "@/data";
import { interpretQuery } from "@/lib/query-interpreter";

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
}

function SearchResultCard({ product }: SearchResultCardProps) {
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
                    Verified
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
}

function ServiceCard({ service }: ServiceCardProps) {
  const categoryInitial = service.category.split(' ')[0];
  
  // Get a color based on the category for visual variety
  const getCategoryColor = (category: string) => {
    const colors = ['from-emerald-500 to-teal-600', 'from-indigo-500 to-purple-600', 'from-rose-500 to-pink-600', 'from-amber-500 to-orange-600', 'from-blue-500 to-cyan-600'];
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
          <h3 className="font-bold text-gray-900 text-lg">{service.name}</h3>
          <div className="flex items-center mt-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getCategoryColor(service.category)} text-white`}>
              {categoryInitial} Services
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs ml-2 bg-blue-50 text-blue-700">
              Demo data
            </span>
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
}

function IntegrationCard({ integration }: IntegrationCardProps) {
  // Get a color based on the integration name for visual variety
  const getCategoryColor = (name: string) => {
    const colors = ['from-blue-500 to-indigo-600', 'from-purple-500 to-pink-600', 'from-green-500 to-emerald-600', 'from-yellow-500 to-amber-600', 'from-red-500 to-rose-600'];
    const index = Math.abs(hashString(name)) % colors.length;
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
          <h3 className="font-bold text-gray-900 text-lg">{integration.name}</h3>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs ml-2 bg-blue-50 text-blue-700">
            Demo data
          </span>
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
            <span className="w-2.5 h-2.5 rounded-full 
                    className={`bg-gradient-to-r ${getCategoryColor(integration.name)}`}"></span>
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

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    const interpreted = interpretQuery(searchQuery.split(/\s+/));
    setInterpretation(interpreted);
    
    const lowerQuery = searchQuery.toLowerCase();
    
    const filteredProducts = SOPHOS_PRODUCTS.filter(product => {
      return product.description.toLowerCase().includes(lowerQuery) ||
             product.features.some(f => f.toLowerCase().includes(lowerQuery));
    });
    
    if (filteredProducts.length === 0 && !['MDR', 'firewall', 'email', 'microsoft', 'endpoint'].some(term => lowerQuery.includes(term))) {
      setSearchResults(SOPHOS_PRODUCTS);
    } else {
      setSearchResults(filteredProducts);
    }
    
    setServices(SOPHOS_SERVICES);
    
    const hasMicrosoft = searchQuery.split(' ').some(w => w.toLowerCase().includes('microsoft'));
    const microsoftIntegrations = SOPHOS_INTEGRATIONS.filter(i => 
      (hasMicrosoft && i.name.toLowerCase().includes('microsoft')) ||
      i.categories.some(c => c.toLowerCase().includes(lowerQuery))
    );
    setIntegrations(microsoftIntegrations.length > 0 ? microsoftIntegrations : SOPHOS_INTEGRATIONS);
    
    setSearchQuery('');
  };

  const handleClear = () => {
    setSearchQuery('');
    setInterpretation(null);
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
                  <SearchResultCard key={product.name} product={product} />
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
                  <ServiceCard key={service.name} service={service} />
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
                  <IntegrationCard key={integration.name} integration={integration} />
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