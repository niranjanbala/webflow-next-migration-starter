// Accessibility utilities and helpers

export interface A11yConfig {
  announcePageChanges?: boolean;
  skipLinksEnabled?: boolean;
  focusManagement?: boolean;
  keyboardNavigation?: boolean;
  screenReaderSupport?: boolean;
}

export const DEFAULT_A11Y_CONFIG: A11yConfig = {
  announcePageChanges: true,
  skipLinksEnabled: true,
  focusManagement: true,
  keyboardNavigation: true,
  screenReaderSupport: true
};

// Focus management utilities
export class FocusManager {
  private static focusStack: HTMLElement[] = [];
  private static trapStack: HTMLElement[] = [];

  static saveFocus(): void {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && activeElement !== document.body) {
      this.focusStack.push(activeElement);
    }
  }

  static restoreFocus(): void {
    const element = this.focusStack.pop();
    if (element && element.focus) {
      element.focus();
    }
  }

  static trapFocus(container: HTMLElement): void {
    this.trapStack.push(container);
    this.setupFocusTrap(container);
  }

  static releaseFocusTrap(): void {
    const container = this.trapStack.pop();
    if (container) {
      this.removeFocusTrap(container);
    }
  }

  private static setupFocusTrap(container: HTMLElement): void {
    const focusableElements = this.getFocusableElements(container);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    container.setAttribute('data-focus-trap', 'true');
    
    // Focus the first element
    firstElement.focus();
  }

  private static removeFocusTrap(container: HTMLElement): void {
    const listeners = container.querySelectorAll('[data-focus-trap="true"]');
    listeners.forEach(element => {
      element.removeAttribute('data-focus-trap');
    });
  }

  static getFocusableElements(container: HTMLElement): HTMLElement[] {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    return Array.from(container.querySelectorAll(focusableSelectors))
      .filter(element => {
        const htmlElement = element as HTMLElement;
        return htmlElement.offsetWidth > 0 && 
               htmlElement.offsetHeight > 0 && 
               !htmlElement.hidden;
      }) as HTMLElement[];
  }

  static moveFocusToElement(element: HTMLElement | null): void {
    if (element && element.focus) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}

// Screen reader announcements
export class ScreenReaderAnnouncer {
  private static liveRegion: HTMLElement | null = null;

  static initialize(): void {
    if (typeof window === 'undefined') return;
    
    if (!this.liveRegion) {
      this.liveRegion = document.createElement('div');
      this.liveRegion.setAttribute('aria-live', 'polite');
      this.liveRegion.setAttribute('aria-atomic', 'true');
      this.liveRegion.setAttribute('aria-relevant', 'text');
      this.liveRegion.className = 'sr-only';
      this.liveRegion.id = 'screen-reader-announcements';
      document.body.appendChild(this.liveRegion);
    }
  }

  static announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.liveRegion) {
      this.initialize();
    }

    if (this.liveRegion) {
      this.liveRegion.setAttribute('aria-live', priority);
      this.liveRegion.textContent = message;
      
      // Clear after announcement to allow repeated announcements
      setTimeout(() => {
        if (this.liveRegion) {
          this.liveRegion.textContent = '';
        }
      }, 1000);
    }
  }

  static announcePageChange(title: string): void {
    this.announce(`Navigated to ${title}`, 'polite');
  }

  static announceError(message: string): void {
    this.announce(`Error: ${message}`, 'assertive');
  }

  static announceSuccess(message: string): void {
    this.announce(`Success: ${message}`, 'polite');
  }
}

// Keyboard navigation utilities
export class KeyboardNavigation {
  static KEYS = {
    ENTER: 'Enter',
    SPACE: ' ',
    ESCAPE: 'Escape',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    HOME: 'Home',
    END: 'End',
    TAB: 'Tab'
  } as const;

  static isActivationKey(key: string): boolean {
    return key === this.KEYS.ENTER || key === this.KEYS.SPACE;
  }

  static isArrowKey(key: string): boolean {
    return [
      this.KEYS.ARROW_UP,
      this.KEYS.ARROW_DOWN,
      this.KEYS.ARROW_LEFT,
      this.KEYS.ARROW_RIGHT
    ].includes(key as keyof typeof KeyboardNavigation.KEYS);
  }

