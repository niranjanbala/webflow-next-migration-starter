import Image from 'next/image';

interface Logo {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

interface CompanyLogosProps {
  title?: string;
  logos: Logo[];
  className?: string;
}

export default function CompanyLogos({
  title = "Trusted by leading companies",
  logos,
  className = ""
}: CompanyLogosProps) {
  return (
    <div className={`text-center ${className}`}>
      {title && (
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-8">
          {title}
        </p>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
        {logos.map((logo, index) => (
          <div key={index} className="flex items-center justify-center">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width || 120}
              height={logo.height || 40}
              className="h-8 w-auto opacity-60 hover:opacity-100 transition-opacity filter grayscale hover:grayscale-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
}