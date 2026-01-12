/**
 * Automated Release Script for NarratorAI
 * 
 * This script automates the entire release process:
 * 1. Validates git status (clean working directory)
 * 2. Generates icons (PNG and ICO)
 * 3. Builds Next.js production bundle
 * 4. Packages Electron application
 * 5. Generates SHA256 checksums
 * 6. Creates GitHub release with assets
 * 7. Updates changelog
 * 
 * Usage:
 *   npm run release -- <version> [options]
 * 
 * Examples:
 *   npm run release -- 1.1.0
 *   npm run release -- 1.1.0 --draft
 *   npm run release -- 1.1.0 --prerelease
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ANSI colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command, options = {}) {
  try {
    return execSync(command, {
      stdio: options.silent ? 'pipe' : 'inherit',
      encoding: 'utf-8',
      ...options,
    });
  } catch (error) {
    if (!options.ignoreError) {
      log(`\n❌ Command failed: ${command}`, 'red');
      process.exit(1);
    }
    return null;
  }
}

function getPackageVersion() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  return packageJson.version;
}

function updatePackageVersion(version) {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  packageJson.version = version;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  log(`✓ Updated package.json version to ${version}`, 'green');
}

function validateGitStatus() {
  log('\n🔍 Validating git status...', 'cyan');
  
  const status = exec('git status --porcelain', { silent: true });
  if (status && status.trim()) {
    log('❌ Working directory is not clean. Please commit or stash changes.', 'red');
    log('\nUncommitted changes:', 'yellow');
    console.log(status);
    process.exit(1);
  }
  
  log('✓ Git working directory is clean', 'green');
}

function generateIcons() {
  log('\n🎨 Generating application icons...', 'cyan');
  
  // Generate PNG icon
  exec('node scripts/create-icon.js');
  
  // Generate ICO icon
  exec('node scripts/create-icon-ico.js');
  
  log('✓ Icons generated successfully', 'green');
}

function buildApplication() {
  log('\n🔨 Building application...', 'cyan');
  
  log('  📦 Building Next.js production bundle...', 'blue');
  exec('npm run build');
  
  log('  🖥️  Packaging Electron application...', 'blue');
  exec('npx electron-builder --win');
  
  log('✓ Application built successfully', 'green');
}

function generateChecksums() {
  log('\n🔐 Generating SHA256 checksums...', 'cyan');
  
  const distPath = path.join(process.cwd(), 'dist');
  const exeFiles = fs.readdirSync(distPath).filter(f => f.endsWith('.exe'));
  
  const checksums = {};
  
  for (const file of exeFiles) {
    const filePath = path.join(distPath, file);
    const fileBuffer = fs.readFileSync(filePath);
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex').toUpperCase();
    const sizeMB = (fs.statSync(filePath).size / (1024 * 1024)).toFixed(2);
    
    checksums[file] = { hash, sizeMB };
    log(`  ✓ ${file}: ${hash}`, 'green');
  }
  
  // Save checksums to file
  const checksumsPath = path.join(distPath, 'SHA256SUMS.txt');
  const checksumsContent = Object.entries(checksums)
    .map(([file, { hash }]) => `${hash}  ${file}`)
    .join('\n') + '\n';
  
  fs.writeFileSync(checksumsPath, checksumsContent);
  log(`✓ Checksums saved to dist/SHA256SUMS.txt`, 'green');
  
  return checksums;
}

function createReleaseNotes(version, checksums) {
  log('\n📝 Generating release notes...', 'cyan');
  
  const exeFiles = Object.keys(checksums);
  const installerFile = exeFiles.find(f => f.includes('-x64.exe') && !f.includes('Portable'));
  const portableFile = exeFiles.find(f => f.includes('Portable'));
  
  const notes = `## 🚀 NarratorAI v${version}

### 📦 Downloads

**Windows Installer (Recommended)** - ${checksums[installerFile].sizeMB} MB
- SHA256: \`${checksums[installerFile].hash}\`

**Portable Version** - ${checksums[portableFile].sizeMB} MB
- SHA256: \`${checksums[portableFile].hash}\`

### ✨ What's New

<!-- Add your release notes here -->

### 🚀 Getting Started

1. Download your preferred version
2. Get a free API key: https://makersuite.google.com/app/apikey
3. Run NarratorAI and enter your API key
4. Upload a PDF and start creating!

### ⚠️ Windows SmartScreen Warning

App is not code-signed. Click "More info" → "Run anyway"

### 📖 Documentation

- [README](https://github.com/knoksen/NarratorAI/blob/main/README.md)
- [Desktop Features](https://github.com/knoksen/NarratorAI/blob/main/DESKTOP_FEATURES.md)
- [Build Guide](https://github.com/knoksen/NarratorAI/blob/main/BUILD_GUIDE.md)

---

**Full Changelog**: https://github.com/knoksen/NarratorAI/compare/v${getPreviousVersion(version)}...v${version}
`;

  const notesPath = path.join(process.cwd(), 'dist', `RELEASE_NOTES_v${version}.md`);
  fs.writeFileSync(notesPath, notes);
  
  log(`✓ Release notes generated: dist/RELEASE_NOTES_v${version}.md`, 'green');
  return notesPath;
}

function getPreviousVersion(currentVersion) {
  const tags = exec('git tag --sort=-version:refname', { silent: true });
  const tagList = tags ? tags.trim().split('\n') : [];
  return tagList.length > 0 ? tagList[0].replace('v', '') : '0.0.0';
}

function createGitHubRelease(version, isDraft, isPrerelease, notesPath) {
  log('\n🚀 Creating GitHub release...', 'cyan');
  
  const tag = `v${version}`;
  const title = `NarratorAI v${version}${isPrerelease ? ' (Pre-release)' : ''}`;
  
  let command = `gh release create ${tag} --repo knoksen/NarratorAI --title "${title}" --notes-file "${notesPath}"`;
  
  if (isDraft) {
    command += ' --draft';
    log('  📝 Creating as draft release', 'yellow');
  }
  
  if (isPrerelease) {
    command += ' --prerelease';
    log('  ⚠️  Creating as pre-release', 'yellow');
  } else if (!isDraft) {
    command += ' --latest';
  }
  
  // Add assets
  const distPath = path.join(process.cwd(), 'dist');
  const exeFiles = fs.readdirSync(distPath).filter(f => f.endsWith('.exe'));
  
  for (const file of exeFiles) {
    const label = file.includes('Portable') ? 'Portable Version' : 'Windows Installer';
    command += ` "dist/${file}#${label}"`;
  }
  
  // Add checksums file
  command += ' "dist/SHA256SUMS.txt#SHA256 Checksums"';
  
  exec(command);
  
  log(`✓ GitHub release created: https://github.com/knoksen/NarratorAI/releases/tag/${tag}`, 'green');
}

function commitVersionBump(version) {
  log('\n💾 Committing version bump...', 'cyan');
  
  exec('git add package.json package-lock.json');
  exec(`git commit -m "chore: bump version to ${version}"`);
  exec(`git tag v${version}`);
  
  log('✓ Version bump committed and tagged', 'green');
  
  const shouldPush = process.argv.includes('--push');
  if (shouldPush) {
    log('\n📤 Pushing to remote...', 'cyan');
    exec('git push');
    exec('git push --tags');
    log('✓ Changes pushed to remote', 'green');
  } else {
    log('\n⚠️  Changes committed locally. Run with --push to push to remote.', 'yellow');
  }
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    log('\n📦 NarratorAI Release Script\n', 'bright');
    log('Usage: npm run release -- <version> [options]\n');
    log('Options:');
    log('  --draft        Create draft release');
    log('  --prerelease   Mark as pre-release');
    log('  --push         Push commits and tags to remote');
    log('  --skip-build   Skip build step (use existing dist files)');
    log('  --skip-git     Skip git validation\n');
    log('Examples:');
    log('  npm run release -- 1.1.0');
    log('  npm run release -- 1.1.0 --draft --push');
    log('  npm run release -- 1.1.0 --prerelease\n');
    process.exit(0);
  }
  
  const version = args[0];
  const isDraft = args.includes('--draft');
  const isPrerelease = args.includes('--prerelease');
  const skipBuild = args.includes('--skip-build');
  const skipGit = args.includes('--skip-git');
  
  if (!/^\d+\.\d+\.\d+$/.test(version)) {
    log('❌ Invalid version format. Use semantic versioning (e.g., 1.0.0)', 'red');
    process.exit(1);
  }
  
  log('\n╔════════════════════════════════════════╗', 'bright');
  log(`║  NarratorAI Release Script v${version}  ║`, 'bright');
  log('╚════════════════════════════════════════╝\n', 'bright');
  
  const startTime = Date.now();
  
  try {
    // Step 1: Validate git status
    if (!skipGit) {
      validateGitStatus();
    }
    
    // Step 2: Update version
    updatePackageVersion(version);
    
    // Step 3: Generate icons
    generateIcons();
    
    // Step 4: Build application
    if (!skipBuild) {
      buildApplication();
    } else {
      log('\n⏭️  Skipping build step', 'yellow');
    }
    
    // Step 5: Generate checksums
    const checksums = generateChecksums();
    
    // Step 6: Create release notes
    const notesPath = createReleaseNotes(version, checksums);
    
    // Step 7: Commit version bump
    if (!skipGit) {
      commitVersionBump(version);
    }
    
    // Step 8: Create GitHub release
    createGitHubRelease(version, isDraft, isPrerelease, notesPath);
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    
    log('\n╔════════════════════════════════════════╗', 'green');
    log('║     ✅ Release Completed Successfully!   ║', 'green');
    log('╚════════════════════════════════════════╝\n', 'green');
    
    log(`⏱️  Total time: ${duration}s`, 'cyan');
    log(`📦 Version: ${version}`, 'cyan');
    log(`🔗 Release: https://github.com/knoksen/NarratorAI/releases/tag/v${version}`, 'cyan');
    
  } catch (error) {
    log('\n❌ Release failed!', 'red');
    console.error(error);
    process.exit(1);
  }
}

main();
