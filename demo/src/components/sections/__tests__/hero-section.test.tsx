/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import HeroSection from '../hero-section';

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

describe('HeroSection', () => {
  const defaultProps = {
    title: 'Test Title',
    description: 'Test Description',
  };

  it('renders title and description', () => {
    render(<HeroSection {...defaultProps} />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders CTA button with correct href', () => {
    render(
      <HeroSection 
        {...defaultProps} 
        ctaText="Custom CTA" 
        ctaHref="/custom-link" 
      />
    );
    
    const ctaButton = screen.getByRole('link', { name: 'Custom CTA' });
    expect(ctaButton).toHaveAttribute('href', '/custom-link');
  });

  it('renders email input field', () => {
    render(<HeroSection {...defaultProps} />);
    
    const emailInput = screen.getByPlaceholderText('Enter your work email');
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('renders image when imageSrc is provided', () => {
    render(
      <HeroSection 
        {...defaultProps} 
        imageSrc="/test-image.jpg" 
        imageAlt="Test Image" 
      />
    );
    
    const image = screen.getByAltText('Test Image');
    expect(image).toBeInTheDocument();
  });

  it('renders badges when provided', () => {
    const badges = [
      { src: '/badge1.png', alt: 'Badge 1', text: 'Badge Text' },
      { src: '/badge2.png', alt: 'Badge 2' }
    ];

    render(<HeroSection {...defaultProps} badges={badges} />);
    
    expect(screen.getByText('Badge Text')).toBeInTheDocument();
    expect(screen.getByAltText('Badge 1')).toBeInTheDocument();
    expect(screen.getByAltText('Badge 2')).toBeInTheDocument();
  });
});