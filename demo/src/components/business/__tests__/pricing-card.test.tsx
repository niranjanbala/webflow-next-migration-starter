/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import PricingCard from '../pricing-card';

// Mock Next.js Link
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

describe('PricingCard Component', () => {
  const mockProps = {
    title: 'Pro Plan',
    description: 'Perfect for growing businesses',
    price: {
      amount: 99,
      currency: '$',
      period: 'month'
    },
    features: [
      { name: 'Feature 1', included: true },
      { name: 'Feature 2', included: true },
      { name: 'Feature 3', included: false }
    ],
    ctaText: 'Get Started',
    ctaHref: '/signup'
  };

  it('renders pricing card correctly', () => {
    render(<PricingCard {...mockProps} />);
    
    expect(screen.getByText('Pro Plan')).toBeInTheDocument();
    expect(screen.getByText('Perfect for growing businesses')).toBeInTheDocument();
    expect(screen.getByText('$99')).toBeInTheDocument();
    expect(screen.getByText('/month')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('renders features with correct icons', () => {
    render(<PricingCard {...mockProps} />);
    
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Feature 2')).toBeInTheDocument();
    expect(screen.getByText('Feature 3')).toBeInTheDocument();
    
    // Check for checkmark and X icons (by counting SVG elements)
    const svgs = document.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('shows popular badge when popular is true', () => {
    render(<PricingCard {...mockProps} popular />);
    
    expect(screen.getByText('Most Popular')).toBeInTheDocument();
  });

  it('does not show popular badge when popular is false', () => {
    render(<PricingCard {...mockProps} popular={false} />);
    
    expect(screen.queryByText('Most Popular')).not.toBeInTheDocument();
  });

  it('renders CTA link with correct href', () => {
    render(<PricingCard {...mockProps} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/signup');
  });

  it('applies popular styling when popular is true', () => {
    const { container } = render(<PricingCard {...mockProps} popular />);
    
    const card = container.querySelector('.ring-2.ring-orange-500');
    expect(card).toBeInTheDocument();
  });
});