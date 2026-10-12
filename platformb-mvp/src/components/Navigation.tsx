"use client";

export default function Navigation({
  currentView,
  onNavigate,
}: {
  currentView: "search" | "company" | "console";
  onNavigate: (view: "search" | "company" | "console") => void;
}) {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-8">
            <span className="text-lg font-semibold text-gray-900">
              PlatformB
            </span>

            <button
              onClick={() => onNavigate("search")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === "search"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Search
            </button>

            <button
              onClick={() => onNavigate("company")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === "company"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Company Page
            </button>

            <button
              onClick={() => onNavigate("console")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === "console"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Company Console
            </button>
          </div>

          <div className="text-xs text-gray-500">Enterprise Edition</div>
        </div>
      </div>
    </nav>
  );
}