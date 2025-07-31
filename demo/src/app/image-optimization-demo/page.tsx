import { Metadata } from 'next';
import { generateMetadata } from '@/components/seo';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { OptimizedImage, OptimizedImageGallery, OptimizedHeroImage } from '@/components/images';

export const metadata: Metadata = generateMetadata({
  title: "Image Optimization Demo - Next.js Performance & WebP/AVIF Support",
  description: "Comprehensive demonstration of image optimization features including responsive images, modern formats (WebP/AVIF), lazy loading, and performance optimization.",
  keywords: ["image optimization", "WebP", "AVIF", "responsive images", "performance", "Next.js"],
  url: "/image-optimization-demo",
  type: "article"
});

export default function ImageOptimizationDemoPage() {
  // Sample images for demonstration
  const sampleImages = [
    {
      src: "/icons/icon-512x512.png",
      alt: "Numeral logo - large format",
      caption: "Original PNG format"
    },
    {
      src: "/icons/icon-192x192.png", 
      alt: "Numeral logo - medium format",
      caption: "Optimized for web"
    },
    {
      src: "/icons/icon-72x72.png",
      alt: "Numeral logo - small format", 
      caption: "Mobile optimized"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Optimized Background */}
      <OptimizedHeroImage
        src="/icons/icon-512x512.png"
        alt="Image optimization hero background"
        overlay={true}
        overlayColor="black"
        overlayOpacity={0.6}
        className="h-96"
      >
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">
            Image Optimization Demo
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Showcase of advanced image optimization techniques including responsive images, 
            modern formats, and performance enhancements.
          </p>
        </div>
      </OptimizedHeroImage>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          
          {/* Responsive Images */}
          <Card>
            <CardHeader>
              <CardTitle>Responsive Image Loading</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-600">
                Images automatically adapt to different screen sizes and device capabilities, 
                loading the most appropriate size and format for optimal performance.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4">Standard Responsive Image</h3>
                  <OptimizedImage
                    src="/icons/icon-512x512.png"
                    alt="Responsive image example"
                    width={400}
                    height={400}
                    className="w-full h-auto rounded-lg shadow-lg"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Automatically serves WebP/AVIF when supported, with fallback to original format.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Priority Loading</h3>
                  <OptimizedImage
                    src="/icons/icon-192x192.png"
                    alt="Priority loading example"
                    width={400}
                    height={400}
                    priority
                    className="w-full h-auto rounded-lg shadow-lg"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Above-the-fold images load immediately for better Core Web Vitals.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Image Gallery */}
          <Card>
            <CardHeader>
              <CardTitle>Optimized Image Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Gallery component with automatic optimization, lazy loading, and responsive layout.
              </p>
              
              <OptimizedImageGallery
                images={sampleImages}
                columns={3}
                gap={6}
                className="mb-6"
              />
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Gallery Features:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Lazy loading for images outside viewport</li>
                  <li>• Automatic format selection (AVIF → WebP → Original)</li>
                  <li>• Responsive grid layout</li>
                  <li>• Optimized loading with blur placeholders</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Format Support */}
          <Card>
            <CardHeader>
              <CardTitle>Modern Image Formats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-600">
                Automatic detection and serving of modern image formats for better compression and quality.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-green-100 rounded-lg p-6 mb-4">
                    <h3 className="font-semibold text-green-800 mb-2">AVIF Format</h3>
                    <p className="text-sm text-green-700">
                      Next-generation format with 50% better compression than JPEG
                    </p>
                  </div>
                  <OptimizedImage
                    src="/icons/icon-192x192.png"
                    alt="AVIF format example"
                    width={150}
                    height={150}
                    className="mx-auto rounded-lg"
                  />
                </div>
                
                <div className="text-center">
                  <div className="bg-blue-100 rounded-lg p-6 mb-4">
                    <h3 className="font-semibold text-blue-800 mb-2">WebP Format</h3>
                    <p className="text-sm text-blue-700">
                      25-35% better compression than JPEG with wide browser support
                    </p>
                  </div>
                  <OptimizedImage
                    src="/icons/icon-192x192.png"
                    alt="WebP format example"
                    width={150}
                    height={150}
                    className="mx-auto rounded-lg"
                  />
                </div>
                
                <div className="text-center">
                  <div className="bg-gray-100 rounded-lg p-6 mb-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Fallback</h3>
                    <p className="text-sm text-gray-700">
                      Original format for maximum compatibility
                    </p>
                  </div>
                  <OptimizedImage
                    src="/icons/icon-192x192.png"
                    alt="Original format fallback"
                    width={150}
                    height={150}
                    className="mx-auto rounded-lg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Features */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Optimizations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4">Lazy Loading</h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <OptimizedImage
                        key={i}
                        src="/icons/icon-72x72.png"
                        alt={`Lazy loaded image ${i}`}
                        width={200}
                        height={200}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    Images load only when they enter the viewport, reducing initial page load time.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Blur Placeholders</h3>
                  <OptimizedImage
                    src="/icons/icon-512x512.png"
                    alt="Blur placeholder example"
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-lg"
                    showPlaceholder={true}
                  />
                  <p className="text-sm text-gray-500 mt-4">
                    Smooth loading experience with blur placeholders that prevent layout shift.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Implementation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-3">Optimization Features</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Automatic format detection and serving</li>
                    <li>• Responsive image generation with multiple sizes</li>
                    <li>• Lazy loading with Intersection Observer</li>
                    <li>• Blur placeholder generation</li>
                    <li>• Image preloading for critical resources</li>
                    <li>• Batch processing for multiple images</li>
                    <li>• Asset manifest for tracking optimizations</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Performance Benefits</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 25-50% smaller file sizes with modern formats</li>
                    <li>• Faster page load times with lazy loading</li>
                    <li>• Better Core Web Vitals scores</li>
                    <li>• Reduced bandwidth usage</li>
                    <li>• Improved user experience</li>
                    <li>• SEO benefits from faster loading</li>
                    <li>• Mobile-optimized delivery</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                <h4 className="font-semibold mb-2">Usage Example:</h4>
                <pre className="text-sm text-gray-700 overflow-x-auto">
{`<OptimizedImage
  src="/path/to/image.jpg"
  alt="Descriptive alt text"
  width={800}
  height={600}
  priority={true}
  sizes="(max-width: 768px) 100vw, 50vw"
  className="rounded-lg shadow-lg"
/>`}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Build Process */}
          <Card>
            <CardHeader>
              <CardTitle>Build-Time Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Images are automatically optimized during the build process using our custom optimization pipeline.
              </p>
              
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <div># Run image optimization</div>
                <div>npm run optimize-assets</div>
                <div className="mt-2"># With custom options</div>
                <div>npm run optimize-assets -- --quality 90 --max-concurrent 3</div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">85%</div>
                  <div className="text-sm text-blue-800">Default Quality</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">5</div>
                  <div className="text-sm text-green-800">Responsive Sizes</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">3</div>
                  <div className="text-sm text-purple-800">Output Formats</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}