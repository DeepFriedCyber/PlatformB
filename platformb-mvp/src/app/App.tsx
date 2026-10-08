'use client';

import SearchPage from "@/components/SearchPage";
import CompanyConsole from "@/components/CompanyConsole";

function App() {
  // Use URL pathname to determine which view to show
  const isConsoleRoute = typeof window !== undefined && window.location.pathname.startsWith("/console");

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
