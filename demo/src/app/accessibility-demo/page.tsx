import { Metadata } from 'next';
import { generateMetadata, Breadcrumbs, generateBreadcrumbs } from '@/components/seo';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { 
  AccessibleImage, 
  AccessibleForm, 
  AccessibleField, 
  AccessibleFieldset,
  ScreenReaderOnly
} from '@/components/accessibility';

export const metadata: Metadata = generateMetadata({
  title: "Accessibility Demo - WCAG Compliance & Inclusive Design",
  description: "Comprehensive demonstration of accessibility features including WCAG compliance, keyboard navigation, screen reader support, and inclusive design patterns.",
  keywords: ["accessibility", "WCAG", "inclusive design", "screen reader", "keyboard navigation", "a11y"],
  url: "/accessibility-demo",
  type: "article"
});

function AccessibilityDemoContent() {
  const breadcrumbs = generateBreadcrumbs('/accessibility-demo', {
    'accessibility-demo': 'Accessibility Demo'
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Accessibility Features Demo
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              This page demonstrates comprehensive accessibility features including 
              WCAG compliance, keyboard navigation, screen reader support, and inclusive design patterns.
            </p>
          </div>

          {/* Skip Links Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Skip Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Skip links are automatically included at the top of every page. 
                Press Tab to see them appear, or use a screen reader to navigate to them.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Try it:</strong> Press Tab when this page loads to see the skip links appear.
                  They allow keyboard users to quickly jump to main content, navigation, or footer.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Keyboard Navigation Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Keyboard Navigation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                All interactive elements are keyboard accessible using standard navigation patterns.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Navigation Keys</h3>
                  <ul className="space-y-2 text-sm">
                    <li><kbd className="px-2 py-1 bg-gray-100 rounded">Tab</kbd> - Move to next element</li>
                    <li><kbd className="px-2 py-1 bg-gray-100 rounded">Shift + Tab</kbd> - Move to previous element</li>
                    <li><kbd className="px-2 py-1 bg-gray-100 rounded">Enter</kbd> - Activate button/link</li>
                    <li><kbd className="px-2 py-1 bg-gray-100 rounded">Space</kbd> - Activate button/checkbox</li>
                    <li><kbd className="px-2 py-1 bg-gray-100 rounded">Arrow Keys</kbd> - Navigate menus/lists</li>
                    <li><kbd className="px-2 py-1 bg-gray-100 rounded">Escape</kbd> - Close modal/menu</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Try Keyboard Navigation</h3>
                  <div className="space-y-3">
                    <Button variant="primary">Primary Button</Button>
                    <Button variant="outline">Secondary Button</Button>
                    <Button variant="ghost">Ghost Button</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Screen Reader Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Screen Reader Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                All content is optimized for screen readers with proper semantic markup, 
                ARIA labels, and live announcements.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Screen Reader Only Content</h3>
                  <p className="text-gray-600">
                    Some content is hidden visually but available to screen readers:
                    <ScreenReaderOnly>
                      This text is only visible to screen readers and provides additional context.
                    </ScreenReaderOnly>
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">ARIA Labels and Descriptions</h3>
                  <div className="space-y-2">
                    <button 
                      aria-label="Close dialog"
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      ×
                    </button>
                    <p className="text-sm text-gray-600">
                      The × button above has an aria-label &ldquo;Close dialog&rdquo; for screen readers.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accessible Images Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Accessible Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Images include proper alt text and can be marked as decorative when appropriate.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Informative Image</h3>
                  <AccessibleImage
                    src="/icons/icon-192x192.png"
                    alt="Numeral logo - circular icon with stylized N"
                    width={96}
                    height={96}
                    className="rounded-lg"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    This image has descriptive alt text for screen readers.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Decorative Image</h3>
                  <AccessibleImage
                    src="/icons/icon-192x192.png"
                    decorative={true}
                    width={96}
                    height={96}
                    className="rounded-lg opacity-50"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    This decorative image is hidden from screen readers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accessible Forms Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Accessible Forms</CardTitle>
            </CardHeader>
            <CardContent>
              <AccessibleForm
                title="Contact Form"
                description="All form fields include proper labels, error handling, and keyboard navigation."
              >
                <AccessibleFieldset
                  legend="Personal Information"
                  description="Please provide your contact details"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AccessibleField
                      label="First Name"
                      required
                      helperText="Enter your first name"
                    >
                      <input
                        type="text"
                        className="form-input-accessible"
                        placeholder="John"
                      />
                    </AccessibleField>
                    
                    <AccessibleField
                      label="Last Name"
                      required
                    >
                      <input
                        type="text"
                        className="form-input-accessible"
                        placeholder="Doe"
                      />
                    </AccessibleField>
                  </div>
                  
                  <AccessibleField
                    label="Email Address"
                    required
                    helperText="We'll never share your email with anyone else"
                  >
                    <input
                      type="email"
                      className="form-input-accessible"
                      placeholder="john.doe@example.com"
                    />
                  </AccessibleField>
                  
                  <AccessibleField
                    label="Message"
                    helperText="Optional message (max 500 characters)"
                  >
                    <textarea
                      className="form-input-accessible"
                      rows={4}
                      placeholder="Your message here..."
                    />
                  </AccessibleField>
                </AccessibleFieldset>
                
                <AccessibleFieldset
                  legend="Preferences"
                  description="Choose your communication preferences"
                >
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span>Subscribe to newsletter</span>
                    </label>
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span>Receive product updates</span>
                    </label>
                  </div>
                </AccessibleFieldset>
                
                <div className="flex space-x-4">
                  <Button type="submit" variant="primary">
                    Submit Form
                  </Button>
                  <Button type="reset" variant="outline">
                    Reset
                  </Button>
                </div>
              </AccessibleForm>
            </CardContent>
          </Card>

          {/* Color Contrast Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Color Contrast</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                All text meets WCAG AA contrast requirements (4.5:1 for normal text, 3:1 for large text).
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Good Contrast Examples</h3>
                  <div className="space-y-2">
                    <div className="contrast-aa p-3 rounded">
                      <p className="font-semibold">WCAG AA Compliant</p>
                      <p className="text-sm">Black text on white background (21:1 ratio)</p>
                    </div>
                    <div className="bg-blue-600 text-white p-3 rounded">
                      <p className="font-semibold">High Contrast</p>
                      <p className="text-sm">White text on blue background (8.6:1 ratio)</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Focus Indicators</h3>
                  <div className="space-y-2">
                    <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-600">
                      Focusable Button
                    </button>
                    <p className="text-sm text-gray-600">
                      Tab to this button to see the focus indicator.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Motion and Animation */}
          <Card>
            <CardHeader>
              <CardTitle>Reduced Motion Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Animations respect the user's motion preferences and can be reduced or disabled.
              </p>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>System Setting:</strong> Check your system's accessibility settings 
                  to enable "Reduce motion" and see how animations are automatically minimized.
                </p>
              </div>
              
              <div className="flex space-x-4">
                <div className="w-16 h-16 bg-blue-500 rounded-lg animate-pulse">
                  <span className="sr-only">Animated element</span>
                </div>
                <div className="w-16 h-16 bg-green-500 rounded-lg animate-bounce">
                  <span className="sr-only">Bouncing element</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600">
                These animations will be reduced if you have "Reduce motion" enabled in your system settings.
              </p>
            </CardContent>
          </Card>

          {/* Testing Tools */}
          <Card>
            <CardHeader>
              <CardTitle>Accessibility Testing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Automated Testing Tools</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a 
                        href="https://wave.webaim.org/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        WAVE Web Accessibility Evaluator
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://www.deque.com/axe/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        axe DevTools
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://developers.google.com/web/tools/lighthouse" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Lighthouse Accessibility Audit
                      </a>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Manual Testing</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Navigate using only the keyboard</li>
                    <li>• Test with screen readers (NVDA, JAWS, VoiceOver)</li>
                    <li>• Check color contrast ratios</li>
                    <li>• Verify focus indicators are visible</li>
                    <li>• Test with zoom up to 200%</li>
                    <li>• Validate HTML markup</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AccessibilityDemoPage() {
  return <AccessibilityDemoContent />;
}