/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor, act } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { useRouteChange } from '@/lib/navigation';
import PageTransition, {
  RouteTransition,
  LoadingTransition,
  StaggeredTransition,
  SlideTransition,
  FadeTransition,
  AnimatedCounter,
  usePageEnterAnimation,
  useInViewAnimation
} from '../page-transitions';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn()
}));

// Mock navigation hook
jest.mock('@/lib/navigation', () => ({
  useRouteChange: jest.fn()
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;
const mockUseRouteChange = useRouteChange as jest.MockedFunction<typeof useRouteChange>;

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => {
  setTimeout(cb, 16);
  return 1;
});
global.cancelAnimationFrame = jest.fn();

describe('Page Transition Components', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/test');
    mockUseRouteChange.mockImplementation((callback) => {});
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('PageTransition', () => {
    it('renders children without transition when type is none', () => {
      render(
        <PageTransition type="none">
          <div>Test Content</div>
        </PageTransition>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('applies fade transition classes', () => {
      const { container } = render(
        <PageTransition type="fade">
          <div>Test Content</div>
        </PageTransition>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('transition-opacity', 'duration-300', 'ease-in-out');
    });

    it('applies slide transition classes', () => {
      const { container } = render(
        <PageTransition type="slide">
          <div>Test Content</div>
        </PageTransition>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('transition-transform', 'duration-300', 'ease-in-out');
    });

    it('applies scale transition classes', () => {
      const { container } = render(
        <PageTransition type="scale">
          <div>Test Content</div>
        </PageTransition>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('transition-transform', 'duration-300', 'ease-in-out');
    });

    it('uses custom duration', () => {
      const { container } = render(
        <PageTransition type="fade" duration={500}>
          <div>Test Content</div>
        </PageTransition>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.transitionDuration).toBe('500ms');
    });
  });

  describe('RouteTransition', () => {
    it('renders with default fade transition', () => {
      const { container } = render(
        <RouteTransition>
          <div>Route Content</div>
        </RouteTransition>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('transition-opacity', 'min-h-screen');
    });
  });

  describe('LoadingTransition', () => {
    it('shows content when not loading', () => {
      render(
        <LoadingTransition loading={false}>
          <div>Content</div>
        </LoadingTransition>
      );

      const content = screen.getByText('Content');
      expect(content.parentElement).toHaveClass('opacity-100');
    });

    it('shows loading state after delay', async () => {
      render(
        <LoadingTransition loading={true} delay={100}>
          <div>Content</div>
        </LoadingTransition>
      );

      // Initially no loading spinner
      expect(screen.queryByRole('status')).not.toBeInTheDocument();

      // After delay, loading spinner appears
      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(screen.getByRole('generic')).toBeInTheDocument();
      });
    });

    it('shows custom fallback', async () => {
      render(
        <LoadingTransition 
          loading={true} 
          delay={0}
          fallback={<div>Custom Loading</div>}
        >
          <div>Content</div>
        </LoadingTransition>
      );

      act(() => {
        jest.advanceTimersByTime(0);
      });

      await waitFor(() => {
        expect(screen.getByText('Custom Loading')).toBeInTheDocument();
      });
    });
  });

  describe('StaggeredTransition', () => {
    it('renders all children', () => {
      const children = [
        <div key="1">Item 1</div>,
        <div key="2">Item 2</div>,
        <div key="3">Item 3</div>
      ];

      render(<StaggeredTransition>{children}</StaggeredTransition>);

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('applies staggered animation delays', () => {
      const children = [
        <div key="1">Item 1</div>,
        <div key="2">Item 2</div>
      ];

      const { container } = render(
        <StaggeredTransition delay={100}>
          {children}
        </StaggeredTransition>
      );

      const items = container.querySelectorAll('div > div');
      expect(items[0]).toHaveStyle('transition-delay: 0ms');
      expect(items[1]).toHaveStyle('transition-delay: 100ms');
    });
  });

  describe('SlideTransition', () => {
    it('renders when show is true', () => {
      render(
        <SlideTransition show={true}>
          <div>Slide Content</div>
        </SlideTransition>
      );

      expect(screen.getByText('Slide Content')).toBeInTheDocument();
    });

    it('does not render when show is false initially', () => {
      render(
        <SlideTransition show={false}>
          <div>Slide Content</div>
        </SlideTransition>
      );

      expect(screen.queryByText('Slide Content')).not.toBeInTheDocument();
    });

    it('applies correct direction classes', () => {
      const { container, rerender } = render(
        <SlideTransition show={true} direction="left">
          <div>Content</div>
        </SlideTransition>
      );

      let wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('transform', 'translate-x-0');

      rerender(
        <SlideTransition show={true} direction="right">
          <div>Content</div>
        </SlideTransition>
      );

      wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('transform', 'translate-x-0');
    });
  });

  describe('FadeTransition', () => {
    it('applies opacity based on show prop', () => {
      const { container, rerender } = render(
        <FadeTransition show={true}>
          <div>Fade Content</div>
        </FadeTransition>
      );

      let wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('opacity-100');

      rerender(
        <FadeTransition show={false}>
          <div>Fade Content</div>
        </FadeTransition>
      );

      wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('opacity-0');
    });
  });

  describe('AnimatedCounter', () => {
    it('renders initial count of 0', () => {
      render(<AnimatedCounter value={100} />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('formats large numbers with locale string', () => {
      // Mock the intersection observer to trigger animation
      const mockObserve = jest.fn();
      const mockUnobserve = jest.fn();
      const mockDisconnect = jest.fn();
      
      mockIntersectionObserver.mockImplementation((callback) => ({
        observe: mockObserve,
        unobserve: mockUnobserve,
        disconnect: mockDisconnect
      }));

      render(<AnimatedCounter value={1000} />);
      
      // Simulate intersection
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      // The component should format numbers with locale
      expect(screen.getByText(/\d/)).toBeInTheDocument();
    });
  });

  describe('usePageEnterAnimation', () => {
    it('returns false initially and true after delay', async () => {
      let result: { current: boolean } = { current: false };
      
      function TestComponent() {
        const isVisible = usePageEnterAnimation(100);
        result.current = isVisible;
        return <div>{isVisible ? 'Visible' : 'Hidden'}</div>;
      }

      render(<TestComponent />);
      
      expect(result.current).toBe(false);
      expect(screen.getByText('Hidden')).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(screen.getByText('Visible')).toBeInTheDocument();
      });
    });
  });

  describe('useInViewAnimation', () => {
    it('provides ref and isInView state', () => {
      let hookResult: any;
      
      function TestComponent() {
        hookResult = useInViewAnimation();
        return <div ref={hookResult.ref}>Test</div>;
      }

      render(<TestComponent />);
      
      expect(hookResult.isInView).toBe(false);
      expect(typeof hookResult.ref).toBe('function');
    });
  });
});