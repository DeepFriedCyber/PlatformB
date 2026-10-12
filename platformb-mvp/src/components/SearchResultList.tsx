'use client';

import type { SearchResult } from '../data/types';

export function SearchResultList({ results }: { results: SearchResult[] }) {
  return (
    <div className='space-y-3'>
      {results.map((result, index) => (
        <div key={index} className='border rounded-lg p-4 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'>
          <h3 className='font-semibold text-sm text-gray-900 dark:text-gray-100'>{result.name || result.title}</h3>
          {result.description && <p className='text-xs text-gray-600 dark:text-gray-400 mt-1'>{result.description}</p>}
        </div>
      ))}
    </div>
  );
}
