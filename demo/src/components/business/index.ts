// Business-specific components
export { default as PricingCard } from './pricing-card';

// Types
export interface PricingFeature {
  name: string;
  included: boolean;
  description?: string;
}