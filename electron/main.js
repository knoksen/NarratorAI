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

let mainWindow;
let tray = null;
let settingsWindow = null;

// Create application menu
function createMenu() {
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
});

// Handle quit properly with tray
app.on('before-quit', () => {
  app.isQuitting = true;
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
  return true;
});

ipcMain.handle('settings:reset', async () => {
  settings.resetToDefaults();
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
  settings.addRecentFile(file);
  return true;
});

ipcMain.handle('recentFiles:get', async () => {
  return settings.getRecentFiles();
});

ipcMain.handle('recentFiles:clear', async () => {
  settings.clearRecentFiles();
  return true;
});

// Log app ready
console.log('NarratorAI Desktop App Starting...');
console.log('Development mode:', isDev);
console.log('App version:', app.getVersion());
