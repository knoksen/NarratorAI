# NarratorAI v1.2.0 Feature Plan

**Target Release:** Q1 2026  
**Focus:** Power User Features & Quality Improvements  
**Status:** Planning Phase

---

## Overview

Building on the solid foundation of v1.1.0 (Settings, Auto-Update, Batch Processing, Recent Files, Notifications), v1.2.0 will focus on power user features and quality improvements to make NarratorAI a professional-grade tool.

---

## Feature Roadmap

### Phase 1: Enhanced Audio Controls (Week 1-2)

#### 1.1 Multiple Voice Options
**Priority:** HIGH  
**Complexity:** MEDIUM  
**Dependencies:** Genkit TTS API

**Features:**
- Voice selection dropdown in UI
- Support for multiple Gemini TTS voices
- Voice preview functionality
- Per-file voice settings
- Voice favorites/presets

**Technical Implementation:**
```typescript
interface VoiceOption {
  id: string;
  name: string;
  language: string;
  gender: 'male' | 'female' | 'neutral';
  description: string;
  preview?: string;
}
```

**Files to Modify:**
- `src/ai/flows/convert-text-to-speech.ts` - Add voice parameter
- `src/components/narrator-ai/narrator-client-page.tsx` - Voice selector UI
- `electron/settings.js` - Add voice presets

---

#### 1.2 Language Support
**Priority:** HIGH  
**Complexity:** MEDIUM  
**Dependencies:** Genkit multilingual support

**Features:**
- Multiple language selection
- Automatic language detection from PDF
- Language-specific voices
- Translation option (future enhancement)

**Supported Languages (Initial):**
- English (US, UK, AU)
- Spanish
- French
- German
- Japanese
- Chinese (Simplified)

---

#### 1.3 Export Format Options
**Priority:** HIGH  
**Complexity:** MEDIUM  
**Dependencies:** FFmpeg or similar audio library

**Features:**
- Export to MP3 (variable bitrate)
- Export to M4A/AAC
- Export to FLAC (lossless)
- Export to OGG Vorbis
- Quality/bitrate selection
- File size estimation

**Technical Implementation:**
```bash
# FFmpeg integration
npm install fluent-ffmpeg @types/fluent-ffmpeg
```

**Files to Create:**
- `electron/audio-converter.js` - FFmpeg wrapper
- `src/components/narrator-ai/export-options-dialog.tsx` - Export UI

---

#### 1.4 Advanced Audio Controls
**Priority:** MEDIUM  
**Complexity:** LOW  
**Dependencies:** None

**Features:**
- Playback speed control (0.5x - 2.0x)
- Pitch adjustment
- Volume normalization
- Silence trimming
- Audio effects (reverb, echo)

---

### Phase 2: User Experience Enhancements (Week 3-4)

#### 2.1 Drag-and-Drop Enhancement
**Priority:** HIGH  
**Complexity:** LOW  
**Dependencies:** None

**Features:**
- Drag PDF onto app window
- Drag multiple PDFs for batch processing
- Visual drop zone with animation
- File validation feedback
- Integration with recent files

**Files to Modify:**
- `src/components/narrator-ai/narrator-client-page.tsx`
- `electron/main.js` - Add file protocol handler

---

#### 2.2 File Associations
**Priority:** MEDIUM  
**Complexity:** MEDIUM  
**Dependencies:** Windows registry, macOS Launch Services

