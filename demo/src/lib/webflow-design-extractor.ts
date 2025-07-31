import { WebflowClient } from './webflow-client';

export interface WebflowDesignTokens {
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  breakpoints: BreakpointTokens;
  shadows: ShadowTokens;
  borders: BorderTokens;
  animations: AnimationTokens;
}

export interface ColorTokens {
  primary: ColorScale;
  secondary: ColorScale;
  neutral: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  error: ColorScale;
  brand: Record<string, string>;
  custom: Record<string, string>;
}

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export interface TypographyTokens {
  fontFamilies: Record<string, string[]>;
  fontSizes: Record<string, string>;
  fontWeights: Record<string, number>;
  lineHeights: Record<string, string>;
  letterSpacing: Record<string, string>;
  textStyles: Record<string, TextStyle>;
}

export interface TextStyle {
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: string;
  letterSpacing?: string;
  textTransform?: string;
}

export interface SpacingTokens {
  scale: Record<string, string>;
  semantic: Record<string, string>;
}

export interface BreakpointTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface ShadowTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
  none: string;
}

export interface BorderTokens {
  radius: Record<string, string>;
  width: Record<string, string>;
}

export interface AnimationTokens {
  duration: Record<string, string>;
  easing: Record<string, string>;
  keyframes: Record<string, string>;
}

export interface WebflowStylesheet {
  url: string;
  content: string;
  rules: CSSRule[];
}

export interface CSSRule {
  selector: string;
  properties: Record<string, string>;
  mediaQuery?: string;
}

export class WebflowDesignExtractor {
  private webflowClient: WebflowClient;
  private cache: Map<string, WebflowDesignTokens> = new Map();

  constructor() {
    this.webflowClient = new WebflowClient();
  }

