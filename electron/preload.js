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
  
  // Batch processing operations
  batch: {
    addFiles: (filePaths) => ipcRenderer.invoke('batch:addFiles', filePaths),
    removeFile: (itemId) => ipcRenderer.invoke('batch:removeFile', itemId),
    clear: () => ipcRenderer.invoke('batch:clear'),
    start: () => ipcRenderer.invoke('batch:start'),
    pause: () => ipcRenderer.invoke('batch:pause'),
    resume: () => ipcRenderer.invoke('batch:resume'),
    cancel: () => ipcRenderer.invoke('batch:cancel'),
    getStatus: () => ipcRenderer.invoke('batch:getStatus'),
    getProgress: () => ipcRenderer.invoke('batch:getProgress'),
    reset: () => ipcRenderer.invoke('batch:reset'),
    
    // Event listeners
    onQueueUpdated: (callback) => ipcRenderer.on('batch:queue-updated', (event, data) => callback(data)),
    onStarted: (callback) => ipcRenderer.on('batch:started', (event, data) => callback(data)),
    onPaused: (callback) => ipcRenderer.on('batch:paused', (event, data) => callback(data)),
    onResumed: (callback) => ipcRenderer.on('batch:resumed', (event, data) => callback(data)),
    onCancelled: (callback) => ipcRenderer.on('batch:cancelled', (event, data) => callback(data)),
    onCompleted: (callback) => ipcRenderer.on('batch:completed', (event, data) => callback(data)),
    onError: (callback) => ipcRenderer.on('batch:error', (event, data) => callback(data)),
    onItemStarted: (callback) => ipcRenderer.on('batch:item-started', (event, data) => callback(data)),
    onItemProgress: (callback) => ipcRenderer.on('batch:item-progress', (event, data) => callback(data)),
    onItemCompleted: (callback) => ipcRenderer.on('batch:item-completed', (event, data) => callback(data)),
    onItemFailed: (callback) => ipcRenderer.on('batch:item-failed', (event, data) => callback(data)),
    onReset: (callback) => ipcRenderer.on('batch:reset', () => callback()),
    
    // File processing callback
    onProcessFile: (callback) => ipcRenderer.on('batch:process-file', (event, data) => callback(data)),
    sendProcessResult: (result) => ipcRenderer.send('batch:process-result', result)
  },
  
  // Menu event listeners
  onMenuOpenFile: (callback) => {
    ipcRenderer.on('menu-open-file', callback);
  },
  onMenuOpenBatch: (callback) => {
    ipcRenderer.on('menu-open-batch', (event, filePaths) => callback(filePaths));
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
