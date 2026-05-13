const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('garmentPro', {
  apiBase: 'http://localhost:4521/api',
  onShortcut: (handler) => ipcRenderer.on('shortcut', (_, key) => handler(key)),
  openPath: (filePath) => ipcRenderer.invoke('open-path', filePath)
});
