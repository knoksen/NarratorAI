/**
 * Electron Main Process
 * 
 * This is the main entry point for the Electron desktop application.
 * It creates the browser window and manages the application lifecycle.
 */

const { app, BrowserWindow, ipcMain, dialog, Menu, shell, Tray, nativeImage } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const settings = require('./settings');
const updater = require('./updater');
const BatchProcessor = require('./batch-processor');
const toast = require('./toast-manager');

let mainWindow;
let tray = null;
let settingsWindow = null;
let batchProcessor = null;

// Create application menu
function createMenu() {
  const recentFiles = settings.getRecentFiles();
  
  // Build recent files submenu
  const recentFilesSubmenu = [];
  
  if (recentFiles.length > 0) {
    recentFiles.forEach((file, index) => {
      recentFilesSubmenu.push({
        label: path.basename(file),
        accelerator: index < 9 ? `CmdOrCtrl+${index + 1}` : undefined,
        click: () => {
          if (mainWindow) {
            mainWindow.webContents.send('menu-open-recent-file', file);
          }
        },
        // Show full path in tooltip
        toolTip: file
      });
    });
    
    recentFilesSubmenu.push(
      { type: 'separator' },
      {
        label: 'Clear Recent Files',
        click: () => {
          settings.clearRecentFiles();
          createMenu(); // Refresh menu
        }
      }
    );
  } else {
    recentFilesSubmenu.push({
      label: 'No recent files',
      enabled: false
    });
  }
  
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open PDF...',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            if (mainWindow) {
              mainWindow.webContents.send('menu-open-file');
            }
          }
        },
        {
          label: 'Open Multiple PDFs...',
          accelerator: 'CmdOrCtrl+Shift+O',
          click: async () => {
            const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
              properties: ['openFile', 'multiSelections'],
              filters: [
                { name: 'PDF Files', extensions: ['pdf'] },
                { name: 'All Files', extensions: ['*'] }
              ]
            });
            
            if (!canceled && filePaths.length > 0) {
              mainWindow.webContents.send('menu-open-batch', filePaths);
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Recent Files',
          submenu: recentFilesSubmenu
        },
        { type: 'separator' },
        {
          label: 'Save Audio As...',
          accelerator: 'CmdOrCtrl+S',
          click: async () => {
            if (mainWindow) {
              mainWindow.webContents.send('menu-save-audio');
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'Alt+F4',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Check for Updates...',
          click: async () => {
            try {
              await updater.checkForUpdates(false);
            } catch (error) {
              console.error('Error checking for updates:', error);
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Documentation',
          click: async () => {
            await shell.openExternal('https://github.com/knoksen/NarratorAI');
          }
        },
        {
          label: 'Report Issue',
          click: async () => {
            await shell.openExternal('https://github.com/knoksen/NarratorAI/issues');
          }
        },
        { type: 'separator' },
        {
          label: 'Preferences...',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            createSettingsWindow();
          }
        },
        { type: 'separator' },
        {
          label: 'About NarratorAI',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('show-about');
            }
          }
        }
      ]
    }
  ];

  // Add Developer menu in development
  if (isDev) {
    template.push({
      label: 'Developer',
      submenu: [
        { role: 'toggleDevTools' },
        { type: 'separator' },
        {
          label: 'Clear Storage',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.session.clearStorageData();
              mainWindow.reload();
            }
          }
        }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Create system tray
function createTray() {
  // Create tray icon (use a simple icon for now)
  const icon = nativeImage.createEmpty();
  tray = new Tray(icon);
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show NarratorAI',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      }
    }
  ]);
  
  tray.setToolTip('NarratorAI');
  tray.setContextMenu(contextMenu);
  
  // Restore window on tray icon click
  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.focus();
      } else {
        mainWindow.show();
      }
    }
  });
}

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    backgroundColor: '#F5F3FF',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
    },
    icon: path.join(__dirname, 'icon.png'),
    autoHideMenuBar: false,
    title: 'NarratorAI',
  });

  // Load the app
  const startUrl = isDev
    ? 'http://localhost:9002'
    : `file://${path.join(__dirname, '../out/index.html')}`;

  mainWindow.loadURL(startUrl);

  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Minimize to tray on close (Windows behavior)
  mainWindow.on('close', (event) => {
    if (!app.isQuitting && process.platform === 'win32') {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    require('electron').shell.openExternal(url);
    return { action: 'deny' };
  });
}

