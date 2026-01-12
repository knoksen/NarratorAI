# NarratorAI v1.0.0 - First Release 🎉

## Transform Your PDFs into Engaging Audio Narratives with AI!

NarratorAI is a powerful Windows desktop application that converts PDF documents into professionally narrated audio files using cutting-edge AI technology.

---

## ✨ Features

### Core Functionality
- **📄 PDF to Markdown Conversion** - Extract text content from any PDF document
- **🤖 AI-Powered Enhancement** - Transform dry text into engaging narratives using Google Gemini 2.0 Flash
- **🎙️ Premium Text-to-Speech** - Generate natural-sounding audio with Gemini 2.5 Flash TTS
- **⚡ Fast Processing** - Optimized workflows for quick turnaround

### Desktop Experience
- **🖥️ Native Windows Application** - Full desktop integration with system menus
- **⌨️ Keyboard Shortcuts** - Professional shortcuts for power users (Ctrl+O, Ctrl+S, F11, etc.)
- **🎨 System Tray Support** - Minimize to tray, quick access from system tray icon
- **📋 Drag & Drop** - Easy PDF upload with drag-and-drop support
- **🎯 About Dialog** - View app version and system information

### User Interface
- **🌓 Modern Design** - Clean, intuitive interface built with React and Tailwind CSS
- **📱 Responsive Layout** - Optimized for various window sizes
- **🔍 Zoom Controls** - Adjust interface size with Ctrl+/Ctrl-/Ctrl+0
- **🖱️ Menu System** - Complete File/Edit/View/Help menus

---

## 📦 Downloads

### Windows Installer (Recommended)
**File:** `NarratorAI-1.0.0-x64.exe`  
**Size:** 175.72 MB  
**SHA256:** `82092A35B47BA86EFE318B373CFE42E3FD84A710302234D52F4A8C41FE65E706`

- ✅ Standard Windows installer (NSIS)
- ✅ Creates Desktop and Start Menu shortcuts
- ✅ Includes uninstaller
- ✅ Professional installation experience

### Portable Version
**File:** `NarratorAI-1.0.0-Portable.exe`  
**Size:** 175.45 MB  
**SHA256:** `39A6B01FA9B370DB14539462FC9A26AA27ABDF852254C1223FB0DABC4C56C3A4`

- ✅ No installation required
- ✅ Run from any folder or USB drive
- ✅ No admin rights needed
- ✅ Perfect for testing or portable use

---

## 🚀 Getting Started

### Prerequisites
1. **Windows 10 or 11** (64-bit)
2. **Google AI API Key** (free) - Get yours at [Google AI Studio](https://makersuite.google.com/app/apikey)
3. **Internet Connection** - Required for AI processing

### Installation

#### Option 1: Full Installer
1. Download `NarratorAI-1.0.0-x64.exe`
2. Run the installer
3. Choose installation directory
4. Complete setup
5. Launch from Desktop or Start Menu

#### Option 2: Portable
1. Download `NarratorAI-1.0.0-Portable.exe`
2. Move to desired folder
3. Double-click to run
4. No installation needed!

### First Launch
1. Start NarratorAI
2. When prompted, enter your Google AI API key
   - Or set environment variable: `GOOGLE_API_KEY=your-key-here`
3. Upload a PDF document
4. Click "Enhance with AI" to improve the narrative
5. Click "Convert to Speech" to generate audio
6. Download your narrated audio file!

---

## ⌨️ Keyboard Shortcuts

- **Ctrl+O** - Open file
- **Ctrl+S** - Save audio
- **Ctrl+R** - Reload application
- **F11** - Toggle fullscreen
- **Alt+F4** - Close application
- **Ctrl+=** - Zoom in
- **Ctrl+-** - Zoom out
- **Ctrl+0** - Reset zoom

---

## 🔧 System Requirements

### Minimum
- Windows 10 (64-bit)
- 4 GB RAM
- 500 MB free disk space
- Internet connection

### Recommended
- Windows 11 (64-bit)
- 8 GB RAM
- 1 GB free disk space
- Stable broadband connection

---

## ⚠️ Important Notes

### Windows SmartScreen Warning
Since this release is **not code-signed**, Windows may show a security warning:
- "Windows protected your PC"
- "Unknown publisher"

**This is normal.** To proceed:
1. Click **"More info"**
2. Click **"Run anyway"**

> **Note:** Future releases may include code signing to eliminate this warning.

### Firewall Prompt
On first launch, Windows Firewall may request network access:
- This is required for AI API communication
- Click **"Allow access"** to continue

### API Usage & Costs
- Google AI API has a **free tier** with generous limits
- Monitor your usage in Google AI Studio
- Review pricing at [Google AI Pricing](https://ai.google.dev/pricing)

---

## 📖 Documentation

- **README.md** - Project overview and setup
- **DESKTOP_FEATURES.md** - Complete feature documentation
- **BUILD_GUIDE.md** - Build from source instructions
- **RELEASE_READY.md** - Distribution guide

---

## 🛠️ Technical Stack

- **Frontend:** Next.js 16.1.1 with Turbopack
- **Desktop:** Electron 33.x
- **AI Models:** Google Gemini 2.0 Flash (enhancement), Gemini 2.5 Flash TTS (speech)
- **Language:** TypeScript 5.9.2
- **UI Framework:** React with Tailwind CSS & Radix UI
- **Build Tool:** electron-builder 26.4.0

---

## 🐛 Known Issues

- First launch may be slower as Windows scans the executable
- Large PDFs (>100 pages) may take longer to process
- Audio generation limited to 5000 characters per request

---

## 🤝 Contributing

This is an open-source project! Contributions welcome:
- Report bugs via GitHub Issues
- Submit feature requests
- Create pull requests
- Improve documentation

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Credits

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [Electron](https://www.electronjs.org/) - Desktop framework
- [Google Gemini](https://ai.google.dev/) - AI models
- [Genkit](https://firebase.google.com/docs/genkit) - AI orchestration
- [Shadcn/ui](https://ui.shadcn.com/) - UI components

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/knoksen/NarratorAI/issues)
- **Discussions:** [GitHub Discussions](https://github.com/knoksen/NarratorAI/discussions)
- **Documentation:** [Project README](https://github.com/knoksen/NarratorAI)

---

## 🎯 What's Next?

Future releases may include:
- macOS and Linux support
- Batch processing for multiple PDFs
- Custom voice selection
- Multiple language support
- Cloud synchronization
- Auto-update system

---

**Thank you for using NarratorAI!** 🚀

If you find this tool useful, please ⭐ star the repository and share it with others!
