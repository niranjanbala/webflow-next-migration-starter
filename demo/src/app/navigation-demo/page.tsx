'use client';

import { useState } from 'react';
import { 
  NavigationMenu, 
  NavLink, 
  NavButton, 
  BreadcrumbNavigation,
  FooterNavigation,
  PageTransition,
  StaggeredTransition,
  AnimatedCounter,
  LoadingTransition
} from '@/components/navigation';
import { MAIN_NAVIGATION } from '@/lib/navigation';

const footerNavigation = [
  {
    label: 'Products',
    href: '/products',
    children: [
      { label: 'Tax Automation', href: '/products/tax-automation' },
      { label: 'Compliance Tools', href: '/products/compliance' },
      { label: 'Analytics', href: '/products/analytics' }
    ]
  },
  {
    label: 'Resources',
    href: '/resources',
    children: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Blog', href: '/blog' },
      { label: 'Case Studies', href: '/case-studies' }
    ]
  },
  {
    label: 'Company',
    href: '/company',
    children: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' }
    ]
  },
  {
    label: 'Support',
    href: '/support',
    children: [
      { label: 'Help Center', href: '/help' },
      { label: 'API Reference', href: '/api' },
      { label: 'Status', href: '/status' }
    ]
  }
];

export default function NavigationDemoPage() {
  return (
    <PageTransition type="fade">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900">Navigation Components Demo</h1>
            <p className="mt-2 text-gray-600">
              Showcase of navigation components with smooth transitions and accessibility features
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
          {/* Breadcrumb Navigation */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Breadcrumb Navigation</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <BreadcrumbNavigation />
              <p className="mt-4 text-sm text-gray-600">
                Breadcrumbs automatically generate based on the current route
              </p>
            </div>
          </section>

          {/* Navigation Menu - Desktop */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Desktop Navigation Menu</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <NavigationMenu navigation={MAIN_NAVIGATION} />
              <p className="mt-4 text-sm text-gray-600">
                Hover over items with children to see dropdown menus
              </p>
            </div>
          </section>

          {/* Navigation Menu - Mobile */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Mobile Navigation Menu</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <NavigationMenu navigation={MAIN_NAVIGATION} mobile />
              <p className="mt-4 text-sm text-gray-600">
                Click on items with children to expand/collapse sections
              </p>
            </div>
          </section>

          {/* Navigation Links */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Navigation Links</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
              <div className="flex flex-wrap gap-4">
                <NavLink href="/products" className="text-blue-600 hover:text-blue-800">
                  Standard Link
                </NavLink>
                <NavLink href="https://example.com" external className="text-green-600 hover:text-green-800">
                  External Link
                </NavLink>
                <NavLink href="/active-demo" className="text-purple-600 hover:text-purple-800">
                  Active Link Demo
                </NavLink>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-6">
                <NavButton href="/demo" variant="primary" size="sm">
                  Primary Button
                </NavButton>
                <NavButton href="/demo" variant="secondary" size="sm">
                  Secondary Button
                </NavButton>
                <NavButton href="/demo" variant="outline" size="sm">
                  Outline Button
                </NavButton>
              </div>

              <div className="flex flex-wrap gap-4 mt-4">
                <NavButton href="/demo" variant="primary" size="md">
                  Medium Button
                </NavButton>
                <NavButton href="/demo" variant="primary" size="lg">
                  Large Button
                </NavButton>
              </div>
            </div>
          </section>

          {/* Staggered Animation */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Staggered Animation</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <StaggeredTransition delay={100}>
                {[
                  <div key="1" className="p-4 bg-blue-50 rounded-lg mb-2">
                    <h3 className="font-semibold text-blue-900">First Item</h3>
                    <p className="text-blue-700">This item appears first</p>
                  </div>,
                  <div key="2" className="p-4 bg-green-50 rounded-lg mb-2">
                    <h3 className="font-semibold text-green-900">Second Item</h3>
                    <p className="text-green-700">This item appears second</p>
                  </div>,
                  <div key="3" className="p-4 bg-purple-50 rounded-lg mb-2">
                    <h3 className="font-semibold text-purple-900">Third Item</h3>
                    <p className="text-purple-700">This item appears third</p>
                  </div>,
                  <div key="4" className="p-4 bg-orange-50 rounded-lg">
                    <h3 className="font-semibold text-orange-900">Fourth Item</h3>
                    <p className="text-orange-700">This item appears last</p>
                  </div>
                ]}
              </StaggeredTransition>
            </div>
          </section>

          {/* Animated Counters */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Animated Counters</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">
                    <AnimatedCounter value={1250} />+
                  </div>
                  <p className="text-gray-600 mt-2">Happy Customers</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600">
                    <AnimatedCounter value={98} />%
                  </div>
                  <p className="text-gray-600 mt-2">Accuracy Rate</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600">
                    <AnimatedCounter value={50000} />+
                  </div>
                  <p className="text-gray-600 mt-2">Transactions Processed</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Counters animate when they come into view
              </p>
            </div>
          </section>

          {/* Loading Transition Demo */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Loading Transition</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <LoadingTransitionDemo />
            </div>
          </section>

          {/* Footer Navigation */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Footer Navigation</h2>
            <div className="bg-gray-900 p-8 rounded-lg">
              <FooterNavigation navigation={footerNavigation} />
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}

// Loading Transition Demo Component
function LoadingTransitionDemo() {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div>
      <button
        onClick={handleToggleLoading}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Trigger Loading State'}
      </button>
      
      <LoadingTransition loading={isLoading} delay={200}>
        <div className="p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Area</h3>
          <p className="text-gray-600">
            This content will fade out when loading and fade back in when complete.
            The loading spinner appears after a 200ms delay to prevent flickering
            for quick operations.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="h-20 bg-blue-100 rounded"></div>
            <div className="h-20 bg-green-100 rounded"></div>
          </div>
        </div>
      </LoadingTransition>
    </div>
  );
}

