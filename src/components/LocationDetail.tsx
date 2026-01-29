'use client';

import { useRef, useState, useCallback } from 'react';
import { Location, ROLE_DISPLAY_NAMES, ROLE_KEYS } from '@/types/salary';
import { getJobPageUrl } from '@/lib/data';
import { SalaryBar } from './SalaryBar';
import { SalaryBarLegend } from './SalaryBarLegend';
import { TrendIndicator } from './TrendIndicator';

interface LocationDetailProps {
  location: Location;
  onBack: () => void;
}


export function LocationDetail({ location, onBack }: LocationDetailProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleShareLinkedIn = useCallback(() => {
    // Build share URL with location params for deep-linking
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = `${baseUrl}?city=${encodeURIComponent(location.city)}&state=${encodeURIComponent(location.stateCode)}`;

    // LinkedIn share URL
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

    window.open(linkedInUrl, '_blank', 'width=600,height=600');
  }, [location]);

  const handleDownloadPdf = useCallback(async () => {
    if (!contentRef.current || isGeneratingPdf) return;

    setIsGeneratingPdf(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${location.city}-${location.stateCode}-salary-data.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  }, [location.city, location.stateCode, isGeneratingPdf]);

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden" ref={contentRef}>
      {/* Header */}
      <div className="bg-navy px-4 py-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:text-gold transition-colors mb-2"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm">Back to {location.state}</span>
        </button>
        <h2 className="text-xl font-semibold text-white">
          {location.city}, {location.stateCode}
        </h2>
      </div>

      {/* Salary Ranges by Role */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-navy">Salary Ranges by Role</h3>
          <SalaryBarLegend />
        </div>
        <div className="space-y-6">
          {ROLE_KEYS.map((roleKey) => {
            const roleData = location.roles[roleKey];
            return (
              <div key={roleKey}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {ROLE_DISPLAY_NAMES[roleKey]}
                  </span>
                  <TrendIndicator trend={roleData.trend} showLabel />
                </div>
                <SalaryBar
                  min={roleData.min}
                  max={roleData.max}
                  role={roleKey}
                  showLabels={true}
                  showNationalAverage={true}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleShareLinkedIn}
              className="flex items-center gap-2 text-gray-600 hover:text-[#0A66C2] transition-colors text-sm"
              title="Share on LinkedIn"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span>Share</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-2 text-gray-600 hover:text-sky-600 disabled:text-gray-400 transition-colors text-sm"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>{isGeneratingPdf ? 'Generating...' : 'Download'}</span>
            </button>
          </div>
          <a
            href={getJobPageUrl(location.city, location.stateCode)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <span>{location.city} Jobs</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

    </div>
  );
}

export default LocationDetail;
