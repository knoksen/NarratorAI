# Security Policy

## 🔒 Reporting Security Vulnerabilities

**Please do not report security vulnerabilities through public GitHub issues.**

We take security seriously. If you discover a security vulnerability in NarratorAI, please report it privately to help us fix it before public disclosure.

### How to Report

1. **Email:** Send details to the repository owner via GitHub
2. **GitHub Security Advisories:** Use the [GitHub Security Advisory](https://github.com/knoksen/NarratorAI/security/advisories/new) feature (preferred)
3. **Include:**
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)
   - Your contact information

### What to Expect

- **Acknowledgment:** Within 48 hours
- **Status Update:** Within 7 days
- **Fix Timeline:** Critical issues within 30 days, others within 90 days
- **Disclosure:** Coordinated disclosure after fix is released
- **Credit:** Public acknowledgment in release notes (if desired)

---

## 🛡️ Supported Versions

| Version | Supported          | Status |
| ------- | ------------------ | ------ |
| 1.0.x   | :white_check_mark: | Latest |
| < 1.0   | :x:                | Not supported |

**Security updates are only provided for the latest stable release.**

---

## 🔐 Security Best Practices

### For Users

1. **API Keys:**
   - Never commit API keys to version control
   - Use environment variables (`.env.local`)
   - Rotate keys periodically
   - Use separate keys for development and production

2. **Downloads:**
   - Download only from official GitHub Releases
   - Verify SHA256 checksums before installation
   - Check digital signatures (when available)

3. **Windows SmartScreen:**
   - Current releases are not code-signed
   - Verify download source before clicking "Run anyway"
   - Check file hash matches published checksum

4. **Updates:**
   - Keep NarratorAI updated to latest version
   - Monitor release notes for security patches
   - Subscribe to repository notifications

### For Developers

1. **Dependencies:**
   - Review security advisories: `npm audit`
   - Update dependencies regularly: `npm update`
   - Use `--legacy-peer-deps` only when necessary

2. **Code:**
   - Validate all user inputs
   - Sanitize file uploads
   - Use TypeScript strict mode
   - Follow secure coding practices

3. **Secrets:**
   - Never commit secrets or API keys
   - Use `.env.local` for local development
   - Use GitHub Secrets for CI/CD
   - Rotate credentials after any exposure

4. **Builds:**
   - Verify build integrity
   - Check for malicious dependencies
   - Review automated build logs
   - Use official build workflows

---

## 🚨 Known Security Considerations

### API Keys

NarratorAI requires a Google AI API key to function. Users are responsible for:
- Securing their API keys
- Monitoring API usage
- Setting usage limits in Google AI Studio
- Revoking compromised keys immediately

**API keys are stored locally and never transmitted to our servers.**

### File Processing

PDF files are processed locally:
- Files are not uploaded to external servers (except Google AI API for enhancement)
- Text content is sent to Google Gemini for AI processing
- Audio generation requires sending text to Google TTS API
- No files are stored on our infrastructure

### Electron Security

The desktop application follows Electron security best practices:
- Context isolation enabled
- Node integration disabled in renderer
- Preload script for secure IPC
- Content Security Policy enforced

### Network Communication

The application communicates with:
- **Google AI API** (ai.google.dev) - For AI enhancement and TTS
- **GitHub** (github.com) - For updates and releases only
- **No analytics or tracking services**

---

## 📊 Dependency Security

### Current Status

We actively monitor dependencies for vulnerabilities:
- Automated checks via GitHub Dependabot
- Regular manual audits
- Prompt updates for security patches

### Checking Dependencies

```bash
# Check for vulnerabilities
npm audit

# View detailed report
npm audit --json

# Fix automatically (if possible)
npm audit fix
```

### High-Risk Dependencies

Dependencies with known issues:
- Check [GitHub Security Advisories](https://github.com/knoksen/NarratorAI/security)
- Review [Dependabot Alerts](https://github.com/knoksen/NarratorAI/security/dependabot)

---

## 🔄 Security Update Process

### Patch Releases

Critical security fixes are released as patch versions:
- **Example:** 1.0.0 → 1.0.1
- **Timeline:** Within 48 hours of discovery
- **Notification:** GitHub Release + Security Advisory

### Version Policy

- **Critical:** Immediate patch release
- **High:** Patch within 7 days
- **Medium:** Included in next minor release
- **Low:** Included in regular update cycle

### Update Notifications

Users are notified via:
1. GitHub Security Advisories (if you "watch" the repo)
2. Release notes with security badges
3. CHANGELOG.md with security annotations

---

## 🛠️ Vulnerability Disclosure Policy

We follow **Coordinated Disclosure**:

1. **Report received** → Private acknowledgment
2. **Verification** → Reproduce and confirm (1-7 days)
3. **Fix development** → Create patch (1-30 days depending on severity)
4. **Testing** → Verify fix works (1-3 days)
5. **Release** → Publish patched version
6. **Disclosure** → Public advisory 7 days after release

### Responsible Disclosure

We request:
- **90 days** for non-critical issues
- **30 days** for critical issues
- Coordination before public disclosure
- No exploitation during research

We commit to:
- Prompt acknowledgment
- Regular status updates
- Credit in release notes
- Coordinated disclosure timeline

---

## 🏆 Security Credits

We thank the following security researchers:

<!-- Add contributors here as they report issues -->
- *No reports yet*

**Want to be listed?** Report a valid security issue!

---

## 📞 Contact

- **Security Issues:** Use [GitHub Security Advisories](https://github.com/knoksen/NarratorAI/security/advisories/new)
- **General Security Questions:** Open a [Discussion](https://github.com/knoksen/NarratorAI/discussions)
- **Repository Owner:** [@knoksen](https://github.com/knoksen)

---

## 📚 Additional Resources

- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Electron Security](https://www.electronjs.org/docs/latest/tutorial/security)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

## 📝 Policy Updates

This security policy may be updated periodically. Check the git history for changes:

```bash
git log -p SECURITY.md
```

**Last Updated:** January 12, 2026  
**Policy Version:** 1.0
