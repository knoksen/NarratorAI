/**
 * Electron Preload Script
 * 
 * This script runs in the renderer process before web content begins loading.
 * It safely exposes Electron APIs to the renderer process.
 */

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  // Dialog operations
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveFile: (defaultFileName) => ipcRenderer.invoke('dialog:saveFile', defaultFileName),
  showAbout: () => ipcRenderer.invoke('dialog:showAbout'),
  
  // App information
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
  getPlatform: () => ipcRenderer.invoke('app:getPlatform'),
  getInfo: () => ipcRenderer.invoke('app:getInfo'),
  
  // Settings operations
  settings: {
    getAll: () => ipcRenderer.invoke('settings:getAll'),
    get: (key) => ipcRenderer.invoke('settings:get', key),
    set: (key, value) => ipcRenderer.invoke('settings:set', key, value),
    update: (settings) => ipcRenderer.invoke('settings:update', settings),
    reset: () => ipcRenderer.invoke('settings:reset'),
    selectFolder: () => ipcRenderer.invoke('settings:selectFolder')
  },
  
  // Recent files operations
  recentFiles: {
    add: (file) => ipcRenderer.invoke('recentFiles:add', file),
    get: () => ipcRenderer.invoke('recentFiles:get'),
    clear: () => ipcRenderer.invoke('recentFiles:clear')
  },
  
  // Updater operations
  updater: {
    check: () => ipcRenderer.invoke('updater:check'),
    download: () => ipcRenderer.invoke('updater:download'),
    install: () => ipcRenderer.invoke('updater:install'),
    getVersion: () => ipcRenderer.invoke('updater:getVersion')
  },
  
  // Menu event listeners
  onMenuOpenFile: (callback) => {
    ipcRenderer.on('menu-open-file', callback);
  },
  onMenuSaveAudio: (callback) => {
    ipcRenderer.on('menu-save-audio', callback);
  },
  onShowAbout: (callback) => {
    ipcRenderer.on('show-about', callback);
  },
  
  // Remove listeners
  removeListener: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },
  
  // Check if running in Electron
  isElectron: true,
});

console.log('Electron preload script loaded');