  /**
   * Extract design tokens from Webflow site
   */
  async extractDesignTokens(siteId?: string): Promise<WebflowDesignTokens> {
    const cacheKey = siteId || 'default';
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      // Get site information
      const site = await this.webflowClient.getSite();
      
      // Extract stylesheets from site
      const stylesheets = await this.extractStylesheets(site.domains[0] || 'example.com');
      
      // Parse CSS and extract tokens
      const tokens = await this.parseStylesheets(stylesheets);
      
      // Cache the result
      this.cache.set(cacheKey, tokens);
      
      return tokens;
    } catch (error) {
      console.error('Failed to extract design tokens:', error);
      return this.getDefaultDesignTokens();
    }
  }

  /**
   * Extract stylesheets from Webflow site
   */
  private async extractStylesheets(domain: string): Promise<WebflowStylesheet[]> {
    try {
      // In a real implementation, this would fetch the actual site HTML
      // and extract stylesheet URLs, then fetch the CSS content
      
      // For now, return mock stylesheets with common Webflow patterns
      return [
        {
          url: `https://${domain}/css/normalize.css`,
          content: this.getMockNormalizeCSS(),
          rules: []
        },
        {
          url: `https://${domain}/css/webflow.css`,
          content: this.getMockWebflowCSS(),
          rules: []
        },
        {
          url: `https://${domain}/css/site.css`,
          content: this.getMockSiteCSS(),
          rules: []
        }
      ];
    } catch (error) {
      console.error('Failed to extract stylesheets:', error);
      return [];
    }
  }

  /**
   * Parse stylesheets and extract design tokens
   */
  private async parseStylesheets(stylesheets: WebflowStylesheet[]): Promise<WebflowDesignTokens> {
    const tokens: WebflowDesignTokens = {
      colors: this.extractColors(stylesheets),
      typography: this.extractTypography(stylesheets),
      spacing: this.extractSpacing(stylesheets),
      breakpoints: this.extractBreakpoints(stylesheets),
      shadows: this.extractShadows(stylesheets),
      borders: this.extractBorders(stylesheets),
      animations: this.extractAnimations(stylesheets)
    };

    return tokens;
  }

  /**
   * Extract color tokens from CSS
   */
  private extractColors(stylesheets: WebflowStylesheet[]): ColorTokens {
    const colors: ColorTokens = {
      primary: this.generateColorScale('#3B82F6'), // Blue
      secondary: this.generateColorScale('#8B5CF6'), // Purple
      neutral: this.generateColorScale('#6B7280'), // Gray
      success: this.generateColorScale('#10B981'), // Green
      warning: this.generateColorScale('#F59E0B'), // Yellow
      error: this.generateColorScale('#EF4444'), // Red
      brand: {
        'numeral-blue': '#1E40AF',
        'numeral-navy': '#1E3A8A',
        'numeral-light': '#EFF6FF'
      },
      custom: {}
    };

    // Parse CSS for custom colors
    stylesheets.forEach(stylesheet => {
      const colorMatches = stylesheet.content.match(/(?:color|background-color|border-color):\s*(#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}|rgb\([^)]+\)|rgba\([^)]+\))/g);
      
      if (colorMatches) {
        colorMatches.forEach(match => {
          const colorValue = match.split(':')[1].trim();
          const colorName = this.generateColorName(colorValue);
          colors.custom[colorName] = colorValue;
        });
      }
    });

    return colors;
  }

  /**
   * Extract typography tokens from CSS
   */
  private extractTypography(stylesheets: WebflowStylesheet[]): TypographyTokens {
    return {
      fontFamilies: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['Monaco', 'Consolas', 'monospace']
      },
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem'
      },
      fontWeights: {
        thin: 100,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900
      },
      lineHeights: {
        none: '1',
        tight: '1.25',
        snug: '1.375',
        normal: '1.5',
        relaxed: '1.625',
        loose: '2'
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em'
      },
      textStyles: {
        'heading-1': {
          fontFamily: 'Inter',
          fontSize: '3rem',
          fontWeight: 700,
          lineHeight: '1.2'
        },
        'heading-2': {
          fontFamily: 'Inter',
          fontSize: '2.25rem',
          fontWeight: 600,
          lineHeight: '1.3'
        },
        'heading-3': {
          fontFamily: 'Inter',
          fontSize: '1.875rem',
          fontWeight: 600,
          lineHeight: '1.4'
        },
        'body-large': {
          fontFamily: 'Inter',
          fontSize: '1.125rem',
          fontWeight: 400,
          lineHeight: '1.6'
        },
        'body-normal': {
          fontFamily: 'Inter',
          fontSize: '1rem',
          fontWeight: 400,
          lineHeight: '1.5'
        },
        'body-small': {
          fontFamily: 'Inter',
          fontSize: '0.875rem',
          fontWeight: 400,
          lineHeight: '1.4'
        }
      }
    };
  }

  /**
   * Extract spacing tokens from CSS
   */
  private extractSpacing(stylesheets: WebflowStylesheet[]): SpacingTokens {
    return {
      scale: {
        '0': '0px',
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
        '32': '8rem',
        '40': '10rem',
        '48': '12rem',
        '56': '14rem',
        '64': '16rem'
      },
      semantic: {
        'section-padding': '4rem',
        'container-padding': '1rem',
        'element-gap': '1.5rem',
        'component-gap': '2rem'
      }
    };
  }

  /**
   * Extract breakpoint tokens from CSS
   */
  private extractBreakpoints(stylesheets: WebflowStylesheet[]): BreakpointTokens {
    return {
      xs: '475px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    };
  }

  /**
   * Extract shadow tokens from CSS
   */
  private extractShadows(stylesheets: WebflowStylesheet[]): ShadowTokens {
    return {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      none: '0 0 #0000'
    };
  }

  /**
   * Extract border tokens from CSS
   */
  private extractBorders(stylesheets: WebflowStylesheet[]): BorderTokens {
    return {
      radius: {
        none: '0px',
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px'
      },
      width: {
        '0': '0px',
        '1': '1px',
        '2': '2px',
        '4': '4px',
        '8': '8px'
      }
    };
  }

  /**
   * Extract animation tokens from CSS
   */
  private extractAnimations(stylesheets: WebflowStylesheet[]): AnimationTokens {
    return {
      duration: {
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms'
      },
      easing: {
        linear: 'linear',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)'
      },
      keyframes: {
        fadeIn: 'fadeIn 0.3s ease-out',
        slideUp: 'slideUp 0.3s ease-out',
        slideDown: 'slideDown 0.3s ease-out'
      }
    };
  }

  /**
   * Generate a color scale from a base color
   */
  private generateColorScale(baseColor: string): ColorScale {
    // This is a simplified implementation
    // In a real scenario, you'd use a color manipulation library
    return {
      50: this.lightenColor(baseColor, 0.95),
      100: this.lightenColor(baseColor, 0.9),
      200: this.lightenColor(baseColor, 0.8),
      300: this.lightenColor(baseColor, 0.6),
      400: this.lightenColor(baseColor, 0.4),
      500: baseColor,
      600: this.darkenColor(baseColor, 0.2),
      700: this.darkenColor(baseColor, 0.4),
      800: this.darkenColor(baseColor, 0.6),
      900: this.darkenColor(baseColor, 0.8),
      950: this.darkenColor(baseColor, 0.9)
    };
  }

  /**
   * Lighten a color by a percentage
   */
  private lightenColor(color: string, amount: number): string {
    // Simplified implementation - in reality you'd use a proper color library
    return color;
  }

  /**
   * Darken a color by a percentage
   */
  private darkenColor(color: string, amount: number): string {
    // Simplified implementation - in reality you'd use a proper color library
    return color;
  }

  /**
   * Generate a semantic name for a color
   */
  private generateColorName(color: string): string {
    const colorMap: Record<string, string> = {
      '#000000': 'black',
      '#ffffff': 'white',
      '#ff0000': 'red',
      '#00ff00': 'green',
      '#0000ff': 'blue'
    };

    return colorMap[color.toLowerCase()] || `custom-${color.replace('#', '')}`;
  }

  /**
   * Get default design tokens as fallback
   */
  private getDefaultDesignTokens(): WebflowDesignTokens {
    return {
      colors: {
        primary: this.generateColorScale('#3B82F6'),
        secondary: this.generateColorScale('#8B5CF6'),
        neutral: this.generateColorScale('#6B7280'),
        success: this.generateColorScale('#10B981'),
        warning: this.generateColorScale('#F59E0B'),
        error: this.generateColorScale('#EF4444'),
        brand: {
          'numeral-blue': '#1E40AF',
          'numeral-navy': '#1E3A8A',
          'numeral-light': '#EFF6FF'
        },
        custom: {}
      },
      typography: this.extractTypography([]),
      spacing: this.extractSpacing([]),
      breakpoints: this.extractBreakpoints([]),
      shadows: this.extractShadows([]),
      borders: this.extractBorders([]),
      animations: this.extractAnimations([])
    };
  }

  /**
   * Mock CSS content for development
   */
  private getMockNormalizeCSS(): string {
    return `
      /* Normalize CSS */
      * { box-sizing: border-box; }
      body { margin: 0; font-family: Inter, sans-serif; }
    `;
  }

  private getMockWebflowCSS(): string {
    return `
      /* Webflow Base Styles */
      .w-container { max-width: 940px; margin: 0 auto; }
      .w-row { display: flex; flex-wrap: wrap; }
      .w-col { flex: 1; }
      .w-button { 
        background-color: #3B82F6; 
        color: white; 
        padding: 12px 24px; 
        border-radius: 6px; 
        border: none;
        font-weight: 500;
        cursor: pointer;
      }
    `;
  }

  private getMockSiteCSS(): string {
    return `
      /* Site-specific styles */
      .hero-section { 
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 80px 0;
      }
      .section-padding { padding: 60px 0; }
      .text-primary { color: #1E40AF; }
      .bg-light { background-color: #F8FAFC; }
    `;
  }

  /**
   * Export design tokens to various formats
   */
  async exportTokens(format: 'json' | 'css' | 'scss' | 'tailwind' = 'json'): Promise<string> {
    const tokens = await this.extractDesignTokens();

    switch (format) {
      case 'css':
        return this.exportToCSS(tokens);
      case 'scss':
        return this.exportToSCSS(tokens);
      case 'tailwind':
        return this.exportToTailwind(tokens);
      default:
        return JSON.stringify(tokens, null, 2);
    }
  }

  /**
   * Export tokens to CSS custom properties
   */
  private exportToCSS(tokens: WebflowDesignTokens): string {
    let css = ':root {\n';
    
    // Colors
    Object.entries(tokens.colors.primary).forEach(([key, value]) => {
      css += `  --color-primary-${key}: ${value};\n`;
    });
    
    // Typography
    Object.entries(tokens.typography.fontSizes).forEach(([key, value]) => {
      css += `  --font-size-${key}: ${value};\n`;
    });
    
    // Spacing
    Object.entries(tokens.spacing.scale).forEach(([key, value]) => {
      css += `  --spacing-${key}: ${value};\n`;
    });
    
    css += '}\n';
    return css;
  }

  /**
   * Export tokens to SCSS variables
   */
  private exportToSCSS(tokens: WebflowDesignTokens): string {
    let scss = '// Design Tokens\n\n';
    
    // Colors
    scss += '// Colors\n';
    Object.entries(tokens.colors.primary).forEach(([key, value]) => {
      scss += `$color-primary-${key}: ${value};\n`;
    });
    
    return scss;
  }

  /**
   * Export tokens to Tailwind config
   */
  private exportToTailwind(tokens: WebflowDesignTokens): string {
    const config = {
      theme: {
        extend: {
          colors: tokens.colors,
          fontFamily: tokens.typography.fontFamilies,
          fontSize: tokens.typography.fontSizes,
          spacing: tokens.spacing.scale,
          screens: tokens.breakpoints,
          boxShadow: tokens.shadows,
          borderRadius: tokens.borders.radius
        }
      }
    };

    return `module.exports = ${JSON.stringify(config, null, 2)};`;
  }
}

// Export singleton instance
export const webflowDesignExtractor = new WebflowDesignExtractor();