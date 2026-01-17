# NarratorAI - Next Steps Action Plan

**Created:** January 17, 2026  
**Current Version:** 1.1.0 (prepared, not released)  
**Next Target:** v1.1.0 Release → v1.2.0 Development  
**Timeline:** Immediate (Week 1-2) + Short-term (Weeks 3-4)

---

## Immediate Actions (Today/This Week)

### Priority 1: Release v1.1.0 (HIGH - CRITICAL)

#### Step 1: Pre-Release Testing (2-3 hours)
**Owner:** QA/Developer  
**Status:** ⏳ PENDING

**Test Checklist:**
```bash
# 1. Build the installers
cd C:\Users\knoksen\APPZ\NarratorAI
npm run build:win

# Expected output:
# - dist/NarratorAI Setup 1.1.0.exe (~175MB)
# - dist/NarratorAI 1.1.0.exe (portable, ~175MB)
# - SHA256 checksums
```

**Manual Testing Matrix:**

| Feature | Test Case | Expected Result | Status |
|---------|-----------|-----------------|--------|
| **Installation** | Fresh install on Windows 10 | App installs without errors | ⏳ |
| **Installation** | Fresh install on Windows 11 | App installs without errors | ⏳ |
| **Installation** | Upgrade from v1.0.0 | Settings preserved, app works | ⏳ |
| **Launch** | App starts from desktop icon | Opens in <5 seconds | ⏳ |
| **Core: PDF Upload** | Open sample PDF | Converts to markdown | ⏳ |
| **Core: AI Enhancement** | Click "Enhance" | Text improved with emotion | ⏳ |
| **Core: TTS** | Generate audio | Audio file created | ⏳ |
| **Core: Playback** | Click play button | Audio plays smoothly | ⏳ |
| **Core: Export** | Save as WAV | File downloads correctly | ⏳ |
| **Settings** | Open settings (Ctrl+,) | Dialog opens | ⏳ |
| **Settings** | Enter API key | Saves encrypted | ⏳ |
| **Settings** | Change theme | Theme applies | ⏳ |
| **Settings** | Change default path | Path saves | ⏳ |
| **Auto-Update** | Check for updates | Shows "no updates" or dev message | ⏳ |
| **Batch** | Open multiple PDFs (Ctrl+Shift+O) | Files added to queue | ⏳ |
| **Batch** | Start processing | Queue processes sequentially | ⏳ |
| **Batch** | Pause processing | Processing pauses | ⏳ |
| **Batch** | Resume processing | Processing continues | ⏳ |
| **Batch** | Cancel processing | Remaining files skipped | ⏳ |
| **Recent Files** | Open a PDF | Appears in File > Recent Files | ⏳ |
| **Recent Files** | Use Ctrl+1 | Opens first recent file | ⏳ |
| **Recent Files** | Clear recent files | Menu cleared | ⏳ |
| **Notifications** | Complete file processing | Toast notification appears | ⏳ |
| **Notifications** | Batch complete | Summary notification shows | ⏳ |
| **System Tray** | Minimize to tray | App in system tray | ⏳ |
| **Menus** | All menu items | No broken items | ⏳ |
| **Performance** | Process 50-page PDF | Completes in <30 seconds | ⏳ |
| **Memory** | Extended use (30 mins) | <500MB memory | ⏳ |

**Bug Reporting Template:**
```markdown
## Bug Report
**Feature:** [e.g., Batch Processing]
**Test Case:** [e.g., Start batch with 5 PDFs]
**Expected:** [e.g., All files process]
**Actual:** [e.g., App crashes on file 3]
**Severity:** [Critical/High/Medium/Low]
**Steps to Reproduce:**
1. 
2. 
3. 
**Environment:** Windows [10/11], v1.1.0
**Screenshots:** [if applicable]
```

---

#### Step 2: Create GitHub Release (30 minutes)
**Owner:** Developer  
**Status:** ⏳ PENDING  
**Dependencies:** Step 1 passed

