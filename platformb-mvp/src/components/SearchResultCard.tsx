interface CompanyData {
  id: string;
  name: string;
  description: string;
  industry: string[];
  location: string[];
  countries: string[];
  ticker?: string;
  employeesRange?: string;
  technologies: string[];
  keywords: string[];
  score: number;
}

interface Props {
  company: CompanyData;
  onClick: () => void;
}

export default function SearchResultCard({ company, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all p-5"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 pr-4">
          <h3 className="text-base font-semibold text-gray-900">{company.name}</h3>

          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {company.description}
          </p>

          <div className="mt-3 flex flex-wrap gap-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              Verified
            </span>

            {company.industry.slice(0, 3).map((i) => (
              <span
                key={i}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
              >
                {i}
              </span>
            ))}

            {company.location.slice(0, 3).map((l) => (
              <span
                key={l}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
              >
                {l}
              </span>
            ))}

            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              Score: {(company.score * 10).toFixed(0)}%
            </span>
          </div>
        </div>

        <svg
          className="w-5 h-5 text-gray-400 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {company.technologies.slice(0, 4).map((t) => (
          <span
            key={t}
            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
          >
            {t}
          </span>
        ))}

        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
          {company.keywords.slice(0, 3).join(", ")}
        </span>
      </div>
    </button>
  );
}