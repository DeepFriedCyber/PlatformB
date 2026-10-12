
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface SavedCompany {
  id: string;
  companyName: string;
  domain: string;
  industry: string;
  verified: boolean;
}

interface CompanyComparison {
  companies: SavedCompany[];
}

interface CompanyConsoleProps {
  savedCompanies: SavedCompany[];
  onClearAll: () => void;
}

const MAX_COMPARISON = 3;

// Simple hash function for consistent color mapping
function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

// Get a color based on the category for visual variety
function getCategoryColor(category: string): string {
  const colors = [
    'from-indigo-500 to-purple-600',
    'from-emerald-500 to-teal-600',
    'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-blue-500 to-cyan-600',
    'from-green-500 to-lime-600',
    'from-yellow-500 to-amber-600',
    'from-red-500 to-rose-600'
  ];
  const index = Math.abs(hashString(category)) % colors.length;
  return colors[index];
}

function getCompanyUrl(company: SavedCompany): string {
  return `/company/${encodeURIComponent(company.companyName)}`;
}

function getEvidenceStatus(company: SavedCompany) {
  return company.verified ? (
    <span className="flex items-center space-x-1 text-xs font-medium">
      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
      Verified
    </span>
  ) : (
    <span className="flex items-center space-x-1 text-xs font-medium">
      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
      Not established
    </span>
  );
}

