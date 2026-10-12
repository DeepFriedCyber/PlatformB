import { Metadata } from "next";
import CompanyPage from "@/components/CompanyPage";

interface CompanyNameParams {
  params: Promise<{ name: string }>;
}

export default async function CompanyPageRoute({ params }: CompanyNameParams) {
  const { name: domainName } = await params;
  
  // For MVP demo, use the domain name as company identifier
  let companyName = "";
  try {
    if (domainName.toLowerCase().includes("sophos")) {
      companyName = "Sophos";
    } else {
      companyName = domainName.replace(/\..*$/, "");
    }
  } catch (error) {
    console.error("Error getting company name:", error);
    companyName = domainName.replace(/\..*$/, "");
  }

  // Reuse SophosDemoData from CompanyPage for all company views in MVP
  const { SophosDemoData: companyData } = await import('@/components/CompanyPage');

  return <CompanyPage name={companyName} companyData={companyData} />;
}