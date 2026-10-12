'use client';;

export function EvidenceCount({ count }: { count?: number }) {
  if (!count) return null;
  
  return (
    <span className='text-xs text-gray-500 dark:text-gray-400 ml-2'>
      ({count} sources)
    </span>
  );
}
