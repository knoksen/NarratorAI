const { app, BrowserWindow } = require('electron');
const path = require('path');
app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: path.join(__dirname, 'electron', 'preload.js'),
      webSecurity: true
    }
  });
  win.loadURL('http://localhost:9002');
  win.webContents.openDevTools();
});