// App lifecycle events
app.whenReady().then(() => {
  createMenu();
  createTray();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
  
  // Initialize auto-updater
  updater.setMainWindow(mainWindow);
  updater.startPeriodicCheck();
  
  // Initialize batch processor
  batchProcessor = new BatchProcessor();
  
  // Forward batch processor events to renderer
  batchProcessor.on('queue-updated', (data) => {
    mainWindow.webContents.send('batch:queue-updated', data);
  });
  
  batchProcessor.on('batch-started', (data) => {
    mainWindow.webContents.send('batch:started', data);
  });
  
  batchProcessor.on('batch-paused', (data) => {
    mainWindow.webContents.send('batch:paused', data);
  });
  
  batchProcessor.on('batch-resumed', (data) => {
    mainWindow.webContents.send('batch:resumed', data);
  });
  
  batchProcessor.on('batch-cancelled', (data) => {
    mainWindow.webContents.send('batch:cancelled', data);
  });
  
  batchProcessor.on('batch-completed', (data) => {
    mainWindow.webContents.send('batch:completed', data);
  });
  
  batchProcessor.on('batch-error', (data) => {
    mainWindow.webContents.send('batch:error', data);
  });
  
  batchProcessor.on('item-started', (data) => {
    mainWindow.webContents.send('batch:item-started', data);
  });
  
  batchProcessor.on('item-progress', (data) => {
    mainWindow.webContents.send('batch:item-progress', data);
  });
  
  batchProcessor.on('item-completed', (data) => {
    mainWindow.webContents.send('batch:item-completed', data);
  });
  
  batchProcessor.on('item-failed', (data) => {
    mainWindow.webContents.send('batch:item-failed', data);
  });
  
  batchProcessor.on('batch-reset', () => {
    mainWindow.webContents.send('batch:reset');
  });
});

// Handle quit properly with tray
app.on('before-quit', () => {
  app.isQuitting = true;
  updater.stopPeriodicCheck();
});

