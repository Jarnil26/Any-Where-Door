const { app, BrowserWindow, ipcMain, screen, desktopCapturer } = require('electron');
const path = require('path');
const robot = require('robotjs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    title: 'ANYWhere - Host Dashboard',
    autoHideMenuBar: true,
    backgroundColor: '#0f172a'
  });

  // Since it's Vercel-hosted, we'll load the Vercel URL or the local build
  // For development, load localhost:5173 (Vite). For production, the user would point to their Vercel URL.
  win.loadURL('http://localhost:5173'); 
}

app.whenReady().then(createWindow);

// --- INPUT SIMULATION HANDLERS ---
ipcMain.on('simulate-input', (event, data) => {
  const { type, x, y, button, key } = data;
  const screenSize = robot.getScreenSize();

  if (type === 'mousemove') {
    robot.moveMouse(x * screenSize.width, y * screenSize.height);
  } else if (type === 'mousedown') {
    robot.mouseClick(button === 2 ? 'right' : 'left');
  } else if (type === 'keydown') {
    // Basic key mapping
    try { robot.keyTap(key.toLowerCase()); } catch(e) {}
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
