import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface PricingFeature {
  name: string;
  included: boolean;
  description?: string;
}

interface PricingCardProps {
  title: string;
  description: string;
  price: {
    amount: number;
    currency: string;
    period: string;
  };
  features: PricingFeature[];
  ctaText: string;
  ctaHref: string;
  popular?: boolean;
  className?: string;
}

export default function PricingCard({
  title,
  description,
  price,
  features,
  ctaText,
  ctaHref,
  popular = false,
  className = ''
}: PricingCardProps) {
  return (
    <Card 
      className={cn(
        'relative h-full',
        popular && 'ring-2 ring-orange-500 shadow-lg scale-105',
        className
      )}
      variant={popular ? 'elevated' : 'default'}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge variant="warning" size="sm">
            Most Popular
          </Badge>
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
        <p className="text-center text-gray-600 mt-2">{description}</p>
        
        <div className="text-center mt-6">
          <div className="flex items-baseline justify-center">
            <span className="text-4xl font-bold text-gray-900">
              {price.currency}{price.amount}
            </span>
            <span className="text-gray-600 ml-2">/{price.period}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {feature.included ? (
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <span className={cn(
                  'text-sm',
                  feature.included ? 'text-gray-900' : 'text-gray-400'
                )}>
                  {feature.name}
                </span>
                {feature.description && (
                  <p className="text-xs text-gray-500 mt-1">
                    {feature.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Link href={ctaHref} className="w-full">
          <Button 
            variant={popular ? 'primary' : 'outline'} 
            className="w-full"
          >
            {ctaText}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}