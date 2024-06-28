require('dotenv').config();
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('api', {
  introLog: (callback) => ipcRenderer.on('introLog', (callback))
});

contextBridge.exposeInMainWorld('versions', {
  onPec: () => (process.env.ONPEC == 'DEV' || process.env.ONPEC == 'LOCAL') 
    ? `${process.env.APP_VERSION} - DEV` 
    : `${process.env.APP_VERSION} - PROD` ,
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
});
