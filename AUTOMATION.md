# 🚀 Release Automation Guide

## Overview

NarratorAI now includes comprehensive automation for building and releasing new versions. This guide covers all automated processes.

---

## 🎯 Quick Start

### Release a New Version

```bash
# Patch release (1.0.0 → 1.0.1)
npm run release -- 1.0.1

# Minor release (1.0.0 → 1.1.0)  
npm run release -- 1.1.0

# Major release (1.0.0 → 2.0.0)
npm run release -- 2.0.0
```

The script automatically:
1. ✅ Validates git status (clean working directory)
2. 🎨 Generates application icons
3. 📦 Builds Next.js production bundle
4. 🖥️ Packages Electron application
5. 🔐 Generates SHA256 checksums
6. 💾 Commits version bump
7. 🚀 Creates GitHub release with assets

---

## 📝 Release Script Options

### Basic Usage
```bash
npm run release -- <version> [options]
```

### Options

**`--draft`** - Create draft release (not published)
```bash
npm run release -- 1.1.0 --draft
```

**`--prerelease`** - Mark as pre-release (beta/alpha)
```bash
npm run release -- 1.1.0-beta.1 --prerelease
```

**`--push`** - Automatically push commits and tags
```bash
npm run release -- 1.1.0 --push
```

**`--skip-build`** - Skip build (use existing dist files)
```bash
npm run release -- 1.1.0 --skip-build
```

**`--skip-git`** - Skip git validation and commits
```bash
npm run release -- 1.1.0 --skip-git
```

### Combined Options
```bash
# Create draft, push when ready
npm run release -- 1.1.0 --draft --push

# Pre-release with auto-push
npm run release -- 2.0.0-beta.1 --prerelease --push

# Quick rebuild without git
npm run release -- 1.0.1 --skip-git
```

---

## 🔄 Version Bump Helpers

### Automatic Version Bumping

```bash
# Patch: 1.0.0 → 1.0.1
npm run version:patch

# Minor: 1.0.0 → 1.1.0
npm run version:minor

# Major: 1.0.0 → 2.0.0
npm run version:major
```

These update `package.json` and `package-lock.json` without git commits.

---

## 🤖 GitHub Actions CI/CD

### Automated Builds (On Every Push)

**Workflow:** `.github/workflows/build.yml`

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main`

**Actions:**
- ✅ Type checking
- ✅ Linting
- ✅ Next.js build
- ✅ Icon generation
- ✅ Electron packaging test
- 📦 Upload build artifacts (7 days)

### Automated Releases

**Workflow:** `.github/workflows/release.yml`

**Triggers:**
1. **Git Tag Push:** Push a tag like `v1.1.0`
2. **Manual Dispatch:** Run from GitHub Actions tab

**Manual Dispatch Options:**
- Version to release
- Draft release checkbox
- Pre-release checkbox

**Actions:**
- 🎨 Generate icons
- 📦 Build Next.js
- 🖥️ Package Electron
- 🔐 Generate SHA256 checksums
- 📝 Create release notes
- 🚀 Publish GitHub release
- 📎 Upload all assets

---

## 📋 Release Workflow Examples

### Example 1: Standard Release

```bash
# 1. Make your changes
git add .
git commit -m "feat: add new feature"

# 2. Run release script
npm run release -- 1.1.0 --push

# 3. Done! Release published automatically
```

### Example 2: Draft Release for Review

```bash
# 1. Create draft release
npm run release -- 1.1.0 --draft

# 2. Review at GitHub releases page
# 3. Edit release notes if needed
# 4. Click "Publish release" when ready
```

### Example 3: Pre-release (Beta)

```bash
# 1. Create beta release
npm run release -- 2.0.0-beta.1 --prerelease --push

# 2. Testers download and test
# 3. Fix issues, repeat with beta.2, beta.3, etc.
# 4. Final release
npm run release -- 2.0.0 --push
```

### Example 4: Hotfix Release

```bash
# 1. Fix critical bug
git checkout -b hotfix/1.0.1
# ... make fixes ...
git commit -m "fix: critical security issue"

