'use client';

import Image from 'next/image';
import { MatrixEasterEgg } from './MatrixEasterEgg';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Blurred cityscape background */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{
            backgroundImage: 'url(https://cdn.prod.website-files.com/617923509295278867c6726d/64ef2d81cf57b355de207b63_210506f0ca62fa0289c9037812dff14b_ny.webp)',
            filter: 'blur(8px)'
          }}
        />
        <div className="absolute inset-0 bg-white/30" />
      </div>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1 w-full">
        {children}
      </main>
      <DualCTASection />
      <Footer />
      <MatrixEasterEgg />
    </div>
  );
}

function Header() {
  return (
    <header className="bg-gradient-to-br from-navy-900 via-navy-800 to-sky-900 text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-400 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-orange-400 rounded-full filter blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative">
        <div className="flex items-center justify-between">
          {/* Logo - slightly larger */}
          <a
            href="https://nichessp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center group flex-shrink-0"
          >
            <Image
              src="/niche-logo.webp"
              alt="NicheSSP"
              width={160}
              height={56}
              className="h-10 w-auto sm:h-12 lg:h-14 brightness-0 invert transition-transform group-hover:scale-105"
              priority
            />
          </a>

          {/* Centered Title - Responsive */}
          <div className="flex-1 flex justify-center">
            <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold tracking-tight flex items-baseline gap-1 sm:gap-2 flex-wrap justify-center">
              <span className="hidden sm:inline">Preconstruction & Estimating</span>
              <span className="text-sky-300">Salary Survey</span>
              <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400 bg-clip-text text-transparent">
                2026
              </span>
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}


function DualCTASection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      {/* Looking for Your Next Opportunity - Orange */}
      <div className="bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600 py-12 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-yellow-300 rounded-full filter blur-3xl" />
        </div>

        <div className="max-w-lg mx-auto text-center relative">
          <div className="flex items-center justify-center gap-3 mb-3">
            <svg className="h-8 w-8 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Looking for Your Next Opportunity?
            </h2>
          </div>
          <p className="text-orange-100 mb-6 text-base">
            Our consultants specialize in connecting preconstruction professionals with elite opportunities.
          </p>
          <a
            href="https://nichessp.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-orange-600 px-6 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Talk to Our Consultants
          </a>
        </div>
      </div>

      {/* Want to Contribute - Navy/Sky */}
      <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-sky-900 py-12 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-sky-400 rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-sky-300 rounded-full filter blur-3xl" />
        </div>

        <div className="max-w-lg mx-auto text-center relative">
          <div className="flex items-center justify-center gap-3 mb-3">
            <svg className="h-8 w-8 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Want to Contribute?
            </h2>
          </div>
          <p className="text-gray-300 mb-6 text-base">
            All data is anonymised. We update this survey quarterly — get your data in now and see how you compare.
          </p>
          <a
            href="https://www.nichessp.com/2026-preconstruction-estimating-salary-survey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-sky-500 hover:bg-sky-400 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Submit Your Data
          </a>
        </div>
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
                href="https://www.linkedin.com/company/niche-specialist-staffing-partners/"
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
