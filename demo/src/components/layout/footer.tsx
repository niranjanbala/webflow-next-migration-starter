import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/lib/config';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Image
                src="/icons/icon-72x72.png"
                alt="Numeral"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Numeral
              </span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              Sales tax automation for ecommerce and SaaS businesses. 
              Spend less than five minutes per month on sales tax compliance.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {siteConfig.footer.socialMedia.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={`Follow us on ${social.platform}`}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    {social.platform === 'LinkedIn' && (
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    )}
                    {social.platform === 'Twitter' && (
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    )}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {siteConfig.footer.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-600 hover:text-gray-900 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {currentYear} Numeral. All rights reserved.
            </p>
            
            {/* Contact Info */}
            {siteConfig.footer.contactInfo.email && (
              <div className="mt-4 md:mt-0">
                <a
                  href={`mailto:${siteConfig.footer.contactInfo.email}`}
                  className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
                >
                  {siteConfig.footer.contactInfo.email}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}