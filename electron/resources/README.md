# Electron Resources

This directory contains resources for the Electron desktop application build.

## Icon Files

To create proper icons for the Windows application:

### For Windows (.ico):
1. Create a 512x512 PNG image with your app icon
2. Use an online converter or tool like ImageMagick to convert to .ico format:
   ```bash
   # Using ImageMagick
   magick convert icon.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico
   ```

### Recommended Icon Sizes:
- **icon.png**: 512x512 or 1024x1024 (master icon)
- **icon.ico**: Multi-resolution Windows icon (16x16 to 256x256)

## Current Status
The current placeholder icons will work for development. For production builds, replace with your custom branded icons.

## Icon Design Guidelines
- Use the NarratorAI brand colors (purple theme)
- Keep it simple and recognizable at small sizes
- Ensure good contrast for visibility
- Consider the Windows taskbar appearance
