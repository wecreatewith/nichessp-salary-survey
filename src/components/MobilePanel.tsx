'use client';

import { useEffect, useState, ReactNode } from 'react';

interface MobilePanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function MobilePanel({ isOpen, onClose, children }: MobilePanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Small delay to ensure the component is mounted before animating
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      // Wait for animation to complete before hiding
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          lg:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300
          ${isAnimating ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`
          lg:hidden fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl
          transform transition-transform duration-300 ease-out
          ${isAnimating ? 'translate-y-0' : 'translate-y-full'}
        `}
        role="dialog"
        aria-modal="true"
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <button
            onClick={onClose}
            className="w-12 h-1.5 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors"
            aria-label="Close panel"
          />
        </div>

        {/* Panel Content - scrollable */}
        <div className="max-h-[80vh] overflow-y-auto pb-safe">
          {children}
        </div>
      </div>
    </>
  );
}

export default MobilePanel;