app.on('window-all-closed', () => {
  // On Windows, keep app running in tray
  if (process.platform !== 'win32' && process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers for file operations
ipcMain.handle('dialog:openFile', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'PDF Files', extensions: ['pdf'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  
  if (!canceled && filePaths.length > 0) {
    return filePaths[0];
  }
  return null;
});

ipcMain.handle('dialog:saveFile', async (event, defaultFileName) => {
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    defaultPath: defaultFileName || 'narratorai_audio.wav',
    filters: [
      { name: 'Audio Files', extensions: ['wav'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  
  if (!canceled && filePath) {
    return filePath;
  }
  return null;
});

// Handle app info requests
ipcMain.handle('app:getVersion', () => {
  return app.getVersion();
});

ipcMain.handle('app:getPlatform', () => {
  return process.platform;
});

ipcMain.handle('app:getInfo', () => {
  return {
    name: app.getName(),
    version: app.getVersion(),
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node,
    platform: process.platform
  };
});

// Show about dialog
ipcMain.handle('dialog:showAbout', async () => {
  const aboutMessage = `NarratorAI v${app.getVersion()}

Transform documents into engaging audio narratives with AI.

Built with:
• Electron ${process.versions.electron}
• Node.js ${process.versions.node}
• Chrome ${process.versions.chrome}

© 2026 NarratorAI
`;

  await dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'About NarratorAI',
    message: 'NarratorAI',
    detail: aboutMessage,
    buttons: ['OK']
  });
});

// Settings window creation
function createSettingsWindow() {
  // Don't create if already exists
  if (settingsWindow) {
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 600,
    height: 700,
    title: 'Preferences',
    parent: mainWindow,
    modal: true,
    resizable: false,
    minimizable: false,
    maximizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load settings page (we'll create this as a simple HTML file)
  settingsWindow.loadFile(path.join(__dirname, 'settings.html'));

  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });
}

// Settings IPC handlers
ipcMain.handle('settings:getAll', async () => {
  return settings.getAllSettings();
});

ipcMain.handle('settings:get', async (event, key) => {
  const getters = {
    apiKey: () => settings.getApiKey(),
    theme: () => settings.getTheme(),
    defaultSavePath: () => settings.getDefaultSavePath(),
    voice: () => settings.getVoiceSettings(),
    autoUpdate: () => settings.getAutoUpdate(),
    minimizeToTray: () => settings.getMinimizeToTray(),
    launchAtStartup: () => settings.getLaunchAtStartup(),
    recentFiles: () => settings.getRecentFiles()
  };
  
  return getters[key] ? getters[key]() : null;
});

ipcMain.handle('settings:set', async (event, key, value) => {
  const setters = {
    apiKey: (val) => settings.setApiKey(val),
    theme: (val) => settings.setTheme(val),
    defaultSavePath: (val) => settings.setDefaultSavePath(val),
    voice: (val) => settings.setVoiceSettings(val),
    autoUpdate: (val) => settings.setAutoUpdate(val),
    minimizeToTray: (val) => settings.setMinimizeToTray(val),
    launchAtStartup: (val) => settings.setLaunchAtStartup(val)
  };
  
  if (setters[key]) {
    setters[key](value);
    return true;
  }
  return false;
});

ipcMain.handle('settings:update', async (event, newSettings) => {
  settings.updateSettings(newSettings);
  
  // Update auto-updater based on settings
  if (newSettings.autoUpdate !== undefined) {
    if (newSettings.autoUpdate) {
      updater.startPeriodicCheck();
    } else {
      updater.stopPeriodicCheck();
    }
  }
  
  return true;
});

ipcMain.handle('settings:reset', async () => {
  settings.resetToDefaults();
  updater.startPeriodicCheck(); // Re-enable if defaults have it enabled
  return true;
});

ipcMain.handle('settings:selectFolder', async () => {
  const result = await dialog.showOpenDialog(settingsWindow || mainWindow, {
    properties: ['openDirectory']
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

// Recent files management
ipcMain.handle('recentFiles:add', async (event, file) => {
  settings.addRecentFile(file);  createMenu(); // Refresh menu to show updated recent files  return true;
});

ipcMain.handle('recentFiles:get', async () => {
  return settings.getRecentFiles();
});

ipcMain.handle('recentFiles:clear', async () => {
  settings.clearRecentFiles();
  createMenu(); // Refresh menu to clear recent files
  return true;
});
// Updater IPC handlers
ipcMain.handle('updater:check', async () => {
  try {
    const result = await updater.checkForUpdates(false);
    return { success: true, result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('updater:download', async () => {
  try {
    await updater.downloadUpdate();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('updater:install', async () => {
  try {
    updater.quitAndInstall();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('updater:getVersion', async () => {
  return updater.getCurrentVersion();
});

// Batch Processing IPC handlers
ipcMain.handle('batch:addFiles', async (event, filePaths) => {
  if (!batchProcessor) {
    return { error: 'Batch processor not initialized' };
  }
  return batchProcessor.addToQueue(filePaths);
});

ipcMain.handle('batch:removeFile', async (event, itemId) => {
  if (!batchProcessor) {
    return { error: 'Batch processor not initialized' };
  }
  return batchProcessor.removeFromQueue(itemId);
});

ipcMain.handle('batch:clear', async () => {
  if (!batchProcessor) {
    return { error: 'Batch processor not initialized' };
  }
  return batchProcessor.clearQueue();
});

ipcMain.handle('batch:start', async (event, processFunction) => {
  if (!batchProcessor) {
    return { error: 'Batch processor not initialized' };
  }
  
  // Process function is passed as a reference from renderer
  // We'll call the renderer back to process each file
  const processor = async (filePath, progressCallback) => {
    // Send processing request to renderer and wait for result
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Processing timeout'));
      }, 300000); // 5 minute timeout per file
      
      // Listen for result
      const resultHandler = (event, result) => {
        clearTimeout(timeoutId);
        ipcMain.removeListener('batch:process-result', resultHandler);
        
        if (result.success) {
          resolve(result);
        } else {
          reject(new Error(result.error || 'Processing failed'));
        }
      };
      
      ipcMain.on('batch:process-result', resultHandler);
      
      // Send request to renderer
      mainWindow.webContents.send('batch:process-file', {
        filePath,
        progressCallback: (progress) => progressCallback(progress)
      });
    });
  };
  
  return await batchProcessor.start(processor);
});

ipcMain.handle('batch:pause', async () => {
  if (!batchProcessor) {
    return { error: 'Batch processor not initialized' };
  }
  return batchProcessor.pause();
});

ipcMain.handle('batch:resume', async () => {
  if (!batchProcessor) {
    return { error: 'Batch processor not initialized' };
  }
  
  // Same processor as start
  const processor = async (filePath, progressCallback) => {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Processing timeout'));
      }, 300000);
      
      const resultHandler = (event, result) => {
        clearTimeout(timeoutId);
        ipcMain.removeListener('batch:process-result', resultHandler);
        
        if (result.success) {
          resolve(result);
        } else {
          reject(new Error(result.error || 'Processing failed'));
        }
      };
      
      ipcMain.on('batch:process-result', resultHandler);
      mainWindow.webContents.send('batch:process-file', {
        filePath,
        progressCallback: (progress) => progressCallback(progress)
      });
    });
  };
  
  return await batchProcessor.resume(processor);
});

ipcMain.handle('batch:cancel', async () => {
  if (!batchProcessor) {
    return { error: 'Batch processor not initialized' };
  }
  return batchProcessor.cancel();
});

ipcMain.handle('batch:getStatus', async () => {
  if (!batchProcessor) {
    return { error: 'Batch processor not initialized' };
  }
  return batchProcessor.getStatus();
});

ipcMain.handle('batch:getProgress', async () => {
  if (!batchProcessor) {
    return 0;
  }
  return batchProcessor.getOverallProgress();
});

ipcMain.handle('batch:reset', async () => {
  if (!batchProcessor) {
    return { error: 'Batch processor not initialized' };
  }
  batchProcessor.reset();
  return true;
});

// Toast Notification IPC handlers
ipcMain.handle('toast:show', async (event, options) => {
  return toast.show(options);
});

ipcMain.handle('toast:success', async (event, title, body, options) => {
  return toast.success(title, body, options);
});

ipcMain.handle('toast:error', async (event, title, body, options) => {
  return toast.error(title, body, options);
});

ipcMain.handle('toast:warning', async (event, title, body, options) => {
  return toast.warning(title, body, options);
});

ipcMain.handle('toast:info', async (event, title, body, options) => {
  return toast.info(title, body, options);
});

ipcMain.handle('toast:closeAll', async () => {
  toast.closeAll();
  return true;
});

ipcMain.handle('toast:isSupported', async () => {
  return toast.isSupported();
});

// Log app ready
console.log('NarratorAI Desktop App Starting...');
console.log('Development mode:', isDev);
console.log('App version:', app.getVersion());
