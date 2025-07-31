'use client';

import { useState, useEffect } from 'react';
import { webflowDesignExtractor, WebflowDesignTokens } from '@/lib/webflow-design-extractor';
import {
  WContainer,
  WRow,
  WCol,
  WSection,
  WHeading,
  WText,
  WButton,
  WCard,
  WInput,
  WTextarea,
  WForm,
  WImage,
  WLink,
  WebflowProvider
} from '@/components/webflow';

export default function WebflowDesignDemo() {
  const [designTokens, setDesignTokens] = useState<WebflowDesignTokens | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<'json' | 'css' | 'scss' | 'tailwind'>('json');
  const [exportedTokens, setExportedTokens] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDesignTokens();
  }, []);

  const loadDesignTokens = async () => {
    setLoading(true);
    try {
      const tokens = await webflowDesignExtractor.extractDesignTokens();
      setDesignTokens(tokens);
    } catch (error) {
      console.error('Failed to load design tokens:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportTokens = async () => {
    if (!designTokens) return;
    
    try {
      const exported = await webflowDesignExtractor.exportTokens(selectedFormat);
      setExportedTokens(exported);
    } catch (error) {
      console.error('Failed to export tokens:', error);
    }
  };

  return (
    <WebflowProvider theme={designTokens}>
      <div className="min-h-screen bg-neutral-50">
        {/* Header */}
        <WSection background="white" padding="md">
          <WContainer>
            <WHeading level={1} className="mb-4">
              Webflow Design System Demo
            </WHeading>
            <WText size="lg" color="neutral-600">
              Showcase of recreated Webflow design tokens and components
            </WText>
          </WContainer>
        </WSection>

        {/* Design Tokens Section */}
        <WSection background="gray" padding="lg">
          <WContainer>
            <WHeading level={2} className="mb-8">
              Design Tokens
            </WHeading>

            {loading ? (
              <WCard padding="lg">
                <WText align="center">Loading design tokens...</WText>
              </WCard>
            ) : designTokens ? (
              <WRow gap={6}>
                {/* Colors */}
                <WCol md={6}>
                  <WCard padding="lg" className="h-full">
                    <WHeading level={3} size="xl" className="mb-6">
                      Colors
                    </WHeading>
                    
                    <div className="space-y-4">
                      <div>
                        <WText weight="semibold" className="mb-2">Primary</WText>
                        <div className="flex space-x-2">
                          {Object.entries(designTokens.colors.primary).slice(0, 6).map(([key, value]) => (
                            <div key={key} className="text-center">
                              <div
                                className="w-12 h-12 rounded-lg border border-neutral-200"
                                style={{ backgroundColor: value }}
                              />
                              <WText size="xs" className="mt-1">{key}</WText>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <WText weight="semibold" className="mb-2">Neutral</WText>
                        <div className="flex space-x-2">
                          {Object.entries(designTokens.colors.neutral).slice(0, 6).map(([key, value]) => (
                            <div key={key} className="text-center">
                              <div
                                className="w-12 h-12 rounded-lg border border-neutral-200"
                                style={{ backgroundColor: value }}
                              />
                              <WText size="xs" className="mt-1">{key}</WText>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <WText weight="semibold" className="mb-2">Brand</WText>
                        <div className="flex space-x-2">
                          {Object.entries(designTokens.colors.brand).map(([key, value]) => (
                            <div key={key} className="text-center">
                              <div
                                className="w-12 h-12 rounded-lg border border-neutral-200"
                                style={{ backgroundColor: value }}
                              />
                              <WText size="xs" className="mt-1">{key.replace('numeral-', '')}</WText>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </WCard>
                </WCol>

                {/* Typography */}
                <WCol md={6}>
                  <WCard padding="lg" className="h-full">
                    <WHeading level={3} size="xl" className="mb-6">
                      Typography
                    </WHeading>
                    
                    <div className="space-y-4">
                      <div>
                        <WText weight="semibold" className="mb-2">Font Sizes</WText>
                        <div className="space-y-2">
                          {Object.entries(designTokens.typography.fontSizes).slice(0, 6).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                              <WText size="sm">{key}</WText>
                              <WText style={{ fontSize: value }}>Sample Text</WText>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <WText weight="semibold" className="mb-2">Text Styles</WText>
                        <div className="space-y-2">
                          {Object.entries(designTokens.typography.textStyles).slice(0, 4).map(([key, style]) => (
                            <div key={key}>
                              <WText size="xs" color="neutral-500">{key}</WText>
                              <div
                                style={{
                                  fontFamily: style.fontFamily,
                                  fontSize: style.fontSize,
                                  fontWeight: style.fontWeight,
                                  lineHeight: style.lineHeight
                                }}
                              >
                                Sample Text
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </WCard>
                </WCol>
              </WRow>
            ) : (
              <WCard padding="lg">
                <WText align="center" color="error-600">
                  Failed to load design tokens
                </WText>
              </WCard>
            )}
          </WContainer>
        </WSection>

        {/* Components Showcase */}
        <WSection background="white" padding="lg">
          <WContainer>
            <WHeading level={2} className="mb-8">
              Webflow Components
            </WHeading>

            <div className="space-y-12">
              {/* Layout Components */}
              <div>
                <WHeading level={3} size="xl" className="mb-6">
                  Layout Components
                </WHeading>
                
                <WCard padding="lg">
                  <WRow gap={4}>
                    <WCol md={4}>
                      <WCard variant="outlined" padding="md">
                        <WText align="center">Column 1</WText>
                      </WCard>
                    </WCol>
                    <WCol md={4}>
                      <WCard variant="outlined" padding="md">
                        <WText align="center">Column 2</WText>
                      </WCard>
                    </WCol>
                    <WCol md={4}>
                      <WCard variant="outlined" padding="md">
                        <WText align="center">Column 3</WText>
                      </WCard>
                    </WCol>
                  </WRow>
                </WCard>
              </div>

              {/* Typography Components */}
              <div>
                <WHeading level={3} size="xl" className="mb-6">
                  Typography
                </WHeading>
                
                <WCard padding="lg">
                  <div className="space-y-4">
                    <WHeading level={1}>Heading 1</WHeading>
                    <WHeading level={2}>Heading 2</WHeading>
                    <WHeading level={3}>Heading 3</WHeading>
                    <WText size="lg">Large text paragraph with some content to demonstrate typography.</WText>
                    <WText>Regular text paragraph with normal sizing and weight.</WText>
                    <WText size="sm" color="neutral-600">Small text in muted color.</WText>
                  </div>
                </WCard>
              </div>

              {/* Button Components */}
              <div>
                <WHeading level={3} size="xl" className="mb-6">
                  Buttons
                </WHeading>
                
                <WCard padding="lg">
                  <div className="flex flex-wrap gap-4">
                    <WButton variant="primary">Primary Button</WButton>
                    <WButton variant="secondary">Secondary Button</WButton>
                    <WButton variant="outline">Outline Button</WButton>
                    <WButton variant="ghost">Ghost Button</WButton>
                    <WButton variant="link">Link Button</WButton>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mt-4">
                    <WButton size="sm">Small</WButton>
                    <WButton size="md">Medium</WButton>
                    <WButton size="lg">Large</WButton>
                    <WButton size="xl">Extra Large</WButton>
                  </div>
                </WCard>
              </div>

              {/* Form Components */}
              <div>
                <WHeading level={3} size="xl" className="mb-6">
                  Form Components
                </WHeading>
                
                <WCard padding="lg">
                  <WForm>
                    <WRow gap={4}>
                      <WCol md={6}>
                        <WInput
                          placeholder="Enter your name"
                          helperText="Your full name"
                        />
                      </WCol>
                      <WCol md={6}>
                        <WInput
                          type="email"
                          placeholder="Enter your email"
                          helperText="We'll never share your email"
                        />
                      </WCol>
                    </WRow>
                    
                    <WTextarea
                      placeholder="Enter your message"
                      rows={4}
                      helperText="Tell us about your project"
                    />
                    
                    <WButton type="submit" variant="primary">
                      Submit Form
                    </WButton>
                  </WForm>
                </WCard>
              </div>
            </div>
          </WContainer>
        </WSection>

        {/* Token Export Section */}
        <WSection background="gray" padding="lg">
          <WContainer>
            <WHeading level={2} className="mb-8">
              Export Design Tokens
            </WHeading>

            <WCard padding="lg">
              <div className="space-y-4">
                <div>
                  <WText weight="semibold" className="mb-2">Export Format</WText>
                  <div className="flex space-x-4">
                    {(['json', 'css', 'scss', 'tailwind'] as const).map((format) => (
                      <label key={format} className="flex items-center">
                        <input
                          type="radio"
                          name="format"
                          value={format}
                          checked={selectedFormat === format}
                          onChange={(e) => setSelectedFormat(e.target.value as any)}
                          className="mr-2"
                        />
                        <WText>{format.toUpperCase()}</WText>
                      </label>
                    ))}
                  </div>
                </div>

                <WButton onClick={handleExportTokens} variant="primary">
                  Export Tokens
                </WButton>

                {exportedTokens && (
                  <div>
                    <WText weight="semibold" className="mb-2">Exported Tokens</WText>
                    <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-auto text-sm">
                      {exportedTokens}
                    </pre>
                  </div>
                )}
              </div>
            </WCard>
          </WContainer>
        </WSection>
      </div>
    </WebflowProvider>
  );
}