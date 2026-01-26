'use client';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className = '', width, height }: SkeletonProps) {
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      style={style}
    />
  );
}

export function MapSkeleton() {
  return (
    <div className="w-full aspect-[4/3] max-w-3xl mx-auto">
      <Skeleton className="w-full h-full rounded-lg" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="bg-gray-100 rounded-lg p-6">
      <Skeleton className="h-6 w-1/3 mb-4" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white/50 rounded-lg p-4 space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PanelSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-200 px-4 py-3">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-1/3 mt-2" />
      </div>
      <div className="p-4 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="space-y-1">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Skeleton;
