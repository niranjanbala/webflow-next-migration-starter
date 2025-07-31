/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { usePrefetchNavigation, useNavigation } from '@/lib/navigation';
import NavigationMenu, { BreadcrumbNavigation, FooterNavigation } from '../navigation-menu';

// Mock the navigation hooks
jest.mock('@/lib/navigation', () => ({
  usePrefetchNavigation: jest.fn(),
  useNavigation: jest.fn(),
  MAIN_NAVIGATION: [
    {
      label: 'Home',
      href: '/',
      prefetch: true
    },
    {
      label: 'Products',
      href: '/products',
      prefetch: true,
      children: [
        { label: 'Tax Automation', href: '/products/tax-automation', prefetch: true },
        { label: 'Compliance', href: '/products/compliance', prefetch: true }
      ]
    },
    {
      label: 'About',
      href: '/about',
      prefetch: true
    }
  ]
}));

const mockUsePrefetchNavigation = usePrefetchNavigation as jest.MockedFunction<typeof usePrefetchNavigation>;
const mockUseNavigation = useNavigation as jest.MockedFunction<typeof useNavigation>;

describe('NavigationMenu Components', () => {
  const mockBreadcrumbs = jest.fn();

  beforeEach(() => {
    mockUsePrefetchNavigation.mockImplementation(() => {});
    mockUseNavigation.mockReturnValue({
      isActive: jest.fn().mockReturnValue(false),
      prefetch: jest.fn(),
      navigate: jest.fn(),
      breadcrumbs: mockBreadcrumbs,
      isNavigating: false,
      pathname: '/test-path',
      router: {}
    });
    jest.clearAllMocks();
  });

  describe('NavigationMenu - Desktop', () => {
    it('renders desktop navigation by default', () => {
      render(<NavigationMenu />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
    });

    it('shows dropdown on hover for items with children', async () => {
      render(<NavigationMenu />);

      const productsButton = screen.getByText('Products');
      fireEvent.mouseEnter(productsButton.parentElement!);

      await waitFor(() => {
        expect(screen.getByText('Tax Automation')).toBeInTheDocument();
        expect(screen.getByText('Compliance')).toBeInTheDocument();
      });
    });

    it('hides dropdown on mouse leave', async () => {
      render(<NavigationMenu />);

      const productsButton = screen.getByText('Products');
      const productsContainer = productsButton.parentElement!;
      
      fireEvent.mouseEnter(productsContainer);
      
      await waitFor(() => {
        expect(screen.getByText('Tax Automation')).toBeInTheDocument();
      });

      fireEvent.mouseLeave(productsContainer);

      await waitFor(() => {
        expect(screen.queryByText('Tax Automation')).not.toBeInTheDocument();
      }, { timeout: 200 });
    });

    it('closes dropdown on escape key', async () => {
      render(<NavigationMenu />);

      const productsButton = screen.getByText('Products');
      const productsContainer = productsButton.parentElement!;
      
      fireEvent.mouseEnter(productsContainer);
      
      await waitFor(() => {
        expect(screen.getByText('Tax Automation')).toBeInTheDocument();
      });

      fireEvent.keyDown(productsContainer, { key: 'Escape' });

      await waitFor(() => {
        expect(screen.queryByText('Tax Automation')).not.toBeInTheDocument();
      });
    });

    it('calls onItemClick when dropdown item is clicked', async () => {
      const handleItemClick = jest.fn();
      render(<NavigationMenu onItemClick={handleItemClick} />);

      const productsButton = screen.getByText('Products');
      fireEvent.mouseEnter(productsButton.parentElement!);

      await waitFor(() => {
        expect(screen.getByText('Tax Automation')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Tax Automation'));
      expect(handleItemClick).toHaveBeenCalled();
    });
  });

  describe('NavigationMenu - Mobile', () => {
    it('renders mobile navigation when mobile prop is true', () => {
      render(<NavigationMenu mobile />);

      const homeLink = screen.getByText('Home');
      expect(homeLink.closest('a')).toHaveClass('block', 'px-4', 'py-3');
    });

    it('toggles expanded state for items with children', () => {
      render(<NavigationMenu mobile />);

      const productsButton = screen.getByText('Products');
      expect(screen.queryByText('Tax Automation')).not.toBeInTheDocument();

      fireEvent.click(productsButton);
      expect(screen.getByText('Tax Automation')).toBeInTheDocument();

      fireEvent.click(productsButton);
      expect(screen.queryByText('Tax Automation')).not.toBeInTheDocument();
    });

    it('shows correct aria-expanded state', () => {
      render(<NavigationMenu mobile />);

      const productsButton = screen.getByText('Products');
      expect(productsButton).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(productsButton);
      expect(productsButton).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('BreadcrumbNavigation', () => {
    it('renders breadcrumbs correctly', () => {
      mockBreadcrumbs.mockReturnValue([
        { label: 'Home', href: '/', current: false },
        { label: 'Products', href: '/products', current: false },
        { label: 'Tax Automation', href: '/products/tax-automation', current: true }
      ]);

      render(<BreadcrumbNavigation />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Tax Automation')).toBeInTheDocument();
    });

    it('does not render when only one breadcrumb', () => {
      mockBreadcrumbs.mockReturnValue([
        { label: 'Home', href: '/', current: true }
      ]);

      const { container } = render(<BreadcrumbNavigation />);
      expect(container.firstChild).toBeNull();
    });

    it('renders custom separator', () => {
      mockBreadcrumbs.mockReturnValue([
        { label: 'Home', href: '/', current: false },
        { label: 'Products', href: '/products', current: true }
      ]);

      render(<BreadcrumbNavigation separator=">" />);
      expect(screen.getByText('>')).toBeInTheDocument();
    });

    it('applies custom labels', () => {
      mockBreadcrumbs.mockReturnValue([
        { label: 'Custom Home', href: '/', current: false },
        { label: 'Custom Products', href: '/products', current: true }
      ]);

      render(<BreadcrumbNavigation customLabels={{ home: 'Custom Home', products: 'Custom Products' }} />);
      expect(screen.getByText('Custom Home')).toBeInTheDocument();
      expect(screen.getByText('Custom Products')).toBeInTheDocument();
    });
  });

  describe('FooterNavigation', () => {
    const footerNavigation = [
      {
        label: 'Products',
        href: '/products',
        children: [
          { label: 'Tax Automation', href: '/products/tax-automation' },
          { label: 'Compliance', href: '/products/compliance' }
        ]
      },
      {
        label: 'Company',
        href: '/company',
        children: [
          { label: 'About', href: '/about' },
          { label: 'Careers', href: '/careers' }
        ]
      }
    ];

    it('renders footer navigation sections', () => {
      render(<FooterNavigation navigation={footerNavigation} />);

      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Company')).toBeInTheDocument();
      expect(screen.getByText('Tax Automation')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
    });

    it('applies grid layout classes', () => {
      const { container } = render(<FooterNavigation navigation={footerNavigation} />);
      const gridContainer = container.firstChild;
      expect(gridContainer).toHaveClass('grid', 'grid-cols-2', 'md:grid-cols-4', 'gap-8');
    });

    it('renders section headers correctly', () => {
      render(<FooterNavigation navigation={footerNavigation} />);

      const productsHeader = screen.getByText('Products');
      expect(productsHeader.tagName).toBe('H3');
      expect(productsHeader).toHaveClass('text-sm', 'font-semibold', 'text-gray-900');
    });
  });
});