**Actions:**
```bash
# Option 1: Automated (Recommended)
npm run release

# Option 2: Manual via GitHub
# 1. Go to https://github.com/knoksen/NarratorAI/releases/new
# 2. Tag: v1.1.0
# 3. Title: "NarratorAI v1.1.0 - Professional Desktop Features"
# 4. Copy content from CHANGELOG.md (v1.1.0 section)
# 5. Upload installers:
#    - NarratorAI Setup 1.1.0.exe
#    - NarratorAI 1.1.0.exe (portable)
#    - SHA256 checksums
# 6. Publish release
```

**Release Description Template:**
```markdown
# NarratorAI v1.1.0 - Professional Desktop Features

Transform your documents into engaging audio narratives with AI-powered enhancement.

## 🎉 What's New

This release transforms NarratorAI into a professional desktop application with 5 major new features:

### ⚙️ Settings & Preferences
- Encrypted API key storage using OS-level security
- Theme selection (Light/Dark/System)
- Voice and behavior preferences
- Professional settings dialog (Ctrl+,)

### 🔄 Auto-Update System
- Automatic update checks every 12 hours
- Manual check in Help menu
- Download progress tracking
- Seamless update installation

### 📦 Batch Processing
- Process multiple PDF files in queue
- Full control: Start, Pause, Resume, Cancel
- Per-file progress tracking
- Professional UI with status badges
- Ctrl+Shift+O to open multiple files

### 📋 Recent Files
- Quick access to up to 10 recent files
- Keyboard shortcuts (Ctrl+1 through Ctrl+9)
- File tooltips with full paths
- Clear history option

### 🔔 Toast Notifications
- Native desktop alerts for all operations
- File processing status updates
- Batch completion summaries
- System-level notifications

## 🔧 Technical Improvements

- Updated to Genkit 1.27.0
- Updated to Next.js 16.1.3
- Updated to Electron 40.0.0
- Security: Reduced vulnerabilities by 67%
- Added ~1,950 lines of production code
- Full TypeScript type safety

## 📥 Download

Choose your preferred installation method:

- **Installer (Recommended):** `NarratorAI Setup 1.1.0.exe` - Full installation with auto-update
- **Portable:** `NarratorAI 1.1.0.exe` - Run without installation

## ⚡ Quick Start

1. Download and install
2. Launch NarratorAI
3. Press Ctrl+, to open settings
4. Enter your Google AI API key
5. Open a PDF (Ctrl+O)
6. Click "Generate Audio"
7. Enjoy your narrated content!

## 📚 Documentation

- [CHANGELOG](https://github.com/knoksen/NarratorAI/blob/main/CHANGELOG.md)
- [README](https://github.com/knoksen/NarratorAI/blob/main/README.md)
- [Feature Plan v1.2.0](https://github.com/knoksen/NarratorAI/blob/main/docs/FEATURE_PLAN_V1.2.0.md)

## 🐛 Known Issues

None critical. See [Issues](https://github.com/knoksen/NarratorAI/issues) for minor items.

## 💬 Feedback

Found a bug? Have a feature request? Open an [issue](https://github.com/knoksen/NarratorAI/issues/new)!

---

**Full Changelog**: https://github.com/knoksen/NarratorAI/compare/v1.0.0...v1.1.0
```

---

#### Step 3: Post-Release Actions (1 hour)
**Owner:** Developer  
**Status:** ⏳ PENDING  
**Dependencies:** Step 2 complete

**Checklist:**
- [ ] Verify installers download correctly from GitHub
- [ ] Test auto-update from v1.0.0 to v1.1.0
- [ ] Update website/landing page (if exists)
- [ ] Post announcement on social media
- [ ] Monitor GitHub issues for first 24 hours
- [ ] Check download statistics
- [ ] Respond to early user feedback

**Monitoring Dashboard:**
```
Track for first 48 hours:
- [ ] Download count: Target 50-100
- [ ] GitHub stars: Track growth
- [ ] Issues opened: React within 2 hours
- [ ] Auto-update success rate: Target >95%
- [ ] Crash reports: Target 0
```

---

## Phase 1: Quick Wins (Week 1-2)

### Priority 2: Integrate Existing Components (MEDIUM)

#### Task 1: Add Batch Processor to Main UI
**Effort:** 2-3 hours  
**Value:** HIGH (feature is built, just needs visibility)

