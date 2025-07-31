/**
 * @jest-environment jsdom
 */

import {
  FocusManager,
  ScreenReaderAnnouncer,
  KeyboardNavigation,
  ColorContrast,
  AltTextGenerator,
  AriaUtils
} from '../accessibility';

// Mock DOM methods
Object.defineProperty(HTMLElement.prototype, 'focus', {
  value: jest.fn(),
  writable: true
});

Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
  value: jest.fn(),
  writable: true
});

describe('Accessibility Utilities', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('FocusManager', () => {
    it('has focus management methods', () => {
      expect(typeof FocusManager.saveFocus).toBe('function');
      expect(typeof FocusManager.restoreFocus).toBe('function');
      expect(typeof FocusManager.getFocusableElements).toBe('function');
      expect(typeof FocusManager.moveFocusToElement).toBe('function');
    });

    it('moves focus to element with scroll', () => {
      const element = document.createElement('button');
      document.body.appendChild(element);

      FocusManager.moveFocusToElement(element);

      expect(element.focus).toHaveBeenCalled();
      expect(element.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'center'
      });
    });
  });

  describe('ScreenReaderAnnouncer', () => {
    it('has announcement methods', () => {
      expect(typeof ScreenReaderAnnouncer.initialize).toBe('function');
      expect(typeof ScreenReaderAnnouncer.announce).toBe('function');
      expect(typeof ScreenReaderAnnouncer.announcePageChange).toBe('function');
      expect(typeof ScreenReaderAnnouncer.announceError).toBe('function');
      expect(typeof ScreenReaderAnnouncer.announceSuccess).toBe('function');
    });

    it('can be initialized without errors', () => {
      expect(() => ScreenReaderAnnouncer.initialize()).not.toThrow();
    });

    it('can announce messages without errors', () => {
      expect(() => ScreenReaderAnnouncer.announce('Test message')).not.toThrow();
      expect(() => ScreenReaderAnnouncer.announcePageChange('Home')).not.toThrow();
      expect(() => ScreenReaderAnnouncer.announceError('Error')).not.toThrow();
      expect(() => ScreenReaderAnnouncer.announceSuccess('Success')).not.toThrow();
    });
  });

  describe('KeyboardNavigation', () => {
    it('identifies activation keys correctly', () => {
      expect(KeyboardNavigation.isActivationKey('Enter')).toBe(true);
      expect(KeyboardNavigation.isActivationKey(' ')).toBe(true);
      expect(KeyboardNavigation.isActivationKey('Tab')).toBe(false);
    });

    it('identifies arrow keys correctly', () => {
      expect(KeyboardNavigation.isArrowKey('ArrowUp')).toBe(true);
      expect(KeyboardNavigation.isArrowKey('ArrowDown')).toBe(true);
      expect(KeyboardNavigation.isArrowKey('ArrowLeft')).toBe(true);
      expect(KeyboardNavigation.isArrowKey('ArrowRight')).toBe(true);
      expect(KeyboardNavigation.isArrowKey('Enter')).toBe(false);
    });

    it('handles menu navigation correctly', () => {
      const items = [
        document.createElement('button'),
        document.createElement('button'),
        document.createElement('button')
      ];
      
      items.forEach(item => document.body.appendChild(item));

      const mockEvent = {
        key: 'ArrowDown',
        preventDefault: jest.fn()
      } as unknown as KeyboardEvent;

      const newIndex = KeyboardNavigation.handleMenuNavigation(
        mockEvent,
        items,
        0
      );

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(newIndex).toBe(1);
      expect(items[1].focus).toHaveBeenCalled();
    });
  });

  describe('ColorContrast', () => {
    it('calculates luminance correctly', () => {
      const whiteLuminance = ColorContrast.calculateLuminance(255, 255, 255);
      const blackLuminance = ColorContrast.calculateLuminance(0, 0, 0);
      
      expect(whiteLuminance).toBeCloseTo(1, 2);
      expect(blackLuminance).toBeCloseTo(0, 2);
    });

    it('calculates contrast ratio correctly', () => {
      const whiteRgb: [number, number, number] = [255, 255, 255];
      const blackRgb: [number, number, number] = [0, 0, 0];
      
      const contrastRatio = ColorContrast.calculateContrastRatio(whiteRgb, blackRgb);
      expect(contrastRatio).toBeCloseTo(21, 0); // Maximum contrast ratio
    });

    it('checks WCAG AA compliance correctly', () => {
      expect(ColorContrast.meetsWCAGAA(4.5, 16)).toBe(true);
      expect(ColorContrast.meetsWCAGAA(3.0, 16)).toBe(false);
      expect(ColorContrast.meetsWCAGAA(3.0, 18)).toBe(true); // Large text
    });

    it('checks WCAG AAA compliance correctly', () => {
      expect(ColorContrast.meetsWCAGAAA(7.0, 16)).toBe(true);
      expect(ColorContrast.meetsWCAGAAA(4.5, 16)).toBe(false);
      expect(ColorContrast.meetsWCAGAAA(4.5, 18)).toBe(true); // Large text
    });

    it('converts hex to RGB correctly', () => {
      expect(ColorContrast.hexToRgb('#ffffff')).toEqual([255, 255, 255]);
      expect(ColorContrast.hexToRgb('#000000')).toEqual([0, 0, 0]);
      expect(ColorContrast.hexToRgb('#ff0000')).toEqual([255, 0, 0]);
      expect(ColorContrast.hexToRgb('invalid')).toBeNull();
    });
  });

  describe('AltTextGenerator', () => {
    it('generates alt text from filename', () => {
      const altText = AltTextGenerator.generateImageAlt('/images/company-logo.png');
      expect(altText).toBe('Company Logo logo'); // The function detects 'logo' in filename
    });

    it('generates alt text with context', () => {
      const altText = AltTextGenerator.generateImageAlt('/images/hero-image.jpg', 'Homepage banner');
      expect(altText).toBe('Hero Image - Homepage banner');
    });

    it('identifies logo images', () => {
      const altText = AltTextGenerator.generateImageAlt('/images/brand-logo.svg');
      expect(altText).toBe('Brand Logo logo');
    });

    it('identifies icon images', () => {
      const altText = AltTextGenerator.generateImageAlt('/icons/user-icon.png');
      expect(altText).toBe('User Icon icon');
    });

    it('validates alt text correctly', () => {
      const validation1 = AltTextGenerator.validateAltText('');
      expect(validation1.isValid).toBe(false);
      expect(validation1.issues).toContain('Alt text is empty');

      const validation2 = AltTextGenerator.validateAltText('A very long alt text that exceeds the recommended 125 character limit and should be flagged as too long for accessibility purposes');
      expect(validation2.isValid).toBe(false);
      expect(validation2.issues).toContain('Alt text is too long (over 125 characters)');

      const validation3 = AltTextGenerator.validateAltText('Image of a cat');
      expect(validation3.isValid).toBe(false);
      expect(validation3.issues).toContain('Alt text contains redundant phrases');

      const validation4 = AltTextGenerator.validateAltText('A cat sitting on a windowsill');
      expect(validation4.isValid).toBe(true);
      expect(validation4.issues).toHaveLength(0);
    });
  });

  describe('AriaUtils', () => {
    it('generates unique IDs', () => {
      const id1 = AriaUtils.generateId();
      const id2 = AriaUtils.generateId();
      
      expect(id1).toMatch(/^a11y-/);
      expect(id2).toMatch(/^a11y-/);
      expect(id1).not.toBe(id2);
    });

    it('generates IDs with custom prefix', () => {
      const id = AriaUtils.generateId('custom');
      expect(id).toMatch(/^custom-/);
    });

    it('sets ARIA attributes correctly', () => {
      const element = document.createElement('div');
      
      AriaUtils.setAriaExpanded(element, true);
      expect(element.getAttribute('aria-expanded')).toBe('true');

      AriaUtils.setAriaSelected(element, false);
      expect(element.getAttribute('aria-selected')).toBe('false');

      AriaUtils.setAriaChecked(element, 'mixed');
      expect(element.getAttribute('aria-checked')).toBe('mixed');

      AriaUtils.setAriaDisabled(element, true);
      expect(element.getAttribute('aria-disabled')).toBe('true');

      AriaUtils.setAriaHidden(element, false);
      expect(element.getAttribute('aria-hidden')).toBe('false');
    });

    it('associates elements correctly', () => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      
      AriaUtils.associateElements(label, input);
      
      expect(input.id).toBeTruthy();
      expect(label.getAttribute('aria-labelledby')).toBe(input.id);
    });

    it('describes elements correctly', () => {
      const description = document.createElement('div');
      const input = document.createElement('input');
      
      AriaUtils.describeElement(description, input);
      
      expect(description.id).toBeTruthy();
      expect(input.getAttribute('aria-describedby')).toBe(description.id);
    });
  });
});