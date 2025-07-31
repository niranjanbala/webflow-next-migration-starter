import { SiteConfig } from './types';

export const siteConfig: SiteConfig = {
  title: 'Numeral HQ',
  description: 'Professional services and solutions',
  url: 'https://numeralhq.com',
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' },
  ],
  footer: {
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
    socialMedia: [
      {
        platform: 'LinkedIn',
        url: 'https://linkedin.com/company/numeralhq',
        icon: 'linkedin',
      },
      {
        platform: 'Twitter',
        url: 'https://twitter.com/numeralhq',
        icon: 'twitter',
      },
    ],
    contactInfo: {
      email: 'hello@numeralhq.com',
    },
  },
  pwa: {
    name: 'Numeral HQ',
    shortName: 'NumeralHQ',
    description: 'Professional services and solutions',
    themeColor: '#000000',
    backgroundColor: '#ffffff',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    startUrl: '/',
    display: 'standalone',
  },
};

// Environment variables
export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  WEBFLOW_API_TOKEN: process.env.WEBFLOW_API_TOKEN || '',
  WEBFLOW_SITE_ID: process.env.WEBFLOW_SITE_ID || '',
} as const;