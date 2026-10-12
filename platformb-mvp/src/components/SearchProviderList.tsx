'use client';

import type { SearchProvider } from '../data/types';

export function SearchProviderList({ providers }: { providers: SearchProvider[] }) {
  return (
    <div className='space-y-2'>
      {providers.map((provider, index) => (
        <div key={index} className='p-3 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700'>
          <h4 className='font-medium text-sm text-gray-900 dark:text-gray-100'>{provider.name}</h4>
          {provider.description && <p className='text-xs text-gray-600 dark:text-gray-400 mt-1'>{provider.description}</p>}
        </div>
      ))}
    </div>
  );
}
