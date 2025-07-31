/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../input';

describe('Input Component', () => {
  it('renders input correctly', () => {
    render(<Input placeholder="Test input" />);
    
    expect(screen.getByPlaceholderText('Test input')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Input label="Email" placeholder="Enter email" />);
    
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders helper text', () => {
    render(<Input helperText="This is helper text" />);
    
    expect(screen.getByText('This is helper text')).toBeInTheDocument();
  });

  it('shows error state', () => {
    render(<Input error="Error message" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-500');
    expect(screen.getByText('Error message')).toHaveClass('text-red-600');
  });

  it('applies size classes correctly', () => {
    render(<Input size="lg" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('px-5');
  });

  it('applies variant classes correctly', () => {
    render(<Input variant="filled" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('bg-gray-100');
  });

  it('handles value changes', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('can be disabled', () => {
    render(<Input disabled />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });
});