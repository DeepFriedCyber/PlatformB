'use client';

import { usePathname } from 'next/navigation';
import SearchPage from "@/components/SearchPage";
import CompanyConsole from "@/components/CompanyConsole";

function App() {
  const pathname = usePathname();
  const isConsoleRoute = pathname?.startsWith("/console");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto w-full px-4 py-6">
        {isConsoleRoute ? (
          <CompanyConsole 
            savedCompanies={[]}
            onClearAll={() => console.log("Clear all companies")}
          />
        ) : (
          <SearchPage />
        )}
      </main>
    </div>
  );
}

export default App;
