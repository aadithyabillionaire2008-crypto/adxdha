const { app, BrowserWindow, ipcMain, globalShortcut, shell } = require('electron');
const path = require('path');
const log = require('electron-log');
const { fork } = require('child_process');

let apiProcess;
function startApi() {
  const serverPath = path.join(__dirname, '..', 'backend', 'server.js');
  apiProcess = fork(serverPath, [], { env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' }, stdio: 'pipe' });
  apiProcess.stdout?.on('data', d => log.info(`[api] ${d}`));
  apiProcess.stderr?.on('data', d => log.error(`[api] ${d}`));
}
function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1100,
    minHeight: 720,
    title: 'GarmentPro ERP',
    backgroundColor: '#0f172a',
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false }
  });
  const url = process.env.NODE_ENV === 'production'
    ? `file://${path.join(__dirname, '..', 'dist', 'index.html')}`
    : 'http://localhost:5173';
  win.loadURL(url);
  globalShortcut.register('CommandOrControl+B', () => win.webContents.send('shortcut', 'billing'));
  globalShortcut.register('CommandOrControl+I', () => win.webContents.send('shortcut', 'invoice'));
  globalShortcut.register('CommandOrControl+F', () => win.webContents.send('shortcut', 'search'));
}
app.whenReady().then(() => { startApi(); createWindow(); });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('will-quit', () => { globalShortcut.unregisterAll(); apiProcess?.kill(); });
ipcMain.handle('open-path', (_, filePath) => shell.openPath(filePath));
