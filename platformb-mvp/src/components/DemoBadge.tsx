'use client';;

export function DemoBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className='inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-700' role='status'>
      <span className='w-1 h-1 rounded-full bg-gray-400 animate-pulse'></span>
      {children}
    </span>
  );
}