**Implementation:**
```typescript
// File: src/app/page.tsx or narrator-client-page.tsx

import { BatchProcessorPanel } from '@/components/narrator-ai/batch-processor-panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Add tabs for single file vs batch processing
<Tabs defaultValue="single">
  <TabsList>
    <TabsTrigger value="single">Single File</TabsTrigger>
    <TabsTrigger value="batch">Batch Processing</TabsTrigger>
  </TabsList>
  
  <TabsContent value="single">
    {/* Existing single file UI */}
  </TabsContent>
  
  <TabsContent value="batch">
    <BatchProcessorPanel 
      onProcessFile={async (filePath, progressCallback) => {
        // Call existing processing function
        return await processFile(filePath);
      }}
    />
  </TabsContent>
</Tabs>
```

**Files to Modify:**
- `src/app/page.tsx` or `src/components/narrator-ai/narrator-client-page.tsx`

**Testing:**
- [ ] Batch tab appears
- [ ] Can add multiple files
- [ ] Processing works end-to-end
- [ ] Progress updates correctly

---

#### Task 2: Add Recent Files Component to Dashboard
**Effort:** 1-2 hours  
**Value:** MEDIUM (nice to have, menu already works)

**Implementation:**
```typescript
// File: src/app/page.tsx

import { RecentFilesList } from '@/components/narrator-ai/recent-files-list';

// Add to sidebar or dashboard
<aside className="w-64">
  <RecentFilesList 
    onFileSelect={(filePath) => {
      // Load the file
      loadFile(filePath);
    }}
  />
</aside>
```

**Testing:**
- [ ] Recent files display
- [ ] Clicking opens file
- [ ] List updates when new files processed

---

### Priority 3: Bug Fixes & Polish (LOW - As needed)

**Monitor for:**
- Crash reports
- Performance issues
- UI/UX confusion
- Settings not persisting
- Notification issues

**Create issues on GitHub for:**
- Any bugs found during testing
- User-reported problems
- Performance bottlenecks

---

## Phase 2: Begin v1.2.0 Development (Weeks 3-4)

### Milestone: Enhanced Audio Controls

#### Feature 1: Multiple Voice Options (Week 3)

**Requirements:**
- Research available Gemini TTS voices
- Create voice selection UI component
- Update TTS flow to accept voice parameter
- Add voice preview functionality
- Save voice preference in settings

**Implementation Steps:**

1. **Research Voices (Day 1)**
```bash
# Create test script to list available voices
# File: scripts/list-voices.js

const { gemini } = require('./ai/genkit');

async function listVoices() {
  // Query Gemini API for available voices
  // Document voice IDs, names, languages, genders
}
```

2. **Create Voice Selector Component (Day 2-3)**
```typescript
// File: src/components/narrator-ai/voice-selector.tsx

interface Voice {
  id: string;
  name: string;
  language: string;
  gender: 'male' | 'female' | 'neutral';
  description: string;
}

export function VoiceSelector({ 
  value, 
  onChange, 
  onPreview 
}: VoiceSelectorProps) {
  // Dropdown with voice options
  // Preview button for each voice
  // Favorites/recent voices
}
```

3. **Update TTS Flow (Day 4)**
```typescript
// File: src/ai/flows/convert-text-to-speech.ts

export const convertTextToSpeech = ai.defineFlow(
  {
    name: 'convertTextToSpeech',
    inputSchema: z.object({
      text: z.string(),
      voice: z.string().optional(), // NEW
      language: z.string().optional(), // NEW
    }),
    // ... rest of implementation
```

4. **Integrate into UI (Day 5)**
- Add voice selector to main page
- Connect to settings
- Add to batch processing options
- Test end-to-end

**Acceptance Criteria:**
- [ ] Can select from 5+ voices
- [ ] Voice preference saves in settings
- [ ] Can preview voice before generation
- [ ] Works with batch processing
- [ ] Audio quality unchanged

---

#### Feature 2: Export Format Options (Week 4)

**Requirements:**
- Install FFmpeg or audio conversion library
- Create export options dialog
- Implement format conversion
- Add quality/bitrate selection
- Update save dialog with format filter

**Implementation Steps:**

1. **Set Up FFmpeg (Day 1)**
```bash
# Install fluent-ffmpeg
npm install fluent-ffmpeg @types/fluent-ffmpeg --save

# Download FFmpeg binaries
# Add to electron/ffmpeg/ folder
# Update electron-builder to include binaries
```

