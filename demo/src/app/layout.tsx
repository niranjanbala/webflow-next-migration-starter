import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { PageSEO } from "@/components/seo";
import { generateMetadata } from "@/lib/seo";
import { AccessibilityProvider, SkipLinks } from "@/components/accessibility";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { createLazyComponent } from "@/lib/lazy-loading";

// Lazy load non-critical components
const PWAInstallPrompt = createLazyComponent(() => import("@/components/ui/pwa-install-prompt"));
const NetworkStatus = createLazyComponent(() => import("@/components/ui/network-status"));
const UpdateNotification = createLazyComponent(() => import("@/components/ui/update-notification"));
const AccessibilitySettingsTrigger = createLazyComponent(() => import("@/components/accessibility/accessibility-settings").then(m => ({ default: m.AccessibilitySettingsTrigger })));

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = generateMetadata({
  title: "Numeral | Sales Tax on Autopilot for Ecommerce & SaaS",
  description: "Professional sales tax automation for ecommerce and SaaS businesses. Automate calculations, filing, and remittance across all jurisdictions.",
  keywords: ["sales tax", "tax automation", "ecommerce tax", "SaaS tax", "tax compliance", "tax software"],
  url: "https://numeralhq.com",
  type: "website"
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Numeral" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#000000" />
        <PageSEO 
          includeOrganization={true}
          includeWebsite={true}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AccessibilityProvider>
          <SkipLinks />
          <Suspense fallback={null}>
            <NetworkStatus />
          </Suspense>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Suspense fallback={null}>
            <PWAInstallPrompt />
          </Suspense>
          <Suspense fallback={null}>
            <UpdateNotification />
          </Suspense>
          <Suspense fallback={null}>
            <AccessibilitySettingsTrigger />
          </Suspense>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
