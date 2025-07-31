/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../card';

describe('Card Components', () => {
  describe('Card', () => {
    it('renders children correctly', () => {
      render(
        <Card>
          <div>Card content</div>
        </Card>
      );
      
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('applies variant classes correctly', () => {
      const { container } = render(
        <Card variant="elevated">
          Content
        </Card>
      );
      
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('shadow-lg');
    });

    it('applies padding classes correctly', () => {
      const { container } = render(
        <Card padding="lg">
          Content
        </Card>
      );
      
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('p-8');
    });

    it('applies hover effect when enabled', () => {
      const { container } = render(
        <Card hover>
          Content
        </Card>
      );
      
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('hover:shadow-lg');
    });
  });

  describe('CardHeader', () => {
    it('renders children correctly', () => {
      render(
        <CardHeader>
          <div>Header content</div>
        </CardHeader>
      );
      
      expect(screen.getByText('Header content')).toBeInTheDocument();
    });
  });

  describe('CardTitle', () => {
    it('renders title correctly', () => {
      render(<CardTitle>Test Title</CardTitle>);
      
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    });
  });

  describe('CardDescription', () => {
    it('renders description correctly', () => {
      render(<CardDescription>Test description</CardDescription>);
      
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });
  });

  describe('CardContent', () => {
    it('renders content correctly', () => {
      render(
        <CardContent>
          <p>Card content</p>
        </CardContent>
      );
      
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });
  });

  describe('CardFooter', () => {
    it('renders footer correctly', () => {
      render(
        <CardFooter>
          <button>Action</button>
        </CardFooter>
      );
      
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    });
  });
});