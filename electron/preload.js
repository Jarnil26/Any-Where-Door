const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  simulateInput: (data) => ipcRenderer.send('simulate-input', data),
});
