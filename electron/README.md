# NarratorAI Desktop Application

This directory contains the Electron configuration for building NarratorAI as a Windows desktop application.

## 🚀 Quick Start

### Development Mode
Run the desktop app in development mode with hot reload:

```bash
npm run electron:dev
```

This will:
1. Start the Next.js development server on port 9002
2. Wait for the server to be ready
3. Launch the Electron window

### Running Just Electron (with separate Next.js server)
If you already have the Next.js dev server running:

```bash
npm run electron
```

## 📦 Building for Windows

### Build Full Installer
Creates a Windows installer (NSIS):

```bash
npm run build:win
```

This creates an installer in the `dist/` folder that users can run to install NarratorAI on their Windows PC.

### Build Portable Version
Creates a portable executable that doesn't require installation:

```bash
npm run build:portable
```

### Build Both
```bash
npm run build:desktop
```

### Test Build Without Packaging
Useful for testing the build without creating installers:

```bash
npm run pack
```

## 📁 Output Files

After building, you'll find in the `dist/` folder:

- **NarratorAI-1.0.0-x64.exe** - Windows installer
- **NarratorAI-1.0.0-Portable.exe** - Portable executable
- **win-unpacked/** - Unpacked application files (for testing)

## 🎨 Custom Icons

To add custom application icons:

1. Create a 512x512 PNG icon: `electron/icon.png`
2. Convert to ICO format for Windows:
   - Use online tool: https://convertio.co/png-ico/
   - Or ImageMagick: `magick convert icon.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico`
3. Save as `electron/icon.ico`

The build process will automatically use your custom icons.

## ⚙️ Configuration Files

- **electron/main.js** - Electron main process (app window management)
- **electron/preload.js** - Preload script (security bridge between main and renderer)
- **electron-builder.json** - Build configuration for Windows installers

## 🔧 Features

The desktop app includes:

- ✅ Native Windows application
- ✅ Menu bar and window controls
- ✅ File dialog integration
- ✅ System tray support
- ✅ Auto-updates ready (configure when deploying)
- ✅ Offline capable (after initial setup)
- ✅ Full Next.js functionality
- ✅ All AI features working

## 🐛 Troubleshooting

### App won't start
- Ensure Next.js dev server is running (port 9002)
- Check that dependencies are installed: `npm install`
- Try: `npm run typecheck` to verify no build errors

### Build fails
- Ensure you have Node.js 18+ installed
- Run `npm install --legacy-peer-deps` to resolve peer dependencies
- Check that `electron/icon.ico` exists (or remove icon reference from electron-builder.json)

### Slow startup
- This is normal in development mode
- Production builds are much faster

## 📝 Notes

- Development builds are larger and slower than production builds
- The first build may take several minutes
- Production builds are optimized and compressed
- Installers are code-signed automatically if you provide certificates

## 🚢 Distribution

To distribute your app:

1. Build the installer: `npm run build:win`
2. Upload `dist/NarratorAI-1.0.0-x64.exe` to your website or GitHub releases
3. Users download and run the installer
4. NarratorAI is installed like any Windows application

For portable version:
- Users can run the `.exe` directly from any folder
- No installation required
- Settings stored in portable mode

## 🔐 Code Signing

For production releases, you should code-sign your application:

1. Obtain a code signing certificate
2. Configure in `electron-builder.json`:
   ```json
   "win": {
     "certificateFile": "path/to/cert.pfx",
     "certificatePassword": "your-password"
   }
   ```

This prevents Windows SmartScreen warnings for your users.
