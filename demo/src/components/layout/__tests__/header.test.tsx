/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../header';

// Mock Next.js components
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

jest.mock('next/image', () => {
  return function MockImage({ alt, ...props }: { alt: string; [key: string]: unknown }) {
    return <img alt={alt} {...props} />;
  };
});

describe('Header', () => {
  it('renders the logo and navigation', () => {
    render(<Header />);
    
    expect(screen.getByText('Numeral')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('toggles mobile menu when hamburger button is clicked', () => {
    render(<Header />);
    
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
    
    // Mobile menu should not be visible initially (check for mobile-specific content)
    expect(screen.queryByText('Get Started')).toBeInTheDocument(); // Desktop CTA
    
    // Click to open mobile menu
    fireEvent.click(mobileMenuButton);
    
    // Mobile menu should now be visible (there will be multiple "Get Started" buttons now)
    const getStartedButtons = screen.getAllByText('Get Started');
    expect(getStartedButtons.length).toBeGreaterThan(1);
  });

  it('has correct navigation links', () => {
    render(<Header />);
    
    const homeLink = screen.getByRole('link', { name: /home/i });
    const aboutLink = screen.getByRole('link', { name: /about/i });
    
    expect(homeLink).toHaveAttribute('href', '/');
    expect(aboutLink).toHaveAttribute('href', '/about');
  });
});