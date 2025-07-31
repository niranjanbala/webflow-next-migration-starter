#!/usr/bin/env tsx

import * as fs from 'fs/promises';
import * as path from 'path';

async function generateSimpleIcon(size: number, filename: string, maskable: boolean = false) {
  const padding = maskable ? size * 0.1 : 0; // 10% padding for maskable icons
  const iconSize = size - (padding * 2);
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = iconSize / 2;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#000000;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#333333;stop-opacity:1" />
    </linearGradient>
  </defs>
  ${maskable ? `<rect width="${size}" height="${size}" fill="white"/>` : ''}
  <circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="url(#grad)"/>
  <text x="${centerX}" y="${centerY + iconSize * 0.1}" 
        font-family="Arial, sans-serif" 
        font-size="${iconSize * 0.3}" 
        font-weight="bold" 
        text-anchor="middle" 
        fill="white">N</text>
</svg>`;

  const outputPath = path.join(process.cwd(), 'public', 'icons', filename);
  await fs.writeFile(outputPath, svg);
  console.log(`Generated: ${filename}`);
}

async function main() {
  console.log('🎨 Generating PWA icons...');
  
  // Create icons directory
  const iconsDir = path.join(process.cwd(), 'public', 'icons');
  await fs.mkdir(iconsDir, { recursive: true });
  
  // Standard icon sizes
  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
  
  // Generate regular icons
  for (const size of sizes) {
    await generateSimpleIcon(size, `icon-${size}x${size}.png`);
  }
  
  // Generate maskable icons
  await generateSimpleIcon(192, 'icon-192x192-maskable.png', true);
  await generateSimpleIcon(512, 'icon-512x512-maskable.png', true);
  
  // Generate shortcut icons
  await generateSimpleIcon(96, 'shortcut-dashboard.png');
  await generateSimpleIcon(96, 'shortcut-pricing.png');
  
  // Generate fallback image
  const fallbackSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#f3f4f6"/>
  <circle cx="200" cy="150" r="50" fill="#d1d5db"/>
  <text x="200" y="220" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#6b7280">
    Image not available
  </text>
</svg>`;
  
  await fs.writeFile(path.join(process.cwd(), 'public', 'images', 'fallback.png'), fallbackSvg);
  
  console.log('\n✅ PWA icons generated successfully!');
  console.log('📁 Icons saved to: public/icons/');
  console.log('🖼️  Fallback image saved to: public/images/fallback.png');
  
  console.log('\n💡 Note: These are placeholder SVG icons.');
  console.log('   For production, replace with proper PNG icons using your brand assets.');
}

if (require.main === module) {
  main().catch(console.error);
}