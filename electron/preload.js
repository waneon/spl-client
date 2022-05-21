const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

contextBridge.exposeInMainWorld('electronAPI', {
  toggleDebug: () => ipcRenderer.send('toggle-debug'),
  refresh: () => ipcRenderer.send('refresh'),
  isDev: () => ipcRenderer.sendSync('get-is-dev'),
  server: () => process.env.SERVER_ADDRESS,
});
