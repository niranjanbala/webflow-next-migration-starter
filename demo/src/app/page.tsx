import { Metadata } from 'next';
import MainLayout from '@/components/layout/main-layout';
import HeroSection from '@/components/sections/hero-section';
import ContentSection from '@/components/sections/content-section';
import FeaturesGrid from '@/components/sections/features-grid';
import CompanyLogos from '@/components/sections/company-logos';
import CTASection from '@/components/sections/cta-section';
import { PageSEO, generateMetadata } from '@/components/seo';

export const metadata: Metadata = generateMetadata({
  title: "Sales Tax on Autopilot | Numeral",
  description: "Spend less than five minutes per month on sales tax compliance. Automate monitoring, calculation, filing, and remittance across all jurisdictions.",
  keywords: ["sales tax automation", "tax compliance", "ecommerce tax", "SaaS tax", "tax software", "nexus monitoring"],
  url: "https://numeralhq.com",
  type: "website"
});

export default function Home() {
  const features = [
    {
      title: "Monitor nexus thresholds",
      description: "Track your sales tax obligations across all states with real-time monitoring and alerts.",
      icon: "/icons/icon-72x72.png"
    },
    {
      title: "Calculate and collect",
      description: "Accurate sales tax calculation and collection for all your transactions.",
      icon: "/icons/icon-72x72.png"
    },
    {
      title: "File and remit",
      description: "Automated filing and remittance to keep you compliant with all jurisdictions.",
      icon: "/icons/icon-72x72.png"
    },
    {
      title: "Manage exemptions",
      description: "Streamlined exemption certificate management and validation.",
      icon: "/icons/icon-72x72.png"
    }
  ];

  const companyLogos = [
    { src: "/icons/icon-72x72.png", alt: "Company 1" },
    { src: "/icons/icon-72x72.png", alt: "Company 2" },
    { src: "/icons/icon-72x72.png", alt: "Company 3" },
    { src: "/icons/icon-72x72.png", alt: "Company 4" },
    { src: "/icons/icon-72x72.png", alt: "Company 5" },
    { src: "/icons/icon-72x72.png", alt: "Company 6" }
  ];

  const badges = [
    { src: "/icons/icon-72x72.png", alt: "G2 Badge", text: "4.9 on G2" },
    { src: "/icons/icon-72x72.png", alt: "Y Combinator" },
    { src: "/icons/icon-72x72.png", alt: "Benchmark" }
  ];

  const faqs = [
    {
      question: "How does Numeral automate sales tax compliance?",
      answer: "Numeral monitors your nexus thresholds, calculates accurate tax rates, collects taxes at checkout, and automatically files and remits to all jurisdictions."
    },
    {
      question: "Which platforms does Numeral integrate with?",
      answer: "Numeral integrates with major ecommerce platforms like Shopify, WooCommerce, Magento, and SaaS billing systems like Stripe, Chargebee, and Recurly."
    },
    {
      question: "How long does it take to set up Numeral?",
      answer: "Most businesses can complete setup in under 30 minutes. Our team provides white-glove onboarding to ensure everything is configured correctly."
    }
  ];

  return (
    <MainLayout>
      <PageSEO 
        faqs={faqs}
        breadcrumbs={[{ name: 'Home', url: '/' }]}
      />
      <HeroSection
        title="Sales tax on autopilot."
        description="Spend less than five minutes per month on sales tax compliance."
        ctaText="Get Started"
        ctaHref="/demo"
        imageSrc="/icons/icon-512x512.png"
        imageAlt="Numeral Dashboard"
        badges={badges}
      />

      <ContentSection backgroundColor="gray" padding="lg">
        <CompanyLogos
          title="Trusted by leading ecommerce and SaaS companies"
          logos={companyLogos}
        />
      </ContentSection>

      <ContentSection backgroundColor="white" padding="xl">
        <FeaturesGrid
          title="Everything you need for sales tax compliance"
          subtitle="From monitoring nexus thresholds to filing returns, we handle it all so you can focus on growing your business."
          features={features}
          columns={2}
        />
      </ContentSection>

      <CTASection
        title="Ready to automate your sales tax?"
        description="Join thousands of businesses that trust Numeral for their sales tax compliance."
        primaryCTA={{
          text: "Get Started Free",
          href: "/demo"
        }}
        secondaryCTA={{
          text: "View Pricing",
          href: "/pricing"
        }}
        backgroundColor="orange"
      />
    </MainLayout>
  );
}