2. **Create Audio Converter Module (Day 2)**
```javascript
// File: electron/audio-converter.js

const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

class AudioConverter {
  constructor() {
    // Set FFmpeg path
    this.setFFmpegPath();
  }
  
  async convertToMP3(inputPath, outputPath, bitrate = '192k') {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .audioBitrate(bitrate)
        .audioCodec('libmp3lame')
        .format('mp3')
        .output(outputPath)
        .on('end', resolve)
        .on('error', reject)
        .run();
    });
  }
  
  async convertToM4A(inputPath, outputPath, bitrate = '192k') {
    // Similar implementation for AAC/M4A
  }
  
  async convertToFLAC(inputPath, outputPath) {
    // Lossless conversion
  }
}

module.exports = new AudioConverter();
```

3. **Create Export Dialog (Day 3)**
```typescript
// File: src/components/narrator-ai/export-dialog.tsx

interface ExportOptions {
  format: 'wav' | 'mp3' | 'm4a' | 'flac' | 'ogg';
  quality: 'low' | 'medium' | 'high' | 'lossless';
  bitrate?: string; // For lossy formats
}

export function ExportDialog({ 
  audioPath, 
  onExport, 
  onCancel 
}: ExportDialogProps) {
  // Format selection
  // Quality/bitrate slider
  // File size estimation
  // Export button
}
```

4. **Integration & Testing (Day 4-5)**
- Update save handler in main.js
- Add conversion progress reporting
- Test all format conversions
- Verify audio quality
- Update batch export to support formats

**Acceptance Criteria:**
- [ ] Can export to MP3, M4A, FLAC
- [ ] Quality selection works
- [ ] File size estimates accurate
- [ ] Conversion completes in <10 seconds
- [ ] Audio quality maintained
- [ ] Works with batch processing

---

## Phase 3: Quality Improvements (Weeks 5-6)

### Task: Set Up Testing Framework

**Goal:** Achieve 50% code coverage by end of Week 6

**Implementation:**

1. **Install Testing Tools**
```bash
npm install --save-dev jest @types/jest ts-jest
npm install --save-dev @testing-library/react @testing-library/jest-dom
npm install --save-dev @playwright/test
```

2. **Create Test Structure**
```
test/
├── unit/
│   ├── settings.test.ts
│   ├── updater.test.ts
│   ├── batch-processor.test.ts
│   └── toast-manager.test.ts
├── integration/
│   ├── ai-flows.test.ts
│   └── file-processing.test.ts
└── e2e/
    ├── app-launch.spec.ts
    └── full-workflow.spec.ts
```

3. **Write Critical Tests First**
- Settings encryption/decryption
- Batch processor queue management
- Recent files tracking
- Update checker

4. **Set Up CI/CD Testing**
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test
      - run: npm run test:e2e
