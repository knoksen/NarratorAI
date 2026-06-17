# NarratorAI v1.1.0 - Professional Desktop Features 🎉

## Transform Your PDFs into Engaging Audio Narratives with AI!

NarratorAI v1.1.0 brings professional desktop features including batch processing, settings management, auto-updates, toast notifications, and more!

---

## ✨ What's New in v1.1.0

### ⚙️ Settings/Preferences System
- Comprehensive settings dialog (Ctrl+,)
- Encrypted API key storage using OS-level security
- Theme selection (Light/Dark/System)
- Default save path configuration
- Voice model and language preferences
- Auto-update toggle
- Minimize to tray option
- Launch at startup option

### 🔄 Auto-Update System
- Automatic update checks (10s after startup, every 12 hours)
- Manual "Check for Updates" in Help menu
- Download progress tracking
- User-friendly notification dialogs

### 📦 Batch Processing
- Process multiple PDFs at once
- Queue management (add, remove, clear)
- Start, pause, resume, cancel controls
- Per-file progress tracking
- Overall progress visualization
- "Open Multiple PDFs" (Ctrl+Shift+O)

### 📋 Recent Files
- Quick access to recent PDFs
- Keyboard shortcuts (Ctrl+1 through Ctrl+9)
- Up to 10 recent files tracked

### 🔔 Toast Notifications
- Success, error, warning, info types
- Native desktop alerts
- File processing status updates

---

## 📦 Downloads

### Windows Installer (Recommended)
**File:** `NarratorAI-1.1.0-x64.exe`  
**Size:** ~356 MB  
**SHA256:** `19A67790AA67025D524E1DFE665CDF54460E2F1DD68291CB320F75547B09BB27`

- ✅ Standard Windows installer (NSIS)
- ✅ Creates Desktop and Start Menu shortcuts
- ✅ Includes uninstaller

### Portable Version
**File:** `NarratorAI-1.1.0-Portable.exe`  
**Size:** ~356 MB  
**SHA256:** `E07B4C4EA194C25FCF0AFA01773D9594AE280797EA7794E0C3F83DF4613D92AD`

- ✅ No installation required
- ✅ Run from any folder or USB drive
- ✅ No admin rights needed

---

## 🚀 Getting Started

### Prerequisites
1. **Windows 10 or 11** (64-bit)
2. **Google AI API Key** - Get free at [Google AI Studio](https://makersuite.google.com/app/apikey)
3. **Internet Connection** - Required for AI processing

### Installation
1. Download `NarratorAI-1.1.0-x64.exe`
2. Run the installer
3. Launch from Desktop or Start Menu

### First Launch
1. Start NarratorAI
2. Press Ctrl+, to open Settings
3. Enter your Google AI API key
4. Upload a PDF
5. Click "Enhance with AI"
6. Click "Convert to Speech"
7. Save your audio!

---

## ⌨️ New Keyboard Shortcuts

- **Ctrl+,** - Open Settings/Preferences
- **Ctrl+Shift+O** - Open Multiple PDFs
- **Ctrl+1-9** - Open Recent Files

---

## 🛠️ Technical Stack

- **Frontend:** Next.js 16.1.1
- **Desktop:** Electron 40.x
- **AI Models:** Google Gemini 2.0 Flash, Gemini 2.5 Flash TTS
- **Language:** TypeScript 5.9.2
- **UI:** React, Tailwind CSS, Radix UI

---

## 🔧 Upgrading from v1.0.0

Users upgrading from v1.0.0:
1. Backup your saved audio files (optional)
2. Uninstall v1.0.0 OR install to same folder
3. Run v1.1.0 installer
4. Re-enter API key in Settings (Ctrl+,)

---

## ⚠️ Important Notes

### Windows SmartScreen
Since this release is not code-signed, Windows may show a security warning:
1. Click **"More info"**
2. Click **"Run anyway"**

### API Usage
- Google AI API has a generous free tier
- Monitor usage in Google AI Studio
- Check pricing at [Google AI Pricing](https://ai.google.dev/pricing)

---

## 🐛 Known Issues

- Large PDFs (>100 pages) may take longer to process
- Audio generation limited to 5000 characters per request

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/knoksen/NarratorAI/issues)
- **Discussions:** [GitHub Discussions](https://github.com/knoksen/NarratorAI/discussions)

---

## 🎯 What's Next?

Planned for future releases:
- Multiple voice and language options
- Additional export formats (MP3, M4A, FLAC)
- macOS and Linux support
- Enhanced keyboard shortcuts panel

---

**Thank you for using NarratorAI!** 🚀
