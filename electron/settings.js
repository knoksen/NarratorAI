const ElectronStore = require('electron-store');
const { safeStorage } = require('electron');

// Initialize Store class
const Store = ElectronStore.default || ElectronStore;

// Schema for settings validation
const schema = {
  apiKey: {
    type: 'string',
    default: ''
  },
  theme: {
    type: 'string',
    enum: ['light', 'dark', 'system'],
    default: 'system'
  },
  defaultSavePath: {
    type: 'string',
    default: ''
  },
  language: {
    type: 'string',
    default: 'en'
  },
  autoUpdate: {
    type: 'boolean',
    default: true
  },
  minimizeToTray: {
    type: 'boolean',
    default: true
  },
  launchAtStartup: {
    type: 'boolean',
    default: false
  },
  voice: {
    type: 'object',
    properties: {
      model: {
        type: 'string',
        default: 'gemini-2.5-flash'
      },
      language: {
        type: 'string',
        default: 'en-US'
      }
    },
    default: {
      model: 'gemini-2.5-flash',
      language: 'en-US'
    }
  },
  recentFiles: {
    type: 'array',
    items: {
      type: 'object'
    },
    default: [],
    maxItems: 10
  }
};

// Initialize store with schema
const store = new Store({ schema });

/**
 * Settings Manager
 * Handles all application settings with encryption for sensitive data
 */
class SettingsManager {
  constructor() {
    this.store = store;
  }

  /**
   * Get API key (decrypted if stored encrypted)
   */
  getApiKey() {
    const encrypted = this.store.get('apiKey');
    if (!encrypted) return '';
    
    try {
      // Check if safeStorage is available
      if (safeStorage.isEncryptionAvailable()) {
        const buffer = Buffer.from(encrypted, 'base64');
        return safeStorage.decryptString(buffer);
      }
      // Fallback: stored as plain text (not ideal but backwards compatible)
      return encrypted;
    } catch (error) {
      console.error('Error decrypting API key:', error);
      return '';
    }
  }

  /**
   * Set API key (encrypted)
   */
  setApiKey(apiKey) {
    if (!apiKey) {
      this.store.set('apiKey', '');
      return true;
    }

    try {
      if (safeStorage.isEncryptionAvailable()) {
        const buffer = safeStorage.encryptString(apiKey);
        const encrypted = buffer.toString('base64');
        this.store.set('apiKey', encrypted);
      } else {
        // Fallback: store as plain text with warning
        console.warn('Encryption not available, storing API key as plain text');
        this.store.set('apiKey', apiKey);
      }
      return true;
    } catch (error) {
      console.error('Error encrypting API key:', error);
      return false;
    }
  }

  /**
   * Get theme preference
   */
  getTheme() {
    return this.store.get('theme');
  }

  /**
   * Set theme preference
   */
  setTheme(theme) {
    if (!['light', 'dark', 'system'].includes(theme)) {
      throw new Error('Invalid theme. Must be light, dark, or system.');
    }
    this.store.set('theme', theme);
  }

  /**
   * Get default save path
   */
  getDefaultSavePath() {
    return this.store.get('defaultSavePath');
  }

  /**
   * Set default save path
   */
  setDefaultSavePath(path) {
    this.store.set('defaultSavePath', path);
  }

  /**
   * Get voice settings
   */
  getVoiceSettings() {
    return this.store.get('voice');
  }

  /**
   * Set voice settings
   */
  setVoiceSettings(settings) {
    this.store.set('voice', settings);
  }

  /**
   * Get auto-update preference
   */
  getAutoUpdate() {
    return this.store.get('autoUpdate');
  }

  /**
   * Set auto-update preference
   */
  setAutoUpdate(enabled) {
    this.store.set('autoUpdate', enabled);
  }

  /**
   * Get minimize to tray preference
   */
  getMinimizeToTray() {
    return this.store.get('minimizeToTray');
  }

  /**
   * Set minimize to tray preference
   */
  setMinimizeToTray(enabled) {
    this.store.set('minimizeToTray', enabled);
  }

  /**
   * Get launch at startup preference
   */
  getLaunchAtStartup() {
    return this.store.get('launchAtStartup');
  }

  /**
   * Set launch at startup preference
   */
  setLaunchAtStartup(enabled) {
    this.store.set('launchAtStartup', enabled);
  }

  /**
   * Get recent files list
   */
  getRecentFiles() {
    return this.store.get('recentFiles') || [];
  }

  /**
   * Add file to recent files list
   */
  addRecentFile(file) {
    const recentFiles = this.getRecentFiles();
    
    // Remove if already exists
    const filtered = recentFiles.filter(f => f.path !== file.path);
    
    // Add to beginning
    filtered.unshift({
      path: file.path,
      name: file.name,
      timestamp: Date.now()
    });
    
    // Keep only last 10
    const limited = filtered.slice(0, 10);
    
    this.store.set('recentFiles', limited);
  }

  /**
   * Clear recent files list
   */
  clearRecentFiles() {
    this.store.set('recentFiles', []);
  }

  /**
   * Get all settings
   */
  getAllSettings() {
    return {
      apiKey: this.getApiKey() ? '***' : '', // Masked for security
      theme: this.getTheme(),
      defaultSavePath: this.getDefaultSavePath(),
      voice: this.getVoiceSettings(),
      autoUpdate: this.getAutoUpdate(),
      minimizeToTray: this.getMinimizeToTray(),
      launchAtStartup: this.getLaunchAtStartup(),
      recentFilesCount: this.getRecentFiles().length
    };
  }

  /**
   * Update multiple settings at once
   */
  updateSettings(settings) {
    if (settings.apiKey !== undefined) {
      this.setApiKey(settings.apiKey);
    }
    if (settings.theme) {
      this.setTheme(settings.theme);
    }
    if (settings.defaultSavePath !== undefined) {
      this.setDefaultSavePath(settings.defaultSavePath);
    }
    if (settings.voice) {
      this.setVoiceSettings(settings.voice);
    }
    if (settings.autoUpdate !== undefined) {
      this.setAutoUpdate(settings.autoUpdate);
    }
    if (settings.minimizeToTray !== undefined) {
      this.setMinimizeToTray(settings.minimizeToTray);
    }
    if (settings.launchAtStartup !== undefined) {
      this.setLaunchAtStartup(settings.launchAtStartup);
    }
  }

  /**
   * Reset all settings to defaults
   */
  resetToDefaults() {
    this.store.clear();
  }

  /**
   * Get store file path (for debugging)
   */
  getStorePath() {
    return this.store.path;
  }
}

// Export singleton instance
module.exports = new SettingsManager();
