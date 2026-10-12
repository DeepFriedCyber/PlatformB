import Link from 'next/link';
import { Search, Building2, BarChart3 } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="bg-slate-800 text-white px-6 py-3 border-b border-slate-700">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg">PlatformB Prototype</Link>
        
        <div className="flex items-center space-x-2">
          <Link
            href="/search"
            className="flex items-center space-x-2 px-3 py-1.5 rounded-md hover:bg-slate-700 transition-colors text-sm"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </Link>
          
          <Link
            href="/company"
            className="flex items-center space-x-2 px-3 py-1.5 rounded-md hover:bg-slate-700 transition-colors text-sm"
          >
            <Building2 className="w-4 h-4" />
            <span>Company</span>
          </Link>
          
          <Link
            href="/console"
            className="flex items-center space-x-2 px-3 py-1.5 rounded-md hover:bg-slate-700 transition-colors text-sm"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Console</span>
          </Link>
          
          <div className="border-l border-slate-600 mx-2 hidden md:block"></div>
          
          <Link
            href="/providers"
            className="flex items-center space-x-2 px-3 py-1.5 rounded-md hover:bg-slate-700 transition-colors text-sm"
          >
            <span>Providers</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}


