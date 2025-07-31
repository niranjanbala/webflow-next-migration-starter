/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useNavigation } from '@/lib/navigation';
import NavLink, { MobileNavLink, BreadcrumbLink, NavButton } from '../nav-link';

// Mock the navigation hook
jest.mock('@/lib/navigation', () => ({
  useNavigation: jest.fn()
}));

const mockUseNavigation = useNavigation as jest.MockedFunction<typeof useNavigation>;

describe('NavLink Components', () => {
  const mockPrefetch = jest.fn();
  const mockIsActive = jest.fn();

  beforeEach(() => {
    mockUseNavigation.mockReturnValue({
      isActive: mockIsActive,
      prefetch: mockPrefetch,
      navigate: jest.fn(),
      breadcrumbs: jest.fn(),
      isNavigating: false,
      pathname: '/test-path',
      router: {}
    });
    jest.clearAllMocks();
  });

  describe('NavLink', () => {
    it('renders internal link correctly', () => {
      mockIsActive.mockReturnValue(false);
      
      render(
        <NavLink href="/test">
          Test Link
        </NavLink>
      );

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
      expect(link).toHaveTextContent('Test Link');
    });

    it('renders external link correctly', () => {
      mockIsActive.mockReturnValue(false);
      
      render(
        <NavLink href="https://example.com" external>
          External Link
        </NavLink>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://example.com');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('applies active className when link is active', () => {
      mockIsActive.mockReturnValue(true);
      
      render(
        <NavLink href="/test" activeClassName="active-link">
          Test Link
        </NavLink>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveClass('active-link');
    });

    it('prefetches on hover for internal links', async () => {
      mockIsActive.mockReturnValue(false);
      
      render(
        <NavLink href="/test">
          Test Link
        </NavLink>
      );

      const link = screen.getByRole('link');
      fireEvent.mouseEnter(link);

      await waitFor(() => {
        expect(mockPrefetch).toHaveBeenCalledWith('/test');
      });
    });

    it('does not prefetch external links', () => {
      mockIsActive.mockReturnValue(false);
      
      render(
        <NavLink href="https://example.com" external>
          External Link
        </NavLink>
      );

      const link = screen.getByRole('link');
      fireEvent.mouseEnter(link);

      expect(mockPrefetch).not.toHaveBeenCalled();
    });

    it('calls onClick handler when clicked', () => {
      const handleClick = jest.fn();
      mockIsActive.mockReturnValue(false);
      
      render(
        <NavLink href="/test" onClick={handleClick}>
          Test Link
        </NavLink>
      );

      const link = screen.getByRole('link');
      fireEvent.click(link);

      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('MobileNavLink', () => {
    it('renders with mobile-specific styling', () => {
      mockIsActive.mockReturnValue(false);
      
      render(
        <MobileNavLink href="/test">
          Mobile Link
        </MobileNavLink>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveClass('block', 'px-4', 'py-3');
    });

    it('applies active styling for mobile', () => {
      mockIsActive.mockReturnValue(true);
      
      render(
        <MobileNavLink href="/test">
          Mobile Link
        </MobileNavLink>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveClass('text-blue-600', 'bg-blue-50');
    });
  });

  describe('BreadcrumbLink', () => {
    it('renders as link when not current', () => {
      mockIsActive.mockReturnValue(false);
      
      render(
        <BreadcrumbLink href="/test">
          Breadcrumb
        </BreadcrumbLink>
      );

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
    });

    it('renders as span when current', () => {
      render(
        <BreadcrumbLink href="/test" current>
          Current Page
        </BreadcrumbLink>
      );

      const span = screen.getByText('Current Page');
      expect(span.tagName).toBe('SPAN');
      expect(span).toHaveClass('text-gray-900', 'font-medium');
    });
  });

  describe('NavButton', () => {
    it('renders with primary variant styling', () => {
      mockIsActive.mockReturnValue(false);
      
      render(
        <NavButton href="/test" variant="primary">
          Button Link
        </NavButton>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveClass('bg-blue-600', 'text-white');
    });

    it('renders with secondary variant styling', () => {
      mockIsActive.mockReturnValue(false);
      
      render(
        <NavButton href="/test" variant="secondary">
          Button Link
        </NavButton>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveClass('bg-gray-600', 'text-white');
    });

    it('renders with outline variant styling', () => {
      mockIsActive.mockReturnValue(false);
      
      render(
        <NavButton href="/test" variant="outline">
          Button Link
        </NavButton>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveClass('border', 'border-blue-600', 'text-blue-600');
    });

    it('applies different sizes correctly', () => {
      mockIsActive.mockReturnValue(false);
      
      const { rerender } = render(
        <NavButton href="/test" size="sm">
          Small Button
        </NavButton>
      );

      let link = screen.getByRole('link');
      expect(link).toHaveClass('px-3', 'py-1.5', 'text-sm');

      rerender(
        <NavButton href="/test" size="lg">
          Large Button
        </NavButton>
      );

      link = screen.getByRole('link');
      expect(link).toHaveClass('px-6', 'py-3', 'text-base');
    });
  });
});