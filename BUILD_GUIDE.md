# NarratorAI - Build & Distribution Guide

This guide covers building and distributing the NarratorAI desktop application for Windows.

## 📋 Prerequisites

- Node.js 18+ installed
- Windows OS (for building Windows installers)
- All dependencies installed: `npm install`

## 🏗️ Build Process

### Quick Build (Recommended)

Build both installer and portable versions:

```bash
npm run build:win
```

This will:
1. Generate the ICO icon file
2. Build Next.js for production
3. Package Electron application
4. Create both NSIS installer and portable .exe

### Individual Builds

**NSIS Installer only:**
```bash
npm run build:win
```

**Portable version only:**
```bash
npm run build:portable
```

**Test packaging without creating installers:**
```bash
npm run pack
```

## 📦 Build Artifacts

After building, you'll find these files in the `dist/` folder:

### Distribution Files

1. **`NarratorAI-1.0.0-x64.exe`** (~176 MB)
   - Full Windows installer (NSIS)
   - Installs to Program Files
   - Creates Start Menu shortcuts
   - Creates Desktop shortcut
   - Includes uninstaller
   - Recommended for most users

2. **`NarratorAI-1.0.0-Portable.exe`** (~175 MB)
   - Portable executable
   - No installation required
   - Can run from any folder
   - No admin rights needed
   - Perfect for USB drives or testing

### Support Files

- `latest.yml` - Update metadata (for auto-updates)
- `NarratorAI-1.0.0-x64.exe.blockmap` - Delta update support
- `win-unpacked/` - Unpacked application files (for testing)

## 🎨 Icon Generation

The build process automatically generates the Windows ICO icon, but you can also generate icons manually:

**Generate PNG icon (512x512):**
```bash
npm run icon:generate
```

**Generate ICO icon (multi-size):**
```bash
npm run icon:ico
```

**Check icon status:**
```bash
npm run icon:check
```

### Icon Files

- `electron/icon.png` - Source PNG (512x512)
- `electron/icon.ico` - Windows ICO (256, 128, 64, 48, 32, 16px)
- `electron/resources/icon.ico` - Same ICO in resources folder

## 🚀 Distribution

### For End Users

**Method 1: Installer (Recommended)**
1. Share `NarratorAI-1.0.0-x64.exe`
2. Users run the installer
3. Choose installation directory
4. Desktop and Start Menu shortcuts are created

**Method 2: Portable**
1. Share `NarratorAI-1.0.0-Portable.exe`
2. Users can run it directly from any folder
3. No installation required

### File Sharing Options

- Upload to GitHub Releases
- Share via cloud storage (Google Drive, Dropbox, OneDrive)
- Host on your website
- USB drive distribution

## 🔧 Configuration

### Version Number

Update version in `package.json`:
```json
{
  "version": "1.0.0"
}
```

### Application Details

Edit `electron-builder.json`:
```json
{
  "appId": "com.narratorai.app",
  "productName": "NarratorAI",
  "copyright": "Copyright © 2026 ${author}"
}
```

### Build Targets

Modify targets in `electron-builder.json` under `win.target`:
```json
{
  "win": {
    "target": [
      {"target": "nsis", "arch": ["x64"]},
      {"target": "portable", "arch": ["x64"]}
    ]
  }
}
```

Available targets:
- `nsis` - NSIS installer
- `portable` - Portable executable
- `appx` - Windows Store package
- `msi` - MSI installer
- `zip` - Simple ZIP archive

## 🐛 Troubleshooting

### Build Fails

**Error: "cannot find specified resource electron/icon.ico"**
- Run: `npm run icon:ico`
- This creates the ICO file required for building

**Error: "ERESOLVE could not resolve"**
- Use: `npm install --legacy-peer-deps`
- This is expected with Next.js 16 and Electron

**Error: "ENOENT: no such file or directory, open '.next/BUILD_ID'"**
- Run: `npm run build` first
- The Next.js build must complete before Electron packaging

### Large File Size

The ~175 MB size is normal and includes:
- Electron framework (~80 MB)
- Chromium engine (~50 MB)
- Node.js runtime (~15 MB)
- Next.js app + dependencies (~30 MB)

**To reduce size:**
- Remove unused dependencies
- Use `electron-builder` compression options
- Consider using `asar` archives (already enabled)
- Remove unnecessary Next.js pages

### Slow Build

First build downloads Electron binaries and may take 5-10 minutes. Subsequent builds are faster (1-2 minutes).

## 📝 Development vs Production

### Development Build
```bash
npm run electron:dev
```
- Hot reload enabled
- DevTools open by default
- Reads from Next.js dev server (port 9002)
- Instant changes

### Production Build
```bash
npm run build:win
```
- Optimized for performance
- No hot reload
- Bundled static files
- Ready for distribution

## ✅ Testing Builds

Before distribution, test both versions:

1. **Test the unpacked version:**
   ```bash
   npm run pack
   cd dist/win-unpacked
   ./NarratorAI.exe
   ```

2. **Test the installer:**
   - Run `dist/NarratorAI-1.0.0-x64.exe`
   - Install to a test location
   - Verify shortcuts work
   - Test uninstaller

3. **Test the portable version:**
   - Run `dist/NarratorAI-1.0.0-Portable.exe` directly
   - Test from different folders
   - Verify no admin rights needed

## 🔐 Code Signing (Optional)

For production releases, consider code signing to avoid Windows security warnings:

1. Obtain a code signing certificate
2. Add to `electron-builder.json`:
   ```json
   {
     "win": {
       "certificateFile": "path/to/cert.pfx",
       "certificatePassword": "password"
     }
   }
   ```

Without signing, users will see "Unknown publisher" warnings.

## 📊 Build Statistics

Typical build times (on average hardware):
- Next.js build: 8-15 seconds
- Icon generation: <1 second
- Electron packaging: 30-60 seconds
- NSIS installer creation: 10-20 seconds
- **Total: ~1-2 minutes**

## 🎯 Next Steps

After successful build:
1. Test both installer and portable versions
2. Consider code signing for production
3. Create GitHub Release with download links
4. Write release notes describing features
5. Share with users!

---

**Built with:**
- Next.js 16.1.1 (with Turbopack)
- Electron 33.x
- electron-builder 25.x
- Windows NSIS installer
