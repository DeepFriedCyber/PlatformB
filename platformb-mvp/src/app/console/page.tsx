"use client";

import { Suspense } from "react";
import Link from "next/link";
import CompanyConsole from "@/components/CompanyConsole";

export default function ConsolePage() {
  return (
    <div className="animate-fade-in">
      <Link href="/search" className="mb-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-700">
        ← Back to Search
      </Link>
      <CompanyConsole 
        savedCompanies={[]}
        onClearAll={() => console.log("Clear all companies")}
      />
    </div>
  );
}
