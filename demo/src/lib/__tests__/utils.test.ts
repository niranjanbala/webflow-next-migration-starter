import { cn, slugify, truncate, formatDate } from '../utils';

describe('Utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
      expect(cn('px-4', 'px-2')).toBe('px-2');
    });
  });

  describe('slugify', () => {
    it('should convert text to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Test & Example')).toBe('test-example');
      expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces');
    });
  });

  describe('truncate', () => {
    it('should truncate text correctly', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...');
      expect(truncate('Short', 10)).toBe('Short');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date)).toBe('January 15, 2024');
    });
  });
});