  static handleMenuNavigation(
    event: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    onSelect?: (index: number) => void,
    onClose?: () => void
  ): number {
    const { key } = event;
    let newIndex = currentIndex;

    switch (key) {
      case this.KEYS.ARROW_DOWN:
        event.preventDefault();
        newIndex = (currentIndex + 1) % items.length;
        break;
      case this.KEYS.ARROW_UP:
        event.preventDefault();
        newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
        break;
      case this.KEYS.HOME:
        event.preventDefault();
        newIndex = 0;
        break;
      case this.KEYS.END:
        event.preventDefault();
        newIndex = items.length - 1;
        break;
      case this.KEYS.ENTER:
      case this.KEYS.SPACE:
        event.preventDefault();
        if (onSelect) {
          onSelect(currentIndex);
        }
        break;
      case this.KEYS.ESCAPE:
        event.preventDefault();
        if (onClose) {
          onClose();
        }
        break;
    }

    if (newIndex !== currentIndex && items[newIndex]) {
      items[newIndex].focus();
    }

    return newIndex;
  }
}

// Color contrast utilities
export class ColorContrast {
  static calculateLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  static calculateContrastRatio(color1: [number, number, number], color2: [number, number, number]): number {
    const lum1 = this.calculateLuminance(...color1);
    const lum2 = this.calculateLuminance(...color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  static meetsWCAGAA(contrastRatio: number, fontSize: number = 16): boolean {
    return fontSize >= 18 ? contrastRatio >= 3 : contrastRatio >= 4.5;
  }

  static meetsWCAGAAA(contrastRatio: number, fontSize: number = 16): boolean {
    return fontSize >= 18 ? contrastRatio >= 4.5 : contrastRatio >= 7;
  }

  static hexToRgb(hex: string): [number, number, number] | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : null;
  }
}

// Alt text generation utilities
export class AltTextGenerator {
  static generateImageAlt(src: string, context?: string): string {
    const filename = src.split('/').pop()?.split('.')[0] || '';
    const cleanFilename = filename
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());

    if (context) {
      return `${cleanFilename} - ${context}`;
    }

    // Check for common image types
    if (src.includes('logo')) {
      return `${cleanFilename} logo`;
    }
    if (src.includes('icon')) {
      return `${cleanFilename} icon`;
    }
    if (src.includes('hero') || src.includes('banner')) {
      return `${cleanFilename} banner image`;
    }

    return cleanFilename || 'Image';
  }

  static validateAltText(altText: string): {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];

    if (!altText || altText.trim().length === 0) {
      issues.push('Alt text is empty');
      suggestions.push('Provide descriptive alt text for the image');
    }

    if (altText.length > 125) {
      issues.push('Alt text is too long (over 125 characters)');
      suggestions.push('Keep alt text concise and under 125 characters');
    }

    if (altText.toLowerCase().includes('image of') || altText.toLowerCase().includes('picture of')) {
      issues.push('Alt text contains redundant phrases');
      suggestions.push('Remove phrases like "image of" or "picture of"');
    }

    if (altText.toLowerCase() === 'image' || altText.toLowerCase() === 'photo') {
      issues.push('Alt text is too generic');
      suggestions.push('Provide more specific description of the image content');
    }

    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    };
  }
}

// ARIA utilities
export class AriaUtils {
  static generateId(prefix: string = 'a11y'): string {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }

  static setAriaExpanded(element: HTMLElement, expanded: boolean): void {
    element.setAttribute('aria-expanded', expanded.toString());
  }

  static setAriaSelected(element: HTMLElement, selected: boolean): void {
    element.setAttribute('aria-selected', selected.toString());
  }

  static setAriaChecked(element: HTMLElement, checked: boolean | 'mixed'): void {
    element.setAttribute('aria-checked', checked.toString());
  }

  static setAriaDisabled(element: HTMLElement, disabled: boolean): void {
    element.setAttribute('aria-disabled', disabled.toString());
  }

  static setAriaHidden(element: HTMLElement, hidden: boolean): void {
    element.setAttribute('aria-hidden', hidden.toString());
  }

  static associateElements(labelElement: HTMLElement, targetElement: HTMLElement): void {
    const id = targetElement.id || this.generateId();
    targetElement.id = id;
    labelElement.setAttribute('aria-labelledby', id);
  }

  static describeElement(descriptionElement: HTMLElement, targetElement: HTMLElement): void {
    const id = descriptionElement.id || this.generateId();
    descriptionElement.id = id;
    targetElement.setAttribute('aria-describedby', id);
  }
}