export default function CompanyConsole({
  savedCompanies,
  onClearAll,
}: CompanyConsoleProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set()
  );

  const [comparison, setComparison] =
    useState<CompanyComparison | null>(null);

  // Keep selected companies synchronized with saved companies.
  useEffect(() => {
    const validIds = new Set(savedCompanies.map(c => c.id));

    setSelectedIds(previous => {
      const next = new Set(
        Array.from(previous).filter(id => validIds.has(id))
      );

      if (
        next.size === previous.size &&
        Array.from(next).every(id => previous.has(id))
      ) {
        return previous;
      }

      return next;
    });
  }, [savedCompanies]);

  const selectedCompanies = savedCompanies.filter(company =>
    selectedIds.has(company.id)
  );

  const canCompare =
    selectedCompanies.length >= 2 &&
    selectedCompanies.length <= MAX_COMPARISON;

  const toggleSelect = (id: string) => {
    setSelectedIds(previous => {
      const next = new Set(previous);

      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= MAX_COMPARISON) {
          return previous;
        }

        next.add(id);
      }

      return next;
    });

    // A changed selection invalidates the previous comparison.
    setComparison(null);
  };

  const compareSelected = () => {
    if (!canCompare) {
      return;
    }

    setComparison({
      companies: selectedCompanies,
    });
  };

  const clearComparison = () => {
    setComparison(null);
  };

  const clearAll = () => {
    setSelectedIds(new Set());
    setComparison(null);
    onClearAll();
  };

  const renderStatus = (company: SavedCompany) => (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
        company.verified
          ? 'bg-green-100 text-green-800'
          : 'bg-orange-100 text-orange-800'
      }`}
    >
      {company.verified ? 'Verified' : 'Not established'}
    </span>
  );

  const comparisonFields: {
    label: string;
    getValue: (company: SavedCompany) => string | React.ReactElement;
  }[] = [
    {
      label: 'Company',
      getValue: company => company.companyName,
    },
    {
      label: 'Website',
      getValue: company => company.domain || 'Not established',
    },
    {
      label: 'Industry',
      getValue: company =>
        company.industry || 'Not established',
    },
    {
      label: 'Verification status',
      getValue: getEvidenceStatus,
    },
    {
      label: 'Market share',
      getValue: () => 'Not established',
    },
    {
      label: 'Average rating',
      getValue: () => 'Not established',
    },
    {
      label: 'Support SLA',
      getValue: () => 'Not established',
    },
    {
      label: 'Uptime',
      getValue: () => 'Not established',
    },
    {
      label: 'Key features',
      getValue: () => 'Not established',
    },
    {
      label: 'Pricing',
      getValue: () => 'Not established',
    },
  ];

  return (
    <div className="space-y-6">
       {/* Page heading */}
       <div className="space-y-4">
         <div className="flex items-center justify-between gap-4">
           <div>
             <h1 className="text-2xl font-bold text-indigo-900 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
               Company Console
             </h1>
           </div>
           <div className="flex items-center gap-3">
             <span className="flex items-center space-x-2 text-sm font-medium">
               <span className="w-2.5 h-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></span>
               <span className="text-indigo-600">{savedCompanies.length} companies saved</span>
             </span>
             <button
               type="button"
               onClick={compareSelected}
               disabled={!canCompare}
               className={`w-full md:w-auto px-5 py-2.5 font-medium rounded-xl transition-all duration-200 ${
                 canCompare
                   ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-400 hover:to-purple-500 shadow-lg'
                   : 'bg-gray-200 text-gray-500 hover:bg-gray-300 cursor-not-allowed opacity-75'
               }`}
             >
               Compare ({selectedCompanies.length}/{MAX_COMPARISON})
             </button>
             <button
               type="button"
               onClick={clearAll}
               disabled={savedCompanies.length === 0}
               className={`w-full md:w-auto px-5 py-2.5 font-medium rounded-xl transition-all duration-200 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 ${
                 savedCompanies.length === 0
                   ? 'cursor-not-allowed opacity-50'
                   : ''
               }`}
             >
               Clear All
             </button>
           </div>
         </div>
         <p className="text-indigo-600">
           Manage saved companies and compare available evidence.
         </p>
       </div>

       {/* Demo data disclosure */}
       <div
         role="note"
         className="mt-6 rounded-xl border border-indigo-200/50 bg-gradient-to-b from-indigo-50 via-indigo-100 to-indigo-50/5 p-6"
       >
         <div className="flex items-start space-x-3">
           <div className="flex-shrink-0">
             <span className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></span>
           </div>
           <div>
             <p className="text-sm font-medium text-indigo-800">
               PlatformB Demo Data
             </p>

             <p className="mt-2 text-sm leading-relaxed text-indigo-700">
               This is an MVP demonstration. Saved company information
               and verification flags may come from fixture data.
               A verification flag does not independently prove a claim.
               Market share, ratings, support SLAs, uptime, features
               and pricing are shown as Not established unless supported
               evidence is available.
             </p>
           </div>
         </div>
       </div>

       {/* Saved company list */}
       {savedCompanies.length === 0 ? (
         <div className="mt-6 rounded-xl border border-indigo-200/50 bg-gradient-to-b from-indigo-50 via-indigo-100 to-indigo-50/5 p-8 text-center">
           <div className="space-y-4">
             <div className="flex items-center justify-center space-x-3">
               <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                 <span className="text-white text-sm">+</span>
               </div>
               <h2 className="text-xl font-bold text-indigo-900 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                 No saved companies
               </h2>
             </div>

             <p className="text-lg text-indigo-600">
               Search for cybersecurity providers and save companies
               to compare them here.
             </p>

             <Link
               href="/search"
               className="mt-4 inline-flex items-center px-5 py-2.5 rounded-xl font-medium transition-all duration-200 bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-400 hover:to-purple-500 shadow-lg"
             >
               Search Companies
             </Link>
           </div>
         </div>
       ) : (
         <ul className="mt-6 space-y-4">
           {savedCompanies.map(company => {
             const selected = selectedIds.has(company.id);
             const selectionDisabled =
               !selected &&
               selectedIds.size >= MAX_COMPARISON;

             return (
               <li
                 key={company.id}
                 className={`transition-all duration-200 ${
                   selected
                     ? 'border-l-4 border-indigo-500 bg-indigo-50 shadow-lg'
                     : 'border border-gray-200/50 rounded-xl bg-white hover:border-indigo-300 hover:shadow-md'
                 }`}
               >
                 <div className="flex items-start gap-4 p-4">
                   <div className="flex-shrink-0">
                     <input
                       type="checkbox"
                       aria-label={`Select ${company.companyName} for comparison`}
                       checked={selected}
                       disabled={selectionDisabled}
                       onChange={() => toggleSelect(company.id)}
                       className={`h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ${
                         selected
                           ? 'bg-indigo-600'
                           : ''
                       }`}
                     />
                   </div>

                   <div className="min-w-0 flex-1 space-y-3">
                     <div className="flex items-start justify-between gap-3">
                       <div>
                         <h3 className="font-bold text-indigo-900 text-lg">{company.companyName}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            {getEvidenceStatus(company)}
                            <span className="flex items-center space-x-1 text-xs">
                              <span className="w-1.5 h-1.5 rounded-full
                                      className={`bg-gradient-to-r ${getCategoryColor(company.industry || 'Cybersecurity')}`}"></span>
                              <span className="text-indigo-600">{company.industry || 'Industry not established'}</span>
                            </span>
                          </div>
                       </div>
                     </div>

                     <div className="space-y-2 text-indigo-600">
                       <p className="flex items-center space-x-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-indigo-200 flex-shrink-0"></span>
                         <span>{company.domain || 'Website not established'}</span>
                       </p>
                       <p className="flex items-center space-x-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-indigo-200 flex-shrink-0"></span>
                         <span>{company.industry || 'Industry not established'}</span>
                       </p>
                     </div>

                     {!company.verified && (
                       <div className="mt-2 flex items-center space-x-2 text-indigo-500">
                         <span className="w-1.5 h-1.5 rounded-full bg-indigo-200 flex-shrink-0"></span>
                         <span>Verification status: Not established</span>
                       </div>
                     )}
                   </div>

                   <div className="flex-shrink-0">
                     <Link
                       href={getCompanyUrl(company)}
                       className="mt-2 flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-200 bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-400 hover:to-purple-500 shadow-lg text-xs"
                     >
                       View Details
                     </Link>
                   </div>
                 </div>
               </li>
             );
           })}
         </ul>
       )}

      {savedCompanies.length > MAX_COMPARISON && (
        <p className="text-xs text-gray-500">
          Select up to {MAX_COMPARISON} companies for comparison.
        </p>
      )}

       {/* Company comparison */}
       {comparison && (
         <section className="mt-6 rounded-xl border border-indigo-200/50 bg-gradient-to-b from-indigo-50 via-indigo-100 to-indigo-50/5">
           <div className="mb-5 flex flex-wrap items-center justify-between gap-3 p-6">
             <div>
               <h2 className="text-xl font-bold text-indigo-900 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                 Company Comparison
               </h2>

               <p className="mt-1 text-xs text-indigo-600">
                 {comparison.companies.length} selected companies
               </p>
             </div>

             <button
               type="button"
               onClick={clearComparison}
               className="px-4 py-2 rounded-xl font-medium transition-all duration-200 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
             >
               Clear Comparison
             </button>
           </div>

           <div
             role="note"
             className="mb-5 rounded-xl border border-indigo-200/50 bg-gradient-to-b from-indigo-50 via-indigo-100 to-indigo-50/5 p-4"
           >
             <p className="text-xs font-medium text-indigo-800">
               Demo Data - Evidence-based comparison
             </p>

             <p className="mt-2 text-xs text-indigo-700">
               This comparison uses available saved-company
               information. Unsupported commercial or performance
               metrics are explicitly marked Not established.
               No vendor rankings or performance claims are implied.
             </p>
           </div>

           <div className="overflow-x-auto rounded-xl border border-indigo-200/50">
             <table className="min-w-full border-collapse text-left text-sm">
               <thead className="bg-gradient-to-r from-indigo-50 via-indigo-100 to-indigo-50/5">
                 <tr>
                   <th
                     scope="col"
                     className="min-w-36 border-b border-indigo-200 p-3 font-semibold text-indigo-900"
                   >
                     Metric
                   </th>

                   {comparison.companies.map(company => (
                     <th
                       key={company.id}
                       scope="col"
                       className="min-w-40 border-b border-indigo-200 p-3 font-semibold text-indigo-900"
                     >
                       {company.companyName}
                     </th>
                   ))}
                 </tr>
               </thead>

               <tbody>
                 {comparisonFields.map(field => (
                   <tr key={field.label} className="border-b border-indigo-100">
                     <th
                       scope="row"
                       className="border-b border-indigo-100 p-3 font-medium text-indigo-800"
                     >
                       {field.label}
                     </th>

                     {comparison.companies.map(company => (
                       <td
                         key={`${field.label}-${company.id}`}
                         className="border-b border-indigo-100 p-3 text-indigo-700"
                       >
                         {field.getValue(company)}
                       </td>
                     ))}
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>

           <div className="mt-5 text-xs text-indigo-500">
             Not established means that this demo does not have
             sufficient supporting evidence for the metric.
             It does not mean that the vendor lacks the capability.
           </div>
         </section>
       )}

       {/* Navigation */}
       <div className="mt-6 border-t border-indigo-200/50 pt-4">
         <Link
           href="/search"
           className="inline-flex items-center gap-3 text-sm font-medium transition-all duration-200 text-indigo-600 hover:text-indigo-800"
         >
           <span aria-hidden="true">←</span>
           Back to Search
         </Link>
       </div>
    </div>
  );
}
