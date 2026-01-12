const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const png2icons = require('png2icons');

async function createIcoIcon() {
  try {
    const iconPath = path.join(__dirname, '..', 'electron', 'icon.png');
    const outputDir = path.join(__dirname, '..', 'electron', 'resources');
    const icoPath = path.join(outputDir, 'icon.ico');
    
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log('Creating proper ICO format with multiple sizes...');
    
    // Read the source PNG
    const input = fs.readFileSync(iconPath);
    
    // Create ICO with multiple sizes (256, 128, 64, 48, 32, 16)
    const output = png2icons.createICO(input, png2icons.BICUBIC, 0, true, true);
    
    // Write the ICO file
    fs.writeFileSync(icoPath, output);
    
    console.log('\n✓ ICO file created successfully!');
    console.log(`ICO file: ${icoPath}`);
    console.log('\nThe ICO contains multiple sizes: 256x256, 128x128, 64x64, 48x48, 32x32, 16x16');
    
  } catch (error) {
    console.error('Error creating ICO icon:', error);
    console.error('\nTip: Make sure electron/icon.png exists and is a valid PNG file.');
    process.exit(1);
  }
}

createIcoIcon();
