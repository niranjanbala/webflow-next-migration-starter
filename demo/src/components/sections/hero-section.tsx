import Image from 'next/image';
import Link from 'next/link';

interface HeroSectionProps {
  title: string;
  description: string;
  ctaText?: string;
  ctaHref?: string;
  imageSrc?: string;
  imageAlt?: string;
  badges?: Array<{
    src: string;
    alt: string;
    text?: string;
  }>;
}

export default function HeroSection({
  title,
  description,
  ctaText = "Get Started",
  ctaHref = "/demo",
  imageSrc,
  imageAlt = "Product screenshot",
  badges = []
}: HeroSectionProps) {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              {title}
            </h1>
            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
              {description}
            </p>
            
            {/* Email Signup Form */}
            <div className="mt-8">
              <div className="flex flex-col sm:flex-row gap-4 max-w-md">
                <input
                  type="email"
                  placeholder="Enter your work email"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                />
                <Link
                  href={ctaHref}
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors text-center whitespace-nowrap"
                >
                  {ctaText}
                </Link>
              </div>
            </div>

            {/* Badges */}
            {badges.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center gap-6">
                {badges.map((badge, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Image
                      src={badge.src}
                      alt={badge.alt}
                      width={24}
                      height={24}
                      className="h-6 w-auto"
                    />
                    {badge.text && (
                      <span className="text-sm text-gray-600">{badge.text}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Image */}
          {imageSrc && (
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  width={600}
                  height={400}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}