# Changelog

All notable changes to NarratorAI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-12

### Added
- 🎉 **Initial Release** - First public release of NarratorAI
- 📄 **PDF to Markdown Conversion** - Extract text content from PDF documents
- 🤖 **AI-Powered Enhancement** - Transform text into engaging narratives using Google Gemini 2.0 Flash
- 🎙️ **Text-to-Speech Conversion** - Generate natural audio using Gemini 2.5 Flash TTS
- 🖥️ **Windows Desktop Application** - Native Electron-based desktop app
- ⌨️ **Keyboard Shortcuts** - Professional shortcuts for power users
  - `Ctrl+O` - Open file
  - `Ctrl+S` - Save audio
  - `Ctrl+R` - Reload
  - `F11` - Fullscreen
  - `Alt+F4` - Close
  - `Ctrl+=/−/0` - Zoom controls
- 🎨 **System Tray Integration** - Minimize to tray, quick access
- 📋 **Drag & Drop Support** - Easy PDF upload
- 🎯 **About Dialog** - View version and system information
- 🖱️ **Native Menu System** - Complete File/Edit/View/Help menus
- 🎨 **Custom Branding** - Purple/blue gradient application icon

### Technical
- Built with Next.js 16.1.1 and Turbopack
- Electron 33.x for desktop framework
- TypeScript 5.9.2 with strict mode
- Google Gemini AI integration via Genkit
- React with Tailwind CSS and Radix UI components
- electron-builder for Windows packaging
- Zero security vulnerabilities

### Build & Distribution
- NSIS installer for Windows
- Portable executable version
- Automated icon generation (PNG and ICO)
- SHA256 checksums for verification
- GitHub Release automation
- CI/CD pipeline with GitHub Actions

### Documentation
- Comprehensive README with setup instructions
- Desktop features documentation
- Build and distribution guides
- API key configuration guide
- Troubleshooting section

[1.0.0]: https://github.com/knoksen/NarratorAI/releases/tag/v1.0.0
