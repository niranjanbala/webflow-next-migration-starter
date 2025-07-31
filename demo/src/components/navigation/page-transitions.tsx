'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useRouteChange } from '@/lib/navigation';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  type?: 'fade' | 'slide' | 'scale' | 'none';
}

export default function PageTransition({
  children,
  className = '',
  duration = 300,
  type = 'fade'
}: PageTransitionProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useRouteChange((url) => {
    if (type === 'none') return;
    
    setIsTransitioning(true);
    
    // Update children after transition starts
    setTimeout(() => {
      setDisplayChildren(children);
    }, duration / 2);
    
    // End transition
    setTimeout(() => {
      setIsTransitioning(false);
    }, duration);
  });

  const transitionClasses = {
    fade: {
      base: 'transition-opacity duration-300 ease-in-out',
      entering: 'opacity-0',
      entered: 'opacity-100'
    },
    slide: {
      base: 'transition-transform duration-300 ease-in-out',
      entering: 'transform translate-x-full',
      entered: 'transform translate-x-0'
    },
    scale: {
      base: 'transition-transform duration-300 ease-in-out',
      entering: 'transform scale-95 opacity-0',
      entered: 'transform scale-100 opacity-100'
    },
    none: {
      base: '',
      entering: '',
      entered: ''
    }
  };

  const transition = transitionClasses[type];

  return (
    <div
      className={cn(
        transition.base,
        isTransitioning ? transition.entering : transition.entered,
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {displayChildren}
    </div>
  );
}

// Route-specific transition wrapper
export function RouteTransition({
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <PageTransition
      type="fade"
      duration={200}
      className={cn('min-h-screen', className)}
    >
      {children}
    </PageTransition>
  );
}

// Loading transition for async content
interface LoadingTransitionProps {
  loading: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  delay?: number;
}

export function LoadingTransition({
  loading,
  children,
  fallback,
  className = '',
  delay = 200
}: LoadingTransitionProps) {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setShowFallback(true);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setShowFallback(false);
    }
  }, [loading, delay]);

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'transition-opacity duration-300',
          loading ? 'opacity-0' : 'opacity-100'
        )}
      >
        {children}
      </div>
      
      {showFallback && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          {fallback || <DefaultLoadingSpinner />}
        </div>
      )}
    </div>
  );
}

// Staggered animation for lists
interface StaggeredTransitionProps {
  children: React.ReactNode[];
  delay?: number;
  duration?: number;
  className?: string;
}

export function StaggeredTransition({
  children,
  delay = 100,
  duration = 300,
  className = ''
}: StaggeredTransitionProps) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    children.forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems(prev => new Set([...prev, index]));
      }, index * delay);
    });
  }, [children, delay]);

  return (
    <div className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={cn(
            'transition-all ease-out',
            visibleItems.has(index)
              ? 'opacity-100 transform translate-y-0'
              : 'opacity-0 transform translate-y-4'
          )}
          style={{ 
            transitionDuration: `${duration}ms`,
            transitionDelay: `${index * delay}ms`
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

// Slide-in transition for modals and sidebars
interface SlideTransitionProps {
  show: boolean;
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  className?: string;
}

export function SlideTransition({
  show,
  children,
  direction = 'right',
  className = ''
}: SlideTransitionProps) {
  const [shouldRender, setShouldRender] = useState(show);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!shouldRender) return null;

  const directionClasses = {
    left: {
      enter: 'transform -translate-x-full',
      enterActive: 'transform translate-x-0',
      exit: 'transform translate-x-0',
      exitActive: 'transform -translate-x-full'
    },
    right: {
      enter: 'transform translate-x-full',
      enterActive: 'transform translate-x-0',
      exit: 'transform translate-x-0',
      exitActive: 'transform translate-x-full'
    },
    up: {
      enter: 'transform -translate-y-full',
      enterActive: 'transform translate-y-0',
      exit: 'transform translate-y-0',
      exitActive: 'transform -translate-y-full'
    },
    down: {
      enter: 'transform translate-y-full',
      enterActive: 'transform translate-y-0',
      exit: 'transform translate-y-0',
      exitActive: 'transform translate-y-full'
    }
  };

  const classes = directionClasses[direction];

  return (
    <div
      className={cn(
        'transition-transform duration-300 ease-in-out',
        show ? classes.enterActive : classes.exitActive,
        className
      )}
    >
      {children}
    </div>
  );
}

// Fade transition for content changes
export function FadeTransition({
  show,
  children,
  className = ''
}: {
  show: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'transition-opacity duration-300 ease-in-out',
        show ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      {children}
    </div>
  );
}

// Default loading spinner
function DefaultLoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}

// Animated counter component
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  duration = 2000,
  className = ''
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector(`[data-counter="${value}"]`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [value]);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isInView, value, duration]);

  return (
    <span data-counter={value} className={className}>
      {count.toLocaleString()}
    </span>
  );
}

// Page enter animation hook
export function usePageEnterAnimation(delay: number = 0) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return isVisible;
}

// Intersection observer animation
export function useInViewAnimation(threshold: number = 0.1) {
  const [isInView, setIsInView] = useState(false);
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(ref);
        }
      },
      { threshold }
    );

    observer.observe(ref);

    return () => observer.disconnect();
  }, [ref, threshold]);

  return { isInView, ref: setRef };
}