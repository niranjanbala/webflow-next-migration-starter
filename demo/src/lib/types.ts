// Core content types based on design document
export interface PageContent {
  slug: string;
  title: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  openGraphImage?: string;
  sections: ContentSection[];
}

export interface ContentSection {
  id: string;
  type: 'hero' | 'content' | 'gallery' | 'contact' | 'custom';
  data: Record<string, unknown>;
  styling?: SectionStyling;
}

export interface SectionStyling {
  backgroundColor?: string;
  textColor?: string;
  padding?: string;
  margin?: string;
  customClasses?: string[];
}

export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

export interface SiteConfig {
  title: string;
  description: string;
  url: string;
  navigation: NavigationItem[];
  footer: FooterConfig;
  pwa: PWAConfig;
}

export interface FooterConfig {
  links: NavigationItem[];
  socialMedia: SocialMediaLink[];
  contactInfo: ContactInfo;
}

export interface SocialMediaLink {
  platform: string;
  url: string;
  icon: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
}

export interface PWAConfig {
  name: string;
  shortName: string;
  description: string;
  themeColor: string;
  backgroundColor: string;
  icons: PWAIcon[];
  startUrl: string;
  display: 'standalone' | 'minimal-ui' | 'fullscreen';
}

export interface PWAIcon {
  src: string;
  sizes: string;
  type: string;
  purpose?: 'any' | 'maskable' | 'monochrome';
}

// Webflow API types (to be expanded in task 2)
export interface WebflowSite {
  id: string;
  name: string;
  shortName: string;
  domains: string[];
}

export interface WebflowCollection {
  id: string;
  name: string;
  slug: string;
  fields: WebflowField[];
}

export interface WebflowField {
  id: string;
  name: string;
  slug: string;
  type: string;
  required: boolean;
}

export interface WebflowItem {
  id: string;
  name: string;
  slug: string;
  [key: string]: unknown;
}