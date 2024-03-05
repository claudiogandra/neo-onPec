const { BrowserWindow, nativeTheme } = require('electron');
const path = require('node:path');

const mainWin = async () => {
  // Criar janela de navegacao
  nativeTheme.themeSource = 'dark';
  const win = new BrowserWindow({
    show: false,
    width: 1600,
    minWidth: 480,
    height: 900,
    minHeight: 480,
    titleBarOverlay: {
      color: '#2f3241',
      symbolColor: '#74b1be',
      height: 40,
    },
    webPreferences: {
      sandbox: false,
      preload: path.join(__dirname, 'pre.js'),
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: true,
      devTools: true
    }
  })

  win.loadFile(path.join(__dirname, '../app/index.html'),);

  win.once('ready-to-show', async () => {
    try {
      win.show();
      
    } catch(error) {
      console.log(error);
      app.quit();
    }
  })
};

const splashWin = () => {
  // Criar janela de navegacao
  const win = new BrowserWindow({
    width: 400,
    height: 400,
    transparent: true,
    autoHideMenuBar: true,
    show: false,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    webPreferences: {
      sandbox: false,
      preload: path.join(__dirname, 'splash.js'),
      nodeIntegration: true,
      devTools: false
    }
  })

  win.loadFile('splash.html');
};

const currentWin = () => {
  return BrowserWindow.getAllWindows().length === 0
}

module.exports = { mainWin, splashWin, currentWin };
