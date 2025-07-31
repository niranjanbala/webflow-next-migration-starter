import { ScrapedPage } from './scraper';
import * as fs from 'fs/promises';

export interface DesignTokens {
  colors: Record<string, string>;
  fonts: {
    families: string[];
    sizes: string[];
    weights: string[];
  };
  spacing: string[];
  breakpoints: Record<string, string>;
  shadows: string[];
  borderRadius: string[];
}

export class DesignExtractor {
  
  async extractDesignTokens(scrapedPages: ScrapedPage[]): Promise<DesignTokens> {
    const tokens: DesignTokens = {
      colors: {},
      fonts: {
        families: [],
        sizes: [],
        weights: []
      },
      spacing: [],
      breakpoints: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px'
      },
      shadows: [],
      borderRadius: []
    };

    // Extract design tokens from all pages
    for (const page of scrapedPages) {
      this.extractColorsFromPage(page, tokens);
      this.extractFontsFromPage(page, tokens);
      this.extractSpacingFromPage(page, tokens);
    }

    // Clean up and deduplicate
    this.cleanupTokens(tokens);

    return tokens;
  }

  private extractColorsFromPage(page: ScrapedPage, tokens: DesignTokens): void {
    // Extract colors from inline styles
    page.sections.forEach(section => {
      Object.entries(section.styles).forEach(([property, value]) => {
        if (this.isColorProperty(property) && this.isValidColor(value)) {
          const colorName = this.generateColorName(value);
          tokens.colors[colorName] = value;
        }
      });

      // Extract colors from HTML content
      const colorMatches = section.html.match(/(?:color|background-color|border-color):\s*([^;]+)/gi);
      if (colorMatches) {
        colorMatches.forEach(match => {
          const colorValue = match.split(':')[1].trim().replace(';', '');
          if (this.isValidColor(colorValue)) {
            const colorName = this.generateColorName(colorValue);
            tokens.colors[colorName] = colorValue;
          }
        });
      }
    });
  }

  private extractFontsFromPage(page: ScrapedPage, tokens: DesignTokens): void {
    page.sections.forEach(section => {
      // Extract font families
      if (section.styles.fontFamily) {
        const fontFamily = section.styles.fontFamily.replace(/['"]/g, '');
        if (!tokens.fonts.families.includes(fontFamily)) {
          tokens.fonts.families.push(fontFamily);
        }
      }

      // Extract font sizes
      if (section.styles.fontSize) {
        const fontSize = section.styles.fontSize;
        if (!tokens.fonts.sizes.includes(fontSize)) {
          tokens.fonts.sizes.push(fontSize);
        }
      }

      // Extract font weights
      if (section.styles.fontWeight) {
        const fontWeight = section.styles.fontWeight;
        if (!tokens.fonts.weights.includes(fontWeight)) {
          tokens.fonts.weights.push(fontWeight);
        }
      }
    });
  }

  private extractSpacingFromPage(page: ScrapedPage, tokens: DesignTokens): void {
    page.sections.forEach(section => {
      // Extract spacing values from padding and margin
      ['padding', 'margin', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
       'marginTop', 'marginBottom', 'marginLeft', 'marginRight'].forEach(property => {
        if (section.styles[property]) {
          const value = section.styles[property];
          if (this.isValidSpacing(value) && !tokens.spacing.includes(value)) {
            tokens.spacing.push(value);
          }
        }
      });
    });
  }

  private isColorProperty(property: string): boolean {
    return ['color', 'backgroundColor', 'borderColor', 'background'].includes(property);
  }

  private isValidColor(value: string): boolean {
    // Check for hex, rgb, rgba, hsl, hsla, or named colors
    const colorRegex = /^(#[0-9a-f]{3,8}|rgb\(|rgba\(|hsl\(|hsla\(|[a-z]+)$/i;
    return colorRegex.test(value.trim());
  }

  private isValidSpacing(value: string): boolean {
    // Check for valid CSS spacing values
    const spacingRegex = /^\d+(\.\d+)?(px|rem|em|%|vh|vw)$/;
    return spacingRegex.test(value.trim());
  }

  private generateColorName(colorValue: string): string {
    // Generate a meaningful name for the color
    const cleanValue = colorValue.replace(/[^\w]/g, '').toLowerCase();
    
    // Common color mappings
    const colorMap: Record<string, string> = {
      'ffffff': 'white',
      '000000': 'black',
      'ff0000': 'red',
      '00ff00': 'green',
      '0000ff': 'blue',
      'ffff00': 'yellow',
      'ff00ff': 'magenta',
      '00ffff': 'cyan'
    };

    return colorMap[cleanValue] || `color-${cleanValue.substring(0, 6)}`;
  }

  private cleanupTokens(tokens: DesignTokens): void {
    // Remove duplicates and sort
    tokens.fonts.families = [...new Set(tokens.fonts.families)].sort();
    tokens.fonts.sizes = [...new Set(tokens.fonts.sizes)].sort();
    tokens.fonts.weights = [...new Set(tokens.fonts.weights)].sort();
    tokens.spacing = [...new Set(tokens.spacing)].sort();
  }

  async generateTailwindConfig(tokens: DesignTokens): Promise<string> {
    const config = `
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: ${JSON.stringify(tokens.colors, null, 8)},
      fontFamily: {
        ${tokens.fonts.families.map((font) => 
          `'${font.toLowerCase().replace(/\s+/g, '-')}': ['${font}', 'sans-serif']`
        ).join(',\n        ')}
      },
      fontSize: {
        ${tokens.fonts.sizes.map((size) => 
          `'${size}': '${size}'`
        ).join(',\n        ')}
      },
      spacing: {
        ${tokens.spacing.map((space) => 
          `'${space}': '${space}'`
        ).join(',\n        ')}
      },
      screens: ${JSON.stringify(tokens.breakpoints, null, 8)},
    },
  },
  plugins: [],
};

export default config;
`;

    return config;
  }

  async saveTailwindConfig(tokens: DesignTokens, outputPath: string): Promise<void> {
    const config = await this.generateTailwindConfig(tokens);
    await fs.writeFile(outputPath, config);
  }
}