/**
 * @jest-environment jsdom
 */

import { WebflowDesignExtractor } from '../webflow-design-extractor';
import { WebflowClient } from '../webflow-client';

// Mock the WebflowClient
jest.mock('../webflow-client');
const MockedWebflowClient = WebflowClient as jest.MockedClass<typeof WebflowClient>;

describe('WebflowDesignExtractor', () => {
  let extractor: WebflowDesignExtractor;
  let mockWebflowClient: jest.Mocked<WebflowClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockWebflowClient = {
      getSite: jest.fn()
    } as any;

    MockedWebflowClient.mockImplementation(() => mockWebflowClient);
    
    extractor = new WebflowDesignExtractor();
  });

  describe('Design Token Extraction', () => {
    it('should extract design tokens successfully', async () => {
      mockWebflowClient.getSite.mockResolvedValue({
        id: 'test-site',
        name: 'Test Site',
        shortName: 'test',
        domains: ['test.com']
      });

      const tokens = await extractor.extractDesignTokens();

      expect(tokens).toBeDefined();
      expect(tokens.colors).toBeDefined();
      expect(tokens.typography).toBeDefined();
      expect(tokens.spacing).toBeDefined();
      expect(tokens.breakpoints).toBeDefined();
      expect(tokens.shadows).toBeDefined();
      expect(tokens.borders).toBeDefined();
      expect(tokens.animations).toBeDefined();
    });

    it('should return default tokens on error', async () => {
      mockWebflowClient.getSite.mockRejectedValue(new Error('API Error'));

      const tokens = await extractor.extractDesignTokens();

      expect(tokens).toBeDefined();
      expect(tokens.colors.primary).toBeDefined();
      expect(tokens.typography.fontFamilies).toBeDefined();
    });

    it('should cache extracted tokens', async () => {
      mockWebflowClient.getSite.mockResolvedValue({
        id: 'test-site',
        name: 'Test Site',
        shortName: 'test',
        domains: ['test.com']
      });

      // First call
      await extractor.extractDesignTokens('test-site');
      expect(mockWebflowClient.getSite).toHaveBeenCalledTimes(1);

      // Second call should use cache
      await extractor.extractDesignTokens('test-site');
      expect(mockWebflowClient.getSite).toHaveBeenCalledTimes(1);
    });
  });

  describe('Color Extraction', () => {
    it('should generate color scales', () => {
      const baseColor = '#3B82F6';
      const colorScale = (extractor as any).generateColorScale(baseColor);

      expect(colorScale).toHaveProperty('50');
      expect(colorScale).toHaveProperty('500', baseColor);
      expect(colorScale).toHaveProperty('950');
      expect(Object.keys(colorScale)).toHaveLength(11);
    });

    it('should generate semantic color names', () => {
      const colorName1 = (extractor as any).generateColorName('#000000');
      const colorName2 = (extractor as any).generateColorName('#ff5733');

      expect(colorName1).toBe('black');
      expect(colorName2).toMatch(/^custom-/);
    });
  });

  describe('Token Export', () => {
    beforeEach(() => {
      mockWebflowClient.getSite.mockResolvedValue({
        id: 'test-site',
        name: 'Test Site',
        shortName: 'test',
        domains: ['test.com']
      });
    });

    it('should export tokens as JSON', async () => {
      const exported = await extractor.exportTokens('json');
      
      expect(typeof exported).toBe('string');
      expect(() => JSON.parse(exported)).not.toThrow();
    });

    it('should export tokens as CSS', async () => {
      const exported = await extractor.exportTokens('css');
      
      expect(typeof exported).toBe('string');
      expect(exported).toContain(':root');
      expect(exported).toContain('--color-primary');
    });

    it('should export tokens as SCSS', async () => {
      const exported = await extractor.exportTokens('scss');
      
      expect(typeof exported).toBe('string');
      expect(exported).toContain('$color-primary');
    });

    it('should export tokens as Tailwind config', async () => {
      const exported = await extractor.exportTokens('tailwind');
      
      expect(typeof exported).toBe('string');
      expect(exported).toContain('module.exports');
      expect(exported).toContain('theme');
      expect(exported).toContain('extend');
    });
  });

  describe('Stylesheet Processing', () => {
    it('should extract stylesheets from domain', async () => {
      const stylesheets = await (extractor as any).extractStylesheets('test.com');
      
      expect(Array.isArray(stylesheets)).toBe(true);
      expect(stylesheets.length).toBeGreaterThan(0);
      expect(stylesheets[0]).toHaveProperty('url');
      expect(stylesheets[0]).toHaveProperty('content');
    });

    it('should parse stylesheets into tokens', async () => {
      const mockStylesheets = [
        {
          url: 'test.css',
          content: '.test { color: #ff0000; font-size: 16px; }',
          rules: []
        }
      ];

      const tokens = await (extractor as any).parseStylesheets(mockStylesheets);
      
      expect(tokens).toBeDefined();
      expect(tokens.colors).toBeDefined();
      expect(tokens.typography).toBeDefined();
    });
  });

  describe('Typography Extraction', () => {
    it('should extract typography tokens', () => {
      const typography = (extractor as any).extractTypography([]);
      
      expect(typography.fontFamilies).toBeDefined();
      expect(typography.fontSizes).toBeDefined();
      expect(typography.fontWeights).toBeDefined();
      expect(typography.lineHeights).toBeDefined();
      expect(typography.letterSpacing).toBeDefined();
      expect(typography.textStyles).toBeDefined();
    });

    it('should include common text styles', () => {
      const typography = (extractor as any).extractTypography([]);
      
      expect(typography.textStyles).toHaveProperty('heading-1');
      expect(typography.textStyles).toHaveProperty('body-normal');
      expect(typography.textStyles['heading-1']).toHaveProperty('fontSize');
      expect(typography.textStyles['heading-1']).toHaveProperty('fontWeight');
    });
  });

  describe('Spacing and Layout', () => {
    it('should extract spacing tokens', () => {
      const spacing = (extractor as any).extractSpacing([]);
      
      expect(spacing.scale).toBeDefined();
      expect(spacing.semantic).toBeDefined();
      expect(spacing.scale).toHaveProperty('0', '0px');
      expect(spacing.scale).toHaveProperty('4', '1rem');
    });

    it('should extract breakpoint tokens', () => {
      const breakpoints = (extractor as any).extractBreakpoints([]);
      
      expect(breakpoints).toHaveProperty('sm');
      expect(breakpoints).toHaveProperty('md');
      expect(breakpoints).toHaveProperty('lg');
      expect(breakpoints).toHaveProperty('xl');
    });
  });

  describe('Visual Effects', () => {
    it('should extract shadow tokens', () => {
      const shadows = (extractor as any).extractShadows([]);
      
      expect(shadows).toHaveProperty('sm');
      expect(shadows).toHaveProperty('md');
      expect(shadows).toHaveProperty('lg');
      expect(shadows.sm).toContain('rgb');
    });

    it('should extract border tokens', () => {
      const borders = (extractor as any).extractBorders([]);
      
      expect(borders.radius).toBeDefined();
      expect(borders.width).toBeDefined();
      expect(borders.radius).toHaveProperty('md');
      expect(borders.width).toHaveProperty('1', '1px');
    });

    it('should extract animation tokens', () => {
      const animations = (extractor as any).extractAnimations([]);
      
      expect(animations.duration).toBeDefined();
      expect(animations.easing).toBeDefined();
      expect(animations.keyframes).toBeDefined();
      expect(animations.duration).toHaveProperty('300', '300ms');
    });
  });
});