```

---

## Ongoing Tasks (Continuous)

### Documentation
- [ ] Update README with new features as added
- [ ] Keep CHANGELOG current
- [ ] Document any breaking changes
- [ ] Add JSDoc comments to new code

### Code Quality
- [ ] Run `npm run typecheck` before commits
- [ ] Keep `npm audit` clean
- [ ] Review dependency updates monthly
- [ ] Refactor long functions (>50 lines)

### Community
- [ ] Respond to GitHub issues within 24 hours
- [ ] Review and merge pull requests
- [ ] Update roadmap based on feedback
- [ ] Thank contributors

---

## Success Metrics

### v1.1.0 Release (Week 1)
- [ ] 0 critical bugs in first week
- [ ] 50+ downloads in first week
- [ ] 80%+ users auto-update from v1.0.0
- [ ] 4+ star rating (if applicable)

### v1.2.0 Development (Weeks 2-6)
- [ ] Voice selection implemented
- [ ] MP3/M4A export working
- [ ] 50% test coverage achieved
- [ ] 0 new security vulnerabilities
- [ ] All TypeScript checks passing

---

## Risk Mitigation

### Risk: Testing finds critical bugs
**Probability:** LOW  
**Impact:** HIGH  
**Mitigation:**
- Thorough pre-release testing
- Beta testing group (if available)
- Quick hotfix process ready (v1.1.1)

### Risk: FFmpeg integration issues
**Probability:** MEDIUM  
**Impact:** MEDIUM  
**Mitigation:**
- Test FFmpeg on multiple Windows versions
- Provide fallback to WAV-only if conversion fails
- Clear error messages for users

### Risk: Users don't discover new features
**Probability:** MEDIUM  
**Impact:** LOW  
**Mitigation:**
- In-app welcome message for v1.1.0
- Tooltips on new features
- "What's New" dialog on first launch
- Tutorial video (future)

---

## Decision Points

### Question 1: When to start v1.2.0?
**Options:**
- A) Immediately after v1.1.0 release
- B) Wait 1 week for feedback
- C) Wait for 100+ downloads

**Recommendation:** B - Wait 1 week for critical feedback, start v1.2.0 if no major issues

### Question 2: Which voice feature first?
**Options:**
- A) Multiple voices (more popular)
- B) Multiple languages (broader appeal)

**Recommendation:** A - Multiple voices easier to implement, can add languages next

### Question 3: Testing priority?
**Options:**
- A) E2E tests first (user perspective)
- B) Unit tests first (code quality)

**Recommendation:** B - Unit tests for critical modules (settings, batch) first, then E2E

---

## Resources Needed

### For Testing
- [ ] Windows 10 test machine
- [ ] Windows 11 test machine
- [ ] Sample PDF files (various sizes)

### For Development
- [ ] FFmpeg binaries (Windows)
- [ ] Google AI API credits (testing)
- [ ] Time: ~40 hours over 6 weeks

### For Distribution
- [ ] GitHub storage (releases)
- [ ] Bandwidth for downloads

---

## Weekly Milestones

**Week 1: v1.1.0 Release**
- Mon-Tue: Testing
- Wed: Release creation
- Thu-Fri: Monitoring & bug fixes

**Week 2: Preparation**
- Mon-Tue: Integrate batch UI
- Wed: Integrate recent files UI
- Thu-Fri: Research voices & FFmpeg

**Week 3: Voice Selection**
- Mon: FFmpeg setup
- Tue-Wed: Voice component
- Thu: TTS integration
- Fri: Testing

**Week 4: Export Formats**
- Mon-Tue: Audio converter
- Wed: Export dialog
- Thu: Integration
- Fri: Testing

**Week 5: Testing Setup**
- Mon-Tue: Install test frameworks
- Wed-Thu: Write unit tests
- Fri: CI/CD setup

**Week 6: Polish**
- Mon-Tue: More tests
- Wed: Bug fixes
- Thu: Documentation
- Fri: Prepare v1.2.0 release

---

## Contact & Communication

### Daily Standups (Solo)
- What did I accomplish yesterday?
- What will I work on today?
- Any blockers?

### Weekly Reviews
- Review progress vs plan
- Update timeline if needed
- Adjust priorities based on feedback

### Document Updates
- Update this plan weekly
- Keep CHANGELOG current
- Update README with progress

---

## Appendix: Quick Commands

```bash
# Development
npm run dev                    # Start Next.js
npm run electron:dev           # Start Electron
npm run typecheck             # Validate TypeScript
npm run lint                  # Check code style

# Building
npm run build:win             # Build Windows installer
npm run build:portable        # Build portable exe

# Testing (to be added)
npm run test                  # Run all tests
npm run test:unit             # Unit tests only
npm run test:e2e              # E2E tests only
npm run test:coverage         # Coverage report

# Release
npm run release               # Automated release
npm run version:patch         # Bump patch version
npm run version:minor         # Bump minor version

# Maintenance
npm audit                     # Check security
npm outdated                  # Check updates
npm run clean                 # Clean build files
```

---

## Summary

This action plan provides a clear path from v1.1.0 release through the first 6 weeks of v1.2.0 development. Focus areas:

1. **Week 1:** Release v1.1.0 and monitor
2. **Weeks 2-4:** Implement voice selection and export formats
3. **Weeks 5-6:** Set up testing and quality improvements

**Next Update:** End of Week 1 (after v1.1.0 release)

---

**Status:** 📋 PLAN READY  
**Owner:** Development Team  
**Last Updated:** 2026-01-17  
**Next Review:** 2026-01-24
