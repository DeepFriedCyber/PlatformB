'use client';

import { useState } from 'react';

export function SearchQueryInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type='text'
      className='w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder='Search companies, products, or capabilities...'
    />
  );
}
