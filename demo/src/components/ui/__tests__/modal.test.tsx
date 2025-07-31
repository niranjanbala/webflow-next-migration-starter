/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react';
import Modal, { ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../modal';

// Mock createPortal
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node: React.ReactNode) => node,
}));

describe('Modal Components', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  describe('Modal', () => {
    it('renders when open', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Modal content</div>
        </Modal>
      );
      
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
      render(
        <Modal isOpen={false} onClose={mockOnClose}>
          <div>Modal content</div>
        </Modal>
      );
      
      expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
    });

    it('calls onClose when overlay is clicked', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Modal content</div>
        </Modal>
      );
      
      const overlay = document.querySelector('.bg-black.bg-opacity-50');
      fireEvent.click(overlay!);
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('does not close when overlay click is disabled', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} closeOnOverlayClick={false}>
          <div>Modal content</div>
        </Modal>
      );
      
      const overlay = document.querySelector('.bg-black.bg-opacity-50');
      fireEvent.click(overlay!);
      
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('applies size classes correctly', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} size="lg">
          <div>Modal content</div>
        </Modal>
      );
      
      const modal = document.querySelector('.max-w-2xl');
      expect(modal).toBeInTheDocument();
    });
  });

  describe('ModalHeader', () => {
    it('renders header with close button', () => {
      render(
        <ModalHeader onClose={mockOnClose}>
          <div>Header content</div>
        </ModalHeader>
      );
      
      expect(screen.getByText('Header content')).toBeInTheDocument();
      expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
      render(
        <ModalHeader onClose={mockOnClose}>
          <div>Header content</div>
        </ModalHeader>
      );
      
      const closeButton = screen.getByLabelText('Close modal');
      fireEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('ModalTitle', () => {
    it('renders title correctly', () => {
      render(<ModalTitle>Test Title</ModalTitle>);
      
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });
  });

  describe('ModalContent', () => {
    it('renders content correctly', () => {
      render(
        <ModalContent>
          <p>Modal content</p>
        </ModalContent>
      );
      
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });
  });

  describe('ModalFooter', () => {
    it('renders footer correctly', () => {
      render(
        <ModalFooter>
          <button>Cancel</button>
          <button>Save</button>
        </ModalFooter>
      );
      
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });
  });
});