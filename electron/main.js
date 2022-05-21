const { ipcMain, app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    width: 1280,
    height: 720,
  });
  mainWindow.removeMenu();

  if (!app.isPackaged) {
    mainWindow.loadURL('http://localhost:8000');
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// support dev tools
if (!app.isPackaged) {
  ipcMain.on('toggle-debug', () => {
    mainWindow.webContents.toggleDevTools();
  });

  ipcMain.on('refresh', () => {
    mainWindow.reload();
  });
}

ipcMain.on('get-is-dev', (event) => {
  event.returnValue = !app.isPackaged;
});