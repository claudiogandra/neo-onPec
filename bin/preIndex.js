require('dotenv').config();
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('versions', {
  onPec: () => (process.env.ONPEC == 'DEV') 
    ? 'Desenvolvimento' 
    : 'Produção',
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
});

contextBridge.exposeInMainWorld('data', {
  sync: async () => await ipcRenderer.invoke('sync'),
});

contextBridge.exposeInMainWorld('gadoPesagem', {
  list: async (brinco) => await ipcRenderer.invoke('gadoPesagem:list', brinco),
});

contextBridge.exposeInMainWorld('nav', {
  list: async (page) => await ipcRenderer.invoke('nav', page),
});
