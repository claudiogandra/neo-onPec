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

contextBridge.exposeInMainWorld('modal', {
  update: (callback) => ipcRenderer.on('modal', (callback))
});

contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
});

contextBridge.exposeInMainWorld('data', {
  sync: async () => await ipcRenderer.invoke('sync'),
  fastInfo: () => ipcRenderer.invoke('main-banner:fast-info'),
  blockItems: () => ipcRenderer.invoke('main-banner:block-items'),
  list: async (specs) => await ipcRenderer.invoke('data:list', specs),
  update: async (specs) => await ipcRenderer.invoke('data:update', specs),
  delete: async (specs) => await ipcRenderer.invoke('data:delete', specs),
  count: async (specs) => await ipcRenderer.invoke('data:count', specs)
});

contextBridge.exposeInMainWorld('gadoPesagem', {
  list: async (brinco) => await ipcRenderer.invoke('gadoPesagem:list', brinco),
});

contextBridge.exposeInMainWorld('nav', {
  location: async (page) => await ipcRenderer.invoke('nav', page),
});
