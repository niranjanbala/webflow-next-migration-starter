'use client';

import { useEffect, useState } from 'react';
import { useNavigation } from '@/lib/navigation';
import { cn } from '@/lib/utils';

// Page loading indicator
export function PageLoadingIndicator() {
  const { isNavigating } = useNavigation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isNavigating) {
      const timer = setTimeout(() => setIsVisible(true), 150);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isNavigating]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 bg-blue-200">
        <div className="h-full bg-blue-600 animate-pulse" style={{
          animation: 'loading-bar 2s ease-in-out infinite'
        }} />
      </div>
    </div>
  );
}

// Skeleton components for different content types
export function SkeletonText({ 
  lines = 3, 
  className = '' 
}: { 
  lines?: number; 
  className?: string; 
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-4 bg-gray-200 rounded animate-pulse',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 p-6', className)}>
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>
        <div className="mt-6">
          <div className="h-10 bg-gray-200 rounded w-32" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonImage({ 
  width = 'w-full', 
  height = 'h-48', 
  className = '' 
}: { 
  width?: string; 
  height?: string; 
  className?: string; 
}) {
  return (
    <div className={cn('bg-gray-200 rounded animate-pulse', width, height, className)}>
      <div className="flex items-center justify-center h-full">
        <svg 
          className="w-8 h-8 text-gray-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
      </div>
    </div>
  );
}

export function SkeletonHeader({ className = '' }: { className?: string }) {
  return (
    <header className={cn('bg-white border-b border-gray-200', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="hidden md:flex space-x-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </header>
  );
}

export function SkeletonGrid({ 
  columns = 3, 
  rows = 2, 
  className = '' 
}: { 
  columns?: number; 
  rows?: number; 
  className?: string; 
}) {
  const totalItems = columns * rows;
  
  return (
    <div className={cn(
      'grid gap-6',
      `grid-cols-1 md:grid-cols-${Math.min(columns, 3)} lg:grid-cols-${columns}`,
      className
    )}>
      {Array.from({ length: totalItems }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonList({ 
  items = 5, 
  className = '' 
}: { 
  items?: number; 
  className?: string; 
}) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200">
          <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

// Page-specific skeleton layouts
export function SkeletonBlogPost({ className = '' }: { className?: string }) {
  return (
    <article className={cn('max-w-4xl mx-auto px-4 py-8', className)}>
      <div className="animate-pulse">
        {/* Header */}
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-3 bg-gray-200 rounded w-20" />
            </div>
          </div>
          <SkeletonImage height="h-64" className="mb-6" />
        </div>
        
        {/* Content */}
        <div className="prose max-w-none">
          <SkeletonText lines={8} className="mb-6" />
          <SkeletonText lines={6} className="mb-6" />
          <SkeletonImage height="h-48" className="mb-6" />
          <SkeletonText lines={10} />
        </div>
      </div>
    </article>
  );
}

export function SkeletonProductPage({ className = '' }: { className?: string }) {
  return (
    <div className={cn('', className)}>
      <div className="animate-pulse">
        {/* Hero Section */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="h-12 bg-gray-200 rounded w-3/4" />
                <SkeletonText lines={4} />
                <div className="flex space-x-4">
                  <div className="h-12 w-32 bg-gray-200 rounded" />
                  <div className="h-12 w-28 bg-gray-200 rounded" />
                </div>
              </div>
              <SkeletonImage height="h-96" />
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4" />
              <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto" />
            </div>
            <SkeletonGrid columns={3} rows={1} />
          </div>
        </section>
      </div>
    </div>
  );
}

export function SkeletonHomePage({ className = '' }: { className?: string }) {
  return (
    <div className={cn('', className)}>
      <div className="animate-pulse">
        {/* Hero */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="h-16 bg-gray-200 rounded w-2/3 mx-auto mb-6" />
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-8" />
            <div className="flex justify-center space-x-4">
              <div className="h-12 w-32 bg-gray-200 rounded" />
              <div className="h-12 w-28 bg-gray-200 rounded" />
            </div>
          </div>
        </section>
        
        {/* Features */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <SkeletonGrid columns={4} rows={1} />
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4" />
            </div>
            <SkeletonGrid columns={3} rows={1} />
          </div>
        </section>
      </div>
    </div>
  );
}

// Loading wrapper component
interface LoadingWrapperProps {
  loading: boolean;
  skeleton: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
}

export function LoadingWrapper({ 
  loading, 
  skeleton: Skeleton, 
  children, 
  className = '' 
}: LoadingWrapperProps) {
  if (loading) {
    return <Skeleton className={className} />;
  }
  
  return <>{children}</>;
}