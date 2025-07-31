import Link from 'next/link';

interface CTASectionProps {
  title: string;
  description?: string;
  primaryCTA: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
  backgroundColor?: 'white' | 'gray' | 'dark' | 'orange';
}

const backgroundClasses = {
  white: 'bg-white text-gray-900',
  gray: 'bg-gray-50 text-gray-900',
  dark: 'bg-gray-900 text-white',
  orange: 'bg-orange-600 text-white',
};

export default function CTASection({
  title,
  description,
  primaryCTA,
  secondaryCTA,
  backgroundColor = 'gray'
}: CTASectionProps) {
  const isDark = backgroundColor === 'dark' || backgroundColor === 'orange';
  
  return (
    <section className={`py-16 sm:py-20 ${backgroundClasses[backgroundColor]}`}>
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          {title}
        </h2>
        
        {description && (
          <p className={`text-xl mb-8 ${isDark ? 'text-gray-200' : 'text-gray-600'}`}>
            {description}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={primaryCTA.href}
            className={`px-8 py-3 rounded-lg font-medium transition-colors ${
              isDark
                ? 'bg-white text-gray-900 hover:bg-gray-100'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {primaryCTA.text}
          </Link>
          
          {secondaryCTA && (
            <Link
              href={secondaryCTA.href}
              className={`px-8 py-3 rounded-lg font-medium border transition-colors ${
                isDark
                  ? 'border-white text-white hover:bg-white hover:text-gray-900'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {secondaryCTA.text}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}