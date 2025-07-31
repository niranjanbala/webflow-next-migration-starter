/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react';
import {
  WContainer,
  WRow,
  WCol,
  WButton,
  WHeading,
  WText,
  WInput,
  WCard,
  WebflowProvider
} from '../index';

describe('Webflow Components', () => {
  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <WebflowProvider>
        {component}
      </WebflowProvider>
    );
  };

  describe('WContainer', () => {
    it('renders children correctly', () => {
      renderWithProvider(
        <WContainer>
          <div>Test Content</div>
        </WContainer>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('applies correct CSS classes', () => {
      const { container } = renderWithProvider(
        <WContainer maxWidth="lg" padding={false}>
          <div>Test</div>
        </WContainer>
      );

      const containerElement = container.firstChild as HTMLElement;
      expect(containerElement).toHaveClass('w-container');
      expect(containerElement).toHaveClass('mx-auto');
      expect(containerElement).toHaveClass('max-w-screen-lg');
      expect(containerElement).not.toHaveClass('px-4');
    });

    it('supports custom className', () => {
      const { container } = renderWithProvider(
        <WContainer className="custom-class">
          <div>Test</div>
        </WContainer>
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('WRow', () => {
    it('renders with flex layout', () => {
      const { container } = renderWithProvider(
        <WRow>
          <div>Row Content</div>
        </WRow>
      );

      const rowElement = container.firstChild as HTMLElement;
      expect(rowElement).toHaveClass('w-row');
      expect(rowElement).toHaveClass('flex');
    });

    it('applies alignment and justification classes', () => {
      const { container } = renderWithProvider(
        <WRow align="center" justify="between">
          <div>Test</div>
        </WRow>
      );

      const rowElement = container.firstChild as HTMLElement;
      expect(rowElement).toHaveClass('items-center');
      expect(rowElement).toHaveClass('justify-between');
    });

    it('applies gap classes', () => {
      const { container } = renderWithProvider(
        <WRow gap={4}>
          <div>Test</div>
        </WRow>
      );

      const rowElement = container.firstChild as HTMLElement;
      expect(rowElement).toHaveClass('gap-4');
    });
  });

  describe('WCol', () => {
    it('renders with default flex classes', () => {
      const { container } = renderWithProvider(
        <WCol>
          <div>Column Content</div>
        </WCol>
      );

      const colElement = container.firstChild as HTMLElement;
      expect(colElement).toHaveClass('w-col');
      expect(colElement).toHaveClass('flex-1');
    });

    it('applies span classes', () => {
      const { container } = renderWithProvider(
        <WCol span={6}>
          <div>Test</div>
        </WCol>
      );

      const colElement = container.firstChild as HTMLElement;
      expect(colElement).toHaveClass('w-6/12');
    });

    it('applies responsive classes', () => {
      const { container } = renderWithProvider(
        <WCol md={8} lg={6}>
          <div>Test</div>
        </WCol>
      );

      const colElement = container.firstChild as HTMLElement;
      expect(colElement).toHaveClass('md:w-8/12');
      expect(colElement).toHaveClass('lg:w-6/12');
    });
  });

  describe('WButton', () => {
    it('renders button with correct text', () => {
      renderWithProvider(
        <WButton>Click Me</WButton>
      );

      expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument();
    });

    it('applies variant classes', () => {
      const { container } = renderWithProvider(
        <WButton variant="secondary">Test</WButton>
      );

      const button = container.querySelector('button');
      expect(button).toHaveClass('bg-neutral-500');
    });

    it('applies size classes', () => {
      const { container } = renderWithProvider(
        <WButton size="lg">Test</WButton>
      );

      const button = container.querySelector('button');
      expect(button).toHaveClass('px-6', 'py-3', 'text-base');
    });

    it('handles click events', () => {
      const handleClick = jest.fn();
      renderWithProvider(
        <WButton onClick={handleClick}>Click Me</WButton>
      );

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders as link when href is provided', () => {
      renderWithProvider(
        <WButton href="/test">Link Button</WButton>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/test');
    });

    it('shows loading state', () => {
      renderWithProvider(
        <WButton loading>Loading</WButton>
      );

      expect(screen.getByRole('button')).toHaveClass('pointer-events-none');
      expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument();
    });

    it('handles disabled state', () => {
      renderWithProvider(
        <WButton disabled>Disabled</WButton>
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('pointer-events-none');
    });
  });

  describe('WHeading', () => {
    it('renders correct heading level', () => {
      renderWithProvider(
        <WHeading level={2}>Test Heading</WHeading>
      );

      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    it('applies size classes', () => {
      const { container } = renderWithProvider(
        <WHeading level={1} size="3xl">Large Heading</WHeading>
      );

      const heading = container.querySelector('h1');
      expect(heading).toHaveClass('text-3xl');
    });

    it('applies weight and alignment classes', () => {
      const { container } = renderWithProvider(
        <WHeading level={1} weight="light" align="center">Centered Heading</WHeading>
      );

      const heading = container.querySelector('h1');
      expect(heading).toHaveClass('font-light', 'text-center');
    });
  });

  describe('WText', () => {
    it('renders paragraph with text', () => {
      renderWithProvider(
        <WText>Test paragraph</WText>
      );

      expect(screen.getByText('Test paragraph')).toBeInTheDocument();
    });

    it('applies size and weight classes', () => {
      const { container } = renderWithProvider(
        <WText size="lg" weight="bold">Bold text</WText>
      );

      const paragraph = container.querySelector('p');
      expect(paragraph).toHaveClass('text-lg', 'font-bold');
    });

    it('applies text decoration classes', () => {
      const { container } = renderWithProvider(
        <WText italic underline>Styled text</WText>
      );

      const paragraph = container.querySelector('p');
      expect(paragraph).toHaveClass('italic', 'underline');
    });
  });

  describe('WInput', () => {
    it('renders input with placeholder', () => {
      renderWithProvider(
        <WInput placeholder="Enter text" />
      );

      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('applies size classes', () => {
      const { container } = renderWithProvider(
        <WInput size="lg" />
      );

      const input = container.querySelector('input');
      expect(input).toHaveClass('px-4', 'py-3', 'text-base');
    });

    it('applies variant classes', () => {
      const { container } = renderWithProvider(
        <WInput variant="filled" />
      );

      const input = container.querySelector('input');
      expect(input).toHaveClass('bg-neutral-100');
    });

    it('shows error state', () => {
      const { container } = renderWithProvider(
        <WInput error helperText="Error message" />
      );

      const input = container.querySelector('input');
      expect(input).toHaveClass('border-error-500');
      expect(screen.getByText('Error message')).toHaveClass('text-error-600');
    });

    it('handles change events', () => {
      const handleChange = jest.fn();
      renderWithProvider(
        <WInput onChange={handleChange} />
      );

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test' } });
      expect(handleChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('WCard', () => {
    it('renders card with content', () => {
      renderWithProvider(
        <WCard>
          <div>Card Content</div>
        </WCard>
      );

      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('applies variant classes', () => {
      const { container } = renderWithProvider(
        <WCard variant="elevated">Test</WCard>
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('shadow-lg');
    });

    it('applies padding classes', () => {
      const { container } = renderWithProvider(
        <WCard padding="lg">Test</WCard>
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('p-8');
    });

    it('renders as button when clickable', () => {
      const handleClick = jest.fn();
      renderWithProvider(
        <WCard clickable onClick={handleClick}>Clickable Card</WCard>
      );

      const card = screen.getByRole('button');
      expect(card).toHaveClass('cursor-pointer');
      
      fireEvent.click(card);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies hover effects', () => {
      const { container } = renderWithProvider(
        <WCard hover>Hover Card</WCard>
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('hover:shadow-lg', 'hover:-translate-y-1');
    });
  });

  describe('WebflowProvider', () => {
    it('provides theme context to children', () => {
      const customTheme = {
        colors: {
          primary: { 500: '#ff0000' }
        }
      };

      render(
        <WebflowProvider theme={customTheme}>
          <WButton>Test</WButton>
        </WebflowProvider>
      );

      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });
});