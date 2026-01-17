# Changelog

All notable changes to NarratorAI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- 🎭 Multiple voice and language options
- 🎵 Additional export formats (MP3, M4A, FLAC)
- 🍎 macOS support (Apple Silicon + Intel)
- 🐧 Linux support (AppImage/Snap/Flatpak)
- 🎯 File associations ("Open with NarratorAI")
- ⌨️ Enhanced keyboard shortcuts panel
- 🧪 Testing suite (Unit + E2E)
- 📊 Anonymous telemetry and analytics
- 🐛 Debug logging system

## [1.1.0] - 2026-01-17

### Added
- ⚙️ **Settings/Preferences System** - Comprehensive settings management
  - Encrypted API key storage using OS-level security
  - Theme selection (Light/Dark/System)
  - Default save path configuration
  - Voice model and language preferences
  - Behavior settings (auto-update, minimize to tray, launch at startup)
  - Settings dialog with Ctrl+, shortcut
  - Professional UI with live save notifications
- 🔄 **Auto-Update System** - Seamless updates via GitHub Releases
  - Automatic update checks (10s after startup, then every 12 hours)
  - Manual "Check for Updates" in Help menu
  - Download progress tracking
  - User-friendly notification dialogs
  - Settings-driven auto-update toggle
  - Dev mode detection (skips in development)
- 📦 **Batch Processing** - Process multiple PDFs efficiently
  - Queue management (add, remove, clear multiple files)
  - Processing controls (start, pause, resume, cancel)
  - Per-file progress tracking with status badges
  - Overall progress visualization
  - Real-time event updates
  - Results summary (completed/failed/skipped)
  - "Open Multiple PDFs" menu item (Ctrl+Shift+O)
  - Professional UI with shadcn/ui components
- 📋 **Recent Files Integration** - Quick access to recent PDFs
  - Dynamic "Recent Files" submenu in File menu
  - Keyboard shortcuts (Ctrl+1 through Ctrl+9)
  - File tooltips with full paths
  - "Clear Recent Files" option
  - Auto-refresh on file operations
  - Tracks up to 10 recent files
  - React component for in-app display
- 🔔 **Toast Notifications** - Native desktop alerts
  - Multiple notification types (success, error, warning, info)
  - Customizable options (silent, urgency, timeout, actions)
  - Helper methods for common scenarios
  - React hook for easy integration (useToast)
  - Platform support detection
  - File processing status notifications
  - Batch completion alerts

### Changed
- ⬆️ **Dependency Updates** - All packages updated to latest compatible versions
  - Updated Genkit dependencies to v1.27.0
  - Updated Next.js to v16.1.3
  - Updated all Radix UI components to latest versions
  - Updated React Hook Form to v7.71.1
  - Updated Tailwind CSS to v3.4.19
  - Updated TypeScript to v5.9.3
  - Updated Electron to v40.0.0
  - Updated electron-builder to v26.4.0
  - Updated lucide-react to v0.562.0
- 🏗️ **Architecture Improvements**
  - Event-driven batch processing with EventEmitter
  - Modular manager classes (Settings, Updater, Batch, Toast)
  - IPC communication patterns established
  - React hooks for renderer integration
  - Settings-driven feature toggling

### Fixed
- 🔒 **Security Vulnerabilities** - Reduced from 15 to 5 high-severity issues
  - Updated electron-builder to address NSIS installer vulnerability
  - Addressed multiple tar package vulnerabilities
  - Fixed ESM module compatibility with electron-store
  - Remaining vulnerabilities are nested in electron-builder dependencies
- 🐛 **Bug Fixes**
  - Fixed electron-store import issues (ESM vs CommonJS)
  - Fixed settings persistence across app restarts
  - Fixed menu refresh on recent files changes

### Security
- 🔐 OS-level encryption for API keys using Electron safeStorage
- 🔒 Secure IPC communication via contextBridge
- 🛡️ No credentials exposed in logs or error messages
- ✅ Updated dependencies to address known vulnerabilities

### Technical
- 📝 ~1,950 lines of production code added
- 🧩 9 new modules created
- 🔧 4 core files significantly enhanced
- 📚 Comprehensive session documentation
- ✅ All code passes TypeScript type checking
- 🎯 Zero TypeScript errors

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

[Unreleased]: https://github.com/knoksen/NarratorAI/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/knoksen/NarratorAI/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/knoksen/NarratorAI/releases/tag/v1.0.0