# 2. Quick release
npm run release -- 1.0.1 --push

# 3. Merge back to main
git checkout main
git merge hotfix/1.0.1
```

### Example 5: Using GitHub Actions

```bash
# 1. Push tag to trigger release
git tag v1.1.0
git push origin v1.1.0

# 2. GitHub Actions builds and releases automatically
# 3. Check Actions tab for progress
```

**Or use GitHub web interface:**
1. Go to Actions → Release workflow
2. Click "Run workflow"
3. Enter version (e.g., 1.1.0)
4. Select options (draft/prerelease)
5. Click "Run workflow"

---

## 📁 Generated Files

After running the release script:

```
dist/
├── NarratorAI-1.1.0-x64.exe          # Windows installer
├── NarratorAI-1.1.0-Portable.exe     # Portable version
├── SHA256SUMS.txt                     # Checksums for verification
├── RELEASE_NOTES_v1.1.0.md           # Generated release notes
└── win-unpacked/                      # Unpacked app folder
```

---

## 🔐 Checksums Verification

Users can verify downloads:

```powershell
# Windows PowerShell
Get-FileHash NarratorAI-1.1.0-x64.exe -Algorithm SHA256

# Compare with SHA256SUMS.txt
```

```bash
# Linux/Mac
sha256sum NarratorAI-1.1.0-x64.exe

# Compare with SHA256SUMS.txt
```

---

## 🐛 Troubleshooting

### "Working directory is not clean"
```bash
# Check what's uncommitted
git status

# Commit or stash changes
git add .
git commit -m "your message"

# Or use --skip-git to bypass
npm run release -- 1.1.0 --skip-git
```

### "GitHub CLI not authenticated"
```bash
# Login to GitHub CLI
gh auth login

# Or set GITHUB_TOKEN environment variable
$env:GITHUB_TOKEN = "your-token"
```

### Build fails
```bash
# Clean build
rm -rf dist .next node_modules
npm install --legacy-peer-deps
npm run build:win

# Then try release again
npm run release -- 1.1.0 --skip-build
```

### Release already exists
```bash
# Delete existing release
gh release delete v1.1.0

# Delete tag locally and remotely
git tag -d v1.1.0
git push origin :refs/tags/v1.1.0

# Try again
npm run release -- 1.1.0
```

---

## 📊 Release Checklist

Before releasing, ensure:

- [ ] All tests pass
- [ ] Type checking passes (`npm run typecheck`)
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version number follows semantic versioning
- [ ] Git working directory is clean
- [ ] GitHub CLI authenticated
- [ ] API keys work in production build

---

## 🎯 Best Practices

1. **Semantic Versioning**
   - **Patch (1.0.x):** Bug fixes, minor changes
   - **Minor (1.x.0):** New features, backward compatible
   - **Major (x.0.0):** Breaking changes

2. **Release Notes**
   - Edit generated release notes before publishing
   - Add "What's New" section with key features
   - Link to relevant issues/PRs
   - Include migration guide for breaking changes

3. **Testing**
   - Test draft releases before publishing
   - Use pre-releases for beta testing
   - Verify installers on clean Windows systems

4. **Communication**
   - Announce releases in README
   - Update documentation
   - Post on social media/blog

---

## 🔗 Related Scripts

```bash
# Icon generation
npm run icon:generate      # Generate PNG icon
npm run icon:ico          # Generate ICO icon
npm run icon:check        # Check icon status

# Building
npm run build             # Next.js only
npm run build:win         # Full Windows build
npm run build:portable    # Portable version only
npm run pack              # Unpacked build (testing)

# Development
npm run dev               # Next.js dev server
npm run electron:dev      # Run desktop app in dev mode

# Quality
npm run typecheck         # TypeScript validation
npm run lint              # Code linting
npm run test:flows        # Test AI flows
```

---

## 📚 Additional Resources

- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [electron-builder Configuration](https://www.electron.build/)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [GitHub Actions](https://docs.github.com/en/actions)

---

**Happy Releasing! 🚀**