**Features:**
- "Open with NarratorAI" context menu
- Default PDF handler option
- Custom file types (.nai project files)
- Protocol handler (narratorai://open?file=...)

**Technical Implementation:**
```javascript
// electron-builder config
"fileAssociations": [
  {
    "ext": "pdf",
    "name": "PDF Document",
    "role": "Viewer"
  }
]
```

---

#### 2.3 Keyboard Shortcuts Panel
**Priority:** LOW  
**Complexity:** LOW  
**Dependencies:** None

**Features:**
- Comprehensive shortcuts list in Help menu
- Searchable shortcuts
- Customizable shortcuts (future)
- Printable shortcuts reference
- Shortcuts tutorial for new users

**Files to Create:**
- `electron/shortcuts.html` - Shortcuts panel
- `src/components/narrator-ai/shortcuts-dialog.tsx` - React component

---

#### 2.4 Project Files
**Priority:** MEDIUM  
**Complexity:** MEDIUM  
**Dependencies:** None

**Features:**
- Save processing state as .nai file
- Include PDF, enhanced markdown, audio settings
- Resume interrupted processing
- Project history and versioning
- Export/import project settings

**File Format:**
```json
{
  "version": "1.0",
  "pdf": "base64_or_path",
  "markdown": "enhanced_text",
  "settings": {
    "voice": "en-US-Neural2-A",
    "speed": 1.0,
    "format": "mp3"
  },
  "metadata": {
    "created": "2026-01-17T...",
    "modified": "2026-01-17T..."
  }
}
```

---

### Phase 3: Quality & Reliability (Week 5-6)

#### 3.1 Testing Suite
**Priority:** HIGH  
**Complexity:** HIGH  
**Dependencies:** Jest, Playwright

**Features:**
- Unit tests for all modules
- Integration tests for AI flows
- E2E tests for desktop app
- Automated test runs in CI/CD
- Code coverage reporting (target: 80%)

**Technical Implementation:**
```bash
npm install --save-dev jest @types/jest ts-jest
npm install --save-dev @playwright/test
npm install --save-dev electron-playwright-helpers
```

**Test Structure:**
```
test/
  ├── unit/
  │   ├── settings.test.ts
  │   ├── updater.test.ts
  │   ├── batch-processor.test.ts
  │   └── toast-manager.test.ts
  ├── integration/
  │   ├── pdf-conversion.test.ts
  │   ├── tts-generation.test.ts
  │   └── batch-processing.test.ts
  └── e2e/
      ├── app-launch.test.ts
      ├── file-processing.test.ts
      └── settings-flow.test.ts
```

---

#### 3.2 Error Handling & Recovery
**Priority:** HIGH  
**Complexity:** MEDIUM  
**Dependencies:** None

**Features:**
- Graceful error handling for all operations
- Automatic retry with exponential backoff
- Error reporting dialog with details
- Recovery from partial processing
- Network error handling

**Files to Create:**
- `electron/error-handler.js` - Centralized error handling
- `src/hooks/use-error-boundary.ts` - React error boundary

---

#### 3.3 Debug Logging System
**Priority:** MEDIUM  
**Complexity:** MEDIUM  
**Dependencies:** Winston or similar

**Features:**
- Structured logging with levels
- Log rotation and file management
- User-shareable log export
- Debug mode toggle in settings
- Performance logging

**Technical Implementation:**
```bash
npm install winston winston-daily-rotate-file
```

**Files to Create:**
- `electron/logger.js` - Winston configuration
- Settings option for log level

---

#### 3.4 Performance Optimization
**Priority:** MEDIUM  
**Complexity:** MEDIUM  
**Dependencies:** None

**Features:**
- Lazy loading for components
- Audio streaming instead of full load
- Memory usage optimization
- Faster PDF parsing
- Background processing optimization

**Optimization Areas:**
- Reduce app startup time (target: <3s)
- Optimize memory usage (target: <500MB)
- Improve PDF conversion speed (target: <10s for 100 pages)
- Reduce installer size (target: <150MB)

---

### Phase 4: Cross-Platform Support (Week 7-8)

#### 4.1 macOS Build
**Priority:** HIGH  
**Complexity:** HIGH  
**Dependencies:** macOS build environment, Apple Developer account

**Features:**
- Universal binary (Apple Silicon + Intel)
- DMG installer with custom background
- macOS code signing
- Notarization for Gatekeeper
- App Store distribution (future)

**Technical Implementation:**
```json
// electron-builder config
"mac": {
  "target": ["dmg", "zip"],
  "arch": ["x64", "arm64"],
  "category": "public.app-category.productivity",
  "hardenedRuntime": true,
  "gatekeeperAssess": false,
  "entitlements": "build/entitlements.mac.plist"
}
```

---

#### 4.2 Linux Build
**Priority:** MEDIUM  
**Complexity:** MEDIUM  
**Dependencies:** Linux build environment

**Features:**
- AppImage for universal compatibility
- Snap package for Ubuntu/derivatives
- Flatpak for Flathub distribution
- .deb package for Debian-based
- .rpm package for Red Hat-based

**Technical Implementation:**
```json
// electron-builder config
"linux": {
  "target": ["AppImage", "snap", "deb", "rpm"],
  "category": "Office",
  "maintainer": "knoksen",
  "icon": "build/icon.icns"
}
```

---

### Phase 5: Analytics & Telemetry (Week 9-10)

#### 5.1 Anonymous Usage Tracking
**Priority:** LOW  
**Complexity:** MEDIUM  
**Dependencies:** Analytics service (PostHog, Mixpanel, or self-hosted)

**Features:**
- Opt-in anonymous analytics
- Usage statistics (files processed, features used)
- Performance metrics
- Error tracking
- No PII collection
- Full transparency with user

**Tracked Metrics:**
- App launches
- Features used
- Average processing time
- Error frequency and types
- OS version and hardware specs (anonymized)

---

#### 5.2 Crash Reporting
**Priority:** MEDIUM  
**Complexity:** MEDIUM  
**Dependencies:** Sentry or similar

**Features:**
- Automatic crash detection
- Stack trace collection
- User-consent crash reporting
- Symbol server for debugging
- Crash analysis dashboard

---

## Development Priorities

### Must Have (v1.2.0)
- ✅ Multiple voice options
- ✅ Export format options (MP3, M4A)
- ✅ Drag-and-drop enhancement
- ✅ Testing suite (basic coverage)
- ✅ Error handling improvements

### Should Have (v1.2.0 or v1.3.0)
- ⚡ Language support
- ⚡ File associations
- ⚡ Debug logging system
- ⚡ Performance optimization
- ⚡ macOS build

### Nice to Have (Future versions)
- 🎯 Project files (.nai)
- 🎯 Advanced audio controls
- 🎯 Linux build
- 🎯 Analytics & telemetry
- 🎯 Keyboard shortcuts customization

---

## Technical Debt & Improvements

### Code Quality
- [ ] Add JSDoc comments to all functions
- [ ] Implement consistent error handling patterns
- [ ] Create shared types/interfaces file
- [ ] Refactor large components into smaller pieces
- [ ] Add input validation everywhere

### Architecture
- [ ] Implement service layer pattern
- [ ] Create event bus for cross-component communication
- [ ] Add state management (Zustand or Redux)
- [ ] Implement plugin architecture for extensibility
- [ ] Create configuration system

### Documentation
- [ ] API documentation for developers
- [ ] User guide with screenshots
- [ ] Video tutorials
- [ ] FAQ section
- [ ] Contributing guidelines

---

## Risk Assessment

### High Risk
1. **FFmpeg Integration** - Complex audio conversion may cause issues
   - Mitigation: Thorough testing, fallback to WAV
2. **Cross-Platform Compatibility** - Different OS behaviors
   - Mitigation: Extensive testing on each platform
3. **Performance Issues** - Large PDFs may cause slowdowns
   - Mitigation: Streaming, chunking, progress indicators

### Medium Risk
1. **Dependency Updates** - Breaking changes in libraries
   - Mitigation: Careful testing, version pinning
2. **File Association Conflicts** - Other PDF readers
   - Mitigation: Optional feature, clear user consent
3. **Test Coverage** - Time-consuming to achieve 80%
   - Mitigation: Focus on critical paths first

### Low Risk
1. **UI/UX Changes** - User confusion
   - Mitigation: Gradual rollout, documentation
2. **Settings Migration** - Breaking existing settings
   - Mitigation: Migration scripts, backwards compatibility

---

## Success Metrics

### User Engagement
- Daily active users: +50%
- Average session length: >10 minutes
- Feature adoption rate: >60% for new features
- Retention rate (30-day): >40%

### Quality Metrics
- Crash rate: <1% of sessions
- Bug reports: <10 per week
- Average rating: >4.5 stars
- Test coverage: >80%

### Performance Metrics
- App startup time: <3 seconds
- PDF processing: <10s per 100 pages
- Memory usage: <500MB average
- Installer size: <150MB

---

## Timeline & Milestones

### Week 1-2: Audio Enhancements
- Milestone: Multiple voices and export formats working
- Deliverable: Voice selector UI, MP3/M4A export

### Week 3-4: UX Improvements
- Milestone: Drag-and-drop and file associations
- Deliverable: Enhanced file handling

### Week 5-6: Quality & Testing
- Milestone: Test suite with >50% coverage
- Deliverable: Automated tests running in CI/CD

### Week 7-8: Cross-Platform
- Milestone: macOS build working
- Deliverable: Signed macOS installer

### Week 9-10: Analytics & Polish
- Milestone: Telemetry system operational
- Deliverable: Analytics dashboard

### Week 11-12: Release
- Milestone: v1.2.0 released
- Deliverable: Public release with changelog

---

## Resources Needed

### Development
- FFmpeg binaries for all platforms
- macOS build machine or CI/CD access
- Linux build environment
- Testing devices (Windows, macOS, Linux)

### Services
- GitHub Actions minutes for CI/CD
- Code signing certificates
- Analytics service (if not self-hosted)
- Crash reporting service

### Documentation
- Technical writer (optional)
- Video production tools
- Screenshot tools

---

## Next Steps

1. **Review & Approve Plan** - Stakeholder sign-off
2. **Set Up Development Environment** - Install FFmpeg, set up test runners
3. **Create Feature Branches** - One branch per major feature
4. **Begin Phase 1 Development** - Start with voice options
5. **Set Up CI/CD Pipeline** - Automate testing and builds
6. **Create Beta Testing Program** - Get early user feedback

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-17  
**Next Review:** 2026-02-01
