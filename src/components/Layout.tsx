'use client';

import Image from 'next/image';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-navy-900 flex flex-col">
      <Header />
      <HeroHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1 w-full">
        {children}
      </main>
      <CTABanner />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="bg-navy-900 text-white border-b border-navy-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a
            href="https://nichessp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center group"
          >
            <Image
              src="/niche-logo.webp"
              alt="NicheSSP"
              width={140}
              height={48}
              className="h-8 w-auto sm:h-10 brightness-0 invert transition-transform group-hover:scale-105"
              priority
            />
          </a>

          {/* Back to site link */}
          <a
            href="https://nichessp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-sky-300 hover:text-white transition-colors flex items-center gap-1"
          >
            <span className="hidden sm:inline">Visit</span> nichessp.com
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}

function HeroHeader() {
  return (
    <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-sky-900 text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-400 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-orange-400 rounded-full filter blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative text-center">
        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
          <span className="block">Salary Survey</span>
          <span className="block bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400 bg-clip-text text-transparent">
            2026
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl lg:text-3xl text-sky-200 font-medium mb-6">
          Preconstruction & Estimating
        </p>

        {/* Stats tagline */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 text-sm sm:text-base text-sky-300">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>108 US Locations</span>
          </div>
          <div className="w-px h-4 bg-sky-700" />
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>6 Role Levels</span>
          </div>
        </div>
      </div>
    </div>
  );
}


function CTABanner() {
  return (
    <div className="bg-gradient-to-r from-orange-500 via-orange-500 to-orange-600 py-10 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-yellow-300 rounded-full filter blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Looking for Your Next Opportunity?
        </h2>
        <p className="text-orange-100 mb-6 text-lg max-w-2xl mx-auto">
          Our consultants specialize in connecting preconstruction professionals with elite opportunities.
        </p>
        <a
          href="https://nichessp.com/about"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          Talk to Our Consultants
        </a>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-navy-900 text-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Contact */}
          <div>
            <div className="mb-4">
              <a
                href="https://nichessp.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/niche-logo.webp"
                  alt="NicheSSP"
                  width={120}
                  height={40}
                  className="h-8 w-auto brightness-0 invert"
                />
              </a>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Delivering the top 10% of Estimators and Preconstruction Professionals across the United States.
            </p>
            <div className="text-gray-400 text-sm space-y-1">
              <p>27 W 35th St</p>
              <p>New York, NY 10001, USA</p>
              <p className="mt-2">
                <a href="tel:+16465035594" className="hover:text-sky-400 transition-colors">(646) 503-5594</a>
              </p>
              <p className="text-xs">Open 8am-8pm, Mon-Sat</p>
            </div>
          </div>

          {/* Jobs */}
          <div>
            <h3 className="font-semibold mb-4 text-sky-400">Jobs</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="https://www.nichessp.com/construction-estimator-jobs" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">
                  Apply Now
                </a>
              </li>
              <li>
                <a href="https://www.nichessp.com/contact" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">
                  Post a Job
                </a>
              </li>
              <li>
                <a href="https://www.nichessp.com/blog" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h3 className="font-semibold mb-4 text-sky-400">Locations</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="https://www.nichessp.com/construction-estimator-jobs/charlotte-nc" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">
                  Charlotte, NC
                </a>
              </li>
              <li>
                <a href="https://www.nichessp.com/construction-estimator-jobs/nashville" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">
                  Nashville, TN
                </a>
              </li>
              <li>
                <a href="https://www.nichessp.com/construction-estimator-jobs/tampa-florida" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">
                  Tampa, FL
                </a>
              </li>
              <li>
                <a href="https://www.nichessp.com/construction-estimator-jobs" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">
                  All Locations
                </a>
              </li>
            </ul>
          </div>

          {/* Podcast & Social */}
          <div>
            <h3 className="font-semibold mb-4 text-sky-400">The Preconstruction Podcast</h3>
            <p className="text-gray-400 text-sm mb-4">
              Insights from industry leaders in preconstruction and estimating.
            </p>
            <a
              href="https://www.nichessp.com/pre-construction-podcast"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-orange-400 hover:text-orange-300 transition-colors text-sm font-medium mb-4"
            >
              Listen Now →
            </a>

            {/* Social Links */}
            <div className="flex gap-4 mt-4">
              <a
                href="https://twitter.com/nichessp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-sky-400 transition-colors"
                aria-label="Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/nichessp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-sky-400 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} NicheSSP. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="https://nichessp.com/terms" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">
              Terms & Conditions
            </a>
            <a href="https://nichessp.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Layout;
