import Image from 'next/image';

interface Feature {
  title: string;
  description: string;
  icon?: string;
  image?: string;
}

interface FeaturesGridProps {
  title?: string;
  subtitle?: string;
  features: Feature[];
  columns?: 2 | 3 | 4;
}

export default function FeaturesGrid({
  title,
  subtitle,
  features,
  columns = 3
}: FeaturesGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className="text-center">
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-16">
          {title && (
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Features Grid */}
      <div className={`grid ${gridCols[columns]} gap-8`}>
        {features.map((feature, index) => (
          <div key={index} className="text-center">
            {/* Icon or Image */}
            {feature.icon && (
              <div className="mb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <Image
                    src={feature.icon}
                    alt=""
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                </div>
              </div>
            )}
            
            {feature.image && (
              <div className="mb-6">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Content */}
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}