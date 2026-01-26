import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "2026 Construction Estimator Salary Survey | NicheSSP",
  description: "Interactive salary data explorer for preconstruction professionals. Explore salaries across 108 US cities for Estimators, Directors, and Managers in construction.",
  keywords: ["salary survey", "construction estimator", "preconstruction", "salary data", "estimator salary", "construction jobs"],
  openGraph: {
    title: "2026 Construction Estimator Salary Survey | NicheSSP",
    description: "Explore preconstruction salary data across 108 US cities. Compare salaries by role, location, and see market trends.",
    type: "website",
    siteName: "NicheSSP",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "2026 Construction Estimator Salary Survey | NicheSSP",
    description: "Explore preconstruction salary data across 108 US cities. Compare salaries by role, location, and see market trends.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
