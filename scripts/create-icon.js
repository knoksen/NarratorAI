/**
 * Icon Generator Script for NarratorAI
 * 
 * Creates a simple PNG icon using canvas (node-canvas required)
 * For production, use professional design tools or services
 */

const fs = require('fs');
const path = require('path');

console.log('🎨 NarratorAI Icon Generator\n');
console.log('='.repeat(50));

// Check if sharp is available for better icon generation
let sharp;
try {
  sharp = require('sharp');
  console.log('✅ Sharp module found - using high-quality icon generation\n');
} catch (e) {
  console.log('ℹ️  Sharp module not found - will use placeholder icons');
  console.log('   Install sharp for better icons: npm install sharp\n');
}

const iconDir = path.join(__dirname, '..', 'electron');
const iconPath = path.join(iconDir, 'icon.png');
const icoPath = path.join(iconDir, 'icon.ico');

// Create a simple placeholder icon using SVG to PNG
async function createPlaceholderIcon() {
  if (!sharp) {
    console.log('⚠️  Cannot create PNG without sharp module');
    console.log('   Please install: npm install sharp --save-dev\n');
    return false;
  }

  try {
    // Create a simple gradient icon with text
    const svg = `
      <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#A78BFA;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#60A5FA;stop-opacity:1" />
          </linearGradient>
          <filter id="shadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="2" dy="2" result="offsetblur"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- Background -->
        <rect width="512" height="512" rx="110" fill="url(#grad)"/>
        
        <!-- Audio wave icon -->
        <g filter="url(#shadow)">
          <!-- Speaker/Narrator representation -->
          <circle cx="256" cy="180" r="65" fill="white" opacity="0.95"/>
          <path d="M 180 280 Q 256 350, 332 280" 
                stroke="white" 
                stroke-width="45" 
                fill="none" 
                stroke-linecap="round" 
                opacity="0.95"/>
          
          <!-- Sound waves -->
          <circle cx="200" cy="360" r="18" fill="white" opacity="0.8"/>
          <circle cx="256" cy="385" r="22" fill="white" opacity="0.8"/>
          <circle cx="312" cy="360" r="18" fill="white" opacity="0.8"/>
        </g>
      </svg>
    `;

    // Generate PNG
    await sharp(Buffer.from(svg))
      .resize(512, 512)
      .png()
      .toFile(iconPath);

    console.log('✅ Created icon.png (512x512)');

    // Generate ICO file (Windows icon with multiple sizes)
    const sizes = [16, 32, 48, 64, 128, 256];
    const icoBuffers = [];

    for (const size of sizes) {
      const buffer = await sharp(Buffer.from(svg))
        .resize(size, size)
        .png()
        .toBuffer();
      icoBuffers.push(buffer);
    }

    console.log('✅ Generated icons for sizes:', sizes.join(', '));
    console.log('⚠️  Note: ICO file generation requires additional tools');
    console.log('   For now, using PNG as fallback for Windows\n');

    return true;
  } catch (error) {
    console.error('❌ Error creating icon:', error.message);
    return false;
  }
}

// Main execution
async function main() {
  // Check current status
  const pngExists = fs.existsSync(iconPath);
  const icoExists = fs.existsSync(icoPath);

  console.log('Current Status:');
  console.log('- icon.png:', pngExists ? '✅ Exists' : '❌ Missing');
  console.log('- icon.ico:', icoExists ? '✅ Exists' : '❌ Missing');
  console.log();

  if (sharp) {
    console.log('Generating placeholder icon...\n');
    const success = await createPlaceholderIcon();
    
    if (success) {
      console.log('='.repeat(50));
      console.log('✅ Icon generation complete!\n');
      console.log('Next steps:');
      console.log('1. Review the generated icon.png');
      console.log('2. For production, replace with professional icon');
      console.log('3. Convert to .ico using online tool or ImageMagick:');
      console.log('   - https://convertio.co/png-ico/');
      console.log('   - Or: magick convert icon.png icon.ico');
      console.log();
    }
  } else {
    console.log('='.repeat(50));
    console.log('\n📝 Manual Icon Creation Guide:\n');
    console.log('Option 1: Install Sharp');
    console.log('  npm install sharp --save-dev');
    console.log('  node scripts/generate-icons.js');
    console.log();
    console.log('Option 2: Create Manually');
    console.log('  1. Create a 512x512 PNG icon');
    console.log('  2. Save as: electron/icon.png');
    console.log('  3. Convert to ICO:');
    console.log('     - Online: https://convertio.co/png-ico/');
    console.log('     - ImageMagick: magick convert icon.png icon.ico');
    console.log();
    console.log('Option 3: Use Professional Service');
    console.log('  - Fiverr, 99designs, or similar');
    console.log('  - Request PNG and ICO formats');
    console.log();
  }

  console.log('ℹ️  The app will work without custom icons (uses defaults)');
  console.log('   Custom icons are recommended for distribution\n');
}

main().catch(console.error);
