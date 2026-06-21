const { autoUpdater } = require('electron-updater');
const { dialog, BrowserWindow } = require('electron');
const electronIsDev = require('electron-is-dev');
const isDev = typeof electronIsDev === 'boolean' ? electronIsDev : !!electronIsDev.default;
const settings = require('./settings');

/**
 * Auto Update Manager
 * Handles automatic application updates using electron-updater
 */
class AutoUpdateManager {
  constructor() {
    this.mainWindow = null;
    this.updateCheckInterval = null;
    
    // Configure auto-updater
    autoUpdater.autoDownload = false; // Don't download automatically
    autoUpdater.autoInstallOnAppQuit = true;
    
    // Set up update server (GitHub releases)
    autoUpdater.setFeedURL({
      provider: 'github',
      owner: 'knoksen',
      repo: 'NarratorAI'
    });

    this.setupListeners();
  }

  /**
   * Set the main window reference
   */
  setMainWindow(window) {
    this.mainWindow = window;
  }

  /**
   * Setup auto-updater event listeners
   */
  setupListeners() {
    // When update is available
    autoUpdater.on('update-available', (info) => {
      console.log('Update available:', info.version);
      this.notifyUpdateAvailable(info);
    });

    // When update is not available
    autoUpdater.on('update-not-available', (info) => {
      console.log('Update not available. Current version:', info.version);
    });

    // Download progress
    autoUpdater.on('download-progress', (progressObj) => {
      console.log(`Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}%`);
      if (this.mainWindow) {
        this.mainWindow.webContents.send('update-download-progress', {
          percent: Math.round(progressObj.percent),
          transferred: progressObj.transferred,
          total: progressObj.total
        });
      }
    });

    // When update is downloaded
    autoUpdater.on('update-downloaded', (info) => {
      console.log('Update downloaded:', info.version);
      this.notifyUpdateDownloaded(info);
    });

    // Handle errors
    autoUpdater.on('error', (error) => {
      console.error('Auto-updater error:', error);
      // Don't show error dialog for network errors in dev mode
      if (!isDev && this.mainWindow) {
        dialog.showMessageBox(this.mainWindow, {
          type: 'error',
          title: 'Update Error',
          message: 'There was an error checking for updates',
          detail: error.message,
          buttons: ['OK']
        });
      }
    });
  }

  /**
   * Check for updates manually
   */
  async checkForUpdates(silent = false) {
    if (isDev) {
      console.log('Skipping update check in development mode');
      if (!silent && this.mainWindow) {
        await dialog.showMessageBox(this.mainWindow, {
          type: 'info',
          title: 'Development Mode',
          message: 'Update checking is disabled in development mode',
          buttons: ['OK']
        });
      }
      return null;
    }

    try {
      console.log('Checking for updates...');
      const result = await autoUpdater.checkForUpdates();
      
      if (!result.updateInfo.version) {
        if (!silent) {
          await dialog.showMessageBox(this.mainWindow, {
            type: 'info',
            title: 'No Updates',
            message: 'You are using the latest version',
            detail: `Current version: ${result.currentVersion.version}`,
            buttons: ['OK']
          });
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error checking for updates:', error);
      if (!silent) {
        throw error;
      }
      return null;
    }
  }

  /**
   * Notify user about available update
   */
  async notifyUpdateAvailable(info) {
    if (!this.mainWindow) return;

    const response = await dialog.showMessageBox(this.mainWindow, {
      type: 'info',
      title: 'Update Available',
      message: `A new version (${info.version}) is available!`,
      detail: `Current version: ${autoUpdater.currentVersion.version}\n\n` +
              `Release notes:\n${info.releaseNotes || 'No release notes available'}`,
      buttons: ['Download Now', 'Download Later', 'Skip This Version'],
      defaultId: 0,
      cancelId: 1
    });

    if (response.response === 0) {
      // Download now
      this.downloadUpdate();
    } else if (response.response === 2) {
      // Skip this version
      console.log('User skipped version:', info.version);
      // Could implement version skipping logic here
    }
  }

  /**
   * Download update
   */
  async downloadUpdate() {
    try {
      console.log('Downloading update...');
      if (this.mainWindow) {
        this.mainWindow.webContents.send('update-downloading');
      }
      await autoUpdater.downloadUpdate();
    } catch (error) {
      console.error('Error downloading update:', error);
      if (this.mainWindow) {
        await dialog.showMessageBox(this.mainWindow, {
          type: 'error',
          title: 'Download Error',
          message: 'Failed to download update',
          detail: error.message,
          buttons: ['OK']
        });
      }
    }
  }

  /**
   * Notify user that update is downloaded
   */
  async notifyUpdateDownloaded(info) {
    if (!this.mainWindow) return;

    const response = await dialog.showMessageBox(this.mainWindow, {
      type: 'info',
      title: 'Update Ready',
      message: 'Update downloaded successfully!',
      detail: `Version ${info.version} is ready to install.\n\n` +
              `The update will be installed when you restart the application.`,
      buttons: ['Restart Now', 'Later'],
      defaultId: 0,
      cancelId: 1
    });

    if (response.response === 0) {
      // Restart and install
      setImmediate(() => autoUpdater.quitAndInstall());
    }
  }

  /**
   * Start periodic update checks
   */
  startPeriodicCheck() {
    // Check for updates on startup (if enabled in settings)
    if (settings.getAutoUpdate()) {
      // Wait 10 seconds after startup before first check
      setTimeout(() => {
        this.checkForUpdates(true);
      }, 10000);

      // Then check every 12 hours
      this.updateCheckInterval = setInterval(() => {
        this.checkForUpdates(true);
      }, 12 * 60 * 60 * 1000);
    }
  }

  /**
   * Stop periodic update checks
   */
  stopPeriodicCheck() {
    if (this.updateCheckInterval) {
      clearInterval(this.updateCheckInterval);
      this.updateCheckInterval = null;
    }
  }

  /**
   * Get current version
   */
  getCurrentVersion() {
    return autoUpdater.currentVersion.version;
  }

  /**
   * Quit and install update
   */
  quitAndInstall() {
    autoUpdater.quitAndInstall();
  }
}

// Export singleton instance
module.exports = new AutoUpdateManager();
