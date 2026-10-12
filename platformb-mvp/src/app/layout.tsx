import { Metadata } from "next";
import "@/globals.css";

export const metadata: Metadata = {
  title: "PlatformB - B2B Discovery Platform",
  description: "Discover, compare and understand cybersecurity and AI security companies. Search products, services, and integrations with evidence-backed information.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
